# pyrefly: ignore [missing-import]
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.groq_service import groq_service

router = APIRouter(prefix="/emergency", tags=["emergency"])

class EmergencyRequest(BaseModel):
    symptoms: str

class EmergencyResponse(BaseModel):
    triage_level: str
    reasoning: str
    recommended_action: str

@router.post("", response_model=EmergencyResponse)
async def triage_symptoms(request: EmergencyRequest):
    if not request.symptoms.strip():
        raise HTTPException(status_code=400, detail="Symptoms text cannot be empty.")
        
    triage_result = await groq_service.detect_emergency(request.symptoms)
    
    # Ensure fields are present and safe
    return EmergencyResponse(
        triage_level=triage_result.get("triage_level", "NON_URGENT"),
        reasoning=triage_result.get("reasoning", "Unable to determine symptoms severity context."),
        recommended_action=triage_result.get("recommended_action", "Consult your physician for instructions.")
    )
