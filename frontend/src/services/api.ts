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