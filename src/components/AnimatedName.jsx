import '../css/animatedname.css'
import { useCallback } from 'react'
import { runNameMotion } from '../lib/nameMotion.js'

const NAME = ['lorenzo', 'veronesi']
const INITIAL_AT = 0.25
const RISE_STEP = 0.08
const EXPAND_AT = 0.6
const EXPAND_STEP = 0.12
const EXPAND_DUR = 0.95

const AnimatedName = ({ className = '' }) => {
  const motion = useCallback(el => { if (el) runNameMotion(el, 'an') }, [])
  return (
    <p
      ref={motion}
      className={`an${className ? ` ${className}` : ''}`}
      aria-label="lorenzo veronesi"
      data-expand-at={EXPAND_AT}
      data-expand-step={EXPAND_STEP}
      data-expand-dur={EXPAND_DUR}
    >
      <span className="an-line">
        {NAME.map((word, i) => (
          <span className="an-word" key={word} aria-hidden="true">
            {i > 0 && <span className="an-gap" />}
            <span className="an-mask">
              <span className="an-initial" style={{ '--d': `${INITIAL_AT + i * RISE_STEP}s` }}>{word[0]}</span>
            </span>
            <span className="an-rest"><span>{word.slice(1)}</span></span>
          </span>
        ))}
      </span>
    </p>
  )
}

export default AnimatedName
