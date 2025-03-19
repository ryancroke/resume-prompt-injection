"""
Resume Injection Demo - FastAPI Backend

Main entry point for the FastAPI application that serves the backend API
and static frontend files.
"""

import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from .api.routes import router as api_router

# Create FastAPI application
app = FastAPI(
    title="Resume Injection Demo",
    description="An application that demonstrates prompt injection vulnerabilities in AI-based resume evaluation systems",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API router
app.include_router(api_router, prefix="/api")

# Get the directory of the current file
current_dir = os.path.dirname(os.path.abspath(__file__))
# Go up one level to get the app directory
app_dir = os.path.dirname(current_dir)
# Path to frontend static files
frontend_dir = os.path.join(app_dir, "frontend")

# Mount static files (frontend) if the directory exists
if os.path.exists(frontend_dir):
    app.mount("/", StaticFiles(directory=frontend_dir, html=True), name="frontend")

@app.get("/health")
async def health_check():
    """
    Health check endpoint to verify the API is running
    """
    return {"status": "healthy", "version": app.version}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
