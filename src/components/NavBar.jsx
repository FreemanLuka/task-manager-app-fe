import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Button from './Button'
import '../styles/NavBar.css'

export default function NavBar({ brand = 'Task Manager', links = [] }) {
  const location = useLocation()
  const { isAuthenticated, user, logout } = useAuth()

  // Show a Landing "Home" link for public users (path '/'),
  // and a protected Home link '/home' for authenticated users.
  const defaultLinks = isAuthenticated
    ? [
        { label: 'Home', path: '/home' },
        { label: 'Tasks', path: '/tasks' },
      ]
    : [
        { label: 'Home', path: '/' },
        { label: 'Login', path: '/login' },
        { label: 'Register', path: '/register' },
      ]

  const navLinks = links.length > 0 ? links : defaultLinks

  const isActive = (path) => location.pathname === path

  const handleLogout = () => logout()

  // Compute a friendly display name for the logged-in user.
  const displayName = user
    ? ((user.firstName || user.lastName) ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : user.username || user.email || 'User')
    : ''

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          {brand}
        </Link>

        <ul className="navbar-menu">
          {navLinks.map((link) => (
            <li key={link.path}>
              <Link
                to={link.path}
                className={`navbar-link ${isActive(link.path) ? 'active' : ''}`}
              >
                {link.label}
              </Link>
            </li>
          ))}
          {isAuthenticated && (
            <>
              <li className="navbar-user">
                <span className="user-name">👤 {displayName}</span>
              </li>
              <li>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="logout-btn"
                >
                  Logout
                </Button>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  )
}

