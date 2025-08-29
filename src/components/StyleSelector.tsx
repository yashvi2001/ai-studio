import React, { useState, useRef, useEffect } from 'react';

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
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedStyle = styles.find((style) => style.value === value);

  const handleKeyDown = (event: React.KeyboardEvent, styleValue: StyleType) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      if (!disabled) {
        onChange(styleValue);
        setIsDropdownOpen(false);
      }
    }
  };

  return (
    <div className="space-y-3" ref={dropdownRef}>
      <fieldset disabled={disabled} className="space-y-3">
        <legend className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2 sm:mb-3">
          Choose a style
        </legend>

        {/* Dropdown Button */}
        <div className="relative">
          <button
            type="button"
            onClick={() => !disabled && setIsDropdownOpen(!isDropdownOpen)}
            disabled={disabled}
            className={`w-full flex items-center justify-between p-3 sm:p-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-left shadow-sm hover:border-pink-500 dark:hover:border-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 ${
              disabled
                ? 'opacity-50 cursor-not-allowed'
                : 'cursor-pointer hover:shadow-md'
            }`}
            aria-haspopup="listbox"
            aria-expanded={isDropdownOpen}
            aria-labelledby="style-selector-label"
          >
            <div className="flex items-center gap-3">
              <div className="text-2xl sm:text-3xl" aria-hidden="true">
                {selectedStyle?.icon}
              </div>
              <div className="min-w-0">
                <div className="font-medium text-gray-900 dark:text-gray-100 text-sm sm:text-base">
                  {selectedStyle?.label}
                </div>
                <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">
                  {selectedStyle?.description}
                </div>
              </div>
            </div>
            <svg
              width="20"
              height="20"
              className={`ml-2 flex-shrink-0 transition-transform duration-200 text-gray-400 ${isDropdownOpen ? 'rotate-180' : ''}`}
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M7,10L12,15L17,10H7Z" />
            </svg>
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && !disabled && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-50 max-h-64 overflow-y-auto custom-scrollbar">
              <div className="p-2 space-y-1">
                {styles.map((style) => (
                  <button
                    key={style.value}
                    onClick={() => {
                      onChange(style.value);
                      setIsDropdownOpen(false);
                    }}
                    onKeyDown={(e) => handleKeyDown(e, style.value)}
                    className={`w-full flex items-center gap-3 p-3 text-left rounded-md transition-all duration-200 ${
                      value === style.value
                        ? 'bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 text-pink-900 dark:text-pink-100 border border-pink-200 dark:border-pink-800'
                        : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50 border border-transparent'
                    } focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-1`}
                    role="option"
                    aria-selected={value === style.value}
                    tabIndex={0}
                  >
                    <div
                      className="text-xl sm:text-2xl flex-shrink-0"
                      aria-hidden="true"
                    >
                      {style.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm">{style.label}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {style.description}
                      </div>
                    </div>
                    {value === style.value && (
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="text-pink-600 dark:text-pink-400 flex-shrink-0"
                        aria-hidden="true"
                      >
                        <path d="M9,20.42L2.79,14.21L5.62,11.38L9,14.77L18.88,4.88L21.71,7.71L9,20.42Z" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </fieldset>
    </div>
  );
};
