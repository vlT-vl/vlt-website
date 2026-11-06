const seconds = value => {
  const n = Number(value)
  return Number.isFinite(n) && n > 0 ? n * 1000 : 0
}

export const WHAT_FIRST_EXPAND_MS = seconds(import.meta.env.VITE_WHAT_FIRST_EXPAND_SECONDS)
export const WHAT_REST_MS = seconds(import.meta.env.VITE_WHAT_REST_SECONDS)
export const WHAT_EXPAND_MS = seconds(import.meta.env.VITE_WHAT_EXPAND_SECONDS)
export const WHAT_COLLAPSE_MS = seconds(import.meta.env.VITE_WHAT_COLLAPSE_SECONDS)
export const WHAT_TEXT_START_MS = seconds(import.meta.env.VITE_WHAT_TEXT_START_DELAY_SECONDS)
export const WHAT_PARAGRAPH_PAUSE_MS = seconds(import.meta.env.VITE_WHAT_PARAGRAPH_PAUSE_SECONDS)
export const WHAT_TEXT_END_MS = seconds(import.meta.env.VITE_WHAT_TEXT_END_PAUSE_SECONDS)
export const WHAT_REVEAL_DELAY_MS = seconds(import.meta.env.VITE_WHAT_REVEAL_DELAY_SECONDS)
export const WHAT_REVEAL_STAGGER_MS = seconds(import.meta.env.VITE_WHAT_REVEAL_STAGGER_SECONDS)
export const WHAT_REVEAL_MS = seconds(import.meta.env.VITE_WHAT_REVEAL_SECONDS)
export const WHAT_IN_MS = seconds(import.meta.env.VITE_WHAT_IN_SECONDS)
export const WHAT_OUT_MS = seconds(import.meta.env.VITE_WHAT_OUT_SECONDS)
export const WHAT_PILL_MS = seconds(import.meta.env.VITE_WHAT_PILL_SECONDS)
export const WHAT_GAP_MS = seconds(import.meta.env.VITE_WHAT_GAP_SECONDS)
