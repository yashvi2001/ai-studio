import React, { useState, useCallback, useRef } from 'react';
import { ImageUploadProps, ImageData } from '../types';
import { isValidImageType, isValidFileSize } from '../utils/helpers';

export const ImageUpload: React.FC<ImageUploadProps> = ({
  onImageUpload,
  currentImage,
}) => {
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resizeImage = (
    file: File,
    maxWidth: number = 1920,
    maxHeight: number = 1920
  ): Promise<Blob> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        let { width, height } = img;

        // Calculate new dimensions
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.floor(width * ratio);
          height = Math.floor(height * ratio);
        }

        canvas.width = width;
        canvas.height = height;

        // Draw and compress
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
        }

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            }
          },
          'image/jpeg',
          0.9
        );
      };

      img.src = URL.createObjectURL(file);
    });
  };

  const processFile = useCallback(
    async (file: File): Promise<void> => {
      setError(null);

      // Validate file type
      if (!isValidImageType(file)) {
        setError('Please upload a PNG or JPG file');
        return;
      }

      // Validate file size (10MB limit)
      if (!isValidFileSize(file, 10)) {
        setError('File size must be less than 10MB');
        return;
      }

      setIsProcessing(true);

      try {
        // Resize if needed
        const processedFile = await resizeImage(file);

        // Create data URL
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result;
          if (typeof result === 'string') {
            const imageData: ImageData = {
              file: new File([processedFile], file.name, {
                type: 'image/jpeg',
              }),
              dataUrl: result,
              name: file.name,
              size: processedFile.size,
              originalSize: file.size,
              dimensions: null, // Will be set when image loads
            };

            // Get image dimensions
            const img = new Image();
            img.onload = () => {
              imageData.dimensions = {
                width: img.naturalWidth,
                height: img.naturalHeight,
              };
              onImageUpload(imageData);
              setIsProcessing(false);
            };
            img.src = result;
          }
        };

        reader.onerror = () => {
          setError('Failed to process image');
          setIsProcessing(false);
        };

        reader.readAsDataURL(processedFile);
      } catch {
        setError('Failed to process image');
        setIsProcessing(false);
      }
    },
    [onImageUpload]
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragOver(false);

      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0 && files[0]) {
        processFile(files[0]);
      }
    },
    [processFile]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0 && files[0]) {
        processFile(files[0]);
      }
    },
    [processFile]
  );

  const handleClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleClick();
      }
    },
    [handleClick]
  );

  const handleRemove = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      onImageUpload(null);
    },
    [onImageUpload]
  );

  return (
    <div className="w-full">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpg,image/jpeg"
        onChange={handleFileSelect}
        className="hidden"
        aria-label="Upload image file"
      />

      {currentImage ? (
        <div className="space-y-3">
          <div className="relative group rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
            <img
              src={currentImage.dataUrl}
              alt="Uploaded preview"
              className="w-full h-48 object-cover"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2">
              <button
                onClick={handleRemove}
                className="p-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                aria-label="Remove image"
                type="button"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                </svg>
              </button>
              <button
                onClick={handleClick}
                className="p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                aria-label="Replace image"
                type="button"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="currentColor"
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
          } ${isProcessing ? 'pointer-events-none opacity-50' : ''} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          role="button"
          aria-label="Upload image area. Click or drag and drop to upload."
        >
          {isProcessing ? (
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
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
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  PNG/JPG • Max 10MB • Auto-resize to 1920px
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {error && (
        <div
          className="mt-3 flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md text-red-700 dark:text-red-300 text-sm"
          role="alert"
          aria-live="polite"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="flex-shrink-0"
          >
            <path d="M12,2L13.09,8.26L22,9L13.09,9.74L12,16L10.91,9.74L2,9L10.91,8.26L12,2Z" />
          </svg>
          {error}
        </div>
      )}
    </div>
  );
};
