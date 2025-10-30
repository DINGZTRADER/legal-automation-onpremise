import os
import json
import uuid
import logging
from pathlib import Path
from typing import Dict, Any

from fastapi import APIRouter, Request, HTTPException
from pydantic import BaseModel

# Text extraction libraries
from pdfminer.high_level import extract_text as extract_pdf_text
import docx

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

RISK_ROUTER = APIRouter(prefix="/api/risk", tags=["risk"])

WATCHED_FOLDER = os.getenv("WATCHED_FOLDER", "/data/watched")
REPORTS_DIR = Path(WATCHED_FOLDER) / "_reports"
REPORTS_DIR.mkdir(parents=True, exist_ok=True)

# Pydantic models for request bodies
class RawJsonPayload(BaseModel):
    raw_json: Dict[str, Any]

class FinalizePayload(BaseModel):
    report_id: str
    lawyer_final_conclusion: str

def extract_text_from_file(file_path: Path) -> str:
    """Extracts text from PDF or DOCX files."""
    if not file_path.exists():
        raise FileNotFoundError(f"File not found at path: {file_path}")

    text = ""
    try:
        if file_path.suffix.lower() == ".pdf":
            text = extract_pdf_text(str(file_path))
        elif file_path.suffix.lower() == ".docx":
            doc = docx.Document(file_path)
            text = "\n".join([para.text for para in doc.paragraphs])
        elif file_path.suffix.lower() in [".txt", ".md"]:
            text = file_path.read_text(encoding="utf-8")
        else:
            logger.warning(f"Unsupported file type for text extraction: {file_path.suffix}")
            text = f"[Unsupported file type: {file_path.suffix}]"
    except Exception as e:
        logger.error(f"Error extracting text from {file_path}: {e}")
        raise IOError(f"Could not extract text from file: {file_path.name}") from e
    return text

def save_report(report_id: str, data: Dict[str, Any]) -> Path:
    """Saves a report dictionary to a JSON file."""
    report_path = REPORTS_DIR / f"{report_id}.json"
    report_path.write_text(json.dumps(data, indent=2), encoding="utf-8")
    return report_path

@RISK_ROUTER.post("/scan", status_code=200)
async def scan_risk(request: Request):
    """
    Analyzes a document for risk. This endpoint handles both raw JSON data
    and form data with a file path, making it compatible with different
    internal service calls.

    NOTE: This is a placeholder implementation. It creates a basic report
    structure without performing real AI-based risk analysis.
    """
    report_id = str(uuid.uuid4())
    report_data = {}
    content_type = request.headers.get('content-type', '')

    if 'application/json' in content_type:
        body = await request.json()
        payload = RawJsonPayload(**body)
        logger.info("Processing raw JSON payload")
        report_data = payload.raw_json
        report_data.setdefault("summary", "Summary from raw JSON payload.")
        report_data.setdefault("findings", [])
        report_data.setdefault("overall_grade", "Not Graded")

    elif 'application/x-www-form-urlencoded' in content_type or 'multipart/form-data' in content_type:
        form_data = await request.form()
        file_path = form_data.get('file_path')
        if not file_path:
            raise HTTPException(status_code=400, detail="'file_path' must be provided in form data.")
        
        logger.info(f"Processing file path: {file_path}")
        p = Path(file_path)
        if not p.is_absolute():
             p = Path(WATCHED_FOLDER) / p.name
        
        if not p.exists():
            raise HTTPException(status_code=404, detail=f"File not found: {file_path}")

        try:
            text_content = extract_text_from_file(p)
            summary = f"Successfully extracted {len(text_content)} characters from {p.name}."
        except (IOError, FileNotFoundError) as e:
            raise HTTPException(status_code=500, detail=str(e))

        report_data = {
            "overall_grade": "Placeholder Grade",
            "summary": summary,
            "findings": [{"risk": "Placeholder", "details": "This is a placeholder analysis.", "severity": "low"}],
            "source_file": p.name,
        }
    else:
        raise HTTPException(status_code=415, detail=f"Unsupported content type: {content_type}")

    report_data["reportId"] = report_id
    report_data["lawyerFinalConclusion"] = None
    report_data["status"] = "pending_review"

    save_report(report_id, report_data)
    logger.info(f"Saved report {report_id}.json")
    return report_data

@RISK_ROUTER.post("/finalize", status_code=200)
async def finalize_report(payload: FinalizePayload):
    """Finalizes a report with a lawyer's conclusion."""
    report_path = REPORTS_DIR / f"{payload.report_id}.json"
    if not report_path.exists():
        raise HTTPException(status_code=404, detail=f"Report with ID '{payload.report_id}' not found.")

    try:
        report_data = json.loads(report_path.read_text(encoding="utf-8"))
        report_data["lawyerFinalConclusion"] = payload.lawyer_final_conclusion
        report_data["status"] = "finalized"
        save_report(payload.report_id, report_data)
        logger.info(f"Finalized report {payload.report_id}.json")
        return report_data
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="Error reading the report file.")
    except Exception as e:
        logger.error(f"Error finalizing report {payload.report_id}: {e}")
        raise HTTPException(status_code=500, detail="An unexpected error occurred.")
