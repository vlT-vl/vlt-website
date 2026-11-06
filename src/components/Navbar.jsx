import '../css/navbar.css'
import VltLogo from './VltLogo.jsx'
import Theme from './Theme.jsx'
import { SiGithub } from 'react-icons/si'
import { FaLinkedinIn } from 'react-icons/fa'
import { FiInfo } from 'react-icons/fi'
import { useText, toggleLang } from '../lib/uiText.js'

const GITHUB_URL   = `https://github.com/${import.meta.env.VITE_GITHUB_USER}`
const LINKEDIN_URL = 'https://it.linkedin.com/in/lorenzo-veronesi-8988ab18a'

const Navbar = ({ view, onNav, onInfo, hidden = false }) => {
  const { t, lang } = useText()
  const items = [['home', 'nav.home'], ['about', 'nav.about'], ['vlt', 'nav.vlt'], ['projects', 'nav.projects'], ['blog', 'nav.blog']]

  return (
  <nav className={`navbar${hidden ? ' navbar--hidden' : ''}`} aria-hidden={hidden || undefined}>
    <button className="navbar-logo" onClick={() => onNav('home')} aria-label={t('nav.home')}>
      <VltLogo size="1.75rem" />
    </button>

    <ul className="nav-links">
      {items.map(([v, key]) => (
        <li key={v}>
          <button className={`nav-btn${view === v ? ' nav-btn--active' : ''}`} onClick={() => onNav(v)}>
            {t(key)}
          </button>
        </li>
      ))}
    </ul>

    <div className="navbar-socials">
      <a className="navbar-social-btn" href={GITHUB_URL} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
        <SiGithub />
      </a>
      <a className="navbar-social-btn" href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
        <FaLinkedinIn />
      </a>
      <Theme />
      <button className="theme-toggle navbar-lang" onClick={toggleLang} aria-label={t('nav.lang')} title={t('nav.langTitle')}>
        {lang.toUpperCase()}
      </button>
      <button className="theme-toggle" onClick={onInfo} aria-label={t('nav.info')} title={t('nav.info')}>
        <FiInfo />
      </button>
    </div>
  </nav>
  )
}

export default Navbar
