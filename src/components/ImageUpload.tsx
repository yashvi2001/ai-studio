import React, { useState, useCallback, useRef } from 'react';
import { ImageUploadProps, ImageData } from '../types';
import { useImageProcessing } from '../hooks/useImageProcessing';
import { devLog } from '../utils/logger';

export const ImageUpload: React.FC<ImageUploadProps> = ({
  onImageUpload,
  currentImage,
}) => {
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { processImage, processingState } = useImageProcessing({
    maxWidth: 1920,
    maxHeight: 1080,
    quality: 0.9,
  });

  const processFile = useCallback(
    async (file: File): Promise<void> => {
      try {
        const processedImage = await processImage(file);

        const imageData: ImageData = {
          file: processedImage.originalFile,
          dataUrl: processedImage.dataUrl,
          name: file.name,
          size: processedImage.fileSize,
          originalSize: file.size,
          dimensions: processedImage.dimensions,
        };

        onImageUpload(imageData);
      } catch (error) {
        // Error is handled by the useImageProcessing hook
        // Log only in development
        devLog.error('Failed to process image:', error);
      }
    },
    [processImage, onImageUpload]
  );

  const handleFileSelect = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        processFile(file);
      }
      // Reset input value to allow selecting the same file again
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    },
    [processFile]
  );

  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      setIsDragOver(false);

      const files = event.dataTransfer.files;
      if (files.length > 0 && files[0]) {
        processFile(files[0]);
      }
    },
    [processFile]
  );

  const handleClick = useCallback(() => {
    if (!processingState.isProcessing && fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, [processingState.isProcessing]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        handleClick();
      }
    },
    [handleClick]
  );

  const handleRemove = useCallback(() => {
    onImageUpload(null);
  }, [onImageUpload]);

  return (
    <div className="space-y-3">
      {/* Hidden file input for accessibility */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/jpg"
        onChange={handleFileSelect}
        className="hidden"
        aria-label="Select image file"
        disabled={processingState.isProcessing}
      />

      {currentImage ? (
        <div className="relative group">
          <div className="relative">
            <img
              src={currentImage.dataUrl}
              alt={`Preview of uploaded image: ${currentImage.name}`}
              className="w-full h-48 object-cover rounded-lg"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2">
              <button
                onClick={handleRemove}
                className="p-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition-colors"
                aria-label="Remove image"
                type="button"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                </svg>
              </button>
              <button
                onClick={handleClick}
                className="p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition-colors"
                aria-label="Replace image"
                type="button"
                disabled={processingState.isProcessing}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                </svg>
              </button>
            </div>
          </div>

          <div className="px-1">
            <p className="font-medium text-sm text-gray-900 dark:text-gray-100 truncate">
              {currentImage.name}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {currentImage.dimensions && (
                <span>
                  {currentImage.dimensions.width} ×{' '}
                  {currentImage.dimensions.height}
                </span>
              )}
              {currentImage.originalSize !== currentImage.size && (
                <span className="text-blue-600 dark:text-blue-400">
                  {' '}
                  • Resized
                </span>
              )}
            </p>
          </div>
        </div>
      ) : (
        <div
          className={`relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200 ${
            isDragOver
              ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 scale-105'
              : 'border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800'
          } ${processingState.isProcessing ? 'pointer-events-none opacity-50' : ''} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          role="button"
          aria-label="Upload image area. Click or drag and drop to upload."
          aria-describedby="upload-instructions"
        >
          {processingState.isProcessing ? (
            <div className="flex flex-col items-center gap-3">
              <div
                className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"
                role="status"
                aria-label="Processing image"
              ></div>
              <p className="text-gray-500 dark:text-gray-400">
                Processing image...
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="text-gray-400 dark:text-gray-500"
                aria-hidden="true"
              >
                <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
              </svg>
              <div className="space-y-1">
                <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
                  {isDragOver ? 'Drop your image here' : 'Upload an image'}
                </p>
                <p className="text-gray-500 dark:text-gray-400">
                  Drag & drop or click to browse
                </p>
                <p
                  id="upload-instructions"
                  className="text-xs text-gray-400 dark:text-gray-500"
                >
                  PNG/JPG • Max 10MB • Auto-resize to 1920px
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {processingState.error && (
        <div
          className="mt-3 flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md text-red-700 dark:text-red-300 text-sm"
          role="alert"
          aria-live="polite"
          aria-atomic="true"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="flex-shrink-0"
            aria-hidden="true"
          >
            <path d="M12,2L13.09,8.26L22,9L13.09,9.74L12,16L10.91,9.74L2,9L10.91,8.26L12,2Z" />
          </svg>
          <span id="error-message">{processingState.error}</span>
        </div>
      )}
    </div>
  );
};
