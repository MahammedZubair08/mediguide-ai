import os
import shutil
from fastapi import APIRouter, UploadFile, File, HTTPException
from pydantic import BaseModel
from app.utils.parser import extract_text_from_pdf
from app.services.gemini_service import gemini_service

router = APIRouter(prefix="/upload", tags=["upload"])

# Base uploads folder setup
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
UPLOAD_DIR = os.path.join(BASE_DIR, "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

class SummaryResponse(BaseModel):
    filename: str
    content_type: str
    extracted_text_snippet: str
    summary: str

@router.post("", response_model=SummaryResponse)
async def upload_medical_report(file: UploadFile = File(...)):
    # Check supported extensions
    filename = file.filename
    file_ext = os.path.splitext(filename)[1].lower()
    
    if file_ext not in [".pdf", ".txt"]:
        raise HTTPException(
            status_code=400, 
            detail="Unsupported file format. Please upload a PDF or TXT file."
        )
    
    # Save file to uploads folder
    file_path = os.path.join(UPLOAD_DIR, filename)
    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Could not save file to disk: {str(e)}"
        )
        
    # Extract text content
    extracted_text = ""
    try:
        if file_ext == ".pdf":
            extracted_text = extract_text_from_pdf(file_path)
        else:
            with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
                extracted_text = f.read()
    except Exception as e:
        raise HTTPException(
            status_code=422,
            detail=f"Error reading file content: {str(e)}"
        )
        
    if not extracted_text.strip():
        raise HTTPException(
            status_code=422,
            detail="The file appears to be empty or contains no parseable text."
        )

    # Summarize with Gemini service
    summary_result = await gemini_service.summarize_report(extracted_text)
    
    # Return response with a short snippet of the text
    snippet_len = min(len(extracted_text), 300)
    text_snippet = extracted_text[:snippet_len] + ("..." if len(extracted_text) > 300 else "")
    
    return SummaryResponse(
        filename=filename,
        content_type=file.content_type or "unknown",
        extracted_text_snippet=text_snippet,
        summary=summary_result
    )
