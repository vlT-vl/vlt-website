import { useState } from 'react'
import '../css/app.css'
import { DataProvider } from '../context/DataContext.jsx'
import Navbar from './Navbar.jsx'
import Hero from './Hero.jsx'
import Landing from './Landing.jsx'
import AboutMe from './AboutMe.jsx'
import VltView from './VltView.jsx'
import ProjectsView from './ProjectsView.jsx'
import BlogView from './BlogView.jsx'
import VltLogo from './VltLogo.jsx'
import { SiGithub, SiReact, SiVite } from 'react-icons/si'
import { FaLinkedinIn } from 'react-icons/fa'
import pkg from '../../package.json'

const GITHUB_URL   = `https://github.com/${import.meta.env.VITE_GITHUB_USER}`
const LINKEDIN_URL = 'https://it.linkedin.com/in/lorenzo-veronesi-8988ab18a'
const BLOG_URL     = import.meta.env.VITE_BLOG_URL

const App = () => {
  const [view, setView] = useState('home')

  const nav = v => { setView(v); window.scrollTo({ top: 0, behavior: 'smooth' }) }

  return (
    <DataProvider>
    <div className="container">
      <Navbar view={view} onNav={setView} />
      <main key={view} className="view-content">
        {view === 'home'     && <><Hero /><Landing /></>}
        {view === 'about'    && <AboutMe />}
        {view === 'vlt'      && <VltView onNav={nav} />}
        {view === 'projects' && <ProjectsView />}
        {view === 'blog'     && <BlogView />}
      </main>

      <footer className="ftr">
        <div className="ftr-body">

          <div className="ftr-brand">
            <button className="ftr-logo-btn" onClick={() => nav('home')} aria-label="Home">
              <VltLogo size="1.6rem" />
            </button>
            <p className="ftr-name">Lorenzo Veronesi</p>
            <p className="ftr-role">Virtualization Solution Architect</p>
            <p className="ftr-location">Milano, Italia</p>
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
            <span className="ftr-col-title">Sezioni</span>
            {[['home','Home'],['about','About Me'],['vlt','About vlT'],['projects','Progetti'],['blog','Blog']].map(([v,l]) => (
              <button key={v} className="ftr-nav-link" onClick={() => nav(v)}>{l}</button>
            ))}
          </nav>

          <div className="ftr-links">
            <span className="ftr-col-title">Link</span>
            <a className="ftr-ext-link" href={GITHUB_URL} target="_blank" rel="noopener noreferrer">GitHub ↗</a>
            <a className="ftr-ext-link" href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer">LinkedIn ↗</a>
            {BLOG_URL && <a className="ftr-ext-link" href={BLOG_URL} target="_blank" rel="noopener noreferrer">Blog ↗</a>}
          </div>

        </div>

        <div className="ftr-bottom">
          <span className="ftr-copy">© 2026 Lorenzo Veronesi · vlT</span>
          <span className="ftr-stack">
            Built with <SiReact className="ftr-stack-icon" /> React &amp; <SiVite className="ftr-stack-icon" /> Vite
          </span>
          <span className="ftr-version">v{pkg.version}{pkg.build ? ` · ${pkg.build}` : ''}</span>
        </div>
      </footer>
    </div>
    </DataProvider>
  )
}

export default App
