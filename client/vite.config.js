import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // 경로가 /api로 시작하는 요청을 대상
      '/api': {
        target: 'http://localhost:3000', // 백엔드 서버 주소
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
