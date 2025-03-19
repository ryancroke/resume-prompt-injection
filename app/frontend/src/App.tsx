import React, { useState } from 'react';
import UploadForm from './components/UploadForm';
import InjectionEditor from './components/InjectionEditor';
import ResultsDisplay from './components/ResultsDisplay';
import ErrorBoundary from './components/ErrorBoundary';
import { analyzeResumes, injectResume } from './services/api';
import type { AnalysisResponse } from './types';

function App() {
  const [results, setResults] = useState<AnalysisResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [injectionText, setInjectionText] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async (cleanFile: File, injectedFile: File) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await analyzeResumes(cleanFile, injectedFile);
      setResults(data);
    } catch (err) {
      setError(`Analysis failed: ${err instanceof Error ? err.message : String(err)}`);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInject = async (file: File, text: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await injectResume(file, text);
      
      // Automatically download the injected file
      window.location.href = result.download_url;
      
    } catch (err) {
      setError(`Injection failed: ${err instanceof Error ? err.message : String(err)}`);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-5xl">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">Resume Prompt Injection Demo</h1>
          <p className="text-gray-600">
            Demonstrate how prompt injection can manipulate AI-based resume screening systems
          </p>
        </header>
        
        {error && (
          <div className="mb-6 p-4 bg-red-100 text-red-700 rounded">{error}</div>
        )}
        
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Step 1: Create an Injected Resume</h2>
          <InjectionEditor 
            onChange={setInjectionText} 
            onInject={handleInject}
            isLoading={isLoading}
          />
        </div>
        
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Step 2: Analyze Resumes</h2>
          <UploadForm onUpload={handleUpload} isLoading={isLoading} />
        </div>
        
        {results && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Step 3: Review Results</h2>
            <ErrorBoundary>
              <ResultsDisplay results={results} />
            </ErrorBoundary>
          </div>
        )}
      </div>
    </div>
  );
}

export default App; 