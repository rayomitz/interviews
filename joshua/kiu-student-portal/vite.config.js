import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Allows: import { Button } from '@/components/ui'
      // Instead of: import { Button } from '../../components/ui'
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})