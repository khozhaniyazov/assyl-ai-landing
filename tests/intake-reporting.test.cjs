const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const reportingPath = path.join(__dirname, '..', 'assets', 'js', 'intake-reporting.js');
const source = fs.readFileSync(reportingPath, 'utf8');

const sandbox = {
  window: {},
  AssylIntakeStore: {
    listLeads() {
      return [
        {
          lead_ref: 'L-1',
          source_channel: 'hero',
          status: 'qualified',
          created_at: '2026-04-01T10:00:00.000Z',
          qualified_at: '2026-04-02T10:00:00.000Z'
        },
        {
          lead_ref: 'L-2',
          source_channel: 'hero',
          status: 'paid_start',
          created_at: '2026-04-03T10:00:00.000Z',
          qualified_at: '2026-04-03T12:00:00.000Z',
          booked_at: '2026-04-04T10:00:00.000Z',
          paid_start_at: '2026-04-05T10:00:00.000Z'
        },
        {
          lead_ref: 'L-3',
          source_channel: 'form',
          status: 'new',
          created_at: '2026-04-04T10:00:00.000Z'
        },
        {
          lead_ref: 'L-4',
          source_channel: 'sticky',
          status: 'booked',
          created_at: '2026-03-20T10:00:00.000Z',
          qualified_at: '2026-03-21T10:00:00.000Z',
          booked_at: '2026-03-22T10:00:00.000Z'
        }
      ];
    }
  }
};
sandbox.window = sandbox;

vm.createContext(sandbox);
vm.runInContext(source, sandbox);

const reporting = sandbox.window.AssylIntakeReporting;
assert.ok(reporting, 'window.AssylIntakeReporting should be defined');

const report = reporting.buildWeeklyFunnel({
  weekStartISO: '2026-04-01T00:00:00.000Z',
  weekEndISO: '2026-04-07T00:00:00.000Z'
});

assert.strictEqual(report.totals.intent, 3, 'intent should count leads created in window');
assert.strictEqual(report.totals.qualified, 2, 'qualified should include qualified+ stages in window');
assert.strictEqual(report.totals.booked, 1, 'booked should include booked+ stages in window');
assert.strictEqual(report.totals.paid, 1, 'paid should include paid_start in window');

assert.strictEqual(report.channels.hero.intent, 2, 'hero channel should aggregate window leads');
assert.strictEqual(report.channels.form.intent, 1, 'form channel should aggregate window leads');
assert.strictEqual(report.channels.sticky, undefined, 'out-of-window channel should be excluded');

const summary = reporting.formatWeeklySummary(report);
assert.strictEqual(typeof summary, 'string', 'formatWeeklySummary should return string');
assert.strictEqual(summary.includes('hero'), true, 'summary should include channel key');

console.log('intake-reporting tests passed');
