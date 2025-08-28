import React, { useState, useEffect, ReactNode } from 'react';
import { ThemeContext, ThemeContextType } from './theme';

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
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
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
        console.log(
          '🌙 Dark mode enabled, classes:',
          htmlElement.classList.toString()
        );
      } else {
        htmlElement.classList.remove('dark');
        htmlElement.setAttribute('data-theme', 'light');
        console.log(
          '☀️ Light mode enabled, classes:',
          htmlElement.classList.toString()
        );
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
        console.log('🚀 Initial dark mode applied');
      } else {
        htmlElement.classList.remove('dark');
        htmlElement.setAttribute('data-theme', 'light');
        console.log('🚀 Initial light mode applied');
      }
    }
  }, []);

  const toggleTheme = (): void => {
    console.log(
      '🔄 Toggling theme from',
      isDark ? 'dark' : 'light',
      'to',
      !isDark ? 'dark' : 'light'
    );
    setIsDark(!isDark);
  };

  const contextValue: ThemeContextType = {
    isDark,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};
