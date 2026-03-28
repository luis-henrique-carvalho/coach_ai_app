import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute'
import * as AuthContext from '../contexts/AuthContext'

// Mock the useAuth hook
vi.mock('../contexts/AuthContext', () => ({
  useAuth: vi.fn()
}))

describe('ProtectedRoute', () => {
  const TestChild = () => <div>Protected Content</div>

  const renderWithRouter = (component: React.ReactElement) => {
    return render(
      <BrowserRouter>
        <Routes>
          <Route path="/" element={component} />
          <Route path="/login" element={<div>Login Page</div>} />
        </Routes>
      </BrowserRouter>
    )
  }

  it('renders children when user is authenticated', () => {
    const mockUser = {
      id: '123',
      email: 'test@example.com',
      name: 'Test User',
      providers: ['google']
    }

    vi.mocked(AuthContext.useAuth).mockReturnValue({
      user: mockUser,
      loading: false,
      login: vi.fn().mockResolvedValue({ success: true }),
      register: vi.fn().mockResolvedValue({ success: true }),
      logout: vi.fn()
    })

    renderWithRouter(
      <ProtectedRoute>
        <TestChild />
      </ProtectedRoute>
    )

    expect(screen.getByText('Protected Content')).toBeInTheDocument()
  })

  it('shows loading spinner during initial auth check', () => {
    vi.mocked(AuthContext.useAuth).mockReturnValue({
      user: null,
      loading: true,
      login: vi.fn().mockResolvedValue({ success: true }),
      register: vi.fn().mockResolvedValue({ success: true }),
      logout: vi.fn()
    })

    const { container } = render(
      <BrowserRouter>
        <ProtectedRoute>
          <TestChild />
        </ProtectedRoute>
      </BrowserRouter>
    )

    expect(screen.getByText(/loading/i)).toBeInTheDocument()
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument()
    
    // Verify styling
    const loadingContainer = container.querySelector('.min-h-screen')
    expect(loadingContainer).toBeTruthy()
  })

  it('redirects to /login when not authenticated', () => {
    vi.mocked(AuthContext.useAuth).mockReturnValue({
      user: null,
      loading: false,
      login: vi.fn().mockResolvedValue({ success: true }),
      register: vi.fn().mockResolvedValue({ success: true }),
      logout: vi.fn()
    })

    renderWithRouter(
      <ProtectedRoute>
        <TestChild />
      </ProtectedRoute>
    )

    expect(screen.getByText('Login Page')).toBeInTheDocument()
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument()
  })

  it('has proper loading state styling', () => {
    vi.mocked(AuthContext.useAuth).mockReturnValue({
      user: null,
      loading: true,
      login: vi.fn().mockResolvedValue({ success: true }),
      register: vi.fn().mockResolvedValue({ success: true }),
      logout: vi.fn()
    })

    const { container } = render(
      <BrowserRouter>
        <ProtectedRoute>
          <TestChild />
        </ProtectedRoute>
      </BrowserRouter>
    )

    // Just verify loading text is displayed with proper styling
    const loadingText = screen.getByText(/loading/i)
    expect(loadingText).toBeInTheDocument()
    
    const loadingContainer = container.querySelector('.min-h-screen')
    expect(loadingContainer).toBeTruthy()
    expect(loadingContainer?.classList.contains('flex')).toBe(true)
    expect(loadingContainer?.classList.contains('items-center')).toBe(true)
    expect(loadingContainer?.classList.contains('justify-center')).toBe(true)
  })
})
