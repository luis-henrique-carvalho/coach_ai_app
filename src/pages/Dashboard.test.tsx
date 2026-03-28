import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Dashboard from './Dashboard'
import * as AuthContext from '../contexts/AuthContext'

// Mock the useAuth hook
vi.mock('../contexts/AuthContext', () => ({
  useAuth: vi.fn()
}))

describe('Dashboard', () => {
  const renderWithRouter = (component: React.ReactElement) => {
    return render(<BrowserRouter>{component}</BrowserRouter>)
  }

  it('shows UserProfile when authenticated', () => {
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

    renderWithRouter(<Dashboard />)

    expect(screen.getByText('Test User')).toBeInTheDocument()
    expect(screen.getByText('test@example.com')).toBeInTheDocument()
  })

  it('renders Dashboard heading', () => {
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

    renderWithRouter(<Dashboard />)

    expect(screen.getByRole('heading', { name: /dashboard/i })).toBeInTheDocument()
  })

  it('displays placeholder message for future content', () => {
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

    renderWithRouter(<Dashboard />)

    expect(screen.getByText(/Your habit tracking and coaching dashboard will appear here/i)).toBeInTheDocument()
  })

  it('has proper layout styling', () => {
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

    const { container } = renderWithRouter(<Dashboard />)

    const mainDiv = container.querySelector('.min-h-screen')
    expect(mainDiv).toBeInTheDocument()
    expect(mainDiv).toHaveClass('bg-background', 'p-8')
  })
})
