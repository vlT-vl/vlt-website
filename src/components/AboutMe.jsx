import '../css/aboutme.css'
import { FaLinkedinIn, FaRegEnvelope } from 'react-icons/fa'
import { vendorIcon } from '../lib/vendorIcons.js'
import { useEffect, useRef, useState } from 'react'
import { useData } from '../context/DataContext.jsx'
import { useReveal } from '../lib/useReveal.js'
import { themed } from '../lib/themed.js'
import { useText } from '../lib/uiText.js'
import lorenzoPhoto from '../res/vltportrait.jpg'
import WorkCard from './WorkCard.jsx'
import AnimatedName from './AnimatedName.jsx'
import ContactModal from './ContactModal.jsx'

const COMPANY_NAME = import.meta.env.VITE_COMPANY_NAME ?? ''
const COMPANY_URL  = import.meta.env.VITE_COMPANY_URL  ?? null
const CONTACT_EMAIL = import.meta.env.VITE_CONTACT_EMAIL ?? null

const certsInProgress = [
  { issuer: 'CNCF', name: 'CKA — Certified Kubernetes Administrator', tech: 'Kubernetes', color: '#326CE5' },
  { issuer: 'Red Hat', name: 'Red Hat OpenShift Administration', tech: 'OpenShift', color: '#EE0000' },
  { issuer: 'Nutanix', name: 'NCA 7.5 — Nutanix Certified Associate', tech: 'Nutanix Cloud Platform', color: '#3B82D6' },
]

const AboutMe = ({ onNav }) => {
  const { t } = useText()
  const { credly, fetchCredly } = useData()
  const badges = credly?.badges ?? []
  const rootRef = useReveal(badges.length, 2.7)
  const [contactOpen, setContactOpen] = useState(false)
  const contentRef = useRef(null)
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const box = contentRef.current
    if (!box) return
    const paras = [...box.querySelectorAll('.aboutme-text')]
    let frame = 0
    const place = () => {
      frame = 0
      const mid = window.innerHeight * 0.45
      let best = 0
      let gap = Infinity
      let visible = false
      paras.forEach((el, i) => {
        const r = el.getBoundingClientRect()
        if (r.bottom > 0 && r.top < window.innerHeight) visible = true
        const d = Math.abs(r.top + r.height / 2 - mid)
        if (d < gap) { gap = d; best = i }
      })
      const el = paras[best]
      box.style.setProperty('--sel-y', `${el.offsetTop}px`)
      box.style.setProperty('--sel-h', `${el.offsetHeight}px`)
      box.dataset.sel = visible ? 'on' : 'off'
      setCurrent(best)
    }
    const request = () => { if (!frame) frame = requestAnimationFrame(place) }
    place()
    window.addEventListener('scroll', request, { passive: true })
    window.addEventListener('resize', request)
    const ro = new ResizeObserver(request)
    ro.observe(box)
    return () => {
      window.removeEventListener('scroll', request)
      window.removeEventListener('resize', request)
      ro.disconnect()
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  useEffect(() => { fetchCredly() }, [fetchCredly])

  const renderCard = (b, i) => {
    const Vendor = vendorIcon(b)
    return (
      <a
        key={b.id}
        className="cert-card"
        data-reveal
        style={{ '--i': i % 3 }}
        href={b.url}
        target="_blank"
        rel="noopener noreferrer"
        title={t('aboutme.credly')}
      >
        <Vendor className="cert-card-mark" aria-hidden="true" />
        <img className="cert-card-badge" src={b.image} alt="" loading="lazy" />
        <span className="cert-card-body">
          <span className="cert-card-issuer">
            <Vendor className="cert-card-vendor" aria-hidden="true" />
            {b.issuer}{b.issued ? ` · ${b.issued.slice(0, 4)}` : ''}
          </span>
          <span className="cert-card-name">{b.name}</span>
        </span>
      </a>
    )
  }
  return (
  <section className="aboutme" ref={rootRef}>

    <div className="aboutme-photo-col">
      <img className="aboutme-photo" src={lorenzoPhoto} alt="Lorenzo Veronesi" />
      <p className="aboutme-location">{t('aboutme.location')}</p>
      <AnimatedName className="aboutme-name" />
      <div className="aboutme-actions">
        <a
          className="contact-btn contact-btn--linkedin"
          style={{ '--k': 0 }}
          href="https://it.linkedin.com/in/lorenzo-veronesi-8988ab18a"
          target="_blank"
          rel="noopener noreferrer"
          aria-label={t('aboutme.linkedin')}
        >
          <span className="contact-btn-ico"><FaLinkedinIn aria-hidden="true" /></span>
          <span className="contact-btn-label">LinkedIn</span>
        </a>
        {CONTACT_EMAIL && (
          <button
            type="button"
            className="contact-btn contact-btn--mail"
            style={{ '--k': 1 }}
            onClick={() => setContactOpen(true)}
            aria-label={t('aboutme.mail')}
            aria-haspopup="dialog"
          >
            <span className="contact-btn-ico"><FaRegEnvelope aria-hidden="true" /></span>
            <span className="contact-btn-label">Email</span>
          </button>
        )}
      </div>
    </div>

    <div className="aboutme-content" ref={contentRef}>
      <span className="aboutme-selector" aria-hidden="true" />
      <span className="section-eyebrow">{t('aboutme.eyebrow')}</span>
      <h2 className="aboutme-title">{t('aboutme.title')}</h2>

      <p className={`aboutme-text${current === 0 ? ' is-current' : ''}`}>{t('aboutme.p1')}</p>

      <p className={`aboutme-text${current === 1 ? ' is-current' : ''}`}>
        {t('aboutme.p2a')}{COMPANY_URL
          ? <> <a className="aboutme-inline-company" href={COMPANY_URL} target="_blank" rel="noopener noreferrer">{COMPANY_NAME}</a>,</>
          : <> <strong>{COMPANY_NAME}</strong>,</>
        }
        {' '}{t('aboutme.p2b')}
      </p>

      <p className={`aboutme-text${current === 2 ? ' is-current' : ''}`}>
        {t('aboutme.p3a')}{' '}
        <button type="button" className="aboutme-inline-company aboutme-inline-link" onClick={() => onNav?.('blog')}>{t('nav.blog')}</button>
        {' '}{t('aboutme.p3b')}
      </p>

      <p className={`aboutme-text${current === 3 ? ' is-current' : ''}`}>{t('aboutme.p3c')}</p>

      <p className={`aboutme-text${current === 4 ? ' is-current' : ''}`}>{t('aboutme.p4')}</p>

    </div>

    <div className="aboutme-badges">
      <div className="aboutme-certs aboutme-work">
        <span className="section-eyebrow" data-reveal data-reveal-follow=".work-card" style={{ marginBottom: '0.75rem' }}>{t('aboutme.work')}</span>
        <WorkCard />
      </div>

      <div className="aboutme-certs">
        <span className="section-eyebrow" data-reveal data-reveal-follow=".cert-card" style={{ marginBottom: '0.75rem' }}>{t('aboutme.certs')}</span>
        <div className="cert-cards">
          {badges.map((b, i) => renderCard(b, i))}
        </div>
        {credly?.profile && (
          <a className="cert-all" href={credly.profile} target="_blank" rel="noopener noreferrer">
            {t('aboutme.credlyAll')}
          </a>
        )}
      </div>

      <div className="aboutme-certs">
        <span className="section-eyebrow" data-reveal data-reveal-follow=".cert-card" style={{ marginBottom: '0.75rem' }}>{t('aboutme.wip')}</span>
        <div className="cert-cards">
          {certsInProgress.map((c, i) => {
            const Vendor = vendorIcon(c)
            return (
              <div key={c.name} className="cert-card cert-card--wip" data-reveal style={{ '--i': i % 4 }}>
                <Vendor className="cert-card-mark" aria-hidden="true" />
                <span className="cert-card-logo" style={{ color: themed(c.color) }}><Vendor aria-hidden="true" /></span>
                <span className="cert-card-body">
                  <span className="cert-card-issuer">
                    {c.issuer} · {t('aboutme.wipTag')}
                  </span>
                  <span className="cert-card-name">{c.name}</span>
                  <span className="cert-card-tech">{c.tech}</span>
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>

    {contactOpen && <ContactModal email={CONTACT_EMAIL} onClose={() => setContactOpen(false)} />}
  </section>
  )
}

export default AboutMe
