import React from 'react';

const difficulties = [
  { level: 1, name: 'Very Easy', description: 'Simple subjects, clear style.' },
  { level: 2, name: 'Easy', description: 'One or two elements, basic composition.' },
  { level: 3, name: 'Medium', description: 'More complex scenes and styles.' },
  { level: 4, name: 'Hard', description: 'Subtle details, lighting, and mood.' },
  { level: 5, name: 'Very Hard', description: 'Intricate concepts and artistic flair.' },
];

interface DifficultySelectorProps {
  onSelect: (difficulty: string) => void;
  isLoading: boolean;
}

export const DifficultySelector: React.FC<DifficultySelectorProps> = ({ onSelect, isLoading }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 w-full max-w-5xl">
      {difficulties.map(({ level, name, description }) => (
        <button
          key={level}
          onClick={() => onSelect(name)}
          disabled={isLoading}
          className="group relative p-4 bg-gray-900 border border-gray-800 rounded-lg text-left hover:bg-gray-800 hover:border-indigo-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-950"
        >
          <p className="text-sm font-bold text-indigo-400">Level {level}</p>
          <h3 className="text-lg font-semibold text-gray-200 mt-1">{name}</h3>
          <p className="text-xs text-gray-500 mt-2">{description}</p>
        </button>
      ))}
    </div>
  );
};
