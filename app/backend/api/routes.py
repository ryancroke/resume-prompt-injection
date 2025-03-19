"""
API Routes for Resume Injection Demo

This module contains all API endpoints for the Resume Injection Demo application.
"""

import os
import tempfile
from fastapi import APIRouter, UploadFile, File, HTTPException, Form, BackgroundTasks
from fastapi.responses import JSONResponse, FileResponse
from typing import List, Optional, Dict, Any
import uuid

# Change these import statements to use relative imports
from ..services.pdf_service import extract_text_from_pdf, compare_pdfs
from ..services.eval_service import evaluate_resume, compare_evaluations
from ..services.injection_service import inject_invisible_text, get_default_injection_text, create_test_resume

router = APIRouter()

# Create a directory for temporary files
TEMP_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "temp")
os.makedirs(TEMP_DIR, exist_ok=True)


@router.post("/upload")
async def upload_resume(file: UploadFile = File(...)):
    """
    Upload a resume PDF file
    
    Returns the file ID and extracted text
    """
    if not file.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are accepted")
    
    try:
        # Create a unique filename
        file_id = str(uuid.uuid4())
        temp_path = os.path.join(TEMP_DIR, f"{file_id}.pdf")
        
        # Save uploaded file
        with open(temp_path, "wb") as temp_file:
            content = await file.read()
            temp_file.write(content)
        
        # Extract text
        text = extract_text_from_pdf(temp_path)
        
        if not text:
            raise HTTPException(status_code=422, detail="Failed to extract text from PDF")
        
        return {
            "file_id": file_id,
            "filename": file.filename,
            "text_preview": text[:500] + "..." if len(text) > 500 else text
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing upload: {str(e)}")


@router.post("/inject")
async def inject_resume(
    file: UploadFile = File(...),
    injection_text: str = Form(None)
):
    """
    Inject invisible text into a resume PDF
    
    Returns a link to download the injected PDF
    """
    if not file.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are accepted")
    
    try:
        # Create unique filenames
        input_id = str(uuid.uuid4())
        output_id = str(uuid.uuid4())
        
        input_path = os.path.join(TEMP_DIR, f"{input_id}.pdf")
        output_path = os.path.join(TEMP_DIR, f"{output_id}.pdf")
        
        # Save uploaded file
        with open(input_path, "wb") as temp_file:
            content = await file.read()
            temp_file.write(content)
        
        # Inject text
        inject_invisible_text(input_path, output_path, injection_text)
        
        # Return the ID of the injected file
        return {
            "injected_file_id": output_id,
            "original_filename": file.filename,
            "download_url": f"/api/download/{output_id}"
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error injecting resume: {str(e)}")


@router.get("/download/{file_id}")
async def download_file(file_id: str):
    """
    Download a file by its ID
    """
    file_path = os.path.join(TEMP_DIR, f"{file_id}.pdf")
    
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found")
    
    return FileResponse(file_path, media_type="application/pdf", filename="injected_resume.pdf")


@router.post("/analyze-resumes")
async def analyze_resumes(
    clean_resume: UploadFile = File(...),
    injected_resume: UploadFile = File(...)
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
        
        # Compare PDFs
        pdf_comparison = compare_pdfs(clean_temp.name, injected_temp.name)
        
        # Evaluate resumes
        clean_evaluation = await evaluate_resume(clean_text)
        injected_evaluation = await evaluate_resume(injected_text)
        
        # Compare evaluations
        eval_comparison = compare_evaluations(clean_evaluation, injected_evaluation)
        
        return {
            "clean_resume": {
                "filename": clean_resume.filename,
                "evaluation": clean_evaluation
            },
            "injected_resume": {
                "filename": injected_resume.filename,
                "evaluation": injected_evaluation
            },
            "pdf_comparison": pdf_comparison,
            "evaluation_comparison": eval_comparison
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")
    
    finally:
        # Clean up temp files
        if os.path.exists(clean_temp.name):
            os.unlink(clean_temp.name)
        if os.path.exists(injected_temp.name):
            os.unlink(injected_temp.name)


@router.get("/default-injection")
async def get_default_injection():
    """
    Get the default injection text
    """
    return {"default_text": get_default_injection_text()}


@router.get("/cleanup")
async def cleanup_temp_files(background_tasks: BackgroundTasks):
    """
    Clean up temporary files older than 1 hour
    """
    def remove_old_files():
        import time
        current_time = time.time()
        one_hour_ago = current_time - 3600
        
        for filename in os.listdir(TEMP_DIR):
            file_path = os.path.join(TEMP_DIR, filename)
            if os.path.isfile(file_path):
                # Check if file is older than 1 hour
                if os.path.getmtime(file_path) < one_hour_ago:
                    try:
                        os.unlink(file_path)
                    except Exception:
                        pass
    
    background_tasks.add_task(remove_old_files)
    return {"status": "Cleanup task scheduled"}


@router.post("/create-test-resume")
async def create_sample_resume(
    resume_text: str = Form(None)
):
    """
    Create a test resume PDF with the provided text
    
    Returns a link to download the generated PDF
    """
    try:
        # Create unique filenames
        output_id = str(uuid.uuid4())
        output_path = os.path.join(TEMP_DIR, f"{output_id}.pdf")
        
        # Create the test resume
        create_test_resume(output_path, resume_text)
        
        # Return the ID of the generated file
        return {
            "file_id": output_id,
            "filename": "test_resume.pdf",
            "download_url": f"/api/download/{output_id}"
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating test resume: {str(e)}")
