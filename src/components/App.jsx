import { useState, useCallback } from 'react'
import '../css/app.css'
import { DataProvider } from '../context/DataContext.jsx'
import Navbar from './Navbar.jsx'
import Hero from './Hero.jsx'
import NetBackdrop from './NetBackdrop.jsx'
import Landing from './Landing.jsx'
import AboutMe from './AboutMe.jsx'
import VltView from './VltView.jsx'
import ProjectsView from './ProjectsView.jsx'
import BlogView from './BlogView.jsx'
import VltLogo from './VltLogo.jsx'
import AboutModal from './AboutModal.jsx'
import { SiGithub, SiReact, SiVite } from 'react-icons/si'
import { FaLinkedinIn } from 'react-icons/fa'
import { isIntroPlayed, prefersReducedMotion } from '../lib/intro.js'
import { useText } from '../lib/uiText.js'
import pkg from '../../package.json'

const GITHUB_URL   = `https://github.com/${import.meta.env.VITE_GITHUB_USER}`
const LINKEDIN_URL = 'https://it.linkedin.com/in/lorenzo-veronesi-8988ab18a'
const BLOG_URL     = import.meta.env.VITE_BLOG_URL

const App = () => {
  const { t } = useText()
  const [view, setView] = useState('home')
  const [aboutOpen, setAboutOpen] = useState(false)
  const [landingReady, setLandingReady] = useState(() => isIntroPlayed() || prefersReducedMotion())
  const onHeroReady = useCallback(() => setLandingReady(true), [])

  const nav = v => { setView(v); window.scrollTo({ top: 0, behavior: 'instant' }) }

  return (
    <DataProvider>
    <div className="container">
      <Navbar view={view} onNav={nav} onInfo={() => setAboutOpen(true)} hidden={view === 'home' && !landingReady} />
      <main key={view} className={`view-content${view === 'home' ? ' view-content--home' : ''}`}>
        {view === 'home'     && <><NetBackdrop /><Hero onReady={onHeroReady} />{landingReady && <Landing />}</>}
        {view === 'about'    && <><NetBackdrop faint /><AboutMe onNav={nav} /></>}
        {view === 'vlt'      && <><NetBackdrop faint /><VltView onNav={nav} /></>}
        {view === 'projects' && <><NetBackdrop faint /><ProjectsView /></>}
        {view === 'blog'     && <><NetBackdrop faint /><BlogView /></>}
      </main>

      <footer className="ftr">
        <div className="ftr-body">

          <div className="ftr-brand">
            <button className="ftr-logo-btn" onClick={() => setAboutOpen(true)} aria-label={t('footer.about')}>
              <VltLogo size="1.6rem" />
            </button>
            <p className="ftr-name">Lorenzo Veronesi</p>
            <p className="ftr-role">Virtualization Solution Architect</p>
            <p className="ftr-location">{t('footer.location')}</p>
            <div className="ftr-socials">
              <a className="ftr-social-btn" href={GITHUB_URL} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                <SiGithub />
              </a>
              <a className="ftr-social-btn" href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <FaLinkedinIn />
              </a>
            </div>
          </div>

          <nav className="ftr-nav">
            <span className="ftr-col-title">{t('footer.sections')}</span>
            {[['home','nav.home'],['about','nav.about'],['vlt','nav.vlt'],['projects','nav.projects'],['blog','nav.blog']].map(([v,k]) => (
              <button key={v} className="ftr-nav-link" onClick={() => nav(v)}>{t(k)}</button>
            ))}
          </nav>

          <div className="ftr-links">
            <span className="ftr-col-title">{t('footer.links')}</span>
            <a className="ftr-ext-link" href={GITHUB_URL} target="_blank" rel="noopener noreferrer">GitHub ↗</a>
            <a className="ftr-ext-link" href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer">LinkedIn ↗</a>
            {BLOG_URL && <a className="ftr-ext-link" href={BLOG_URL} target="_blank" rel="noopener noreferrer">Blog ↗</a>}
          </div>

        </div>

        <div className="ftr-bottom">
          <span className="ftr-copy">© 2026 Lorenzo Veronesi · vlT</span>
          <button className="ftr-stack" onClick={() => setAboutOpen(true)}>
            Built with <SiReact className="ftr-stack-icon" /> React &amp; <SiVite className="ftr-stack-icon" /> Vite
          </button>
          <button className="ftr-version" onClick={() => setAboutOpen(true)}>
            v{pkg.version}{pkg.build ? ` · ${pkg.build}` : ''}
          </button>
        </div>
      </footer>

      {aboutOpen && <AboutModal onClose={() => setAboutOpen(false)} />}
    </div>
    </DataProvider>
  )
}

export default App
