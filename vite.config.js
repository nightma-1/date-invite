import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Если деплоишь на GitHub Pages в подпапку (username.github.io/repo-name),
// раскомментируй строку ниже и укажи имя своего репозитория.
// base: '/repo-name/',

export default defineConfig({
  plugins: [react()],
  // base: '/repo-name/',
})
