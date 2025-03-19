import axios from 'axios';
import type { AnalysisResponse } from '../types';

// API base URL - change this to match your backend
const API_BASE_URL = 'http://localhost:8000/api';

/**
 * Upload and analyze resume PDFs
 * 
 * @param cleanResume - The clean resume PDF file
 * @param injectedResume - The injected resume PDF file
 * @returns Promise with analysis results
 */
export async function analyzeResumes(
  cleanResume: File,
  injectedResume: File
): Promise<AnalysisResponse> {
  try {
    const formData = new FormData();
    formData.append('clean_resume', cleanResume);
    formData.append('injected_resume', injectedResume);
    
    const response = await axios.post<AnalysisResponse>(
      `${API_BASE_URL}/analyze-resumes`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('Error analyzing resumes:', error);
    throw error;
  }
}

/**
 * Inject text into a resume PDF
 * 
 * @param file - The PDF file to inject into
 * @param injectionText - The text to inject
 * @returns Promise with the download URL
 */
export async function injectResume(
  file: File,
  injectionText: string
): Promise<{ injected_file_id: string; original_filename: string; download_url: string }> {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('injection_text', injectionText);
    
    const response = await axios.post(
      `${API_BASE_URL}/inject`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('Error injecting resume:', error);
    throw error;
  }
}

/**
 * Create a test resume with the provided text
 * 
 * @param resumeText - The text content for the resume
 * @returns Promise with the download URL for the created resume
 */
export async function createTestResume(
  resumeText: string
): Promise<{ file_id: string; filename: string; download_url: string }> {
  try {
    const formData = new FormData();
    formData.append('resume_text', resumeText);
    
    const response = await axios.post(
      `${API_BASE_URL}/create-test-resume`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('Error creating test resume:', error);
    throw error;
  }
}

/**
 * Get default injection text
 * 
 * @returns Promise with the default injection text
 */
export async function getDefaultInjectionText(): Promise<string> {
  try {
    const response = await axios.get(`${API_BASE_URL}/default-injection`);
    return response.data.default_text;
  } catch (error) {
    console.error('Error getting default injection text:', error);
    throw error;
  }
} 