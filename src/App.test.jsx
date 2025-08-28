import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import App from './App'

describe('App', () => {
  it('renders Vite and React logos', () => {
    render(<App />)
    
    const viteLogo = screen.getByAltText('Vite logo')
    const reactLogo = screen.getByAltText('React logo')
    
    expect(viteLogo).toBeInTheDocument()
    expect(reactLogo).toBeInTheDocument()
  })

  it('renders the main heading', () => {
    render(<App />)
    
    const heading = screen.getByText('Vite + React')
    expect(heading).toBeInTheDocument()
  })

  it('renders the count button', () => {
    render(<App />)
    
    const button = screen.getByRole('button', { name: /count is/i })
    expect(button).toBeInTheDocument()
  })
}) 