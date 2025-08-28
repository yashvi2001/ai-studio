import React, { ReactNode } from 'react';
import { useTheme } from '../hooks/useTheme';

interface LayoutProps {
  children: ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isDark, toggleTheme } = useTheme();

  // Debug logging
  console.log('🎨 Layout component - isDark:', isDark);

  return (
    <div className="w-screen h-screen flex flex-col bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans transition-colors duration-300">
      {/* Header */}
      <header className="h-16 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center px-6 backdrop-blur-lg z-50 sticky top-0">
        <div className="w-full flex justify-between items-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            AI Studio
          </h1>
          <button
            onClick={toggleTheme}
            className="w-12 h-12 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-700 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-500 flex items-center justify-center cursor-pointer transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            <div className="flex items-center justify-center w-full h-full transition-all duration-300 hover:scale-110">
              {isDark ? (
                // Sun icon for dark mode (switch to light)
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  stroke="none"
                  className="transition-all duration-300"
                >
                  <circle cx="12" cy="12" r="4" fill="currentColor" />
                  <path
                    d="M12 1v3M12 20v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M1 12h3M20 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              ) : (
                // Moon icon for light mode (switch to dark)
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  stroke="none"
                  className="transition-all duration-300"
                >
                  <path
                    d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
                    fill="currentColor"
                  />
                </svg>
              )}
            </div>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex overflow-hidden bg-gray-50 dark:bg-gray-900">
        {children}
      </main>
    </div>
  );
};
