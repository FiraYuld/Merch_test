import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const ASSETS_DIR = './src/assets';
const OUTPUT_DIR = './src/assets-optimized';
const MAX_WIDTH = 600;
const QUALITY = 80;

async function optimizeImages() {
  // Создаём папку для оптимизированных изображений
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const files = fs.readdirSync(ASSETS_DIR);
  const imageFiles = files.filter(f => /\.(jpg|jpeg|png)$/i.test(f));

  console.log(`\n📦 Найдено ${imageFiles.length} изображений для оптимизации\n`);

  let totalOriginal = 0;
  let totalOptimized = 0;

  for (const file of imageFiles) {
    const inputPath = path.join(ASSETS_DIR, file);
    const baseName = path.parse(file).name;
    const outputPath = path.join(OUTPUT_DIR, `${baseName}.webp`);

    const originalSize = fs.statSync(inputPath).size;
    totalOriginal += originalSize;

    try {
      await sharp(inputPath)
        .resize(MAX_WIDTH, null, { 
          withoutEnlargement: true,
          fit: 'inside'
        })
        .webp({ quality: QUALITY })
        .toFile(outputPath);

      const optimizedSize = fs.statSync(outputPath).size;
      totalOptimized += optimizedSize;

      const savings = ((1 - optimizedSize / originalSize) * 100).toFixed(1);
      console.log(`✅ ${file} → ${baseName}.webp (${formatBytes(originalSize)} → ${formatBytes(optimizedSize)}, -${savings}%)`);
    } catch (err) {
      console.log(`❌ ${file}: ${err.message}`);
    }
  }

  console.log(`\n📊 Итого:`);
  console.log(`   Было: ${formatBytes(totalOriginal)}`);
  console.log(`   Стало: ${formatBytes(totalOptimized)}`);
  console.log(`   Сэкономлено: ${formatBytes(totalOriginal - totalOptimized)} (${((1 - totalOptimized / totalOriginal) * 100).toFixed(1)}%)\n`);
  console.log(`📁 Оптимизированные файлы в: ${OUTPUT_DIR}`);
  console.log(`\n⚠️  Следующий шаг: замени импорты в images.js на новые .webp файлы`);
}

function formatBytes(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}

optimizeImages();
