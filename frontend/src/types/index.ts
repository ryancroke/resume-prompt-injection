// Resume evaluation types
export interface ResumeEvaluation {
    summary: string;
    strengths: string[];
    weaknesses: string[];
    overall_score: number;
    recommendation: string;
}

// API response types
export interface AnalysisResponse {
    clean_resume: {
        filename: string;
        evaluation: ResumeEvaluation;
    };
    injected_resume: {
        filename: string;
        evaluation: ResumeEvaluation;
    };
    comparison: ComparisonResult;
}

export interface ComparisonResult {
    differences: string[];
    injection_detected: string;
    security_concerns: string;
} 