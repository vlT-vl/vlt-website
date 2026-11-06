import { createContext, useContext, useState, useEffect, useCallback } from 'react'

const GITHUB_USER = import.meta.env.VITE_GITHUB_USER

const TTL = {
  REPOS: 60 * 60 * 1000,         // 1h
  BLOG:  2  * 60 * 60 * 1000,    // 2h
  CREDLY: 60 * 60 * 1000,        // 1h
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

// Dev: Vite serve public/posts.json direttamente (file committato in git, aggiornato da CI).
// Prod: stesso file, servito same-origin da GitHub Pages.
// Nessun fetch esterno, nessun WAF, nessun Playwright.
const loadPostsJson = async () => {
  const res = await fetch(`${import.meta.env.BASE_URL}posts.json`)
  if (!res.ok) throw new Error(`posts.json HTTP ${res.status}`)
  return res.json()
}

const loadCredlyJson = async () => {
  const res = await fetch(`${import.meta.env.BASE_URL}credly.json`, { cache: 'no-store' })
  if (!res.ok) throw new Error(`credly.json HTTP ${res.status}`)
  const payload = await res.json()
  if (!Array.isArray(payload.badges)) throw new Error('credly.json non valido')
  return payload
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
  pagesUrl:         repo.pagesUrl ?? null,
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

  const [credly,       setCredly]       = useState(null)

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
          setReposError('projects.error')
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

  /* ── Blog posts da posts.json (lazy, cached 2h) ── */
  const fetchPosts = useCallback(async () => {
    if (posts.length > 0) return
    const key    = 'blog_posts'
    const cached = cacheGet(key, TTL.BLOG)
    if (cached) { setPosts(cached); return }

    setPostsLoading(true)
    setPostsError(null)
    try {
      const data = await loadPostsJson()
      const list = Array.isArray(data) ? data : (data.posts ?? [])
      if (!list.length) throw new Error('Nessun articolo trovato nel feed')
      setPosts(list)
      cacheSet(key, list)
    } catch (e) {
      setPostsError('blog.error')
    } finally {
      setPostsLoading(false)
    }
  }, [posts.length])

  const fetchCredly = useCallback(async () => {
    if (credly) return
    const key    = 'credly_badges'
    const cached = cacheGet(key, TTL.CREDLY)
    if (cached) { setCredly(cached); return }
    try {
      const data = await loadCredlyJson()
      setCredly(data)
      cacheSet(key, data)
    } catch {
      setCredly({ profile: null, badges: [] })
    }
  }, [credly])

  return (
    <DataContext.Provider value={{
      repos, repoImages, reposLoading, reposError,
      fetchRepoDash, fetchReadme,
      posts, postsLoading, postsError, fetchPosts,
      credly, fetchCredly,
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
