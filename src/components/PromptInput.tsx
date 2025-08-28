import React, { ChangeEvent } from 'react';

interface PromptInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export const PromptInput: React.FC<PromptInputProps> = ({
  value,
  onChange,
  disabled = false,
  placeholder = 'Describe the changes you want to make to your image...',
}) => {
  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="space-y-2">
      <label
        htmlFor="prompt-textarea"
        className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2"
      >
        Prompt
      </label>
      <textarea
        id="prompt-textarea"
        value={value}
        onChange={handleChange}
        disabled={disabled}
        placeholder={placeholder}
        className="w-full h-20 sm:h-24 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
        aria-describedby="prompt-help"
      />
      <p id="prompt-help" className="text-xs text-gray-500 dark:text-gray-400">
        Be specific about the style, mood, and changes you want to see
      </p>
    </div>
  );
};
