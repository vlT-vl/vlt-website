import { useState, useEffect, useLayoutEffect, useRef } from 'react'
import '../css/landing.css'
import landingLogo from '../res/landinglogo.webp'
import RepoModal from './RepoModal.jsx'
import BlogPostModal from './BlogPostModal.jsx'
import { useData } from '../context/DataContext.jsx'
import { useText } from '../lib/uiText.js'
import DashShowcase from './DashShowcase.jsx'
import { themed } from '../lib/themed.js'
import { prefersReducedMotion } from '../lib/intro.js'
import {
  TbServer, TbCode, TbBrandPowershell, TbArticle, TbBox, TbHexagon, TbApi,
  TbPalette, TbSparkles, TbBrandAdobe, TbMovie, TbVectorSpline, TbBounceRight, TbEaseInOut, TbVectorBezier2,
} from 'react-icons/tb'
import { SiGo, SiGnubash, SiCss, SiReact, SiNodedotjs, SiSvg, SiPython, SiRancher, SiRedhat } from 'react-icons/si'
import svgDesigner from '../res/svgdesigner.svg'
import { vendorIcon } from '../lib/vendorIcons.js'
import {
  WHAT_FIRST_EXPAND_MS, WHAT_REST_MS, WHAT_EXPAND_MS, WHAT_COLLAPSE_MS, WHAT_TEXT_START_MS,
  WHAT_PARAGRAPH_PAUSE_MS, WHAT_TEXT_END_MS, WHAT_REVEAL_DELAY_MS, WHAT_REVEAL_STAGGER_MS,
  WHAT_REVEAL_MS, WHAT_PILL_MS, WHAT_IN_MS, WHAT_OUT_MS, WHAT_GAP_MS,
} from '../lib/timing.js'

const whatSections = [
  {
    id: 'infra',
    icon: TbServer,
    accent: themed('#22D3EE'),
    tags: [
      { label: 'VMware vSphere 8', color: '#7CC242' },
      { label: 'VMware Cloud Foundation', color: '#7CC242' },
      { label: 'Proxmox VE', color: '#E57000' },
      { label: 'Nutanix AHV', color: '#8FBF3F' },
      { label: 'Kubernetes · K3s', color: '#4C8DF6' },
      { label: 'KubeVirt', icon: TbBox, color: '#5FB4E8' },
      { label: 'Harvester', icon: SiRancher, color: '#30BA78' },
      { label: 'OKD', icon: SiRedhat, color: '#EE0000' },
      { label: 'Red Hat Linux', color: '#F0524F' },
      { label: 'Docker', color: '#2496ED' },
      { label: 'Windows Server', color: '#3AA0F0' },
      { label: 'Ansible', color: '#F25C54' },
    ],
  },
  {
    id: 'dev',
    icon: TbCode,
    accent: themed('#4ADE80'),
    tags: [
      { label: 'Go', icon: SiGo, color: '#00ADD8' },
      { label: 'React · Vite', icon: SiReact, color: '#61DAFB' },
      { label: 'nex', icon: TbHexagon, color: '#007BFF' },
      { label: 'nex web', icon: TbHexagon, color: '#00D4FF' },
      { label: 'Node.js', icon: SiNodedotjs, color: '#6CC24A' },
      { label: 'API REST', icon: TbApi, color: '#FB923C' },
      { label: 'PowerShell', icon: TbBrandPowershell, color: '#5391FE' },
      { label: 'Bash', icon: SiGnubash, color: '#6FC04B' },
      { label: 'Python', icon: SiPython, color: '#4B8BBE' },
    ],
  },
  {
    id: 'design',
    icon: TbVectorSpline,
    accent: themed('#E879F9'),
    tags: [
      { label: 'UI Design', icon: TbPalette, color: '#E879F9' },
      { label: 'SVG Designer Studio', image: svgDesigner, color: '#4A6CFF' },
      { label: 'SVG', icon: SiSvg, color: '#FFB13B' },
      { label: 'Branding', icon: TbSparkles, color: '#F43F5E' },
      { label: 'Illustrator', icon: TbBrandAdobe, color: '#FF9A00' },
      { label: 'CSS · Animation', icon: SiCss, color: '#4F8CFF' },
      { label: 'Motion Design', icon: TbMovie, color: '#A78BFA' },
      { label: 'SVG Animation', icon: TbVectorBezier2, color: '#2DD4BF' },
      { label: 'Micro-interactions', icon: TbBounceRight, color: '#FB923C' },
      { label: 'Easing · Timing', icon: TbEaseInOut, color: '#22D3EE' },
    ],
  },
]

const SCROLL_SPEED = 0.015
const RESUME_MS = 700
const FIT_BASE_MS = 4500
const FIT_WORD_MS = 140
const USER_HOLD_MS = 4000
const READ_LINE = 0.35

const EASE_OUT = 'cubic-bezier(0.16, 1, 0.3, 1)'
const EASE_IO = 'cubic-bezier(0.76, 0, 0.24, 1)'
const LAST_TAG = String(whatSections[whatSections.length - 1].tags.length - 1)

let entered = false

const reduceMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

const boxOf = (el, layer) => {
  const r = el.getBoundingClientRect()
  const l = layer.getBoundingClientRect()
  return {
    left: r.left - l.left,
    right: l.right - r.right,
    top: r.top - l.top,
    height: r.height,
  }
}

const clipFrames = (cell, full) => {
  const inset = [
    cell.top - full.top,
    cell.right - full.right,
    full.top + full.height - (cell.top + cell.height),
    cell.left - full.left,
  ].map(v => `${v.toFixed(2)}px`).join(' ')
  return [
    { clipPath: `inset(${inset} round 10px)` },
    { clipPath: 'inset(0px 0px 0px 0px round 10px)' },
  ]
}

const Tags = ({ s, trackRef }) => {
  const half = Math.ceil(s.tags.length / 2)
  const rows = trackRef ? [s.tags.slice(0, half), s.tags.slice(half)] : [s.tags]
  return (
    <div className="what-tags">
      {rows.map((row, r) => (
        <div
          className="what-tags-track"
          data-row={r}
          key={r}
          ref={trackRef ? el => trackRef(el, r) : undefined}
          style={{ '--n': row.length }}
        >
          {[...row, ...row].map((tag, k) => {
            const Icon = tag.image ? null : tag.icon ?? vendorIcon({ name: tag.label, issuer: '' })
            const dup = k >= row.length
            return (
              <span
                key={k}
                className="what-tag"
                data-dup={dup ? 'true' : undefined}
                aria-hidden={dup ? true : undefined}
                style={{ '--ti': (k % row.length) + r * half, '--pc': themed(tag.color) }}
              >
                {tag.image
                  ? <img className="what-tag-icon what-tag-img" src={tag.image} alt="" />
                  : <Icon className="what-tag-icon" />}
                {tag.label}
              </span>
            )
          })}
        </div>
      ))}
    </div>
  )
}

const ease = x => -(Math.cos(Math.PI * x) - 1) / 2

const buildTimeline = (el, fromPos, startWait) => {
  const overflow = el.scrollHeight - el.clientHeight
  if (overflow <= 1) {
    const words = el.textContent.split(/\s+/).length
    return { fit: true, overflow, startWait, from: 0, segs: [], total: startWait + FIT_BASE_MS + words * FIT_WORD_MS }
  }
  const pad = parseFloat(getComputedStyle(el).paddingTop) || 0
  const stops = [...el.children].slice(1).map(c => c.offsetTop - pad)
  const pts = [...stops.filter(v => v > fromPos + 24 && v < overflow - 24), overflow]
  const segs = []
  let from = fromPos
  pts.forEach(to => {
    segs.push({ from, to, dur: ((to - from) / SCROLL_SPEED), pause: to === overflow ? WHAT_TEXT_END_MS : WHAT_PARAGRAPH_PAUSE_MS })
    from = to
  })
  const total = startWait + segs.reduce((n, g) => n + g.dur + g.pause, 0)
  return { fit: false, overflow, startWait, from: fromPos, segs, total }
}

const posAt = (tl, t) => {
  let at = t - tl.startWait
  if (at <= 0) return tl.from
  for (const g of tl.segs) {
    if (at < g.dur) return g.from + (g.to - g.from) * ease(at / g.dur)
    at -= g.dur
    if (at < g.pause) return g.to
    at -= g.pause
  }
  return tl.segs[tl.segs.length - 1].to
}

const Landing = () => {
  const { t } = useText()
  const [focus, setFocus] = useState(null)
  const [back, setBack] = useState(-1)
  const [upNext, setUpNext] = useState(-1)
  const [ready, setReady] = useState(entered)
  const scrollers = useRef([])
  const bars = useRef([])
  const cards = useRef([])
  const xRefs = useRef([])
  const stageRef = useRef(null)
  const layerRef = useRef(null)
  const focusRef = useRef(null)
  const phaseTimer = useRef(0)
  const gapTimer = useRef(0)
  const gapUntil = useRef(0)
  const opens = useRef(0)
  const pending = useRef(-1)
  const wantClose = useRef(false)
  const hover = useRef({ inside: false, moved: 0, focused: false, focusAt: 0 })
  const nextCard = useRef(-1)
  const intent = useRef(0)
  const lock = useRef(-1)
  const hold = useRef(0)
  const fills = useRef([])
  const tracks = useRef([])
  const reduced = useRef(prefersReducedMotion())
  const [activeRepo,  setActiveRepo]  = useState(null)
  const [activePost,  setActivePost]  = useState(null)
  const { repoImages, fetchPosts } = useData()

  const active = focus && focus.phase !== 'out' ? focus.i : -1
  const idle = focus === null

  useEffect(() => { fetchPosts() }, [fetchPosts])

  const put = f => {
    focusRef.current = f
    setFocus(f)
  }

  const pausedNow = () => {
    const h = hover.current
    const now = performance.now()
    return h.focused && now - h.focusAt < WHAT_REST_MS
  }

  const openCard = i => {
    clearTimeout(phaseTimer.current)
    clearTimeout(gapTimer.current)
    opens.current += 1
    setBack(-1)
    wantClose.current = false
    nextCard.current = -1
    entered = true
    setReady(true)
    put({ i, phase: 'in', n: opens.current })
    phaseTimer.current = setTimeout(() => {
      const f = focusRef.current
      if (!f || f.phase !== 'in') return
      put({ ...f, phase: 'open' })
      if (wantClose.current) closeCard()
    }, WHAT_IN_MS)
  }

  function closeCard() {
    const f = focusRef.current
    if (!f || f.phase === 'out') return
    if (f.phase === 'in') { wantClose.current = true; return }
    clearTimeout(phaseTimer.current)
    put({ ...f, phase: 'out' })
    phaseTimer.current = setTimeout(() => {
      setBack(f.i)
      lock.current = f.i
      put(null)
      gapUntil.current = performance.now() + WHAT_GAP_MS
      gapTimer.current = setTimeout(() => {
        const n = pending.current
        pending.current = -1
        if (n >= 0 && !focusRef.current) openCard(n)
      }, WHAT_GAP_MS)
    }, WHAT_OUT_MS)
  }

  const go = i => {
    const f = focusRef.current
    if (f && f.i === i && f.phase !== 'out') return
    if (!f) {
      if (performance.now() < gapUntil.current) { pending.current = i; return }
      openCard(i)
      return
    }
    pending.current = i
    closeCard()
  }

  useEffect(() => {
    const clear = () => { hover.current.inside = false; hover.current.focused = false }
    document.addEventListener('visibilitychange', clear)
    window.addEventListener('blur', clear)
    return () => {
      document.removeEventListener('visibilitychange', clear)
      window.removeEventListener('blur', clear)
      clearTimeout(phaseTimer.current)
      clearTimeout(gapTimer.current)
      clearTimeout(intent.current)
      entered = false
    }
  }, [])

  useEffect(() => {
    if (WHAT_FIRST_EXPAND_MS <= 0) return undefined
    const id = setTimeout(() => {
      if (!focusRef.current) openCard(0)
    }, WHAT_FIRST_EXPAND_MS)
    return () => clearTimeout(id)
  }, [])

  useEffect(() => {
    if (!idle || nextCard.current < 0 || WHAT_REST_MS <= 0) return undefined
    let id
    const t0 = performance.now()
    const wake = () => {
      if (pausedNow() && performance.now() - t0 < WHAT_REST_MS * 2) { id = setTimeout(wake, 400); return }
      const next = nextCard.current
      nextCard.current = -1
      if (next >= 0 && !focusRef.current && pending.current < 0) openCard(next)
    }
    id = setTimeout(wake, WHAT_REST_MS)
    return () => clearTimeout(id)
  }, [idle])

  useLayoutEffect(() => {
    if (!focus || (focus.phase !== 'in' && focus.phase !== 'out')) return
    const root = xRefs.current[focus.i]
    const small = cards.current[focus.i]
    const layer = layerRef.current
    if (!root || !small || !layer) return
    const still = reduceMotion()
    const dir = focus.phase === 'in'
    const opts = {
      duration: still ? 0 : dir ? WHAT_EXPAND_MS : WHAT_COLLAPSE_MS,
      easing: dir ? EASE_OUT : EASE_IO,
      fill: 'both',
    }
    const run = (from, to) => (dir ? [{ transform: from }, { transform: to }] : [{ transform: to }, { transform: from }])
    const full = boxOf(root, layer)
    const cell = boxOf(small, layer)
    ;['.what-card-icon', '.what-card-title'].forEach(sel => {
      const big = root.querySelector(sel)
      const sm = small.querySelector(sel)
      if (!big || !sm) return
      const b = big.getBoundingClientRect()
      const a = sm.getBoundingClientRect()
      if (!b.width || !a.width) return
      const k = b.width / (big.offsetWidth || b.width) || 1
      const byFont = sel === '.what-card-title'
      const scale = byFont
        ? parseFloat(getComputedStyle(sm).fontSize) / parseFloat(getComputedStyle(big).fontSize)
        : a.width / b.width
      const dx = (a.left + a.width / 2 - (b.left + b.width / 2)) / k
      const dy = (a.top + a.height / 2 - (b.top + b.height / 2)) / k
      big.animate(run(`translate(${dx}px, ${dy}px) scale(${scale})`, 'none'), opts)
    })
    const frames = clipFrames(cell, full)
    root.animate(dir ? frames : [...frames].reverse(), opts)
    const frame = root.querySelector('.what-frame')
    if (frame) {
      const edge = [
        cell.top - full.top - 1,
        cell.right - full.right - 1,
        full.top + full.height - (cell.top + cell.height) - 1,
        cell.left - full.left - 3,
      ].map(v => `${v.toFixed(2)}px`).join(' ')
      const rect = [{ inset: edge }, { inset: '-1px -1px -1px -3px' }]
      frame.animate(dir ? rect : [...rect].reverse(), opts)
    }
  }, [focus])

  useEffect(() => {
    if (active < 0) return
    const el = scrollers.current[active]
    if (!el) return
    const fill = fills.current[active]
    const bar = bars.current[active]
    const paras = [...el.children]
    el.scrollTop = 0
    paras.forEach(c => c.classList.remove('is-read'))
    if (bar) bar.style.opacity = '0'
    if (reduced.current) return
    hold.current = 0
    let raf = 0
    let last = performance.now()
    const startedAt = last
    let tl = buildTimeline(el, 0, WHAT_TEXT_START_MS)
    const marquees = () => (tracks.current[active] ?? []).flatMap(el => (el ? el.getAnimations().filter(x => x.animationName.startsWith('whatMarquee')) : []))
    const loopDur = () => marquees().reduce((m, a) => {
      const d = a.effect?.getComputedTiming().duration
      return Number.isFinite(d) ? Math.max(m, d) : m
    }, 0)
    const cap = tl.total + loopDur() + WHAT_REST_MS
    let t = 0
    let acc = 0
    let current = -1
    let bx = 0
    let by = 0
    let bh = 0
    let placed = false
    const loopRemaining = () => marquees().reduce((m, a) => {
      const d = a.effect.getComputedTiming().duration
      const ct = Number(a.currentTime)
      if (!Number.isFinite(d) || !Number.isFinite(ct)) return m
      return Math.max(m, d - ct)
    }, 0)
    const barStart = performance.now()
    const barAt = WHAT_REVEAL_DELAY_MS + 4 * WHAT_REVEAL_STAGGER_MS + WHAT_REVEAL_MS
    const reading = dt => {
      if (performance.now() - barStart < barAt) return
      el.dataset.flow = '1'
      let idx = 0
      if (tl.fit) {
        const span = Math.max(1, tl.total - tl.startWait)
        idx = Math.min(paras.length - 1, Math.max(0, Math.floor(((t - tl.startWait) / span) * paras.length)))
      } else if (el.scrollTop >= el.scrollHeight - el.clientHeight - 2) {
        idx = paras.length - 1
      } else {
        const line = el.scrollTop + el.clientHeight * READ_LINE
        paras.forEach((c, k) => { if (c.offsetTop <= line) idx = k })
      }
      if (idx !== current) {
        current = idx
        paras.forEach((c, k) => c.classList.toggle('is-read', k === idx))
      }
      if (!bar) return
      const p = paras[idx]
      const tx = p.offsetLeft + 3
      const ty = p.offsetTop - el.scrollTop
      const th = p.offsetHeight
      const k = placed ? 1 - Math.exp(-dt / 140) : 1
      bx += (tx - bx) * k
      by += (ty - by) * k
      bh += (th - bh) * k
      placed = true
      bar.style.transform = `translate(${bx.toFixed(2)}px, ${by.toFixed(2)}px)`
      bar.style.height = `${bh.toFixed(2)}px`
      bar.style.opacity = '1'
    }
    const advance = () => {
      nextCard.current = (active + 1) % whatSections.length
      setUpNext(nextCard.current)
      closeCard()
    }
    const loop = now => {
      const dt = Math.min(now - last, 64)
      last = now
      reading(dt)
      if (stageRef.current) stageRef.current.dataset.paused = pausedNow() ? 'true' : 'false'
      if (now - startedAt > cap) { advance(); return }
      if (!pausedNow()) {
        if (hold.current > 0) {
          hold.current -= dt
          if (hold.current <= 0) {
            tl = buildTimeline(el, el.scrollTop, RESUME_MS)
            t = 0
          }
        } else {
          t += dt
          acc += dt
          if (Math.abs(el.scrollHeight - el.clientHeight - tl.overflow) > 2) {
            tl = buildTimeline(el, el.scrollTop, Math.max(0, WHAT_TEXT_START_MS - acc))
            t = 0
          }
          if (!tl.fit) el.scrollTop = posAt(tl, t)
          const remaining = Math.max(0, tl.total - t, loopRemaining())
          if (fill) fill.style.transform = `scaleX(${(acc / (acc + remaining)).toFixed(4)})`
          if (remaining <= 0) { advance(); return }
        }
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(raf)
      if (fill) fill.style.transform = 'scaleX(0)'
      if (stageRef.current) stageRef.current.dataset.paused = 'false'
    }
  }, [active])

  const holdScroll = () => { hold.current = USER_HOLD_MS }
  const pointerPause = e => {
    if (e.pointerType !== 'mouse') return
    hover.current.inside = true
    hover.current.moved = performance.now()
  }
  const pointerMove = e => { if (e.pointerType === 'mouse') hover.current.moved = performance.now() }
  const pointerResume = e => { if (e.pointerType === 'mouse') hover.current.inside = false }
  const focusPause = e => {
    if (e.target.matches(':focus-visible')) {
      hover.current.focused = true
      hover.current.focusAt = performance.now()
    }
  }
  const focusResume = () => { hover.current.focused = false }
  const gridAnimEnd = e => {
    if (ready || e.animationName !== 'tagPop') return
    const card = e.target.closest('.what-card')
    if (card?.style.getPropertyValue('--ci') === '2' && e.target.style.getPropertyValue('--ti') === LAST_TAG) {
      entered = true
      setReady(true)
    }
  }

  const sections = whatSections.map(s => ({
    ...s,
    eyebrow: t(`what.${s.id}.eyebrow`),
    title: t(`what.${s.id}.title`),
    desc: t(`what.${s.id}.desc`),
    content: t(`what.${s.id}.content`),
  }))

  return (
    <div className="landing">

      <img className="landing-serigrafia" src={landingLogo} alt="" aria-hidden="true" />

      <section className="home-intro">
        <h2 className="home-intro-title">
          {t('landing.title').split('<br />').map((line, i) => (
            <span key={i} className="home-intro-line"><span style={{ '--li': i }}>{line}</span></span>
          ))}
        </h2>
        <p className="home-intro-sub">
          {t('landing.sub')}
        </p>
      </section>

      {/* ── 3 card competenze ── */}
      <div
        className={`what-stage${focus ? ' is-focus' : ''}`}
        ref={stageRef}
        style={{
          '--what-expand': `${WHAT_EXPAND_MS}ms`,
          '--what-collapse': `${WHAT_COLLAPSE_MS}ms`,
          '--what-r': `${WHAT_REVEAL_MS}ms`,
          '--what-s': `${WHAT_REVEAL_STAGGER_MS}ms`,
          '--what-d': `${WHAT_REVEAL_DELAY_MS}ms`,
          '--what-pill': `${WHAT_PILL_MS}ms`,
        }}
        onPointerEnter={pointerPause}
        onPointerMove={pointerMove}
        onPointerLeave={pointerResume}
        onFocus={focusPause}
        onBlur={focusResume}
        onAnimationEnd={gridAnimEnd}
      >
        <div
          className="what-grid"
          data-active={active}
          data-entered={ready || entered ? 'true' : undefined}
        >
          {sections.map((s, i) => (
            <div
              key={s.id}
              className={`what-card${focus ? (focus.phase === 'out' ? (focus.i === i ? ' is-active is-returning' : ' is-dim') : (focus.i === i ? ' is-active' : ' is-dim')) : (back >= 0 && back !== i ? ' is-back' : '')}`}
              ref={el => { cards.current[i] = el }}
              style={{ '--card-accent': s.accent, '--ci': i }}
              onClick={() => go(i)}
              onPointerEnter={e => {
                if (e.pointerType !== 'mouse' || lock.current === i) return
                clearTimeout(intent.current)
                intent.current = setTimeout(() => { if (!focusRef.current) go(i) }, 250)
              }}
              onPointerLeave={() => {
                clearTimeout(intent.current)
                if (lock.current === i) lock.current = -1
              }}
              role="button"
              tabIndex={0}
              aria-expanded={active === i}
              onKeyDown={e => {
                if ((e.key === 'Enter' || e.key === ' ') && e.target === e.currentTarget) {
                  e.preventDefault()
                  go(i)
                }
              }}
            >
              <div className="what-card-main">
                <div className="what-card-inner">
                  <div className="what-card-head">
                    <span className="what-card-badge" aria-hidden="true">
                      <s.icon className="what-card-icon" />
                    </span>
                    <span className="what-card-side">{s.eyebrow}</span>
                  </div>
                  <h3 className="what-card-title">{s.title}</h3>
                  <div className="what-mask"><p className="what-card-desc">{s.desc}</p></div>
                  <Tags s={s} />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="what-focus" ref={layerRef}>
          {sections.map((s, i) => {
            const on = focus && focus.i === i
            return (
              <div
                key={on ? `${s.id}-${focus.n}` : s.id}
                className="what-card what-x"
                data-active="true"
                data-phase={on ? focus.phase : undefined}
                aria-hidden={on ? undefined : true}
                ref={el => { xRefs.current[i] = el }}
                style={{ '--card-accent': s.accent, '--ci': i }}
              >
                <span className="what-frame" aria-hidden="true" />
                <div className="what-card-main">
                  <div className="what-card-inner">
                    <div className="what-card-head">
                      <span className="what-card-badge" aria-hidden="true">
                        <s.icon className="what-card-icon" />
                      </span>
                      <span className="what-card-side">{s.eyebrow}</span>
                    </div>
                    <h3 className="what-card-title">{s.title}</h3>
                    <div className="what-mask"><p className="what-card-desc">{s.desc}</p></div>
                    <Tags s={s} trackRef={(el, r) => { if (!tracks.current[i]) tracks.current[i] = []; tracks.current[i][r] = el }} />
                  </div>
                </div>
                <div className="what-card-detail" aria-hidden={active !== i}>
                  <div
                    className="what-detail-scroll"
                    ref={el => { scrollers.current[i] = el }}
                    onWheel={holdScroll}
                    onTouchStart={holdScroll}
                    onPointerDown={holdScroll}
                  >
                    {s.content.map((para, pi) => (
                      <p key={pi} className="what-detail-p" style={{ '--pi': pi }}>
                        <span className="what-detail-line">{para}</span>
                      </p>
                    ))}
                  </div>
                  <div className="what-detail-rail" aria-hidden="true">
                    <span className="what-detail-bar" ref={el => { bars.current[i] = el }} />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className={`what-dots${focus && focus.phase !== 'out' ? ' is-on' : ''}`}>
        {sections.map((s, i) => (
          <button
            key={s.id}
            type="button"
            className="what-dot"
            data-active={active === i ? 'true' : undefined}
            data-next={active < 0 && idle && upNext === i ? 'true' : undefined}
            style={{ '--card-accent': s.accent }}
            aria-label={s.title}
            aria-current={active === i}
            onClick={() => go(i)}
          >
            <span className="what-dot-fill" ref={el => { fills.current[i] = el }} />
          </button>
        ))}
      </div>

      <DashShowcase onRepo={setActiveRepo} onPost={setActivePost} />

      {activeRepo && (
        <RepoModal repo={activeRepo} image={repoImages[activeRepo.name]} onClose={() => setActiveRepo(null)} />
      )}

      {activePost && (
        <BlogPostModal post={activePost} onClose={() => setActivePost(null)} />
      )}

    </div>
  )
}

export default Landing
