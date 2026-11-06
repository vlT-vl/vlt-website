import { useLayoutEffect, useRef } from 'react'
import '../css/landing.css'
import '../css/vltview.css'
import VltLogo, { PIECES } from './VltLogo.jsx'
import { FaMicrosoft } from 'react-icons/fa'
import { GrVmware } from 'react-icons/gr'
import { TbApi, TbPalette } from 'react-icons/tb'
import { GiVirtualMarker } from 'react-icons/gi'
import { SiProxmox, SiNutanix, SiRancher, SiKubernetes, SiDocker, SiRedhat, SiAnsible, SiGo, SiReact, SiPython } from 'react-icons/si'
import nexCube from '../res/nexcube.svg'
import { useText } from '../lib/uiText.js'
import { useReveal } from '../lib/useReveal.js'
import { themed } from '../lib/themed.js'

const infraSkills = [
  { label: 'VMware vSphere', sub: '6.0 · 6.5 · 6.7 · 7.0 · 8.0', icon: GrVmware, color: '#78BE20' },
  { label: 'VMware Cloud Foundation', sub: 'VCF · SDDC Manager · vSAN · NSX', icon: GrVmware, color: '#78BE20' },
  { label: 'Proxmox VE', subKey: 'skill.proxmoxSub', icon: SiProxmox, color: '#E57000' },
  { label: 'Nutanix', sub: 'AHV · Prism · HCI', icon: SiNutanix, color: '#024DA1' },
  { labelKey: 'skill.virt', sub: 'KVM · Proxmox · ESXi', icon: GiVirtualMarker, color: '#22D3EE' },
  { label: 'Kubernetes', sub: 'K8s · K3s · Helm · KubeVirt', icon: SiKubernetes, color: '#326CE5' },
  { label: 'Harvester HCI', sub: 'SUSE · Rancher · KubeVirt', icon: SiRancher, color: '#0075A8' },
  { label: 'OKD', sub: 'OpenShift upstream · KubeVirt', icon: SiRedhat, color: '#EE0000' },
  { label: 'Docker & Container', sub: 'Compose · Registry · Docker', icon: SiDocker, color: '#2496ED' },
  { label: 'Red Hat / Linux', sub: 'RHEL · Fedora · Debian · Arch', icon: SiRedhat, color: '#EE0000' },
  { label: 'Windows Server', sub: 'AD · GPO · DNS · DHCP', icon: FaMicrosoft, color: '#00A4EF' },
  { labelKey: 'skill.automation', sub: 'Ansible · Rundeck · Puppet', icon: SiAnsible, color: '#EE0000' },
]

const devSkills = [
  { label: 'Go', sub: 'CLI · API REST · Backend', icon: SiGo, color: '#00ADD8' },
  { label: 'React', sub: 'Vite · Hooks · SPA', icon: SiReact, color: '#61DAFB' },
  { label: 'React + Go', sub: 'Fullstack · API integration', icon: SiReact, color: '#61DAFB' },
  { label: 'nex Framework', sub: 'Desktop app · Go + React/Vite', image: nexCube },
  { label: 'nex Web', sub: 'Web · Go + React/Vite', image: nexCube },
  { label: 'Python', sub: 'Scripting · Automation · Tooling', icon: SiPython, color: '#3776AB' },
  { label: 'API & Backend', sub: 'REST · JSON · Auth · Middleware', icon: TbApi, color: '#A78BFA' },
  { label: 'Digital Design', sub: 'UI · Branding · SVG · Motion Design', icon: TbPalette, color: '#A259FF' },
]

const SkillCard = ({ s, label, sub, i, dup }) => (
  <div
    className="skill-item"
    data-reveal=""
    data-dup={dup ? 'true' : undefined}
    aria-hidden={dup ? true : undefined}
    style={{ '--i': i % 4 }}
  >
    {s.image
      ? (
        <svg className="skill-mark skill-mark--cube" viewBox="0 0 364 311" fill="currentColor" aria-hidden="true">
          {PIECES.map(({ id, d }) => <path key={id} d={d} />)}
        </svg>
      )
      : <s.icon className="skill-mark" aria-hidden="true" />}
    <span className="skill-logo" style={s.color ? { color: themed(s.color) } : undefined}>
      {s.image
        ? <img className="skill-logo-image" src={s.image} alt="" aria-hidden="true" />
        : <s.icon aria-hidden="true" />}
    </span>
    <span className="skill-body">
      <span className="skill-label">{label(s)}</span>
      <span className="skill-sub">{sub(s)}</span>
    </span>
  </div>
)

const SkillRows = ({ list, label, sub }) => {
  const gridRef = useRef(null)
  useLayoutEffect(() => {
    const el = gridRef.current
    if (!el) return undefined
    const fit = () => {
      const gap = 9.6
      const w = el.clientWidth
      const cols = Math.max(1, Math.floor((w + gap) / (230 + gap)))
      const root = el.closest('.landing') ?? document.documentElement
      root.style.setProperty('--skill-w', `${((w - (cols - 1) * gap) / cols).toFixed(2)}px`)
      root.style.removeProperty('--skill-h')
      const items = [...root.querySelectorAll('.skills-track .skill-item')]
      const h = items.reduce((m, n) => Math.max(m, n.offsetHeight), 0)
      if (h) root.style.setProperty('--skill-h', `${h}px`)
    }
    fit()
    const ro = new ResizeObserver(fit)
    ro.observe(el)
    document.fonts?.ready.then(fit)
    return () => ro.disconnect()
  }, [])
  const half = list.length >= 10 ? Math.ceil(list.length / 2) : list.length
  const rows = half === list.length ? [list] : [list.slice(0, half), list.slice(half)]
  return (
    <div className="skills-grid" ref={gridRef}>
      {rows.map((row, r) => (
        <div className="skills-track" data-row={r} key={r} style={{ '--n': row.length }}>
          {[...row, ...row].map((s, k) => (
            <SkillCard
              key={k}
              s={s}
              label={label}
              sub={sub}
              i={k % row.length}
              dup={k >= row.length}
            />
          ))}
        </div>
      ))}
    </div>
  )
}

const VltView = ({ onNav }) => {
  const { t } = useText()
  const rootRef = useReveal(0, 1.5)
  const label = s => (s.labelKey ? t(s.labelKey) : s.label)
  const sub = s => (s.subKey ? t(s.subKey) : s.sub)
  return (
  <div className="landing" ref={rootRef}>

    {/* ── Brand section ── */}
    <section className="vlt-brand">
      <div className="vlt-brand-logo-wrap">
        <VltLogo size="3.6rem" staticExpanded centered />
      </div>

      <p className="vlt-brand-slogan">{t('vlt.slogan')}</p>

      <span className="section-eyebrow">{t('vlt.eyebrow')}</span>

      <p className="vlt-brand-text">
        {t('vlt.p1a')} <strong>veronesi lorenzo Tech</strong> {t('vlt.p1b')}
      </p>

      <p className="vlt-brand-text">
        {t('vlt.p2')}
      </p>
    </section>

    {/* ── Skills ── */}
    <section className="skills">
      <span className="section-eyebrow rv-track" data-reveal data-reveal-follow=".skill-item">{t('vlt.infra')}</span>
      <SkillRows list={infraSkills} label={label} sub={sub} />
      <i className="rv-rule rv-rule--bottom" data-reveal aria-hidden="true" />
    </section>

    <section className="skills">
      <span className="section-eyebrow rv-track" data-reveal data-reveal-follow=".skill-item">{t('vlt.dev')}</span>
      <SkillRows list={devSkills} label={label} sub={sub} />
      <i className="rv-rule rv-rule--bottom" data-reveal aria-hidden="true" />
    </section>

    <section className="blog-teaser">
      <i className="rv-rule rv-rule--top" data-reveal aria-hidden="true" />
      <span className="section-eyebrow rv-track" data-reveal data-reveal-follow=".teaser-title">{t('vlt.fromBlog')}</span>
      <h2 className="teaser-title" data-reveal>{t('vlt.teaserTitle')}</h2>
      <p className="teaser-sub" data-reveal style={{ '--i': 1 }}>
        {t('vlt.teaserSub')}
      </p>
      <button className="teaser-cta" data-reveal style={{ '--i': 2 }} onClick={() => onNav?.('blog')}>
        {t('vlt.teaserCta')}
      </button>
    </section>

  </div>
  )
}

export default VltView
