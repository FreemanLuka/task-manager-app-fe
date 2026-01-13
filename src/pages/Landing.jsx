import { Link, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import '../styles/Home.css'

// Simple public landing page shown when the user is not authenticated.
// If the user is already authenticated, redirect them to `/home`.
export default function Landing() {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/home')
    }
  }, [isAuthenticated, navigate])

  return (
    <div className="home-page">
      <div className="home-hero">
        <div className="home-hero-content">
          <h1>Welcome to Task Manager</h1>
          <p>Sign up or log in to manage your tasks and stay organized.</p>
          <div style={{ display: 'flex', gap: '12px', marginTop: '18px' }}>
            <Link to="/login" className="home-cta-button">
              Log in
            </Link>
            <Link to="/register" className="home-cta-button" style={{ background: '#fff', color: '#333' }}>
              Register
            </Link>
          </div>
        </div>
      </div>

      <div style={{ padding: '32px', textAlign: 'center' }}>
        <h2>What is Task Manager?</h2>
        <p style={{ maxWidth: 720, margin: '12px auto' }}>
          A simple app to create, update and track tasks. Your personal dashboard
          appears after you log in.
        </p>
      </div>
    </div>
  )
}
