import '../css/aboutme.css'
import { FaLinkedinIn } from 'react-icons/fa'
import lorenzoPhoto from '../res/vltportrait.jpg'

const COMPANY_NAME = import.meta.env.VITE_COMPANY_NAME ?? ''
const COMPANY_URL  = import.meta.env.VITE_COMPANY_URL  ?? null
const BLOG_URL     = import.meta.env.VITE_BLOG_URL     ?? null

const certs = [
  'VMware VCP-DCV 2023',
  'VMware VOP-CP · VOP-MSP · VOP-SC · VOP-SE',
  'VMware VSP-SV · VTSP-SV 2021',
  'Microsoft AZ-104 Azure Administrator',
  'SUSE Foundations 2023',
  'Parallels Mac Management Certified',
]

const certsInProgress = [
  'CKA — Certified Kubernetes Administrator',
  'Red Hat OpenShift Administration',
]

const AboutMe = () => (
  <section className="aboutme">

    <div className="aboutme-photo-col">
      <img className="aboutme-photo" src={lorenzoPhoto} alt="Lorenzo Veronesi" />
      <p className="aboutme-location">Novate Milanese · Milano, Italia</p>
      {COMPANY_NAME && (
        COMPANY_URL
          ? <a className="aboutme-company aboutme-company--link" href={COMPANY_URL} target="_blank" rel="noopener noreferrer">{COMPANY_NAME}</a>
          : <p className="aboutme-company">{COMPANY_NAME}</p>
      )}
      <a
        className="aboutme-linkedin-btn"
        href="https://it.linkedin.com/in/lorenzo-veronesi-8988ab18a"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Profilo LinkedIn"
      >
        <FaLinkedinIn className="linkedin-icon" />
        <span>LinkedIn</span>
      </a>
    </div>

    <div className="aboutme-content">
      <span className="section-eyebrow">about me</span>
      <h2 className="aboutme-title">Chi sono</h2>

      <p className="aboutme-text">
        Sono Lorenzo Veronesi: ingegnere di infrastrutture, sviluppatore e designer —
        e abbastanza curioso da non riuscire a limitarmi a una sola di queste cose.
        Mi piace risolvere problemi complessi, ma ancora di più mi piace farlo
        con le persone giuste intorno.
      </p>

      <p className="aboutme-text">
        Nel corso della mia carriera come Virtualization Solution Architect ho lavorato
        in diverse realtà del panorama tech milanese, accumulando esperienza quotidiana
        con VMware vSphere, Proxmox VE, Kubernetes, Windows Server e le principali
        distribuzioni Linux — Fedora, Red Hat Enterprise Linux, Ubuntu e Debian.
        Attualmente lavoro presso{COMPANY_URL
          ? <> <a className="aboutme-inline-company" href={COMPANY_URL} target="_blank" rel="noopener noreferrer">{COMPANY_NAME}</a>,</>
          : <> <strong>{COMPANY_NAME}</strong>,</>
        }
        dove progetto e gestisco infrastrutture enterprise ad alta disponibilità.
      </p>

      <p className="aboutme-text">
        Nel tempo libero sono sviluppatore, designer, blogger e appassionato videogiocatore.
        Ho collaborato con la community open source su GitHub e sviluppato progetti in
        Go, JavaScript, Node.js, React, Electron, PowerShell, Bash e Ruby.
        Il mio blog{BLOG_URL
          ? <> <a className="aboutme-inline-company" href={BLOG_URL} target="_blank" rel="noopener noreferrer">vlt.hashnode.dev</a></>
          : <> <strong>vlt.hashnode.dev</strong></>
        } raccoglie guide tecniche,
        progetti e soluzioni su infrastruttura e sviluppo software.
      </p>

      <p className="aboutme-text">
        La curiosità è il filo conduttore di tutto quello che faccio: dall'hypervisor
        all'interfaccia grafica, dall'automazione al design — ogni progetto è un'occasione
        per imparare qualcosa di nuovo e costruire qualcosa che funzioni davvero.
      </p>

      <div className="aboutme-certs">
        <span className="section-eyebrow" style={{ marginBottom: '0.75rem' }}>certificazioni</span>
        <ul className="certs-list">
          {certs.map(c => (
            <li key={c} className="cert-item">{c}</li>
          ))}
        </ul>
      </div>

      <div className="aboutme-certs">
        <span className="section-eyebrow" style={{ marginBottom: '0.75rem' }}>in corso</span>
        <ul className="certs-list">
          {certsInProgress.map(c => (
            <li key={c} className="cert-item cert-item--wip">{c}</li>
          ))}
        </ul>
      </div>
    </div>

  </section>
)

export default AboutMe
