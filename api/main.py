from fastapi import FastAPI
from routes_gemini import API_ROUTER as UI_ROUTER
from routes_risk import RISK_ROUTER
from datetime import datetime

app = FastAPI()

@app.get("/", tags=["Root"])
def read_root():
    return {"ok": "legal-automation-api", "ts": datetime.utcnow().isoformat(timespec="seconds") + "Z"}

@app.get("/api/health", tags=["Health"])
def health_check():
    return {"status": "ok"}

app.include_router(UI_ROUTER)
app.include_router(RISK_ROUTER)

