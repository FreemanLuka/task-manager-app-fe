import '../styles/Button.css'

// Small button component with loading and disabled states.
// It keeps styling in CSS so markup stays clean for beginners.
export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  onClick,
  type = 'button',
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`btn btn-${variant} btn-${size} ${fullWidth ? 'btn-full-width' : ''}`}
      onClick={onClick}
      {...props}
    >
      {/* Show a simple loader icon when `loading` is true. */}
      {loading ? <span className="btn-loader">⏳</span> : children}
    </button>
  )
}
