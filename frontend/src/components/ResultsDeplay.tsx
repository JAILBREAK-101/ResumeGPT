import React from 'react';
import { 
  CheckCircle,
  AlertTriangle, 
  XCircle,
  Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ResumeAnalysisResult {
  score: number;
  feedback: {
    strengths: string[];
    weaknesses: string[];
    suggestions: string[];
  };
  keywords: string[];
  matchScore: number;
  jobTitle?: string;
}

interface ResultsDisplayProps {
  results: ResumeAnalysisResult | null;
  isLoading: boolean;
  error?: string;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ results, isLoading, error }) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
        <div className="flex items-center gap-2">
          <XCircle className="h-5 w-5" />
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!results) return null;

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 80) return <CheckCircle className="h-5 w-5 text-green-600" />;
    if (score >= 60) return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
    return <XCircle className="h-5 w-5 text-red-600" />;
  };

  return (
    <div className="my-8">
      <div className="bg-white rounded-lg shadow-lg p-6">
        {results.jobTitle && (
          <h2 className="text-2xl font-semibold mb-6">
            Analysis Results for: {results.jobTitle}
          </h2>
        )}

        <div className="flex items-center mb-6">
          <h3 className="text-xl font-medium">Overall Score: </h3>
          <div className="flex items-center ml-3">
            {getScoreIcon(results.score)}
            <span className={cn('ml-2 font-semibold', getScoreColor(results.score))}>
              {results.score}%
            </span>
          </div>
        </div>

        <div className="space-y-6">
          {/* Strengths Section */}
          <div>
            <h3 className="text-lg font-medium text-blue-600 mb-2">
              Key Strengths
            </h3>
            <ul className="space-y-2">
              {results.feedback.strengths.map((strength, index) => (
                <li key={`strength-${index}`} className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span>{strength}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Weaknesses Section */}
          <div>
            <h3 className="text-lg font-medium text-red-600 mb-2">
              Areas for Improvement
            </h3>
            <ul className="space-y-2">
              {results.feedback.weaknesses.map((weakness, index) => (
                <li key={`weakness-${index}`} className="flex items-start">
                  <span className="text-red-600 mr-2">•</span>
                  <span>{weakness}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Suggestions Section */}
          <div>
            <h3 className="text-lg font-medium text-blue-600 mb-2">
              Suggestions
            </h3>
            <ul className="space-y-2">
              {results.feedback.suggestions.map((suggestion, index) => (
                <li key={`suggestion-${index}`} className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span>{suggestion}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Keywords Section */}
          <div>
            <h3 className="text-lg font-medium mb-2">
              Relevant Keywords Found
            </h3>
            <div className="flex flex-wrap gap-2">
              {results.keywords.map((keyword, index) => (
                <span
                  key={`keyword-${index}`}
                  className="px-3 py-1 rounded-full text-sm bg-blue-50 text-blue-600 border border-blue-200"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>

          {/* Match Score Section */}
          <div>
            <h3 className="text-lg font-medium mb-2">
              Job Match Score
            </h3>
            <div className="flex items-center">
              {getScoreIcon(results.matchScore)}
              <span className={cn('ml-2', getScoreColor(results.matchScore))}>
                {results.matchScore}% match with job requirements
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsDisplay;