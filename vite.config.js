import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined;

          if (id.includes('react') || id.includes('react-router-dom')) {
            return 'vendor-react';
          }

          if (id.includes('lucide-react')) {
            return 'vendor-icons';
          }

          if (id.includes('html2pdf') || id.includes('jspdf')) {
            return 'vendor-export';
          }

          return 'vendor';
        }
      }
    }
  },
  test: {
    include: [
      'tests/unit/**/*.test.js',
      'tests/integration/**/*.test.js'
    ],
    exclude: [
      'node_modules/**',
      'dist/**',
      'tests/**/*.spec.js',
      'tests/e2e/**'
    ],
    environment: 'jsdom'
  }
});
