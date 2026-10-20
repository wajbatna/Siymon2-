import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

/**
 * Base path is configurable so the same code deploys anywhere:
 * - Local dev:            '/'                     (default)
 * - GitHub project pages: '/<repository-name>/'   (set SIYMON_BASE in the workflow)
 * The repository name is never hardcoded in source files.
 */
const base = process.env.SIYMON_BASE ?? '/';

export default defineConfig({
  plugins: [react()],
  base,
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    chunkSizeWarningLimit: 1400,
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    allowedHosts: true,
  },
  preview: {
    host: '0.0.0.0',
    port: 4173,
    allowedHosts: true,
  },
});
