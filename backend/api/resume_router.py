from fastapi import APIRouter, UploadFile, File, HTTPException, Form, BackgroundTasks
from fastapi.responses import JSONResponse
from typing import List, Optional
import tempfile
import os
from services.pdf_service import extract_text_from_pdf
from services.openai_service import evaluate_resume, compare_evaluations

router = APIRouter()

@router.post("/analyze-resumes")
async def analyze_resumes(
    clean_resume: UploadFile = File(...),
    injected_resume: UploadFile = File(...),
):
    """
    Upload and analyze two resume PDFs (clean and injected)
    Returns the evaluations and comparison
    """
    if not clean_resume.filename.endswith('.pdf') or not injected_resume.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are accepted")
    
    # Create temp files
    clean_temp = tempfile.NamedTemporaryFile(delete=False, suffix=".pdf")
    injected_temp = tempfile.NamedTemporaryFile(delete=False, suffix=".pdf")
    
    try:
        # Save uploaded files to temp files
        clean_temp.write(await clean_resume.read())
        injected_temp.write(await injected_resume.read())
        clean_temp.close()
        injected_temp.close()
        
        # Check if files are empty
        if os.stat(clean_temp.name).st_size == 0 or os.stat(injected_temp.name).st_size == 0:
            raise HTTPException(status_code=422, detail="One or both uploaded files are empty")
        
        # Extract text from PDFs
        clean_text = extract_text_from_pdf(clean_temp.name)
        injected_text = extract_text_from_pdf(injected_temp.name)
        
        # Check if extracted text is empty
        if not clean_text or not injected_text:
            raise HTTPException(status_code=422, detail="Failed to extract text from one or both PDFs")
        
        clean_evaluation = await evaluate_resume(clean_text)
        injected_evaluation = await evaluate_resume(injected_text)
        
        # Compare evaluations
        comparison = compare_evaluations(clean_evaluation, injected_evaluation)
        
        return {
            "clean_resume": {
                "filename": clean_resume.filename,
                "evaluation": clean_evaluation
            },
            "injected_resume": {
                "filename": injected_resume.filename,
                "evaluation": injected_evaluation
            },
            "comparison": comparison
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")
    
    finally:
        # Clean up temp files
        if os.path.exists(clean_temp.name):
            os.unlink(clean_temp.name)
        if os.path.exists(injected_temp.name):
            os.unlink(injected_temp.name) 
