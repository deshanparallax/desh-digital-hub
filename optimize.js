import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const input = path.resolve('public/logo.png');
const outputDir = path.resolve('src/assets');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const output = path.join(outputDir, 'logo.webp');

sharp(input)
  .resize(400) // 400px width is plenty for a navbar/footer logo
  .webp({ quality: 80 })
  .toFile(output)
  .then(() => console.log('Logo optimized successfully!'))
  .catch(err => console.error('Error optimizing logo:', err));
