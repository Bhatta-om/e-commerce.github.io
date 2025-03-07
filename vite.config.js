import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/e-commerce.github.io/', // Assuming this is your repository name
  optimizeDeps: {
    include: ['jwt-decode']
  }
})

// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
//   optimizeDeps: {
//     include: ['jwt-decode']
//   },
//   server: {
//     proxy: {
//       '/auth': {
//         target: 'https://zd88bbhd-5000.inc1.devtunnels.ms',
//         changeOrigin: true,
//         secure: false
//       },
//       '/api': {
//         target: 'https://zd88bbhd-5000.inc1.devtunnels.ms',
//         changeOrigin: true,
//         secure: false
//       }
//     }
//   }
// })


