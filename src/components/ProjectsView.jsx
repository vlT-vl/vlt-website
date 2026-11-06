import { useState, useMemo, useEffect } from 'react'
import '../css/projects.css'
import RepoModal from './RepoModal.jsx'
import { HiMagnifyingGlass, HiXMark } from 'react-icons/hi2'
import { SiGithub, SiGo, SiJavascript, SiTypescript, SiPython, SiGnubash, SiCss, SiHtml5, SiVuedotjs, SiRust, SiCplusplus } from 'react-icons/si'
import { TbBrandPowershell } from 'react-icons/tb'
import { useData } from '../context/DataContext.jsx'
import { useReveal } from '../lib/useReveal.js'
import { RepoShowCard } from './ShowCards.jsx'
import { themed } from '../lib/themed.js'
import { useText } from '../lib/uiText.js'

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
  if (lang && LANG_COLORS[lang]) return themed(LANG_COLORS[lang])
  const hash = [...name].reduce((a, c) => a + c.charCodeAt(0), 0)
  return themed(ACCENT_PALETTE[hash % ACCENT_PALETTE.length])
}

const LANG_ICONS = {
  Go: SiGo, JavaScript: SiJavascript, TypeScript: SiTypescript,
  Python: SiPython, Shell: SiGnubash, CSS: SiCss,
  HTML: SiHtml5, Vue: SiVuedotjs, Rust: SiRust, 'C++': SiCplusplus,
  PowerShell: TbBrandPowershell,
}

const LangIcon = ({ lang, cls }) => {
  const Icon = LANG_ICONS[lang]
  const color = themed(LANG_COLORS[lang] ?? '#888')
  return Icon ? <Icon className={cls} style={{ color }} /> : null
}

const ProjectsView = () => {
  const { t, repoDesc } = useText()
  const { repos, repoImages, reposLoading: loading, reposError: error } = useData()
  const [activeRepo,    setActiveRepo]    = useState(null)
  const [langFilter,    setLangFilter]    = useState('all')
  const [query,         setQuery]         = useState('')

  const q = query.trim().toLowerCase()

  const byQuery = useMemo(() => repos.filter(r => !q || (
    r.name.toLowerCase().includes(q) ||
    (repoDesc(r) ?? '').toLowerCase().includes(q) ||
    r.topics?.some(t => t.toLowerCase().includes(q))
  )), [repos, q, repoDesc])

  const languages = useMemo(() => [
    'all',
    ...Array.from(new Set(byQuery.map(r => r.language).filter(Boolean))),
  ], [byQuery])

  useEffect(() => {
    if (langFilter !== 'all' && !languages.includes(langFilter)) setLangFilter('all')
  }, [languages, langFilter])

  const filtering = langFilter !== 'all' || q !== ''
  const heroRepo = !filtering ? (repos[0] ?? null) : null

  const filtered = useMemo(() => byQuery.filter(r => {
    if (heroRepo && r.id === heroRepo.id) return false
    return langFilter === 'all' || r.language === langFilter
  }), [byQuery, langFilter, heroRepo])

  const rootRef = useReveal(`${loading}${filtered.map(r => r.id).join()}`, 0.4)

  return (
    <div className="projects" ref={rootRef}>

      <section className="projects-intro">
        <span className="section-eyebrow">{t('projects.eyebrow')}</span>
        <h2 className="projects-title">{t('projects.title')}</h2>
        <p className="projects-sub">
          {t('projects.sub')}
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
                placeholder={t('projects.search')}
                value={query}
                onChange={e => setQuery(e.target.value)}
              />
              {query && (
                <button type="button" className="view-search-clear" aria-label={t('common.clear')} onClick={() => setQuery('')}>
                  <HiXMark />
                </button>
              )}
            </div>
            {query && (
              <span className="view-filter-count">{t('common.results', { n: filtered.length })}</span>
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
                  {lang === 'all' ? t('common.all') : lang}
                </button>
              ))}
            </div>
          )}
        </>
      )}

      {!loading && !error && heroRepo && (
        <div className="ds ds--embed">
          <div className="ds-grid ds-grid--one">
            <RepoShowCard
              repo={heroRepo}
              image={repoImages[heroRepo.name]}
              onOpen={setActiveRepo}
              accent={langAccent(heroRepo.language, heroRepo.name)}
              lazy
            />
          </div>
        </div>
      )}

      {!loading && !error && (
        <div className="ds ds--embed">
          <div className="ds-grid">
            {filtered.map((repo, i) => (
              <RepoShowCard
                key={repo.id}
                repo={repo}
                image={repoImages[repo.name]}
                onOpen={setActiveRepo}
                dd={`${(i % 2) * 0.12}s`}
                accent={langAccent(repo.language, repo.name)}
                lazy
              />
            ))}
          </div>
          {filtered.length === 0 && repos.length > 0 && (
            <p className="projects-error" style={{ margin: 0 }}>
              {t('common.noResults', { q: query || langFilter })}
            </p>
          )}
        </div>
      )}

      {!loading && error && <p className="projects-error">{t(error)}</p>}

      <section className="projects-cta">
        <p className="projects-cta-text">{t('projects.cta')}</p>
        <a className="projects-cta-link"
          href={`https://github.com/${GITHUB_USER}`}
          target="_blank" rel="noopener noreferrer">
          <SiGithub /> github.com/{GITHUB_USER} →
        </a>
      </section>

      {activeRepo    && <RepoModal     repo={activeRepo}    image={repoImages[activeRepo.name]} onClose={() => setActiveRepo(null)} />}

    </div>
  )
}

export default ProjectsView
