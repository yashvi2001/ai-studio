import React, { useState, useEffect, ReactNode } from 'react';
import { ThemeContext, ThemeContextType, themeColors } from './theme';

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [isDark, setIsDark] = useState<boolean>(() => {
    // Check localStorage first, then system preference
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('ai-studio-theme');
      if (saved) {
        return saved === 'dark';
      }
      if (window.matchMedia) {
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
      }
      return false;
    }
    return false; // Default to light mode
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('ai-studio-theme', isDark ? 'dark' : 'light');

      // Apply dark mode class to html element
      const htmlElement = document.documentElement;
      if (isDark) {
        htmlElement.classList.add('dark');
        htmlElement.setAttribute('data-theme', 'dark');
      } else {
        htmlElement.classList.remove('dark');
        htmlElement.setAttribute('data-theme', 'light');
      }

      // Also set a data attribute for easier CSS targeting
      document.body.setAttribute('data-theme', isDark ? 'dark' : 'light');
    }
  }, [isDark]);

  // Initialize theme on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const htmlElement = document.documentElement;
      if (isDark) {
        htmlElement.classList.add('dark');
        htmlElement.setAttribute('data-theme', 'dark');
      } else {
        htmlElement.classList.remove('dark');
        htmlElement.setAttribute('data-theme', 'light');
      }
    }
  }, [isDark]);

  const toggleTheme = (): void => {
    setIsDark(!isDark);
  };

  const contextValue: ThemeContextType = {
    isDark,
    toggleTheme,
    colors: themeColors,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};
