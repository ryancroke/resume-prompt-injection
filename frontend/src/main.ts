import './styles.css';
import { analyzeResumes } from './services/api';
import type { AnalysisResponse, ResumeEvaluation } from './types';

// DOM Elements
const resumeForm = document.getElementById('resume-form') as HTMLFormElement;
const cleanResumeInput = document.getElementById('clean-resume') as HTMLInputElement;
const injectedResumeInput = document.getElementById('injected-resume') as HTMLInputElement;
const cleanResumeName = document.getElementById('clean-resume-name') as HTMLSpanElement;
const injectedResumeName = document.getElementById('injected-resume-name') as HTMLSpanElement;
const analyzeButton = document.getElementById('analyze-button') as HTMLButtonElement;
const resetButton = document.getElementById('reset-button') as HTMLButtonElement;
const uploadContainer = document.getElementById('upload-container') as HTMLDivElement;
const loadingContainer = document.getElementById('loading') as HTMLDivElement;
const resultsContainer = document.getElementById('results-container') as HTMLDivElement;
const cleanResultsContainer = document.getElementById('clean-results') as HTMLDivElement;
const injectedResultsContainer = document.getElementById('injected-results') as HTMLDivElement;
const comparisonResultsContainer = document.getElementById('comparison-results') as HTMLDivElement;

// File input change handlers
cleanResumeInput.addEventListener('change', (event) => {
  const files = (event.target as HTMLInputElement).files;
  if (files && files.length > 0) {
    cleanResumeName.textContent = files[0].name;
  } else {
    cleanResumeName.textContent = 'No file selected';
  }
});

injectedResumeInput.addEventListener('change', (event) => {
  const files = (event.target as HTMLInputElement).files;
  if (files && files.length > 0) {
    injectedResumeName.textContent = files[0].name;
  } else {
    injectedResumeName.textContent = 'No file selected';
  }
});

// Form submission handler
resumeForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  
  const cleanResumeFile = cleanResumeInput.files?.[0];
  const injectedResumeFile = injectedResumeInput.files?.[0];
  
  if (!cleanResumeFile || !injectedResumeFile) {
    alert('Please select both resume files');
    return;
  }
  
  // Show loading state
  uploadContainer.classList.add('hidden');
  loadingContainer.classList.remove('hidden');
  
  try {
    const results = await analyzeResumes(cleanResumeFile, injectedResumeFile);
    displayResults(results);
  } catch (error) {
    console.error('Analysis error:', error);
    alert('An error occurred during analysis. Please try again.');
    
    // Return to upload form
    uploadContainer.classList.remove('hidden');
    loadingContainer.classList.add('hidden');
  }
});

// Reset button handler
resetButton.addEventListener('click', () => {
  resultsContainer.classList.add('hidden');
  uploadContainer.classList.remove('hidden');
  resumeForm.reset();
  cleanResumeName.textContent = 'No file selected';
  injectedResumeName.textContent = 'No file selected';
});

/**
 * Display results in the UI
 */
function displayResults(results: AnalysisResponse): void {
  // Hide loading, show results
  loadingContainer.classList.add('hidden');
  resultsContainer.classList.remove('hidden');
  
  // Clear previous results
  cleanResultsContainer.innerHTML = '';
  injectedResultsContainer.innerHTML = '';
  comparisonResultsContainer.innerHTML = '';
  
  // Process results
  try {
    // Clean resume evaluation - assuming JSON string needs to be parsed
    let cleanEval: ResumeEvaluation;
    let injectedEval: ResumeEvaluation;
    
    try {
      cleanEval = typeof results.clean_resume.evaluation === 'string' 
        ? JSON.parse(results.clean_resume.evaluation) 
        : results.clean_resume.evaluation;
        
      injectedEval = typeof results.injected_resume.evaluation === 'string' 
        ? JSON.parse(results.injected_resume.evaluation) 
        : results.injected_resume.evaluation;
    } catch (e) {
      console.error('Error parsing evaluation JSON:', e);
      cleanEval = results.clean_resume.evaluation as unknown as ResumeEvaluation;
      injectedEval = results.injected_resume.evaluation as unknown as ResumeEvaluation;
    }
    
    // Display clean resume results
    displayEvaluation(cleanResultsContainer, cleanEval);
    
    // Display injected resume results
    displayEvaluation(injectedResultsContainer, injectedEval);
    
    // Display comparison
    displayComparison(comparisonResultsContainer, results.comparison);
    
  } catch (error) {
    console.error('Error displaying results:', error);
    comparisonResultsContainer.innerHTML = '<p class="text-red-600">Error displaying results</p>';
  }
}

/**
 * Display a resume evaluation
 */
function displayEvaluation(container: HTMLElement, evaluation: ResumeEvaluation): void {
  // Create elements for each part of the evaluation
  const summaryEl = document.createElement('div');
  summaryEl.innerHTML = `
    <h4 class="font-medium text-gray-800">Summary</h4>
    <p class="text-gray-700 mt-1">${evaluation.summary}</p>
  `;
  
  const strengthsEl = document.createElement('div');
  strengthsEl.innerHTML = `
    <h4 class="font-medium text-gray-800">Strengths</h4>
    <ul class="list-disc pl-5 mt-1 text-gray-700">
      ${evaluation.strengths.map(strength => `<li>${strength}</li>`).join('')}
    </ul>
  `;
  
  const weaknessesEl = document.createElement('div');
  weaknessesEl.innerHTML = `
    <h4 class="font-medium text-gray-800">Areas for Improvement</h4>
    <ul class="list-disc pl-5 mt-1 text-gray-700">
      ${evaluation.weaknesses.map(weakness => `<li>${weakness}</li>`).join('')}
    </ul>
  `;
  
  const scoreEl = document.createElement('div');
  scoreEl.classList.add('flex', 'justify-between', 'items-center', 'mt-4', 'pt-4', 'border-t', 'border-gray-200');
  
  // Create score display with color based on score
  let scoreColorClass = 'text-yellow-600';
  if (evaluation.overall_score >= 8) {
    scoreColorClass = 'text-green-600';
  } else if (evaluation.overall_score <= 4) {
    scoreColorClass = 'text-red-600';
  }
  
  scoreEl.innerHTML = `
    <div>
      <span class="font-medium text-gray-800">Overall Score:</span>
      <span class="ml-2 ${scoreColorClass} font-bold">${evaluation.overall_score}/10</span>
    </div>
    <div>
      <span class="font-medium text-gray-800">Recommendation:</span>
      <span class="ml-2 font-medium ${evaluation.recommendation.toLowerCase() === 'yes' ? 'text-green-600' : evaluation.recommendation.toLowerCase() === 'no' ? 'text-red-600' : 'text-yellow-600'}">
        ${evaluation.recommendation}
      </span>
    </div>
  `;
  
  // Add all elements to container
  container.appendChild(summaryEl);
  container.appendChild(strengthsEl);
  container.appendChild(weaknessesEl);
  container.appendChild(scoreEl);
}

/**
 * Display the comparison analysis
 */
function displayComparison(container: HTMLElement, comparison: AnalysisResponse['comparison']): void {
  // Create heading
  const heading = document.createElement('h4');
  heading.className = 'font-medium text-gray-800 mb-2';
  heading.textContent = 'Detected Differences';
  
  // Create differences list
  const differencesList = document.createElement('ul');
  differencesList.className = 'list-disc pl-5 text-gray-700 mb-4';
  differencesList.innerHTML = comparison.differences.map(diff => `<li>${diff}</li>`).join('');
  
  // Create injection analysis
  const injectionAnalysis = document.createElement('div');
  injectionAnalysis.className = 'bg-orange-50 border border-orange-200 rounded-md p-4 mb-4';
  injectionAnalysis.innerHTML = `
    <h4 class="font-medium text-orange-800 mb-1">Prompt Injection Analysis</h4>
    <p class="text-orange-700">${comparison.injection_detected}</p>
  `;
  
  // Create security concerns
  const securityConcerns = document.createElement('div');
  securityConcerns.className = 'bg-red-50 border border-red-200 rounded-md p-4';
  securityConcerns.innerHTML = `
    <h4 class="font-medium text-red-800 mb-1">Security Concerns</h4>
    <p class="text-red-700">${comparison.security_concerns}</p>
  `;
  
  // Add all elements to container
  container.appendChild(heading);
  container.appendChild(differencesList);
  container.appendChild(injectionAnalysis);
  container.appendChild(securityConcerns);
} 