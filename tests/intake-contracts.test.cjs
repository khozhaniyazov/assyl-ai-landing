const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const contractPath = path.join(__dirname, '..', 'assets', 'js', 'intake-contracts.js');
const source = fs.readFileSync(contractPath, 'utf8');

const sandbox = {
  window: {}
};
sandbox.window = sandbox;
vm.createContext(sandbox);
vm.runInContext(source, sandbox);

const contracts = sandbox.window.AssylIntakeContracts;
assert.ok(contracts, 'window.AssylIntakeContracts should be defined');

assert.deepStrictEqual(
  Array.from(contracts.ALLOWED_STATUSES),
  ['new', 'qualified', 'booked', 'paid_start'],
  'ALLOWED_STATUSES should match FR5 lifecycle'
);

assert.strictEqual(contracts.canTransition('new', 'qualified'), true, 'new -> qualified must be allowed');
assert.strictEqual(contracts.canTransition('new', 'booked'), false, 'new -> booked must be blocked');

const validRecord = {
  lead_ref: 'L-1234-ABCD',
  status: 'new',
  first_touch: { source: 'google' },
  last_touch: { source: 'instagram' },
  source_channel: 'checker',
  consent: { granted: true, granted_at: new Date().toISOString() },
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
};

const validation = contracts.validateLeadRecord(validRecord);
assert.strictEqual(validation.valid, true, 'complete record should validate');
assert.deepStrictEqual(Array.from(validation.missing), [], 'complete record should have no missing fields');

console.log('intake-contracts tests passed');
