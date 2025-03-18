import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch
from backend.main import app

client = TestClient(app)

@pytest.mark.parametrize("file_extension, expected_status_code", [
    ("txt", 400),  # Non-PDF file
    ("jpg", 400),  # Non-PDF file
])
def test_invalid_file_extension(file_extension, expected_status_code):
    """
    Test that uploading a non-PDF file results in a 400 HTTPException.
    """
    file_content = b"Sample content"
    response = client.post(
        "/api/analyze-resumes",
        files={
            "clean_resume": (f"resume.{file_extension}", file_content, f"application/{file_extension}"),
            "injected_resume": (f"resume.{file_extension}", file_content, f"application/{file_extension}"),
        },
    )
    assert response.status_code == expected_status_code
    assert response.json()["detail"] == "Only PDF files are accepted"

@patch("backend.services.pdf_service.extract_text_from_pdf")
def test_empty_file_upload(mock_extract_text):
    """
    Test that uploading an empty file results in appropriate error handling.
    """
    # Mock extract_text_from_pdf to return an empty string for empty files
    mock_extract_text.return_value = ""

    empty_file_content = b""
    response = client.post(
        "/api/analyze-resumes",
        files={
            "clean_resume": ("resume.pdf", empty_file_content, "application/pdf"),
            "injected_resume": ("resume.pdf", empty_file_content, "application/pdf"),
        },
    )
    assert response.status_code == 422
    assert "Failed to extract text from one or both PDFs" in response.json()["detail"]
