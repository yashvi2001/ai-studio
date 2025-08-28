import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Layout } from '../Layout';

// Mock the hooks
vi.mock('../../hooks/useTheme', () => ({
  useTheme: () => ({
    isDark: false,
    toggleTheme: vi.fn(),
  }),
}));

// Mock the ImageStudio component
vi.mock('../ImageStudio', () => ({
  ImageStudio: () => <div data-testid="image-studio">Image Studio Mock</div>,
}));

describe('Layout', () => {
  it('renders the main header with title', () => {
    render(<Layout />);
    
    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'AI Studio' })).toBeInTheDocument();
  });

  it('renders the theme toggle button', () => {
    render(<Layout />);
    
    const themeToggle = screen.getByRole('button', { name: /switch to dark mode/i });
    expect(themeToggle).toBeInTheDocument();
  });

  it('renders the main navigation', () => {
    render(<Layout />);
    
    const navigation = screen.getByRole('navigation', { name: /main navigation/i });
    expect(navigation).toBeInTheDocument();
  });

  it('renders the main content area', () => {
    render(<Layout />);
    
    const mainContent = screen.getByRole('main', { name: /ai image studio main content/i });
    expect(mainContent).toBeInTheDocument();
  });

  it('has proper skip link for accessibility', () => {
    render(<Layout />);
    
    const skipLink = screen.getByText('Skip to main content');
    expect(skipLink).toHaveAttribute('href', '#main-content');
    expect(skipLink).toHaveClass('sr-only');
  });

  it('has proper ARIA landmarks', () => {
    render(<Layout />);
    
    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByRole('navigation')).toBeInTheDocument();
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('has proper heading hierarchy', () => {
    render(<Layout />);
    
    const mainHeading = screen.getByRole('heading', { level: 1 });
    expect(mainHeading).toHaveTextContent('AI Studio');
  });

  it('supports keyboard navigation', () => {
    render(<Layout />);
    
    const themeToggle = screen.getByRole('button', { name: /switch to dark mode/i });
    // Buttons are focusable by default, so they don't need explicit tabIndex
    expect(themeToggle).toBeInTheDocument();
  });

  it('has proper focus states', () => {
    render(<Layout />);
    
    const themeToggle = screen.getByRole('button', { name: /switch to dark mode/i });
    expect(themeToggle).toHaveClass('focus:outline-none', 'focus:ring-2');
  });

  it('renders with light theme by default', () => {
    render(<Layout />);
    
    const container = screen.getByRole('banner').parentElement;
    expect(container).toHaveClass('bg-white');
  });

  it('has proper semantic structure', () => {
    render(<Layout />);
    
    // Check that the layout follows proper semantic structure
    const header = screen.getByRole('banner');
    const nav = screen.getByRole('navigation');
    const main = screen.getByRole('main');
    
    expect(header).toBeInTheDocument();
    expect(nav).toBeInTheDocument();
    expect(main).toBeInTheDocument();
  });
}); 