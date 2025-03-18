from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn
import os
from api.resume_router import router as resume_router

app = FastAPI(title="CV Prompt Injection Demo")

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For development - restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(resume_router, prefix="/api", tags=["Resume Analysis"])

@app.get("/")
async def root():
    """Health check endpoint"""
    return {"status": "online", "service": "CV Prompt Injection Demo API"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True) 