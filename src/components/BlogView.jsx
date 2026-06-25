import { useEffect, useState, useMemo } from 'react'
import '../css/blog.css'
import BlogPostModal from './BlogPostModal.jsx'
import { useData } from '../context/DataContext.jsx'
import { HiMagnifyingGlass } from 'react-icons/hi2'

const TAG_PALETTE = [
  '#22D3EE', '#4ADE80', '#A78BFA', '#FBBF24', '#FB7185',
  '#34D399', '#60A5FA', '#F97316', '#2DD4BF', '#E879F9',
  '#818CF8', '#FCD34D', '#6EE7B7', '#93C5FD', '#F9A8D4',
]

const hashColor = str => {
  let h = 0
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0
  return TAG_PALETTE[h % TAG_PALETTE.length]
}

const fmtDate = iso =>
  new Date(iso).toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' })

const HeroPostCard = ({ post, onOpen }) => {
  const firstColor = post.tags?.[0] ? hashColor(post.tags[0].name) : '#444'
  return (
    <article
      className="hero-post-card"
      style={{ '--tag-c': firstColor }}
      onClick={() => onOpen(post)}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onOpen(post)}
    >
      <div className="hero-post-top">
        <div className="hero-post-img">
          {post.coverImage?.url
            ? <img className="hero-post-img-photo" src={post.coverImage.url} alt={post.title} loading="lazy" onError={e => { e.currentTarget.style.display = 'none' }} />
            : <span className="hero-post-img-placeholder">✦</span>
          }
        </div>
        <div className="hero-post-info">
          {post.tags?.length > 0 && (
            <div className="hero-post-tags">
              {post.tags.slice(0, 4).map(t => (
                <span key={t.name} className="hero-post-tag" style={{ '--tag-c': hashColor(t.name) }}>
                  {t.name}
                </span>
              ))}
            </div>
          )}
          <h3 className="hero-post-title">{post.title}</h3>
          <p className="hero-post-brief">{post.brief}</p>
        </div>
      </div>

      <div className="hero-post-footer">
        <div className="hero-post-meta">
          <span className="hero-post-date">{fmtDate(post.publishedAt)}</span>
          <span className="hero-post-read">{post.readTimeInMinutes} min</span>
        </div>
        <span className="hero-post-cta">Leggi articolo →</span>
      </div>
    </article>
  )
}

const BlogView = () => {
  const { posts, postsLoading: loading, postsError: error, fetchPosts } = useData()
  const [activePost, setActivePost] = useState(null)
  const [query,      setQuery]      = useState('')
  const [tagFilter,  setTagFilter]  = useState('all')

  useEffect(() => { fetchPosts() }, [fetchPosts])

  const allTags = useMemo(() => {
    const seen = new Set()
    posts.forEach(p => p.tags?.forEach(t => seen.add(t.name)))
    return Array.from(seen)
  }, [posts])

  const heroPost = posts[0] ?? null

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return posts.filter(p => {
      if (heroPost && p.id === heroPost.id) return false
      const matchTag = tagFilter === 'all' || p.tags?.some(t => t.name === tagFilter)
      if (!matchTag) return false
      if (!q) return true
      return (
        p.title.toLowerCase().includes(q) ||
        p.brief.toLowerCase().includes(q) ||
        p.tags?.some(t => t.name.toLowerCase().includes(q))
      )
    })
  }, [posts, query, tagFilter, heroPost])

  return (
    <div className="blog">

      <section className="blog-intro">
        <span className="section-eyebrow">articoli</span>
        <h2 className="blog-title">Blog</h2>
        <p className="blog-sub">
          VMware · Proxmox · Kubernetes · Go · Linux — guide, approfondimenti e note dal campo.
        </p>
      </section>

      {!loading && !error && (
        <>
          <div className="view-filter-bar">
            <div className="view-search-wrap">
              <HiMagnifyingGlass className="view-search-icon" />
              <input
                className="view-search-input"
                type="search"
                placeholder="Cerca articoli…"
                value={query}
                onChange={e => { setQuery(e.target.value); setTagFilter('all') }}
              />
            </div>
            {(query || tagFilter !== 'all') && (
              <span className="view-filter-count">{filtered.length} risultati</span>
            )}
          </div>

          {allTags.length > 0 && (
            <div className="view-tag-pills">
              <button
                className={`filter-btn${tagFilter === 'all' ? ' filter-btn--active' : ''}`}
                onClick={() => setTagFilter('all')}
              >
                Tutti
              </button>
              {allTags.map(tag => (
                <button
                  key={tag}
                  className={`filter-btn${tagFilter === tag ? ' filter-btn--active' : ''}`}
                  style={{ '--tag-c': hashColor(tag) }}
                  onClick={() => { setTagFilter(tag); setQuery('') }}
                >
                  {tag}
                </button>
              ))}
            </div>
          )}
        </>
      )}

      {!loading && !error && heroPost && (
        <div className="hero-post-wrap">
          <HeroPostCard post={heroPost} onOpen={setActivePost} />
        </div>
      )}

      <div className="blog-grid">
        {loading && Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="post-card post-card--skeleton"
            style={{ animationDelay: `${i * 0.06}s` }} />
        ))}

        {!loading && !error && filtered.map((post, i) => {
          const firstTagColor = post.tags?.[0] ? hashColor(post.tags[0].name) : '#444'
          return (
            <article
              key={post.id}
              className="post-card"
              style={{ '--tag-c': firstTagColor, animationDelay: `${0.08 + i * 0.07}s` }}
              onClick={() => setActivePost(post)}
              role="button"
              tabIndex={0}
              onKeyDown={e => e.key === 'Enter' && setActivePost(post)}
            >
              {post.coverImage?.url && (
                <div className="post-cover">
                  <img src={post.coverImage.url} alt={post.title} loading="lazy" />
                </div>
              )}
              <div className="post-body">
                {post.tags?.length > 0 && (
                  <div className="post-tags">
                    {post.tags.slice(0, 3).map(t => (
                      <span
                        key={t.name}
                        className="post-tag"
                        style={{ '--tag-c': hashColor(t.name) }}
                      >
                        {t.name}
                      </span>
                    ))}
                  </div>
                )}
                <h3 className="post-title">{post.title}</h3>
                <p className="post-brief">{post.brief}</p>
                <div className="post-meta">
                  <span className="post-date">{fmtDate(post.publishedAt)}</span>
                  <span className="post-read">{post.readTimeInMinutes} min</span>
                </div>
              </div>
            </article>
          )
        })}

        {!loading && !error && filtered.length === 0 && posts.length > 0 && (
          <p className="blog-empty">Nessun risultato per "{query || tagFilter}".</p>
        )}

        {!loading && error && (
          <p className="blog-error">{error}</p>
        )}
      </div>

      {activePost && (
        <BlogPostModal post={activePost} onClose={() => setActivePost(null)} />
      )}

    </div>
  )
}

export default BlogView
