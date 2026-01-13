import { useState, useEffect } from 'react'
import { getTasks, updateTask, deleteTask } from '../api/tasksApi'
import TaskForm from '../components/TaskForm'
import TaskCard from '../components/TaskCard'
import Modal from '../components/Modal'
import Button from '../components/Button'
import '../styles/Tasks.css'

// Tasks page: protected page that lists tasks and provides create/update/delete
// actions. This file demonstrates a simple pattern for loading data, showing
// a form, and handling optimistic updates.
export default function Tasks() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [filterStatus, setFilterStatus] = useState('all')
  const [sortBy, setSortBy] = useState('dueDate')

  // Load tasks once when the page mounts.
  useEffect(() => {
    loadTasks()
  }, [])

  // Fetch tasks from the API and store them in state.
  const loadTasks = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await getTasks()
      setTasks(Array.isArray(data) ? data : [])
    } catch (err) {
      setError('Failed to load tasks. Please try again.')
      console.error('Error loading tasks:', err)
      setTasks([])
    } finally {
      setLoading(false)
    }
  }

  // Called after a task is created to prepend it to the list.
  const handleTaskAdded = (newTask) => {
    setTasks([newTask, ...tasks])
    setShowForm(false)
  }

  // Replace the updated task in the local state.
  const handleTaskUpdated = (updatedTask) => {
    setTasks(tasks.map(t => (t._id === updatedTask._id ? updatedTask : t)))
    setEditingTask(null)
  }

  const handleEditTask = (task) => setEditingTask(task)
  const handleCloseEditModal = () => setEditingTask(null)

  // Update the status of a task.
  const handleStatusChange = async (taskId, newStatus) => {
    try {
      const task = tasks.find(t => t._id === taskId)
      const updated = await updateTask(taskId, { ...task, status: newStatus })
      setTasks(tasks.map(t => (t._id === taskId ? updated : t)))
    } catch (err) {
      alert('Failed to update task: ' + err.message)
      console.error('Error updating task:', err)
    }
  }

  // Delete a task after confirming with the user.
  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return

    try {
      await deleteTask(taskId)
      setTasks(tasks.filter(t => t._id !== taskId))
    } catch (err) {
      alert('Failed to delete task: ' + err.message)
      console.error('Error deleting task:', err)
    }
  }

  // Filtering + sorting logic kept local and simple for learners.
  const getFilteredAndSortedTasks = () => {
    let filtered = tasks

    if (filterStatus !== 'all') filtered = filtered.filter(t => t.status === filterStatus)

    filtered.sort((a, b) => {
      if (sortBy === 'dueDate') {
        const dateA = a.dueDate ? new Date(a.dueDate) : new Date('9999-12-31')
        const dateB = b.dueDate ? new Date(b.dueDate) : new Date('9999-12-31')
        return dateA - dateB
      } else if (sortBy === 'title') {
        return a.title.localeCompare(b.title)
      } else if (sortBy === 'status') {
        return a.status.localeCompare(b.status)
      }
      return 0
    })

    return filtered
  }

  const filteredTasks = getFilteredAndSortedTasks()
  const stats = {
    total: tasks.length,
    pending: tasks.filter(t => t.status === 'pending').length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length,
    completed: tasks.filter(t => t.status === 'completed').length,
  }

  return (
    <div className="tasks-page">
      {/* Header */}
      <div className="tasks-header">
        <div>
          <h1>My Tasks</h1>
          <p className="tasks-subtitle">
            {stats.total} total • {stats.pending} pending • {stats.inProgress} in progress • {stats.completed} completed
          </p>
        </div>
        <Button variant="primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? '✕ Cancel' : '✚ New Task'}
        </Button>
      </div>

      {/* Error Message */}
      {error && <div className="error-message">{error}</div>}

      {/* Task Form */}
      {showForm && <TaskForm onTaskAdded={handleTaskAdded} onCancel={() => setShowForm(false)} />}

      {/* Edit Modal - shows the same TaskForm but with initial values for editing. */}
      <Modal isOpen={!!editingTask} onClose={handleCloseEditModal} title="Edit Task">
        {editingTask && (
          <TaskForm editingTask={editingTask} onTaskUpdated={handleTaskUpdated} onCancel={handleCloseEditModal} />
        )}
      </Modal>

      {/* Filters and Sorting */}
      {!loading && tasks.length > 0 && (
        <div className="tasks-controls">
          <div className="controls-group">
            <label htmlFor="filter-status">Filter by Status:</label>
            <select id="filter-status" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="control-select">
              <option value="all">All Tasks</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div className="controls-group">
            <label htmlFor="sort-by">Sort by:</label>
            <select id="sort-by" value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="control-select">
              <option value="dueDate">Due Date</option>
              <option value="title">Title</option>
              <option value="status">Status</option>
            </select>
          </div>

          <Button variant="secondary" size="sm" onClick={loadTasks}>
            🔄 Refresh
          </Button>
        </div>
      )}

      {/* Task List */}
      {loading ? (
        <div className="loading-state">
          <p>⏳ Loading tasks...</p>
        </div>
      ) : filteredTasks.length === 0 ? (
        <div className="empty-state">
          {tasks.length === 0 ? (
            <>
              <p className="empty-icon">📋</p>
              <p>No tasks yet. Create one to get started!</p>
            </>
          ) : (
            <>
              <p className="empty-icon">🔍</p>
              <p>No tasks match your filters.</p>
            </>
          )}
        </div>
      ) : (
        <div className="task-list">
          {filteredTasks.map(task => (
            <div key={task._id} className="task-item">
              <TaskCard id={task._id} title={task.title} description={task.description} dueDate={task.dueDate} status={task.status} onEdit={() => handleEditTask(task)} onDelete={handleDeleteTask} />
              <div className="task-status-controls">
                <select value={task.status} onChange={(e) => handleStatusChange(task._id, e.target.value)} className="status-select">
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
