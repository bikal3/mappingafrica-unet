import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// When deploying to GitHub Pages the app lives at:
//   https://<user>.github.io/<repo>/
// Set VITE_BASE env var to "/<repo>/" in CI (see .github/workflows/deploy.yml).
// Locally it runs at "/" with no env var needed.
export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE || '/',
  server: {
    proxy: {
      '/api': 'http://localhost:8000',
    },
  },
})
