import logging
import pdfplumber

logger = logging.getLogger(__name__)

def extract_text_from_pdf(file_path: str) -> str:
    """
    Reads a PDF file from file_path and returns its text content.
    """
    extracted_text = ""
    try:
        with pdfplumber.open(file_path) as pdf:
            for page in pdf.pages:
                text = page.extract_text()
                if text:
                    extracted_text += text + "\n"
    except Exception as e:
        logger.error(f"Error parsing PDF file {file_path}: {e}")
        raise ValueError(f"Could not parse PDF file contents: {str(e)}")
    
    return extracted_text.strip()
