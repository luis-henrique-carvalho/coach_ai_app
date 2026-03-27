import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Login from './Login'

describe('Login', () => {
  const renderWithRouter = (component: React.ReactElement) => {
    return render(<BrowserRouter>{component}</BrowserRouter>)
  }

  it('renders welcome heading', () => {
    renderWithRouter(<Login />)
    expect(screen.getByText(/Welcome to Coach AI/i)).toBeInTheDocument()
  })

  it('renders sign in description', () => {
    renderWithRouter(<Login />)
    expect(screen.getByText(/Sign in to get started/i)).toBeInTheDocument()
  })

  it('renders both Google and GitHub login buttons', () => {
    renderWithRouter(<Login />)
    
    const buttons = screen.getAllByRole('button')
    expect(buttons).toHaveLength(2)
    
    expect(screen.getByText(/Continue with Google/i)).toBeInTheDocument()
    expect(screen.getByText(/Continue with GitHub/i)).toBeInTheDocument()
  })

  it('has centered layout with Tailwind classes', () => {
    const { container } = renderWithRouter(<Login />)
    
    const mainDiv = container.querySelector('.min-h-screen')
    expect(mainDiv).toBeInTheDocument()
    expect(mainDiv).toHaveClass('flex', 'items-center', 'justify-center')
  })

  it('uses background styling', () => {
    const { container } = renderWithRouter(<Login />)
    
    const mainDiv = container.querySelector('.bg-background')
    expect(mainDiv).toBeInTheDocument()
  })
})
