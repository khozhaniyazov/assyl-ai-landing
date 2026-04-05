const assert = require('assert');
const fs = require('fs');
const path = require('path');

const INDEX_PATH = path.join(__dirname, '..', '..', 'index.html');

function fail(message) {
  console.error(`[check-html-baseline] ${message}`);
  throw new Error(message);
}

function collectTypes(node, bucket) {
  if (!node || typeof node !== 'object') return;

  if (Array.isArray(node)) {
    node.forEach((item) => collectTypes(item, bucket));
    return;
  }

  const schemaType = node['@type'];
  if (typeof schemaType === 'string') {
    bucket.add(schemaType);
  } else if (Array.isArray(schemaType)) {
    schemaType.forEach((value) => {
      if (typeof value === 'string') bucket.add(value);
    });
  }

  Object.values(node).forEach((value) => collectTypes(value, bucket));
}

function run() {
  const html = fs.readFileSync(INDEX_PATH, 'utf8');

  if (!/^\s*<!DOCTYPE html>/i.test(html)) {
    fail('Missing required <!DOCTYPE html> declaration.');
  }

  if (!/<html[^>]*\blang=["']kk["'][^>]*>/i.test(html)) {
    fail('Missing required <html lang="kk"> declaration.');
  }

  if (!/<main[^>]*\bid=["']main["'][^>]*>/i.test(html)) {
    fail('Missing required <main id="main"> landmark.');
  }

  const consentSurfaceCount = (html.match(/data-consent-surface=["']/gi) || []).length;
  if (consentSurfaceCount < 5) {
    fail('Expected consent gating attributes on primary WhatsApp CTAs (data-consent-surface).');
  }

  if (!/<link[^>]*\brel=["']canonical["'][^>]*\bhref=["']https:\/\/khozhaniyazov\.github\.io\/assylai\/["'][^>]*>/i.test(html)) {
    fail('Missing canonical URL link for https://khozhaniyazov.github.io/assylai/.');
  }

  const ldJsonRegex = /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  const parsedBlocks = [];
  let match;
  while ((match = ldJsonRegex.exec(html)) !== null) {
    const raw = match[1].trim();
    try {
      parsedBlocks.push(JSON.parse(raw));
    } catch (error) {
      fail(`Invalid JSON-LD block at index ${parsedBlocks.length}: ${error.message}`);
    }
  }

  if (parsedBlocks.length === 0) {
    fail('No <script type="application/ld+json"> blocks found.');
  }

  const schemaTypes = new Set();
  parsedBlocks.forEach((block) => collectTypes(block, schemaTypes));

  if (!schemaTypes.has('MedicalBusiness')) {
    fail('Required JSON-LD type "MedicalBusiness" was not found.');
  }

  if (!schemaTypes.has('FAQPage')) {
    fail('Required JSON-LD type "FAQPage" was not found.');
  }

  console.log('[check-html-baseline] PASS');
}

if (require.main === module) {
  try {
    run();
  } catch (_) {
    process.exit(1);
  }
}

module.exports = { run };
