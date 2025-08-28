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

  it('renders all style options', () => {
    render(<StyleSelector value="editorial" onChange={mockOnChange} />);
    
    expect(screen.getByText('Editorial')).toBeInTheDocument();
    expect(screen.getByText('Cinematic')).toBeInTheDocument();
    expect(screen.getByText('Artistic')).toBeInTheDocument();
    expect(screen.getByText('Photorealistic')).toBeInTheDocument();
    expect(screen.getByText('Anime')).toBeInTheDocument();
    expect(screen.getByText('Sketch')).toBeInTheDocument();
    expect(screen.getByText('Watercolor')).toBeInTheDocument();
    expect(screen.getByText('Oil Painting')).toBeInTheDocument();
  });

  it('shows selected style as active', () => {
    render(<StyleSelector value="cinematic" onChange={mockOnChange} />);
    
    const cinematicOption = screen.getByText('Cinematic').closest('label');
    expect(cinematicOption).toHaveClass('border-blue-600');
  });

  it('calls onChange when a style is selected', async () => {
    const user = userEvent.setup();
    render(<StyleSelector value="editorial" onChange={mockOnChange} />);
    
    const artisticOption = screen.getByText('Artistic').closest('label');
    await user.click(artisticOption!);
    
    expect(mockOnChange).toHaveBeenCalledWith('artistic');
  });

  it('supports keyboard navigation', async () => {
    const user = userEvent.setup();
    render(<StyleSelector value="editorial" onChange={mockOnChange} />);
    
    const artisticOption = screen.getByText('Artistic').closest('label');
    const buttonElement = artisticOption!.querySelector('[role="button"]') as HTMLElement;
    buttonElement!.focus();
    
    await user.keyboard('{Enter}');
    expect(mockOnChange).toHaveBeenCalledWith('artistic');
  });

  it('supports space key for selection', async () => {
    const user = userEvent.setup();
    render(<StyleSelector value="editorial" onChange={mockOnChange} />);
    
    const artisticOption = screen.getByText('Artistic').closest('label');
    const buttonElement = artisticOption!.querySelector('[role="button"]') as HTMLElement;
    buttonElement.focus();
    
    await user.keyboard(' ');
    expect(mockOnChange).toHaveBeenCalledWith('artistic');
  });

  it('disables interaction when disabled prop is true', () => {
    render(<StyleSelector value="editorial" onChange={mockOnChange} disabled={true} />);
    
    const allLabels = screen.getAllByRole('radio');
    allLabels.forEach(label => {
      expect(label).toBeDisabled();
    });
  });

  it('has proper ARIA attributes', () => {
    render(<StyleSelector value="editorial" onChange={mockOnChange} />);
    
    const radioGroup = screen.getByRole('radiogroup');
    expect(radioGroup).toHaveAttribute('aria-label', 'AI art style selection');
    
    const radioButtons = screen.getAllByRole('radio');
    expect(radioButtons).toHaveLength(8);
    
    radioButtons.forEach((radio) => {
      expect(radio).toHaveAttribute('aria-describedby');
    });
  });

  it('shows style descriptions', () => {
    render(<StyleSelector value="editorial" onChange={mockOnChange} />);
    
    expect(screen.getByText('Clean, professional look')).toBeInTheDocument();
    expect(screen.getByText('Dramatic, movie-like feel')).toBeInTheDocument();
    expect(screen.getByText('Creative, expressive style')).toBeInTheDocument();
    expect(screen.getByText('Ultra-realistic appearance')).toBeInTheDocument();
    expect(screen.getByText('Japanese animation style')).toBeInTheDocument();
    expect(screen.getByText('Hand-drawn, pencil-like')).toBeInTheDocument();
    expect(screen.getByText('Soft, flowing paint style')).toBeInTheDocument();
    expect(screen.getByText('Rich, textured brushwork')).toBeInTheDocument();
  });

  it('has proper fieldset and legend structure', () => {
    render(<StyleSelector value="editorial" onChange={mockOnChange} />);
    
    const fieldset = screen.getByRole('group');
    expect(fieldset).toBeInTheDocument();
    
    const legend = screen.getByText('Choose a style');
    expect(legend).toBeInTheDocument();
  });

  it('maintains focus states for keyboard navigation', () => {
    render(<StyleSelector value="editorial" onChange={mockOnChange} />);
    
    const firstOption = screen.getByText('Editorial').closest('label');
    firstOption!.focus();
    
    expect(firstOption).toHaveClass('focus-within:ring-2');
  });
}); 