export interface ImageData {
  file: File;
  dataUrl: string;
  name: string;
  size: number;
  originalSize: number;
  dimensions: {
    width: number;
    height: number;
  } | null;
}

export interface Generation {
  id: string;
  imageUrl: string;
  prompt: string;
  style: StyleType;
  createdAt: string;
  sourceImage?: string;
}

export type StyleType =
  | 'editorial'
  | 'cinematic'
  | 'artistic'
  | 'photorealistic'
  | 'anime'
  | 'sketch'
  | 'watercolor'
  | 'oil-painting';

export interface StyleOption {
  value: StyleType;
  label: string;
  description: string;
  icon: string;
}

export interface GenerateAPIParams {
  imageDataUrl: string;
  prompt: string;
  style: StyleType;
}

export interface GenerateAPIResponse {
  id: string;
  imageUrl: string;
  prompt: string;
  style: StyleType;
  createdAt: string;
  sourceImage: string;
}

export interface ImageUploadProps {
  onImageUpload: (imageData: ImageData | null) => void;
  currentImage: ImageData | null;
}

export interface PromptInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export interface StyleSelectorProps {
  value: StyleType;
  onChange: (style: StyleType) => void;
  disabled?: boolean;
}

export interface GenerateButtonProps {
  onClick: () => void;
  onAbort: () => void;
  disabled: boolean;
  isGenerating: boolean;
  retryCount: number;
}

export interface PreviewPanelProps {
  uploadedImage: ImageData | null;
  prompt: string;
  style: StyleType;
  currentGeneration: Generation | null;
  isGenerating: boolean;
}

export interface GenerationHistoryProps {
  history: Generation[];
  onSelect: (generation: Generation) => void;
  currentId?: string;
}

export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
}
