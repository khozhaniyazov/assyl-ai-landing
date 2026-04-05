const { run: runHtmlBaseline } = require('./check-html-baseline.test.cjs');
const { run: runLinks } = require('./check-links.test.cjs');
const { run: runA11yBaseline } = require('./check-a11y-baseline.test.cjs');
const { run: runPerformanceBudget } = require('./check-performance-budget.test.cjs');

function runAll() {
  const checks = [
    { name: 'check-html-baseline', run: runHtmlBaseline },
    { name: 'check-links', run: runLinks },
    { name: 'check-a11y-baseline', run: runA11yBaseline },
    { name: 'check-performance-budget', run: runPerformanceBudget }
  ];

  for (const check of checks) {
    try {
      check.run();
      console.log(`[quality] PASS ${check.name}`);
    } catch (error) {
      console.error(`[quality] FAIL ${check.name}: ${error.message}`);
      return false;
    }
  }

  console.log('[quality] PASS all checks');
  return true;
}

if (require.main === module) {
  const ok = runAll();
  if (!ok) {
    process.exit(1);
  }
}

module.exports = { runAll };
