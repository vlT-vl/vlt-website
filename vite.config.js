import { defineConfig, loadEnv } from 'vite'
import { writeFileSync, existsSync, statSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import react from '@vitejs/plugin-react'
import { generateProjectsPayload } from './scripts/fetch-projects.js'

const OUT_FILE = join(dirname(fileURLToPath(import.meta.url)), 'public', 'projects.json')
const DEV_TTL  = 5 * 60 * 1000   // rigenera se il file ha più di 5 minuti

const projectsDevPlugin = () => ({
  name: 'vlt-projects-dev',
  configureServer() {
    const isStale = () => {
      if (!existsSync(OUT_FILE)) return true
      return Date.now() - statSync(OUT_FILE).mtimeMs > DEV_TTL
    }

    if (!isStale()) {
      console.log('[vlt-dev] projects.json recente, skip generazione')
      return
    }

    console.log('[vlt-dev] generazione projects.json in background…')
    generateProjectsPayload()
      .then(({ payload }) => {
        writeFileSync(OUT_FILE, JSON.stringify(payload, null, 2) + '\n', 'utf8')
        console.log(`[vlt-dev] projects.json pronto (${payload.repos.length} repo)`)
      })
      .catch(e => console.warn(`[vlt-dev] projects.json fallito: ${e.message}`))
  },
})

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const blogOrigin = (() => {
    try { return new URL(env.VITE_BLOG_URL || '').origin } catch { return 'https://vlt.hashnode.dev' }
  })()

  return {
    plugins: [react(), projectsDevPlugin()],
    base: env.VITE_BASE_URL || '/',

    server: {
      proxy: {
        '/api/rss': {
          target:       blogOrigin,
          changeOrigin: true,
          rewrite:      () => '/rss.xml',
        },
      },
    },

    build: {
      minify:    'oxc',
      sourcemap: false,
      rollupOptions: {
        output: {
          chunkFileNames:  'assets/[hash].js',
          entryFileNames:  'assets/[hash].js',
          assetFileNames:  'assets/[hash][extname]',
        },
      },
    },
  }
})
