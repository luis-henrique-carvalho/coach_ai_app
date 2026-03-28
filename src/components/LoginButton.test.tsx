import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import LoginButton from './LoginButton'

describe('LoginButton', () => {
  const mockApiUrl = 'http://localhost:3000'

  beforeEach(() => {
    import.meta.env.VITE_API_URL = mockApiUrl
    // Mock window.location.href
    delete (window as any).location
    window.location = { href: '' } as any
  })

  it('renders provider name for Google', () => {
    render(<LoginButton provider="google" />)
    expect(screen.getByText(/Continue with Google/i)).toBeInTheDocument()
  })

  it('renders provider name for GitHub', () => {
    render(<LoginButton provider="github" />)
    expect(screen.getByText(/Continue with GitHub/i)).toBeInTheDocument()
  })

  it('renders custom label when provided', () => {
    render(<LoginButton provider="google" label="Sign in with Google" />)
    expect(screen.getByText('Sign in with Google')).toBeInTheDocument()
  })

  it('navigates to Google OAuth URL when clicked', async () => {
    const user = userEvent.setup()
    render(<LoginButton provider="google" />)
    
    const button = screen.getByRole('button')
    await user.click(button)
    
    expect(window.location.href).toBe(`${mockApiUrl}/api/auth/google`)
  })

  it('navigates to GitHub OAuth URL when clicked', async () => {
    const user = userEvent.setup()
    render(<LoginButton provider="github" />)
    
    const button = screen.getByRole('button')
    await user.click(button)
    
    expect(window.location.href).toBe(`${mockApiUrl}/api/auth/github`)
  })

  it('renders as a button element', () => {
    render(<LoginButton provider="google" />)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('has correct styling classes', () => {
    render(<LoginButton provider="google" />)
    const button = screen.getByRole('button')
    expect(button).toHaveClass('w-full')
  })
})
