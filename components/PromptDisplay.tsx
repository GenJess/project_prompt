import React, { useState, useEffect } from 'react';
import { JsonSyntaxHighlighter } from './JsonSyntaxHighlighter';
import { ClipboardIcon } from './icons/ClipboardIcon';

interface PromptDisplayProps {
  prompt: string;
  isLoading: boolean;
  error: string;
  onViewFull: () => void;
}

const LoadingSkeleton: React.FC = () => (
  <div className="space-y-3 animate-pulse w-full">
    <div className="h-4 bg-gray-800 rounded w-1/3"></div>
    <div className="h-4 bg-gray-800 rounded w-1/2"></div>
    <div className="h-4 bg-gray-800 rounded w-2/4"></div>
    <div className="h-4 bg-gray-800 rounded w-3/5"></div>
    <div className="h-4 bg-gray-800 rounded w-1/3"></div>
    <div className="h-4 bg-gray-800 rounded w-1/2"></div>
  </div>
);

export const PromptDisplay: React.FC<PromptDisplayProps> = ({ prompt, isLoading, error, onViewFull }) => {
  const [copied, setCopied] = useState(false);
  const hasContent = !isLoading && !error && prompt;

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevents the modal from opening when copy is clicked
    if (!prompt) return;
    navigator.clipboard.writeText(prompt);
    setCopied(true);
  };

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  return (
    <div 
      className="p-4 h-full flex flex-col"
      onClick={hasContent ? onViewFull : undefined}
      style={{ cursor: hasContent ? 'pointer' : 'default' }}
    >
      <div className="flex justify-between items-center mb-4 flex-shrink-0">
        <h2 className="text-2xl font-bold text-gray-200">Generated Prompt</h2>
         {hasContent && (
          <button 
            onClick={handleCopy}
            className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 text-sm text-gray-300 font-medium px-3 py-1.5 rounded-lg transition-colors z-10"
          >
            <ClipboardIcon className="w-4 h-4" />
            <span>{copied ? 'Copied!' : 'Copy'}</span>
          </button>
         )}
      </div>
      <div className="relative flex-grow min-h-0 bg-gray-950/70 rounded-lg overflow-y-auto">
        <div className="p-4 h-full">
            {isLoading && <LoadingSkeleton />}
            {error && !isLoading && <div className="text-red-400 text-center">{error}</div>}
            {hasContent && <JsonSyntaxHighlighter jsonString={prompt} />}
            {!isLoading && !error && !prompt && (
                <div className="text-center text-gray-600 h-full flex items-center justify-center">
                    <p>Your generated prompt will appear here...</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};