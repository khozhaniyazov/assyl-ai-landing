/*
 * Assyl-ai intake operations
 * Phase 03 / Plan 02 orchestration for live lead registration
 */
(function initIntakeOperations(global) {
  const CONSENT_LOG_KEY = 'assyl_consent_log';
  const DUPLICATE_GUARD_ATTR = 'data-intake-registered';

  function readConsentLog() {
    try {
      return JSON.parse(global.localStorage.getItem(CONSENT_LOG_KEY) || '[]');
    } catch (_error) {
      return [];
    }
  }

  function getLatestConsent() {
    const log = readConsentLog();
    return log.length ? log[log.length - 1] : null;
  }

  function resolveTouchSnapshot() {
    if (global.AssylAttribution && typeof global.AssylAttribution.resolveCurrentTouch === 'function') {
      return global.AssylAttribution.resolveCurrentTouch() || {};
    }

    return {
      first_touch: null,
      last_touch: null
    };
  }

  function buildLeadRef() {
    if (global.AssylLeadRuntime && typeof global.AssylLeadRuntime.buildLeadRef === 'function') {
      return global.AssylLeadRuntime.buildLeadRef();
    }

    return `L-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
  }

  function getStore() {
    return global.AssylIntakeStore || null;
  }

  function registerIntentLead(surface) {
    const store = getStore();
    if (!store || typeof store.createLead !== 'function') {
      return {
        ok: false,
        error: 'store_unavailable'
      };
    }

    const touch = resolveTouchSnapshot();
    const consent = getLatestConsent();
    const payload = {
      lead_ref: buildLeadRef(),
      source_channel: surface || 'intent',
      first_touch: touch.first_touch || {},
      last_touch: touch.last_touch || {},
      consent: consent || { granted: false }
    };

    const result = store.createLead(payload);
    refreshOpsPanel();
    return result;
  }

  function registerFormLead(input) {
    const store = getStore();
    if (!store || typeof store.createLead !== 'function') {
      return {
        ok: false,
        error: 'store_unavailable'
      };
    }

    const payload = input && typeof input === 'object' ? input : {};
    const touch = resolveTouchSnapshot();
    const consent = getLatestConsent();
    const leadRef = payload.leadRef || buildLeadRef();
    const sourceChannel = payload.sourceChannel || 'form';

    if (typeof store.getLeadByRef === 'function') {
      const existing = store.getLeadByRef(leadRef);
      if (existing) {
        refreshOpsPanel();
        return existing;
      }
    }

    const result = store.createLead({
      lead_ref: leadRef,
      source_channel: sourceChannel,
      first_touch: touch.first_touch || {},
      last_touch: touch.last_touch || {},
      consent: consent || { granted: false }
    });

    refreshOpsPanel();
    return result;
  }

  function advanceLeadStatus(ref, nextStatus) {
    const store = getStore();
    if (!store || typeof store.transitionLeadStatus !== 'function') {
      return {
        ok: false,
        error: 'store_unavailable'
      };
    }

    const result = store.transitionLeadStatus(ref, nextStatus, {
      actor: 'intake_ops_panel',
      at: new Date().toISOString()
    });
    refreshOpsPanel();
    return result;
  }

  function renderLeadRow(lead) {
    const ref = lead.lead_ref || '—';
    const status = lead.status || 'new';
    const source = lead.source_channel || 'unknown';
    return `<li class="py-2 border-b border-surface-100"><span class="font-semibold">${ref}</span> · <span>${status}</span> · <span class="text-surface-500">${source}</span></li>`;
  }

  function refreshOpsPanel() {
    const host = global.document.getElementById('intake-ops-panel');
    const store = getStore();
    if (!host || !store || typeof store.listLeads !== 'function') return;

    const leads = store.listLeads();
    const items = leads.slice(-10).reverse().map(renderLeadRow).join('');

    host.innerHTML = `
      <div class="max-w-6xl mx-auto px-6 py-6">
        <h3 class="font-heading font-bold text-lg mb-2">Intake Operations</h3>
        <p class="text-sm text-surface-600 mb-4">Жалпы лид: ${leads.length}</p>
        <ul class="text-sm bg-white border border-surface-200 rounded-xl p-4">${items || '<li class="text-surface-500">Лидтер әлі жоқ</li>'}</ul>
      </div>
    `;
  }

  function bindIntentListeners() {
    const anchors = global.document.querySelectorAll('[data-track="whatsapp"], [data-track="call"]');
    anchors.forEach((anchor) => {
      anchor.addEventListener('click', function onIntentClick(event) {
        const target = event && event.currentTarget ? event.currentTarget : anchor;
        const alreadyRegistered = target.getAttribute(DUPLICATE_GUARD_ATTR) === 'true';
        if (alreadyRegistered) return;

        target.setAttribute(DUPLICATE_GUARD_ATTR, 'true');
        const surface = target.getAttribute('data-surface') || 'intent';
        registerIntentLead(surface);
      });
    });
  }

  function init() {
    bindIntentListeners();
    refreshOpsPanel();
  }

  const api = {
    registerIntentLead,
    registerFormLead,
    advanceLeadStatus,
    refreshOpsPanel
  };

  global.AssylIntakeOperations = api;
  // Keep explicit assignment string for deterministic checks.
  window.AssylIntakeOperations = api;

  if (global.document.readyState === 'loading') {
    global.document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})(window);
