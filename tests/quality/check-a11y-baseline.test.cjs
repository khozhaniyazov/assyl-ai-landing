const fs = require('fs');
const path = require('path');

const INDEX_PATH = path.join(__dirname, '..', '..', 'index.html');

function fail(message) {
  console.error(`[check-a11y-baseline] ${message}`);
  throw new Error(message);
}

function run() {
  const html = fs.readFileSync(INDEX_PATH, 'utf8');

  if (!/<a[^>]*href=["']#main["'][^>]*>/i.test(html)) {
    fail('Missing skip link with href="#main".');
  }

  if (!/<main[^>]*\bid=["']main["'][^>]*>/i.test(html)) {
    fail('Missing <main id="main"> landmark required by skip link.');
  }

  if (!/<form[^>]*\baria-label=["'][^"']+["'][^>]*>/i.test(html)) {
    fail('Missing form aria-label for assistive technologies.');
  }

  if (!/<a[^>]*\bclass=["'][^"']*whatsapp-float[^"']*["'][^>]*\baria-label=["'][^"']+["'][^>]*>/i.test(html)) {
    fail('Missing aria-label on WhatsApp floating CTA.');
  }

  const blankAnchorRegex = /<a\b[^>]*\btarget=["']_blank["'][^>]*>/gi;
  let match;
  while ((match = blankAnchorRegex.exec(html)) !== null) {
    const anchorTag = match[0];
    const relMatch = anchorTag.match(/\brel=["']([^"']+)["']/i);
    if (!relMatch) {
      fail(`target="_blank" anchor missing rel attribute: ${anchorTag}`);
    }

    const relTokens = relMatch[1].toLowerCase().split(/\s+/).filter(Boolean);
    if (!relTokens.includes('noopener') || !relTokens.includes('noreferrer')) {
      fail(`target="_blank" anchor missing noopener noreferrer tokens: ${anchorTag}`);
    }
  }

  console.log('[check-a11y-baseline] PASS');
}

if (require.main === module) {
  try {
    run();
  } catch (_) {
    process.exit(1);
  }
}

module.exports = { run };
