import axios from 'axios'

// Base URL for the API. During development set `VITE_API_URL` in `.env`.
// In production this falls back to the deployed backend on Render.
// Example (client/.env): VITE_API_URL=https://task-manager-app-jam5.onrender.com
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://task-manager-app-jam5.onrender.com'

// Create a single axios instance used across the app.
// This centralizes base URL, headers and auth token handling.
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Attach auth token (if present) to every outgoing request.
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor:
// - The backend responds with `{ status, message, data }`.
// - We return `response.data` so API helpers get the wrapper object directly.
// - We normalize error messages into an `Error` with a readable message.
axiosInstance.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // If the token is invalid/expired, clear stored auth and redirect to login.
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken')
      localStorage.removeItem('user')
      // Using location replace avoids leaving the invalid page in history.
      window.location.replace('/login')
    }

    // Pick the most helpful message available from the server or axios.
    let message = 'Network Error'
    if (error.response?.data?.message) message = error.response.data.message
    else if (error.response?.data?.error) message = error.response.data.error
    else if (error.message) message = error.message

    // Keep the full error in the console for debugging, but throw a simple Error to the UI.
    console.error('API Error:', error)
    return Promise.reject(new Error(message))
  }
)

export default axiosInstance
