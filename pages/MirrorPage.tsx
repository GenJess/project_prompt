import React, { useState, useCallback } from 'react';
import { ImageUploader } from '../components/ImageUploader';
import { ImageDisplay } from '../components/ImageDisplay';
import { PromptDisplay } from '../components/PromptDisplay';
import { generatePromptFromImage } from '../services/geminiService';
import { fileToBase64 } from '../utils/fileUtils';
import type { SelectedFile } from '../types';
import { PromptModal } from '../components/PromptModal';
import { GlowCard } from '../components/ui/spotlight-card';
import { HomeIcon } from '../components/icons/HomeIcon';
import Hyperspeed from '../components/ui/Hyperspeed';
import { hyperspeedPresets } from '../components/ui/hyperspeedPresets';

interface MirrorPageProps {
  onNavigateHome: () => void;
}

const MirrorPage: React.FC<MirrorPageProps> = ({ onNavigateHome }) => {
  const [selectedFile, setSelectedFile] = useState<SelectedFile | null>(null);
  const [generatedPrompt, setGeneratedPrompt] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [isPromptModalOpen, setIsPromptModalOpen] = useState<boolean>(false);

  const handleImageUpload = useCallback(async (file: File) => {
    setIsLoading(true);
    setError('');
    setGeneratedPrompt('');

    const dataUrl = URL.createObjectURL(file);
    const img = new Image();
    img.onload = async () => {
      setSelectedFile({
        name: file.name,
        type: file.type,
        size: file.size,
        dataUrl: dataUrl,
        width: img.naturalWidth,
        height: img.naturalHeight
      });

      try {
        const { base64, mimeType } = await fileToBase64(file);
        const prompt = await generatePromptFromImage(base64, mimeType, img.naturalWidth, img.naturalHeight);
        const parsedPrompt = JSON.parse(prompt);
        setGeneratedPrompt(JSON.stringify(parsedPrompt, null, 2));
      } catch (err) {
        console.error(err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred. Check the console for details.');
      } finally {
        setIsLoading(false);
      }
    };
    img.onerror = () => {
        setError("Failed to load image details. Please try another file.");
        setIsLoading(false);
        URL.revokeObjectURL(dataUrl);
    };
    img.src = dataUrl;
  }, []);
  
  const resetState = () => {
    if (selectedFile?.dataUrl.startsWith('blob:')) {
      URL.revokeObjectURL(selectedFile.dataUrl);
    }
    setSelectedFile(null);
    setGeneratedPrompt('');
    setError('');
    setIsLoading(false);
    setIsPromptModalOpen(false);
  };

  return (
    <div className="relative min-h-screen w-full bg-black text-gray-200 font-sans flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-0 -z-10 pointer-events-none">
            <Hyperspeed effectOptions={hyperspeedPresets.two} />
        </div>
        <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-10 left-1/2 size-full -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(129,140,248,0.15),transparent_50%)] blur-[60px]"
        />
        <div className="relative z-10 container mx-auto px-4 flex flex-col w-full" style={{height: '100vh'}}>
            <header className="text-center py-8 flex-shrink-0 relative">
            <div className="absolute top-8 left-0">
                <button
                onClick={onNavigateHome}
                className="flex items-center space-x-2 bg-gray-800/50 hover:bg-gray-700/70 backdrop-blur-sm text-sm text-gray-300 font-medium px-4 py-2 rounded-lg transition-colors"
                aria-label="Go to homepage"
                >
                    <HomeIcon className="w-5 h-5" />
                    <span>Home</span>
                </button>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-100 tracking-tighter">
                Image to Prompt (Mirror)
            </h1>
            <p className="mt-3 text-lg text-gray-400 max-w-2xl mx-auto">
                Upload an image and let AI craft the perfect, structured prompt to recreate it.
            </p>
            </header>

            <main className="w-full flex-1 min-h-0 pb-8">
            {!selectedFile ? (
                <div className="h-full flex items-center justify-center">
                <ImageUploader onImageUpload={handleImageUpload} isLoading={isLoading} />
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
                <GlowCard glowColor="purple" customSize className="w-full h-full p-0 overflow-hidden bg-transparent">
                    <ImageDisplay file={selectedFile} isLoading={isLoading} onReset={resetState} />
                </GlowCard>
                <GlowCard glowColor="blue" customSize className="w-full h-full p-0 overflow-hidden bg-transparent">
                    <PromptDisplay
                    prompt={generatedPrompt}
                    isLoading={isLoading}
                    error={error}
                    onViewFull={() => setIsPromptModalOpen(true)}
                    />
                </GlowCard>
                </div>
            )}
            </main>
            {isPromptModalOpen && (
            <PromptModal
                prompt={generatedPrompt}
                onClose={() => setIsPromptModalOpen(false)}
            />
            )}
        </div>
    </div>
  );
};

export default MirrorPage;
