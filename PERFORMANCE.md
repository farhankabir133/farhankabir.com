# Performance Optimization Guide

This document outlines all the Lighthouse performance, SEO, and best practices optimizations implemented for `farhankabir.me`.

## Overview of Changes

### 1. Image Optimization

#### Open Graph Images
- Updated OG images to use Pexels' on-the-fly WebP conversion with query parameters:
  ```html
  <!-- Before -->
  <meta property="og:image" content="https://images.pexels.com/photos/35383997/pexels-photo-35383997.png" />
  
  <!-- After - WebP optimized with reduced dimensions -->
  <meta property="og:image" content="https://images.pexels.com/photos/35383997/pexels-photo-35383997.png?auto=compress&cs=tinysrgb&w=1200&fm=webp" />
  ```

#### Local Image Optimization Script
Run the image optimization script to convert local images:
```bash
npm run optimize:images
```

This script:
- Converts images to WebP and AVIF formats
- Generates responsive image sizes (320w, 640w, 768w, 1024w, 1280w, 1920w)
- Creates optimized OG images in multiple dimensions

#### OptimizedImage Component
Use the new `OptimizedImage` component for all images:
```tsx
import OptimizedImage from '@/components/OptimizedImage';

<OptimizedImage
  src="/images/hero.jpg"
  alt="Hero image"
  width={800}
  height={600}
  priority={true}  // For above-the-fold images
  sizes="(max-width: 768px) 100vw, 50vw"
/>
```

### 2. Render-Blocking Resource Optimization

#### Critical CSS Inlining
Critical CSS is now inlined directly in `index.html` `<head>`:
- Box-sizing reset
- Body/html base styles
- Dark mode variables
- Hero section layout
- Font loading fallback styles

#### Font Loading Strategy
1. **DNS Prefetch**: Added for Google Fonts domains
2. **Preconnect**: High-priority connection to font origins
3. **Preload**: Critical font stylesheet preloaded
4. **Async Loading**: Fonts load asynchronously via `media="print" onload="this.media='all'"` technique
5. **Font Display Swap**: Ensures text is visible during font load
6. **Font Loading API**: JavaScript detects when fonts are loaded to remove FOUT class

```html
<!-- DNS Prefetch -->
<link rel="dns-prefetch" href="https://fonts.googleapis.com" />

<!-- Preconnect -->
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />

<!-- Async font loading -->
<link href="..." rel="stylesheet" media="print" onload="this.media='all'" />
```

#### JavaScript Loading
- Vite automatically handles code splitting and deferred loading
- Vendor chunks are separated for better caching
- Large libraries (framer-motion, firebase, tanstack) have dedicated chunks

### 3. Caching Strategy

#### Firebase Hosting Headers (`firebase.json`)
```json
{
  "headers": [
    {
      "source": "**/*.@(js|css)",
      "headers": [{ "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }]
    },
    {
      "source": "**/*.@(jpg|jpeg|gif|png|svg|webp|avif|ico)",
      "headers": [{ "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }]
    },
    {
      "source": "**/*.@(woff|woff2|ttf|otf|eot)",
      "headers": [{ "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }]
    },
    {
      "source": "index.html",
      "headers": [{ "key": "Cache-Control", "value": "no-cache, no-store, must-revalidate" }]
    }
  ]
}
```

Key points:
- **Static assets**: 1-year cache with `immutable` flag (hash-based filenames)
- **HTML**: No caching to ensure users always get latest version
- **Security headers**: X-Content-Type-Options, X-Frame-Options, etc.

### 4. Build Optimization

#### Vite Configuration (`vite.config.ts`)
- **Terser minification**: Removes console.log, debugger statements, and comments
- **CSS code splitting**: Separates CSS for better caching
- **Chunk optimization**: Strategic code splitting by library
- **Compression**: Gzip and Brotli pre-compression for static assets

```bash
# Build with bundle analysis
npm run build:analyze
```

### 5. Code Cleanup

#### Bundle Analysis
After building with `npm run build:analyze`, a visual bundle report opens showing:
- Bundle sizes (raw, gzipped, brotli)
- Module dependencies
- Opportunities for tree-shaking

#### Removing Unused Code
1. **Unused imports**: Enable `noUnusedLocals` and `noUnusedParameters` in `tsconfig.json`
2. **PurgeCSS**: Tailwind's built-in purge removes unused CSS classes
3. **Tree shaking**: Vite/Rollup automatically removes unused exports

### 6. Additional SEO Improvements

#### Meta Tags Added
```html
<meta name="robots" content="index, follow, max-image-preview:large" />
<meta name="author" content="Farhan Kabir" />
<meta name="theme-color" content="#0f172a" media="(prefers-color-scheme: dark)" />
<meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)" />
```

## NPM Scripts

| Script | Description |
|--------|-------------|
| `npm run build` | Production build with all optimizations |
| `npm run build:analyze` | Build with bundle visualization |
| `npm run optimize:images` | Convert images to WebP/AVIF |
| `npm run lighthouse` | Run Lighthouse audit |

## Performance Checklist

- [x] Critical CSS inlined
- [x] Fonts preloaded with font-display: swap
- [x] Images lazy loaded
- [x] OG images optimized (WebP)
- [x] JavaScript deferred/async
- [x] Aggressive caching headers
- [x] Gzip/Brotli compression
- [x] Bundle splitting for caching
- [x] Security headers configured
- [x] SEO meta tags complete

## Expected Lighthouse Scores

After implementing these optimizations:
- **Performance**: 95+
- **Accessibility**: 95+
- **Best Practices**: 95+
- **SEO**: 95+

## Monitoring

Run Lighthouse regularly to track performance:
```bash
# Via npm script
npm run lighthouse

# Or manually
npx lighthouse https://farhankabir.me --view
```

## Troubleshooting

### Fonts not loading
- Check network tab for font requests
- Verify `font-display: swap` is applied
- Ensure preconnect headers are present

### Large bundle size
- Run `npm run build:analyze` to identify large modules
- Consider lazy loading heavy components
- Check for duplicate dependencies

### Poor LCP (Largest Contentful Paint)
- Ensure hero image has `priority={true}`
- Check for render-blocking resources
- Verify critical CSS is inlined
