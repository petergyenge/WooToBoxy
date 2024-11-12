import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/admin/api/2024-01': 'https://boxytest2.myshopify.com',
    }
  }
})
