import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import '../css/contactmodal.css'
import { HiXMark } from 'react-icons/hi2'
import { FaRegEnvelope, FaLinkedinIn } from 'react-icons/fa'
import { TbMapPin } from 'react-icons/tb'
import { useText } from '../lib/uiText.js'

const LINKEDIN_URL = 'https://it.linkedin.com/in/lorenzo-veronesi-8988ab18a'

const ContactModal = ({ email, onClose: onDone }) => {
  const { t, lang } = useText()
  const [name, setName] = useState('')
  const [edited, setEdited] = useState(null)
  const [copied, setCopied] = useState(false)
  const [leaving, setLeaving] = useState(false)
  const nameRef = useRef(null)
  const closeRef = useRef(null)

  const onClose = () => {
    if (closeRef.current) return
    setLeaving(true)
    closeRef.current = setTimeout(onDone, 280)
  }
  const closeNow = useRef(onClose)
  closeNow.current = onClose

  const who = name.trim() || t('contact.nameFallback')
  const subject = t('contact.subjectTpl', { name: who })
  const generated = t('contact.bodyTpl', { name: who })
  const body = edited ?? generated

  useEffect(() => {
    const onKey = e => { if (e.key === 'Escape') closeNow.current() }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    nameRef.current?.focus()
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [])

  useEffect(() => () => clearTimeout(closeRef.current), [])

  const href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body.replace(/\n/g, '\r\n'))}`

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(`${subject}\n\n${body}`)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch { /* clipboard unavailable */ }
  }

  return createPortal(
    <div className={`cmo-overlay${leaving ? ' is-leaving' : ''}`} onClick={onClose}>
      <div className="cmo-card" onClick={e => e.stopPropagation()} role="dialog" aria-modal="true" aria-label={t('contact.title')} lang={lang}>
        <div className="cmo-header">
          <span className="cmo-header-icon" aria-hidden="true"><FaRegEnvelope /></span>
          <div className="cmo-header-text">
            <span className="cmo-eyebrow">{t('contact.eyebrow')}</span>
            <h2 className="cmo-title">{t('contact.title')}</h2>
          </div>
          <button type="button" className="cmo-close" onClick={onClose} aria-label={t('common.close')}>
            <HiXMark />
          </button>
        </div>

        <div className="cmo-body">
          <p className="cmo-intro" style={{ '--k': 0 }}>{t('contact.intro')}</p>

          <div className="cmo-info" style={{ '--k': 1 }}>
            <a className="cmo-info-row" href={`mailto:${email}`}>
              <FaRegEnvelope aria-hidden="true" /><span>{email}</span>
            </a>
            <a className="cmo-info-row" href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer">
              <FaLinkedinIn aria-hidden="true" /><span>LinkedIn</span>
            </a>
            <span className="cmo-info-row">
              <TbMapPin aria-hidden="true" /><span>{t('aboutme.location')}</span>
            </span>
          </div>

          <div className="cmo-row" style={{ '--k': 2 }}>
            <label className="cmo-field">
              <span className="cmo-label">{t('contact.name')}</span>
              <input
                ref={nameRef}
                className="cmo-input"
                type="text"
                value={name}
                placeholder={t('contact.namePh')}
                autoComplete="name"
                onChange={e => setName(e.target.value)}
              />
            </label>

            <div className="cmo-field">
              <span className="cmo-label">{t('contact.subject')}</span>
              <div className="cmo-static">{subject}</div>
            </div>
          </div>

          <label className="cmo-field" style={{ '--k': 3 }}>
            <span className="cmo-label">
              {t('contact.body')}
              {edited !== null && (
                <button type="button" className="cmo-reset" onClick={() => setEdited(null)}>{t('contact.reset')}</button>
              )}
            </span>
            <textarea
              className="cmo-input cmo-textarea"
              value={body}
              rows={8}
              onChange={e => setEdited(e.target.value)}
            />
          </label>

          <div className="cmo-actions" style={{ '--k': 4 }}>
            <a className="cmo-btn cmo-btn--primary" href={href}>
              <FaRegEnvelope aria-hidden="true" />
              <span>{t('contact.send')}</span>
            </a>
            <button type="button" className="cmo-btn" onClick={copy}>
              {copied ? t('contact.copied') : t('contact.copy')}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}

export default ContactModal
