const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const operationsPath = path.join(__dirname, '..', 'assets', 'js', 'intake-operations.js');
const source = fs.readFileSync(operationsPath, 'utf8');

function createStorage(seed = {}) {
  const map = new Map(Object.entries(seed));
  return {
    getItem(key) {
      return map.has(key) ? map.get(key) : null;
    },
    setItem(key, value) {
      map.set(key, String(value));
    },
    removeItem(key) {
      map.delete(key);
    }
  };
}

function createElement({ track, surface }) {
  const attrs = {
    'data-track': track,
    'data-surface': surface
  };

  return {
    dataset: {},
    listeners: {},
    getAttribute(name) {
      return attrs[name] || '';
    },
    setAttribute(name, value) {
      attrs[name] = String(value);
      if (name.startsWith('data-')) {
        const key = name.replace('data-', '').replace(/-([a-z])/g, (_, c) => c.toUpperCase());
        this.dataset[key] = String(value);
      }
    },
    addEventListener(name, cb) {
      this.listeners[name] = cb;
    }
  };
}

const anchors = [
  createElement({ track: 'whatsapp', surface: 'hero' }),
  createElement({ track: 'call', surface: 'header-phone' })
];

const storeCalls = [];
const transitionCalls = [];

const localStorage = createStorage({
  assyl_consent_log: JSON.stringify([
    {
      surfaceId: 'checker',
      consentVersion: '2026-04-05.v1',
      timestamp: '2026-04-05T09:00:00.000Z'
    }
  ])
});

const sandbox = {
  window: {},
  localStorage,
  setTimeout,
  clearTimeout,
  document: {
    querySelectorAll(selector) {
      return selector === '[data-track="whatsapp"], [data-track="call"]' ? anchors : [];
    },
    getElementById() {
      return null;
    }
  }
};
sandbox.window = sandbox;
sandbox.AssylLeadRuntime = {
  buildLeadRef() {
    return 'L-TDD-0001';
  }
};
sandbox.AssylAttribution = {
  resolveCurrentTouch() {
    return {
      first_touch: { source: 'google' },
      last_touch: { source: 'instagram' }
    };
  }
};
sandbox.AssylIntakeStore = {
  createLead(input) {
    storeCalls.push(input);
    return {
      ...input,
      status: 'new',
      created_at: '2026-04-05T09:00:00.000Z',
      updated_at: '2026-04-05T09:00:00.000Z'
    };
  },
  transitionLeadStatus(ref, nextStatus, meta) {
    transitionCalls.push({ ref, nextStatus, meta });
    return { ok: true, lead: { lead_ref: ref, status: nextStatus } };
  },
  listLeads() {
    return [];
  }
};

vm.createContext(sandbox);
vm.runInContext(source, sandbox);

const ops = sandbox.window.AssylIntakeOperations;
assert.ok(ops, 'window.AssylIntakeOperations should be defined');

const intentLead = ops.registerIntentLead('hero');
assert.strictEqual(intentLead.status, 'new', 'registerIntentLead should create new status lead');
assert.strictEqual(intentLead.source_channel, 'hero', 'intent lead should keep surface as source channel');
assert.ok(intentLead.first_touch, 'intent lead should include first_touch');
assert.ok(intentLead.last_touch, 'intent lead should include last_touch');
assert.ok(intentLead.consent, 'intent lead should include consent snapshot');

const formLead = ops.registerFormLead({ leadRef: 'L-FORM-0001', sourceChannel: 'form' });
assert.strictEqual(formLead.lead_ref, 'L-FORM-0001', 'registerFormLead should preserve passed leadRef');

const transitionResult = ops.advanceLeadStatus('L-FORM-0001', 'qualified');
assert.strictEqual(transitionResult.ok, true, 'advanceLeadStatus should return transition result');
assert.strictEqual(transitionCalls.length > 0, true, 'advanceLeadStatus should call transitionLeadStatus');

assert.strictEqual(typeof anchors[0].listeners.click, 'function', 'whatsapp anchor should get click listener');

const clickEvent = { currentTarget: anchors[0] };
anchors[0].listeners.click(clickEvent);
const firstClickCount = storeCalls.length;
anchors[0].listeners.click(clickEvent);
assert.strictEqual(storeCalls.length, firstClickCount, 'duplicate click path should not register intake twice');

console.log('intake-operations tests passed');
