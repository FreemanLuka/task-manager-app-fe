import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getTasks, getTasksByUser } from '../api/tasksApi'
import { useAuth } from '../context/AuthContext'
import '../styles/Home.css'

// Protected Home page (shown only when authenticated). Uses `useAuth` so the
// UI updates when login/logout happens. Shows the user's full name when available.
export default function Home() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    loadTasks()
  }, [])

  const loadTasks = async () => {
    try {
      let data
      // Prefer fetching tasks for the logged-in user to reflect correct status/state
      if (user && (user.userId || user.user_id || user._id)) {
        const uid = user.userId || user.user_id || user._id
        data = await getTasksByUser(uid)
      } else {
        // Fallback: fetch all tasks
        data = await getTasks()
      }

      // Ensure tasks is an array — store full list and handle slicing only for recent view
      setTasks(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error('Error loading tasks:', err)
      setTasks([])
    } finally {
      setLoading(false)
    }
  }

  const stats = {
    total: tasks.length,
    pending: tasks.filter(t => t.status === 'pending').length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length,
    completed: tasks.filter(t => t.status === 'completed').length,
  }

  const recentTasks = tasks.slice(0, 3)

  const displayName = user ? ((user.firstName || user.lastName) ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : user.username || user.email) : ''

  return (
    <div className="home-page">
      {/* Hero Section */}
      <div className="home-hero">
        <div className="home-hero-content">
          <h1>Welcome{displayName ? `, ${displayName}` : ''}! 👋</h1>
          <p>Manage your tasks efficiently and stay organized</p>
          <Link to="/tasks" className="home-cta-button">
            Go to Tasks →
          </Link>
        </div>
      </div>

      {/* Stats Section */}
      {!loading && (
        <div className="home-stats">
          <div className="stat-card">
            <div className="stat-number">{stats.total}</div>
            <div className="stat-label">Total Tasks</div>
          </div>
          <div className="stat-card">
            <div className="stat-number" style={{ color: '#f59e0b' }}>
              {stats.pending}
            </div>
            <div className="stat-label">Pending</div>
          </div>
          <div className="stat-card">
            <div className="stat-number" style={{ color: '#3b82f6' }}>
              {stats.inProgress}
            </div>
            <div className="stat-label">In Progress</div>
          </div>
          <div className="stat-card">
            <div className="stat-number" style={{ color: '#10b981' }}>
              {stats.completed}
            </div>
            <div className="stat-label">Completed</div>
          </div>
        </div>
      )}

      {/* Recent Tasks */}
      {!loading && recentTasks.length > 0 && (
        <div className="home-recent">
          <h2>Recent Tasks</h2>
          <div className="recent-tasks-list">
            {recentTasks.map(task => (
              <div key={task._id} className="recent-task-item">
                <div className="recent-task-header">
                  <h3>{task.title}</h3>
                  <span className={`recent-task-status ${task.status}`}>
                    {task.status.replace('-', ' ')}
                  </span>
                </div>
                {task.description && (
                  <p className="recent-task-description">{task.description}</p>
                )}
                {task.dueDate && (
                  <small className="recent-task-date">
                    Due: {new Date(task.dueDate).toLocaleDateString()}
                  </small>
                )}
              </div>
            ))}
          </div>
          <Link to="/tasks" className="home-view-all">
            View All Tasks →
          </Link>
        </div>
      )}

      {/* Quick Links */}
      <div className="home-quick-links">
        <h2>Quick Actions</h2>
        <div className="quick-links-grid">
          <Link to="/tasks" className="quick-link-card">
            <div className="quick-link-icon">📋</div>
            <div className="quick-link-text">View All Tasks</div>
          </Link>
          <Link to="/tasks" className="quick-link-card">
            <div className="quick-link-icon">✚</div>
            <div className="quick-link-text">Create New Task</div>
          </Link>
          <Link to="/" className="quick-link-card">
            <div className="quick-link-icon">⚙️</div>
            <div className="quick-link-text">Settings</div>
          </Link>
        </div>
      </div>
    </div>
  )
}
