import '../styles/FormSelect.css'

export default function FormSelect({
  label,
  id,
  value,
  onChange,
  options = [],
  required = false,
  error,
  helpText,
  disabled = false,
  ...props
}) {
  return (
    <div className="form-select-group">
      {label && (
        <label htmlFor={id} className="form-select-label">
          {label}
          {required && <span className="form-select-required">*</span>}
        </label>
      )}

      <select
        id={id}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        className={`form-select ${error ? 'form-select-error' : ''}`}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {error && <span className="form-select-error-text">{error}</span>}
      {helpText && !error && <span className="form-select-help">{helpText}</span>}
    </div>
  )
}
