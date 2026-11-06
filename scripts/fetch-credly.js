import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { tmpdir } from 'node:os'

const __dirname = dirname(fileURLToPath(import.meta.url))

const USER = process.env.CREDLY_USER ?? 'lorenzo-veronesi'
const CACHE_DIR = join(tmpdir(), 'vlt-dev-cache')
const OUT_FILE = process.env.CI === 'true'
  ? join(__dirname, '..', 'public', 'credly.json')
  : join(CACHE_DIR, 'credly.json')
const BADGES_URL = `https://www.credly.com/users/${USER}/badges.json`

const fetchBadges = async () => {
  const res = await fetch(BADGES_URL, {
    headers: { Accept: 'application/json', 'User-Agent': 'Mozilla/5.0 (compatible; vlt-website)' },
    signal: AbortSignal.timeout(20000),
  })
  if (!res.ok) throw new Error(`credly HTTP ${res.status}`)
  const { data } = await res.json()
  if (!Array.isArray(data)) throw new Error('risposta credly non valida')

  return data
    .filter(b => b.state === 'accepted' && b.public)
    .map(b => ({
      id: b.id,
      name: b.badge_template?.name ?? '',
      issuer: b.issuer?.entities?.[0]?.entity?.name ?? '',
      image: b.image_url ?? b.badge_template?.image_url ?? '',
      issued: b.issued_at_date ?? null,
      expires: b.expires_at_date ?? null,
      url: `https://www.credly.com/badges/${b.id}/public_url`,
    }))
    .sort((a, b) => (b.issued ?? '').localeCompare(a.issued ?? ''))
}

try {
  const badges = await fetchBadges()
  if (!badges.length) throw new Error('nessun badge pubblico')
  mkdirSync(dirname(OUT_FILE), { recursive: true })
  writeFileSync(OUT_FILE, `${JSON.stringify({ profile: `https://www.credly.com/users/${USER}`, badges }, null, 2)}\n`)
  console.log(`[fetch-credly] ✓ ${badges.length} badge → ${OUT_FILE}`)
} catch (e) {
  console.warn(`[fetch-credly] ${e.message}`)
  if (existsSync(OUT_FILE) && readFileSync(OUT_FILE, 'utf8').trim()) {
    console.warn('[fetch-credly] mantengo l’ultimo file valido')
  } else {
    process.exitCode = 1
  }
}
