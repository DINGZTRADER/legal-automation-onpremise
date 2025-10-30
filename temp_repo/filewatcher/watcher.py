import os, sys, time, json, queue, threading, traceback, random, signal
from dataclasses import dataclass
from typing import Dict, Tuple
import requests

# -------- Config (env-driven) --------
WATCHED = os.getenv("WATCHED_FOLDER", "/data/watched")
API_URL = os.getenv("API_URL", "http://api:8000")
POST_URL = f"{API_URL}/api/risk/scan"
SUPPORTED = {".pdf", ".docx", ".txt", ".png", ".jpg", ".jpeg"}
IGNORE_DIRS = {"_reports"}  # never process generated results
STABILITY_CHECKS = int(os.getenv("STABILITY_CHECKS", "3"))    # stable n checks
STABILITY_INTERVAL = float(os.getenv("STABILITY_INTERVAL", "0.8"))  # seconds between checks
MAX_WORKERS = int(os.getenv("WATCHER_WORKERS", "3"))
RETRY_MAX = int(os.getenv("RETRY_MAX", "8"))
RETRY_BASE = float(os.getenv("RETRY_BASE", "0.8"))
RETRY_CAP = float(os.getenv("RETRY_CAP", "8.0"))

# Use PollingObserver for NTFS reliability
from watchdog.events import FileSystemEventHandler
from watchdog.observers.polling import PollingObserver as Observer

def log(level, msg, **kv):
    rec = {"ts": round(time.time(), 3), "level": level, "msg": msg}
    if kv: rec.update(kv)
    print(json.dumps(rec, ensure_ascii=False), flush=True)

def is_temp_or_hidden(name: str) -> bool:
    n = os.path.basename(name)
    if not n: return True
    if n.startswith("."): return True
    if n.endswith("~"): return True
    # Office temp files like ~$foo.docx
    if n.startswith("~$"): return True
    return False

def path_supported(path: str) -> bool:
    ext = os.path.splitext(path)[1].lower()
    return ext in SUPPORTED

def under_ignored_dir(path: str) -> bool:
    # e.g., /data/watched/_reports/...
    rel = os.path.relpath(path, WATCHED)
    parts = rel.split(os.sep)
    return any(p in IGNORE_DIRS for p in parts if p and p != ".")

def wait_until_stable(path: str) -> bool:
    """
    Ensure file size is stable across N checks.
    Returns True if stable; False if file is gone or not stable after grace.
    """
    last_size = -1
    stable_count = 0
    for _ in range(STABILITY_CHECKS * 4):  # give some extra attempts overall
        try:
            st = os.stat(path)
            size = st.st_size
        except FileNotFoundError:
            return False
        if size > 0 and size == last_size:
            stable_count += 1
            if stable_count >= STABILITY_CHECKS:
                return True
        else:
            stable_count = 0
        last_size = size
        time.sleep(STABILITY_INTERVAL)
    return False

def post_with_retry(file_path: str):
    delay = RETRY_BASE
    for attempt in range(1, RETRY_MAX + 1):
        try:
            r = requests.post(POST_URL, data={"file_path": file_path, "reanalyze": "false"}, timeout=30)
            log("info", "post_ok", code=r.status_code, path=file_path, body=(r.text[:200] if r.text else ""))
            return True
        except Exception as e:
            if attempt == RETRY_MAX:
                log("error", "post_failed", attempt=attempt, path=file_path, err=str(e))
                return False
            jitter = random.uniform(0, 0.3)
            log("warn", "api_not_ready_retry", attempt=attempt, wait=round(delay+jitter,2), path=file_path)
            time.sleep(min(RETRY_CAP, delay + jitter))
            delay = min(RETRY_CAP, delay * 1.8)

# LRU-ish cache by path -> (mtime, size)
class SeenCache:
    def __init__(self, max_items=4096):
        self.max = max_items
        self.data: Dict[str, Tuple[float, int]] = {}

    def is_duplicate(self, path: str) -> bool:
        try:
            st = os.stat(path)
        except FileNotFoundError:
            return True
        key = (st.st_mtime, st.st_size)
        prev = self.data.get(path)
        if prev == key:
            return True
        self.data[path] = key
        if len(self.data) > self.max:
            # drop ~25% arbitrarily to cap memory
            for i, k in enumerate(list(self.data.keys())):
                if i % 4 == 0: self.data.pop(k, None)
        return False

seen = SeenCache()
workq: "queue.Queue[str]" = queue.Queue()
stop_event = threading.Event()

def worker_loop(idx: int):
    while not stop_event.is_set():
        try:
            path = workq.get(timeout=0.5)
        except queue.Empty:
            continue
        try:
            if is_temp_or_hidden(path) or under_ignored_dir(path) or not path_supported(path):
                log("debug", "skip_file", worker=idx, path=path)
            else:
                if seen.is_duplicate(path):
                    log("debug", "dupe_skip", worker=idx, path=path)
                else:
                    if wait_until_stable(path):
                        ok = post_with_retry(path)
                        if not ok:
                            log("error", "give_up", worker=idx, path=path)
                    else:
                        log("warn", "unstable_file_skip", worker=idx, path=path)
        except Exception as e:
            log("error", "worker_error", worker=idx, path=path, err=str(e))
            traceback.print_exc()
        finally:
            workq.task_done()

class Handler(FileSystemEventHandler):
    def _enqueue(self, path: str):
        try:
            if not os.path.isabs(path):
                path = os.path.abspath(path)
        except Exception:
            pass
        workq.put(path)

    def on_created(self, event):
        if not event.is_directory:
            self._enqueue(event.src_path)

    def on_modified(self, event):
        if not event.is_directory:
            self._enqueue(event.src_path)

def startup_sweep(root: str):
    for r, dirs, files in os.walk(root):
        # remove ignored dirs from recursion
        dirs[:] = [d for d in dirs if d not in IGNORE_DIRS and not d.startswith(".")]
        for f in files:
            p = os.path.join(r, f)
            if is_temp_or_hidden(f) or under_ignored_dir(p) or not path_supported(p):
                continue
            workq.put(p)
            log("info", "startup_queue", path=p)

def main():
    os.makedirs(WATCHED, exist_ok=True)
    log("info", "watch_start", watched=WATCHED, api=API_URL)

    # queue existing files
    startup_sweep(WATCHED)

    # start workers
    threads = []
    for i in range(MAX_WORKERS):
        t = threading.Thread(target=worker_loop, args=(i,), daemon=True)
        t.start()
        threads.append(t)

    # start observer
    obs = Observer(timeout=1.0)
    handler = Handler()
    obs.schedule(handler, WATCHED, recursive=True)
    obs.start()

    def shutdown(*_):
        stop_event.set()
        try:
            obs.stop()
            obs.join(timeout=2)
        except Exception:
            pass

    signal.signal(signal.SIGINT, lambda *_: shutdown())
    signal.signal(signal.SIGTERM, lambda *_: shutdown())

    try:
        while not stop_event.is_set():
            time.sleep(0.5)
    finally:
        shutdown()
        # drain queue briefly
        end = time.time() + 3
        while time.time() < end and not workq.empty():
            time.sleep(0.1)
        log("info", "watch_stop")

if __name__ == "__main__":
    try:
        main()
    except Exception as e:
        log("fatal", "watch_crash", err=str(e))
        traceback.print_exc()
        sys.exit(1)
