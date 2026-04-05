const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', '..');
const INDEX_PATH = path.join(ROOT, 'index.html');
const REQUIRED_LOCAL_REFS = [
  'hero.jpg',
  'hero.webp',
  'specialist.jpg',
  'specialist.webp',
  'assets/js/lead-contracts.js',
  'assets/js/lead-runtime.js',
  'assets/js/consent-handoff.js',
  'assets/js/attribution-tracking.js',
  'assets/js/lead-webhook.js',
  'assets/js/intake-contracts.js',
  'assets/js/intake-store.js',
  'assets/js/intake-operations.js',
  'assets/js/intake-reporting.js',
  'assets/js/intake-ops-panel.js'
];

function fail(message) {
  console.error(`[check-links] ${message}`);
  throw new Error(message);
}

function normalizeRef(refValue) {
  return refValue.replace(/^\.\//, '').replace(/^\//, '');
}

function run() {
  const html = fs.readFileSync(INDEX_PATH, 'utf8');

  const idRegex = /\bid=["']([^"']+)["']/gi;
  const ids = new Set();
  let idMatch;
  while ((idMatch = idRegex.exec(html)) !== null) {
    ids.add(idMatch[1]);
  }

  const anchorRegex = /\bhref=["']#([^"']+)["']/gi;
  let anchorMatch;
  while ((anchorMatch = anchorRegex.exec(html)) !== null) {
    const targetId = anchorMatch[1].trim();
    if (!ids.has(targetId)) {
      fail(`Missing anchor target id="#${targetId}" in index.html.`);
    }
  }

  const attrRegex = /\b(?:src|href)=["']([^"']+)["']/gi;
  const localRefs = new Set();
  let attrMatch;
  while ((attrMatch = attrRegex.exec(html)) !== null) {
    const value = attrMatch[1].trim();
    if (!value || value.startsWith('#') || value.startsWith('data:') || /^[a-zA-Z][a-zA-Z\d+.-]*:/.test(value)) {
      continue;
    }

    const normalized = normalizeRef(value.split('?')[0].split('#')[0]);
    if (normalized) {
      localRefs.add(normalized);
    }
  }

  REQUIRED_LOCAL_REFS.forEach((requiredRef) => localRefs.add(requiredRef));

  for (const ref of localRefs) {
    const absolutePath = path.join(ROOT, ref);
    if (!fs.existsSync(absolutePath)) {
      fail(`Missing local asset reference: ${ref}`);
    }
  }

  console.log('[check-links] PASS');
}

if (require.main === module) {
  try {
    run();
  } catch (_) {
    process.exit(1);
  }
}

module.exports = { run };
