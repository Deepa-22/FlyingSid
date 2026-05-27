import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/drive': {
        target: 'https://www.googleapis.com',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api\/drive/, '/drive/v3/files'),
      },
      '/api/img': {
        target: 'https://drive.usercontent.google.com',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api\/img/, '/download'),
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          motion: ['framer-motion'],
        },
      },
    },
  },
})
