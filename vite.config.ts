import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  // Base public path when served from GitHub Pages. Set to the repository
  // name so static assets resolve correctly when the site is served from
  // https://<user>.github.io/<repo>/ (example: '/mysite/').
  // If you deploy to a different repo or a user site, adjust this value or
  // override via an environment variable.
  // Use root base for serving from a custom domain or user/organization site.
  // Previously set to '/mysite/' for project pages; switch to '/' so
  // assets are requested from the site root (e.g. '/assets/...') when
  // using a custom domain like farhankabir.me.
  base: '/',
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
    // Prevent multiple React copies from being bundled (dedupe imports)
    dedupe: ['react', 'react-dom'],
  },
  optimizeDeps: {
    // Ensure react and react-dom are pre-bundled to avoid ESM/UMD interop issues
    include: ['react', 'react-dom'],
    exclude: ['lucide-react'],
  },
  build: {
    rollupOptions: {
      output: {
        // Bundle all node_modules into a single vendor chunk. This reduces the
        // chance of cross-chunk circular imports triggering "Cannot access
        // '<id>' before initialization" at runtime. If you later need fine-
        // grained caching for individual large libs, reintroduce manual
        // splitting carefully.
        manualChunks(id) {
          if (!id) return;
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
      },
    },
  },
});