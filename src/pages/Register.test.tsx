import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Register from './Register'
import * as AuthContext from '../contexts/AuthContext'

vi.mock('../contexts/AuthContext', () => ({
  useAuth: vi.fn()
}))

describe('Register', () => {
  beforeEach(() => {
    vi.mocked(AuthContext.useAuth).mockReturnValue({
      user: null,
      loading: false,
      login: vi.fn().mockResolvedValue({ success: true }),
      register: vi.fn().mockResolvedValue({ success: true }),
      logout: vi.fn()
    })
  })

  const renderWithRouter = (component: React.ReactElement) => {
    return render(<BrowserRouter>{component}</BrowserRouter>)
  }

  it('renders create account heading', () => {
    renderWithRouter(<Register />)
    expect(screen.getByRole('heading', { name: /create account/i })).toBeInTheDocument()
  })

  it('renders registration description', () => {
    renderWithRouter(<Register />)
    expect(screen.getByText(/Join Coach AI and start your journey/i)).toBeInTheDocument()
  })

  it('renders name input field', () => {
    renderWithRouter(<Register />)
    expect(screen.getByLabelText(/Name/i)).toBeInTheDocument()
  })

  it('renders email input field', () => {
    renderWithRouter(<Register />)
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument()
  })

  it('renders password input field', () => {
    renderWithRouter(<Register />)
    expect(screen.getByLabelText('Password')).toBeInTheDocument()
  })

  it('renders confirm password input field', () => {
    renderWithRouter(<Register />)
    expect(screen.getByLabelText(/Confirm Password/i)).toBeInTheDocument()
  })

  it('renders create account button', () => {
    renderWithRouter(<Register />)
    expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument()
  })

  it('renders sign in link', () => {
    renderWithRouter(<Register />)
    expect(screen.getByText(/Sign in/)).toBeInTheDocument()
  })

  it('has centered layout with Tailwind classes', () => {
    const { container } = renderWithRouter(<Register />)
    
    const mainDiv = container.querySelector('.min-h-screen')
    expect(mainDiv).toBeInTheDocument()
    expect(mainDiv).toHaveClass('flex', 'items-center', 'justify-center')
  })
})
