import json
import logging
import google.generativeai as genai
from app.config.config import settings
from app.prompts.medical_prompts import (
    CHAT_SYSTEM_PROMPT,
    SUMMARY_SYSTEM_PROMPT,
    EMERGENCY_SYSTEM_PROMPT,
    CLINICAL_DISCLAIMER
)

logger = logging.getLogger(__name__)

# Verify API configuration
has_key = settings.GEMINI_API_KEY and settings.GEMINI_API_KEY != "PLACEHOLDER_GEMINI_API_KEY"

if has_key:
    genai.configure(api_key=settings.GEMINI_API_KEY)
    logger.info("Gemini API successfully configured.")
else:
    logger.warning("GEMINI_API_KEY is not set. Service will run in Demo/Fallback mode.")

class GeminiService:
    def __init__(self):
        self.model_name = "gemini-1.5-flash"
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
            "### [DEMO SUMMARY] Medical Report Analysis\n\n"
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
        Generates clinical guidance based on symptoms and message history.
        """
        if self.is_mock:
            return self._get_mock_chat(user_message)

        try:
            # Build conversation context with system prompt
            model = genai.GenerativeModel(
                model_name=self.model_name,
                system_instruction=CHAT_SYSTEM_PROMPT
            )
            
            # Start chat session
            chat = model.start_chat(history=[])
            response = chat.send_message(user_message)
            return response.text
        except Exception as e:
            logger.error(f"Error in Gemini Chat integration: {e}")
            return f"Error communicating with AI services: {str(e)}. Falling back to local advisory."

    async def summarize_report(self, report_text: str) -> str:
        """
        Generates layperson summary of medical reports.
        """
        if self.is_mock:
            return self._get_mock_summary(report_text)

        try:
            model = genai.GenerativeModel(
                model_name=self.model_name,
                system_instruction=SUMMARY_SYSTEM_PROMPT
            )
            response = model.generate_content(
                f"Please summarize the following medical report:\n\n{report_text}"
            )
            return response.text
        except Exception as e:
            logger.error(f"Error in Gemini Summary integration: {e}")
            return f"Error communicating with AI services: {str(e)}."

    async def summarize_report_image(self, image_data) -> str:
        """
        Generates layperson summary of medical report images using multimodal Gemini.
        """
        if self.is_mock:
            return self._get_mock_summary("[IMAGE CONTENT]")

        try:
            model = genai.GenerativeModel(
                model_name=self.model_name,
                system_instruction=SUMMARY_SYSTEM_PROMPT
            )
            response = model.generate_content(
                [
                    "Please analyze and summarize this medical report image in accordance with instructions:",
                    image_data
                ]
            )
            return response.text
        except Exception as e:
            logger.error(f"Error in Gemini Summary image integration: {e}")
            return f"Error communicating with AI services: {str(e)}."

    async def detect_emergency(self, symptoms: str) -> dict:
        """
        Classifies symptoms into CRITICAL, URGENT, or NON_URGENT with reasoning.
        """
        if self.is_mock:
            return self._get_mock_emergency(symptoms)

        try:
            model = genai.GenerativeModel(
                model_name=self.model_name,
                system_instruction=EMERGENCY_SYSTEM_PROMPT
            )
            
            # Request JSON output format
            response = model.generate_content(
                f"Assess the following symptom description:\n\n{symptoms}",
                generation_config={"response_mime_type": "application/json"}
            )
            
            # Parse response
            data = json.loads(response.text.strip())
            return data
        except Exception as e:
            logger.error(f"Error in Gemini Emergency classification: {e}")
            # Fallback to local rule-based parsing
            return self._get_mock_emergency(symptoms)

gemini_service = GeminiService()
