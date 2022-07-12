import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { createSvg } from './src/icons/index'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), createSvg('./src/icons/svg/')],
  server: {
    port: 3000,
    proxy: {
      "/api": {
        rewrite: (path) => path.replace(/^\/api/, ""),
        target: "http://localhost:8080",
        changeOrigin: true,
      },
    },
  },

})
