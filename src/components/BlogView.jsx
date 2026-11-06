import { useEffect, useState, useMemo } from 'react'
import '../css/blog.css'
import BlogPostModal from './BlogPostModal.jsx'
import { useData } from '../context/DataContext.jsx'
import { useReveal } from '../lib/useReveal.js'
import { useText } from '../lib/uiText.js'
import { HiMagnifyingGlass, HiXMark } from 'react-icons/hi2'
import { PostShowCard } from './ShowCards.jsx'
import { hashColor } from './DashShared.jsx'

const BlogView = () => {
  const { t, postTitle, postBrief } = useText()
  const { posts, postsLoading: loading, postsError: error, fetchPosts } = useData()
  const [activePost, setActivePost] = useState(null)
  const [query,      setQuery]      = useState('')
  const [tagFilter,  setTagFilter]  = useState('all')

  useEffect(() => { fetchPosts() }, [fetchPosts])

  const q = query.trim().toLowerCase()

  const byQuery = useMemo(() => posts.filter(p => !q || (
    postTitle(p).toLowerCase().includes(q) ||
    postBrief(p).toLowerCase().includes(q) ||
    p.tags?.some(t => t.name.toLowerCase().includes(q))
  )), [posts, q, postTitle, postBrief])

  const allTags = useMemo(() => {
    const seen = new Set()
    byQuery.forEach(p => p.tags?.forEach(t => seen.add(t.name)))
    return Array.from(seen)
  }, [byQuery])

  useEffect(() => {
    if (tagFilter !== 'all' && !allTags.includes(tagFilter)) setTagFilter('all')
  }, [allTags, tagFilter])

  const filtering = tagFilter !== 'all' || q !== ''
  const heroPost = !filtering ? (posts[0] ?? null) : null

  const filtered = useMemo(() => byQuery.filter(p => {
    if (heroPost && p.id === heroPost.id) return false
    return tagFilter === 'all' || p.tags?.some(t => t.name === tagFilter)
  }), [byQuery, tagFilter, heroPost])

  const rootRef = useReveal(`${loading}${filtered.map(p => p.id).join()}`, 0.4)

  return (
    <div className="blog" ref={rootRef}>

      <section className="blog-intro">
        <span className="section-eyebrow">{t('blog.eyebrow')}</span>
        <h2 className="blog-title">Blog</h2>
        <p className="blog-sub">
          {t('blog.sub')}
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
                placeholder={t('blog.search')}
                value={query}
                onChange={e => { setQuery(e.target.value); setTagFilter('all') }}
              />
              {query && (
                <button type="button" className="view-search-clear" aria-label={t('common.clear')} onClick={() => setQuery('')}>
                  <HiXMark />
                </button>
              )}
            </div>
            {(query || tagFilter !== 'all') && (
              <span className="view-filter-count">{t('common.results', { n: filtered.length })}</span>
            )}
          </div>

          {allTags.length > 0 && (
            <div className="view-tag-pills">
              <button
                className={`filter-btn${tagFilter === 'all' ? ' filter-btn--active' : ''}`}
                onClick={() => setTagFilter('all')}
              >
                {t('common.all')}
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
        <div className="ds ds--embed">
          <div className="ds-grid ds-grid--one">
            <PostShowCard
              post={heroPost}
              onOpen={setActivePost}
              accent={heroPost.tags?.[0] ? hashColor(heroPost.tags[0].name) : undefined}
              lazy
            />
          </div>
        </div>
      )}

      {!loading && (error || filtered.length === 0) && <div className="blog-grid">
        {!loading && !error && filtered.length === 0 && posts.length > 0 && (
          <p className="blog-empty">{t('common.noResults', { q: query || tagFilter })}</p>
        )}

        {!loading && error && (
          <p className="blog-error">{t(error)}</p>
        )}
      </div>}

      {!loading && !error && filtered.length > 0 && (
        <div className="ds ds--embed">
          <div className="ds-grid">
            {filtered.map((post, i) => (
              <PostShowCard
                key={post.id}
                post={post}
                onOpen={setActivePost}
                dd={`${(i % 2) * 0.12}s`}
                accent={post.tags?.[0] ? hashColor(post.tags[0].name) : undefined}
                lazy
              />
            ))}
          </div>
        </div>
      )}

      {activePost && (
        <BlogPostModal post={activePost} onClose={() => setActivePost(null)} />
      )}

    </div>
  )
}

export default BlogView
