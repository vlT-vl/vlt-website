import { useSyncExternalStore } from 'react'
import CONTENT from '../res/content.json'

const STORAGE_KEY = 'vlt-lang'
export const LANGS = ['it', 'en']

const TEXT = {
  it: {
    'nav.home': 'Home',
    'nav.about': 'About Me',
    'nav.vlt': 'About vlT',
    'nav.projects': 'Progetti',
    'nav.blog': 'Blog',
    'nav.lang': 'Cambia lingua',
    'nav.langTitle': 'Passa all’inglese',
    'nav.info': 'Informazioni sul sito',
    'theme.toLight': 'Attiva tema chiaro',
    'theme.toDark': 'Attiva tema scuro',
    'theme.light': 'Tema chiaro',
    'theme.dark': 'Tema scuro',
    'common.close': 'Chiudi',
    'common.min': 'min',
    'common.none': 'Non specificata',
    'common.all': 'Tutti',
    'common.clear': 'Cancella ricerca',
    'common.results': '{n} risultati',
    'common.noResults': 'Nessun risultato per "{q}".',
    'common.openRepo': 'Apri {name} su GitHub',
    'common.openGithub': 'Apri su GitHub',
    'common.openSite': 'Apri il sito',

    'footer.about': 'Informazioni su vlT Website',
    'footer.location': 'Milano, Italia',
    'footer.sections': 'Sezioni',
    'footer.links': 'Link',

    'landing.title': 'Dall\'hypervisor all\'interfaccia,<br />costruisco tecnologia che funziona.',
    'hero.replay': 'Riproduci l’animazione del logo',
    'hero.label': 'Founder · Developer · Engineer',
    'hero.sub': 'Open Source Developer · ICT Solution Architect · Virtualization Specialist & Enthusiast · Full Stack Web Developer · Hardware Technician · Digital Designer · Motion Designer',
    'hero.aria': 'From hypervisor to interface',
    'hero.from': 'From',
    'hero.a': 'hypervisor',
    'hero.to': 'to',
    'hero.b': 'interface',
    'landing.sub': 'Virtualization Solution Architect · Open Source Developer · Digital Designer',
    'projects.license': 'Licenza',
    'dash.project': 'Ultimo progetto',
    'dash.article': 'Ultimo articolo',
    'dash.moreProjects': 'Altri progetti',
    'dash.moreArticles': 'Altri articoli',
    'dash.goTo': 'Vai a',
    'dash.projectCta': 'Dettagli progetto →',
    'dash.articleCta': 'Leggi articolo completo →',
    'dash.preview': 'Apri anteprima',

    'what.infra.eyebrow': 'Infrastruttura',
    'what.infra.title': 'Virtualizzazione & Infrastruttura Enterprise',
    'what.infra.desc': 'Progetto, implemento e gestisco ambienti ad alta disponibilità per realtà enterprise. Dal clustering al disaster recovery.',
    'what.infra.content': [
      'Il mio campo principale è la virtualizzazione enterprise. Ogni giorno lavoro con ambienti VMware vSphere e VMware Cloud Foundation (VCF) in produzione, gestendo cluster ESXi, vCenter Server, SDDC Manager e soluzioni di storage condiviso. Ho esperienza nella migrazione da ambienti fisici a virtuali, nel disaster recovery con VMware Site Recovery Manager e nell\'ottimizzazione delle risorse in ambienti multi-tenant.',
      'Accanto a VMware lavoro con Proxmox VE, per cluster ad alta disponibilità in ambienti più snelli e open source, spesso in combinazione con Ceph per lo storage distribuito, e con Nutanix, dove l\'infrastruttura iperconvergente con AHV e Prism riunisce calcolo, storage e gestione in un\'unica piattaforma. Conoscere più hypervisor mi permette di scegliere la piattaforma giusta per ogni contesto e di pianificare migrazioni dall\'una all\'altra senza fermare i servizi.',
      'Kubernetes — sia nella versione vanilla che K3s per deployment leggeri — è parte integrante del mio stack quotidiano, con Helm per la gestione dei chart e KubeVirt per far convivere macchine virtuali e container nello stesso cluster. Seguo e sperimento anche i progetti open source che portano questo modello nell\'infrastruttura: Harvester, la piattaforma iperconvergente open basata su Kubernetes e KubeVirt, e OKD, la distribuzione community di OpenShift, per capire come container e virtualizzazione convergeranno.',
      'Su Linux mi muovo tra Red Hat Enterprise Linux, Fedora, Ubuntu e Debian, con automazione tramite Ansible per la configurazione e il provisioning. L\'obiettivo è sempre lo stesso: ambienti affidabili, scalabili e manutenibili nel tempo.',
    ],
    'what.dev.eyebrow': 'sviluppo',
    'what.dev.title': 'Sviluppo Software & Open Source',
    'what.dev.desc': 'Quando un problema non ha uno strumento adatto, lo costruisco. CLI, API REST, fullstack e desktop app — con attenzione alla community.',
    'what.dev.content': [
      'Ho iniziato a programmare per risolvere problemi pratici — e ho scoperto che costruire strumenti è esattamente quello che mi piace fare. Il mio linguaggio principale è Go, con cui sviluppo tool CLI, daemon di sistema e API REST. La sua semplicità, le performance e il modello di concorrenza lo rendono perfetto per applicativi infrastrutturali.',
      'Sul fronte web uso React con Vite per le interfacce, spesso in combinazione con Go come backend — un fullstack che si comporta bene in produzione. Con nex, il framework che ho costruito e sviluppato apposta per app web e desktop, porto applicativi con stack Go + React + Vite su tutte le piattaforme a una velocità mai vista prima.',
      'Ho contribuito a progetti open source su GitHub e mantengo diversi repository personali, tra cui i tool del progetto vlT. Scrivo PowerShell, Bash, Python e Go per automatizzare i sistemi, e utilizzo Node.js quando il contesto lo richiede.',
    ],
    'what.design.eyebrow': 'design',
    'what.design.title': 'Digital Design & Identità Visiva',
    'what.design.desc': 'Il design è il modo in cui la tecnologia comunica. Curo identità visiva, UI, motion design e branding end-to-end: dall\'idea al SVG animato finale.',
    'what.design.content': [
      'Il design per me non è una disciplina separata dalla tecnologia — è il modo in cui la tecnologia comunica con le persone. Quando progetto un\'interfaccia, un logo o un sistema di identità visiva, parto sempre dal contesto: chi la usa, come la usa, cosa deve trasmettere.',
      'Tutto nasce dalle idee, non da un tool di progettazione: per dare vita a ciò che ho in testa costruisco strumenti custom, come SVG Designer Studio, che ho creato apposta per disegnare e rifinire la grafica vettoriale. Preferisco SVG ottimizzato per il web — leggero, scalabile e animabile via CSS.',
      'Il motion design è parte del progetto fin dall\'inizio: animazioni CSS e SVG, micro-interazioni, easing e timing studiati perché il movimento guidi lo sguardo, racconti la struttura dell\'interfaccia e dia carattere senza mai appesantirla.',
      'Il progetto vlT ne è l\'esempio più diretto: logo, palette colori, tipografia e motion design sono stati progettati come sistema coerente, non come elementi separati.',
    ],

    'aboutme.location': 'Novate Milanese · Milano, Italia',
    'aboutme.linkedin': 'Profilo LinkedIn',
    'aboutme.mail': 'Scrivimi una email',
    'aboutme.contact': 'contattami',
    'contact.eyebrow': 'contattami',
    'contact.title': 'Scrivimi una email',
    'contact.intro': 'Compila il tuo nome, modifica il testo se vuoi e apri la bozza nel tuo client di posta.',
    'contact.name': 'Il tuo nome',
    'contact.namePh': 'Nome e cognome',
    'contact.to': 'Destinatario',
    'contact.subject': 'Oggetto',
    'contact.body': 'Messaggio',
    'contact.reset': 'Ripristina testo',
    'contact.send': 'Apri nel client di posta',
    'contact.copy': 'Copia testo',
    'contact.copied': 'Copiato',
    'contact.or': 'Oppure',
    'contact.subjectTpl': 'Primo contatto da {name} tramite vlt-website',
    'contact.bodyTpl': 'Ciao, sono {name}, ti contatto dal form mail del tuo sito web, mi piacerebbe poter approfondire con te ...\n\nGrazie mille,\nun saluto\n{name}',
    'contact.nameFallback': '[il tuo nome]',
    'aboutme.eyebrow': 'about me',
    'aboutme.title': 'Chi sono',
    'aboutme.p1': 'Sono Lorenzo Veronesi: ingegnere di infrastrutture, sviluppatore e designer — e abbastanza curioso da non riuscire a limitarmi a una sola di queste cose. Mi piace risolvere problemi complessi, ma ancora di più mi piace farlo con le persone giuste intorno.',
    'aboutme.p2a': 'Nel corso della mia carriera come Virtualization Solution Architect ho lavorato in diverse realtà del panorama tech milanese, accumulando esperienza quotidiana con VMware vSphere, Proxmox VE, Kubernetes, Windows Server e le principali distribuzioni Linux — Fedora, Red Hat Enterprise Linux, Ubuntu e Debian. Attualmente lavoro presso',
    'aboutme.p2b': 'dove progetto e gestisco infrastrutture enterprise ad alta disponibilità.',
    'aboutme.p3a': 'Nel tempo libero sono sviluppatore, designer, blogger e appassionato videogiocatore. Ho collaborato con la community open source su GitHub e sviluppato progetti in Go, JavaScript, Node.js, React, PowerShell, Bash e Python. Nella sezione',
    'aboutme.p3b': 'di questo sito trovi guide tecniche, progetti e soluzioni su infrastruttura e sviluppo software.',
    'aboutme.p3c': 'Tra i progetti a cui tengo di più c\'è nex, il framework che ho ideato per sviluppare applicazioni desktop cross-platform con Go e React, da cui è nata anche la versione web, nex web. In parallelo studio e sperimento le tecnologie di virtualizzazione e container di nuova generazione, come Harvester, OKD e KubeVirt, per capire come far convivere macchine virtuali e workload containerizzati sulla stessa piattaforma. Nella sezione Progetti trovi una selezione di quello che costruisco.',
    'aboutme.p4': 'La curiosità è il filo conduttore di tutto quello che faccio: dall\'hypervisor all\'interfaccia grafica, dall\'automazione al design — ogni progetto è un\'occasione per imparare qualcosa di nuovo e costruire qualcosa che funzioni davvero.',
    'aboutme.work': 'dove lavoro',
    'aboutme.workPlace': 'Via Palmanova 67 · 20132 Milano',
    'aboutme.workRole': 'Virtualization Solution Architect',
    'aboutme.certs': 'certificazioni',
    'aboutme.wip': 'in corso',
    'aboutme.wipTag': 'in corso',
    'aboutme.credly': 'Vedi su Credly',
    'aboutme.credlyAll': 'Tutti i badge su Credly →',

    'vlt.slogan': 'Il mio brand, il mio spazio, la mia tecnologia.',
    'vlt.eyebrow': 'about vlT',
    'vlt.p1a': 'vlT —',
    'vlt.p1b': '— nasce come brand personale per dare un\'identità unica a tutte le mie passioni tecnologiche. Non un semplice portfolio, ma uno spazio dove infrastruttura enterprise, sviluppo software, design e curiosità convivono sotto un\'unica sigla.',
    'vlt.p2': 'L\'obiettivo a lungo termine è che vlT diventi qualcosa di più grande di un brand personale: una realtà tech indipendente, con prodotti propri, un\'identità solida e gli stessi valori che guidano ogni progetto — qualità, rigore tecnico e una genuina passione per costruire cose che funzionino.',
    'vlt.infra': 'infrastruttura & sistemi',
    'vlt.dev': 'sviluppo software',
    'vlt.fromBlog': 'dal blog',
    'vlt.teaserTitle': 'Articoli & Guide',
    'vlt.teaserSub': 'VMware · Proxmox · Kubernetes · Docker · Go · Linux — e molto altro.',
    'vlt.teaserCta': 'Leggi gli articoli →',
    'skill.proxmoxSub': 'Virtualizzazione · Clustering · HA',
    'skill.virt': 'Virtualizzazione',
    'skill.automation': 'Automazione',

    'projects.eyebrow': 'progetti',
    'projects.title': 'Progetti & Repository',
    'projects.sub': 'Ogni progetto nasce da un problema concreto — CLI, API, desktop app e tool scritti per automatizzare, semplificare e durare nel tempo.',
    'projects.search': 'Cerca repo, descrizione, topic…',
    'projects.cta': 'Tutti i repository pubblici su',
    'projects.details': 'Dettagli progetto →',
    'projects.error': 'Impossibile caricare i repository. Riprova più tardi.',

    'blog.eyebrow': 'articoli',
    'blog.sub': 'VMware · Proxmox · Kubernetes · Go · Linux — guide, approfondimenti e note dal campo.',
    'blog.search': 'Cerca articoli…',
    'blog.read': 'Leggi articolo →',
    'blog.error': 'Impossibile caricare gli articoli.',

    'repo.github': 'Vedi su GitHub',
    'repo.details': 'Dettagli',
    'repo.noReadme': 'README non disponibile per questo repository.',
    'repo.languages': 'Linguaggi',
    'repo.files': 'File',
    'repo.commits': 'Commit recenti',
    'repo.release': 'Ultima release',
    'ago.now': 'adesso',
    'ago.m': '{n}m fa',
    'ago.h': '{n}h fa',
    'ago.d': '{n}g fa',
    'ago.w': '{n}w fa',
    'ago.mo': '{n} mesi fa',
    'ago.y': '{n}a fa',
    'post.readFull': 'Leggi l\'articolo completo →',
    'post.readTime': '{n} min di lettura',

    'license.eyebrow': 'Licenza',
    'license.default': 'Licenza',
    'license.empty': 'Nessun file di licenza trovato nel repository.',

    'info.eyebrow': 'Info',
    'info.version': 'Versione',
    'info.build': 'Build',
    'info.updated': 'Aggiornato',
    'info.deps': 'Tutte le dipendenze',
    'info.notice': 'vlT Website è di proprietà esclusiva di Veronesi Lorenzo (vlT). Tutti i diritti riservati.',
    'info.license': 'Visualizza licenza',
  },

  en: {
    'nav.home': 'Home',
    'nav.about': 'About Me',
    'nav.vlt': 'About vlT',
    'nav.projects': 'Projects',
    'nav.blog': 'Blog',
    'nav.lang': 'Change language',
    'nav.langTitle': 'Switch to Italian',
    'nav.info': 'About this website',
    'theme.toLight': 'Switch to light theme',
    'theme.toDark': 'Switch to dark theme',
    'theme.light': 'Light theme',
    'theme.dark': 'Dark theme',
    'common.close': 'Close',
    'common.min': 'min',
    'common.none': 'Not specified',
    'common.all': 'All',
    'common.clear': 'Clear search',
    'common.results': '{n} results',
    'common.noResults': 'No results for "{q}".',
    'common.openRepo': 'Open {name} on GitHub',
    'common.openGithub': 'Open on GitHub',
    'common.openSite': 'Open website',

    'footer.about': 'About vlT Website',
    'footer.location': 'Milan, Italy',
    'footer.sections': 'Sections',
    'footer.links': 'Links',

    'landing.title': 'From hypervisor to interface,<br />I build technology that works.',
    'hero.replay': 'Replay the logo animation',
    'hero.label': 'Founder · Developer · Engineer',
    'hero.sub': 'Open Source Developer · ICT Solution Architect · Virtualization Specialist & Enthusiast · Full Stack Web Developer · Hardware Technician · Digital Designer · Motion Designer',
    'hero.aria': 'From hypervisor to interface',
    'hero.from': 'From',
    'hero.a': 'hypervisor',
    'hero.to': 'to',
    'hero.b': 'interface',
    'landing.sub': 'Virtualization Solution Architect · Open Source Developer · Digital Designer',
    'projects.license': 'License',
    'dash.project': 'Latest project',
    'dash.article': 'Latest article',
    'dash.moreProjects': 'More projects',
    'dash.moreArticles': 'More articles',
    'dash.goTo': 'Go to',
    'dash.projectCta': 'Project details →',
    'dash.articleCta': 'Read the full article →',
    'dash.preview': 'Open preview',

    'what.infra.eyebrow': 'Infrastructure',
    'what.infra.title': 'Enterprise Virtualization & Infrastructure',
    'what.infra.desc': 'I design, implement and run high-availability environments for enterprise organizations. From clustering to disaster recovery.',
    'what.infra.content': [
      'Enterprise virtualization is my main field. Every day I work with production VMware vSphere and VMware Cloud Foundation (VCF) environments, managing ESXi clusters, vCenter Server, SDDC Manager and shared storage solutions. I have experience in migrating from physical to virtual environments, in disaster recovery with VMware Site Recovery Manager and in resource optimization in multi-tenant environments.',
      'Alongside VMware I work with Proxmox VE, for high-availability clusters in leaner, open source environments, often combined with Ceph for distributed storage, and with Nutanix, where hyperconverged infrastructure with AHV and Prism brings compute, storage and management together in a single platform. Knowing several hypervisors lets me choose the right platform for each context and plan migrations from one to another without stopping services.',
      'Kubernetes — both vanilla and K3s for lightweight deployments — is an integral part of my daily stack, with Helm for chart management and KubeVirt to run virtual machines and containers side by side in the same cluster. I also follow and experiment with the open source projects that bring this model into infrastructure: Harvester, the open hyperconverged platform built on Kubernetes and KubeVirt, and OKD, the community distribution of OpenShift, to understand how containers and virtualization will converge.',
      'On Linux I move between Red Hat Enterprise Linux, Fedora, Ubuntu and Debian, with automation through Ansible for configuration and provisioning. The goal is always the same: reliable, scalable and maintainable environments over time.',
    ],
    'what.dev.eyebrow': 'development',
    'what.dev.title': 'Software Development & Open Source',
    'what.dev.desc': 'When a problem has no suitable tool, I build it. CLI, REST APIs, fullstack and desktop apps — with attention to the community.',
    'what.dev.content': [
      'I started programming to solve practical problems — and discovered that building tools is exactly what I enjoy doing. My main language is Go, which I use to develop CLI tools, system daemons and REST APIs. Its simplicity, performance and concurrency model make it perfect for infrastructure applications.',
      'On the web side I use React with Vite for interfaces, often combined with Go as the backend — a fullstack that performs well in production. With nex, the framework I built and developed specifically for web and desktop apps, I deliver Go + React + Vite applications on every platform at a speed I had never seen before.',
      'I have contributed to open source projects on GitHub and maintain several personal repositories, including the tools of the vlT project. I write PowerShell, Bash, Python and Go to automate systems, and use Node.js when the context requires it.',
    ],
    'what.design.eyebrow': 'design',
    'what.design.title': 'Digital Design & Visual Identity',
    'what.design.desc': 'Design is how technology communicates. I take care of visual identity, UI, motion design and branding end-to-end: from the first idea to the final animated SVG.',
    'what.design.content': [
      'For me, design is not a discipline separate from technology — it is the way technology communicates with people. When I design an interface, a logo or a visual identity system, I always start from the context: who uses it, how they use it, what it must convey.',
      'Everything starts from ideas, not from a design tool: to bring to life what I have in mind I build custom tools, like SVG Designer Studio, which I created specifically to draw and refine vector graphics. I prefer web-optimized SVG — light, scalable and animatable via CSS.',
      'Motion design is part of the project from the start: CSS and SVG animation, micro-interactions, easing and timing designed so that movement guides the eye, shows the structure of the interface and adds character without ever weighing it down.',
      'The vlT project is the most direct example: logo, color palette, typography and motion design were designed as a coherent system, not as separate elements.',
    ],

    'aboutme.location': 'Novate Milanese · Milan, Italy',
    'aboutme.linkedin': 'LinkedIn profile',
    'aboutme.mail': 'Send me an email',
    'aboutme.contact': 'contact me',
    'contact.eyebrow': 'contact me',
    'contact.title': 'Send me an email',
    'contact.intro': 'Fill in your name, edit the text if you like and open the draft in your mail client.',
    'contact.name': 'Your name',
    'contact.namePh': 'Full name',
    'contact.to': 'To',
    'contact.subject': 'Subject',
    'contact.body': 'Message',
    'contact.reset': 'Reset text',
    'contact.send': 'Open in mail client',
    'contact.copy': 'Copy text',
    'contact.copied': 'Copied',
    'contact.or': 'Or',
    'contact.subjectTpl': 'First contact from {name} via vlt-website',
    'contact.bodyTpl': 'Hi, I am {name}, I am contacting you from the mail form of your website, I would like to talk more with you about ...\n\nThank you very much,\nbest regards\n{name}',
    'contact.nameFallback': '[your name]',
    'aboutme.eyebrow': 'about me',
    'aboutme.title': 'About me',
    'aboutme.p1': 'I am Lorenzo Veronesi: infrastructure engineer, developer and designer — and curious enough that I can\'t limit myself to just one of these. I like solving complex problems, but I like it even more when I do it with the right people around me.',
    'aboutme.p2a': 'Throughout my career as a Virtualization Solution Architect I have worked in several companies of the Milan tech scene, gaining daily experience with VMware vSphere, Proxmox VE, Kubernetes, Windows Server and the main Linux distributions — Fedora, Red Hat Enterprise Linux, Ubuntu and Debian. I currently work at',
    'aboutme.p2b': 'where I design and manage high-availability enterprise infrastructures.',
    'aboutme.p3a': 'In my spare time I am a developer, designer, blogger and avid gamer. I have collaborated with the open source community on GitHub and built projects in Go, JavaScript, Node.js, React, PowerShell, Bash and Python. In the',
    'aboutme.p3b': 'section of this site you will find technical guides, projects and solutions on infrastructure and software development.',
    'aboutme.p3c': 'Among the projects I care about most is nex, the framework I created to build cross-platform desktop applications with Go and React, which also gave rise to its web version, nex web. In parallel I study and experiment with next-generation virtualization and container technologies, such as Harvester, OKD and KubeVirt, to understand how virtual machines and containerized workloads can live on the same platform. In the Projects section you will find a selection of what I build.',
    'aboutme.p4': 'Curiosity is the common thread in everything I do: from the hypervisor to the graphical interface, from automation to design — every project is an opportunity to learn something new and build something that really works.',
    'aboutme.work': 'where I work',
    'aboutme.workPlace': 'Via Palmanova 67 · 20132 Milan, Italy',
    'aboutme.workRole': 'Virtualization Solution Architect',
    'aboutme.certs': 'certifications',
    'aboutme.wip': 'in progress',
    'aboutme.wipTag': 'in progress',
    'aboutme.credly': 'View on Credly',
    'aboutme.credlyAll': 'All badges on Credly →',

    'vlt.slogan': 'My brand, my space, my technology.',
    'vlt.eyebrow': 'about vlT',
    'vlt.p1a': 'vlT —',
    'vlt.p1b': '— was born as a personal brand to give a unique identity to all my technology passions. Not just a portfolio, but a space where enterprise infrastructure, software development, design and curiosity live together under a single name.',
    'vlt.p2': 'The long-term goal is for vlT to become something bigger than a personal brand: an independent tech company, with its own products, a solid identity and the same values that guide every project — quality, technical rigor and a genuine passion for building things that work.',
    'vlt.infra': 'infrastructure & systems',
    'vlt.dev': 'software development',
    'vlt.fromBlog': 'from the blog',
    'vlt.teaserTitle': 'Articles & Guides',
    'vlt.teaserSub': 'VMware · Proxmox · Kubernetes · Docker · Go · Linux — and much more.',
    'vlt.teaserCta': 'Read the articles →',
    'skill.proxmoxSub': 'Virtualization · Clustering · HA',
    'skill.virt': 'Virtualization',
    'skill.automation': 'Automation',

    'projects.eyebrow': 'projects',
    'projects.title': 'Projects & Repositories',
    'projects.sub': 'Every project starts from a concrete problem — CLI, API, desktop apps and tools written to automate, simplify and last over time.',
    'projects.search': 'Search repos, description, topic…',
    'projects.cta': 'All public repositories on',
    'projects.details': 'Project details →',
    'projects.error': 'Unable to load the repositories. Please try again later.',

    'blog.eyebrow': 'articles',
    'blog.sub': 'VMware · Proxmox · Kubernetes · Go · Linux — guides, deep dives and notes from the field.',
    'blog.search': 'Search articles…',
    'blog.read': 'Read article →',
    'blog.error': 'Unable to load the articles.',

    'repo.github': 'View on GitHub',
    'repo.details': 'Details',
    'repo.noReadme': 'README not available for this repository.',
    'repo.languages': 'Languages',
    'repo.files': 'Files',
    'repo.commits': 'Recent commits',
    'repo.release': 'Latest release',
    'ago.now': 'just now',
    'ago.m': '{n}m ago',
    'ago.h': '{n}h ago',
    'ago.d': '{n}d ago',
    'ago.w': '{n}w ago',
    'ago.mo': '{n} months ago',
    'ago.y': '{n}y ago',
    'post.readFull': 'Read the full article →',
    'post.readTime': '{n} min read',

    'license.eyebrow': 'License',
    'license.default': 'License',
    'license.empty': 'No license file found in the repository.',

    'info.eyebrow': 'Info',
    'info.version': 'Version',
    'info.build': 'Build',
    'info.updated': 'Updated',
    'info.deps': 'All dependencies',
    'info.notice': 'vlT Website is the exclusive property of Veronesi Lorenzo (vlT). All rights reserved.',
    'info.license': 'View license',
  },
}

const LOCALES = { it: 'it-IT', en: 'en-GB' }

const MONTHS_EN = {
  gennaio: 'January', febbraio: 'February', marzo: 'March', aprile: 'April',
  maggio: 'May', giugno: 'June', luglio: 'July', agosto: 'August',
  settembre: 'September', ottobre: 'October', novembre: 'November', dicembre: 'December',
}

const detect = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (LANGS.includes(stored)) return stored
  } catch {}
  return typeof navigator !== 'undefined' && /^it\b/i.test(navigator.language ?? '') ? 'it' : 'en'
}

let current = detect()
const listeners = new Set()

const syncDocument = () => {
  if (typeof document !== 'undefined') document.documentElement.lang = current
}

syncDocument()

export const getLang = () => current

export const setLang = lang => {
  if (!LANGS.includes(lang) || lang === current) return
  current = lang
  try { localStorage.setItem(STORAGE_KEY, lang) } catch {}
  syncDocument()
  listeners.forEach(fn => fn())
}

export const toggleLang = () => {
  const root = typeof document === 'undefined' ? null : document.documentElement
  const next = current === 'it' ? 'en' : 'it'
  if (!root || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    setLang(next)
    return
  }
  root.classList.add('lang-switching')
  setTimeout(() => {
    setLang(next)
    requestAnimationFrame(() => root.classList.remove('lang-switching'))
  }, 160)
}

const subscribe = fn => {
  listeners.add(fn)
  return () => listeners.delete(fn)
}

const translate = (lang, key, vars) => {
  const value = TEXT[lang][key] ?? TEXT.it[key] ?? key
  if (!vars || typeof value !== 'string') return value
  return value.replace(/\{(\w+)\}/g, (_, name) => String(vars[name] ?? ''))
}

export const localizeDate = (text, lang = current) => {
  if (lang === 'it' || typeof text !== 'string') return text
  const [day, month, year] = text.trim().split(/\s+/)
  const en = MONTHS_EN[month?.toLowerCase()]
  return en ? `${en} ${day}, ${year}` : text
}

const contentFor = lang => CONTENT[lang] ?? {}

export const useText = () => {
  const lang = useSyncExternalStore(subscribe, getLang, getLang)
  const content = contentFor(lang)
  return {
    repoDesc: repo => content.repos?.[repo.name] ?? repo.description,
    postTitle: post => content.posts?.[post.slug]?.title ?? post.title,
    postBrief: post => content.posts?.[post.slug]?.brief ?? post.brief,
    lang,
    locale: LOCALES[lang],
    t: (key, vars) => translate(lang, key, vars),
    date: text => localizeDate(text, lang),
  }
}
