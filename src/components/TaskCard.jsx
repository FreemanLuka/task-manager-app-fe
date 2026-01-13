import '../styles/TaskCard.css'

export default function TaskCard({
  id,
  title,
  description,
  dueDate,
  status = 'pending',
  onEdit,
  onDelete,
}) {
  const formatDate = (date) => {
    if (!date) return 'No due date'
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <div className="task-card">
      <div className="task-card-header">
        <h3 className="task-card-title">{title}</h3>
        <span className={`task-card-status task-status-${status}`}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      </div>

      {description && <p className="task-card-description">{description}</p>}

      <div className="task-card-footer">
        <span className="task-card-date">📅 {formatDate(dueDate)}</span>
        <div className="task-card-actions">
          {onEdit && (
            <button
              className="task-card-btn task-card-btn-edit"
              onClick={() => onEdit(id)}
              title="Edit task"
            >
              ✏️ Edit
            </button>
          )}
          {onDelete && (
            <button
              className="task-card-btn task-card-btn-delete"
              onClick={() => onDelete(id)}
              title="Delete task"
            >
              🗑️ Delete
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
