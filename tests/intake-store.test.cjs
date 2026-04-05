const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

function createStorage() {
  const state = new Map();
  return {
    getItem(key) {
      return state.has(key) ? state.get(key) : null;
    },
    setItem(key, value) {
      state.set(key, String(value));
    },
    removeItem(key) {
      state.delete(key);
    }
  };
}

const contractsPath = path.join(__dirname, '..', 'assets', 'js', 'intake-contracts.js');
const storePath = path.join(__dirname, '..', 'assets', 'js', 'intake-store.js');

const contractsSource = fs.readFileSync(contractsPath, 'utf8');
const storeSource = fs.readFileSync(storePath, 'utf8');

const localStorage = createStorage();
const sandbox = {
  window: {},
  localStorage
};
sandbox.window = sandbox;
sandbox.AssylLeadRuntime = {
  buildLeadRef() {
    return 'L-RED-GREEN';
  },
  readTouch(type) {
    if (type === 'first') return { source: 'google', code: 'WA_HERO' };
    return { source: 'instagram', code: 'WA_FORM' };
  }
};
vm.createContext(sandbox);
vm.runInContext(contractsSource, sandbox);
vm.runInContext(storeSource, sandbox);

const store = sandbox.window.AssylIntakeStore;
assert.ok(store, 'window.AssylIntakeStore should be defined');

const lead = store.createLead({
  source_channel: 'checker',
  consent: { granted: true, granted_at: new Date().toISOString() }
});

assert.strictEqual(lead.status, 'new', 'new lead should default to new status');
assert.ok(lead.first_touch, 'new lead should include first_touch');
assert.ok(lead.last_touch, 'new lead should include last_touch');

const qualified = store.transitionLeadStatus(lead.lead_ref, 'qualified', { actor: 'operator' });
assert.strictEqual(qualified.ok, true, 'new -> qualified should succeed');
assert.strictEqual(qualified.lead.status, 'qualified', 'status should advance to qualified');
assert.ok(qualified.lead.qualified_at, 'qualified transition should set qualified_at');

const invalid = store.transitionLeadStatus(lead.lead_ref, 'paid_start');
assert.strictEqual(invalid.ok, false, 'invalid transition should fail');
assert.strictEqual(invalid.error, 'invalid_transition', 'invalid transition should return deterministic error');
assert.strictEqual(store.getLeadByRef(lead.lead_ref).status, 'qualified', 'invalid transition must not mutate status');

console.log('intake-store tests passed');
