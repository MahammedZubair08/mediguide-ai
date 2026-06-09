import os
import shutil
from PIL import Image
from fastapi import APIRouter, File, UploadFile, HTTPException
from pydantic import BaseModel
from app.utils.parser import extract_text_from_pdf
from app.services.gemini_service import gemini_service

router = APIRouter()

# Schema models for POST /chat
class CoreChatRequest(BaseModel):
    message: str

class CoreChatResponse(BaseModel):
    reply: str
    emergency: bool

# Schema models for POST /emergency-check
class CoreEmergencyRequest(BaseModel):
    symptoms: str

class CoreEmergencyResponse(BaseModel):
    emergency: bool
    message: str

# Base uploads folders
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
UPLOAD_DIR = os.path.join(BASE_DIR, "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/chat", response_model=CoreChatResponse)
async def core_chat(request: CoreChatRequest):
    """
    POST /chat
    Evaluates customer symptom query, generates clinical guidance, and checks for critical alerts.
    """
    if not request.message.strip():
        raise HTTPException(status_code=400, detail="Message cannot be empty.")
    
    # Generate advisory text
    reply_text = await gemini_service.generate_chat_response(user_message=request.message)
    
    # Run urgency triage in parallel
    triage_result = await gemini_service.detect_emergency(symptoms=request.message)
    is_emergency = triage_result.get("triage_level") == "CRITICAL"
    
    return CoreChatResponse(
        reply=reply_text,
        emergency=is_emergency
    )

@router.post("/emergency-check", response_model=CoreEmergencyResponse)
async def core_emergency_check(request: CoreEmergencyRequest):
    """
    POST /emergency-check
    Assess input symptoms specifically to check for critical emergency signs.
    """
    if not request.symptoms.strip():
        raise HTTPException(status_code=400, detail="Symptoms text cannot be empty.")
        
    triage_result = await gemini_service.detect_emergency(symptoms=request.symptoms)
    is_emergency = triage_result.get("triage_level") == "CRITICAL"
    
    if is_emergency:
        msg = triage_result.get("recommended_action") or "Seek immediate medical attention."
    else:
        msg = triage_result.get("reasoning") or "No immediate critical warning signs identified."
        
    return CoreEmergencyResponse(
        emergency=is_emergency,
        message=msg
    )

@router.post("/upload-report")
async def core_upload_report(file: UploadFile = File(...)):
    """
    POST /upload-report
    Upload a medical file (PDF, TXT, PNG, JPG) and receive a layperson summary translation.
    """
    filename = file.filename
    file_ext = os.path.splitext(filename)[1].lower()
    
    if file_ext not in [".pdf", ".txt", ".png", ".jpg", ".jpeg"]:
        raise HTTPException(
            status_code=400,
            detail="Unsupported file format. Please upload a PDF, TXT, or image file (PNG, JPG)."
        )
        
    file_path = os.path.join(UPLOAD_DIR, filename)
    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Could not save file to disk: {str(e)}"
        )
        
    summary_result = ""
    try:
        if file_ext in [".png", ".jpg", ".jpeg"]:
            # Load with Pillow for multimodal Gemini call
            try:
                image = Image.open(file_path)
                if image.mode not in ("RGB", "L"):
                    image = image.convert("RGB")
                summary_result = await gemini_service.summarize_report_image(image)
            except Exception as img_err:
                raise HTTPException(
                    status_code=422,
                    detail=f"Invalid image format: {str(img_err)}"
                )
        elif file_ext == ".pdf":
            extracted_text = extract_text_from_pdf(file_path)
            if not extracted_text.strip():
                raise HTTPException(
                    status_code=422,
                    detail="PDF contains no parseable text characters."
                )
            summary_result = await gemini_service.summarize_report(extracted_text)
        else:
            with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
                extracted_text = f.read()
            if not extracted_text.strip():
                raise HTTPException(
                    status_code=422,
                    detail="TXT file contains no text."
                )
            summary_result = await gemini_service.summarize_report(extracted_text)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=422,
            detail=f"Error processing document: {str(e)}"
        )
        
    return {
        "summary": summary_result,
        "filename": filename
    }
