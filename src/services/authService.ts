export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  providers: string[]
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials {
  email: string
  password: string
  name: string
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

export async function login(credentials: LoginCredentials): Promise<{ success: boolean; user?: User; error?: string }> {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    })

    const data = await response.json()

    if (!response.ok) {
      return { success: false, error: data.message || 'Login failed' }
    }

    if (data.success) {
      const user = await getCurrentUser()
      return { success: true, user: user || undefined }
    }

    return { success: false, error: 'Login failed' }
  } catch (error) {
    console.error('Failed to login:', error)
    return { success: false, error: 'Network error' }
  }
}

export async function register(credentials: RegisterCredentials): Promise<{ success: boolean; user?: User; error?: string }> {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    })

    const data = await response.json()

    if (!response.ok) {
      return { success: false, error: data.message || 'Registration failed' }
    }

    if (data.success) {
      const user = await getCurrentUser()
      return { success: true, user: user || undefined }
    }

    return { success: false, error: 'Registration failed' }
  } catch (error) {
    console.error('Failed to register:', error)
    return { success: false, error: 'Network error' }
  }
}
