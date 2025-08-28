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
  const handleKeyDown = (event: React.KeyboardEvent, styleValue: StyleType) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      if (!disabled) {
        onChange(styleValue);
      }
    }
  };

  return (
    <div className="space-y-3">
      <fieldset disabled={disabled} className="space-y-3">
        <legend className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">
          Choose a style
        </legend>

        <div className="grid grid-cols-2 gap-3" role="radiogroup" aria-label="AI art style selection">
          {styles.map((style) => (
            <label
              key={style.value}
              className={`relative flex flex-col items-center p-3 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                value === style.value
                  ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-900 dark:text-blue-100'
                  : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:border-gray-300 dark:hover:border-gray-600'
              } ${disabled ? 'opacity-50 cursor-not-allowed' : ''} focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 dark:focus-within:ring-offset-gray-900`}
            >
              <input
                type="radio"
                name="style"
                value={style.value}
                checked={value === style.value}
                onChange={() => onChange(style.value)}
                disabled={disabled}
                className="sr-only"
                aria-describedby={`style-${style.value}-desc`}
              />
              <div 
                className="text-2xl mb-2"
                aria-hidden="true"
              >
                {style.icon}
              </div>
              <div className="text-center">
                <span className="block text-sm font-medium">
                  {style.label}
                </span>
                <span 
                  id={`style-${style.value}-desc`}
                  className="block text-xs text-gray-500 dark:text-gray-400 mt-1"
                >
                  {style.description}
                </span>
              </div>
              <div
                tabIndex={disabled ? -1 : 0}
                onKeyDown={(e) => handleKeyDown(e, style.value)}
                className="absolute inset-0 rounded-lg focus:outline-none"
                role="button"
                aria-label={`Select ${style.label} style: ${style.description}`}
                aria-pressed={value === style.value}
              />
            </label>
          ))}
        </div>
      </fieldset>
    </div>
  );
};
