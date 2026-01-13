import '../styles/FormInput.css'

// Small, reusable input component with a label and helper/error text.
// Props are intentionally simple so beginners can understand and reuse it.
export default function FormInput({
  label,
  type = 'text',
  id,
  value,
  onChange,
  placeholder,
  required = false,
  error,
  helpText,
  disabled = false,
  ...props
}) {
  return (
    <div className="form-input-group">
      {label && (
        <label htmlFor={id} className="form-input-label">
          {label}
          {required && <span className="form-input-required">*</span>}
        </label>
      )}

      {/* Controlled input: parent components pass `value` and `onChange` to manage state. */}
      <input
        type={type}
        id={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className={`form-input ${error ? 'form-input-error' : ''}`}
        {...props}
      />

      {/* Show error text if present, otherwise an optional help text. */}
      {error && <span className="form-input-error-text">{error}</span>}
      {helpText && !error && <span className="form-input-help">{helpText}</span>}
    </div>
  )
}
