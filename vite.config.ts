import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  // 部署到 GitHub Pages 子路径时，将 base 改为 `/仓库名/`
  base: '/',
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server:{
    host: true,
    port: 5173,
    strictPort: false,
  }
})
