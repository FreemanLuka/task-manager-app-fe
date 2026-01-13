import axiosInstance from './axiosInstance'

// Register user
export async function register(firstName, lastName, email, password, username = '') {
  // Prefer provided username, otherwise derive from firstName+lastName
  let finalUsername = (username || '').trim()
  const f = (firstName || '').trim()
  const l = (lastName || '').trim()

  if (!finalUsername) {
    const full = `${f} ${l}`.trim()
    finalUsername = full.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_-]/g, '')
  }

  return axiosInstance.post('/api/auth/signup', {
    username: finalUsername,
    email,
    password,
    firstName: f,
    lastName: l,
  })
}

// Check username availability
export async function checkUsername(username) {
  return axiosInstance.get('/api/auth/check-username', { params: { username } })
}

// Login user
export async function login(email, password) {
  // The server returns an object like: { status, message, data: { userId,... }, token }
  const response = await axiosInstance.post('/api/auth/login', {
    email,
    password,
  })

  // Persist token and the `data` payload (which contains userId, username, etc.)
  // Note: older code expected `response.user` but backend uses `response.data`.
  if (response?.token) {
    localStorage.setItem('authToken', response.token)
    if (response.data) {
      localStorage.setItem('user', JSON.stringify(response.data))
    }
  }

  return response
}

// Logout user
export function logout() {
  localStorage.removeItem('authToken')
  localStorage.removeItem('user')
}

// Get current user
export function getCurrentUser() {
  const user = localStorage.getItem('user')
  return user ? JSON.parse(user) : null
}

// Check if user is authenticated
export function isAuthenticated() {
  return !!localStorage.getItem('authToken')
}

// Get stored token
export function getAuthToken() {
  return localStorage.getItem('authToken')
}
