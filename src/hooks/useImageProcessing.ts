import { useState, useCallback, useMemo, useRef } from 'react';
import {
  downscaleImage,
  createThumbnail,
  getImageMetadata,
  validateImageFile,
} from '../utils/imageUtils';
import { ImageDimensions, ImageProcessingOptions } from '../utils/imageUtils';

export interface ProcessedImage {
  dataUrl: string;
  thumbnail: string;
  dimensions: ImageDimensions;
  fileSize: number;
  originalFile: File;
}

export interface ImageProcessingState {
  isProcessing: boolean;
  progress: number;
  error: string | null;
}

export function useImageProcessing(options: ImageProcessingOptions = {}) {
  const [processedImages, setProcessedImages] = useState<ProcessedImage[]>([]);
  const [processingState, setProcessingState] = useState<ImageProcessingState>({
    isProcessing: false,
    progress: 0,
    error: null,
  });

  const abortControllerRef = useRef<AbortController | null>(null);

  const processImage = useCallback(
    async (file: File): Promise<ProcessedImage> => {
      // Validate file first
      const validation = validateImageFile(file);
      if (!validation.isValid) {
        throw new Error(validation.error);
      }

      setProcessingState((prev) => ({
        ...prev,
        isProcessing: true,
        progress: 0,
        error: null,
      }));

      try {
        // Create abort controller for this operation
        abortControllerRef.current = new AbortController();

        // Get metadata first (for validation)
        setProcessingState((prev) => ({ ...prev, progress: 20 }));
        await getImageMetadata(file);

        // Check if we need to abort
        if (abortControllerRef.current?.signal.aborted) {
          throw new Error('Operation cancelled');
        }

        // Downscale image
        setProcessingState((prev) => ({ ...prev, progress: 40 }));
        const downscaled = await downscaleImage(file, options);

        if (abortControllerRef.current?.signal.aborted) {
          throw new Error('Operation cancelled');
        }

        // Create thumbnail
        setProcessingState((prev) => ({ ...prev, progress: 70 }));
        const thumbnail = await createThumbnail(downscaled.dataUrl);

        if (abortControllerRef.current?.signal.aborted) {
          throw new Error('Operation cancelled');
        }

        setProcessingState((prev) => ({ ...prev, progress: 100 }));

        const processedImage: ProcessedImage = {
          dataUrl: downscaled.dataUrl,
          thumbnail,
          dimensions: downscaled.dimensions,
          fileSize: downscaled.fileSize,
          originalFile: file,
        };

        // Add to processed images list
        setProcessedImages((prev) => [...prev, processedImage]);

        setProcessingState((prev) => ({
          ...prev,
          isProcessing: false,
          progress: 0,
        }));

        return processedImage;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Failed to process image';
        setProcessingState((prev) => ({
          ...prev,
          isProcessing: false,
          progress: 0,
          error: errorMessage,
        }));
        throw error;
      }
    },
    [options]
  );

  const processMultipleImages = useCallback(
    async (files: File[]): Promise<ProcessedImage[]> => {
      setProcessingState((prev) => ({
        ...prev,
        isProcessing: true,
        progress: 0,
        error: null,
      }));

      try {
        const results: ProcessedImage[] = [];

        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const result = await processImage(file);
          results.push(result);

          // Update progress for multiple files
          const progress = ((i + 1) / files.length) * 100;
          setProcessingState((prev) => ({ ...prev, progress }));
        }

        setProcessingState((prev) => ({
          ...prev,
          isProcessing: false,
          progress: 0,
        }));

        return results;
      } catch (error) {
        setProcessingState((prev) => ({
          ...prev,
          isProcessing: false,
          progress: 0,
          error:
            error instanceof Error ? error.message : 'Failed to process images',
        }));
        throw error;
      }
    },
    [processImage]
  );

  const abortProcessing = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setProcessingState((prev) => ({
      ...prev,
      isProcessing: false,
      progress: 0,
    }));
  }, []);

  const clearProcessedImages = useCallback(() => {
    setProcessedImages([]);
  }, []);

  const removeProcessedImage = useCallback((index: number) => {
    setProcessedImages((prev) => prev.filter((_, i) => i !== index));
  }, []);

  // Memoized computed values
  const totalFileSize = useMemo(() => {
    return processedImages.reduce((total, img) => total + img.fileSize, 0);
  }, [processedImages]);

  const averageDimensions = useMemo(() => {
    if (processedImages.length === 0) return null;

    const totalWidth = processedImages.reduce(
      (sum, img) => sum + img.dimensions.width,
      0
    );
    const totalHeight = processedImages.reduce(
      (sum, img) => sum + img.dimensions.height,
      0
    );

    return {
      width: Math.round(totalWidth / processedImages.length),
      height: Math.round(totalHeight / processedImages.length),
    };
  }, [processedImages]);

  return {
    processedImages,
    processingState,
    processImage,
    processMultipleImages,
    abortProcessing,
    clearProcessedImages,
    removeProcessedImage,
    totalFileSize,
    averageDimensions,
  };
}
