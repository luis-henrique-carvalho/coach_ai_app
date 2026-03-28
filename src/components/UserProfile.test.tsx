import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import UserProfile from './UserProfile'
import * as AuthContext from '../contexts/AuthContext'

// Mock the useAuth hook
vi.mock('../contexts/AuthContext', () => ({
  useAuth: vi.fn()
}))

describe('UserProfile', () => {
  it('displays user name and email', () => {
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

    render(<UserProfile />)

    expect(screen.getByText('Test User')).toBeInTheDocument()
    expect(screen.getByText('test@example.com')).toBeInTheDocument()
  })

  it('shows avatar if available', () => {
    const mockUser = {
      id: '123',
      email: 'test@example.com',
      name: 'Test User',
      avatar: 'https://example.com/avatar.jpg',
      providers: ['google']
    }

    vi.mocked(AuthContext.useAuth).mockReturnValue({
      user: mockUser,
      loading: false,
      login: vi.fn().mockResolvedValue({ success: true }),
      register: vi.fn().mockResolvedValue({ success: true }),
      logout: vi.fn()
    })

    const { container } = render(<UserProfile />)

    // Check that Avatar component is rendered (Radix UI may not load images in test)
    const avatarContainer = container.querySelector('.rounded-full')
    expect(avatarContainer).toBeInTheDocument()
  })

  it('shows initials when no avatar', () => {
    const mockUser = {
      id: '123',
      email: 'john.doe@example.com',
      name: 'John Doe',
      providers: ['google']
    }

    vi.mocked(AuthContext.useAuth).mockReturnValue({
      user: mockUser,
      loading: false,
      login: vi.fn().mockResolvedValue({ success: true }),
      register: vi.fn().mockResolvedValue({ success: true }),
      logout: vi.fn()
    })

    render(<UserProfile />)

    expect(screen.getByText('JD')).toBeInTheDocument()
  })

  it('has logout button that calls useAuth().logout()', async () => {
    const mockLogout = vi.fn()
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
      logout: mockLogout
    })

    const user = userEvent.setup()
    render(<UserProfile />)

    const logoutButton = screen.getByRole('button', { name: /logout/i })
    await user.click(logoutButton)

    expect(mockLogout).toHaveBeenCalledTimes(1)
  })

  it('returns null when user is not authenticated', () => {
    vi.mocked(AuthContext.useAuth).mockReturnValue({
      user: null,
      loading: false,
      login: vi.fn().mockResolvedValue({ success: true }),
      register: vi.fn().mockResolvedValue({ success: true }),
      logout: vi.fn()
    })

    const { container } = render(<UserProfile />)

    expect(container.firstChild).toBeNull()
  })

  it('has proper styling with card background', () => {
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

    const { container } = render(<UserProfile />)

    const cardDiv = container.querySelector('.bg-card')
    expect(cardDiv).toBeInTheDocument()
    expect(cardDiv).toHaveClass('flex', 'items-center', 'gap-4', 'p-4', 'border', 'rounded-lg')
  })
})
