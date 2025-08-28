import React, { useCallback } from 'react';
import { GenerationHistoryProps, Generation } from '../types';

export const GenerationHistory: React.FC<GenerationHistoryProps> = ({
  history,
  onSelect,
  currentId,
}) => {
  const handleSelect = useCallback(
    (generation: Generation) => {
      onSelect(generation);
    },
    [onSelect]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>, generation: Generation) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleSelect(generation);
      }
    },
    [handleSelect]
  );

  const formatStyle = (styleValue: string): string => {
    return styleValue.charAt(0).toUpperCase() + styleValue.slice(1);
  };

  const formatTime = (timestamp: string): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;

    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;

    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-6 text-gray-400 dark:text-gray-500">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
          <path d="M13,3A9,9 0 0,0 4,12H1L4.89,15.89L4.96,16.03L9,12H6A7,7 0 0,1 13,5A7,7 0 0,1 20,12A7,7 0 0,1 13,19C11.07,19 9.32,18.21 8.06,16.94L6.64,18.36C8.27,20 10.5,21 13,21A9,9 0 0,0 22,12A9,9 0 0,0 13,3Z" />
        </svg>
        <p className="mt-2 text-sm font-medium">No generations yet</p>
        <p className="text-xs text-center">
          Your recent creations will appear here
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="space-y-2" role="list">
        {history.map((generation) => (
          <div
            key={generation.id}
            className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-800 ${
              currentId === generation.id
                ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800'
                : 'border border-transparent'
            }`}
            onClick={() => handleSelect(generation)}
            onKeyDown={(e) => handleKeyDown(e, generation)}
            tabIndex={0}
            role="listitem button"
            aria-label={`View generation: ${generation.prompt.slice(0, 50)}...`}
          >
            <div className="relative flex-shrink-0">
              <img
                src={generation.imageUrl}
                alt={`Generated: ${generation.prompt.slice(0, 30)}...`}
                className="w-16 h-16 object-cover rounded-lg"
              />
              {currentId === generation.id && (
                <div
                  className="absolute -top-1 -right-1 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center"
                  aria-hidden="true"
                >
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="text-white"
                  >
                    <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M11,16.5L6.5,12L7.91,10.59L11,13.67L16.59,8.09L18,9.5L11,16.5Z" />
                  </svg>
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-900 dark:text-gray-100 truncate">
                {generation.prompt.length > 60
                  ? `${generation.prompt.slice(0, 60)}...`
                  : generation.prompt}
              </p>

              <div className="flex items-center gap-2 mt-1 text-xs text-gray-500 dark:text-gray-400">
                <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                  {formatStyle(generation.style)}
                </span>
                <span>•</span>
                <span>{formatTime(generation.createdAt)}</span>
              </div>
            </div>

            <div className="flex-shrink-0">
              <button
                className="p-2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  const link = document.createElement('a');
                  link.href = generation.imageUrl;
                  link.download = `ai-studio-${generation.id}.jpg`;
                  link.click();
                }}
                aria-label="Download this generation"
                title="Download"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M5,20H19V18H5M19,9H15V3H9V9H5L12,16L19,9Z" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
        <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
          Showing {history.length} of 5 recent generations
        </p>
      </div>
    </div>
  );
};
