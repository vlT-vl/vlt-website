<p align="center">
  <img src="src/res/vltcube.svg" alt="vlT Website" width="80" />
</p>

<h1 align="center">vlT Website — Portfolio Personale</h1>

<p align="center">
  Sito web e portfolio di Lorenzo Veronesi · Virtualization Architect · Developer · Designer<br/>
  <sub>Frontend React · Vite · Deploy automatico su GitHub Pages</sub>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/versione-0.1.5--R061126-blue?style=flat-square" alt="versione"/>
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
               └── posts.json   → articoli blog pre-generati da RSS Hashnode

GitHub Actions
  push                  → rigenera JSON + build + deploy
  schedule ogni ora     → rigenera JSON + build + deploy
  workflow_dispatch     → rigenera JSON + build + deploy
```

Vengono inclusi solo i repository pubblici: un repository reso privato esce dal sito alla prima rigenerazione dei dati.

Non richiede backend: i dati GitHub dei progetti e i post del blog vengono generati dentro GitHub Actions e inclusi come JSON statici nell'artifact GitHub Pages. I JSON generati sono committati nel repository come ultimo stato noto buono: ogni run (push/schedule/dispatch) li rigenera e li ricommitta, così il sito ha sempre dati validi da servire anche se un run futuro non riesce a fare fetch.

---

## Sezioni del sito

| Sezione | Descrizione |
|---|---|
| **Home** | Apertura in motion design: logo vlT centrato a tutto schermo che si costruisce a linee disegnate, poi nome e slogan "From hypervisor to interface"; il gruppo si riduce nell'header e infine entrano in animazione titolo e card; l'entrata completa si riproduce a ogni caricamento, durante la navigazione interna parte già nello stato finale. Tre card competenze che si espandono da sole, al clic e al passaggio del mouse; card ultimo progetto e ultimo articolo con anteprima animata all'hover; 2 caroselli di mini card che entrano quando compaiono in vista |
| **About Me** | Profilo con nome animato, pillole di contatto LinkedIn/Email (l'Email apre un modale con oggetto e testo precompilati e modificabili), testo con selettore laterale che segue il paragrafo letto, card «Dove lavoro», certificazioni Credly |
| **About vlT** | Storia e filosofia del brand vlT, card di competenze infrastruttura e sviluppo |
| **Progetti** | Card progetto con la stessa animazione hover della home (anteprima con linguaggi, file e commit), ricerca con pulsante di cancellazione, filtro per linguaggio dinamico rispetto alla ricerca, modale con README renderizzato, statistiche e licenza |
| **Blog** | Card articolo orizzontali con la stessa animazione hover della home (copertina espansa), ricerca con pulsante di cancellazione, filtri per tag dinamici rispetto alla ricerca, lettura in modale con cover image |

Tema chiaro/scuro selezionabile dal pulsante in navbar (persistito in localStorage, default sul tema di sistema). Accanto al tema, in navbar, ci sono il cambio lingua italiano/inglese (persistito in localStorage, default sulla lingua del browser; tutti i testi sono nel dizionario `src/lib/uiText.js`) e il pulsante info che apre il modale About. Il logo in footer e le label "Built with React & Vite" / versione aprono il modale **About vlT Website** con logo animato + wordmark "website", versione, build, data aggiornamento e elenco dipendenze.

---

## Integrazione dati

| Sorgente | Dati | Modalità |
|---|---|---|
| `public/projects.json` | Lista repo, README HTML, immagini, licenze, statistiche, dashboard per-repo (`dash`: linguaggi, file root, ultimi 5 commit, ultima release) | Generato e **committato** da CI a ogni deploy e ogni ora |
| `public/credly.json` | Badge Credly pubblici (nome, ente, immagine originale, date, link) per le card certificazioni di About Me; vengono mostrati tutti i badge pubblici del profilo | Generato da `scripts/fetch-credly.js` (endpoint pubblico del profilo Credly) e **committato** da CI a ogni deploy e ogni ora; se il fetch fallisce resta l'ultimo file valido |
| `public/posts.json` | Articoli blog | Generato da RSS Hashnode e **committato** da CI a ogni deploy e ogni ora; fallback Playwright se Vercel sfida il fetch HTTP |

Entrambi i file sono tracciati in git (non più in `.gitignore`): rappresentano l'ultimo stato noto buono, sempre disponibile per il deploy anche se un run CI futuro fallisce il fetch.

Gli script fanno **merge**, non sostituzione in blocco, con l'ultimo JSON committato: se una singola chiamata API fallisce (rate limit, errore di rete) il dato precedente viene mantenuto invece di sparire; per i post, quelli usciti dalla finestra del feed RSS (che espone solo i più recenti) restano comunque nel JSON finché non vengono sostituiti da una versione più recente dello stesso articolo.

Il client non chiama `api.github.com` o RSS esterni a runtime: usa solo asset statici per evitare rate-limit, CORS e blocchi WAF lato visitatore.

Cache lato client (localStorage): repos 1 ora · posts 2 ore.

---

## Architettura

```
vlt-website/
├── index.html
├── vite.config.js          # React plugin, base path, build minificato oxc
├── package.json
├── .env                    # variabili VITE_* (valori pubblici, committato)
│
├── scripts/
│   ├── fetch-projects.js   # fetch GitHub API → public/projects.json
│   ├── fetch-posts.js      # fetch RSS Hashnode → public/posts.json
│   └── fetch-credly.js     # fetch badge Credly → public/credly.json
│
├── .github/
│   └── workflows/
│       └── deploy.yml      # build + deploy su GitHub Pages (push/schedule/dispatch)
│
├── public/
│   ├── vltcube.svg
│   ├── projects.json       # generato e committato da CI (fallback sempre disponibile)
│   ├── posts.json          # generato e committato da CI (fallback sempre disponibile)
│   └── credly.json         # badge Credly, generato e committato da CI
│
└── src/
    ├── main.jsx
    ├── lib/
    │   ├── uiText.js           # dizionario IT/EN, hook useText, cambio lingua
    │   ├── theme.js            # preferenza tema (system/light/dark), applica data-theme su <html>
    │   ├── themed.js           # adatta i colori al tema attivo
    │   ├── timing.js           # tempi del carosello competenze letti dalle variabili d'ambiente
    │   ├── intro.js            # stato dell'apertura e preferenza di movimento ridotto
    │   ├── nameMotion.js       # animazione del nome dalle iniziali
    │   ├── network.js          # dati dello sfondo a rete
    │   ├── useReveal.js        # ingresso in animazione allo scroll
    │   └── vendorIcons.js      # icone per tecnologia
    ├── context/
    │   └── DataContext.jsx     # lettura JSON statici, caching TTL localStorage
    ├── components/
    │   ├── App.jsx             # root: routing view a stato, navbar, footer
    │   ├── Navbar.jsx
    │   ├── Theme.jsx           # pulsante toggle tema chiaro/scuro
    │   ├── Hero.jsx
    │   ├── Landing.jsx         # home: titolo, carosello competenze, card in evidenza + mini card
    │   ├── DashShowcase.jsx    # home: ultimo progetto e ultimo articolo
    │   ├── DashMini.jsx        # home: caroselli di mini card
    │   ├── DashShared.jsx      # helper condivisi (pill, icone linguaggio, colori tag, rotazione)
    │   ├── ShowCards.jsx       # card progetto/articolo con anteprima hover, usate in home, Progetti e Blog
    │   ├── AboutMe.jsx
    │   ├── AnimatedName.jsx    # nome animato dalle iniziali
    │   ├── WorkCard.jsx        # card «Dove lavoro»
    │   ├── S2ELogo.jsx / S2EEmblem.jsx
    │   ├── ContactModal.jsx    # modale contatto con oggetto e testo precompilati
    │   ├── VltView.jsx
    │   ├── ProjectsView.jsx    # elenco progetti con ricerca e filtro linguaggio dinamico
    │   ├── BlogView.jsx        # elenco articoli con ricerca e filtro tag dinamico
    │   ├── VltLogo.jsx         # logo animato cubo SVG + testo vlT
    │   ├── NetBackdrop.jsx     # sfondo a rete animata
    │   ├── RepoMark.jsx        # filigrana del progetto nelle card
    │   ├── SitePill.jsx        # pill con indirizzo del sito GitHub Pages
    │   ├── RepoModal.jsx       # modale repo: README + dettagli + licenza
    │   ├── BlogPostModal.jsx   # modale articolo: hero cover + contenuto completo
    │   ├── LicenseModal.jsx    # modale testo licenza (riusato anche da AboutModal)
    │   └── AboutModal.jsx      # modale info sito: logo esteso, versione/build, dipendenze
    ├── css/                    # variabili tema (index.css) + un file per componente/vista
    └── res/
        ├── vltcube.svg
        ├── nexcube.svg
        ├── svgdesigner.svg
        ├── vltportrait.jpg
        └── landinglogo.webp
```

---

## Tema chiaro/scuro

Tutto il sito usa variabili CSS custom properties definite in `src/css/index.css`:

- `--bg`, `--bg-elevated`, `--bg-elevated-2`, `--bg-hover`, `--border`, `--border-strong`, `--text`, `--text-muted`, `--text-dim`, `--accent`, `--accent-hover` — palette generale (navbar, footer, card, modali).
- `--gh-*` — palette separata "stile GitHub" per gli elementi che imitano l'estetica GitHub (repo card, README renderizzato, licenza), con equivalenti dark/light propri (GitHub dark/light reali).

Il tema attivo è impostato come `data-theme="dark"|"light"` su `<html>` da `src/lib/theme.js`, letto da `html[data-theme='light'] { ... }` in `index.css` che sovrascrive le variabili. Preferenza persistita in `localStorage` (`vlt-theme`); default `system` (segue `prefers-color-scheme`, con listener per aggiornamenti live). Toggle in navbar (`Theme.jsx`).

Colori intenzionalmente non tematizzati (restano fissi in entrambi i temi): badge LinkedIn, colori linguaggio repo (`LANG_COLORS` in `RepoModal.jsx`), link blu stile GitHub, overlay scuro sulle cover foto in `BlogPostModal`.

---

## Configurazione

Il file `.env` è committato nel repo (nessun dato sensibile):

```env
VITE_GITHUB_USER=
VITE_BLOG_URL=
VITE_COMPANY_NAME=
VITE_COMPANY_URL=
VITE_COMPANY_SITE_URL=
VITE_CONTACT_EMAIL=
VITE_BASE_URL=
VITE_WHAT_FIRST_EXPAND_SECONDS=
VITE_WHAT_REST_SECONDS=
VITE_WHAT_EXPAND_SECONDS=
VITE_WHAT_COLLAPSE_SECONDS=
VITE_WHAT_TEXT_START_DELAY_SECONDS=
VITE_WHAT_PARAGRAPH_PAUSE_SECONDS=
VITE_WHAT_TEXT_END_PAUSE_SECONDS=
VITE_WHAT_REVEAL_DELAY_SECONDS=
VITE_WHAT_REVEAL_STAGGER_SECONDS=
VITE_WHAT_REVEAL_SECONDS=
VITE_WHAT_IN_SECONDS=
VITE_WHAT_OUT_SECONDS=
VITE_WHAT_GAP_SECONDS=
VITE_WHAT_PILL_SECONDS=
```

Le variabili `VITE_WHAT_*` regolano i tempi (in secondi) del carosello delle competenze in home: prima espansione, pausa a card chiuse tra un'espansione e l'altra, durata di apertura e chiusura, ingresso e uscita del contenuto, attesa prima dello scorrimento del testo, pausa tra paragrafi e pausa finale, ritardo e cadenza della comparsa degli elementi, velocità del carosello delle pill. I tempi si impostano solo da qui, senza valori fissi nel codice. `VITE_CONTACT_EMAIL` è l'indirizzo del modale di contatto in About Me; `VITE_COMPANY_SITE_URL` è il link della card «Dove lavoro».

`VITE_BASE_URL` deve corrispondere al path GitHub Pages. Con dominio custom impostare `/`; con path repo impostare `/nome-repo/`.

---

## Sviluppo locale

```bash
npm install
npm run dev       # rigenera projects.json/posts.json (hook predev) poi avvia Vite su :5173
npm run build     # build produzione in dist/ (bundle minificato oxc, no source map)
npm run preview   # anteprima locale del build produzione
```

`npm run dev` esegue automaticamente lo script `predev` (`CI=true node scripts/fetch-projects.js && CI=true node scripts/fetch-posts.js && CI=true node scripts/fetch-credly.js`) prima di avviare Vite, così `public/projects.json`/`public/posts.json` sono sempre freschi in locale. `GITHUB_TOKEN` non è richiesto esplicitamente: `fetch-projects.js` usa `gh auth token` in automatico se disponibile.

Per rigenerare solo uno dei JSON senza avviare Vite:

```bash
npm run fetch:projects
npm run fetch:posts
npm run fetch:credly
```

`fetch-posts.js` prova prima l'RSS Hashnode con HTTP normale; se Vercel risponde con challenge/429 usa Playwright Chromium per leggere `https://vlt.hashnode.dev/rss.xml` come un browser e poi produce lo stesso schema JSON.

---

## Deploy

Il deploy è completamente automatizzato via **GitHub Actions**:

**Trigger:**
- Push su branch `sourcecode`
- Schedule ogni ora — aggiorna progetti e post e ridistribuisce l'artifact
- Dispatch manuale (`workflow_dispatch`) — aggiorna progetti e post e ridistribuisce l'artifact

**Pipeline:**
1. Checkout + Node 20
2. `npm install`
3. `node scripts/fetch-projects.js` — GitHub API → `public/projects.json`
4. `npx playwright install --with-deps chromium`
5. `node scripts/fetch-posts.js` — RSS Hashnode → `public/posts.json`
6. `node scripts/fetch-credly.js` — badge Credly → `public/credly.json`
7. **Commit** dei JSON aggiornati su `sourcecode` (solo se cambiati; messaggio con `[skip ci]` per non ritriggerare il workflow via push)
8. `npm run build` — bundle ottimizzato in `dist/`
9. Upload artifact + deploy su GitHub Pages

Il workflow committa i JSON rigenerati (`permissions: contents: write`) così restano sempre disponibili nel repo come fallback, oltre a finire nell'artifact pubblicato da GitHub Pages.

**Setup GitHub Pages (una tantum):**
- Settings → Pages → Source: **GitHub Actions**

---

## Versione e Build

| Campo | Valore |
|---|---|
| Versione | 0.1.5 |
| Build | R061126 |
| Aggiornato | 6 Novembre 2026 |

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
