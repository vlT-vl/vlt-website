import '../css/landing.css'
import '../css/vltview.css'
import VltLogo from './VltLogo.jsx'

const infraSkills = [
  { label: 'VMware vSphere', sub: '6.0 · 6.5 · 6.7 · 7.0 · 8.0' },
  { label: 'Proxmox VE', sub: 'Virtualizzazione · Clustering · HA' },
  { label: 'Virtualizzazione', sub: 'KVM · Proxmox · ESXi' },
  { label: 'Kubernetes', sub: 'K8s · K3s · Helm · KubeVirt' },
  { label: 'Docker & Container', sub: 'Compose · Registry · Docker' },
  { label: 'Red Hat / Linux', sub: 'RHEL · Fedora · Debian · Arch' },
  { label: 'Windows Server', sub: 'AD · GPO · DNS · DHCP' },
  { label: 'Automazione', sub: 'Ansible · Rundeck · Puppet' },
]

const devSkills = [
  { label: 'Go', sub: 'CLI · API REST · Backend' },
  { label: 'React', sub: 'Vite · Hooks · SPA' },
  { label: 'React + Go', sub: 'Fullstack · API integration' },
  { label: 'Wails', sub: 'Desktop app · Go + Web frontend' },
  { label: 'API & Backend', sub: 'REST · JSON · Auth · Middleware' },
  { label: 'Digital Design', sub: 'UI · Branding · SVG · Figma' },
]

const VltView = ({ onNav }) => (
  <div className="landing">

    {/* ── Brand section ── */}
    <section className="vlt-brand">
      <div className="vlt-brand-logo-wrap" style={{ '--cube-w': '2.88rem' }}>
        <VltLogo size="2.88rem" staticExpanded />
      </div>

      <p className="vlt-brand-slogan">Il mio brand, il mio spazio, la mia tecnologia.</p>

      <span className="section-eyebrow">about vlT</span>

      <p className="vlt-brand-text">
        vlT — <strong>veronesi lorenzo Tech</strong> — nasce come brand personale
        per dare un'identità unica a tutte le mie passioni tecnologiche. Non un semplice
        portfolio, ma uno spazio dove infrastruttura enterprise, sviluppo software,
        design e curiosità convivono sotto un'unica sigla.
      </p>

      <p className="vlt-brand-text">
        L'obiettivo a lungo termine è che vlT diventi qualcosa di più grande
        di un brand personale: una realtà tech indipendente, con prodotti propri,
        un'identità solida e gli stessi valori che guidano ogni progetto —
        qualità, rigore tecnico e una genuina passione per costruire cose che funzionino.
      </p>
    </section>

    {/* ── Skills ── */}
    <section className="skills">
      <span className="section-eyebrow">infrastruttura &amp; sistemi</span>
      <div className="skills-grid">
        {infraSkills.map(s => (
          <div key={s.label} className="skill-item">
            <span className="skill-label">{s.label}</span>
            <span className="skill-sub">{s.sub}</span>
          </div>
        ))}
      </div>
    </section>

    <section className="skills">
      <span className="section-eyebrow">sviluppo software</span>
      <div className="skills-grid">
        {devSkills.map(s => (
          <div key={s.label} className="skill-item">
            <span className="skill-label">{s.label}</span>
            <span className="skill-sub">{s.sub}</span>
          </div>
        ))}
      </div>
    </section>

    <section className="blog-teaser">
      <span className="section-eyebrow">dal blog</span>
      <h2 className="teaser-title">Articoli &amp; Guide</h2>
      <p className="teaser-sub">
        VMware · Proxmox · Kubernetes · Docker · Go · Linux — e molto altro.
      </p>
      <button className="teaser-cta" onClick={() => onNav?.('blog')}>
        Leggi gli articoli →
      </button>
    </section>

  </div>
)

export default VltView
