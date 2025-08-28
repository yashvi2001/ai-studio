import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ImageData, Generation, StyleType } from '../types';

interface AppState {
  // Image upload state
  uploadedImage: ImageData | null;
  
  // Generation state
  prompt: string;
  selectedStyle: StyleType;
  isGenerating: boolean;
  currentGeneration: Generation | null;
  retryCount: number;
  error: string | null;
  
  // History state
  history: Generation[];
}

interface AppStateContextType {
  state: AppState;
  updateState: (updates: Partial<AppState>) => void;
  resetState: () => void;
  clearHistory: () => void;
  addToHistory: (generation: Generation) => void;
  removeFromHistory: (id: string) => void;
}

const defaultState: AppState = {
  uploadedImage: null,
  prompt: '',
  selectedStyle: 'editorial',
  isGenerating: false,
  currentGeneration: null,
  retryCount: 0,
  error: null,
  history: [],
};

const AppStateContext = createContext<AppStateContextType | undefined>(undefined);

interface AppStateProviderProps {
  children: ReactNode;
}

export const AppStateProvider: React.FC<AppStateProviderProps> = ({ children }) => {
  const [state, setState] = useState<AppState>(() => {
    // Load state from localStorage on mount
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('ai-studio-app-state');
        if (saved) {
          const parsed = JSON.parse(saved);
          // Merge with defaults to handle missing properties
          return { ...defaultState, ...parsed };
        }
      } catch (e) {
        console.error('Failed to load app state:', e);
      }
    }
    return defaultState;
  });

  // Save state to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        // Don't save isGenerating state to avoid getting stuck in loading state
        const stateToSave = { ...state, isGenerating: false };
        localStorage.setItem('ai-studio-app-state', JSON.stringify(stateToSave));
      } catch (e) {
        console.error('Failed to save app state:', e);
      }
    }
  }, [state]);

  // Load history separately for backward compatibility
  useEffect(() => {
    if (typeof window !== 'undefined' && state.history.length === 0) {
      try {
        const savedHistory = localStorage.getItem('ai-studio-history');
        if (savedHistory) {
          const parsed = JSON.parse(savedHistory) as Generation[];
          setState(prev => ({ ...prev, history: parsed }));
        }
      } catch (e) {
        console.error('Failed to load history:', e);
      }
    }
  }, []);

  const updateState = (updates: Partial<AppState>) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  const resetState = () => {
    setState(defaultState);
    // Clear localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('ai-studio-app-state');
      localStorage.removeItem('ai-studio-history');
    }
  };

  const clearHistory = () => {
    setState(prev => ({ ...prev, history: [] }));
  };

  const addToHistory = (generation: Generation) => {
    setState(prev => {
      const newHistory = [generation, ...prev.history.slice(0, 4)]; // Keep only last 5
      return { ...prev, history: newHistory };
    });
  };

  const removeFromHistory = (id: string) => {
    setState(prev => ({
      ...prev,
      history: prev.history.filter(g => g.id !== id)
    }));
  };

  const contextValue: AppStateContextType = {
    state,
    updateState,
    resetState,
    clearHistory,
    addToHistory,
    removeFromHistory,
  };

  return (
    <AppStateContext.Provider value={contextValue}>
      {children}
    </AppStateContext.Provider>
  );
};

export const useAppState = (): AppStateContextType => {
  const context = useContext(AppStateContext);
  if (context === undefined) {
    throw new Error('useAppState must be used within an AppStateProvider');
  }
  return context;
}; 