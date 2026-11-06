import { useId, useLayoutEffect, useRef } from 'react'
import '../css/vltlogo.css'

export const PIECES = [
  {
    id: 'l',
    d: 'M100 10 L126 50 L64 139 C54 153 54 166 64 180 L126 265 L100 302 L18 188 C-6 155 -6 155 18 122 Z',
  },
  {
    id: 'r',
    d: 'M121 0 L252 0 C266 0 274 8 283 22 L357 134 C366 148 366 163 357 177 L282 289 C273 303 264 311 248 311 L121 311 L146 270 L229 270 C239 270 246 266 252 257 L313 169 C319 160 319 151 313 142 L252 54 C246 46 239 42 229 42 L146 42 Z',
  },
]

const VltCube = () => {
  const gradId = `vlt-grad-${useId().replace(/:/g, '')}`
  return (
    <svg
      className="vlt-cube"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 364 311"
      role="img"
      aria-label="vlT"
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="364" y2="311" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FF3B30" />
          <stop offset="50%" stopColor="#C1121F" />
          <stop offset="100%" stopColor="#660708" />
        </linearGradient>
      </defs>
      {PIECES.map(({ id, d }) => (
        <g className={`vlt-piece vlt-piece-${id}`} key={id}>
          <path className="vlt-fill" fill={`url(#${gradId})`} d={d} />
          <path className="vlt-line" pathLength="1" fill="none" stroke={`url(#${gradId})`} d={d} />
          <path className="vlt-run" pathLength="1" fill="none" d={d} />
        </g>
      ))}
    </svg>
  )
}

const VltLogo = ({ size = '1.75rem', staticExpanded = false, centered = false }) => {
  const centerRef = useRef(null)

  useLayoutEffect(() => {
    const wrap = centerRef.current
    if (!wrap) return undefined

    const center = () => {
      const box = wrap.querySelector('.vlt-logo')
      const cube = wrap.querySelector('.vlt-cube')
      const text = wrap.querySelector('.vlt-text')
      if (!box || !cube || !text) return
      const spacing = parseFloat(getComputedStyle(text).letterSpacing) || 0
      const groupWidth = text.offsetLeft + text.offsetWidth - spacing
      const boxCenter = box.offsetWidth / 2
      const cubeWidth = parseFloat(getComputedStyle(cube).width) || 0
      wrap.style.setProperty('--shift-from', `${boxCenter - cubeWidth / 2}px`)
      wrap.style.setProperty('--shift-to', `${boxCenter - groupWidth / 2}px`)
    }

    center()
    document.fonts?.ready.then(center)
    window.addEventListener('resize', center)
    return () => window.removeEventListener('resize', center)
  }, [centered, size])

  const logo = (
    <div
      className={`vlt-logo${staticExpanded ? ' vlt-logo--static' : ''}`}
      style={{ '--cube-w': size }}
    >
      <VltCube />
      <span className="vlt-text">vlT</span>
    </div>
  )

  return centered ? <div ref={centerRef} className="vlt-logo-center">{logo}</div> : logo
}

export default VltLogo
