import React from 'react';
import type { AnalysisResponse } from '../types';

interface ResultsDisplayProps {
  results: AnalysisResponse | null;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ results }) => {
  if (!results) {
    return null;
  }
  
  const { clean_resume, injected_resume, pdf_comparison = {}, evaluation_comparison = {} } = results;
  
  // Calculate score difference for visualization
  const cleanScore = clean_resume.evaluation.overall_score || 0;
  const injectedScore = injected_resume.evaluation.overall_score || 0;
  const scoreDiff = injectedScore - cleanScore;
  const scoreDiffClass = scoreDiff > 0 
    ? 'text-green-600' 
    : scoreDiff < 0 
      ? 'text-red-600' 
      : 'text-gray-600';

  // Add defensive checks for array properties
  const cleanStrengths = clean_resume.evaluation.strengths || [];
  const cleanWeaknesses = clean_resume.evaluation.weaknesses || [];
  const injectedStrengths = injected_resume.evaluation.strengths || [];
  const injectedWeaknesses = injected_resume.evaluation.weaknesses || [];
  
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Analysis Results</h2>
      
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2">Injection Analysis</h3>
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded">
          <p className="font-semibold mb-1">Injection Detection:</p>
          <p>{evaluation_comparison.injection_likely_succeeded ? 
            "Injection likely succeeded" : 
            "No significant injection detected"}</p>
          
          {evaluation_comparison.analysis && (
            <>
              <p className="font-semibold mt-3 mb-1">Analysis:</p>
              <p>{evaluation_comparison.analysis}</p>
            </>
          )}
          
          {evaluation_comparison.average_difference !== undefined && (
            <>
              <p className="font-semibold mt-3 mb-1">Average Score Difference:</p>
              <p>{evaluation_comparison.average_difference} points</p>
            </>
          )}
          
          {pdf_comparison.hidden_text && (
            <>
              <p className="font-semibold mt-3 mb-1">Hidden Text Detected:</p>
              <p className="text-sm">{pdf_comparison.hidden_text}</p>
            </>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Clean Resume Evaluation */}
        <div className="border rounded p-4">
          <h3 className="text-lg font-medium mb-2">Clean Resume</h3>
          <p className="text-sm text-gray-500 mb-3">{clean_resume.filename}</p>
          
          <div className="mb-3">
            <p className="font-semibold">Overall Score:</p>
            <div className="text-2xl">{cleanScore}/10</div>
          </div>
          
          {clean_resume.evaluation.summary && (
            <div className="mb-3">
              <p className="font-semibold mb-1">Summary:</p>
              <p>{clean_resume.evaluation.summary}</p>
            </div>
          )}
          
          {cleanStrengths.length > 0 && (
            <div className="mb-3">
              <p className="font-semibold mb-1">Strengths:</p>
              <ul className="list-disc pl-5">
                {cleanStrengths.map((strength, i) => (
                  <li key={i}>{strength}</li>
                ))}
              </ul>
            </div>
          )}
          
          {cleanWeaknesses.length > 0 && (
            <div className="mb-3">
              <p className="font-semibold mb-1">Weaknesses:</p>
              <ul className="list-disc pl-5">
                {cleanWeaknesses.map((weakness, i) => (
                  <li key={i}>{weakness}</li>
                ))}
              </ul>
            </div>
          )}
          
          {clean_resume.evaluation.recommendation && (
            <div>
              <p className="font-semibold mb-1">Recommendation:</p>
              <p>{clean_resume.evaluation.recommendation}</p>
            </div>
          )}
        </div>
        
        {/* Injected Resume Evaluation */}
        <div className="border rounded p-4">
          <h3 className="text-lg font-medium mb-2">Injected Resume</h3>
          <p className="text-sm text-gray-500 mb-3">{injected_resume.filename}</p>
          
          <div className="mb-3">
            <p className="font-semibold">Overall Score:</p>
            <div className="flex items-center">
              <div className="text-2xl">{injectedScore}/10</div>
              {scoreDiff !== 0 && (
                <div className={`ml-2 ${scoreDiffClass}`}>
                  ({scoreDiff > 0 ? '+' : ''}{scoreDiff})
                </div>
              )}
            </div>
          </div>
          
          {injected_resume.evaluation.summary && (
            <div className="mb-3">
              <p className="font-semibold mb-1">Summary:</p>
              <p>{injected_resume.evaluation.summary}</p>
            </div>
          )}
          
          {injectedStrengths.length > 0 && (
            <div className="mb-3">
              <p className="font-semibold mb-1">Strengths:</p>
              <ul className="list-disc pl-5">
                {injectedStrengths.map((strength, i) => (
                  <li key={i}>{strength}</li>
                ))}
              </ul>
            </div>
          )}
          
          {injectedWeaknesses.length > 0 && (
            <div className="mb-3">
              <p className="font-semibold mb-1">Weaknesses:</p>
              <ul className="list-disc pl-5">
                {injectedWeaknesses.map((weakness, i) => (
                  <li key={i}>{weakness}</li>
                ))}
              </ul>
            </div>
          )}
          
          {injected_resume.evaluation.recommendation && (
            <div>
              <p className="font-semibold mb-1">Recommendation:</p>
              <p>{injected_resume.evaluation.recommendation}</p>
            </div>
          )}
        </div>
      </div>
      
      {evaluation_comparison.score_differences && Object.keys(evaluation_comparison.score_differences).length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-medium mb-2">Score Differences</h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2 text-left">Category</th>
                  <th className="border p-2 text-left">Clean Score</th>
                  <th className="border p-2 text-left">Injected Score</th>
                  <th className="border p-2 text-left">Difference</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(evaluation_comparison.score_differences).map(([category, diff]) => (
                  <tr key={category}>
                    <td className="border p-2 capitalize">{category.replace('_', ' ')}</td>
                    <td className="border p-2">{diff.clean_score}</td>
                    <td className="border p-2">{diff.injected_score}</td>
                    <td className={`border p-2 ${diff.difference > 0 ? 'text-green-600' : diff.difference < 0 ? 'text-red-600' : ''}`}>
                      {diff.difference > 0 ? '+' : ''}{diff.difference}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultsDisplay; 