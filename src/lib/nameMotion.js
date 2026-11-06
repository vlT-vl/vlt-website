const EASE = 'cubic-bezier(0.7, 0, 0.2, 1)'

export const runNameMotion = (root, prefix) => {
  if (!root || typeof root.animate !== 'function') return
  if (root.closest('.hero.is-settled:not(.is-replay-run)')) return
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  const words = [...root.querySelectorAll(`.${prefix}-word`)]
  const rests = [...root.querySelectorAll(`.${prefix}-rest`)]
  const gap = root.querySelector(`.${prefix}-gap`)
  const line = root.querySelector(`.${prefix}-line`) || root
  if (words.length < 2 || rests.length < 2) return
  const at = parseFloat(root.dataset.expandAt) || 0
  const step = parseFloat(root.dataset.expandStep) || 0.1
  const dur = (parseFloat(root.dataset.expandDur) || 0.9) * 1000
  const fontSize = parseFloat(getComputedStyle(root).fontSize)
  const scale = root.offsetWidth ? root.getBoundingClientRect().width / root.offsetWidth : 1
  const px = el => el.getBoundingClientRect().width / (scale || 1)
  const first = px(rests[0])
  const second = px(rests[1])
  const gapExtra = gap ? Math.max(0, px(gap) - 0.08 * fontSize) : 0
  const a = first + gapExtra
  const opts = delay => ({ duration: dur, delay: delay * 1000, easing: EASE, fill: 'both' })
  const slide = from => [{ transform: `translateX(${from}px)` }, { transform: 'translateX(0px)' }]
  words[0].animate(slide(a / 2), opts(at))
  words[1].animate(slide(-a / 2), opts(at))
  line.animate(slide(second / 2), opts(at + step))
  rests.forEach((el, i) => {
    el.animate(
      [
        { clipPath: 'inset(0 100% 0 0)', opacity: 0 },
        { clipPath: 'inset(0 0% 0 0)', opacity: 1 },
      ],
      opts(at + i * step),
    )
  })
}
