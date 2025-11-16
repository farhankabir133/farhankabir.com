import fs from 'fs';
import path from 'path';

const SRC_DIR = path.join(process.cwd(), 'src');
const TYPOGRAPHY_FILE = path.join(SRC_DIR, 'styles', 'typography.css');

// Helper to recursively scan files
function scanFiles(dir, ext = ['.ts', '.tsx', '.js', '.jsx', '.css']) {
  let results = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results.push(...scanFiles(fullPath, ext));
    } else if (ext.includes(path.extname(fullPath))) {
      results.push(fullPath);
    }
  }
  return results;
}

// 1. Check if typography.css exists
if (!fs.existsSync(TYPOGRAPHY_FILE)) {
  console.log('❌ typography.css file NOT found in src/styles/');
} else {
  console.log('✅ typography.css file FOUND');
}

// 2. Scan for leftover font properties
const files = scanFiles(SRC_DIR);
let leftoverFonts = [];

files.forEach((file) => {
  const content = fs.readFileSync(file, 'utf8');
  const fontRegex = /(font-family|font-size|line-height)/gi;
  if (fontRegex.test(content) && file !== TYPOGRAPHY_FILE) {
    leftoverFonts.push(file);
  }
});

if (leftoverFonts.length > 0) {
  console.log('⚠️ Found leftover font properties in:');
  leftoverFonts.forEach((f) => console.log(`  - ${f}`));
} else {
  console.log('✅ No leftover font properties found outside typography.css');
}

// 3. Scan JSX/TSX files for inline styles with font props
let inlineStyles = [];
files
  .filter((f) => f.endsWith('.tsx') || f.endsWith('.jsx'))
  .forEach((file) => {
    const content = fs.readFileSync(file, 'utf8');
    const inlineRegex = /style=\{\s*\{[^}]*font(Family|Size|Weight|LineHeight)[^}]*\}\s*\}/gi;
    if (inlineRegex.test(content)) {
      inlineStyles.push(file);
    }
  });

if (inlineStyles.length > 0) {
  console.log('⚠️ Found inline styles with fonts in:');
  inlineStyles.forEach((f) => console.log(`  - ${f}`));
} else {
  console.log('✅ No inline font styles found');
}

// 4. Check if typography.css is imported in index.tsx or index.js
const indexFiles = ['index.tsx', 'index.js'].map((f) => path.join(SRC_DIR, f)).filter((f) => fs.existsSync(f));
if (indexFiles.length === 0) {
  console.log('❌ Could not find index.tsx or index.js');
} else {
  const content = fs.readFileSync(indexFiles[0], 'utf8');
  const importRegex = /import ['"]\.\/styles\/typography\.css['"]/i;
  if (importRegex.test(content)) {
    console.log('✅ typography.css is imported in root file');
  } else {
    console.log('⚠️ typography.css NOT imported in root file');
  }
}

console.log('✅ Typography check completed');
