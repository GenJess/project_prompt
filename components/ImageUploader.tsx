import React, { useState, useCallback, useRef } from 'react';
import { UploadIcon } from './icons/UploadIcon';

interface ImageUploaderProps {
  onImageUpload: (file: File) => void;
  isLoading: boolean;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload, isLoading }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragCounter = useRef(0);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onImageUpload(e.target.files[0]);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    dragCounter.current = 0;

    let file: File | null = null;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      file = Array.from(e.dataTransfer.files).find((f: File) => f.type.startsWith('image/')) ?? null;
    } 
    else if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      const imageItem = Array.from(e.dataTransfer.items).find((item: DataTransferItem) => item.kind === 'file' && item.type.startsWith('image/'));
      if (imageItem) {
        file = imageItem.getAsFile();
      }
    }

    if (file) {
      onImageUpload(file);
    } else {
      alert("No valid image file found. Please drop a PNG, JPG, or WEBP file.");
    }
    
  }, [onImageUpload]);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current++;
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current--;
    if (dragCounter.current === 0) {
      setIsDragging(false);
    }
  };
  
  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const baseBorder = "border-2 border-dashed border-gray-800";
  const draggingBorder = "border-indigo-500 scale-105";
  const baseBg = "bg-gray-900/50";
  const draggingBg = "bg-gray-900/80";

  return (
    <div
      onClick={handleClick}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      className={`relative w-full max-w-2xl p-8 rounded-2xl transition-all duration-300 cursor-pointer ${baseBorder} ${isDragging ? draggingBorder : ''} ${isDragging ? draggingBg : baseBg}`}
    >
      <div className="flex flex-col items-center justify-center space-y-4 pointer-events-none">
        <UploadIcon className="w-16 h-16 text-gray-600" />
        <p className="text-xl font-semibold text-gray-300">
          <span className="text-indigo-400 font-bold">
            Click to upload
          </span>
          {' '}or drag and drop
        </p>
        <p className="text-sm text-gray-500">PNG, JPG, or WEBP</p>
        <input ref={fileInputRef} id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/png, image/jpeg, image/webp" />
      </div>
    </div>
  );
};
