import { useState, useEffect, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { checkUsername } from '../api/authApi'
import Button from '../components/Button'
import FormInput from '../components/FormInput'
import '../styles/Auth.css'

export default function Register() {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [username, setUsername] = useState('')
  const [usernameFocused, setUsernameFocused] = useState(false)
  const [usernameError, setUsernameError] = useState('')
  const [usernameStatus, setUsernameStatus] = useState('idle') // idle, checking, available, taken, invalid
  const usernameCheckRef = useRef({ ongoing: false })
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { register } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    // If user provided a username, validate it; otherwise derive from firstName+lastName
    const provided = (username || '').trim()
    const f = (firstName || '').trim()
    const l = (lastName || '').trim()
    let finalUsername = provided

    if (!provided) {
      finalUsername = `${f} ${l}`.trim().toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_-]/g, '')
    }

    if (!finalUsername || finalUsername.length < 3 || finalUsername.length > 30) {
      setError('Username must be between 3 and 30 characters and use letters, numbers, underscores, or hyphens')
      return
    }

    // username allowed pattern
    if (!/^[a-zA-Z0-9_-]+$/.test(finalUsername)) {
      setError('Username can only contain letters, numbers, underscores, and hyphens')
      return
    }

    // password complexity: at least 6 chars, 1 uppercase, 1 lowercase, 1 number
    const pwdRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/
    if (!pwdRegex.test(password)) {
      setError('Password must be at least 6 characters and include uppercase, lowercase, and a number')
      return
    }

    setLoading(true)

    try {
      await register(firstName, lastName, email, password, finalUsername)
      navigate('/login')
    } catch (err) {
      setError(err.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h1>Sign Up</h1>
        <p className="auth-subtitle">Create an account to manage your tasks</p>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-row">
            <FormInput
              label="First Name"
              type="text"
              id="firstName"
              value={firstName}
              onChange={(e) => {
                setFirstName(e.target.value)
                if (!usernameFocused) {
                  const draft = `${e.target.value} ${lastName}`.trim().toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_-]/g, '')
                  setUsername(draft)
                }
              }}
              placeholder="Your First Name"
              required
            />

            <FormInput
              label="Last Name"
              type="text"
              id="lastName"
              value={lastName}
              onChange={(e) => {
                setLastName(e.target.value)
                if (!usernameFocused) {
                  const draft = `${firstName} ${e.target.value}`.trim().toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_-]/g, '')
                  setUsername(draft)
                }
              }}
              placeholder="Your Last Name"
              required
            />
          </div>

          <FormInput
            label="Username"
            type="text"
            id="username"
            value={username}
            onChange={(e) => { setUsername(e.target.value); setUsernameStatus('idle'); setUsernameError('') }}
            onFocus={() => setUsernameFocused(true)}
            onBlur={async () => {
              setUsernameFocused(false)
              // run availability check on blur only
              const u = (username || '').trim()
              if (!u) return
              if (u.length < 3 || u.length > 30) {
                setUsernameStatus('invalid')
                setUsernameError('Username must be 3–30 characters')
                return
              }
              if (!/^[a-zA-Z0-9_-]+$/.test(u)) {
                setUsernameStatus('invalid')
                setUsernameError('Only letters, numbers, underscores, and hyphens allowed')
                return
              }

              setUsernameStatus('checking')
              try {
                usernameCheckRef.current.ongoing = true
                const res = await checkUsername(u)
                usernameCheckRef.current.ongoing = false
                if (res && res.available) {
                  setUsernameStatus('available')
                  setUsernameError('')
                } else {
                  setUsernameStatus('taken')
                  setUsernameError('Username is already taken')
                }
              } catch (err) {
                usernameCheckRef.current.ongoing = false
                setUsernameStatus('invalid')
                setUsernameError(err.message || 'Error checking username')
              }
            }}
            placeholder="Choose a username"
            helpText={usernameStatus === 'available' ? '✅ Username available' : (usernameStatus === 'checking' ? '⏳ Checking availability...' : '3–30 chars: letters, numbers, underscores, hyphens')}
            error={usernameError}
            required
          />

          {/* Inline visual indicator */}
          {usernameStatus === 'available' && (
            <div className="username-indicator username-available">✅ Available</div>
          )}
          {usernameStatus === 'taken' && (
            <div className="username-indicator username-taken">❌ Taken</div>
          )}
          {usernameStatus === 'checking' && (
            <div className="username-indicator username-checking">⏳ Checking...</div>
          )}

          <FormInput
            label="Email"
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your Email Address"
            required
          />

          <div>
            <small className="password-requirements">
              <strong>Password requirements:</strong>
              Password must be at least 6 characters and include at least one uppercase letter, one lowercase letter, and one number.
            </small>
          </div>

          <FormInput
            label="Password"
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Your Password"
            required
          />

          <FormInput
            label="Confirm Password"
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm Your Password"
            required
          />

          <Button
            type="submit"
            variant="primary"
            fullWidth
            disabled={loading}
            loading={loading}
          >
            {loading ? 'Creating account...' : 'Sign Up'}
          </Button>
        </form>

        <p className="auth-link">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  )
}
