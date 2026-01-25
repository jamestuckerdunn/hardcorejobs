/**
 * Script to generate favicon and icon assets for HARDCOREJOBS
 *
 * Run with: node scripts/generate-assets.js
 *
 * Prerequisites: npm install sharp
 */

const fs = require('fs');
const path = require('path');

// Check if sharp is available
let sharp;
try {
  sharp = require('sharp');
} catch (e) {
  console.log('Sharp not installed. Installing...');
  require('child_process').execSync('npm install sharp --save-dev', { stdio: 'inherit' });
  sharp = require('sharp');
}

const publicDir = path.join(__dirname, '..', 'public');

// SVG template for the HJ icon
const createIconSvg = (size) => `
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" fill="black"/>
  <text
    x="50%"
    y="58%"
    font-family="system-ui, -apple-system, BlinkMacSystemFont, sans-serif"
    font-size="${size * 0.5}"
    font-weight="900"
    fill="white"
    text-anchor="middle"
    dominant-baseline="middle"
  >HJ</text>
</svg>`;

// OG Image SVG
const ogImageSvg = `
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <rect width="1200" height="630" fill="black"/>
  <text
    x="600"
    y="260"
    font-family="system-ui, -apple-system, BlinkMacSystemFont, sans-serif"
    font-size="80"
    font-weight="900"
    fill="white"
    text-anchor="middle"
    letter-spacing="-2"
  >HARDCOREJOBS</text>
  <text
    x="600"
    y="360"
    font-family="system-ui, -apple-system, BlinkMacSystemFont, sans-serif"
    font-size="36"
    font-weight="500"
    fill="#a3a3a3"
    text-anchor="middle"
  >$100K+ Jobs, Zero Experience Required</text>
  <text
    x="600"
    y="520"
    font-family="system-ui, -apple-system, BlinkMacSystemFont, sans-serif"
    font-size="24"
    fill="#525252"
    text-anchor="middle"
  >hardcorejobs.com</text>
</svg>`;

async function generateAssets() {
  console.log('Generating image assets...\n');

  try {
    // Generate icon-192.png
    console.log('Creating icon-192.png...');
    await sharp(Buffer.from(createIconSvg(192)))
      .png()
      .toFile(path.join(publicDir, 'icon-192.png'));

    // Generate icon-512.png
    console.log('Creating icon-512.png...');
    await sharp(Buffer.from(createIconSvg(512)))
      .png()
      .toFile(path.join(publicDir, 'icon-512.png'));

    // Generate apple-touch-icon.png (180x180)
    console.log('Creating apple-touch-icon.png...');
    await sharp(Buffer.from(createIconSvg(180)))
      .png()
      .toFile(path.join(publicDir, 'apple-touch-icon.png'));

    // Generate favicon.ico (32x32)
    console.log('Creating favicon.ico...');
    await sharp(Buffer.from(createIconSvg(32)))
      .png()
      .toFile(path.join(publicDir, 'favicon.ico'));

    // Generate og-image.png
    console.log('Creating og-image.png...');
    await sharp(Buffer.from(ogImageSvg))
      .png()
      .toFile(path.join(publicDir, 'og-image.png'));

    console.log('\n✅ All assets generated successfully!');
    console.log('\nGenerated files:');
    console.log('  - public/favicon.ico (32x32)');
    console.log('  - public/icon-192.png (192x192)');
    console.log('  - public/icon-512.png (512x512)');
    console.log('  - public/apple-touch-icon.png (180x180)');
    console.log('  - public/og-image.png (1200x630)');

  } catch (error) {
    console.error('Error generating assets:', error);
    process.exit(1);
  }
}

generateAssets();
