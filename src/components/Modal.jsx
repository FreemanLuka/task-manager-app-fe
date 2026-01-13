import '../styles/Modal.css'

// Minimal modal component. It renders into the DOM only when `isOpen` is true.
// Clicking the overlay closes the modal; clicking inside stops propagation.
export default function Modal({ isOpen, onClose, children, title }) {
  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{title}</h2>
          {/* Simple close button - could be replaced with an icon */}
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>
        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>
  )
}
