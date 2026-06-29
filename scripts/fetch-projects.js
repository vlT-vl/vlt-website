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

export async function generateProjectsPayload({ user = getGithubUser(), token = getGithubToken() } = {}) {

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
    generatedAt: new Date().toISOString(),
    source,
    repos: [],
  }

  for (const repo of repos) {
    const data = compactRepo(repo)

    try {
      const readmeRes = await apiFetch(
        `https://api.github.com/repos/${repo.full_name}/readme`,
        'application/vnd.github.html'
      )
      if (readmeRes?.ok) {
        const html = await readmeRes.text()
        data.readmeHtml = normalizeGithubHtml(html, repo.full_name)
        data.readmeImage = extractReadmeImage(html, repo.full_name)
      }
    } catch (e) {
      console.warn(`[fetch-projects] README ${repo.full_name}: ${e.message}`)
    }

    if (repo.license) {
      try {
        const licenseRes = await apiFetch(`https://api.github.com/repos/${repo.full_name}/license`)
        if (licenseRes?.ok) {
          const license = await licenseRes.json()
          if (license?.content) {
            data.licenseText = Buffer.from(license.content.replace(/\n/g, ''), 'base64').toString('utf8')
          }
        }
      } catch (e) {
        console.warn(`[fetch-projects] license ${repo.full_name}: ${e.message}`)
      }
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
