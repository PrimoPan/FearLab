import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { imageBaseUrlFromEnvironment, imageMime } from './scripts/media/image-assets.mjs'

export default defineConfig(({ command }) => {
  const imageBase = command === 'build' ? imageBaseUrlFromEnvironment() : undefined

  return {
    plugins: [tailwindcss(), react()],
    build: imageBase ? {
      assetsInlineLimit: file => imageMime(file) ? false : undefined
    } : undefined,
    experimental: imageBase ? {
      renderBuiltUrl(filename, { type }) {
        if (type === 'asset' && imageMime(filename)) return `${imageBase}${filename}`
      }
    } : undefined,
    server: {
      host: '0.0.0.0',
      port: 3001,
      proxy: { '/api': 'http://127.0.0.1:3002' }
    },
    preview: {
      host: '0.0.0.0',
      port: 3001,
      proxy: { '/api': 'http://127.0.0.1:3002' }
    }
  }
})
