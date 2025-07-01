// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  root: '.',              // This makes sure Vite starts from project root
  build: {
    outDir: 'dist',       // Default Vite build output
  },
})
