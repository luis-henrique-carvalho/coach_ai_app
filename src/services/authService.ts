export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  providers: string[]
}

/**
 * Fetch the current authenticated user from the backend.
 * Uses httpOnly cookies for authentication.
 * @returns User object if authenticated, null otherwise
 */
export async function getCurrentUser(): Promise<User | null> {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/me`, {
      credentials: 'include', // CRITICAL: Send httpOnly cookies
      headers: { 'Content-Type': 'application/json' }
    })

    if (!response.ok) {
      return null
    }

    return await response.json()
  } catch (error) {
    console.error('Failed to fetch current user:', error)
    return null
  }
}

/**
 * Log out the current user.
 * Calls the backend to clear httpOnly cookies.
 */
export async function logout(): Promise<void> {
  try {
    await fetch(`${import.meta.env.VITE_API_URL}/api/auth/logout`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error('Failed to logout:', error)
  }
}

/**
 * Refresh the authentication token.
 * Calls the backend to refresh httpOnly cookies.
 * @returns true if refresh successful, false otherwise
 */
export async function refreshToken(): Promise<boolean> {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' }
    })

    return response.ok
  } catch (error) {
    console.error('Failed to refresh token:', error)
    return false
  }
}
