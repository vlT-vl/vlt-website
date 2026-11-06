const W = 160
const H = 90
const COLS = 14
const ROWS = 9
const MAX_EDGE = 24
const BLEED = 6
const ORIGIN = { x: 80, y: 30 }

const rng = seed => {
  let a = seed
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const f = n => n.toFixed(2)

const build = () => {
  const rand = rng(20261030)
  const cw = (W + BLEED * 2) / (COLS - 1)
  const ch = (H + BLEED * 2) / (ROWS - 1)
  const nodes = []
  for (let r = 0; r < ROWS; r += 1) {
    for (let c = 0; c < COLS; c += 1) {
      nodes.push({
        x: -BLEED + c * cw + (rand() - 0.5) * cw * 0.75,
        y: -BLEED + r * ch + (rand() - 0.5) * ch * 0.75,
      })
    }
  }

  const seen = new Set()
  const edges = []
  nodes.forEach((n, i) => {
    const near = nodes
      .map((m, j) => ({ j, d: Math.hypot(m.x - n.x, m.y - n.y) }))
      .filter(o => o.j !== i && o.d <= MAX_EDGE)
      .sort((a, b) => a.d - b.d)
      .slice(0, rand() > 0.55 ? 3 : 2)
    near.forEach(({ j }) => {
      const key = i < j ? `${i}-${j}` : `${j}-${i}`
      if (seen.has(key)) return
      seen.add(key)
      edges.push({ a: i, b: j })
    })
  })

  const maxD = Math.hypot(Math.max(ORIGIN.x, W - ORIGIN.x), Math.max(ORIGIN.y, H - ORIGIN.y))
  const reach = p => Math.hypot(p.x - ORIGIN.x, p.y - ORIGIN.y) / maxD

  const edgeData = edges.map(e => {
    const p = nodes[e.a]
    const q = nodes[e.b]
    const delay = Math.min(reach(p), reach(q)) * 1.5 + rand() * 0.25
    return { x1: p.x, y1: p.y, x2: q.x, y2: q.y, delay }
  })

  const nodeDelay = nodes.map(() => Infinity)
  edges.forEach((e, k) => {
    nodeDelay[e.a] = Math.min(nodeDelay[e.a], edgeData[k].delay)
    nodeDelay[e.b] = Math.min(nodeDelay[e.b], edgeData[k].delay)
  })
  const nodeData = nodes.map((n, i) => ({
    x: n.x,
    y: n.y,
    delay: Number.isFinite(nodeDelay[i]) ? nodeDelay[i] + 0.35 : 1,
    breathes: i % 3 === 0,
    breath: 4 + rand() * 4,
    phase: rand() * 4,
  }))

  const pulses = edgeData
    .filter((_, k) => k % 8 === 0)
    .map((e, k) => ({
      ...e,
      start: 2.6 + ((k * 0.73) % 4.5),
      duration: 7 + ((k * 1.37) % 5),
    }))

  const dots = edgeData
    .filter((_, k) => k % 12 === 3)
    .map((e, k) => ({
      path:
        k % 2
          ? `M${f(e.x2)} ${f(e.y2)} L${f(e.x1)} ${f(e.y1)}`
          : `M${f(e.x1)} ${f(e.y1)} L${f(e.x2)} ${f(e.y2)}`,
      start: 2.8 + ((k * 0.61) % 6),
      duration: 8 + (k % 5),
    }))

  const rings = nodeData
    .filter((_, i) => i % 13 === 5)
    .map((n, k) => ({
      x: n.x,
      y: n.y,
      start: 3 + ((k * 0.9) % 4),
      duration: 6 + (k % 3),
    }))

  const marks = nodeData
    .filter((_, i) => i % 6 === 2)
    .map((n, k) => {
      const r = 0.8 + rand() * 0.7
      return {
        x: n.x,
        y: n.y,
        k: (r * 3.2) / 364,
        delay: 0.9 + reach(n) * 1.5 + rand() * 0.3,
        breath: 5 + rand() * 4,
        phase: rand() * 4,
        flip: k % 2,
      }
    })

  return { W, H, edges: edgeData, nodes: nodeData, pulses, dots, rings, marks }
}

export const NETWORK = build()
