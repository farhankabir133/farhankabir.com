import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { visualizer } from 'rollup-plugin-visualizer';
import compression from 'vite-plugin-compression';

// Check if we're running bundle analysis
const isAnalyze = process.env.ANALYZE === 'true';

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
  plugins: [
    react(),
    // Gzip compression for production builds
    compression({
      algorithm: 'gzip',
      ext: '.gz',
      threshold: 1024, // Only compress files > 1KB
    }),
    // Brotli compression (better than gzip, widely supported)
    compression({
      algorithm: 'brotliCompress',
      ext: '.br',
      threshold: 1024,
    }),
    // Bundle analyzer - only when ANALYZE=true
    ...(isAnalyze ? [visualizer({
      filename: 'dist/stats.html',
      open: true,
      gzipSize: true,
      brotliSize: true,
    })] : []),
  ],
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
    // Enable minification with terser for better compression
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.log in production
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug'],
      },
      mangle: true,
      format: {
        comments: false, // Remove comments
      },
    },
    // Enable CSS code splitting and minification
    cssCodeSplit: true,
    cssMinify: true,
    // Generate source maps for debugging (can be disabled for smaller builds)
    sourcemap: false,
    // Set chunk size warning limit (KB)
    chunkSizeWarningLimit: 500,
    // Asset inlining threshold (4KB)
    assetsInlineLimit: 4096,
    rollupOptions: {
      output: {
        // Optimize chunk naming for better caching
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
        // Keep React and React DOM together to avoid internals error
        // Split other large libraries for better caching
        manualChunks(id) {
          if (!id) return;
          if (id.includes('node_modules')) {
            // IMPORTANT: Keep react, react-dom, scheduler, and react-dependent 3D libs together
            // Separating them causes "__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED" error
            if (
              id.includes('react') || 
              id.includes('react-dom') || 
              id.includes('scheduler') ||
              id.includes('@react-three') ||
              id.includes('three')
            ) {
              return 'react-vendor';
            }
            // Split large libraries into separate chunks for better caching
            if (id.includes('framer-motion')) {
              return 'framer-motion';
            }
            if (id.includes('firebase')) {
              return 'firebase';
            }
            if (id.includes('@tanstack')) {
              return 'tanstack';
            }
            // Group remaining vendor code
            return 'vendor';
          }
        },
      },
    },
    // Enable reporting for bundle analysis
    reportCompressedSize: true,
  },
  // Optimize server performance
  server: {
    // Enable HTTP/2 for development
    headers: {
      'Cache-Control': 'no-store',
    },
  },
  // Preview server configuration (for `vite preview`)
  preview: {
    headers: {
      // Add caching headers for preview
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  },
});