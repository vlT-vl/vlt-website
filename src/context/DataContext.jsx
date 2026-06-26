import { createContext, useContext, useState, useEffect, useCallback } from 'react'

const GITHUB_USER = import.meta.env.VITE_GITHUB_USER
const BLOG_BASE = import.meta.env.VITE_BLOG_URL ?? ''
/* Dev:  proxy Vite /api/rss → blogOrigin/rss.xml (nessun CORS)
   Prod: posts.json generato da scripts/fetch-posts.js al build time
         → stesso dominio GitHub Pages, zero CORS */
const RSS_URL = '/api/rss'

const TTL = {
  REPOS: 60 * 60 * 1000,         // 1h
  BLOG:  2  * 60 * 60 * 1000,    // 2h
}

const cacheGet = (key, ttl) => {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return null
    const { ts, data } = JSON.parse(raw)
    if (Date.now() - ts > ttl) { localStorage.removeItem(key); return null }
    return data
  } catch { return null }
}

const cacheSet = (key, data) => {
  try { localStorage.setItem(key, JSON.stringify({ ts: Date.now(), data })) } catch {}
}

/* ── RSS parser ───────────────────────────────────────────────────────────── */
const MEDIA_NS   = 'http://search.yahoo.com/mrss/'
const CONTENT_NS = 'http://purl.org/rss/1.0/modules/content/'

const parseRSS = xml => {
  const doc = new DOMParser().parseFromString(xml, 'text/xml')
  if (doc.querySelector('parsererror')) throw new Error('Feed RSS non valido')

  return [...doc.querySelectorAll('item')].map(item => {
    const get = tag => item.querySelector(tag)?.textContent?.trim() ?? ''
    const ns  = (nsUri, local) => item.getElementsByTagNameNS(nsUri, local)[0] ?? null

    const link = get('link')
    const slug = link.split('/').filter(Boolean).at(-1) ?? ''

    const mediaEl  = ns(MEDIA_NS, 'content') ?? ns(MEDIA_NS, 'thumbnail')
    const coverUrl = mediaEl?.getAttribute('url')
      ?? item.querySelector('enclosure')?.getAttribute('url')
      ?? null

    /* full HTML post content da content:encoded (presente nei feed Hashnode) */
    const content = ns(CONTENT_NS, 'encoded')?.textContent?.trim() ?? null

    const brief = get('description')
      .replace(/<!\[CDATA\[|\]\]>/g, '')
      .replace(/<[^>]+>/g, '')
      .trim()

    const tags = [...item.querySelectorAll('category')]
      .map(c => ({ name: c.textContent.trim() }))

    return {
      id:                get('guid') || slug,
      title:             get('title').replace(/<!\[CDATA\[|\]\]>/g, ''),
      brief,
      content,
      slug,
      coverImage:        coverUrl ? { url: coverUrl } : null,
      publishedAt:       get('pubDate'),
      readTimeInMinutes: Math.max(1, Math.ceil(brief.split(/\s+/).length / 200)),
      tags,
    }
  })
}

const fetchRSS = async () => {
  if (!import.meta.env.DEV) {
    const res = await fetch(`${import.meta.env.BASE_URL}posts.json`)
    if (!res.ok) throw new Error(`posts.json HTTP ${res.status}`)
    return res.json()
  }
  const res = await fetch(RSS_URL, { headers: { Accept: 'application/rss+xml, text/xml, */*' } })
  if (!res.ok) throw new Error(`RSS HTTP ${res.status}`)
  return parseRSS(await res.text())
}

const normalizeStaticRepo = repo => ({
  id:               repo.id ?? repo.name,
  name:             repo.name,
  full_name:        repo.full_name ?? `${GITHUB_USER}/${repo.name}`,
  html_url:         repo.html_url ?? `https://github.com/${GITHUB_USER}/${repo.name}`,
  description:      repo.description ?? '',
  language:         repo.language ?? null,
  stargazers_count: repo.stargazers_count ?? 0,
  forks_count:      repo.forks_count ?? 0,
  watchers_count:   repo.watchers_count ?? 0,
  size:             repo.size ?? 0,
  topics:           Array.isArray(repo.topics) ? repo.topics : [],
  license:          repo.license ?? null,
  licenseText:      repo.licenseText ?? null,
  readmeHtml:       repo.readmeHtml ?? null,
  readmeImage:      repo.readmeImage ?? null,
  dash:             repo.dash ?? null,
  pushed_at:        repo.pushed_at ?? '',
  updated_at:       repo.updated_at ?? '',
  archived:         repo.archived ?? false,
  fork:             repo.fork ?? false,
})

const fetchStaticRepos = async () => {
  const res = await fetch(`${import.meta.env.BASE_URL}projects.json`, { cache: 'no-store' })
  if (!res.ok) throw new Error(`projects.json HTTP ${res.status}`)
  const payload = await res.json()
  const list = Array.isArray(payload) ? payload : payload.repos
  if (!Array.isArray(list)) throw new Error('projects.json non valido')
  return list.map(normalizeStaticRepo).filter(repo => repo.name)
}

/* ─────────────────────────────────────────────── */

const DataContext = createContext(null)

export const DataProvider = ({ children }) => {
  const [repos,        setRepos]        = useState([])
  const [repoImages,   setRepoImages]   = useState({})
  const [reposLoading, setReposLoading] = useState(true)
  const [reposError,   setReposError]   = useState(null)

  const [posts,        setPosts]        = useState([])
  const [postsLoading, setPostsLoading] = useState(false)
  const [postsError,   setPostsError]   = useState(null)

  /* ── Repos list da projects.json generato in CI ── */
  useEffect(() => {
    const cached  = cacheGet('gh_repos',         TTL.REPOS)
    let cancelled = false

    if (cached) {
      setRepos(cached)
      setRepoImages(Object.fromEntries(cached.map(repo => [repo.name, repo.readmeImage]).filter(([, image]) => image)))
      setReposLoading(false)
    }

    const run = async () => {
      try {
        const staticRepos = await fetchStaticRepos()
        if (cancelled || staticRepos.length === 0) return
        setRepos(staticRepos)
        setRepoImages(Object.fromEntries(staticRepos.map(repo => [repo.name, repo.readmeImage]).filter(([, image]) => image)))
        setReposError(null)
        setReposLoading(false)
        cacheSet('gh_repos', staticRepos)
      } catch {
        if (!cancelled && !cached) {
          setReposError('Impossibile caricare i repository. Riprova più tardi.')
        }
      } finally {
        if (!cancelled && !cached) setReposLoading(false)
      }
    }

    run()
    return () => { cancelled = true }
  }, [])

  const fetchRepoDash = useCallback(async (repo) => {
    return repo.dash ?? { contents: [], commits: [], languages: {}, release: null }
  }, [])

  const fetchReadme = useCallback(async (repo) => {
    return repo.readmeHtml ?? null
  }, [])

  /* ── Blog posts via RSS (lazy, cached 2h) ── */
  const fetchPosts = useCallback(async () => {
    if (posts.length > 0) return
    const key    = 'blog_posts'
    const cached = cacheGet(key, TTL.BLOG)
    if (cached) { setPosts(cached); return }

    if (!BLOG_BASE) { setPostsError('VITE_BLOG_URL non configurata'); return }

    setPostsLoading(true)
    setPostsError(null)
    try {
      const data = await fetchRSS()
      if (!data.length) throw new Error('Nessun articolo trovato nel feed')
      setPosts(data)
      cacheSet(key, data)
    } catch (e) {
      setPostsError(e.message ?? 'Impossibile caricare gli articoli.')
    } finally {
      setPostsLoading(false)
    }
  }, [posts.length])

  return (
    <DataContext.Provider value={{
      repos, repoImages, reposLoading, reposError,
      fetchRepoDash, fetchReadme,
      posts, postsLoading, postsError, fetchPosts,
    }}>
      {children}
    </DataContext.Provider>
  )
}

export const useData = () => {
  const ctx = useContext(DataContext)
  if (!ctx) throw new Error('useData must be used within DataProvider')
  return ctx
}
