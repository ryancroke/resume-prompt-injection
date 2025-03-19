import React from 'react';
import type { AnalysisResponse } from '../types';

interface ResultsDisplayProps {
  results: AnalysisResponse | null;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ results }) => {
  if (!results) {
    return null;
  }
  
  const { clean_resume, injected_resume, comparison } = results;
  
  // Calculate score difference for visualization
  const scoreDiff = injected_resume.evaluation.overall_score - clean_resume.evaluation.overall_score;
  const scoreDiffClass = scoreDiff > 0 
    ? 'text-green-600' 
    : scoreDiff < 0 
      ? 'text-red-600' 
      : 'text-gray-600';
  
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Analysis Results</h2>
      
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2">Injection Analysis</h3>
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded">
          <p className="font-semibold mb-1">Injection Detected:</p>
          <p>{comparison.injection_detected}</p>
          
          <p className="font-semibold mt-3 mb-1">Security Concerns:</p>
          <p>{comparison.security_concerns}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Clean Resume Evaluation */}
        <div className="border rounded p-4">
          <h3 className="text-lg font-medium mb-2">Clean Resume</h3>
          <p className="text-sm text-gray-500 mb-3">{clean_resume.filename}</p>
          
          <div className="mb-3">
            <p className="font-semibold">Overall Score:</p>
            <div className="text-2xl">{clean_resume.evaluation.overall_score}/10</div>
          </div>
          
          <div className="mb-3">
            <p className="font-semibold mb-1">Summary:</p>
            <p>{clean_resume.evaluation.summary}</p>
          </div>
          
          <div className="mb-3">
            <p className="font-semibold mb-1">Strengths:</p>
            <ul className="list-disc pl-5">
              {clean_resume.evaluation.strengths.map((strength, i) => (
                <li key={i}>{strength}</li>
              ))}
            </ul>
          </div>
          
          <div className="mb-3">
            <p className="font-semibold mb-1">Weaknesses:</p>
            <ul className="list-disc pl-5">
              {clean_resume.evaluation.weaknesses.map((weakness, i) => (
                <li key={i}>{weakness}</li>
              ))}
            </ul>
          </div>
          
          <div>
            <p className="font-semibold mb-1">Recommendation:</p>
            <p>{clean_resume.evaluation.recommendation}</p>
          </div>
        </div>
        
        {/* Injected Resume Evaluation */}
        <div className="border rounded p-4">
          <h3 className="text-lg font-medium mb-2">Injected Resume</h3>
          <p className="text-sm text-gray-500 mb-3">{injected_resume.filename}</p>
          
          <div className="mb-3">
            <p className="font-semibold">Overall Score:</p>
            <div className="flex items-center">
              <div className="text-2xl">{injected_resume.evaluation.overall_score}/10</div>
              {scoreDiff !== 0 && (
                <div className={`ml-2 ${scoreDiffClass}`}>
                  ({scoreDiff > 0 ? '+' : ''}{scoreDiff})
                </div>
              )}
            </div>
          </div>
          
          <div className="mb-3">
            <p className="font-semibold mb-1">Summary:</p>
            <p>{injected_resume.evaluation.summary}</p>
          </div>
          
          <div className="mb-3">
            <p className="font-semibold mb-1">Strengths:</p>
            <ul className="list-disc pl-5">
              {injected_resume.evaluation.strengths.map((strength, i) => (
                <li key={i}>{strength}</li>
              ))}
            </ul>
          </div>
          
          <div className="mb-3">
            <p className="font-semibold mb-1">Weaknesses:</p>
            <ul className="list-disc pl-5">
              {injected_resume.evaluation.weaknesses.map((weakness, i) => (
                <li key={i}>{weakness}</li>
              ))}
            </ul>
          </div>
          
          <div>
            <p className="font-semibold mb-1">Recommendation:</p>
            <p>{injected_resume.evaluation.recommendation}</p>
          </div>
        </div>
      </div>
      
      <div className="mt-6">
        <h3 className="text-lg font-medium mb-2">Identified Differences</h3>
        <ul className="list-disc pl-5">
          {comparison.differences.map((diff, i) => (
            <li key={i} className="mb-1">{diff}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ResultsDisplay;
