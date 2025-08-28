import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ThemeProvider } from '../ThemeContext';
import { useTheme } from '../../hooks/useTheme';

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

// Test component to use the context
const TestComponent = () => {
  const { isDark, toggleTheme } = useTheme();
  return (
    <div>
      <span data-testid="theme-status">
        {isDark ? 'dark' : 'light'}
      </span>
      <button onClick={toggleTheme} data-testid="theme-toggle">
        Toggle Theme
      </button>
    </div>
  );
};

describe('ThemeContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset HTML classes
    document.documentElement.classList.remove('dark');
    document.documentElement.removeAttribute('data-theme');
    document.body.removeAttribute('data-theme');
  });

  it('provides default light theme', () => {
    localStorageMock.getItem.mockReturnValue(null);
    
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );
    
    expect(screen.getByTestId('theme-status')).toHaveTextContent('light');
  });

  it('loads theme from localStorage on mount', () => {
    localStorageMock.getItem.mockReturnValue('dark');
    
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );
    
    expect(screen.getByTestId('theme-status')).toHaveTextContent('dark');
    expect(document.documentElement).toHaveClass('dark');
  });

  it('toggles theme when toggleTheme is called', async () => {
    const user = userEvent.setup();
    localStorageMock.getItem.mockReturnValue('light');
    
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );
    
    expect(screen.getByTestId('theme-status')).toHaveTextContent('light');
    
    const toggleButton = screen.getByTestId('theme-toggle');
    await user.click(toggleButton);
    
    expect(screen.getByTestId('theme-status')).toHaveTextContent('dark');
    expect(localStorageMock.setItem).toHaveBeenCalledWith('ai-studio-theme', 'dark');
  });

  it('applies dark theme classes to HTML element', () => {
    localStorageMock.getItem.mockReturnValue('dark');
    
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );
    
    expect(document.documentElement).toHaveClass('dark');
    expect(document.documentElement).toHaveAttribute('data-theme', 'dark');
    expect(document.body).toHaveAttribute('data-theme', 'dark');
  });

  it('applies light theme classes to HTML element', () => {
    localStorageMock.getItem.mockReturnValue('light');
    
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );
    
    expect(document.documentElement).not.toHaveClass('dark');
    expect(document.documentElement).toHaveAttribute('data-theme', 'light');
    expect(document.body).toHaveAttribute('data-theme', 'light');
  });

  it('persists theme preference to localStorage', async () => {
    const user = userEvent.setup();
    localStorageMock.getItem.mockReturnValue('light');
    
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );
    
    const toggleButton = screen.getByTestId('theme-toggle');
    await user.click(toggleButton);
    
    expect(localStorageMock.setItem).toHaveBeenCalledWith('ai-studio-theme', 'dark');
  });

  it('handles invalid localStorage values gracefully', () => {
    localStorageMock.getItem.mockReturnValue('invalid-theme');
    
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );
    
    // Should default to light theme
    expect(screen.getByTestId('theme-status')).toHaveTextContent('light');
  });

  it('updates HTML attributes when theme changes', async () => {
    const user = userEvent.setup();
    localStorageMock.getItem.mockReturnValue('light');
    
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );
    
    // Initial state
    expect(document.documentElement).not.toHaveClass('dark');
    expect(document.documentElement).toHaveAttribute('data-theme', 'light');
    
    // Toggle to dark
    const toggleButton = screen.getByTestId('theme-toggle');
    await user.click(toggleButton);
    
    // Updated state
    expect(document.documentElement).toHaveClass('dark');
    expect(document.documentElement).toHaveAttribute('data-theme', 'dark');
  });

  it('provides consistent theme state across re-renders', () => {
    localStorageMock.getItem.mockReturnValue('dark');
    
    const { rerender } = render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );
    
    expect(screen.getByTestId('theme-status')).toHaveTextContent('dark');
    
    // Re-render the component
    rerender(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );
    
    // Theme should remain the same
    expect(screen.getByTestId('theme-status')).toHaveTextContent('dark');
  });
}); 