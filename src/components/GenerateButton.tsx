import React from 'react';
import { GenerateButtonProps } from '../types';

export const GenerateButton: React.FC<GenerateButtonProps> = ({
  onClick,
  onAbort,
  disabled,
  isGenerating,
  retryCount,
}) => {
  if (isGenerating) {
    return (
      <button
        onClick={onAbort}
        className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        type="button"
        aria-label="Abort generation"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4M14.5,13L12,10.5L9.5,13L8.5,12L11,9.5L8.5,7L9.5,6L12,8.5L14.5,6L15.5,7L13,9.5L15.5,12L14.5,13Z" />
        </svg>
        <span>
          {retryCount > 0 ? `Cancel Retry (${retryCount}/3)` : 'Cancel'}
        </span>
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`relative w-full flex items-center justify-center gap-3 px-6 py-3 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 overflow-hidden ${
        disabled
          ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed'
          : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5'
      }`}
      type="button"
      aria-label="Generate AI image"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M11,16.5L18,9.5L16.59,8.09L11,13.67L7.91,10.59L6.5,12L11,16.5Z" />
      </svg>
      <span>Generate Image</span>
      {!disabled && (
        <div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"
          aria-hidden="true"
        ></div>
      )}
    </button>
  );
};
