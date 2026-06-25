import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import '../css/blogpostmodal.css'
import { HiXMark } from 'react-icons/hi2'

const BLOG_BASE = import.meta.env.VITE_BLOG_URL ?? ''

const fmtDate = iso =>
  new Date(iso).toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' })

const BlogPostModal = ({ post, onClose }) => {
  useEffect(() => {
    const onKey = e => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  const postUrl    = `${BLOG_BASE}/${post.slug}`
  const hasCover   = !!post.coverImage?.url

  const tagsMeta = (
    <>
      {post.tags?.length > 0 && (
        <div className="bpm-tags">
          {post.tags.map(t => (
            <span key={t.name} className="post-tag">{t.name}</span>
          ))}
        </div>
      )}
      <h2 className="bpm-title">{post.title}</h2>
      <div className="bpm-info">
        <span>{fmtDate(post.publishedAt)}</span>
        <span>·</span>
        <span>{post.readTimeInMinutes} min di lettura</span>
      </div>
    </>
  )

  return createPortal(
    <div className="bpm-overlay" onClick={onClose}>
      <div className="bpm-card" onClick={e => e.stopPropagation()}>
      <div className="bpm-scroll">

        {hasCover ? (
          /* ── Hero con immagine + gradiente + titolo sovrapposto ── */
          <div className="bpm-hero">
            <img className="bpm-hero-img" src={post.coverImage.url} alt={post.title} />
            <div className="bpm-hero-gradient" />
            <button className="bpm-close bpm-close--hero" onClick={onClose} aria-label="Chiudi">
              <HiXMark />
            </button>
            <div className="bpm-hero-meta">
              {tagsMeta}
            </div>
          </div>
        ) : (
          /* ── Header testuale senza cover ── */
          <div className="bpm-header">
            <div className="bpm-header-meta">{tagsMeta}</div>
            <button className="bpm-close" onClick={onClose} aria-label="Chiudi">
              <HiXMark />
            </button>
          </div>
        )}

        <div className="bpm-body">
          {post.content
            ? <div className="bpm-content" dangerouslySetInnerHTML={{ __html: post.content }} />
            : (
              <div className="bpm-no-content">
                <p className="bpm-brief">{post.brief}</p>
                <a
                  className="bpm-external-cta"
                  href={postUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Leggi l'articolo completo →
                </a>
              </div>
            )
          }
        </div>

      </div>
      </div>
    </div>,
    document.body
  )
}

export default BlogPostModal
