import { themed } from '../lib/themed.js'
import { prefersReducedMotion } from '../lib/intro.js'
import { useEffect, useRef, useState } from 'react'
import {
  SiGo, SiJavascript, SiTypescript, SiPython,
  SiGnubash, SiCss, SiHtml5, SiVuedotjs, SiRust, SiCplusplus,
} from 'react-icons/si'
import { TbBrandPowershell } from 'react-icons/tb'
import { GoRepo } from 'react-icons/go'

const LANG_COLORS = {
  Go: '#22D3EE', JavaScript: '#FBBF24', TypeScript: '#3B82F6',
  Python: '#A78BFA', Shell: '#4ADE80', CSS: '#FB7185',
  HTML: '#F97316', Vue: '#2DD4BF', Rust: '#F97316',
  'C++': '#E879F9', PowerShell: '#38BDF8',
}

const ACCENT_PALETTE = [
  '#F43F5E', '#FB923C', '#FACC15', '#4ADE80',
  '#22D3EE', '#818CF8', '#E879F9', '#2DD4BF',
]

export const langAccent = (lang, name = '') => {
  if (lang && LANG_COLORS[lang]) return themed(LANG_COLORS[lang])
  const hash = [...name].reduce((a, c) => a + c.charCodeAt(0), 0)
  return themed(ACCENT_PALETTE[hash % ACCENT_PALETTE.length])
}

export const LANG_ICONS = {
  Go: SiGo, JavaScript: SiJavascript, TypeScript: SiTypescript,
  Python: SiPython, Shell: SiGnubash, CSS: SiCss,
  HTML: SiHtml5, Vue: SiVuedotjs, Rust: SiRust, 'C++': SiCplusplus,
  PowerShell: TbBrandPowershell,
}

export const LangIcon = ({ lang }) => {
  const Icon = LANG_ICONS[lang]
  const color = langAccent(lang, lang)
  return Icon
    ? <Icon className="ds-lang-icon" style={{ color }} />
    : <span className="ds-lang-dot" style={{ background: color }} />
}

export const RepoThumb = ({ repo, image, size = '' }) => (
  <div className={`ds-thumb ${size}`} style={{ '--lang-color': langAccent(repo.language, repo.name) }}>
    <GoRepo className="ds-thumb-icon" />
    {image && (
      <img
        className="ds-thumb-photo"
        src={image}
        alt=""
        loading="lazy"
        onError={e => { e.currentTarget.style.display = 'none' }}
      />
    )}
  </div>
)

export const fmtDate = (iso, locale) =>
  new Date(iso).toLocaleDateString(locale, { day: 'numeric', month: 'short', year: 'numeric' })

export const Head = ({ icon: Icon, label }) => (
  <div className="ds-head">
    <span className="ds-badge" aria-hidden="true"><Icon className="ds-badge-icon" /></span>
    <span className="ds-side">{label}</span>
  </div>
)

export const Pill = ({ icon: Icon, color, children }) => (
  <span className="ds-pill" style={{ '--pc': color }}>
    {Icon && <Icon className="ds-pill-icon" />}
    <span>{children}</span>
  </span>
)

export const useRotation = (count, interval) => {
  const [index, setIndex] = useState(0)
  const [prev, setPrev] = useState(-1)
  const fill = useRef(null)
  const paused = useRef(false)
  const visible = useRef(true)
  const root = useRef(null)
  const reduced = useRef(prefersReducedMotion())

  const go = next => {
    setIndex(cur => {
      const target = (next + count) % count
      if (target !== cur) setPrev(cur)
      return target
    })
  }

  useEffect(() => {
    const el = root.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    const io = new IntersectionObserver(([e]) => { visible.current = e.isIntersecting }, { threshold: 0.2 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    const bar = fill.current
    if (reduced.current || count < 2) {
      if (bar) bar.style.transform = 'scaleX(1)'
      return
    }
    let raf = 0
    let last = performance.now()
    let acc = 0
    if (bar) bar.style.transform = 'scaleX(0)'
    const loop = now => {
      const dt = Math.min(now - last, 64)
      last = now
      if (!paused.current && visible.current) acc += dt
      if (bar) bar.style.transform = `scaleX(${Math.min(acc / interval, 1).toFixed(4)})`
      if (acc >= interval) {
        setPrev(index)
        setIndex((index + 1) % count)
        return
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [index, count, interval])

  const handlers = {
    onPointerEnter: e => { if (e.pointerType === 'mouse') paused.current = true },
    onPointerLeave: e => { if (e.pointerType === 'mouse') paused.current = false },
    onFocus: e => { if (e.target.matches(':focus-visible')) paused.current = true },
    onBlur: () => { paused.current = false },
  }

  return { index, prev, go, fill, root, handlers }
}

const TAG_PALETTE = [
  '#22D3EE', '#4ADE80', '#A78BFA', '#FBBF24', '#FB7185',
  '#34D399', '#60A5FA', '#F97316', '#2DD4BF', '#E879F9',
  '#818CF8', '#FCD34D', '#6EE7B7', '#93C5FD', '#F9A8D4',
]

export const hashColor = str => {
  let h = 0
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0
  return themed(TAG_PALETTE[h % TAG_PALETTE.length])
}
