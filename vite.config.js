import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import PrerenderPlugin from 'vite-plugin-prerender'

export default defineConfig({
  plugins: [
    react(),
    PrerenderPlugin({
      staticDir: path.join(__dirname, 'dist'),
      routes: ['/'],
    }),
  ],
  resolve: {
    alias: { '@': path.join(__dirname, 'src') },
  },
})