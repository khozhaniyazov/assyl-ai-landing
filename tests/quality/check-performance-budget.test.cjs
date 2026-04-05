const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', '..');
const INDEX_PATH = path.join(ROOT, 'index.html');
const MAX_BYTES = 256000;
const IMAGE_FILES = ['hero.jpg', 'hero.webp', 'specialist.jpg', 'specialist.webp'];

function fail(message) {
  console.error(`[check-performance-budget] ${message}`);
  throw new Error(message);
}

function run() {
  IMAGE_FILES.forEach((fileName) => {
    const absolutePath = path.join(ROOT, fileName);
    if (!fs.existsSync(absolutePath)) {
      fail(`Missing required image for budget check: ${fileName}`);
    }
    const fileSize = fs.statSync(absolutePath).size;
    if (fileSize > MAX_BYTES) {
      fail(`Image exceeds ${MAX_BYTES} bytes: ${fileName} (${fileSize} bytes)`);
    }
  });

  const html = fs.readFileSync(INDEX_PATH, 'utf8');
  if (!html.includes('https://cdn.tailwindcss.com?v=3.4.1')) {
    fail('Pinned Tailwind CDN URL missing or drifted from v3.4.1');
  }

  if (!html.includes('lucide@0.263.0')) {
    fail('Pinned Lucide version missing or drifted from 0.263.0');
  }

  console.log('[check-performance-budget] PASS');
}

if (require.main === module) {
  try {
    run();
  } catch (_) {
    process.exit(1);
  }
}

module.exports = { run };
