import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    headers: {
      // Helpful for WebGPU / WASM workers during local LLM use
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'credentialless',
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
  optimizeDeps: {
    exclude: ['@mlc-ai/web-llm'],
  },
  build: {
    chunkSizeWarningLimit: 6500,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/@mlc-ai/web-llm')) return 'vendor-webllm'
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
