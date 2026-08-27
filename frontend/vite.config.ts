import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '127.0.0.1',
    port: 5173,
    strictPort: true,
    hmr: {
      host: '127.0.0.1',
    },
    proxy: {
      '/api': {
        target: 'http://localhost/car-rental-system/backend',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/index.php/api'),
      },
    },
  },
})