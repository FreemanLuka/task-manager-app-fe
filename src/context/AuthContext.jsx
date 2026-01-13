import { createContext, useContext, useState, useEffect } from 'react'
import { login as apiLogin, register as apiRegister, logout as apiLogout, getCurrentUser, isAuthenticated as checkAuth } from '../api/authApi'

// AuthContext provides minimal authentication helpers and the current user object.
// Keep this file simple so beginners understand the flow: login -> store token -> read user.
const AuthContext = createContext()

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // On mount, initialize user state from localStorage via helper functions in `authApi`.
  useEffect(() => {
    const current = getCurrentUser()
    const authenticated = checkAuth()
    setUser(current)
    setIsAuthenticated(authenticated)
    setLoading(false)
  }, [])

  // Login: call API, persist token + user (handled in authApi), and update context state.
  const login = async (email, password) => {
    try {
      const response = await apiLogin(email, password)
      // Server returns { status, message, data, token } where data contains user fields.
      const userData = response?.data || getCurrentUser()
      setUser(userData)
      setIsAuthenticated(true)
      return { success: true, user: userData }
    } catch (error) {
      setUser(null)
      setIsAuthenticated(false)
      throw error
    }
  }

  // Register: delegates to API. Optionally could auto-login, but we keep it explicit.
  const register = async (firstName, lastName, email, password, username) => {
    try {
      await apiRegister(firstName, lastName, email, password, username)
      return { success: true }
    } catch (error) {
      throw error
    }
  }

  // Logout: clear persisted auth and context state.
  const logout = () => {
    apiLogout()
    setUser(null)
    setIsAuthenticated(false)
  }

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
