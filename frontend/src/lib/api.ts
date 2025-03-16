import type { User, UserRegistration, UserCredentials } from './types'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

// Helper function to get stored token
const getToken = () => {
  if (typeof window === 'undefined') return null
  const session = localStorage.getItem('bookapp_session')
  return session ? JSON.parse(session).token : null
}

export const api = {
  async register(data: UserRegistration) {
    try {
      const response = await fetch(`${API_URL}/auth/signup`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
          re_password: data.confirmPassword,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Registration failed')
      }

      return { success: true }
    } catch (error) {
      console.error('Registration error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'An error occurred during registration'
      }
    }
  },

  async login(credentials: UserCredentials) {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Login failed')
      }

      return {
        success: true,
        data: {
          user: result.user,
          token: result.token
        }
      }
    } catch (error) {
      console.error('Login error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'An error occurred during login'
      }
    }
  },

  async updateUser(data: Partial<User>) {
    try {
      const token = getToken()
      if (!token) {
        throw new Error('Not authenticated')
      }

      const response = await fetch(`${API_URL}/auth/me`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Failed to update profile')
      }

      return {
        success: true,
        data: result.user
      }
    } catch (error) {
      console.error('Update user error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'An error occurred while updating profile'
      }
    }
  },

  async verifyEmail(code: string) {
    try {
      const response = await fetch(`${API_URL}/auth/verify-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Verification failed')
      }

      return { success: true }
    } catch (error) {
      console.error('Verification error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'An error occurred during verification'
      }
    }
  }
} 