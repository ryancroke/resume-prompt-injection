// Resume interfaces
export interface ResumeFile {
    filename: string;
    content?: string;
    text_content?: string;
    evaluation: ResumeEvaluation;
}

export interface ResumeEvaluation {
    overall_score?: number;
    summary?: string;
    strengths?: string[];
    weaknesses?: string[];
    recommendation?: string;
    
    // These fields may be present in some API responses
    technical_skills?: {
        score: number;
        feedback: string;
    };
    work_experience?: {
        score: number;
        feedback: string;
    };
    education?: {
        score: number;
        feedback: string;
    };
    overall?: {
        score: number;
        feedback: string;
    };
    feedback?: string;
    _meta?: Record<string, any>;
}

// PDF comparison interfaces
export interface PDFComparisonResult {
    hidden_text?: string;
    visible_text_similarity?: number;
    metadata_differences?: string[];
    suspicious_elements?: string[];
}

// Score difference interfaces
export interface ScoreDifference {
    clean_score: number;
    injected_score: number;
    difference: number;
}

export interface EvaluationComparisonResult {
    score_differences?: Record<string, ScoreDifference>;
    average_difference?: number;
    injection_likely_succeeded?: boolean;
    analysis?: string;
}

// API response interfaces
export interface AnalysisResponse {
    clean_resume: ResumeFile;
    injected_resume: ResumeFile;
    
    // New structure
    pdf_comparison?: PDFComparisonResult;
    evaluation_comparison?: EvaluationComparisonResult;
    
    // Legacy structure for backward compatibility
    comparison?: ComparisonResult;
}

// Legacy comparison result interface for backward compatibility
export interface ComparisonResult {
    injection_detected?: string;
    security_concerns?: string;
    score_difference?: number;
    analysis?: string;
}

// Injection API response
export interface InjectionResponse {
    success: boolean;
    download_url: string;
    message?: string;
} 