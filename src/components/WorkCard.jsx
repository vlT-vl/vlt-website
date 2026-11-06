import '../css/workcard.css'
import { TbBriefcase, TbMapPin } from 'react-icons/tb'
import S2ELogo from './S2ELogo.jsx'
import S2EEmblem from './S2EEmblem.jsx'
import portrait from '../res/vltportrait.jpg'
import { useText } from '../lib/uiText.js'

const COMPANY_NAME = import.meta.env.VITE_COMPANY_NAME ?? ''
const COMPANY_SITE_URL = import.meta.env.VITE_COMPANY_SITE_URL ?? null

const WorkCard = () => {
  const { t } = useText()
  const Tag = COMPANY_SITE_URL ? 'a' : 'div'
  const link = COMPANY_SITE_URL ? { href: COMPANY_SITE_URL, target: '_blank', rel: 'noopener noreferrer' } : {}
  return (
    <Tag className="work-card" data-reveal {...link}>
      <S2EEmblem className="work-card-mark" />
      <span className="work-card-logo"><S2ELogo /></span>
      <span className="work-card-company">
        <span className="work-card-company-in">
        <span className="work-line work-card-name"><span style={{ '--wl': 0 }}>{COMPANY_NAME}</span></span>
        <span className="work-line work-card-place">
          <span style={{ '--wl': 3 }}>
            <TbMapPin className="work-card-ico" aria-hidden="true" />
            {t('aboutme.workPlace')}
          </span>
        </span>
        </span>
      </span>
      <span className="work-card-me">
        <span className="work-line work-card-role">
          <span style={{ '--wl': 1 }}>
            <TbBriefcase className="work-card-ico work-card-ico--role" aria-hidden="true" />
            {t('aboutme.workRole')}
          </span>
        </span>
        <span className="work-line work-card-person">
          <span style={{ '--wl': 2 }}>
            <img className="work-card-photo" src={portrait} alt="" />
            Lorenzo Veronesi
          </span>
        </span>
      </span>
    </Tag>
  )
}

export default WorkCard
