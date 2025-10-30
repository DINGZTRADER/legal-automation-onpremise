from fastapi import APIRouter, Body, UploadFile, File, Form, HTTPException
from typing import List, Optional, Dict, Any
import os, json, uuid, shutil
import google.generativeai as genai
from pathlib import Path
import httpx

API_ROUTER = APIRouter(prefix="/api/ui", tags=["ui"])

WATCHED_FOLDER = os.getenv("WATCHED_FOLDER", "/data/watched")
API_BASE = os.getenv("API_BASE", "http://localhost:8000")  # for self-calls inside container use http://api:8000
POST_TO_SELF = os.getenv("POST_TO_SELF", "http://api:8000")

MASTER_SYSTEM_PROMPT = """
[MASTER SYSTEM PROMPT REDACTED FOR BREVITY IN CODE]
You are “Butagira Legal Ops AI,” an on-prem assistant ... (use the prompt I provided earlier).
IMPORTANT: Always produce TWO outputs: (1) Human Brief (Markdown) and (2) JSON object on a single line with fields:
{ "overall_grade": "...", "summary": "...", "findings": [...], "lawyerFinalConclusion": null }
Never include extra commentary before/after the JSON line.
"""

def _init_gemini():
    api_key = os.getenv("GOOGLE_API_KEY") or os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise RuntimeError("Missing GOOGLE_API_KEY or GEMINI_API_KEY")
    genai.configure(api_key=api_key)
    return genai.GenerativeModel("gemini-2.0-flash-exp")  # fast + cost-effective; change if you want Pro/Thinking

async def _post_scan_raw_json(payload: Dict[str, Any]) -> Dict[str, Any]:
    async with httpx.AsyncClient(timeout=60) as c:
        r = await c.post(f"{POST_TO_SELF}/api/risk/scan", json={"raw_json": payload})
        r.raise_for_status()
        return r.json()

def _save_upload_to_watched(upload: UploadFile) -> str:
    target_dir = Path(WATCHED_FOLDER)
    target_dir.mkdir(parents=True, exist_ok=True)
    out_path = target_dir / upload.filename
    with out_path.open("wb") as f:
        shutil.copyfileobj(upload.file, f)
    return str(out_path)

@API_ROUTER.get("/folder")
def list_folder() -> Dict[str, Any]:
    p = Path(WATCHED_FOLDER)
    p.mkdir(parents=True, exist_ok=True)
    files = sorted([f.name for f in p.glob("*") if f.is_file()])
    return {"folder": str(p), "files": files}

@API_ROUTER.get("/reports")
def list_reports() -> Dict[str, Any]:
    rep = Path(WATCHED_FOLDER) / "_reports"
    rep.mkdir(parents=True, exist_ok=True)
    files = sorted([f.name for f in rep.glob("*.json")])
    return {"reports": files}

@API_ROUTER.get("/report/{rid}")
def get_report(rid: str) -> Dict[str, Any]:
    rep = Path(WATCHED_FOLDER) / "_reports" / f"{rid}.json"
    if not rep.exists():
        raise HTTPException(404, "not_found")
    return json.loads(rep.read_text(encoding="utf-8"))

@API_ROUTER.post("/finalize")
async def finalize_report(report_id: str = Form(...), final_conclusion: str = Form(...)) -> Dict[str, Any]:
    async with httpx.AsyncClient(timeout=30) as c:
        r = await c.post(f"{POST_TO_SELF}/api/risk/finalize",
                         json={"report_id": report_id, "lawyer_final_conclusion": final_conclusion})
        if r.status_code == 404:
            raise HTTPException(404, "not_found")
        r.raise_for_status()
        return r.json()

@API_ROUTER.post("/scan-file")
async def scan_file(filename: str = Form(...)) -> Dict[str, Any]:
    # triggers your existing analyzer using file path inside container
    file_path = str(Path(WATCHED_FOLDER) / filename)
    async with httpx.AsyncClient(timeout=120) as c:
        r = await c.post(f"{POST_TO_SELF}/api/risk/scan",
                         data={"file_path": file_path, "reanalyze": "false"})
        r.raise_for_status()
        return r.json()

@API_ROUTER.post("/upload-and-scan")
async def upload_and_scan(file: UploadFile = File(...)) -> Dict[str, Any]:
    p = _save_upload_to_watched(file)
    async with httpx.AsyncClient(timeout=120) as c:
        r = await c.post(f"{POST_TO_SELF}/api/risk/scan",
                         data={"file_path": p, "reanalyze": "false"})
        r.raise_for_status()
        return r.json()

@API_ROUTER.post("/summarize-email")
async def summarize_email(
    client: str = Form(""),
    matter: str = Form(""),
    subject: str = Form(""),
    body_text: str = Form(""),
    attachments: Optional[str] = Form(""),
) -> Dict[str, Any]:
    """
    attachments: comma-separated filenames already in WATCHED_FOLDER (optional)
    """
    model = _init_gemini()

    # Build user task prompt
    prompt = f"""
TASK: Email summarization + risk detection
Client: {client}
Matter: {matter}
Email Subject: {subject}

Email Body:
{body_text}

Attachments: {attachments or "(none)"}

Please produce:
1) Human Brief (Markdown) as specified.
2) JSON object (single line, exact schema, lawyerFinalConclusion: null).
"""

    resp = model.generate_content(
        [{"role": "user", "parts": [{"text": MASTER_SYSTEM_PROMPT + "\n\n" + prompt}]}]
    )

    text = (resp.text or "").strip()
    if not text:
        raise HTTPException(500, "Empty model response")

    # Split human brief and JSON (assume last JSON object on last line)
    # Strategy: find last brace block and parse
    json_obj = None
    human = text
    try:
        last_brace = text.rfind("{")
        if last_brace != -1:
            candidate = text[last_brace:].strip()
            json_obj = json.loads(candidate)
            human = text[:last_brace].rstrip()
    except Exception:
        # If parse fails, return as-is but without auto-posting
        return {"human": human, "json_parse_error": True, "raw_tail": text[last_brace:]}

    # Post JSON to our analyzer as "raw_json" so it stores a report
    api_result = await _post_scan_raw_json(json_obj)

    return {"human": human, "json": json_obj, "api_result": api_result}
