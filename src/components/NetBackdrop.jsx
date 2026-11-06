import { useEffect, useRef } from 'react'
import '../css/netbackdrop.css'
import { NETWORK } from '../lib/network.js'
import { PIECES } from './VltLogo.jsx'

const reduceMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

const MARK_MOTIONS = ['sheen', 'wave', 'glow', 'sheen-rev', 'flash']

const NetBackdrop = ({ faint = false }) => {
  const rootRef = useRef(null)
  const { W, H, edges, nodes, pulses, dots, rings, marks } = NETWORK

  useEffect(() => {
    const root = rootRef.current
    if (!root || reduceMotion()) return undefined

    let frame = 0
    const apply = () => {
      frame = 0
      root.style.setProperty('--sy', String(window.scrollY))
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(apply)
    }

    apply()
    window.addEventListener('scroll', schedule, { passive: true })
    return () => {
      window.removeEventListener('scroll', schedule)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  const viewBox = `0 0 ${W} ${H}`

  return (
    <div ref={rootRef} className={`net-root${faint ? ' net-root--faint' : ''}`} aria-hidden="true">
      <div className="net-layer net-layer--back" style={{ '--sp': 0.015 }}>
        <svg className="net" viewBox={viewBox} preserveAspectRatio="xMidYMid slice">
          <g>
            {edges.map((e, i) => (
              <line
                key={i}
                className="net-edge"
                pathLength="1"
                x1={e.x1}
                y1={e.y1}
                x2={e.x2}
                y2={e.y2}
                style={{ '--d': `${e.delay}s` }}
              />
            ))}
          </g>
          <g>
            {pulses.map((e, i) => (
              <line
                key={i}
                className="net-pulse"
                pathLength="1"
                x1={e.x1}
                y1={e.y1}
                x2={e.x2}
                y2={e.y2}
                style={{ '--s': `${e.start}s`, '--t': `${e.duration}s` }}
              />
            ))}
          </g>
          <g>
            {rings.map((r, i) => (
              <circle
                key={i}
                className="net-ring"
                cx={r.x}
                cy={r.y}
                r="0.55"
                style={{ '--s': `${r.start}s`, '--t': `${r.duration}s` }}
              />
            ))}
          </g>
          <g>
            {nodes.map((n, i) => (
              <circle
                key={i}
                className={`net-node${n.breathes ? ' net-node--breath' : ''}`}
                cx={n.x}
                cy={n.y}
                r="0.4"
                style={{ '--d': `${n.delay}s`, '--b': `${n.breath}s`, '--p': `${n.phase}s` }}
              />
            ))}
          </g>
          {!reduceMotion() && (
            <g>
              {dots.map((d, i) => (
                <circle key={i} className="net-dot" r="0.28" opacity="0">
                  <animateMotion
                    dur={`${d.duration}s`}
                    begin={`${d.start}s`}
                    repeatCount="indefinite"
                    path={d.path}
                    keyPoints="0;1;1"
                    keyTimes="0;0.45;1"
                    calcMode="linear"
                  />
                  <animate
                    attributeName="opacity"
                    values="0;1;1;0;0"
                    keyTimes="0;0.04;0.41;0.45;1"
                    dur={`${d.duration}s`}
                    begin={`${d.start}s`}
                    repeatCount="indefinite"
                  />
                </circle>
              ))}
            </g>
          )}
        </svg>
      </div>

      <div className="net-layer net-layer--front" style={{ '--sp': 0.03 }}>
        <svg className="net" viewBox={viewBox} preserveAspectRatio="xMidYMid slice">
          <defs>
            <clipPath id="vlt-mark-clip">
              {PIECES.map(({ id, d }) => <path key={id} d={d} />)}
            </clipPath>
          </defs>
          {marks.map((m, i) => (
            <g
              key={i}
              className={`net-mark net-mark--${MARK_MOTIONS[i % MARK_MOTIONS.length]}`}
              style={{ '--d': `${m.delay}s`, '--b': `${m.breath}s`, '--p': `${m.phase}s` }}
            >
              <g transform={`translate(${m.x} ${m.y}) scale(${m.k}) translate(-182 -155.5)`}>
                {PIECES.map(({ id, d }) => (
                  <g key={id}>
                    <path className="net-mark-fill" d={d} />
                    <path className={`net-mark-light net-mark-light--${id}`} d={d} />
                  </g>
                ))}
                <g clipPath="url(#vlt-mark-clip)">
                  <rect className="net-mark-sheen" x="-90" y="-30" width="70" height="380" />
                </g>
              </g>
            </g>
          ))}
        </svg>
      </div>

      <div className="net-glass" />
    </div>
  )
}

export default NetBackdrop
