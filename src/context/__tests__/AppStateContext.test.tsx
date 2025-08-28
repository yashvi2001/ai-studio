import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AppStateProvider } from '../AppStateContext';
import { useAppState } from '../../hooks/useAppState';
import { Generation, StyleType } from '../../types';

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  length: 0,
  key: vi.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

// Mock the mockAPI
vi.mock('../../services/mockAPI', () => ({
  mockGenerateAPI: vi.fn(),
}));

const mockGeneration: Generation = {
  id: 'test-1',
  imageUrl: 'data:image/jpeg;base64,generated',
  prompt: 'Test prompt',
  style: 'editorial' as StyleType,
  createdAt: new Date().toISOString(),
  sourceImage: 'data:image/jpeg;base64,test',
};

// Test component to use the context
const TestComponent = () => {
  const { state, updateState, addToHistory, clearHistory } = useAppState();

  return (
    <div>
      <div data-testid="prompt">{state.prompt}</div>
      <div data-testid="style">{state.selectedStyle}</div>
      <div data-testid="history-count">{state.history.length}</div>
      <button
        onClick={() => updateState({ prompt: 'New prompt' })}
        data-testid="update-prompt"
      >
        Update Prompt
      </button>
      <button
        onClick={() => addToHistory(mockGeneration)}
        data-testid="add-history"
      >
        Add to History
      </button>
      <button onClick={clearHistory} data-testid="clear-history">
        Clear History
      </button>
    </div>
  );
};

describe('AppStateContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
  });

  it('provides default state', () => {
    render(
      <AppStateProvider>
        <TestComponent />
      </AppStateProvider>
    );

    expect(screen.getByTestId('prompt')).toHaveTextContent('');
    expect(screen.getByTestId('style')).toHaveTextContent('editorial');
    expect(screen.getByTestId('history-count')).toHaveTextContent('0');
  });

  it('loads state from localStorage on mount', () => {
    const savedState = {
      prompt: 'Saved prompt',
      selectedStyle: 'cinematic' as StyleType,
      history: [mockGeneration],
    };

    localStorageMock.getItem.mockReturnValue(JSON.stringify(savedState));

    render(
      <AppStateProvider>
        <TestComponent />
      </AppStateProvider>
    );

    expect(screen.getByTestId('prompt')).toHaveTextContent('Saved prompt');
    expect(screen.getByTestId('style')).toHaveTextContent('cinematic');
    expect(screen.getByTestId('history-count')).toHaveTextContent('1');
  });

  it('updates state when updateState is called', async () => {
    const user = userEvent.setup();

    render(
      <AppStateProvider>
        <TestComponent />
      </AppStateProvider>
    );

    expect(screen.getByTestId('prompt')).toHaveTextContent('');

    const updateButton = screen.getByTestId('update-prompt');
    await user.click(updateButton);

    expect(screen.getByTestId('prompt')).toHaveTextContent('New prompt');
  });

  it('adds items to history', async () => {
    const user = userEvent.setup();

    render(
      <AppStateProvider>
        <TestComponent />
      </AppStateProvider>
    );

    expect(screen.getByTestId('history-count')).toHaveTextContent('0');

    const addButton = screen.getByTestId('add-history');
    await user.click(addButton);

    expect(screen.getByTestId('history-count')).toHaveTextContent('1');
  });

  it('clears history when clearHistory is called', async () => {
    const user = userEvent.setup();

    // First add some history
    localStorageMock.getItem
      .mockReturnValueOnce(
        JSON.stringify({
          history: [mockGeneration],
        })
      )
      .mockReturnValue(null); // For subsequent calls

    render(
      <AppStateProvider>
        <TestComponent />
      </AppStateProvider>
    );

    expect(screen.getByTestId('history-count')).toHaveTextContent('1');

    const clearButton = screen.getByTestId('clear-history');
    await user.click(clearButton);

    // Wait for state update and verify
    await screen.findByTestId('history-count');
    const historyCount = screen.getByTestId('history-count');
    expect(historyCount).toHaveTextContent('0');
  });

  it('persists state changes to localStorage', async () => {
    const user = userEvent.setup();

    render(
      <AppStateProvider>
        <TestComponent />
      </AppStateProvider>
    );

    const updateButton = screen.getByTestId('update-prompt');
    await user.click(updateButton);

    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'ai-studio-app-state',
      expect.stringContaining('"prompt":"New prompt"')
    );
  });

  it('handles localStorage errors gracefully', () => {
    localStorageMock.setItem.mockImplementation(() => {
      throw new Error('Storage quota exceeded');
    });

    // Should not crash the app
    expect(() => {
      render(
        <AppStateProvider>
          <TestComponent />
        </AppStateProvider>
      );
    }).not.toThrow();
  });

  it('loads history from legacy localStorage key', () => {
    const legacyHistory = [mockGeneration];
    localStorageMock.getItem
      .mockReturnValueOnce(null) // First call for main state
      .mockReturnValueOnce(JSON.stringify(legacyHistory)); // Second call for legacy history

    render(
      <AppStateProvider>
        <TestComponent />
      </AppStateProvider>
    );

    expect(screen.getByTestId('history-count')).toHaveTextContent('1');
  });

  it('maintains state consistency across re-renders', () => {
    const { rerender } = render(
      <AppStateProvider>
        <TestComponent />
      </AppStateProvider>
    );

    const initialPrompt = screen.getByTestId('prompt').textContent;

    // Re-render the component
    rerender(
      <AppStateProvider>
        <TestComponent />
      </AppStateProvider>
    );

    // State should remain the same
    expect(screen.getByTestId('prompt')).toHaveTextContent(initialPrompt || '');
  });

  it('sets isGenerating to false when persisting to localStorage', async () => {
    const user = userEvent.setup();

    render(
      <AppStateProvider>
        <TestComponent />
      </AppStateProvider>
    );

    // Update state with isGenerating
    const updateButton = screen.getByTestId('update-prompt');
    await user.click(updateButton);

    // Check that localStorage was called with isGenerating set to false
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'ai-studio-app-state',
      expect.stringContaining('"isGenerating":false')
    );
  });
});
