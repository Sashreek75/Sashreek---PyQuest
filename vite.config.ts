
import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  server: {
    port: 3000,
    host: '0.0.0.0',
  },
  plugins: [react()],
  resolve: {
    alias: {
      // Fix: Use path.resolve('.') to define the project root alias, avoiding __dirname which is unavailable in standard ESM environments
      '@': path.resolve('.'),
    }
  }
});
