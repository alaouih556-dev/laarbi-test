import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import { fileURLToPath } from 'node:url'

export default defineConfig({
  // Escape non-ASCII literals in generated JS. This keeps French copy readable
  // even if a static host serves a bundle with a missing/incorrect charset.
  esbuild: { charset: 'ascii' },
  plugins: [tanstackRouter({ autoCodeSplitting: false }), react(), tailwindcss()],
  server: {
    host: '127.0.0.1',
    port: 5176,
    strictPort: true,
    proxy: {
      '/api': 'http://127.0.0.1:8787',
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
