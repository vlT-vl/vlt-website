import { useState, useMemo } from 'react'
import '../css/projects.css'
import RepoModal from './RepoModal.jsx'
import LicenseModal from './LicenseModal.jsx'
import { GoStar, GoRepoForked, GoRepo } from 'react-icons/go'
import { FaScaleBalanced } from 'react-icons/fa6'
import { HiMagnifyingGlass } from 'react-icons/hi2'
import { SiGithub, SiGo, SiJavascript, SiTypescript, SiPython, SiGnubash, SiCss, SiHtml5, SiVuedotjs, SiRust, SiCplusplus } from 'react-icons/si'
import { TbBrandPowershell } from 'react-icons/tb'
import { useData } from '../context/DataContext.jsx'

const GITHUB_USER = import.meta.env.VITE_GITHUB_USER

const LANG_COLORS = {
  Go:          '#22D3EE',
  JavaScript:  '#FBBF24',
  TypeScript:  '#3B82F6',
  Python:      '#A78BFA',
  Shell:       '#4ADE80',
  CSS:         '#FB7185',
  HTML:        '#F97316',
  Vue:         '#2DD4BF',
  Rust:        '#F97316',
  'C++':       '#E879F9',
  PowerShell:  '#38BDF8',
}

const ACCENT_PALETTE = [
  '#F43F5E', '#FB923C', '#FACC15', '#4ADE80',
  '#22D3EE', '#818CF8', '#E879F9', '#2DD4BF',
]

const langAccent = (lang, name = '') => {
  if (lang && LANG_COLORS[lang]) return LANG_COLORS[lang]
  const hash = [...name].reduce((a, c) => a + c.charCodeAt(0), 0)
  return ACCENT_PALETTE[hash % ACCENT_PALETTE.length]
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

const HeroRepoCard = ({ repo, image, onOpen }) => (
  <article
    className="hero-repo-card"
    style={{ '--lang-color': langAccent(repo.language, repo.name) }}
    onClick={() => onOpen(repo)}
    role="button"
    tabIndex={0}
    onKeyDown={e => e.key === 'Enter' && onOpen(repo)}
  >
    <div className="hero-repo-top">
      <div className="hero-repo-img">
        <GoRepo className="hero-repo-img-icon" />
        {image && (
          <img
            className="hero-repo-img-photo"
            src={image}
            alt=""
            loading="lazy"
            onError={e => { e.currentTarget.style.display = 'none' }}
          />
        )}
      </div>
      <div className="hero-repo-info">
        <div className="hero-repo-name-row">
          <span className="hero-repo-name">{repo.name}</span>
          {repo.language && (
            <span className="hero-repo-lang">
              <LangIcon lang={repo.language} cls="hero-repo-lang-icon" />
              {repo.language}
            </span>
          )}
        </div>
        {repo.description && <p className="hero-repo-desc">{repo.description}</p>}
      </div>
      <a
        className="hero-repo-gh"
        href={repo.html_url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={e => e.stopPropagation()}
        aria-label={`Apri ${repo.name} su GitHub`}
      >
        <SiGithub />
      </a>
    </div>

    {repo.topics?.length > 0 && (
      <div className="hero-repo-topics">
        {repo.topics.slice(0, 6).map(t => (
          <span key={t} className="hero-repo-topic">{t}</span>
        ))}
      </div>
    )}

    <div className="hero-repo-footer">
      <div className="hero-repo-stats">
        <span className="hero-repo-stat"><GoStar /> {repo.stargazers_count}</span>
        <span className="hero-repo-stat"><GoRepoForked /> {repo.forks_count}</span>
      </div>
      <span className="hero-repo-cta">Dettagli progetto →</span>
    </div>
  </article>
)

const RepoCard = ({ repo, onOpen, onLicense, image }) => (
  <article
    className="repo-card"
    style={{ '--lang-color': langAccent(repo.language, repo.name) }}
    onClick={() => onOpen(repo)}
    role="button"
    tabIndex={0}
    onKeyDown={e => e.key === 'Enter' && onOpen(repo)}
  >
    <div className="repo-card-body">
      <div className="repo-card-top">

        <div className="repo-card-title-row">
          <div className="repo-card-name-group">
            <div className="repo-card-img">
              <GoRepo className="repo-card-img-icon" />
              {image && (
                <img
                  className="repo-card-img-photo"
                  src={image}
                  alt=""
                  loading="lazy"
                  onError={e => { e.currentTarget.style.display = 'none' }}
                />
              )}
            </div>
            <span className="repo-name">{repo.name}</span>
          </div>
          <a
            className="repo-gh-link"
            href={repo.html_url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={e => e.stopPropagation()}
            aria-label={`Apri ${repo.name} su GitHub`}
          >
            <SiGithub />
          </a>
        </div>

        {repo.description && (
          <p className="repo-desc">{repo.description}</p>
        )}

        <div className="repo-meta">
          {repo.language && (
            <span className="repo-lang">
              <LangIcon lang={repo.language} cls="repo-lang-icon" />
              {repo.language}
            </span>
          )}
          <span className="repo-stat"><GoStar /> {repo.stargazers_count}</span>
          <span className="repo-stat"><GoRepoForked /> {repo.forks_count}</span>
        </div>

        {repo.topics?.length > 0 && (
          <div className="repo-topics">
            {repo.topics.slice(0, 4).map(t => (
              <span key={t} className="repo-topic">{t}</span>
            ))}
          </div>
        )}
      </div>

      <div className="repo-license-row">
        <span className="repo-license-label">
          <FaScaleBalanced className="repo-license-icon" />
          License
        </span>
        {repo.license
          ? <button
              className="repo-license-pill"
              onClick={e => { e.stopPropagation(); onLicense(repo) }}
            >
              {repo.license.spdx_id === 'NOASSERTION' ? 'Proprietary License' : (repo.license.spdx_id || repo.license.name)}
            </button>
          : <span className="repo-license-none">Non specificata</span>
        }
      </div>
    </div>
  </article>
)

const ProjectsView = () => {
  const { repos, repoImages, reposLoading: loading, reposError: error } = useData()
  const [activeRepo,    setActiveRepo]    = useState(null)
  const [activeLicense, setActiveLicense] = useState(null)
  const [langFilter,    setLangFilter]    = useState('all')
  const [query,         setQuery]         = useState('')

  const languages = useMemo(() => [
    'all',
    ...Array.from(new Set(repos.map(r => r.language).filter(Boolean))),
  ], [repos])

  const heroRepo = repos[0] ?? null

  const filtered = useMemo(() => {
    const byLang = langFilter === 'all'
      ? repos
      : repos.filter(r => r.language === langFilter)
    const q = query.trim().toLowerCase()
    const withoutHero = byLang.filter(r => !heroRepo || r.id !== heroRepo.id)
    if (!q) return withoutHero
    return withoutHero.filter(r =>
      r.name.toLowerCase().includes(q) ||
      (r.description ?? '').toLowerCase().includes(q) ||
      r.topics?.some(t => t.toLowerCase().includes(q))
    )
  }, [repos, langFilter, query, heroRepo])

  return (
    <div className="projects">

      <section className="projects-intro">
        <span className="section-eyebrow">progetti</span>
        <h2 className="projects-title">Progetti & Repository</h2>
        <p className="projects-sub">
          Ogni progetto nasce da un problema concreto — CLI, API, desktop app e tool
          scritti per automatizzare, semplificare e durare nel tempo.
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
                placeholder="Cerca repo, descrizione, topic…"
                value={query}
                onChange={e => setQuery(e.target.value)}
              />
            </div>
            {query && (
              <span className="view-filter-count">{filtered.length} risultati</span>
            )}
          </div>

          {languages.length > 2 && (
            <div className="projects-filter">
              {languages.map(lang => (
                <button
                  key={lang}
                  className={`filter-btn${langFilter === lang ? ' filter-btn--active' : ''}`}
                  onClick={() => setLangFilter(lang)}
                >
                  {lang !== 'all' && <LangIcon lang={lang} cls="filter-lang-icon" />}
                  {lang === 'all' ? 'Tutti' : lang}
                </button>
              ))}
            </div>
          )}
        </>
      )}

      {!loading && !error && heroRepo && (
        <div className="hero-repo-wrap">
          <HeroRepoCard
            repo={heroRepo}
            image={repoImages[heroRepo.name]}
            onOpen={setActiveRepo}
          />
        </div>
      )}

      {loading && (
        <div className="projects-grid">
          {[0, 1, 2, 3].map(i => (
            <div key={i} className="repo-card repo-card--skeleton"
              style={{ animationDelay: `${i * 0.1}s` }} />
          ))}
        </div>
      )}

      {!loading && !error && (
        <div className="projects-grid">
          {filtered.map(repo => (
            <RepoCard
              key={repo.id}
              repo={repo}
              image={repoImages[repo.name]}
              onOpen={setActiveRepo}
              onLicense={setActiveLicense}
            />
          ))}
          {filtered.length === 0 && repos.length > 0 && (
            <p className="projects-error" style={{ margin: 0 }}>
              Nessun risultato per "{query || langFilter}".
            </p>
          )}
        </div>
      )}

      {!loading && error && <p className="projects-error">{error}</p>}

      <section className="projects-cta">
        <p className="projects-cta-text">Tutti i repository pubblici su</p>
        <a className="projects-cta-link"
          href={`https://github.com/${GITHUB_USER}`}
          target="_blank" rel="noopener noreferrer">
          <SiGithub /> github.com/{GITHUB_USER} →
        </a>
      </section>

      {activeRepo    && <RepoModal     repo={activeRepo}    image={repoImages[activeRepo.name]} onClose={() => setActiveRepo(null)} />}
      {activeLicense && <LicenseModal  repo={activeLicense} onClose={() => setActiveLicense(null)} />}

    </div>
  )
}

export default ProjectsView
