import React from 'react';
import { GlowCard } from './ui/spotlight-card';

const difficulties = [
  { level: 1, name: 'Very Easy', description: 'Simple subjects, clear style.' },
  { level: 2, name: 'Easy', description: 'One or two elements, basic composition.' },
  { level: 3, name: 'Medium', description: 'More complex scenes and styles.' },
  { level: 4, name: 'Hard', description: 'Subtle details, lighting, and mood.' },
  { level: 5, name: 'Very Hard', description: 'Intricate concepts and artistic flair.' },
];

const glowColors = ['blue', 'green', 'yellow', 'orange', 'red'] as const;

interface DifficultySelectorProps {
  onSelect: (difficulty: string) => void;
  isLoading: boolean;
}

export const DifficultySelector: React.FC<DifficultySelectorProps> = ({ onSelect, isLoading }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-6 w-full max-w-6xl">
       {difficulties.map(({ level, name, description }, index) => (
        <div 
          key={level} 
          onClick={() => !isLoading && onSelect(name)} 
          className={isLoading ? 'cursor-not-allowed' : 'cursor-pointer'}
        >
          <GlowCard 
            glowColor={glowColors[index % glowColors.length]} 
            className={`p-6 flex flex-col text-left h-full transition-all duration-300 ${isLoading ? 'opacity-50' : 'hover:scale-105'}`}
            customSize
          >
            <p className="text-sm font-bold text-indigo-400">Level {level}</p>
            <h3 className="text-lg font-semibold text-gray-200 mt-1">{name}</h3>
            <p className="text-xs text-gray-500 mt-2 flex-grow">{description}</p>
          </GlowCard>
        </div>
      ))}
    </div>
  );
};
