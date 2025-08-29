import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { StyleSelector } from '../StyleSelector';

describe('StyleSelector', () => {
  const mockOnChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders selected style in dropdown button', () => {
    render(<StyleSelector value="editorial" onChange={mockOnChange} />);

    expect(screen.getByText('Editorial')).toBeInTheDocument();
    expect(screen.getByText('Clean, professional look')).toBeInTheDocument();
  });

  it('shows selected style as active', () => {
    render(<StyleSelector value="cinematic" onChange={mockOnChange} />);

    const cinematicOption = screen.getByText('Cinematic');
    expect(cinematicOption).toBeInTheDocument();
  });

  it('calls onChange when a style is selected', async () => {
    const user = userEvent.setup();
    render(<StyleSelector value="editorial" onChange={mockOnChange} />);

    // Open dropdown
    const dropdownButton = screen.getByRole('button', { name: /editorial/i });
    await user.click(dropdownButton);

    // Select Artistic option
    const artisticOption = screen.getByRole('option', { name: /artistic/i });
    await user.click(artisticOption);

    expect(mockOnChange).toHaveBeenCalledWith('artistic');
  });

  it('supports keyboard navigation', async () => {
    const user = userEvent.setup();
    render(<StyleSelector value="editorial" onChange={mockOnChange} />);

    // Open dropdown
    const dropdownButton = screen.getByRole('button', { name: /editorial/i });
    await user.click(dropdownButton);

    // Focus on Artistic option and press Enter
    const artisticOption = screen.getByRole('option', { name: /artistic/i });
    artisticOption.focus();
    await user.keyboard('{Enter}');
    
    expect(mockOnChange).toHaveBeenCalledWith('artistic');
  });

  it('supports space key for selection', async () => {
    const user = userEvent.setup();
    render(<StyleSelector value="editorial" onChange={mockOnChange} />);

    // Open dropdown
    const dropdownButton = screen.getByRole('button', { name: /editorial/i });
    await user.click(dropdownButton);

    // Focus on Artistic option and press Space
    const artisticOption = screen.getByRole('option', { name: /artistic/i });
    artisticOption.focus();
    await user.keyboard(' ');
    
    expect(mockOnChange).toHaveBeenCalledWith('artistic');
  });

  it('disables interaction when disabled prop is true', () => {
    render(
      <StyleSelector
        value="editorial"
        onChange={mockOnChange}
        disabled={true}
      />
    );

    const dropdownButton = screen.getByRole('button', { name: /editorial/i });
    expect(dropdownButton).toBeDisabled();
  });

  it('has proper ARIA attributes', () => {
    render(<StyleSelector value="editorial" onChange={mockOnChange} />);

    const dropdownButton = screen.getByRole('button', { name: /editorial/i });
    expect(dropdownButton).toHaveAttribute('aria-haspopup', 'listbox');
    expect(dropdownButton).toHaveAttribute('aria-expanded', 'false');
  });

  it('shows all style options and descriptions when dropdown is open', async () => {
    const user = userEvent.setup();
    render(<StyleSelector value="editorial" onChange={mockOnChange} />);

    // Open dropdown
    const dropdownButton = screen.getByRole('button', { name: /editorial/i });
    await user.click(dropdownButton);

    // Check that all style options are visible in the dropdown
    const dropdownOptions = screen.getAllByRole('option');
    expect(dropdownOptions).toHaveLength(8);

    // Check that the dropdown contains the expected number of descriptions
    const descriptions = [
      'Clean, professional look',
      'Dramatic, movie-like feel',
      'Creative, expressive style',
      'Ultra-realistic appearance',
      'Japanese animation style',
      'Hand-drawn, pencil-like',
      'Soft, flowing paint style',
      'Rich, textured brushwork'
    ];

    descriptions.forEach(description => {
      const elements = screen.getAllByText(description);
      expect(elements.length).toBeGreaterThan(0);
    });
  });

  it('has proper fieldset and legend structure', () => {
    render(<StyleSelector value="editorial" onChange={mockOnChange} />);

    const fieldset = screen.getByRole('group');
    expect(fieldset).toBeInTheDocument();

    const legend = screen.getByText('Choose a style');
    expect(legend).toBeInTheDocument();
  });

  it('maintains focus states for keyboard navigation', async () => {
    const user = userEvent.setup();
    render(<StyleSelector value="editorial" onChange={mockOnChange} />);

    // Open dropdown
    const dropdownButton = screen.getByRole('button', { name: /editorial/i });
    await user.click(dropdownButton);

    // Focus on first option
    const firstOption = screen.getByRole('option', { name: /editorial/i });
    firstOption.focus();

    expect(firstOption).toHaveClass('focus:ring-2');
  });

  it('opens and closes dropdown correctly', async () => {
    const user = userEvent.setup();
    render(<StyleSelector value="editorial" onChange={mockOnChange} />);

    const dropdownButton = screen.getByRole('button', { name: /editorial/i });
    
    // Initially closed
    expect(dropdownButton).toHaveAttribute('aria-expanded', 'false');
    
    // Open dropdown
    await user.click(dropdownButton);
    expect(dropdownButton).toHaveAttribute('aria-expanded', 'true');
    
    // Close dropdown by clicking outside
    await user.click(document.body);
    expect(dropdownButton).toHaveAttribute('aria-expanded', 'false');
  });

  it('displays correct selected style in dropdown button', () => {
    render(<StyleSelector value="anime" onChange={mockOnChange} />);

    const dropdownButton = screen.getByRole('button', { name: /anime/i });
    expect(dropdownButton).toBeInTheDocument();
    expect(screen.getByText('Japanese animation style')).toBeInTheDocument();
  });
});
