import { useEffect, useRef, useState } from 'react'
import { GoStar, GoRepoForked, GoRepo, GoTag, GoFile, GoFileDirectory, GoGitCommit } from 'react-icons/go'
import { TbArticle, TbCalendar, TbClock, TbHash } from 'react-icons/tb'
import '../css/dashshowcase.css'
import { useText } from '../lib/uiText.js'
import { themed } from '../lib/themed.js'
import { prefersReducedMotion } from '../lib/intro.js'
import SitePill from './SitePill.jsx'
import { Head, LangIcon, Pill, fmtDate, langAccent, hashColor } from './DashShared.jsx'

const BLOG_URL = import.meta.env.VITE_BLOG_URL

const activate = (e, fn) => { if (e.key === 'Enter') fn() }

const useSeen = lazy => {
  const ref = useRef(null)
  const [seen, setSeen] = useState(() => !lazy || prefersReducedMotion() || typeof IntersectionObserver === 'undefined')
  useEffect(() => {
    const el = ref.current
    if (seen || !el) return undefined
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setSeen(true); io.disconnect() }
    }, { threshold: 0.2, rootMargin: '0px 0px -6% 0px' })
    io.observe(el)
    return () => io.disconnect()
  }, [seen])
  return [ref, seen]
}

const RepoVisual = ({ repo, image, color }) => {
  const [failed, setFailed] = useState(false)
  return (
    <div className="ds-visual" style={{ '--lang-color': color }}>
      {image && !failed
        ? <img className="ds-visual-img" src={image} alt="" loading="lazy" onError={() => setFailed(true)} />
        : <GoRepo className="ds-visual-mark" aria-hidden="true" />}
    </div>
  )
}

const PostVisual = ({ post, title }) => {
  const [failed, setFailed] = useState(false)
  const url = post.coverImage?.url
  return (
    <div className="ds-visual">
      {url && !failed
        ? <img className="ds-visual-img ds-visual-img--cover" src={url} alt={title} loading="lazy" onError={() => setFailed(true)} />
        : <TbArticle className="ds-visual-mark" aria-hidden="true" />}
    </div>
  )
}

const Preview = ({ title, image, cover, Icon, color, cta }) => (
  <div className={`ds-preview ds-preview--side${cover ? ' ds-preview--cover' : ''}`} style={{ '--lang-color': color }} aria-hidden="true">
    {image
      ? <img className="ds-preview-img" src={image} alt="" onError={e => { e.currentTarget.style.display = 'none' }} />
      : <Icon className="ds-preview-mark" />}
    <div className="ds-preview-cap">
      <span className="ds-preview-title">{title}</span>
      <span className="ds-preview-cta">{cta}</span>
    </div>
  </div>
)

const RepoPeek = ({ repo }) => {
  const { t } = useText()
  const dash = repo.dash
  if (!dash) return null
  const langs = Object.entries(dash.languages ?? {})
  const total = langs.reduce((a, [, b]) => a + b, 0)
  const files = (dash.contents ?? []).slice(0, 6)
  const commits = (dash.commits ?? []).slice(0, 2)
  return (
    <div className="ds-peek" aria-hidden="true">
      {total > 0 && (
        <div className="ds-peek-block" style={{ '--pk': 0 }}>
          <span className="ds-peek-title">{t('repo.languages')}</span>
          <div className="ds-peek-bar">
            {langs.map(([lang, bytes]) => (
              <i key={lang} style={{ width: `${(bytes / total * 100).toFixed(1)}%`, background: langAccent(lang) }} />
            ))}
          </div>
          <div className="ds-peek-legend">
            {langs.slice(0, 3).map(([lang, bytes]) => (
              <span key={lang}><LangIcon lang={lang} />{lang}<b>{(bytes / total * 100).toFixed(1)}%</b></span>
            ))}
          </div>
        </div>
      )}
      {files.length > 0 && (
        <div className="ds-peek-block" style={{ '--pk': 1 }}>
          <span className="ds-peek-title">{t('repo.files')}</span>
          <div className="ds-peek-files">
            {files.map(f => (
              <span key={f.sha}>
                {f.type === 'dir' ? <GoFileDirectory className="is-dir" /> : <GoFile />}
                {f.name}
              </span>
            ))}
          </div>
        </div>
      )}
      {commits.length > 0 && (
        <div className="ds-peek-block" style={{ '--pk': 2 }}>
          <span className="ds-peek-title">{t('repo.commits')}</span>
          {commits.map(c => (
            <span key={c.sha} className="ds-peek-commit">
              <GoGitCommit />
              <span>{c.commit.message.split('\n')[0]}</span>
            </span>
          ))}
        </div>
      )}
    </div>
  )
}


export const RepoShowCard = ({ repo, image, loading, onOpen, dd = '0s', accent, label, lazy }) => {
  const { t, repoDesc } = useText()
  const [ref, seen] = useSeen(lazy)
  const color = langAccent(repo?.language, repo?.name ?? '')
  return (
    <div
      ref={ref}
      className={`ds-card${seen ? '' : ' is-wait'}`}
      style={{ '--dd': dd, '--card-accent': accent ?? themed('#FB923C') }}
      onClick={() => repo && onOpen(repo)}
      role={repo ? 'button' : undefined}
      tabIndex={repo ? 0 : undefined}
      onKeyDown={e => repo && activate(e, () => onOpen(repo))}
    >
      <div className="ds-main">
        {label && <Head icon={GoRepo} label={label} />}
        {loading && <div className="ds-skeleton" />}
        {!loading && repo && (
          <>
            <h3 className="ds-title" style={{ '--si': 0 }}>{repo.name}</h3>
            {repo.language && (
              <div className="ds-lang" style={{ '--si': 1 }}>
                <LangIcon lang={repo.language} />
                <span>{repo.language}</span>
              </div>
            )}
            {repo.description && <p className="ds-desc" style={{ '--si': 2 }}>{repoDesc(repo)}</p>}
            <div className="ds-foot" style={{ '--si': 3 }}>
              <div className="ds-pills">
                <Pill icon={GoStar} color={themed('#FBBF24')}>{repo.stargazers_count}</Pill>
                <Pill icon={GoRepoForked} color={themed('#22D3EE')}>{repo.forks_count}</Pill>
                {repo.topics?.slice(0, 3).map(tp => (
                  <Pill key={tp} icon={TbHash} color={themed('#4493f8')}>{tp}</Pill>
                ))}
              </div>
              <a
                className="ds-cta"
                href={repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={e => e.stopPropagation()}
              >
                {t('dash.projectCta')}
              </a>
            </div>
          </>
        )}
      </div>
      {repo && <RepoVisual repo={repo} image={image} color={color} />}
      {repo && <RepoPeek repo={repo} />}
      {repo?.pagesUrl && <div className="site-corner"><SitePill url={repo.pagesUrl} /></div>}
      {repo?.pagesUrl && <div className="site-under" aria-hidden="true"><SitePill url={repo.pagesUrl} /></div>}
    </div>
  )
}

export const PostShowCard = ({ post, loading, error, onOpen, dd = '0s', accent, label, lazy }) => {
  const { t, locale, postTitle, postBrief } = useText()
  const [ref, seen] = useSeen(lazy)
  const tone = accent ?? themed('#818CF8')
  return (
    <div
      ref={ref}
      className={`ds-card ds-card--post${seen ? '' : ' is-wait'}`}
      style={{ '--dd': dd, '--card-accent': tone }}
      onClick={() => post && onOpen(post)}
      role={post ? 'button' : undefined}
      tabIndex={post ? 0 : undefined}
      onKeyDown={e => post && activate(e, () => onOpen(post))}
    >
      <div className="ds-main">
        {label && <Head icon={TbArticle} label={label} />}
        {loading && <div className="ds-skeleton" />}
        {!loading && error && <p className="ds-error">{t(error)}</p>}
        {!loading && !error && post && (
          <>
            <h3 className="ds-title" style={{ '--si': 0 }}>{postTitle(post)}</h3>
            <p className="ds-desc" style={{ '--si': 2 }}>{postBrief(post)}</p>
            <div className="ds-foot" style={{ '--si': 3 }}>
              <div className="ds-pills">
                {post.tags?.slice(0, 4).map(tg => (
                  <Pill key={tg.name} icon={GoTag} color={hashColor(tg.name)}>{tg.name}</Pill>
                ))}
                <Pill icon={TbCalendar} color={themed('#FB923C')}>{fmtDate(post.publishedAt, locale)}</Pill>
                <Pill icon={TbClock} color={themed('#4ADE80')}>{post.readTimeInMinutes} {t('common.min')}</Pill>
              </div>
              <a
                className="ds-cta"
                href={`${BLOG_URL}/${post.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={e => e.stopPropagation()}
              >
                {t('dash.articleCta')}
              </a>
            </div>
          </>
        )}
      </div>
      {post && <PostVisual post={post} title={postTitle(post)} />}
      {post && (
        <div className="ds-corner-meta" aria-hidden="true">
          <Pill icon={TbCalendar} color={themed('#FB923C')}>{fmtDate(post.publishedAt, locale)}</Pill>
          <Pill icon={TbClock} color={themed('#4ADE80')}>{post.readTimeInMinutes} {t('common.min')}</Pill>
        </div>
      )}
      {post && <Preview title={postTitle(post)} image={post.coverImage?.url} cover Icon={TbArticle} color={tone} cta={t('dash.preview')} />}
    </div>
  )
}
