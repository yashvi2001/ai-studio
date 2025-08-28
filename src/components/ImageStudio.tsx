import React, { useState, useCallback, useRef, useEffect } from 'react';
import { ImageUpload } from './ImageUpload';
import { PromptInput } from './PromptInput';
import { StyleSelector } from './StyleSelector';
import { GenerateButton } from './GenerateButton';
import { PreviewPanel } from './PreviewPanel';
import { GenerationHistory } from './GenerationHistory';
import { LoadingSpinner } from './LoadingSpinner';
import { mockGenerateAPI } from '../services/mockAPI';
import { ImageData, Generation, StyleType } from '../types';

export const ImageStudio: React.FC = () => {
  const [uploadedImage, setUploadedImage] = useState<ImageData | null>(null);
  const [prompt, setPrompt] = useState<string>('');
  const [selectedStyle, setSelectedStyle] = useState<StyleType>('editorial');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [currentGeneration, setCurrentGeneration] = useState<Generation | null>(
    null
  );
  const [history, setHistory] = useState<Generation[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState<number>(0);

  const abortControllerRef = useRef<AbortController | null>(null);

  // Load history from localStorage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('ai-studio-history');
    if (savedHistory) {
      try {
        const parsed = JSON.parse(savedHistory) as Generation[];
        setHistory(parsed);
      } catch (e) {
        console.error('Failed to load history:', e);
      }
    }
  }, []);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('ai-studio-history', JSON.stringify(history));
  }, [history]);

  const handleImageUpload = useCallback((imageData: ImageData | null) => {
    setUploadedImage(imageData);
    setError(null);
  }, []);

  const handlePromptChange = useCallback((newPrompt: string) => {
    setPrompt(newPrompt);
  }, []);

  const handleStyleChange = useCallback((newStyle: StyleType) => {
    setSelectedStyle(newStyle);
  }, []);

  const addToHistory = useCallback((generation: Generation) => {
    setHistory((prev) => {
      const newHistory = [generation, ...prev.slice(0, 4)]; // Keep only last 5
      return newHistory;
    });
  }, []);

  const handleGenerate = useCallback(async () => {
    if (!uploadedImage || !prompt.trim()) {
      setError('Please upload an image and enter a prompt');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setRetryCount(0);

    // Create abort controller for this request
    abortControllerRef.current = new AbortController();

    const attemptGenerate = async (attempt: number = 1): Promise<void> => {
      try {
        const result = await mockGenerateAPI(
          {
            imageDataUrl: uploadedImage.dataUrl,
            prompt: prompt.trim(),
            style: selectedStyle,
          },
          abortControllerRef.current?.signal
        );

        setCurrentGeneration(result);
        addToHistory(result);
        setIsGenerating(false);
        setRetryCount(0);
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
          setIsGenerating(false);
          return;
        }

        if (
          attempt < 3 &&
          err instanceof Error &&
          err.message === 'Model overloaded'
        ) {
          setRetryCount(attempt);
          const delay = Math.pow(2, attempt - 1) * 1000; // Exponential backoff
          setTimeout(() => attemptGenerate(attempt + 1), delay);
        } else {
          setError(err instanceof Error ? err.message : 'Generation failed');
          setIsGenerating(false);
          setRetryCount(0);
        }
      }
    };

    await attemptGenerate();
  }, [uploadedImage, prompt, selectedStyle, addToHistory]);

  const handleAbort = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsGenerating(false);
    setRetryCount(0);
    setError(null);
  }, []);

  const handleHistorySelect = useCallback((generation: Generation) => {
    setCurrentGeneration(generation);
    // Optionally restore the prompt and style
    setPrompt(generation.prompt);
    setSelectedStyle(generation.style);
  }, []);

  const canGenerate = uploadedImage && prompt.trim() && !isGenerating;

  return (
    <div
      className="w-full h-full flex flex-col bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
      role="main"
      aria-label="AI Image Studio"
    >
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Controls */}
        <div className="w-80 bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col p-6 space-y-6 overflow-y-auto">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
              Upload Image
            </h2>
            <ImageUpload
              onImageUpload={handleImageUpload}
              currentImage={uploadedImage}
            />
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
              Prompt & Style
            </h2>
            <PromptInput
              value={prompt}
              onChange={handlePromptChange}
              disabled={isGenerating}
            />
            <StyleSelector
              value={selectedStyle}
              onChange={handleStyleChange}
              disabled={isGenerating}
            />
          </div>

          <div className="space-y-4">
            <GenerateButton
              onClick={handleGenerate}
              onAbort={handleAbort}
              disabled={!canGenerate}
              isGenerating={isGenerating}
              retryCount={retryCount}
            />

            {error && (
              <div
                className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md text-red-700 dark:text-red-300 text-sm"
                role="alert"
                aria-live="polite"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="flex-shrink-0"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg>
                {error}
              </div>
            )}
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
              Recent Generations
            </h2>
            <GenerationHistory
              history={history}
              onSelect={handleHistorySelect}
              currentId={currentGeneration?.id}
            />
          </div>
        </div>

        {/* Right Panel - Preview */}
        <div className="flex-1 relative overflow-hidden">
          <PreviewPanel
            uploadedImage={uploadedImage}
            prompt={prompt}
            style={selectedStyle}
            currentGeneration={currentGeneration}
            isGenerating={isGenerating}
          />

          {isGenerating && (
            <div className="absolute inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm flex flex-col items-center justify-center z-10">
              <LoadingSpinner />
              <p className="mt-4 text-gray-600 dark:text-gray-400 text-sm">
                {retryCount > 0
                  ? `Retrying... (${retryCount}/3)`
                  : 'Generating your image...'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
