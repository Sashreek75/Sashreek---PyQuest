import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  server: {
    port: 3000,
    host: '0.0.0.0',
  },
  plugins: [react()],
  define: {
    // Vite does not polyfill Node globals like 'process' by default.
    // This definition prevents ReferenceErrors when accessing process.env.
    'process.env': '({})',
    'process': '({ env: {} })'
  },
  resolve: {
    alias: {
      '@': path.resolve('.'),
    }
  }
});