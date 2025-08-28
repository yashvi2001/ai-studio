import React, { useCallback, useRef } from 'react';
import { ImageUpload } from './ImageUpload';
import { PromptInput } from './PromptInput';
import { StyleSelector } from './StyleSelector';
import { GenerateButton } from './GenerateButton';
import { PreviewPanel } from './PreviewPanel';
import { GenerationHistory } from './GenerationHistory';
import { LoadingSpinner } from './LoadingSpinner';
import { mockGenerateAPI } from '../services/mockAPI';
import { useAppState } from '../hooks/useAppState';
import { ImageData, Generation, StyleType } from '../types';

export const ImageStudio: React.FC = () => {
  const { state, updateState, addToHistory } = useAppState();
  const abortControllerRef = useRef<AbortController | null>(null);

  const handleImageUpload = useCallback(
    (imageData: ImageData | null) => {
      updateState({ uploadedImage: imageData, error: null });
    },
    [updateState]
  );

  const handlePromptChange = useCallback(
    (newPrompt: string) => {
      updateState({ prompt: newPrompt });
    },
    [updateState]
  );

  const handleStyleChange = useCallback(
    (newStyle: StyleType) => {
      updateState({ selectedStyle: newStyle });
    },
    [updateState]
  );

  const handleGenerate = useCallback(async () => {
    if (!state.uploadedImage || !state.prompt.trim()) {
      updateState({ error: 'Please upload an image and enter a prompt' });
      return;
    }

    updateState({
      isGenerating: true,
      error: null,
      retryCount: 0,
    });

    // Create abort controller for this request
    abortControllerRef.current = new AbortController();

    const attemptGenerate = async (attempt: number = 1): Promise<void> => {
      try {
        if (!state.uploadedImage) return;

        const result = await mockGenerateAPI(
          {
            imageDataUrl: state.uploadedImage.dataUrl,
            prompt: state.prompt.trim(),
            style: state.selectedStyle,
          },
          abortControllerRef.current?.signal
        );

        updateState({
          currentGeneration: result,
          isGenerating: false,
          retryCount: 0,
        });
        addToHistory(result);
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
          updateState({ isGenerating: false });
          return;
        }

        if (
          attempt < 3 &&
          err instanceof Error &&
          err.message === 'Model overloaded'
        ) {
          updateState({ retryCount: attempt });
          const delay = Math.pow(2, attempt - 1) * 1000; // Exponential backoff
          setTimeout(() => attemptGenerate(attempt + 1), delay);
        } else {
          updateState({
            error: err instanceof Error ? err.message : 'Generation failed',
            isGenerating: false,
            retryCount: 0,
          });
        }
      }
    };

    await attemptGenerate();
  }, [
    state.uploadedImage,
    state.prompt,
    state.selectedStyle,
    updateState,
    addToHistory,
  ]);

  const handleAbort = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    updateState({
      isGenerating: false,
      retryCount: 0,
      error: null,
    });
  }, [updateState]);

  const handleHistorySelect = useCallback(
    (generation: Generation) => {
      updateState({
        currentGeneration: generation,
        prompt: generation.prompt,
        selectedStyle: generation.style,
      });
    },
    [updateState]
  );

  const canGenerate =
    state.uploadedImage && state.prompt.trim() && !state.isGenerating;

  return (
    <div
      className="w-full h-full flex flex-col bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
      role="region"
      aria-label="AI Image Studio"
    >
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Controls */}
        <aside
          className="w-80 bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col p-6 space-y-6 overflow-y-auto"
          role="complementary"
          aria-label="Image generation controls"
        >
          <section className="space-y-4" aria-labelledby="upload-heading">
            <h2
              id="upload-heading"
              className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3"
            >
              Upload Image
            </h2>
            <ImageUpload
              onImageUpload={handleImageUpload}
              currentImage={state.uploadedImage}
            />
          </section>

          <section className="space-y-4" aria-labelledby="prompt-heading">
            <h2
              id="prompt-heading"
              className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3"
            >
              Prompt & Style
            </h2>
            <PromptInput
              value={state.prompt}
              onChange={handlePromptChange}
              disabled={state.isGenerating}
            />
            <StyleSelector
              value={state.selectedStyle}
              onChange={handleStyleChange}
              disabled={state.isGenerating}
            />
          </section>

          <section className="space-y-4" aria-labelledby="generate-heading">
            <h2 id="generate-heading" className="sr-only">
              Generate Image
            </h2>
            <GenerateButton
              onClick={handleGenerate}
              onAbort={handleAbort}
              disabled={!canGenerate}
              isGenerating={state.isGenerating}
              retryCount={state.retryCount}
            />

            {state.error && (
              <div
                className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md text-red-700 dark:text-red-300 text-sm"
                role="alert"
                aria-live="polite"
                aria-atomic="true"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="flex-shrink-0"
                  aria-hidden="true"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg>
                <span id="error-message">{state.error}</span>
              </div>
            )}
          </section>
        </aside>

        {/* Right Panel - Preview & History */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <PreviewPanel
            uploadedImage={state.uploadedImage}
            currentGeneration={state.currentGeneration}
            isGenerating={state.isGenerating}
            onAbort={handleAbort}
          />

          <GenerationHistory
            history={state.history}
            onSelect={handleHistorySelect}
            currentId={state.currentGeneration?.id}
          />
        </div>
      </div>

      {/* Loading Overlay */}
      {state.isGenerating && (
        <LoadingSpinner
          message={`Generating image...${state.retryCount > 0 ? ` (Attempt ${state.retryCount + 1})` : ''}`}
        />
      )}
    </div>
  );
};
