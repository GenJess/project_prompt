import React from 'react';

export const SpinnerIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className={`animate-spin ${props.className || ''}`}
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 3v3m0 12v3m9-9h-3m-12 0H3m16.5-4.5L18 7.5M6 18l-1.5-1.5M18 16.5l-1.5 1.5M6 6l1.5 1.5"
    />
  </svg>
);
