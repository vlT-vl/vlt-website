import '../css/dashshowcase.css'
import { useData } from '../context/DataContext.jsx'
import { useText } from '../lib/uiText.js'
import { themed } from '../lib/themed.js'
import DashMini from './DashMini.jsx'
import { RepoShowCard, PostShowCard } from './ShowCards.jsx'

const DashShowcase = ({ onRepo, onPost }) => {
  const { t } = useText()
  const { repos, repoImages, reposLoading, posts, postsLoading, postsError } = useData()
  const latestRepo = repos[0] ?? null
  const latestPost = posts[0] ?? null

  return (
    <div className="ds">
      <div className="ds-grid">
        <RepoShowCard
          repo={latestRepo}
          image={latestRepo ? (repoImages[latestRepo.name] ?? null) : null}
          loading={reposLoading}
          onOpen={onRepo}
          dd="1.5s"
          accent={themed('#FB923C')}
          label={t('dash.project')}
        />
        <PostShowCard
          post={latestPost}
          loading={postsLoading}
          error={postsError}
          onOpen={onPost}
          dd="1.7s"
          accent={themed('#818CF8')}
          label={t('dash.article')}
        />
      </div>

      <DashMini repos={repos} repoImages={repoImages} posts={posts} onRepo={onRepo} onPost={onPost} />
    </div>
  )
}

export default DashShowcase
