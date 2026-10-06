import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    // NanoGuide chat API
    proxy: {
      '/api': {
        target: 'http://4.247.143.232:8000',
        changeOrigin: true,
      },
    },
    // Don't watch huge static folders (MesoProbe alone is ~625MB / 1380 frames).
    // Watching them can freeze Vite so the browser spins forever on localhost.
    watch: {
      ignored: [
        '**/public/MesoProbe/**',
        '**/public/NG80/**',
        '**/public/Uprobe500/**',
        '**/public/PDF/**',
        '**/public/Brochure/**',
        '**/public/Products_Image/**',
        '**/public/**/*.mp4',
        '**/public/**/*.mov',
        '**/dist/Chatbotdata/**',
      ],
    },
  },
  build: {
    chunkSizeWarningLimit: 2000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/react-dom') || id.includes('node_modules/react/') || id.includes('node_modules/react-router')) {
            return 'vendor-react'
          }
          if (id.includes('node_modules/framer-motion')) return 'vendor-motion'
          if (id.includes('node_modules/react-helmet-async')) return 'vendor-seo'
          if (id.includes('node_modules/three') || id.includes('@react-three')) return 'vendor-three'
          return undefined
        },
      },
    },
  },
})
