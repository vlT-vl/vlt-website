import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import '../css/repomodal.css'
import { HiXMark } from 'react-icons/hi2'
import { SiGithub, SiGo, SiJavascript, SiTypescript, SiPython, SiGnubash, SiCss, SiHtml5, SiVuedotjs, SiRust, SiCplusplus } from 'react-icons/si'
import { TbBrandPowershell } from 'react-icons/tb'
import { GoStar, GoRepoForked, GoEye, GoFile, GoFileDirectory, GoGitCommit, GoTag, GoRepo } from 'react-icons/go'
import { FaScaleBalanced } from 'react-icons/fa6'
import { useData } from '../context/DataContext.jsx'

const LANG_COLORS = {
  Go:          '#22D3EE',
  JavaScript:  '#FBBF24',
  TypeScript:  '#3B82F6',
  Python:      '#A78BFA',
  Shell:       '#4ADE80',
  CSS:         '#FB7185',
  HTML:        '#F97316',
  Vue:         '#2DD4BF',
  Rust:        '#94A3B8',
  'C++':       '#E879F9',
  PowerShell:  '#3B78E7',
}

const LANG_ICONS = {
  Go: SiGo, JavaScript: SiJavascript, TypeScript: SiTypescript,
  Python: SiPython, Shell: SiGnubash, CSS: SiCss,
  HTML: SiHtml5, Vue: SiVuedotjs, Rust: SiRust, 'C++': SiCplusplus,
  PowerShell: TbBrandPowershell,
}

const LangIcon = ({ lang, cls }) => {
  const Icon = LANG_ICONS[lang]
  const color = LANG_COLORS[lang] ?? '#888'
  return Icon ? <Icon className={cls} style={{ color }} /> : null
}

const timeAgo = iso => {
  const diff = Date.now() - new Date(iso)
  const m = Math.floor(diff / 60000)
  if (m < 1)   return 'adesso'
  if (m < 60)  return `${m}m fa`
  const h = Math.floor(m / 60)
  if (h < 24)  return `${h}h fa`
  const d = Math.floor(h / 24)
  if (d < 7)   return `${d}g fa`
  const w = Math.floor(d / 7)
  if (w < 5)   return `${w}w fa`
  const mo = Math.floor(d / 30)
  if (mo < 12) return `${mo} mesi fa`
  return `${Math.floor(d / 365)}a fa`
}

const fmtSize = kb => kb < 1024 ? `${kb} KB` : `${(kb / 1024).toFixed(1)} MB`

const RepoModal = ({ repo, image, onClose }) => {
  const { fetchRepoDash, fetchReadme } = useData()

  const [activeTab,     setActiveTab]    = useState('readme')
  const [readme,        setReadme]       = useState(null)
  const [readmeLoading, setReadmeLoading] = useState(true)
  const [dash,          setDash]         = useState(null)
  const [dashLoading,   setDashLoading]  = useState(false)

  /* Keydown + body lock + README fetch (default tab) */
  useEffect(() => {
    const onKey = e => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'

    fetchReadme(repo).then(html => {
      setReadme(html)
      setReadmeLoading(false)
    })

    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose, repo, fetchReadme])

  /* Lazy-load dashboard only when the Dettagli tab is opened */
  useEffect(() => {
    if (activeTab !== 'dash' || dash !== null || dashLoading) return
    setDashLoading(true)
    fetchRepoDash(repo).then(d => {
      setDash(d)
      setDashLoading(false)
    })
  }, [activeTab, dash, dashLoading, repo, fetchRepoDash])

  const totalBytes = dash
    ? Object.values(dash.languages).reduce((a, b) => a + b, 0)
    : 0

  return createPortal(
    <div className="rmo-overlay" onClick={onClose}>
      <div className="rmo-card" onClick={e => e.stopPropagation()}>
      <div className="rmo-scroll">

        {/* ── Header ── */}
        <div className="rmo-header">
          <div className="rmo-header-img-group">
            <div className="rmo-repo-img">
              <GoRepo className="rmo-repo-img-icon" />
              {image && (
                <img
                  className="rmo-repo-img-photo"
                  src={image}
                  alt=""
                  onError={e => { e.currentTarget.style.display = 'none' }}
                />
              )}
            </div>
            <div className="rmo-header-info">
              <div className="rmo-title-row">
                <h2 className="rmo-repo-name">{repo.name}</h2>
                {repo.language && (
                  <span className="rmo-lang-badge">
                    <LangIcon lang={repo.language} cls="rmo-lang-icon" />
                    {repo.language}
                  </span>
                )}
              </div>
              {repo.description && (
                <p className="rmo-repo-desc">{repo.description}</p>
              )}
            </div>
          </div>
          <div className="rmo-actions">
            <a className="rmo-gh-btn"
              href={repo.html_url}
              target="_blank" rel="noopener noreferrer"
              onClick={e => e.stopPropagation()}
              aria-label="Vedi su GitHub">
              <SiGithub />
            </a>
            <button className="rmo-close" onClick={onClose} aria-label="Chiudi">
              <HiXMark />
            </button>
          </div>
        </div>

        {/* ── Stats bar ── */}
        <div className="rmo-stats-bar">
          <span className="rmo-stat-item"><GoStar /> {repo.stargazers_count}</span>
          <span className="rmo-stat-sep">·</span>
          <span className="rmo-stat-item"><GoRepoForked /> {repo.forks_count}</span>
          <span className="rmo-stat-sep">·</span>
          <span className="rmo-stat-item"><GoEye /> {repo.watchers_count}</span>
          <span className="rmo-stat-sep">·</span>
          <span className="rmo-stat-item">{fmtSize(repo.size)}</span>
          {repo.license && (
            <>
              <span className="rmo-stat-sep">·</span>
              <span className="rmo-stat-item">
                <FaScaleBalanced /> {repo.license.spdx_id === 'NOASSERTION' ? 'Proprietary License' : (repo.license.spdx_id || repo.license.name)}
              </span>
            </>
          )}
        </div>

        {/* ── Topics ── */}
        {repo.topics?.length > 0 && (
          <div className="rmo-topics">
            {repo.topics.map(t => (
              <span key={t} className="rmo-topic">{t}</span>
            ))}
          </div>
        )}

        {/* ── Tab bar ── */}
        <div className="rmo-tabs">
          <button
            className={`rmo-tab${activeTab === 'readme' ? ' rmo-tab--active' : ''}`}
            onClick={() => setActiveTab('readme')}
          >
            README
          </button>
          <button
            className={`rmo-tab${activeTab === 'dash' ? ' rmo-tab--active' : ''}`}
            onClick={() => setActiveTab('dash')}
          >
            Dettagli
          </button>
        </div>

        {/* ── README tab ── */}
        {activeTab === 'readme' && (
          <div className="rmo-body">
            {readmeLoading
              ? <div className="rmo-loading"><div className="rmo-spinner" /></div>
              : readme
                ? <div className="rmo-readme" dangerouslySetInnerHTML={{ __html: readme }} />
                : <p className="rmo-readme-empty">README non disponibile per questo repository.</p>
            }
          </div>
        )}

        {/* ── Dettagli tab ── */}
        {activeTab === 'dash' && (
          <div className="rmo-body">
            {dashLoading
              ? <div className="rmo-loading"><div className="rmo-spinner" /></div>
              : dash
                ? <>
                    {/* Languages */}
                    {totalBytes > 0 && (
                      <section className="rmo-section">
                        <h3 className="rmo-section-title">Linguaggi</h3>
                        <div className="rmo-lang-bar">
                          {Object.entries(dash.languages).map(([lang, bytes]) => (
                            <div key={lang} className="rmo-lang-seg"
                              style={{
                                width: `${(bytes / totalBytes * 100).toFixed(1)}%`,
                                background: LANG_COLORS[lang] ?? '#555',
                              }}
                              title={`${lang} ${(bytes / totalBytes * 100).toFixed(1)}%`}
                            />
                          ))}
                        </div>
                        <div className="rmo-lang-legend">
                          {Object.entries(dash.languages).map(([lang, bytes]) => (
                            <span key={lang} className="rmo-lang-item">
                              <LangIcon lang={lang} cls="rmo-lang-icon" />
                              {lang}
                              <span className="rmo-lang-pct">
                                {(bytes / totalBytes * 100).toFixed(1)}%
                              </span>
                            </span>
                          ))}
                        </div>
                      </section>
                    )}

                    {/* File tree */}
                    {dash.contents.length > 0 && (
                      <section className="rmo-section">
                        <h3 className="rmo-section-title">File</h3>
                        <div className="rmo-files">
                          {dash.contents.map(f => (
                            <a key={f.sha} className="rmo-file-row"
                              href={f.html_url}
                              target="_blank" rel="noopener noreferrer"
                              onClick={e => e.stopPropagation()}>
                              {f.type === 'dir'
                                ? <GoFileDirectory className="rmo-file-icon rmo-file-dir" />
                                : <GoFile className="rmo-file-icon" />}
                              <span className="rmo-file-name">{f.name}</span>
                            </a>
                          ))}
                        </div>
                      </section>
                    )}

                    {/* Commits */}
                    {dash.commits.length > 0 && (
                      <section className="rmo-section">
                        <h3 className="rmo-section-title">Commit recenti</h3>
                        <div className="rmo-commits">
                          {dash.commits.map(c => (
                            <a key={c.sha} className="rmo-commit-row"
                              href={c.html_url}
                              target="_blank" rel="noopener noreferrer"
                              onClick={e => e.stopPropagation()}>
                              <GoGitCommit className="rmo-commit-icon" />
                              <div className="rmo-commit-content">
                                <span className="rmo-commit-msg">
                                  {c.commit.message.split('\n')[0]}
                                </span>
                                <span className="rmo-commit-meta">
                                  <span className="rmo-commit-author">
                                    {c.commit?.author?.name ?? c.commit?.committer?.name ?? '—'}
                                  </span>
                                  <span className="rmo-commit-dot">·</span>
                                  <span className="rmo-commit-time">
                                    {timeAgo(c.commit?.author?.date ?? c.commit?.committer?.date)}
                                  </span>
                                  <span className="rmo-commit-sha">{c.sha.slice(0, 7)}</span>
                                </span>
                              </div>
                            </a>
                          ))}
                        </div>
                      </section>
                    )}

                    {/* Latest release */}
                    {dash.release && (
                      <section className="rmo-section">
                        <h3 className="rmo-section-title">Ultima release</h3>
                        <a className="rmo-release"
                          href={dash.release.html_url}
                          target="_blank" rel="noopener noreferrer"
                          onClick={e => e.stopPropagation()}>
                          <GoTag className="rmo-release-icon" />
                          <span className="rmo-release-tag">{dash.release.tag_name}</span>
                          {dash.release.name && dash.release.name !== dash.release.tag_name && (
                            <span className="rmo-release-name">{dash.release.name}</span>
                          )}
                          <span className="rmo-release-time">
                            {timeAgo(dash.release.published_at)}
                          </span>
                        </a>
                      </section>
                    )}
                  </>
                : null
            }
          </div>
        )}

      </div>
      </div>
    </div>,
    document.body
  )
}

export default RepoModal
