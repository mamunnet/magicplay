import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['@libsql/client'],
    include: ['promise-limit'],
    esbuildOptions: {
      mainFields: ['module', 'main']
    }
  },
  resolve: {
    alias: {
      'promise-limit': 'promise-limit/index.js'
    }
  },
  build: {
    target: 'esnext',
    commonjsOptions: {
      include: [/node_modules/],
      transformMixedEsModules: true
    }
  },
  server: {
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp'
    },
    middlewareMode: false
  },
  assetsInclude: ['**/*.wasm']
});