import { createContext } from 'react';

export interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
  colors: {
    primary: {
      from: string;
      to: string;
    };
    secondary: {
      from: string;
      to: string;
    };
  };
}

export const ThemeContext = createContext<ThemeContextType | undefined>(
  undefined
);

export const themeColors = {
  primary: {
    from: 'from-pink-500',
    to: 'to-purple-600',
  },
  secondary: {
    from: 'from-pink-100',
    to: 'to-purple-100',
  },
  dark: {
    primary: {
      from: 'from-pink-600',
      to: 'to-purple-700',
    },
    secondary: {
      from: 'from-pink-900',
      to: 'to-purple-900',
    },
  },
};
