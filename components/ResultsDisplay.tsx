import React from 'react';
import { PromptAnalysis } from './PromptAnalysis';
import type { PromptAnalysisItem } from '../types';

interface ImageState {
  dataUrl: string;
}

interface ResultsDisplayProps {
  referenceImage: ImageState;
  userGeneratedImage: ImageState;
  score: number;
  analysis: PromptAnalysisItem[];
  targetPrompt: string;
  userPrompt: string;
  onReset: () => void;
}

const getScoreColor = (score: number) => {
  if (score >= 80) return 'text-green-400';
  if (score >= 50) return 'text-yellow-400';
  return 'text-red-400';
};

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({
  referenceImage,
  userGeneratedImage,
  score,
  analysis,
  targetPrompt,
  userPrompt,
  onReset,
}) => {
  return (
    <div className="w-full max-w-7xl mx-auto animate-fadeIn space-y-8">
      {/* Top Section: Score + CTA */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className={`text-center sm:text-left`}>
          <p className="text-lg font-medium text-gray-400">Your Match Score</p>
          <p className={`text-7xl font-bold ${getScoreColor(score)}`}>{score}%</p>
        </div>
        <button
          onClick={onReset}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-lg transition-colors duration-200 text-lg"
        >
          Play Again
        </button>
      </div>

      {/* Main Content: Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Image Comparison */}
        <div className="space-y-4 bg-gray-900/50 border border-gray-800 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-center text-gray-300">Image Comparison</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
            <div>
              <p className="text-center font-semibold mb-2">Reference</p>
              <img src={referenceImage.dataUrl} alt="Reference" className="rounded-lg border-2 border-gray-700 w-full" />
            </div>
            <div>
              <p className="text-center font-semibold mb-2">Your Generation</p>
              <img src={userGeneratedImage.dataUrl} alt="User generated" className="rounded-lg border-2 border-indigo-500/50 w-full" />
            </div>
          </div>
        </div>

        {/* Right Column: Prompt Analysis */}
        <div className="space-y-4">
           <PromptAnalysis 
             targetPrompt={targetPrompt}
             userPrompt={userPrompt}
             analysis={analysis}
           />
        </div>
      </div>
      
       <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.5s ease-out forwards; }
      `}</style>
    </div>
  );
};