import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import '../css/hero.css'
import VltLogo from './VltLogo.jsx'
import { isIntroPlayed, markIntroPlayed, prefersReducedMotion, whenFontsReady } from '../lib/intro.js'
import { useText } from '../lib/uiText.js'
import { runNameMotion } from '../lib/nameMotion.js'

const LOGO_SIZE = '2.8rem'
const NAME = ['lorenzo', 'veronesi']
const INITIAL_AT = 1.7
const RISE_STEP = 0.12
const EXPAND_AT = 2.3
const EXPAND_STEP = 0.15
const SLOGAN_AT = 3.1
const MOVE_AT = 4.7
const SUB_AT = MOVE_AT + 1.3
const SUB_STEP = 0.1
const EXIT_AT = SUB_AT + 1.4
const READY_MS = MOVE_AT * 1000
const UNLOCK_MS = (MOVE_AT + 1.4) * 1000
const MAX_SCALE = 2.4
const MAX_WIDTH_VW = 0.5
const MAX_HEIGHT_VH = 0.36
const CLICKABLE_MS = (EXIT_AT + 2.6) * 1000
const GRAY_MS = 650
const OUT_MS = 650
const REPLAY_EXIT_AT = 4.2
const REPLAY_INITIAL_AT = 0.45
const REPLAY_EXPAND_AT = 1.05
const REPLAY_SLOGAN_AT = 1.85
const REPLAY_LABEL_AT = 0.1
const REPLAY_SUB_AT = 3.2
const REPLAY_BAR_AT = 3.4
const REPLAY_MS = 8200
const AUTO_REPLAY_MS = 60000

const Hero = ({ onReady }) => {
  const { t } = useText()
  const roles = t('hero.sub').split(' · ')
  const [settled] = useState(() => isIntroPlayed() || prefersReducedMotion())
  const [fontsReady, setFontsReady] = useState(() => isIntroPlayed() || prefersReducedMotion())
  const sectionRef = useRef(null)
  const stageRef = useRef(null)
  const [clickable, setClickable] = useState(() => isIntroPlayed() || prefersReducedMotion())
  const [entryReplay] = useState(() => isIntroPlayed() && !prefersReducedMotion())
  const [phase, setPhase] = useState(entryReplay ? 'replay' : 'idle')
  const [replayKey, setReplayKey] = useState(entryReplay ? 1 : 0)
  const timers = useRef([])

  useEffect(() => {
    if (fontsReady) return undefined
    let alive = true
    whenFontsReady().then(() => alive && setFontsReady(true))
    return () => { alive = false }
  }, [fontsReady])

  useLayoutEffect(() => {
    const el = stageRef.current
    if (!el || settled) return undefined

    const section = sectionRef.current
    const place = () => {
      const navHeight = document.querySelector('.navbar')?.offsetHeight ?? 0
      section.classList.add('is-measuring')
      section.style.height = ''
      const natural = section.offsetHeight
      const r = el.getBoundingClientRect()
      const s = Math.max(
        1,
        Math.min(
          MAX_SCALE,
          (window.innerWidth * MAX_WIDTH_VW) / r.width,
          (window.innerHeight * MAX_HEIGHT_VH) / r.height,
        ),
      )
      const full = Math.max(natural, window.innerHeight - navHeight)
      section.style.height = `${full}px`
      const r2 = el.getBoundingClientRect()
      section.style.height = ''
      section.classList.remove('is-measuring')
      section.style.setProperty('--hero-full', `${full}px`)
      section.style.setProperty('--hero-nat', `${natural}px`)
      el.style.setProperty('--s', String(s))
      el.style.setProperty('--dx', `${window.innerWidth / 2 - (r2.left + r2.width / 2)}px`)
      el.style.setProperty('--dy', `${window.innerHeight / 2 - (r2.top + r2.height / 2)}px`)
    }

    place()
    window.addEventListener('resize', place)
    return () => window.removeEventListener('resize', place)
  }, [settled, fontsReady])

  useLayoutEffect(() => {
    if (settled) return undefined
    const root = document.documentElement
    const setPaused = paused => {
      root.classList.toggle('hero-intro', paused)
      document.querySelectorAll('svg.net').forEach(svg => (paused ? svg.pauseAnimations() : svg.unpauseAnimations()))
    }
    setPaused(true)
    const resume = fontsReady ? setTimeout(() => setPaused(false), UNLOCK_MS) : null
    return () => {
      clearTimeout(resume)
      setPaused(false)
    }
  }, [settled, fontsReady])

  useEffect(() => {
    if (settled) return undefined
    window.scrollTo(0, 0)
    document.body.style.overflow = 'hidden'
    if (!fontsReady) return () => { document.body.style.overflow = '' }
    const unlock = setTimeout(() => { document.body.style.overflow = '' }, UNLOCK_MS)
    const ready = setTimeout(() => {
      markIntroPlayed()
      onReady?.()
    }, READY_MS)
    return () => {
      clearTimeout(unlock)
      clearTimeout(ready)
      document.body.style.overflow = ''
    }
  }, [settled, fontsReady, onReady])

  useEffect(() => {
    if (settled || !fontsReady) return undefined
    const enable = setTimeout(() => setClickable(true), CLICKABLE_MS)
    return () => clearTimeout(enable)
  }, [settled, fontsReady])

  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  useEffect(() => {
    if (!entryReplay) return undefined
    const id = setTimeout(() => setPhase('idle'), REPLAY_MS)
    timers.current.push(id)
    return () => clearTimeout(id)
  }, [entryReplay])

  useEffect(() => {
    if (!clickable || phase !== 'idle' || prefersReducedMotion()) return undefined
    let id
    const schedule = () => {
      id = setTimeout(() => {
        const rect = sectionRef.current?.getBoundingClientRect()
        const visible = document.visibilityState === 'visible' && rect && rect.bottom > 0 && rect.top < window.innerHeight
        if (visible && !modalOpen()) replay()
        else schedule()
      }, AUTO_REPLAY_MS)
    }
    schedule()
    return () => clearTimeout(id)
  }, [clickable, phase])

  const modalOpen = () => !!document.querySelector('.modal-overlay, .amo-overlay, .rmo-overlay, .bpm-overlay, .lmo-overlay')

  const replay = () => {
    if (!clickable || phase !== 'idle') return
    setPhase('gray')
    timers.current.push(setTimeout(() => setPhase('out'), GRAY_MS))
    timers.current.push(setTimeout(() => {
      setReplayKey(k => k + 1)
      setPhase('replay')
    }, GRAY_MS + OUT_MS))
    timers.current.push(setTimeout(() => setPhase('idle'), GRAY_MS + OUT_MS + REPLAY_MS))
  }

  const nameMotion = useCallback(el => { if (el) runNameMotion(el, 'hero') }, [])

  const initialAt = replayKey > 0 ? REPLAY_INITIAL_AT : INITIAL_AT
  const expandAt = replayKey > 0 ? REPLAY_EXPAND_AT : EXPAND_AT
  const nameState = `${phase === 'gray' || phase === 'out' ? ' is-gray' : ''}${phase === 'out' ? ' is-out' : ''}`

  if (!fontsReady) return <section ref={sectionRef} className="hero is-waiting" aria-hidden="true" />

  return (
    <section
      ref={sectionRef}
      className={`hero${settled ? ' is-settled' : ''}${phase !== 'idle' ? ' is-replaying' : ''}${phase === 'replay' ? ' is-replay-run' : ''}${nameState}${replayKey > 0 ? (replayKey % 2 ? ' is-bar-a' : ' is-bar-b') : ''}`}
      style={{ '--move-at': `${MOVE_AT}s`, '--slogan-at': `${SLOGAN_AT}s`, '--exit-at': `${EXIT_AT}s`, '--bar-at': `${REPLAY_BAR_AT}s` }}
    >
      <p
        key={`label-${replayKey}`}
        className={`hero-label rv${nameState}`}
        style={{ '--d': `${replayKey > 0 ? REPLAY_LABEL_AT : MOVE_AT + 0.4}s` }}
      >
        {t('hero.label')}
      </p>

      <div ref={stageRef} className="hero-group">
        <div
          className={`hero-logo-wrap${clickable ? ' is-clickable' : ''}${phase === 'gray' || phase === 'out' ? ' is-gray' : ''}${phase === 'out' ? ' is-out' : ''}`}
          style={{
            '--cube-w': LOGO_SIZE,
            '--lt-d': '0.2s',
            '--lt-dur': '1.1s',
            '--lt-text-d': '1.45s',
            ...(replayKey > 0 ? { '--exit-at': `${REPLAY_EXIT_AT}s` } : {}),
          }}
          role={clickable ? 'button' : undefined}
          tabIndex={clickable ? 0 : undefined}
          aria-label={clickable ? t('hero.replay') : undefined}
          onClick={replay}
          onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && replay()}
        >
          <VltLogo key={replayKey} size={LOGO_SIZE} staticExpanded centered />
        </div>

        <h1
          key={`name-${replayKey}`}
          ref={nameMotion}
          className={`hero-name${nameState}`}
          aria-label="lorenzo veronesi"
          data-expand-at={expandAt}
          data-expand-step={EXPAND_STEP}
          data-expand-dur={1.1}
        >
          {NAME.map((word, i) => (
            <span className="hero-word" key={word} aria-hidden="true">
              {i > 0 && <span className="hero-gap" />}
              <span className="hero-mask">
                <span className="hero-initial" style={{ '--d': `${initialAt + i * RISE_STEP}s` }}>
                  {word[0]}
                </span>
              </span>
              <span className="hero-rest">
                <span>{word.slice(1)}</span>
              </span>
            </span>
          ))}
        </h1>

        <p
          key={`slogan-${replayKey}`}
          className={`hero-slogan${nameState}`}
          style={replayKey > 0 ? { '--slogan-at': `${REPLAY_SLOGAN_AT}s` } : undefined}
          aria-label={t('hero.aria')}
        >
          <span className="hero-sg hero-sg-from" aria-hidden="true">{t('hero.from')}</span>
          <span className="hero-sg hero-sg-a" aria-hidden="true">{t('hero.a')}</span>
          <span className="hero-sg-link" aria-hidden="true">
            <b className="hero-sg-to">{t('hero.to')}</b>
          </span>
          <span className="hero-sg hero-sg-b" aria-hidden="true">{t('hero.b')}</span>
        </p>
      </div>

      <p key={`sub-${replayKey}`} className={`hero-sub${nameState}`} aria-label={t('hero.sub')}>
        {roles.map((role, i) => (
          <span
            key={role}
            className="hero-sub-item"
            aria-hidden="true"
            style={{ '--d': `${(replayKey > 0 ? REPLAY_SUB_AT : SUB_AT) + i * SUB_STEP}s` }}
          >
            {role}
            {i < roles.length - 1 && <span className="hero-sub-sep">·</span>}
          </span>
        ))}
      </p>
    </section>
  )
}

export default Hero
