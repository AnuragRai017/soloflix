import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://api.themoviedb.org/3',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            proxyReq.setHeader('Authorization', 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4NmI1ZmE5Nzk1YWUyY2FkOTVkMWVkMmQwYzNiYWU1OSIsIm5iZiI6MTczOTUwNzI0Ny40NjEsInN1YiI6IjY3YWVjNjJmZjI2OGFiNTc4ZWJhZTQ1MyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.fIBpc21sXxhMMolmWMmhsfdVdpbSoaOalw5yY0_hYms');
          });
        },
      },
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});

export const config = {
  headers: {
    'Access-Control-Allow-Origin': 'https://vidapi.site',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': '*',
    'Cross-Origin-Embedder-Policy': 'require-corp',
    'Cross-Origin-Resource-Policy': 'cross-origin'
  }
};
