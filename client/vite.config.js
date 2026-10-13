import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // In development the browser talks to Vite, which forwards /api to Express.
    // This keeps the auth cookie same-origin, so no CORS or SameSite headaches.
    proxy: { '/api': { target: 'http://localhost:5000', changeOrigin: true } },
  },
});
