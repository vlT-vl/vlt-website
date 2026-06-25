import '../css/hero.css'
import VltLogo from './VltLogo.jsx'

const LOGO_SIZE = '2.4rem'

const Hero = () => (
  <section className="hero">
    <p className="hero-label">Founder · Developer · Engineer</p>
    <div className="hero-logo-wrap" style={{ '--cube-w': LOGO_SIZE }}>
      <VltLogo size={LOGO_SIZE} staticExpanded />
    </div>
    <h1 className="hero-name">lorenzo veronesi</h1>
    <p className="hero-sub">
      Open Source Developer · ICT Solution Architect · Virtualization Specialist &amp; Enthusiast ·
      Full Stack Web Developer · Hardware Technician · Digital Designer
    </p>
  </section>
)

export default Hero
