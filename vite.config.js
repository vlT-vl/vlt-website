import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { generateProjectsPayload } from './scripts/fetch-projects.js'

const projectsDevMiddleware = () => {
  let cached = null
  let cachedAt = 0
  const ttl = 5 * 60 * 1000

  return {
    name: 'vlt-projects-json-dev',
    configureServer(server) {
      server.middlewares.use('/projects.json', async (_req, res) => {
        try {
          if (!cached || Date.now() - cachedAt > ttl) {
            cached = (await generateProjectsPayload()).payload
            cachedAt = Date.now()
          }
          res.statusCode = 200
          res.setHeader('Content-Type', 'application/json; charset=utf-8')
          res.end(JSON.stringify(cached))
        } catch (e) {
          res.statusCode = 503
          res.setHeader('Content-Type', 'application/json; charset=utf-8')
          res.end(JSON.stringify({ generatedAt: null, repos: [], error: e.message }))
        }
      })
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const blogOrigin = (() => {
    try { return new URL(env.VITE_BLOG_URL || '').origin } catch { return 'https://vlt.hashnode.dev' }
  })()

  return {
    plugins: [react(), projectsDevMiddleware()],
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

    esbuild: {
      drop:             ['console', 'debugger'],
      legalComments:    'none',
      minifyIdentifiers: true,
      minifySyntax:      true,
      minifyWhitespace:  true,
    },

    build: {
      minify:    'esbuild',
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
