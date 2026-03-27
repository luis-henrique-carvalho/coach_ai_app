import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { getCurrentUser, logout, refreshToken } from './authService'

describe('authService', () => {
  const originalFetch = global.fetch
  const mockApiUrl = 'http://localhost:3000'

  beforeEach(() => {
    // Mock import.meta.env using Vitest's env mocking
    import.meta.env.VITE_API_URL = mockApiUrl
  })

  afterEach(() => {
    global.fetch = originalFetch
  })

  describe('getCurrentUser', () => {
    it('calls /api/auth/me with credentials: include', async () => {
      const mockUser = {
        id: '123',
        email: 'test@example.com',
        name: 'Test User',
        avatar: 'https://example.com/avatar.jpg',
        providers: ['google']
      }

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockUser
      })

      const result = await getCurrentUser()

      expect(global.fetch).toHaveBeenCalledWith(
        `${mockApiUrl}/api/auth/me`,
        {
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' }
        }
      )
      expect(result).toEqual(mockUser)
    })

    it('returns null when response is not ok', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 401
      })

      const result = await getCurrentUser()

      expect(result).toBeNull()
    })
  })

  describe('logout', () => {
    it('calls /api/auth/logout with credentials: include', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true
      })

      await logout()

      expect(global.fetch).toHaveBeenCalledWith(
        `${mockApiUrl}/api/auth/logout`,
        {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' }
        }
      )
    })
  })

  describe('refreshToken', () => {
    it('calls /api/auth/refresh with credentials: include', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true
      })

      const result = await refreshToken()

      expect(global.fetch).toHaveBeenCalledWith(
        `${mockApiUrl}/api/auth/refresh`,
        {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' }
        }
      )
      expect(result).toBe(true)
    })

    it('returns false when refresh fails', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false
      })

      const result = await refreshToken()

      expect(result).toBe(false)
    })
  })

  describe('credentials inclusion', () => {
    it('all fetch calls include credentials: include for cookies', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({})
      })

      await getCurrentUser()
      await logout()
      await refreshToken()

      const fetchCalls = (global.fetch as any).mock.calls
      
      fetchCalls.forEach((call: any[]) => {
        expect(call[1].credentials).toBe('include')
      })
    })
  })
})
