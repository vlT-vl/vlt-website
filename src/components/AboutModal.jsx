import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import '../css/aboutmodal.css'
import { HiXMark } from 'react-icons/hi2'
import { FiInfo } from 'react-icons/fi'
import VltLogo from './VltLogo.jsx'
import LicenseModal from './LicenseModal.jsx'
import pkg from '../../package.json'
import licenseText from '../../LICENSE?raw'

const stripCaret = v => v?.replace(/^[\^~]/, '') ?? '—'

const STACK = [
  { label: 'React',        value: stripCaret(pkg.dependencies.react) },
  { label: 'Vite',         value: stripCaret(pkg.devDependencies.vite) },
  { label: 'React Icons',  value: stripCaret(pkg.dependencies['react-icons']) },
]

const ALL_DEPS = [
  ...Object.entries(pkg.dependencies).map(([name, v]) => ({ name, version: stripCaret(v) })),
  ...Object.entries(pkg.devDependencies).map(([name, v]) => ({ name, version: stripCaret(v) })),
]

const licenseRepo = {
  name: 'vlT Website',
  license: { name: 'Proprietary Source-Available License', spdx_id: null },
  licenseText,
}

const AboutModal = ({ onClose }) => {
  const [licenseOpen, setLicenseOpen] = useState(false)

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
    <div className="amo-overlay" onClick={onClose}>
      <div className="amo-card" onClick={e => e.stopPropagation()}>

        <div className="amo-header">
          <div className="amo-header-left">
            <FiInfo className="amo-header-icon" />
            <div>
              <span className="amo-eyebrow">Info</span>
              <h2 className="amo-title">vlT Website</h2>
              <span className="amo-subtitle">
                v{pkg.version} · {pkg.build} · {pkg.updated}
              </span>
            </div>
          </div>
          <button className="amo-close" onClick={onClose} aria-label="Chiudi">
            <HiXMark />
          </button>
        </div>

        <div className="amo-body">
          <div className="amo-logo-wrap">
            <VltLogo size="2.4rem" staticExpanded />
          </div>

          <div className="amo-grid">
            <div className="amo-field">
              <span className="amo-field-label">Version</span>
              <span className="amo-field-value">{pkg.version}</span>
            </div>
            <div className="amo-field">
              <span className="amo-field-label">Build</span>
              <span className="amo-field-value">{pkg.build}</span>
            </div>
            <div className="amo-field">
              <span className="amo-field-label">Updated</span>
              <span className="amo-field-value">{pkg.updated}</span>
            </div>
          </div>

          <div className="amo-grid">
            {STACK.map(s => (
              <div className="amo-field" key={s.label}>
                <span className="amo-field-label">{s.label}</span>
                <span className="amo-field-value">{s.value}</span>
              </div>
            ))}
          </div>

          <div className="amo-deps">
            <span className="amo-deps-title">Tutte le dipendenze</span>
            <div className="amo-deps-list">
              {ALL_DEPS.map(d => (
                <span className="amo-dep" key={d.name}>
                  <span className="amo-dep-name">{d.name}</span>
                  <span className="amo-dep-version">{d.version}</span>
                </span>
              ))}
            </div>
          </div>

          <p className="amo-notice">
            vlT Website è di proprietà esclusiva di Veronesi Lorenzo (vlT). Tutti i diritti riservati.{' '}
            <button className="amo-license-link" onClick={() => setLicenseOpen(true)}>
              Visualizza licenza
            </button>
          </p>
        </div>

      </div>

      {licenseOpen && (
        <LicenseModal repo={licenseRepo} onClose={() => setLicenseOpen(false)} />
      )}
    </div>,
    document.body
  )
}

export default AboutModal
