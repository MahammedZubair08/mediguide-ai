
# pyrefly: ignore [missing-import]
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from app.services.groq_service import groq_service

router = APIRouter(prefix="/chat", tags=["chat"])

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    message: str
    history: Optional[List[ChatMessage]] = None

class ChatResponse(BaseModel):
    response: str

@router.post("", response_model=ChatResponse)
async def chat_symptoms(request: ChatRequest):
    if not request.message.strip():
        raise HTTPException(status_code=400, detail="Message cannot be empty.")
    
    # Format history for OpenAI/Groq structure
    history_list = []
    if request.history:
        for msg in request.history:
            role = "assistant" if msg.role == "model" else msg.role
            history_list.append({"role": role, "content": msg.content})
            
    response_text = await groq_service.generate_chat_response(
        user_message=request.message,
        history=history_list
    )
    return ChatResponse(response=response_text)
