import { defineConfig } from 'vite';

export default defineConfig({
  // Base URL — '/' works for both Render and local dev
  base: '/',

  build: {
    outDir: 'dist',
    // Generate source maps for easier debugging on Render
    sourcemap: false,
    // Chunk size warning threshold (kb)
    chunkSizeWarningLimit: 600,
  },

  server: {
    port: 5173,
    host: true,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:3001',
        changeOrigin: true,
      },
    },
  },

  preview: {
    port: 4173,
    host: true,
  },
});
