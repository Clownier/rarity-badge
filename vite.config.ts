import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react()
  ],
  base: './', // 修改基础路径为相对路径，解决资源加载问题
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom']
          // 移除对react-router-dom的引用，因为项目中未使用
        }
      }
    }
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
})
