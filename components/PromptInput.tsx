import React, { useState } from 'react';
import { SpinnerIcon } from './icons/SpinnerIcon';

interface PromptInputProps {
  onSubmit: (prompt: string) => void;
  isLoading: boolean;
}

export const PromptInput: React.FC<PromptInputProps> = ({ onSubmit, isLoading }) => {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() && !isLoading) {
      onSubmit(prompt);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full flex flex-col space-y-4 bg-gray-950/50 p-6 rounded-lg border border-gray-800">
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="e.g., A photorealistic image of a red cat wearing a tiny hat, sitting on a stack of books..."
        className="w-full h-48 p-4 bg-gray-900 border border-gray-700 rounded-lg text-gray-300 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none transition-colors"
        disabled={isLoading}
        aria-label="Prompt input for image generation"
      />
      <button
        type="submit"
        disabled={isLoading || !prompt.trim()}
        className="w-full flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-950"
      >
        {isLoading ? (
            <>
                <SpinnerIcon className="w-5 h-5 mr-2"/>
                Generating...
            </>
        ) : 'Generate Image'}
      </button>
    </form>
  );
};
