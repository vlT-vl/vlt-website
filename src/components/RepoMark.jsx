import '../css/repomark.css'
import { GoRepo } from 'react-icons/go'

const RepoMark = ({ repo, image }) => {
  if (image) {
    return (
      <img
        className="repo-mark repo-mark--image"
        src={image}
        alt=""
        aria-hidden="true"
        loading="lazy"
        onError={e => { e.currentTarget.style.display = 'none' }}
      />
    )
  }
  return <GoRepo className="repo-mark" aria-hidden="true" />
}

export default RepoMark
