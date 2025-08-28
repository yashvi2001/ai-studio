// Mock API service for AI image generation
import { generateId } from '../utils/helpers';
import { GenerateAPIParams, GenerateAPIResponse } from '../types';

// Sample generated image URLs (using placeholder images for demo)
const SAMPLE_IMAGES: string[] = [
  'https://picsum.photos/512/512?random=1',
  'https://picsum.photos/512/512?random=2',
  'https://picsum.photos/512/512?random=3',
  'https://picsum.photos/512/512?random=4',
  'https://picsum.photos/512/512?random=5',
  'https://picsum.photos/512/512?random=6',
  'https://picsum.photos/512/512?random=7',
  'https://picsum.photos/512/512?random=8',
  'https://picsum.photos/512/512?random=9',
  'https://picsum.photos/512/512?random=10',
];

/**
 * Mock API function that simulates AI image generation
 */
export const mockGenerateAPI = async (
  params: GenerateAPIParams,
  signal?: AbortSignal
): Promise<GenerateAPIResponse> => {
  const { imageDataUrl, prompt, style } = params;

  // Random delay between 1-2 seconds
  const delay = Math.random() * 1000 + 1000;

  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      // Check if request was aborted
      if (signal?.aborted) {
        reject(new Error('Request aborted'));
        return;
      }

      // 20% chance of error
      if (Math.random() < 0.2) {
        reject(new Error('Model overloaded'));
        return;
      }

      // Successful generation
      const result: GenerateAPIResponse = {
        id: generateId(),
        imageUrl:
          SAMPLE_IMAGES[Math.floor(Math.random() * SAMPLE_IMAGES.length)],
        prompt,
        style,
        createdAt: new Date().toISOString(),
        sourceImage: imageDataUrl,
      };

      resolve(result);
    }, delay);

    // Handle abort signal
    if (signal) {
      signal.addEventListener('abort', () => {
        clearTimeout(timeoutId);
        reject(new Error('Request aborted'));
      });
    }
  });
};

/**
 * Alternative mock API that always succeeds (for testing)
 */
export const mockGenerateAPISuccess = async (
  params: GenerateAPIParams
): Promise<GenerateAPIResponse> => {
  const { imageDataUrl, prompt, style } = params;

  await new Promise((resolve) => setTimeout(resolve, 1500));

  return {
    id: generateId(),
    imageUrl: SAMPLE_IMAGES[Math.floor(Math.random() * SAMPLE_IMAGES.length)],
    prompt,
    style,
    createdAt: new Date().toISOString(),
    sourceImage: imageDataUrl,
  };
};

/**
 * Mock API that always fails (for testing error handling)
 */
export const mockGenerateAPIError = async (): Promise<never> => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  throw new Error('Model overloaded');
};
