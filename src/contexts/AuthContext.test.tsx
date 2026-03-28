import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, waitFor } from '@testing-library/react'
import { renderHook } from '@testing-library/react'
import { AuthProvider, useAuth } from './AuthContext'
import * as authService from '../services/authService'

// Mock the authService module
vi.mock('../services/authService')

describe('AuthContext', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('AuthProvider', () => {
    it('fetches current user on mount', async () => {
      const mockUser = {
        id: '123',
        email: 'test@example.com',
        name: 'Test User',
        providers: ['google']
      }

      vi.mocked(authService.getCurrentUser).mockResolvedValue(mockUser)

      render(
        <AuthProvider>
          <div>Test Child</div>
        </AuthProvider>
      )

      await waitFor(() => {
        expect(authService.getCurrentUser).toHaveBeenCalledTimes(1)
      })
    })

    it('sets loading to true during initial fetch', async () => {
      vi.mocked(authService.getCurrentUser).mockImplementation(() => 
        new Promise(resolve => setTimeout(() => resolve(null), 100))
      )

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider
      })

      expect(result.current.loading).toBe(true)
    })

    it('sets loading to false after fetch completes', async () => {
      vi.mocked(authService.getCurrentUser).mockResolvedValue(null)

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider
      })

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })
    })
  })

  describe('useAuth hook', () => {
    it('provides user and loading state', async () => {
      const mockUser = {
        id: '123',
        email: 'test@example.com',
        name: 'Test User',
        providers: ['google']
      }

      vi.mocked(authService.getCurrentUser).mockResolvedValue(mockUser)

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider
      })

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      expect(result.current.user).toEqual(mockUser)
    })

    it('throws error if used outside AuthProvider', () => {
      // Suppress console.error for this test
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      expect(() => {
        renderHook(() => useAuth())
      }).toThrow('useAuth must be used within AuthProvider')

      consoleSpy.mockRestore()
    })
  })

  describe('logout function', () => {
    it('clears user and calls authService.logout', async () => {
      const mockUser = {
        id: '123',
        email: 'test@example.com',
        name: 'Test User',
        providers: ['google']
      }

      vi.mocked(authService.getCurrentUser).mockResolvedValue(mockUser)
      vi.mocked(authService.logout).mockResolvedValue(undefined)

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider
      })

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      expect(result.current.user).toEqual(mockUser)

      await result.current.logout()

      await waitFor(() => {
        expect(authService.logout).toHaveBeenCalledTimes(1)
        expect(result.current.user).toBeNull()
      })
    })
  })
})
