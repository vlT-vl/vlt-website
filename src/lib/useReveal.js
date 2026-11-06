import { useLayoutEffect, useRef } from 'react'
import { prefersReducedMotion } from './intro.js'
import '../css/reveal.css'

export const useReveal = (dep = 0, intro = 0) => {
  const ref = useRef(null)
  const born = useRef(typeof performance === 'undefined' ? 0 : performance.now())

  useLayoutEffect(() => {
    const root = ref.current
    if (!root) return undefined
    const nodes = [...root.querySelectorAll('[data-reveal]')].filter(n => !n.classList.contains('is-in'))

    if (prefersReducedMotion() || !('IntersectionObserver' in window)) {
      nodes.forEach(n => n.classList.add('is-in'))
      return undefined
    }

    nodes.forEach(n => n.classList.add('rv-armed'))
    const groups = new Map()
    nodes.forEach(n => {
      const sel = n.dataset.revealFollow
      const key = sel ? n.parentElement?.querySelector(sel) : n
      if (!key) return
      groups.set(key, [...(groups.get(key) ?? []), n])
    })
    const io = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (!e.isIntersecting) return
        const elapsed = (performance.now() - born.current) / 1000
        ;(groups.get(e.target) ?? []).forEach(n => {
          n.style.setProperty('--rv-wait', `${Math.max(0, intro - elapsed).toFixed(2)}s`)
          n.classList.add('is-in')
        })
        io.unobserve(e.target)
      }),
      { threshold: 0.15, rootMargin: '0px 0px -6% 0px' },
    )
    groups.forEach((list, key) => io.observe(key))
    return () => io.disconnect()
  }, [dep, intro])

  return ref
}
