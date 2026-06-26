<p align="center">
  <img src="src/res/vltcube.svg" alt="vlT Website" width="80" />
</p>

<h1 align="center">vlT Website — Portfolio Personale</h1>

<p align="center">
  Sito web e portfolio di Lorenzo Veronesi · Virtualization Architect · Developer · Designer<br/>
  <sub>Frontend React · Vite · Deploy automatico su GitHub Pages</sub>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/versione-0.1.1--R260626-blue?style=flat-square" alt="versione"/>
  <img src="https://img.shields.io/badge/react-19-61DAFB?style=flat-square&logo=react&logoColor=white" alt="react"/>
  <img src="https://img.shields.io/badge/vite-8-646CFF?style=flat-square&logo=vite&logoColor=white" alt="vite"/>
  <img src="https://img.shields.io/badge/licenza-proprietaria-critical?style=flat-square" alt="licenza"/>
</p>

---

## Panoramica

**vlT Website** è il portfolio personale e sito web di Lorenzo Veronesi (vlT). La SPA React integra profilo professionale, progetti open source pre-generati in `projects.json` e articoli del blog, il tutto servito come sito statico su GitHub Pages.

```
Browser ──► GitHub Pages (lorenzoveronesi.it)
               │
               ├── projects.json → repository pubblici GitHub pre-generati
               └── posts.json   → articoli blog (pre-generato al build time da Hashnode RSS)

GitHub Actions (push/schedule/dispatch)
               ├── fetch-projects.js → GitHub API pubblica → public/projects.json
               └── fetch-posts.js    → RSS Hashnode → public/posts.json → vite build → deploy
```

Non richiede backend: i dati GitHub dei progetti e i post del blog vengono fetchati lato GitHub Actions e inclusi come JSON statici durante il deploy.

---

## Sezioni del sito

| Sezione | Descrizione |
|---|---|
| **Home** | Hero animato, 3 card competenze con modale di dettaglio, dashboard ultimo progetto + ultimo articolo + 4 mini card riepilogative |
| **About Me** | Profilo personale, background professionale, certificazioni |
| **About vlT** | Storia e filosofia del brand vlT, skills infrastruttura e sviluppo |
| **Progetti** | Browser repository GitHub con ricerca e filtro lingua, modale con README renderizzato, statistiche e licenza |
| **Blog** | Articoli con hero card, filtri per tag, ricerca full-text, lettura inline con cover image |

---

## Integrazione dati

| Sorgente | Dati | Modalità |
|---|---|---|
| `projects.json` | Lista repo, README HTML, immagini, licenze, statistiche | Generato in CI ogni 15 min e in dev all'avvio |
| `posts.json` | Articoli blog | Generato da RSS Hashnode al build time |
| RSS Hashnode | Articoli in dev (proxy `/api/rss`) | Solo in dev via proxy Vite |

Il client non chiama `api.github.com` a runtime: usa solo asset statici per evitare rate-limit lato visitatore.

---

## Architettura

```
vlt-website/
├── index.html
├── vite.config.js          # plugin dev auto-genera projects.json, proxy /api/rss, esbuild obfuscation
├── package.json
├── .env                    # variabili VITE_* (valori pubblici, committato)
│
├── scripts/
│   ├── fetch-projects.js   # fetch GitHub API pubblica → public/projects.json
│   └── fetch-posts.js      # fetch RSS Hashnode → public/posts.json
│
├── .github/
│   └── workflows/
│       └── deploy.yml      # build + deploy su GitHub Pages (push/schedule/dispatch)
│
├── public/
│   ├── projects.json       # generato da fetch-projects.js — NON committare
│   ├── posts.json          # generato da fetch-posts.js — NON committare
│   └── vltcube.svg
│
└── src/
    ├── main.jsx
    ├── context/
    │   └── DataContext.jsx     # lettura JSON statici, caching TTL localStorage, RSS parser dev
    ├── components/
    │   ├── App.jsx             # root: routing view a stato, navbar, footer
    │   ├── Navbar.jsx
    │   ├── Hero.jsx
    │   ├── Landing.jsx         # home: skill cards + dashboard 2 big card + 4 mini card
    │   ├── AboutMe.jsx
    │   ├── VltView.jsx
    │   ├── ProjectsView.jsx    # browser repository con search e filtro lingua
    │   ├── BlogView.jsx        # articoli con hero card, tag filter e search
    │   ├── VltLogo.jsx         # logo animato cubo SVG + testo vlT
    │   ├── Modal.jsx           # modale skill card (home)
    │   ├── RepoModal.jsx       # modale repo: README + dettagli + licenza
    │   ├── BlogPostModal.jsx   # modale articolo: hero cover + contenuto completo
    │   └── LicenseModal.jsx    # modale testo licenza
    ├── css/
    └── res/
        ├── vltcube.svg
        ├── vltportrait.jpg
        └── landinglogo.webp
```

---

## Configurazione

Il file `.env` è committato nel repo (nessun dato sensibile):

```env
VITE_GITHUB_USER=vlT-vl
VITE_BLOG_URL=https://lorenzoveronesi.it
VITE_COMPANY_NAME=S2E | Business Technology Consultants
VITE_COMPANY_URL=https://it.linkedin.com/company/s2e-solutions-to-enterprises
VITE_BASE_URL=/
```

`VITE_BASE_URL` deve corrispondere al path GitHub Pages. Con dominio custom impostare `/`; con path repo impostare `/nome-repo/`.

---

## Sviluppo locale

```bash
npm install
npm run dev       # http://localhost:5173 — genera projects.json all'avvio, proxy RSS attivo
npm run build     # build produzione in dist/ (bundle offuscato, no source map)
npm run preview   # anteprima locale del build produzione
```

All'avvio del dev server il plugin Vite controlla se `public/projects.json` esiste ed è fresco (< 5 minuti). Se assente o scaduto, lo genera automaticamente in background tramite la GitHub API pubblica (senza token). Il proxy `/api/rss` inoltra le richieste blog verso l'origine Hashnode per evitare problemi CORS in dev.

---

## Deploy

Il deploy è completamente automatizzato via **GitHub Actions**:

**Trigger automatici:**
- Push su branch `sourcecode`
- Schedule ogni 15 minuti
- Dispatch manuale (`workflow_dispatch`)

**Pipeline:**
1. Checkout + Node 24
2. `npm install`
3. `node scripts/fetch-projects.js` — fetch GitHub API pubblica → `public/projects.json`
4. `node scripts/fetch-posts.js` — fetch RSS Hashnode → `public/posts.json`
5. `npm run build` — bundle ottimizzato ed offuscato in `dist/`
6. Upload artifact + deploy su GitHub Pages

**Setup GitHub Pages (una tantum):**
- Settings → Pages → Source: **GitHub Actions**

---

## Versione e Build

| Campo | Valore |
|---|---|
| Versione | 0.1.1 |
| Build | R260626 |
| Aggiornato | 26 Giugno 2026 |

---

## Licenza

vlT Website è distribuito con **Proprietary Source-Available License** — Copyright © 2025–2026 Veronesi Lorenzo (vlT).

Il codice sorgente è reso pubblicamente consultabile a scopo di studio, ma rimangono espressamente vietati, senza previo consenso scritto del titolare:

- **Modifica** — adattamento, traduzione o creazione di opere derivate
- **Ridistribuzione** — copia, fork, ripubblicazione, sublicenza o repackaging
- **Reverse engineering** — decompilazione, disassemblaggio o ricostruzione del codice da binario
- **Sfruttamento commerciale** — vendita, incorporazione in prodotti/servizi commerciali

Tutti i diritti di proprietà intellettuale restano esclusivamente di Veronesi Lorenzo (vlT). Per richieste di licenza: [veronesilorenzo@outlook.com](mailto:veronesilorenzo@outlook.com)

---

**Copyright © 2026 vlT di Veronesi Lorenzo. Tutti i diritti riservati.**
