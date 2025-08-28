import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from './App';

describe('App', () => {
  it('renders the AI Studio heading', () => {
    render(<App />);

    const heading = screen.getByText('AI Studio');
    expect(heading).toBeInTheDocument();
  });

  it('renders the upload image section', () => {
    render(<App />);

    const uploadHeading = screen.getByText('Upload Image');
    expect(uploadHeading).toBeInTheDocument();
  });

  it('renders the theme toggle button', () => {
    render(<App />);

    const themeButton = screen.getByRole('button', { name: /switch to/i });
    expect(themeButton).toBeInTheDocument();
  });
});
