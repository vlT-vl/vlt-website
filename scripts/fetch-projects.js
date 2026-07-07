// Eseguito da GitHub Actions prima di vite build.
// Genera public/projects.json usando API GitHub lato CI/dev, mai dal browser.

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { tmpdir } from 'node:os'

const __dirname = dirname(fileURLToPath(import.meta.url))
const RESERVE   = 25

// In CI scrive in public/ (fresh checkout, incluso nel build).
// In locale scrive in CACHE_DIR (mai nella cartella di progetto).
const CACHE_DIR = join(tmpdir(), 'vlt-dev-cache')
const OUT_FILE  = process.env.CI === 'true'
  ? join(__dirname, '..', 'public', 'projects.json')
  : join(CACHE_DIR, 'projects.json')

const readEnvFile = key => {
  try {
    const line = readFileSync(new URL('../.env', import.meta.url), 'utf8')
      .split(/\r?\n/)
      .find(row => row.startsWith(`${key}=`))
    return line?.slice(key.length + 1).trim()
  } catch { return null }
}

const readGithubCliToken = () => {
  try {
    return execFileSync('gh', ['auth', 'token'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim()
  } catch { return '' }
}

const requestHeaders = (accept, token) => ({
  Accept: accept,
  'X-GitHub-Api-Version': '2022-11-28',
  'User-Agent': 'vlt-website-projects-fetch',
  ...(token ? { Authorization: `Bearer ${token}` } : {}),
})

const normalizeGithubHtml = (html, fullName) => {
  if (!html) return null
  return html
    .replaceAll('href="#', `href="https://github.com/${fullName}#`)
    .replace(/href="(?!https?:\/\/|mailto:|#)([^"]+)"/g, `href="https://github.com/${fullName}/blob/HEAD/$1"`)
    .replace(/src="(?!https?:\/\/|data:)([^"]+)"/g, `src="https://raw.githubusercontent.com/${fullName}/HEAD/$1"`)
    .replace(/<a /g, '<a target="_blank" rel="noopener noreferrer" ')
}

const extractReadmeImage = (html, fullName) => {
  const src = html?.match(/<img[^>]+src=["']([^"']+)["']/i)?.[1]
  if (!src || src.startsWith('data:')) return null
  if (/^https?:\/\//.test(src)) return src.replace(
    /https:\/\/github\.com\/([^/]+\/[^/]+)\/blob\//,
    'https://raw.githubusercontent.com/$1/'
  )
  return `https://raw.githubusercontent.com/${fullName}/HEAD/${src.replace(/^\.?\//, '')}`
}

const compactRepo = repo => ({
  id:               repo.id,
  name:             repo.name,
  full_name:        repo.full_name,
  html_url:         repo.html_url,
  description:      repo.description,
  language:         repo.language,
  stargazers_count: repo.stargazers_count ?? 0,
  forks_count:      repo.forks_count ?? 0,
  watchers_count:   repo.watchers_count ?? repo.watchers ?? 0,
  size:             repo.size ?? 0,
  topics:           Array.isArray(repo.topics) ? repo.topics : [],
  license:          repo.license,
  pushed_at:        repo.pushed_at,
  updated_at:       repo.updated_at,
  archived:         repo.archived ?? false,
  fork:             repo.fork ?? false,
})

export const getGithubUser = () =>
  process.env.VITE_GITHUB_USER || readEnvFile('VITE_GITHUB_USER') || 'vlT-vl'

export const getGithubToken = () =>
  process.env.GITHUB_TOKEN || readGithubCliToken()

const readPrevPayload = () => {
  try {
    return JSON.parse(readFileSync(OUT_FILE, 'utf8'))
  } catch {
    return null
  }
}

export async function generateProjectsPayload({ user = getGithubUser(), token = getGithubToken() } = {}) {

  // Merge campo-per-campo con l'ultimo JSON committato: se una singola chiamata
  // fallisce o viene saltata per rate-limit, il repo mantiene il dato precedente
  // invece di perderlo — evita che un run parziale sostituisca in blocco dati
  // già buoni con campi vuoti.
  const prevByFullName = new Map(
    (readPrevPayload()?.repos ?? []).map(r => [r.full_name, r])
  )

  let remaining = Number.POSITIVE_INFINITY
  const apiFetch = async (url, accept = 'application/vnd.github+json') => {
    if (remaining <= RESERVE) return null
    const res = await fetch(url, {
      headers: requestHeaders(accept, token),
      signal: AbortSignal.timeout(15000),
    })
    const rem = res.headers.get('X-RateLimit-Remaining')
    if (rem !== null) remaining = parseInt(rem, 10)
    return res
  }

  const source = `https://api.github.com/users/${user}/repos?type=public&sort=pushed&per_page=100`
  const listRes = await apiFetch(source)
  if (!listRes?.ok) throw new Error(`GitHub API ${listRes?.status ?? 'no-response'}`)

  const repos = await listRes.json()
  if (!Array.isArray(repos)) throw new Error('risposta GitHub non valida')

  const payload = {
    source,
    repos: [],
  }

  for (const repo of repos) {
    const data = compactRepo(repo)
    const prev = prevByFullName.get(repo.full_name)

    try {
      const readmeRes = await apiFetch(
        `https://api.github.com/repos/${repo.full_name}/readme`,
        'application/vnd.github.html'
      )
      if (readmeRes?.ok) {
        const html = await readmeRes.text()
        data.readmeHtml = normalizeGithubHtml(html, repo.full_name)
        data.readmeImage = extractReadmeImage(html, repo.full_name)
      } else if (readmeRes && readmeRes.status === 404) {
        data.readmeHtml = null
        data.readmeImage = null
      } else {
        data.readmeHtml = prev?.readmeHtml ?? null
        data.readmeImage = prev?.readmeImage ?? null
      }
    } catch (e) {
      console.warn(`[fetch-projects] README ${repo.full_name}: ${e.message}`)
      data.readmeHtml = prev?.readmeHtml ?? null
      data.readmeImage = prev?.readmeImage ?? null
    }

    if (repo.license) {
      try {
        const licenseRes = await apiFetch(`https://api.github.com/repos/${repo.full_name}/license`)
        if (licenseRes?.ok) {
          const license = await licenseRes.json()
          data.licenseText = license?.content
            ? Buffer.from(license.content.replace(/\n/g, ''), 'base64').toString('utf8')
            : (prev?.licenseText ?? null)
        } else if (licenseRes && licenseRes.status === 404) {
          data.licenseText = null
        } else {
          data.licenseText = prev?.licenseText ?? null
        }
      } catch (e) {
        console.warn(`[fetch-projects] license ${repo.full_name}: ${e.message}`)
        data.licenseText = prev?.licenseText ?? null
      }
    }

    try {
      const langRes = await apiFetch(`https://api.github.com/repos/${repo.full_name}/languages`)
      const languages = langRes?.ok
        ? await langRes.json()
        : (prev?.dash?.languages ?? {})

      const contentsRes = await apiFetch(`https://api.github.com/repos/${repo.full_name}/contents`)
      let contents
      if (contentsRes?.ok) {
        const contentsRaw = await contentsRes.json()
        contents = Array.isArray(contentsRaw)
          ? contentsRaw.map(f => ({ sha: f.sha, name: f.name, type: f.type, html_url: f.html_url }))
          : []
      } else if (contentsRes && contentsRes.status === 404) {
        contents = [] // repo vuoto — risposta autoritativa, non un fallimento
      } else {
        contents = prev?.dash?.contents ?? []
      }

      const commitsRes = await apiFetch(`https://api.github.com/repos/${repo.full_name}/commits?per_page=5`)
      let commits
      if (commitsRes?.ok) {
        const commitsRaw = await commitsRes.json()
        commits = Array.isArray(commitsRaw)
          ? commitsRaw.map(c => ({
              sha:      c.sha,
              html_url: c.html_url,
              commit: {
                message:   c.commit?.message ?? '',
                author:    c.commit?.author,
                committer: c.commit?.committer,
              },
            }))
          : []
      } else if (commitsRes && [404, 409].includes(commitsRes.status)) {
        commits = [] // repo vuoto — risposta autoritativa
      } else {
        commits = prev?.dash?.commits ?? []
      }

      const releaseRes = await apiFetch(`https://api.github.com/repos/${repo.full_name}/releases/latest`)
      let release
      if (releaseRes?.ok) {
        const r = await releaseRes.json()
        release = { html_url: r.html_url, tag_name: r.tag_name, name: r.name, published_at: r.published_at }
      } else if (releaseRes && releaseRes.status === 404) {
        release = null // confermato: nessuna release pubblicata
      } else {
        release = prev?.dash?.release ?? null
      }

      data.dash = { languages, contents, commits, release }
    } catch (e) {
      console.warn(`[fetch-projects] dash ${repo.full_name}: ${e.message}`)
      data.dash = prev?.dash ?? { languages: {}, contents: [], commits: [], release: null }
    }

    payload.repos.push(data)
  }

  return { payload, remaining }
}

const isCliRun = process.argv[1] === fileURLToPath(import.meta.url)

if (isCliRun) {
  try {
    if (process.env.CI !== 'true') mkdirSync(CACHE_DIR, { recursive: true })
    const { payload, remaining } = await generateProjectsPayload()
    writeFileSync(OUT_FILE, `${JSON.stringify(payload, null, 2)}\n`, 'utf8')
    console.log(`[fetch-projects] scritti ${payload.repos.length} repository → ${OUT_FILE}; rate remaining: ${remaining}`)
  } catch (e) {
    console.warn(`[fetch-projects] fetch fallita: ${e.message}`)
    if (existsSync(OUT_FILE)) {
      console.warn('[fetch-projects] uso projects.json esistente')
      process.exit(0)
    }
    process.exit(1)
  }
}
