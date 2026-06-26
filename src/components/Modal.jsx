import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import '../css/modal.css'
import { HiXMark } from 'react-icons/hi2'

const Modal = ({ data, onClose }) => {
  const Icon = data.icon

  useEffect(() => {
    const onKey = e => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" style={{ '--modal-accent': data.accent }} onClick={e => e.stopPropagation()}>

        <div className="modal-header">
          <div className="modal-header-content">
            <div className="modal-icon-row">
              {Icon && <Icon className="modal-icon" />}
              <span className="modal-eyebrow">{data.eyebrow}</span>
            </div>
            <h2 className="modal-title">{data.title}</h2>
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Chiudi">
            <HiXMark />
          </button>
        </div>

        <div className="modal-body">
          {data.content.map((p, i) => (
            <p key={i} className="modal-text">{p}</p>
          ))}
        </div>

        <div className="modal-footer">
          {data.tags.map(t => (
            <span key={t} className="modal-tag">{t}</span>
          ))}
        </div>

      </div>
    </div>,
    document.body
  )
}

export default Modal
