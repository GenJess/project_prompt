import React from 'react';

interface TooltipProps {
  content: string;
  children: React.ReactNode;
}

export const Tooltip: React.FC<TooltipProps> = ({ content, children }) => {
  return (
    <span className="group relative inline-block cursor-help">
      {children}
      <span
        role="tooltip"
        className="
          invisible group-hover:visible group-focus:visible
          absolute z-10 bottom-full mb-2 left-1/2 -translate-x-1/2
          w-64 p-3
          bg-gray-950 border border-indigo-500/30 rounded-lg shadow-2xl
          text-sm text-gray-300 leading-relaxed
          opacity-0 group-hover:opacity-100 transition-opacity duration-200
          pointer-events-none
        "
      >
        {content}
        <svg
          className="absolute left-1/2 -translate-x-1/2 top-full text-gray-950"
          width="16"
          height="8"
          viewBox="0 0 16 8"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M0 0L8 8L16 0H0Z" />
        </svg>
      </span>
    </span>
  );
};