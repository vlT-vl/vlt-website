import { useEffect, useState } from 'react'
import { GoRepo } from 'react-icons/go'
import { TbArticle } from 'react-icons/tb'
import { useText } from '../lib/uiText.js'
import { prefersReducedMotion } from '../lib/intro.js'
import { themed } from '../lib/themed.js'
import SitePill from './SitePill.jsx'
import RepoMark from './RepoMark.jsx'
import { Head, LangIcon, RepoThumb, fmtDate, useRotation } from './DashShared.jsx'

const slideState = (i, index, prev) => (i === index ? 'active' : i === prev ? 'out' : 'wait')

const Dots = ({ items, index, go, fill, label }) => (
  <div className="ds-dots" role="tablist">
    {items.map((it, i) => (
      <button
        key={it.key}
        type="button"
        role="tab"
        className="ds-dot"
        data-active={i === index ? 'true' : undefined}
        aria-label={`${label} ${it.title}`}
        aria-selected={i === index}
        onClick={e => { e.stopPropagation(); go(i) }}
      >
        <span className="ds-dot-fill" ref={i === index ? fill : null} />
      </button>
    ))}
  </div>
)

const MiniCarousel = ({ icon, label, accent, delay, items, renderSlide }) => {
  const { t } = useText()
  const { index, prev, go, fill, root, handlers } = useRotation(items.length, 6000)
  const [seen, setSeen] = useState(() => prefersReducedMotion() || typeof IntersectionObserver === 'undefined')
  const count = items.length
  useEffect(() => {
    const el = root.current
    if (seen || !el) return undefined
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setSeen(true); io.disconnect() }
    }, { threshold: 0.25, rootMargin: '0px 0px -8% 0px' })
    io.observe(el)
    return () => io.disconnect()
  }, [seen, count, root])
  if (!items.length) return null
  const siteUrl = items[index]?.repo?.pagesUrl
  return (
    <section
      ref={root}
      className={`ds-mini${seen ? '' : ' is-wait'}`}
      style={{ '--card-accent': accent, '--dd': delay }}
      aria-roledescription="carousel"
      aria-label={label}
      {...handlers}
    >
      <Head icon={icon} label={label} />
      {siteUrl && <div className="site-corner site-corner--mini" key={items[index].key}><SitePill url={siteUrl} /></div>}
      <div className="ds-mini-stage">
        {items.map((it, i) => {
          const state = slideState(i, index, prev)
          return (
            <div
              key={it.key}
              className="ds-slide"
              data-state={state}
              role="button"
              tabIndex={state === 'active' ? 0 : -1}
              aria-hidden={state !== 'active'}
              onClick={it.open}
              onKeyDown={e => e.key === 'Enter' && it.open()}
            >
              {renderSlide(it)}
            </div>
          )
        })}
      </div>
      {items.length > 1 && <Dots items={items} index={index} go={go} fill={fill} label={t('dash.goTo')} />}
    </section>
  )
}

const DashMini = ({ repos, repoImages, posts, onRepo, onPost }) => {
  const { t, locale, repoDesc, postTitle } = useText()
  const repoItems = repos.slice(1, 4).map(repo => ({
    key: repo.id, title: repo.name, repo, open: () => onRepo(repo),
  }))
  const postItems = posts.slice(1, 4).map(post => ({
    key: post.id, title: postTitle(post), post, open: () => onPost(post),
  }))
  return (
    <div className="ds-mini-row">
      <MiniCarousel
        icon={GoRepo}
        label={t('dash.moreProjects')}
        accent={themed('#FB923C')}
        delay="0s"
        items={repoItems}
        renderSlide={({ repo }) => (
          <>
            <RepoMark repo={repo} image={repoImages[repo.name]} />
            <RepoThumb repo={repo} image={repoImages[repo.name]} size="ds-thumb--md" />
            <div className="ds-slide-body">
              <div className="ds-slide-name">
                <span className="ds-slide-title">{repo.name}</span>
                {repo.language && <LangIcon lang={repo.language} />}
                {repo.language && <span className="ds-lang-text">{repo.language}</span>}
              </div>
              {repo.description && <p className="ds-slide-desc">{repoDesc(repo)}</p>}
              </div>
          </>
        )}
      />
      <MiniCarousel
        icon={TbArticle}
        label={t('dash.moreArticles')}
        accent={themed('#818CF8')}
        delay="0.2s"
        items={postItems}
        renderSlide={({ post }) => (
          <>
            {post.coverImage?.url && <RepoMark repo={{}} image={post.coverImage.url} />}
            <div className="ds-thumb ds-thumb--md ds-thumb--post">
              <TbArticle className="ds-thumb-icon" />
              {post.coverImage?.url && (
                <img className="ds-thumb-photo ds-thumb-photo--cover" src={post.coverImage.url} alt="" loading="lazy" />
              )}
            </div>
            <div className="ds-slide-body">
              <p className="ds-slide-title ds-slide-title--wrap">{postTitle(post)}</p>
              <div className="ds-slide-meta">
                <span>{fmtDate(post.publishedAt, locale)}</span>
                <span>·</span>
                <span>{post.readTimeInMinutes} {t('common.min')}</span>
              </div>
            </div>
          </>
        )}
      />
    </div>
  )
}

export default DashMini
