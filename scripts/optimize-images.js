#!/usr/bin/env node
/**
 * Image Optimization Script
 * 
 * This script optimizes images in the project for better Lighthouse scores:
 * - Converts images to WebP and AVIF formats
 * - Generates responsive image sizes
 * - Creates optimized OG (Open Graph) images
 * 
 * Usage:
 *   node scripts/optimize-images.js
 * 
 * Prerequisites:
 *   npm install sharp (already in devDependencies)
 */

import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const config = {
  inputDir: path.join(__dirname, '../public'),
  outputDir: path.join(__dirname, '../public/optimized'),
  // Responsive image breakpoints
  sizes: [320, 640, 768, 1024, 1280, 1920],
  // Quality settings
  quality: {
    webp: 80,
    avif: 65,
    jpeg: 85,
    png: 85,
  },
  // OG Image specific dimensions
  ogImageSizes: {
    square: { width: 1200, height: 1200 },    // For Twitter, Facebook
    linkedin: { width: 1600, height: 1000 },   // LinkedIn optimized
    twitter: { width: 1200, height: 630 },     // Twitter card
  }
};

// Ensure output directory exists
function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// Get all image files from a directory
function getImageFiles(dir, extensions = ['.jpg', '.jpeg', '.png', '.gif']) {
  const files = [];
  
  if (!fs.existsSync(dir)) {
    return files;
  }
  
  const items = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    if (item.isDirectory()) {
      files.push(...getImageFiles(fullPath, extensions));
    } else if (extensions.includes(path.extname(item.name).toLowerCase())) {
      files.push(fullPath);
    }
  }
  
  return files;
}

// Optimize a single image
async function optimizeImage(inputPath, outputDir) {
  const filename = path.basename(inputPath, path.extname(inputPath));
  const image = sharp(inputPath);
  const metadata = await image.metadata();
  
  console.log(`Processing: ${inputPath}`);
  console.log(`  Original: ${metadata.width}x${metadata.height}`);
  
  const results = [];
  
  // Generate WebP version at original size
  const webpPath = path.join(outputDir, `${filename}.webp`);
  await image
    .webp({ quality: config.quality.webp })
    .toFile(webpPath);
  results.push({ format: 'webp', path: webpPath });
  
  // Generate AVIF version at original size
  const avifPath = path.join(outputDir, `${filename}.avif`);
  await image
    .avif({ quality: config.quality.avif })
    .toFile(avifPath);
  results.push({ format: 'avif', path: avifPath });
  
  // Generate responsive sizes
  for (const width of config.sizes) {
    if (width <= metadata.width) {
      // WebP responsive
      const responsiveWebpPath = path.join(outputDir, `${filename}-${width}w.webp`);
      await sharp(inputPath)
        .resize(width, null, { withoutEnlargement: true })
        .webp({ quality: config.quality.webp })
        .toFile(responsiveWebpPath);
      
      // AVIF responsive
      const responsiveAvifPath = path.join(outputDir, `${filename}-${width}w.avif`);
      await sharp(inputPath)
        .resize(width, null, { withoutEnlargement: true })
        .avif({ quality: config.quality.avif })
        .toFile(responsiveAvifPath);
    }
  }
  
  return results;
}

// Create optimized OG images from a source image
async function createOGImages(inputPath, outputDir) {
  const filename = path.basename(inputPath, path.extname(inputPath));
  
  console.log(`Creating OG images from: ${inputPath}`);
  
  // Square OG image (1200x1200)
  const squarePath = path.join(outputDir, `${filename}-og-square.webp`);
  await sharp(inputPath)
    .resize(config.ogImageSizes.square.width, config.ogImageSizes.square.height, {
      fit: 'cover',
      position: 'center'
    })
    .webp({ quality: 85 })
    .toFile(squarePath);
  console.log(`  Created: ${squarePath}`);
  
  // LinkedIn OG image (1600x1000)
  const linkedinPath = path.join(outputDir, `${filename}-og-linkedin.webp`);
  await sharp(inputPath)
    .resize(config.ogImageSizes.linkedin.width, config.ogImageSizes.linkedin.height, {
      fit: 'cover',
      position: 'center'
    })
    .webp({ quality: 85 })
    .toFile(linkedinPath);
  console.log(`  Created: ${linkedinPath}`);
  
  // Twitter Card image (1200x630)
  const twitterPath = path.join(outputDir, `${filename}-og-twitter.webp`);
  await sharp(inputPath)
    .resize(config.ogImageSizes.twitter.width, config.ogImageSizes.twitter.height, {
      fit: 'cover',
      position: 'center'
    })
    .webp({ quality: 85 })
    .toFile(twitterPath);
  console.log(`  Created: ${twitterPath}`);
}

// Generate srcset string for an image
function generateSrcset(baseName, outputDir, format = 'webp') {
  const srcset = config.sizes
    .map(width => {
      const filename = `${baseName}-${width}w.${format}`;
      const filePath = path.join(outputDir, filename);
      if (fs.existsSync(filePath)) {
        return `${filename} ${width}w`;
      }
      return null;
    })
    .filter(Boolean)
    .join(', ');
  
  return srcset;
}

// Main function
async function main() {
  console.log('🖼️  Image Optimization Script\n');
  console.log('='.repeat(50));
  
  // Ensure output directory exists
  ensureDir(config.outputDir);
  
  // Get all images
  const images = getImageFiles(config.inputDir);
  
  if (images.length === 0) {
    console.log('No images found to optimize.');
    console.log(`Looking in: ${config.inputDir}`);
    
    // Create a sample optimization guide
    console.log('\n📝 To optimize images:');
    console.log('   1. Place images in the public/ directory');
    console.log('   2. Run this script again');
    console.log('   3. Update your components to use the optimized versions');
    return;
  }
  
  console.log(`Found ${images.length} image(s) to optimize\n`);
  
  // Process each image
  for (const imagePath of images) {
    try {
      await optimizeImage(imagePath, config.outputDir);
      
      // Check if this looks like an OG image
      const filename = path.basename(imagePath).toLowerCase();
      if (filename.includes('og-') || filename.includes('profile') || filename.includes('avatar')) {
        await createOGImages(imagePath, config.outputDir);
      }
      
      console.log('');
    } catch (error) {
      console.error(`  Error processing ${imagePath}:`, error.message);
    }
  }
  
  // Generate helper output
  console.log('='.repeat(50));
  console.log('✅ Optimization complete!\n');
  
  console.log('📋 Usage Examples:\n');
  console.log('HTML <picture> element for responsive images:');
  console.log(`
<picture>
  <source 
    type="image/avif" 
    srcset="image-320w.avif 320w, image-640w.avif 640w, image-1024w.avif 1024w"
    sizes="(max-width: 640px) 100vw, 50vw"
  />
  <source 
    type="image/webp" 
    srcset="image-320w.webp 320w, image-640w.webp 640w, image-1024w.webp 1024w"
    sizes="(max-width: 640px) 100vw, 50vw"
  />
  <img 
    src="image.jpg" 
    alt="Description" 
    loading="lazy"
    decoding="async"
    width="800" 
    height="600"
  />
</picture>
`);
  
  console.log('React component usage:');
  console.log(`
const OptimizedImage = ({ src, alt, ...props }) => (
  <picture>
    <source type="image/avif" srcSet={\`\${src}.avif\`} />
    <source type="image/webp" srcSet={\`\${src}.webp\`} />
    <img src={\`\${src}.jpg\`} alt={alt} loading="lazy" decoding="async" {...props} />
  </picture>
);
`);
}

// Run the script
main().catch(console.error);
