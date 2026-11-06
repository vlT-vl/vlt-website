import { TbWorld } from 'react-icons/tb'
import '../css/sitepill.css'
import { useText } from '../lib/uiText.js'

export const siteLabel = url => url.replace(/^https?:\/\//, '').replace(/\/$/, '')

const SitePill = ({ url }) => {
  const { t } = useText()
  if (!url) return null
  return (
    <a
      className="site-pill"
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${t('common.openSite')}: ${siteLabel(url)}`}
      onClick={e => e.stopPropagation()}
      onKeyDown={e => e.stopPropagation()}
    >
      <TbWorld className="site-pill-icon" aria-hidden="true" />
      <span className="site-pill-text">{siteLabel(url)}</span>
    </a>
  )
}

export default SitePill
