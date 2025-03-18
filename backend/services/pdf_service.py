from pypdf import PdfReader
import logging

logger = logging.getLogger(__name__)

def extract_text_from_pdf(file_path: str) -> str:
    """
    Extract text content from a PDF file
    
    Args:
        file_path: Path to the PDF file
        
    Returns:
        Extracted text as a string
    """
    try:
        reader = PdfReader(file_path)
        text = ""
        
        for page in reader.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + "\n"
                
        return text.strip()
    except Exception as e:
        logger.error(f"Error extracting text from PDF: {str(e)}")
        return "" 