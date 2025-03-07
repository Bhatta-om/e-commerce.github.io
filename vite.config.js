import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/e-commerce.github.io/',
  build: {
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        assetFileNames: 'assets/[name].[ext]'
      }
    }
  },
  optimizeDeps: {
    include: ['jwt-decode']
  },
  server: {
    proxy: {
      '/auth': {
        target: 'https://zd88bbhd-5000.inc1.devtunnels.ms',
        changeOrigin: true,
        secure: false
      },
      '/api': {
        target: 'https://zd88bbhd-5000.inc1.devtunnels.ms',
        changeOrigin: true,
        secure: false
      }
    }
  }
})


