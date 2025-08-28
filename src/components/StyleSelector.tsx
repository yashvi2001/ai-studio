import React from 'react';

export type StyleType =
  | 'editorial'
  | 'cinematic'
  | 'artistic'
  | 'photorealistic'
  | 'anime'
  | 'sketch'
  | 'watercolor'
  | 'oil-painting';

interface StyleSelectorProps {
  value: StyleType;
  onChange: (style: StyleType) => void;
  disabled?: boolean;
}

const styles: {
  value: StyleType;
  label: string;
  description: string;
  icon: string;
}[] = [
  {
    value: 'editorial',
    label: 'Editorial',
    description: 'Clean, professional look',
    icon: '📰',
  },
  {
    value: 'cinematic',
    label: 'Cinematic',
    description: 'Dramatic, movie-like feel',
    icon: '🎬',
  },
  {
    value: 'artistic',
    label: 'Artistic',
    description: 'Creative, expressive style',
    icon: '🎨',
  },
  {
    value: 'photorealistic',
    label: 'Photorealistic',
    description: 'Ultra-realistic appearance',
    icon: '📸',
  },
  {
    value: 'anime',
    label: 'Anime',
    description: 'Japanese animation style',
    icon: '🌸',
  },
  {
    value: 'sketch',
    label: 'Sketch',
    description: 'Hand-drawn, pencil-like',
    icon: '✏️',
  },
  {
    value: 'watercolor',
    label: 'Watercolor',
    description: 'Soft, flowing paint style',
    icon: '🎨',
  },
  {
    value: 'oil-painting',
    label: 'Oil Painting',
    description: 'Rich, textured brushwork',
    icon: '🖼️',
  },
];

export const StyleSelector: React.FC<StyleSelectorProps> = ({
  value,
  onChange,
  disabled = false,
}) => {
  return (
    <div className="space-y-3">
      <fieldset disabled={disabled} className="space-y-3">
        <legend className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">
          Choose a style
        </legend>

        <div className="grid grid-cols-2 gap-3">
          {styles.map((style) => (
            <label
              key={style.value}
              className={`relative flex flex-col items-center p-3 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                value === style.value
                  ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-900 dark:text-blue-100'
                  : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:border-gray-300 dark:hover:border-gray-600'
              } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <input
                type="radio"
                name="style"
                value={style.value}
                checked={value === style.value}
                onChange={(e) => onChange(e.target.value as StyleType)}
                className="sr-only"
                disabled={disabled}
              />

              <div className="text-2xl mb-2">{style.icon}</div>
              <div className="text-center">
                <div className="font-medium text-sm">{style.label}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {style.description}
                </div>
              </div>

              {value === style.value && (
                <div className="absolute top-2 right-2 w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center">
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="text-white"
                  >
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                  </svg>
                </div>
              )}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
        </svg>
        <span className="text-xs">
          Style affects the overall artistic direction of your generated image
        </span>
      </div>
    </div>
  );
};
