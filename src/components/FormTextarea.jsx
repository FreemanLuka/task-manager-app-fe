import '../styles/FormTextarea.css'

// Reusable textarea component. Works like a normal HTML textarea but wrapped
// with a label and optional helper/error text. Keeps form components consistent.
export default function FormTextarea({
  label,
  id,
  value,
  onChange,
  placeholder,
  required = false,
  error,
  helpText,
  disabled = false,
  rows = 4,
  ...props
}) {
  return (
    <div className="form-textarea-group">
      {label && (
        <label htmlFor={id} className="form-textarea-label">
          {label}
          {required && <span className="form-textarea-required">*</span>}
        </label>
      )}

      {/* Controlled textarea: value and onChange come from parent to manage state. */}
      <textarea
        id={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        rows={rows}
        className={`form-textarea ${error ? 'form-textarea-error' : ''}`}
        {...props}
      />

      {error && <span className="form-textarea-error-text">{error}</span>}
      {helpText && !error && <span className="form-textarea-help">{helpText}</span>}
    </div>
  )
}
