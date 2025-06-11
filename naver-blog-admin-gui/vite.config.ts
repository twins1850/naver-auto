import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // 벤더 라이브러리 분할
          "react-vendor": ["react", "react-dom"],
          "mui-vendor": [
            "@mui/material",
            "@mui/icons-material",
            "@emotion/react",
            "@emotion/styled",
          ],
          "router-vendor": ["react-router-dom"],
          "http-vendor": ["axios"],
          utils: ["zustand"],
        },
      },
    },
    chunkSizeWarningLimit: 300, // 300KB 경고 임계값 설정
  },
  server: {
    port: 5173,
    host: true,
    hmr: {
      overlay: false, // HMR 오류 오버레이 비활성화
      clientPort: 5173, // 웹소켓 포트 고정
      host: "localhost", // 웹소켓 호스트 고정
    },
    proxy: {
      "/auth": "http://localhost:8000",
      "/notices": "http://localhost:8000",
      "/licenses": "http://localhost:8000",
      "/purchases": "http://localhost:8000",
      // 필요시 추가 엔드포인트
    },
    watch: {
      usePolling: false, // 파일 감시 최적화
      interval: 1000,
    },
  },
});
