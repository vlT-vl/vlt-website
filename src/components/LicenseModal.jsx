import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import '../css/licensemodal.css'
import { HiXMark } from 'react-icons/hi2'
import { FaScaleBalanced } from 'react-icons/fa6'

const LicenseModal = ({ repo, onClose }) => {
  const [text, setText]       = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    const onKey = e => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'

    if (repo.licenseText) {
      setText(repo.licenseText)
    } else {
      setNotFound(true)
    }
    setLoading(false)

    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose, repo.name])

  const licName = repo.license?.name ?? 'Licenza'
  const spdxId  = repo.license?.spdx_id

  return createPortal(
    <div className="lmo-overlay" onClick={onClose}>
      <div className="lmo-card" onClick={e => e.stopPropagation()}>

        <div className="lmo-header">
          <div className="lmo-header-left">
            <FaScaleBalanced className="lmo-header-icon" />
            <div>
              <span className="lmo-eyebrow">Licenza</span>
              <h2 className="lmo-title">{licName}</h2>
              {spdxId && spdxId !== licName && (
                <span className="lmo-spdx">{spdxId}</span>
              )}
            </div>
          </div>
          <button className="lmo-close" onClick={onClose} aria-label="Chiudi">
            <HiXMark />
          </button>
        </div>

        <div className="lmo-body">
          {loading && (
            <div className="lmo-spinner-wrap"><div className="lmo-spinner" /></div>
          )}
          {!loading && notFound && (
            <p className="lmo-empty">
              Nessun file di licenza trovato nel repository.
            </p>
          )}
          {!loading && text && <pre className="lmo-text">{text}</pre>}
        </div>

      </div>
    </div>,
    document.body
  )
}

export default LicenseModal
