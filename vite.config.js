import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './',  // GitHub Pages用にベースパスを設定
  build: {
    outDir: 'dist'
  }
})
