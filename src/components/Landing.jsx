import { useState, useEffect } from 'react'
import '../css/landing.css'
import landingLogo from '../res/landinglogo.webp'
import Modal from './Modal.jsx'
import RepoModal from './RepoModal.jsx'
import BlogPostModal from './BlogPostModal.jsx'
import { useData } from '../context/DataContext.jsx'
import { GoStar, GoRepoForked, GoRepo } from 'react-icons/go'
import {
  SiGithub, SiGo, SiJavascript, SiTypescript, SiPython,
  SiGnubash, SiCss, SiHtml5, SiVuedotjs, SiRust, SiCplusplus,
} from 'react-icons/si'
import { TbServer, TbCode, TbBrush, TbBrandPowershell } from 'react-icons/tb'

const BLOG_URL = import.meta.env.VITE_BLOG_URL

const LANG_COLORS = {
  Go: '#22D3EE', JavaScript: '#FBBF24', TypeScript: '#3B82F6',
  Python: '#A78BFA', Shell: '#4ADE80', CSS: '#FB7185',
  HTML: '#F97316', Vue: '#2DD4BF', Rust: '#F97316',
  'C++': '#E879F9', PowerShell: '#38BDF8',
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

const LangIcon = ({ lang }) => {
  const Icon = LANG_ICONS[lang]
  const color = langAccent(lang, lang)
  return Icon
    ? <Icon style={{ color, fontSize: '0.88rem', flexShrink: 0 }} />
    : <span className="dash-lang-dot" style={{ background: color }} />
}

const whatSections = [
  {
    icon: TbServer,
    accent: '#22D3EE',
    eyebrow: 'Infrastruttura',
    title: 'Virtualizzazione & Infrastruttura Enterprise',
    desc: 'Progetto, implemento e gestisco ambienti ad alta disponibilità per realtà enterprise. Dal clustering al disaster recovery.',
    tags: ['VMware vSphere 8', 'Proxmox VE', 'Kubernetes · K3s', 'KubeVirt', 'Red Hat Linux', 'Docker', 'Windows Server', 'Ansible'],
    content: [
      'Il mio campo principale è la virtualizzazione enterprise. Ogni giorno lavoro con ambienti VMware vSphere in produzione, gestendo cluster ESXi, vCenter Server e soluzioni di storage condiviso. Ho esperienza nella migrazione da ambienti fisici a virtuali, nel disaster recovery con VMware Site Recovery Manager e nell\'ottimizzazione delle risorse in ambienti multi-tenant.',
      'Con Proxmox VE gestisco cluster ad alta disponibilità per ambienti più snelli e open source, spesso in combinazione con Ceph per lo storage distribuito. Kubernetes — sia nella versione vanilla che K3s per deployment leggeri — è diventato parte integrante del mio stack quotidiano, con Helm per la gestione dei chart e KubeVirt per la virtualizzazione all\'interno dei cluster.',
      'Su Linux mi muovo tra Red Hat Enterprise Linux, Fedora, Ubuntu e Debian, con automazione tramite Ansible per la configurazione e il provisioning. L\'obiettivo è sempre lo stesso: ambienti affidabili, scalabili e manutenibili nel tempo.',
    ],
  },
  {
    icon: TbCode,
    accent: '#4ADE80',
    eyebrow: 'sviluppo',
    title: 'Sviluppo Software & Open Source',
    desc: 'Quando un problema non ha uno strumento adatto, lo costruisco. CLI, API REST, fullstack e desktop app — con attenzione alla community.',
    tags: ['Go', 'React · Vite', 'Wails', 'Node.js', 'API REST', 'Electron', 'PowerShell', 'Bash'],
    content: [
      'Ho iniziato a programmare per risolvere problemi pratici — e ho scoperto che costruire strumenti è esattamente quello che mi piace fare. Il mio linguaggio principale è Go, con cui sviluppo tool CLI, daemon di sistema e API REST. La sua semplicità, le performance e il modello di concorrenza lo rendono perfetto per applicativi infrastrutturali.',
      'Sul fronte web uso React con Vite per le interfacce, spesso in combinazione con Go come backend — un fullstack che si comporta bene in produzione. Con Wails porto questo stack anche sul desktop, creando applicativi nativi multipiattaforma senza Electron overhead.',
      'Ho contribuito a progetti open source su GitHub e mantengo diversi repository personali, tra cui i tool del progetto vlT. Scrivo anche PowerShell e Bash per l\'automazione di sistema, e utilizzo Node.js quando il contesto lo richiede.',
    ],
  },
  {
    icon: TbBrush,
    accent: '#E879F9',
    eyebrow: 'design',
    title: 'Digital Design & Identità Visiva',
    desc: 'Il design è il modo in cui la tecnologia comunica. Curo identità visiva, UI e branding end-to-end: dal concept su Figma al SVG finale.',
    tags: ['UI Design', 'Figma', 'SVG', 'Branding', 'Illustrator', 'CSS · Animation'],
    content: [
      'Il design per me non è una disciplina separata dalla tecnologia — è il modo in cui la tecnologia comunica con le persone. Quando progetto un\'interfaccia, un logo o un sistema di identità visiva, parto sempre dal contesto: chi la usa, come la usa, cosa deve trasmettere.',
      'Con Figma gestisco l\'intero flusso dal concept alla consegna, passando per wireframe, prototipi interattivi e design system. Per l\'illustrazione vettoriale uso Adobe Illustrator, con una preferenza per SVG ottimizzato per il web — leggero, scalabile e animabile via CSS.',
      'Il progetto vlT ne è l\'esempio più diretto: logo, palette colori, tipografia e animazioni sono stati progettati come sistema coerente, non come elementi separati.',
    ],
  },
]

const fmtDate = iso =>
  new Date(iso).toLocaleDateString('it-IT', { day: 'numeric', month: 'short', year: 'numeric' })

const Landing = () => {
  const [activeModal, setActiveModal] = useState(null)
  const [activeRepo,  setActiveRepo]  = useState(null)
  const [activePost,  setActivePost]  = useState(null)
  const { repos, repoImages, reposLoading, posts, postsLoading, postsError, fetchPosts } = useData()

  useEffect(() => { fetchPosts() }, [fetchPosts])

  const latestRepo = repos[0] ?? null
  const latestPost = posts[0] ?? null
  const langColor  = langAccent(latestRepo?.language, latestRepo?.name ?? '')
  const repoImg    = latestRepo ? (repoImages[latestRepo.name] ?? null) : null

  return (
    <div className="landing">

      <img className="landing-serigrafia" src={landingLogo} alt="" aria-hidden="true" />

      <section className="home-intro">
        <h2 className="home-intro-title">
          Dall'hypervisor all'interfaccia,<br />costruisco tecnologia che funziona.
        </h2>
        <p className="home-intro-sub">
          Virtualization Solution Architect · Open Source Developer · Digital Designer
        </p>
      </section>

      {/* ── 3 card competenze ── */}
      <div className="what-grid">
        {whatSections.map((s, i) => (
          <div
            key={s.title}
            className="what-card"
            style={{ '--card-accent': s.accent, animationDelay: `${0.14 + i * 0.1}s` }}
            onClick={() => setActiveModal(s)}
            role="button"
            tabIndex={0}
            onKeyDown={e => e.key === 'Enter' && setActiveModal(s)}
          >
            <div className="what-card-inner">
              <div className="what-card-icon-row">
                <s.icon className="what-card-icon" />
                <span className="what-card-eyebrow">{s.eyebrow}</span>
              </div>
              <h3 className="what-card-title">{s.title}</h3>
              <p className="what-card-desc">{s.desc}</p>
              <div className="what-tags">
                {s.tags.map(t => (
                  <span key={t} className="what-tag">{t}</span>
                ))}
              </div>
            </div>
            <span className="what-more">Scopri di più →</span>
          </div>
        ))}
      </div>

      {/* ── Dashboard: ultimo progetto + ultimo articolo ── */}
      <div className="dash-grid">

        {/* Big card — repo più recente */}
        <div
          className="dash-card dash-card--link"
          style={{ animationDelay: '0.44s' }}
          onClick={() => latestRepo && setActiveRepo(latestRepo)}
          role={latestRepo ? 'button' : undefined}
          tabIndex={latestRepo ? 0 : undefined}
          onKeyDown={e => e.key === 'Enter' && latestRepo && setActiveRepo(latestRepo)}
        >
          <div className="dash-card-header">
            <span className="dash-label">Ultimo progetto</span>
            {latestRepo
              ? <a
                  href={latestRepo.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="dash-header-icon-link"
                  onClick={e => e.stopPropagation()}
                  aria-label="Apri su GitHub"
                >
                  <SiGithub />
                </a>
              : <SiGithub className="dash-header-icon" />
            }
          </div>

          {reposLoading && <div className="dash-skeleton" />}

          {!reposLoading && latestRepo && (
            <>
              <div className="dash-repo-name-row">
                <div className="dash-repo-thumb" style={{ '--lang-color': langColor }}>
                  <GoRepo className="dash-repo-thumb-icon" />
                  {repoImg && (
                    <img
                      className="dash-repo-thumb-photo"
                      src={repoImg}
                      alt=""
                      loading="lazy"
                      onError={e => { e.currentTarget.style.display = 'none' }}
                    />
                  )}
                </div>
                <span className="dash-repo-name">{latestRepo.name}</span>
                {latestRepo.language && (
                  <>
                    <LangIcon lang={latestRepo.language} />
                    <span className="dash-lang-text" style={{ color: langColor }}>
                      {latestRepo.language}
                    </span>
                  </>
                )}
              </div>
              {latestRepo.description && (
                <p className="dash-repo-desc">{latestRepo.description}</p>
              )}
              <div className="dash-repo-meta">
                <span className="dash-meta-item"><GoStar /> {latestRepo.stargazers_count}</span>
                <span className="dash-meta-item"><GoRepoForked /> {latestRepo.forks_count}</span>
                {latestRepo.topics?.slice(0, 2).map(t => (
                  <span key={t} className="dash-topic">{t}</span>
                ))}
              </div>
              <a
                className="dash-cta"
                href={latestRepo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={e => e.stopPropagation()}
              >
                Dettagli progetto →
              </a>
            </>
          )}
        </div>

        {/* Big card — post più recente */}
        <div
          className="dash-card dash-card--link"
          style={{ animationDelay: '0.54s' }}
          onClick={() => latestPost && setActivePost(latestPost)}
          role={latestPost ? 'button' : undefined}
          tabIndex={latestPost ? 0 : undefined}
          onKeyDown={e => e.key === 'Enter' && latestPost && setActivePost(latestPost)}
        >
          <div className="dash-card-header">
            <span className="dash-label">Ultimo articolo</span>
            <span className="dash-header-text">Blog</span>
          </div>

          {postsLoading && <div className="dash-skeleton" />}

          {!postsLoading && postsError && (
            <p className="dash-error">{postsError}</p>
          )}

          {!postsLoading && !postsError && latestPost && (
            <>
              {latestPost.coverImage?.url && (
                <div className="dash-post-cover">
                  <img src={latestPost.coverImage.url} alt={latestPost.title} loading="lazy" />
                </div>
              )}
              {latestPost.tags?.length > 0 && (
                <div className="dash-post-tags">
                  {latestPost.tags.slice(0, 2).map(t => (
                    <span key={t.name} className="dash-topic">{t.name}</span>
                  ))}
                </div>
              )}
              <h4 className="dash-post-title">{latestPost.title}</h4>
              <p className="dash-post-brief">{latestPost.brief}</p>
              <div className="dash-post-meta">
                <span>{fmtDate(latestPost.publishedAt)}</span>
                <span>·</span>
                <span>{latestPost.readTimeInMinutes} min</span>
              </div>
              <a
                className="dash-cta"
                href={`${BLOG_URL}/${latestPost.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={e => e.stopPropagation()}
              >
                Leggi articolo completo →
              </a>
            </>
          )}
        </div>

      </div>

      {/* ── 4 mini card in unica riga ── */}
      <div className="dash-mini-row">
        {repos.slice(1, 3).map((repo, i) => {
          const lc = langAccent(repo.language, repo.name)
          return (
            <div
              key={repo.id}
              className="dash-mini-card dash-mini-card--link"
              style={{ animationDelay: `${0.58 + i * 0.09}s` }}
              onClick={() => setActiveRepo(repo)}
              role="button"
              tabIndex={0}
              onKeyDown={e => e.key === 'Enter' && setActiveRepo(repo)}
            >
              <div className="dash-mini-name-row">
                <div className="dash-mini-repo-thumb" style={{ '--lang-color': lc }}>
                  <GoRepo className="dash-mini-repo-thumb-icon" />
                  {repoImages[repo.name] && (
                    <img
                      className="dash-mini-repo-thumb-photo"
                      src={repoImages[repo.name]}
                      alt=""
                      loading="lazy"
                      onError={e => { e.currentTarget.style.display = 'none' }}
                    />
                  )}
                </div>
                <span className="dash-mini-name">{repo.name}</span>
                {repo.language && <LangIcon lang={repo.language} />}
              </div>
              {repo.description && (
                <p className="dash-mini-desc">{repo.description}</p>
              )}
            </div>
          )
        })}

        {posts.slice(1, 3).map((post, i) => (
          <div
            key={post.id}
            className="dash-mini-card dash-mini-card--link"
            style={{ animationDelay: `${0.68 + i * 0.09}s` }}
            onClick={() => setActivePost(post)}
            role="button"
            tabIndex={0}
            onKeyDown={e => e.key === 'Enter' && setActivePost(post)}
          >
            <div className="dash-mini-post-row">
              {post.coverImage?.url && (
                <div className="dash-mini-post-thumb">
                  <img src={post.coverImage.url} alt={post.title} loading="lazy" />
                </div>
              )}
              <div className="dash-mini-post-content">
                <p className="dash-mini-post-title">{post.title}</p>
                <div className="dash-mini-post-meta">
                  <span>{fmtDate(post.publishedAt)}</span>
                  <span>·</span>
                  <span>{post.readTimeInMinutes} min</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {activeModal && (
        <Modal data={activeModal} onClose={() => setActiveModal(null)} />
      )}

      {activeRepo && (
        <RepoModal repo={activeRepo} image={repoImages[activeRepo.name]} onClose={() => setActiveRepo(null)} />
      )}

      {activePost && (
        <BlogPostModal post={activePost} onClose={() => setActivePost(null)} />
      )}

    </div>
  )
}

export default Landing
