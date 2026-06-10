import json
import logging
import base64
import io
# pyrefly: ignore [import-error, missing-import]
from groq import AsyncGroq
from app.config.config import settings
from app.prompts.medical_prompts import (
    CHAT_SYSTEM_PROMPT,
    SUMMARY_SYSTEM_PROMPT,
    EMERGENCY_SYSTEM_PROMPT,
    CLINICAL_DISCLAIMER
)

logger = logging.getLogger(__name__)

# Verify API configuration
has_key = settings.GROQ_API_KEY and settings.GROQ_API_KEY != "PLACEHOLDER_GROQ_API_KEY"

if has_key:
    # Initialize AsyncGroq client
    groq_client = AsyncGroq(api_key=settings.GROQ_API_KEY)
    logger.info("Groq API successfully configured.")
else:
    groq_client = None
    logger.warning("GROQ_API_KEY is not set. Service will run in Demo/Fallback mode.")


class GroqService:
    def __init__(self):
        self.chat_model = "llama-3.3-70b-versatile"
        self.vision_model = "meta-llama/llama-4-scout-17b-16e-instruct"
        self.is_mock = not has_key

    def _get_mock_chat(self, user_message: str) -> str:
        # Generate safe demo clinical advice based on query keywords
        msg = user_message.lower()
        if "chest pain" in msg or "breathing" in msg or "shortness of breath" in msg:
            return (
                "⚠️ **IMMEDIATE EMERGENCY WARNING:** Chest pain or breathing difficulties can indicate a severe cardiac "
                "or respiratory event. Please call emergency services (e.g. 911) or proceed immediately to the nearest "
                "emergency department. Do not wait." + CLINICAL_DISCLAIMER
            )
        
        return (
            f"Thank you for reaching out. In Demo Mode, I've received your query about: '{user_message}'.\n\n"
            "Common educational possibilities for mild symptoms like these include rest, proper hydration, "
            "and monitoring for any changes. If you develop a high fever, localized severe pain, or difficulty breathing, "
            "please consult a healthcare provider." + CLINICAL_DISCLAIMER
        )

    def _get_mock_summary(self, report_text: str) -> str:
        return (
            "### [DEMO SUMMARY] Medical Report Analysis (Groq Fallback)\n\n"
            "**Executive Summary:**\n"
            "The uploaded report suggests a standard review showing general wellness with minor deviations. "
            "All vital statistics are within tolerable levels.\n\n"
            "**Key Findings Explained:**\n"
            "- **Hemoglobin:** 14.2 g/dL (Normal). Indicates healthy oxygen carriage capacity.\n"
            "- **WBC Count:** 6,500 cells/mcL (Normal). Suggests no active severe bacterial infection.\n"
            "- **TSH:** 4.1 mIU/L (Mildly Elevated). Suggests checking thyroid functions at next routine appointment.\n\n"
            "**Areas for Discussion:**\n"
            "- Ask your doctor if the borderline thyroid test requires a follow-up panel in 3-6 months.\n\n"
            "**Next Steps:**\n"
            "- Keep hydrated and maintain a balanced diet.\n"
            "- Bring this report to your next scheduled clinic visit."
        )

    def _get_mock_emergency(self, symptoms: str) -> dict:
        msg = symptoms.lower()
        if "chest pain" in msg or "shortness of breath" in msg or "stroke" in msg or "bleeding" in msg:
            return {
                "triage_level": "CRITICAL",
                "reasoning": "Symptoms of chest discomfort, heavy bleeding, or breathing distress are highly critical and require direct assessment.",
                "recommended_action": "Call 911 or go to the nearest Emergency Room immediately."
            }
        elif "fever" in msg or "vomiting" in msg or "severe pain" in msg:
            return {
                "triage_level": "URGENT",
                "reasoning": "Localized severe pain or high fever suggests possible acute inflammation or infection that should be evaluated within 24 hours.",
                "recommended_action": "Contact your primary care doctor or visit an urgent care center today."
            }
        else:
            return {
                "triage_level": "NON_URGENT",
                "reasoning": "Standard mild symptoms with no acute danger markers detected.",
                "recommended_action": "Monitor symptoms at home, rest, stay hydrated, and consult a doctor if condition worsens."
            }

    async def generate_chat_response(self, user_message: str, history: list = None) -> str:
        """
        Generates clinical guidance based on symptoms and message history using Groq.
        """
        if self.is_mock:
            return self._get_mock_chat(user_message)

        try:
            # Format history for Groq/OpenAI structure
            # e.g., [{"role": "user", "content": "text"}, {"role": "assistant", "content": "text"}]
            messages = [{"role": "system", "content": CHAT_SYSTEM_PROMPT}]
            
            if history:
                for item in history:
                    role = item.get("role")
                    if role == "model":
                        role = "assistant"
                    # Also handle parts structure if passed directly
                    content = item.get("content")
                    if not content and "parts" in item:
                        content = item["parts"][0] if item["parts"] else ""
                    messages.append({"role": role, "content": content})
                    
            messages.append({"role": "user", "content": user_message})

            chat_completion = await groq_client.chat.completions.create(
                messages=messages,
                model=self.chat_model,
            )
            return chat_completion.choices[0].message.content
        except Exception as e:
            logger.error(f"Error in Groq Chat integration: {e}")
            return f"Error communicating with Groq services: {str(e)}. Falling back to local advisory."

    async def summarize_report(self, report_text: str) -> str:
        """
        Generates layperson summary of medical reports using Groq.
        """
        if self.is_mock:
            return self._get_mock_summary(report_text)

        try:
            messages = [
                {"role": "system", "content": SUMMARY_SYSTEM_PROMPT},
                {"role": "user", "content": f"Please summarize the following medical report:\n\n{report_text}"}
            ]
            chat_completion = await groq_client.chat.completions.create(
                messages=messages,
                model=self.chat_model,
            )
            return chat_completion.choices[0].message.content
        except Exception as e:
            logger.error(f"Error in Groq Summary integration: {e}")
            return f"Error communicating with Groq services: {str(e)}."

    async def summarize_report_image(self, image_data) -> str:
        """
        Generates layperson summary of medical report images using multimodal Llama on Groq.
        """
        if self.is_mock:
            return self._get_mock_summary("[IMAGE CONTENT]")

        try:
            # Convert PIL image to base64 encoding
            buffered = io.BytesIO()
            # Convert to RGB if needed to save as JPEG
            if image_data.mode not in ("RGB", "L"):
                image_data = image_data.convert("RGB")
            image_data.save(buffered, format="JPEG")
            img_b64 = base64.b64encode(buffered.getvalue()).decode("utf-8")

            messages = [
                {"role": "system", "content": SUMMARY_SYSTEM_PROMPT},
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": "Please analyze and summarize this medical report image in accordance with instructions:"
                        },
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": f"data:image/jpeg;base64,{img_b64}"
                            }
                        }
                    ]
                }
            ]
            
            chat_completion = await groq_client.chat.completions.create(
                messages=messages,
                model=self.vision_model,
            )
            return chat_completion.choices[0].message.content
        except Exception as e:
            logger.error(f"Error in Groq Summary image integration: {e}")
            return f"Error communicating with Groq services: {str(e)}."

    async def detect_emergency(self, symptoms: str) -> dict:
        """
        Classifies symptoms into CRITICAL, URGENT, or NON_URGENT with reasoning using Groq JSON Mode.
        """
        if self.is_mock:
            return self._get_mock_emergency(symptoms)

        try:
            messages = [
                {"role": "system", "content": EMERGENCY_SYSTEM_PROMPT},
                {"role": "user", "content": f"Assess the following symptom description:\n\n{symptoms}"}
            ]
            
            chat_completion = await groq_client.chat.completions.create(
                messages=messages,
                model=self.chat_model,
                response_format={"type": "json_object"}
            )
            
            data = json.loads(chat_completion.choices[0].message.content.strip())
            return data
        except Exception as e:
            logger.error(f"Error in Groq Emergency classification: {e}")
            return self._get_mock_emergency(symptoms)


groq_service = GroqService()
