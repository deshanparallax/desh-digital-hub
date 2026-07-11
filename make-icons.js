import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const input = path.resolve('C:/Users/desha/.gemini/antigravity-ide/brain/37befdf2-843d-48b4-9902-9873c902aab2/media__1783770586317.png');
const outputDir = path.resolve('public');

async function createIcon(size, outputName) {
  const output = path.join(outputDir, outputName);
  
  try {
    await sharp(input)
      .resize(size, size, { fit: 'contain' }) // Just resize keeping aspect ratio
      .png()
      .toFile(output);
      
    console.log(`Created ${outputName} (${size}x${size})`);
  } catch (err) {
    console.error(`Error creating ${outputName}:`, err);
  }
}

createIcon(192, 'pwa-192x192.png');
createIcon(512, 'pwa-512x512.png');
