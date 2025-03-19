"""
PDF Service

Provides functionality for PDF processing, including text extraction and PDF comparison.
"""

import io
from PyPDF2 import PdfReader
import difflib


def extract_text_from_pdf(pdf_path):
    """
    Extract visible text from PDF for analysis.
    
    Args:
        pdf_path (str): Path to the PDF file
        
    Returns:
        str: Extracted text from the PDF
    """
    text = ""
    try:
        reader = PdfReader(pdf_path)
        for page in reader.pages:
            text += page.extract_text() + "\n"
        return text.strip()
    except Exception as e:
        raise Exception(f"Error extracting text from PDF: {str(e)}")


def extract_text_from_pdf_bytes(pdf_bytes):
    """
    Extract visible text from PDF bytes for analysis.
    
    Args:
        pdf_bytes (bytes): PDF file as bytes
        
    Returns:
        str: Extracted text from the PDF
    """
    text = ""
    try:
        reader = PdfReader(io.BytesIO(pdf_bytes))
        for page in reader.pages:
            text += page.extract_text() + "\n"
        return text.strip()
    except Exception as e:
        raise Exception(f"Error extracting text from PDF bytes: {str(e)}")


def compare_pdfs(clean_pdf_path, injected_pdf_path):
    """
    Compare clean and injected PDFs to detect differences.
    
    Args:
        clean_pdf_path (str): Path to the clean PDF
        injected_pdf_path (str): Path to the injected PDF
        
    Returns:
        dict: Comparison results including:
            - visible_diff: Visible text differences
            - hidden_text: Potential hidden text identified
            - similarity_score: Percentage of similarity between documents
    """
    # Extract text from both PDFs
    clean_text = extract_text_from_pdf(clean_pdf_path)
    injected_text = extract_text_from_pdf(injected_pdf_path)
    
    # Generate diff
    diff = difflib.unified_diff(
        clean_text.splitlines(keepends=True),
        injected_text.splitlines(keepends=True),
        n=3
    )
    
    # Calculate similarity score
    matcher = difflib.SequenceMatcher(None, clean_text, injected_text)
    similarity_score = round(matcher.ratio() * 100, 2)
    
    # Identify potential hidden text (text in injected but not in clean)
    clean_words = set(clean_text.split())
    injected_words = set(injected_text.split())
    potential_hidden = injected_words - clean_words
    
    return {
        "visible_diff": ''.join(diff),
        "hidden_text": ' '.join(potential_hidden),
        "similarity_score": similarity_score,
        "clean_text_length": len(clean_text),
        "injected_text_length": len(injected_text)
    }


def get_pdf_metadata(pdf_path):
    """
    Extract metadata from a PDF file.
    
    Args:
        pdf_path (str): Path to the PDF file
        
    Returns:
        dict: PDF metadata
    """
    try:
        reader = PdfReader(pdf_path)
        return {
            "title": reader.metadata.get('/Title', ''),
            "author": reader.metadata.get('/Author', ''),
            "subject": reader.metadata.get('/Subject', ''),
            "creator": reader.metadata.get('/Creator', ''),
            "producer": reader.metadata.get('/Producer', ''),
            "creation_date": reader.metadata.get('/CreationDate', ''),
            "modification_date": reader.metadata.get('/ModDate', ''),
            "pages": len(reader.pages),
        }
    except Exception as e:
        raise Exception(f"Error extracting metadata from PDF: {str(e)}")
