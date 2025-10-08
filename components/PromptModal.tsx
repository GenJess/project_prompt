import React, { useState, useEffect, useCallback } from 'react';
import { ClipboardIcon } from './icons/ClipboardIcon';
import { XIcon } from './icons/XIcon';
import { JsonSyntaxHighlighter } from './JsonSyntaxHighlighter';

interface PromptModalProps {
  prompt: string;
  onClose: () => void;
}

export const PromptModal: React.FC<PromptModalProps> = ({ prompt, onClose }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
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

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  }, [onClose]);
  
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = 'unset';
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  return (
    <div 
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50 p-4 transition-opacity duration-300 animate-fadeIn"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="prompt-modal-title"
    >
      <div 
        className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl animate-scaleIn"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex justify-between items-center p-4 border-b border-gray-800 flex-shrink-0">
          <h2 id="prompt-modal-title" className="text-xl font-bold text-gray-200">Full Prompt</h2>
          <div className="flex items-center space-x-4">
              <button
                onClick={handleCopy}
                className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 text-sm text-gray-300 font-medium px-3 py-1.5 rounded-lg transition-colors"
              >
                <ClipboardIcon className="w-4 h-4" />
                <span>{copied ? 'Copied!' : 'Copy JSON'}</span>
              </button>
              <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors" aria-label="Close modal">
                  <XIcon className="w-6 h-6" />
              </button>
          </div>
        </header>
        <div className="relative flex-grow min-h-0 overflow-auto rounded-b-xl bg-gray-950">
          <JsonSyntaxHighlighter jsonString={prompt} />
        </div>
      </div>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-fadeIn { animation: fadeIn 0.2s ease-out; }
        .animate-scaleIn { animation: scaleIn 0.2s ease-out; }
      `}</style>
    </div>
  );
};