import React from 'react';
import { useTheme } from '../hooks/useTheme';
import { ImageStudio } from './ImageStudio';

export const Layout: React.FC = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className="h-screen bg-white dark:bg-gray-900 transition-colors duration-200 flex flex-col overflow-hidden">
      {/* Skip to main content link for screen readers */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-4 py-2 rounded-md z-50"
      >
        Skip to main content
      </a>

      {/* Header */}
      <header
        className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 sm:px-6 py-3 sm:py-4 flex-shrink-0"
        role="banner"
      >
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-3 sm:space-x-4">
            {/* Modelia Logo */}
            <img 
              src="/modelia-logo.svg" 
              alt="Modelia Logo" 
              className="h-8 w-auto"
            />
            <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
              AI Studio
            </h1>
          </div>

          <nav
            className="flex items-center space-x-3 sm:space-x-4"
            role="navigation"
            aria-label="Main navigation"
          >
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gradient-to-r from-pink-100 to-purple-100 dark:from-pink-900 dark:to-purple-900 text-gray-600 dark:text-gray-300 hover:from-pink-200 hover:to-purple-200 dark:hover:from-pink-800 dark:hover:to-purple-800 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition-all duration-200"
              aria-label={
                isDark ? 'Switch to light mode' : 'Switch to dark mode'
              }
              aria-pressed={isDark}
            >
              {isDark ? (
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                >
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main
        id="main-content"
        className="flex-1 flex overflow-hidden min-h-0"
        role="main"
        aria-label="AI Image Studio main content"
      >
        <ImageStudio />
      </main>
    </div>
  );
};
