import React, { useState, useCallback } from 'react';
import { HomeIcon } from '../components/icons/HomeIcon';
import { DifficultySelector } from '../components/DifficultySelector';
import { ImageUploader } from '../components/ImageUploader';
import { PromptInput } from '../components/PromptInput';
import { ResultsDisplay } from '../components/ResultsDisplay';
import { SpinnerIcon } from '../components/icons/SpinnerIcon';
import { GlowCard } from '../components/ui/spotlight-card';
import {
  generateChallenge,
  generateImageFromUserPrompt,
  getScoreAndFeedback,
  generatePromptFromImage,
} from '../services/geminiService';
import { fileToBase64 } from '../utils/fileUtils';
import type { PromptAnalysisItem } from '../types';

type GameState = 'selection' | 'prompting' | 'loading' | 'results';

interface ImageState {
  dataUrl: string;
  base64: string;
  mimeType: string;
}

const LoadingOverlay: React.FC<{ message: string }> = ({ message }) => (
  <div className="absolute inset-0 bg-gray-950/80 backdrop-blur-sm flex flex-col items-center justify-center z-50">
    <SpinnerIcon className="w-12 h-12 text-indigo-400" />
    <p className="mt-4 text-lg text-gray-300 font-semibold">{message}</p>
  </div>
);

const GymPage: React.FC<{ onNavigateHome: () => void }> = ({ onNavigateHome }) => {
  const [gameState, setGameState] = useState<GameState>('selection');
  const [loadingMessage, setLoadingMessage] = useState('');
  const [error, setError] = useState('');

  const [referenceImage, setReferenceImage] = useState<ImageState | null>(null);
  const [targetPrompt, setTargetPrompt] = useState<string | null>(null);
  const [userPrompt, setUserPrompt] = useState<string>('');
  const [userGeneratedImage, setUserGeneratedImage] = useState<ImageState | null>(null);
  const [score, setScore] = useState<number | null>(null);
  const [analysis, setAnalysis] = useState<PromptAnalysisItem[] | null>(null);

  const handleError = (err: any, message: string) => {
    console.error(err);
    const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
    setError(`${message}: ${errorMessage}`);
    setGameState('selection'); // Reset to start on error
  };
  
  const handleDifficultySelect = useCallback(async (difficulty: string) => {
    setGameState('loading');
    setLoadingMessage('Generating your challenge...');
    setError('');
    try {
      const { prompt, base64, mimeType } = await generateChallenge(difficulty);
      setTargetPrompt(prompt);
      setReferenceImage({
        base64: base64,
        mimeType,
        dataUrl: `data:${mimeType};base64,${base64}`,
      });
      setGameState('prompting');
    } catch (err) {
      handleError(err, 'Failed to generate challenge');
    }
  }, []);

  const handleImageUpload = useCallback(async (file: File) => {
    setGameState('loading');
    setLoadingMessage('Analyzing your image...');
    setError('');
    try {
      const { base64, mimeType } = await fileToBase64(file);
      const dataUrl = `data:${mimeType};base64,${base64}`;
      const img = new Image();
      img.onload = async () => {
          const promptJson = await generatePromptFromImage(base64, mimeType, img.naturalWidth, img.naturalHeight);
          const parsedPrompt = JSON.parse(promptJson);

          // For uploaded images, the "target prompt" is a descriptive sentence.
          setTargetPrompt(parsedPrompt.description || 'A detailed image.');
          setReferenceImage({ base64, mimeType, dataUrl });
          setGameState('prompting');
      }
      img.onerror = () => { throw new Error("Could not load image to get dimensions.") }
      img.src = dataUrl;
    } catch (err) {
      handleError(err, 'Failed to process uploaded image');
    }
  }, []);

  const handlePromptSubmit = useCallback(async (prompt: string) => {
    if (!referenceImage || !targetPrompt) return;
    setUserPrompt(prompt);
    setGameState('loading');
    setError('');

    try {
      setLoadingMessage('Generating your image...');
      const userImg = await generateImageFromUserPrompt(prompt);
      const userImgState = { ...userImg, dataUrl: `data:${userImg.mimeType};base64,${userImg.base64}`};
      setUserGeneratedImage(userImgState);

      setLoadingMessage('Comparing images and analyzing prompts...');
      const results = await getScoreAndFeedback(referenceImage, userImg, targetPrompt, prompt);
      setScore(results.score);
      setAnalysis(results.analysis);
      setGameState('results');
    } catch (err) {
      handleError(err, 'Failed to complete evaluation');
    }
  }, [referenceImage, targetPrompt]);

  const handleReset = () => {
    setGameState('selection');
    setLoadingMessage('');
    setError('');
    setReferenceImage(null);
    setTargetPrompt(null);
    setUserPrompt('');
    setUserGeneratedImage(null);
    setScore(null);
    setAnalysis(null);
  };

  const renderContent = () => {
    switch (gameState) {
      case 'prompting':
        return (
          <div className="w-full h-full grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="flex flex-col items-center space-y-4">
              <h2 className="text-2xl font-bold text-gray-300">Reference Image</h2>
               {referenceImage && (
                 <GlowCard glowColor="purple" customSize className="w-full max-w-md aspect-square p-2 bg-transparent">
                  <img src={referenceImage.dataUrl} alt="Reference challenge" className="w-full h-full object-contain rounded-lg"/>
                 </GlowCard>
               )}
            </div>
            <div className="flex flex-col items-center space-y-4">
                <h2 className="text-2xl font-bold text-gray-300">Describe the Image</h2>
                <PromptInput onSubmit={handlePromptSubmit} isLoading={false} />
            </div>
          </div>
        );
      case 'results':
        return (referenceImage && userGeneratedImage && score !== null && analysis && targetPrompt) ? (
          <ResultsDisplay
            referenceImage={referenceImage}
            userGeneratedImage={userGeneratedImage}
            score={score}
            analysis={analysis}
            targetPrompt={targetPrompt}
            userPrompt={userPrompt}
            onReset={handleReset}
          />
        ) : <p>Error displaying results.</p>;
      case 'selection':
      default:
        return (
          <div className="w-full flex flex-col items-center space-y-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-100">Prompting Gym</h1>
            <p className="text-lg text-gray-400">Choose a difficulty or upload your own image to start.</p>
            {error && <p className="text-red-400 bg-red-900/20 border border-red-500/30 p-3 rounded-lg">{error}</p>}
            <DifficultySelector onSelect={handleDifficultySelect} isLoading={false} />
            <div className="flex items-center w-full max-w-2xl">
              <div className="flex-grow h-px bg-gray-700"></div>
              <span className="flex-shrink px-6 text-gray-500 font-medium">OR</span>
              <div className="flex-grow h-px bg-gray-700"></div>
            </div>
            <ImageUploader onImageUpload={handleImageUpload} isLoading={false} />
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-200 font-sans flex flex-col relative">
      {gameState === 'loading' && <LoadingOverlay message={loadingMessage} />}
      <header className="absolute top-4 left-4 z-10">
        <button
          onClick={gameState === 'prompting' || gameState === 'results' ? handleReset : onNavigateHome}
          className="flex items-center space-x-2 bg-gray-800/50 hover:bg-gray-700/70 backdrop-blur-sm text-sm text-gray-300 font-medium px-4 py-2 rounded-lg transition-colors"
          aria-label="Go to homepage"
        >
          <HomeIcon className="w-5 h-5" />
          <span>{gameState === 'prompting' || gameState === 'results' ? 'New Challenge' : 'Home'}</span>
        </button>
      </header>
      <main className="container mx-auto px-4 flex-1 flex items-center justify-center py-20">
        {renderContent()}
      </main>
    </div>
  );
};

export default GymPage;