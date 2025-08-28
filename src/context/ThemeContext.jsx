import { useState, useEffect } from 'react';
import { ThemeContext } from './theme';

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(() => {
    // Check localStorage first, then system preference
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('ai-studio-theme');
      if (saved) {
        return saved === 'dark';
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return true; // Default to dark mode
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('ai-studio-theme', isDark ? 'dark' : 'light');
      document.documentElement.classList.toggle('dark', isDark);

      // Also set a data attribute for easier CSS targeting
      document.documentElement.setAttribute(
        'data-theme',
        isDark ? 'dark' : 'light'
      );
    }
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
