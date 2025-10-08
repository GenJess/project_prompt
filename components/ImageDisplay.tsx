import React from 'react';
import type { SelectedFile } from '../types';

interface ImageDisplayProps {
  file: SelectedFile;
  isLoading: boolean;
  onReset: () => void;
}

const ScanlineLoader: React.FC = () => (
  <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center overflow-hidden z-10">
    <div className="w-full h-full relative">
      <div className="absolute top-0 h-1.5 w-full bg-indigo-400/50 animate-[scan_3s_ease-in-out_infinite] shadow-[0_0_20px_5px_rgba(129,140,248,0.5)]"></div>
    </div>
    <div className="absolute text-center">
      <p className="text-white text-xl font-semibold animate-pulse">Analyzing Image...</p>
      <p className="text-gray-300 text-sm mt-1">Crafting the perfect prompt</p>
    </div>
    <style>{`
      @keyframes scan {
        0% { transform: translateY(-1.5px); }
        100% { transform: translateY(101vh); }
      }
    `}</style>
  </div>
);


export const ImageDisplay: React.FC<ImageDisplayProps> = ({ file, isLoading, onReset }) => {
  return (
    <div className="w-full h-full flex flex-col p-4 space-y-4">
      <div className="relative flex-grow min-h-0 w-full overflow-hidden rounded-xl flex items-center justify-center">
        <img
          src={file.dataUrl}
          alt={file.name}
          className="max-w-full max-h-full object-contain"
        />
        {isLoading && <ScanlineLoader />}
      </div>
      <div className="flex-shrink-0 flex justify-between items-center bg-gray-950/50 p-3 rounded-lg">
        <p className="text-sm text-gray-400 truncate pr-4">{file.name} ({file.width}x{file.height})</p>
        <button
          onClick={onReset}
          disabled={isLoading}
          className="text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900"
        >
          Upload New
        </button>
      </div>
    </div>
  );
};