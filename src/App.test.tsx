import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from './App'
import * as AuthContext from './contexts/AuthContext'

// Mock the auth context
vi.mock('./contexts/AuthContext', async () => {
  const actual = await vi.importActual('./contexts/AuthContext')
  return {
    ...actual,
    AuthProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    useAuth: vi.fn()
  }
})

describe('App', () => {
  it('wraps routes with AuthProvider', () => {
    vi.mocked(AuthContext.useAuth).mockReturnValue({
      user: null,
      loading: false,
      logout: vi.fn()
    })

    render(<App />)
    
    // Should render without errors (AuthProvider is in place)
    expect(screen.getByText(/Coach AI/i)).toBeInTheDocument()
  })

  it('renders Login route at /login', () => {
    vi.mocked(AuthContext.useAuth).mockReturnValue({
      user: null,
      loading: false,
      logout: vi.fn()
    })

    window.history.pushState({}, '', '/login')
    render(<App />)

    expect(screen.getByText(/Welcome to Coach AI/i)).toBeInTheDocument()
    expect(screen.getByText(/Sign in to get started/i)).toBeInTheDocument()
  })

  it('wraps dashboard route with ProtectedRoute', () => {
    const mockUser = {
      id: '123',
      email: 'test@example.com',
      name: 'Test User',
      providers: ['google']
    }

    vi.mocked(AuthContext.useAuth).mockReturnValue({
      user: mockUser,
      loading: false,
      logout: vi.fn()
    })

    window.history.pushState({}, '', '/dashboard')
    render(<App />)

    expect(screen.getByText('Dashboard')).toBeInTheDocument()
  })

  it('redirects to login when accessing dashboard without auth', () => {
    vi.mocked(AuthContext.useAuth).mockReturnValue({
      user: null,
      loading: false,
      logout: vi.fn()
    })

    window.history.pushState({}, '', '/dashboard')
    render(<App />)

    // Should be redirected to login
    expect(screen.getByText(/Welcome to Coach AI/i)).toBeInTheDocument()
  })
})
