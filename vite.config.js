import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const localDevApiOrigin = `http://127.0.0.1:${process.env.PORT || '4000'}`;

const localDevServer =
  process.env.CEOS_E2E === 'true'
    ? {}
    : {
        server: {
          proxy: {
            '/api': {
              target: localDevApiOrigin,
              changeOrigin: false
            }
          }
        }
      };

export default defineConfig({
  plugins: [react()],
  // Isolated E2E sets CEOS_E2E and supplies its own /api proxy.
  // This proxy exists only for `vite` local development.
  ...localDevServer,
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
      'tests/unit/**/*.test.{js,jsx}',
      'tests/integration/**/*.test.{js,jsx}'
    ],
    exclude: [
      'node_modules/**',
      'dist/**',
      'tests/**/*.spec.{js,jsx}',
      'tests/e2e/**',
      'tests/**/generated/**',
      'docs/academy/screenshots/**'
    ],
    setupFiles: ['tests/setup/isolatedTestEnvironment.js'],
    environment: 'jsdom'
  }
});
