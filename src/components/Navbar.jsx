import '../css/navbar.css'
import VltLogo from './VltLogo.jsx'
import Theme from './Theme.jsx'
import { SiGithub } from 'react-icons/si'
import { FaLinkedinIn } from 'react-icons/fa'

const GITHUB_URL   = `https://github.com/${import.meta.env.VITE_GITHUB_USER}`
const LINKEDIN_URL = 'https://it.linkedin.com/in/lorenzo-veronesi-8988ab18a'

const Navbar = ({ view, onNav }) => (
  <nav className="navbar">
    <button className="navbar-logo" onClick={() => onNav('home')} aria-label="Home">
      <VltLogo size="1.75rem" />
    </button>

    <ul className="nav-links">
      <li>
        <button className={`nav-btn${view === 'home'     ? ' nav-btn--active' : ''}`} onClick={() => onNav('home')}>
          Home
        </button>
      </li>
      <li>
        <button className={`nav-btn${view === 'about'    ? ' nav-btn--active' : ''}`} onClick={() => onNav('about')}>
          About Me
        </button>
      </li>
      <li>
        <button className={`nav-btn${view === 'vlt'      ? ' nav-btn--active' : ''}`} onClick={() => onNav('vlt')}>
          About vlT
        </button>
      </li>
      <li>
        <button className={`nav-btn${view === 'projects' ? ' nav-btn--active' : ''}`} onClick={() => onNav('projects')}>
          Progetti
        </button>
      </li>
      <li>
        <button className={`nav-btn${view === 'blog'     ? ' nav-btn--active' : ''}`} onClick={() => onNav('blog')}>
          Blog
        </button>
      </li>
    </ul>

    <div className="navbar-socials">
      <a className="navbar-social-btn" href={GITHUB_URL} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
        <SiGithub />
      </a>
      <a className="navbar-social-btn" href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
        <FaLinkedinIn />
      </a>
      <Theme />
    </div>
  </nav>
)

export default Navbar
