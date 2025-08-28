import React from 'react';
import { ImageData, Generation, StyleType } from '../types';

interface PreviewPanelProps {
  uploadedImage: ImageData | null;
  prompt: string;
  style: StyleType;
  currentGeneration: Generation | null;
  isGenerating: boolean;
  onAbort: () => void;
}

export const PreviewPanel: React.FC<PreviewPanelProps> = ({
  uploadedImage,
  prompt,
  style,
  currentGeneration,
  isGenerating,
  onAbort,
}) => {
  const formatStyle = (styleValue: string): string => {
    if (!styleValue) return 'Editorial';
    return styleValue.charAt(0).toUpperCase() + styleValue.slice(1);
  };

  return (
    <div className="w-full h-full flex flex-col bg-white dark:bg-gray-900 overflow-hidden">
      <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100">
          Preview
        </h2>
        <div className="flex items-center gap-2">
          {isGenerating && (
            <button
              onClick={onAbort}
              className="px-3 py-1 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800 rounded-md text-sm hover:bg-red-200 dark:hover:bg-red-900/30 transition-colors"
            >
              Abort
            </button>
          )}
          {currentGeneration && (
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <span className="font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                #{currentGeneration.id.slice(0, 8)}
              </span>
              <span>
                {new Date(currentGeneration.createdAt).toLocaleTimeString()}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 p-3 overflow-y-auto min-h-0 custom-scrollbar">
        {/* Generated Result */}
        {currentGeneration ? (
          <div className="space-y-3 h-full flex flex-col">
            <div className="text-center flex-shrink-0">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">
                Generated Image
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Your AI-generated masterpiece is ready!
              </p>
            </div>

            <div className="flex-1 flex items-center justify-center min-h-0">
              <div className="relative group w-full max-w-2xl border border-gray-200 dark:border-gray-700 rounded-lg p-1 bg-gray-50 dark:bg-gray-800">
                <img
                  src={currentGeneration.imageUrl}
                  alt={`Generated image: ${currentGeneration.prompt}`}
                  className="w-full h-auto max-h-[60vh] rounded-lg shadow-lg object-contain"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center rounded-lg">
                  <button
                    className="bg-white text-gray-900 p-2 rounded-full hover:bg-gray-100 transition-colors shadow-lg"
                    onClick={() => {
                      const link = document.createElement('a');
                      link.href = currentGeneration.imageUrl;
                      link.download = `ai-studio-${currentGeneration.id}.jpg`;
                      link.click();
                    }}
                    aria-label="Download generated image"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path d="M5,20H19V18H5M19,9H15V3H9V9H5L12,16L19,9Z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-2 text-center flex-shrink-0">
              <p className="text-gray-900 dark:text-gray-100 font-medium text-sm">
                {currentGeneration.prompt}
              </p>
              <div className="flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <span className="bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                  {formatStyle(currentGeneration.style)}
                </span>
                <span>•</span>
                <span>
                  {new Date(currentGeneration.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        ) : (
          /* Live Summary */
          <div className="space-y-4 h-full flex flex-col">
            <div className="space-y-3 flex-shrink-0">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                Source Image
              </h3>
              {uploadedImage ? (
                <div className="space-y-2">
                  <div className="flex justify-center">
                    <div className="max-w-md border border-gray-200 dark:border-gray-700 rounded-lg p-2 bg-gray-50 dark:bg-gray-800">
                      <img
                        src={uploadedImage.dataUrl}
                        alt="Source image preview"
                        className="max-w-full h-auto max-h-48 rounded-lg shadow-md object-contain"
                      />
                    </div>
                  </div>
                  <div className="space-y-1 text-center">
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      {uploadedImage.name}
                    </p>
                    {uploadedImage.dimensions && (
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {uploadedImage.dimensions.width} ×{' '}
                        {uploadedImage.dimensions.height}
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-6 text-gray-400 dark:text-gray-500 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
                  <svg
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M9,3V4H4V6H5V19A2,2 0 0,0 7,21H17A2,2 0 0,0 19,19V6H20V4H15V3H9M7,6H17V19H7V6M9,8V17H11V8H9M13,8V17H15V8H13Z" />
                  </svg>
                  <p className="mt-2 text-sm">No image uploaded</p>
                </div>
              )}
            </div>

            <div className="space-y-3 flex-shrink-0">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                Prompt
              </h3>
              {prompt && prompt.trim() ? (
                <div className="space-y-2">
                  <p className="text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                    {prompt}
                  </p>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {prompt.split(' ').length} words • {prompt.length}{' '}
                    characters
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-6 text-gray-400 dark:text-gray-500 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
                  <svg
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z" />
                  </svg>
                  <p className="mt-2 text-sm">No prompt entered</p>
                </div>
              )}
            </div>

            <div className="space-y-3 flex-shrink-0">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                Style
              </h3>
              <div className="inline-block">
                <span className="bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full text-sm font-medium">
                  {formatStyle(style)}
                </span>
              </div>
            </div>

            {uploadedImage && prompt && prompt.trim() && (
              <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex-shrink-0">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="text-green-600 dark:text-green-400"
                  aria-hidden="true"
                >
                  <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M11,16.5L6.5,12L7.91,10.59L11,13.67L16.59,8.09L18,9.5L11,16-5Z" />
                </svg>
                <p className="text-green-800 dark:text-green-200 font-medium">
                  Ready to generate!
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {isGenerating && (
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-2">
            <div
              className="bg-blue-600 h-2 rounded-full animate-pulse"
              style={{ width: '60%' }}
            ></div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
            Creating your image...
          </p>
        </div>
      )}
    </div>
  );
};
