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
