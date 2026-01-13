import { useState, useEffect } from 'react'
import { createTask, updateTask } from '../api/tasksApi'
import { useAuth } from '../context/AuthContext'
import Button from './Button'
import FormInput from './FormInput'
import FormTextarea from './FormTextarea'
import FormSelect from './FormSelect'
import '../styles/TaskForm.css'

export default function TaskForm({ onTaskAdded, onTaskUpdated, editingTask, onCancel }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [status, setStatus] = useState('pending')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()

  useEffect(() => {
    if (editingTask) {
      // Normalize incoming task values for the form inputs.
      setTitle(editingTask.title || '')
      setDescription(editingTask.description || '')
      // `dueDate` from backend may be an ISO string with time. Convert to YYYY-MM-DD for date input.
      const editDue = editingTask.dueDate ? String(editingTask.dueDate).split('T')[0] : ''
      setDueDate(editDue)
      setStatus(editingTask.status || 'pending')
    } else {
      resetForm()
    }
  }, [editingTask])

  const statusOptions = [
    { label: 'Pending', value: 'pending' },
    { label: 'In Progress', value: 'in-progress' },
    { label: 'Completed', value: 'completed' },
  ]

  const resetForm = () => {
    setTitle('')
    setDescription('')
    setDueDate('')
    setStatus('pending')
    setError('')
  }

  const handleCancel = () => {
    resetForm()
    if (onCancel) onCancel()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!title.trim()) {
      setError('Task title is required')
      return
    }

    setLoading(true)

    try {
      // Build payload: only include optional fields when present to satisfy server validators.
      const taskData = { title: title.trim() }

      if (description && description.trim()) taskData.description = description.trim()
      if (status) taskData.status = status
      // Only include `dueDate` when the user selected a date (non-empty). Date input value is YYYY-MM-DD.
      if (dueDate) taskData.dueDate = dueDate
      // Ensure `createdBy` is provided (server requires a MongoDB ID)
      taskData.createdBy = user?.userId || user?._id || user?.id

      if (editingTask) {
        // Update existing task
        const updated = await updateTask(editingTask._id, taskData)
        if (onTaskUpdated) onTaskUpdated(updated)
      } else {
        // Create new task
        const task = await createTask(taskData)
        // `task` here is the created task object (unwrapped by tasksApi)
        if (onTaskAdded) onTaskAdded(task)
        resetForm()
      }
    } catch (err) {
      setError(err.message || `Failed to ${editingTask ? 'update' : 'create'} task`)
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="task-form-container">
      <form onSubmit={handleSubmit} className="task-form">
        <h2>{editingTask ? 'Edit Task' : 'Create New Task'}</h2>

        {error && <div className="error-message">{error}</div>}

        <FormInput
          label="Task Title"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter task title"
          required
        />

        <FormTextarea
          label="Description"
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter task description (optional)"
          rows="4"
        />

        <div className="form-row">
          <FormInput
            label="Due Date"
            type="date"
            id="dueDate"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />

          {/* Simple native select for clarity and fewer indirections for beginners */}
          <div className="form-select-group">
            <label htmlFor="status" className="form-select-label">Status</label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="form-select"
            >
              {statusOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-actions">
          <Button type="submit" variant="primary" disabled={loading} loading={loading}>
            {loading ? (editingTask ? 'Updating...' : 'Creating...') : (editingTask ? 'Update Task' : 'Create Task')}
          </Button>
          {editingTask && (
            <Button type="button" variant="secondary" onClick={handleCancel}>
              Cancel
            </Button>
          )}
        </div>
      </form>
    </div>
  )
}
