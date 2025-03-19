import React, { useState, useRef } from 'react';

interface UploadFormProps {
  onUpload: (cleanFile: File, injectedFile: File) => void;
  isLoading: boolean;
}

const UploadForm: React.FC<UploadFormProps> = ({ onUpload, isLoading }) => {
  const [cleanFile, setCleanFile] = useState<File | null>(null);
  const [injectedFile, setInjectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const handleCleanFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    if (selectedFile && !selectedFile.name.endsWith('.pdf')) {
      setError('Only PDF files are accepted');
      return;
    }
    setCleanFile(selectedFile);
    setError(null);
  };
  
  const handleInjectedFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    if (selectedFile && !selectedFile.name.endsWith('.pdf')) {
      setError('Only PDF files are accepted');
      return;
    }
    setInjectedFile(selectedFile);
    setError(null);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!cleanFile || !injectedFile) {
      setError('Please select both clean and injected resume PDFs');
      return;
    }
    
    try {
      onUpload(cleanFile, injectedFile);
    } catch (err) {
      setError(`Upload failed: ${err instanceof Error ? err.message : String(err)}`);
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4">Upload Resumes</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Clean Resume (PDF)</label>
          <input
            type="file"
            accept=".pdf"
            onChange={handleCleanFileChange}
            className="w-full px-3 py-2 border border-gray-300 rounded"
            disabled={isLoading}
          />
          {cleanFile && (
            <p className="mt-1 text-sm text-gray-500">Selected: {cleanFile.name}</p>
          )}
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Injected Resume (PDF)</label>
          <input
            type="file"
            accept=".pdf"
            onChange={handleInjectedFileChange}
            className="w-full px-3 py-2 border border-gray-300 rounded"
            disabled={isLoading}
          />
          {injectedFile && (
            <p className="mt-1 text-sm text-gray-500">Selected: {injectedFile.name}</p>
          )}
        </div>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>
        )}
        
        <button
          type="submit"
          disabled={isLoading || !cleanFile || !injectedFile}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-300"
        >
          {isLoading ? 'Analyzing...' : 'Analyze Resumes'}
        </button>
      </form>
    </div>
  );
};

export default UploadForm; 