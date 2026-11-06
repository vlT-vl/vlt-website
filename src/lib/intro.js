let played = false

export const isIntroPlayed = () => played
export const markIntroPlayed = () => { played = true }
export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

const FONT_FACES = ['300 1em Montserrat', '400 1em Montserrat', '600 1em Montserrat', '800 1em Montserrat']
const FONT_WAIT_MS = 2500

const hasFontFace = () => {
  for (const face of document.fonts) if (face.family.replace(/["']/g, '') === 'Montserrat') return true
  return false
}

const whenFontFaceRegistered = () =>
  new Promise(resolve => {
    const poll = () => (hasFontFace() ? resolve() : setTimeout(poll, 30))
    poll()
  })

export const whenFontsReady = () => {
  if (typeof document === 'undefined' || !document.fonts?.load) return Promise.resolve()
  const loaded = whenFontFaceRegistered()
    .then(() => Promise.all(FONT_FACES.map(face => document.fonts.load(face))))
    .catch(() => {})
  const cap = new Promise(resolve => setTimeout(resolve, FONT_WAIT_MS))
  return Promise.race([loaded, cap])
}
