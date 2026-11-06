import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import '../css/blogpostmodal.css'
import '../css/modalmotion.css'
import { HiXMark } from 'react-icons/hi2'
import { useText } from '../lib/uiText.js'

const BLOG_BASE = import.meta.env.VITE_BLOG_URL ?? ''

const fmtDate = (iso, locale) =>
  new Date(iso).toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' })

const BlogPostModal = ({ post, onClose }) => {
  const { t, locale, postTitle, postBrief } = useText()
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
          {post.tags.map(tag => (
            <span key={tag.name} className="post-tag">{tag.name}</span>
          ))}
        </div>
      )}
      <h2 className="bpm-title">{postTitle(post)}</h2>
      <div className="bpm-info">
        <span>{fmtDate(post.publishedAt, locale)}</span>
        <span>·</span>
        <span>{t('post.readTime', { n: post.readTimeInMinutes })}</span>
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
            <img className="bpm-hero-img" src={post.coverImage.url} alt={postTitle(post)} />
            <div className="bpm-hero-gradient" />
            <button className="bpm-close bpm-close--hero" onClick={onClose} aria-label={t('common.close')}>
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
            <button className="bpm-close" onClick={onClose} aria-label={t('common.close')}>
              <HiXMark />
            </button>
          </div>
        )}

        <div className="bpm-body">
          {post.content
            ? <div className="bpm-content" dangerouslySetInnerHTML={{ __html: post.content }} />
            : (
              <div className="bpm-no-content">
                <p className="bpm-brief">{postBrief(post)}</p>
                <a
                  className="bpm-external-cta"
                  href={postUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t('post.readFull')}
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
