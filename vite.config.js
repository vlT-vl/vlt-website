import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// public/posts.json e public/projects.json sono committati in git e aggiornati
// da GitHub Actions ogni 4h. In dev Vite li serve direttamente da public/.
// Nessun fetch esterno, nessun plugin di dati, nessun Playwright.

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react()],
    base: env.VITE_BASE_URL || '/',

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
