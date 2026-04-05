/*
 * Assyl-ai intake store
 * Phase 03 / Plan 01 local persistence + guarded lifecycle transitions
 */
(function initIntakeStore(global) {
  const STORAGE_KEY = 'assyl_intake_leads_v1';
  const contracts = global.AssylIntakeContracts || {};
  const runtime = global.AssylLeadRuntime || {};

  function safeParse(value, fallback) {
    if (!value) return fallback;
    try {
      return JSON.parse(value);
    } catch (_error) {
      return fallback;
    }
  }

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function listLeads() {
    return safeParse(global.localStorage.getItem(STORAGE_KEY), []);
  }

  function saveLeads(leads) {
    global.localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));
    return leads;
  }

  function getLeadIndex(leads, ref) {
    return leads.findIndex((lead) => lead.lead_ref === ref);
  }

  function getLeadByRef(ref) {
    const lead = listLeads().find((item) => item.lead_ref === ref);
    return lead ? clone(lead) : null;
  }

  function createLead(input) {
    const payload = input && typeof input === 'object' ? input : {};
    const firstTouch = payload.first_touch || (runtime.readTouch ? runtime.readTouch('first') : null) || {};
    const lastTouch = payload.last_touch || (runtime.readTouch ? runtime.readTouch('last') : null) || {};
    const now = new Date().toISOString();
    const leadRef =
      payload.lead_ref ||
      (runtime.buildLeadRef ? runtime.buildLeadRef() : `L-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`);

    const record = {
      lead_ref: leadRef,
      status: 'new',
      first_touch: firstTouch,
      last_touch: lastTouch,
      source_channel:
        payload.source_channel ||
        lastTouch.source_channel ||
        lastTouch.source ||
        firstTouch.source_channel ||
        firstTouch.source ||
        'unknown',
      consent: payload.consent || { granted: false },
      created_at: now,
      updated_at: now,
      schema_version: contracts.LEAD_SCHEMA_VERSION || '2026-04-05.v1'
    };

    const validation = contracts.validateLeadRecord ? contracts.validateLeadRecord(record) : { valid: true, missing: [] };
    if (!validation.valid) {
      return {
        ok: false,
        error: 'invalid_record',
        missing: validation.missing
      };
    }

    const leads = listLeads();
    leads.push(record);
    saveLeads(leads);
    return clone(record);
  }

  function updateLead(ref, patch) {
    const leads = listLeads();
    const index = getLeadIndex(leads, ref);
    if (index === -1) {
      return {
        ok: false,
        error: 'not_found'
      };
    }

    const current = leads[index];
    const incoming = patch && typeof patch === 'object' ? patch : {};
    const updated = {
      ...current,
      ...incoming,
      lead_ref: current.lead_ref,
      updated_at: new Date().toISOString()
    };

    const validation = contracts.validateLeadRecord ? contracts.validateLeadRecord(updated) : { valid: true, missing: [] };
    if (!validation.valid) {
      return {
        ok: false,
        error: 'invalid_record',
        missing: validation.missing
      };
    }

    leads[index] = updated;
    saveLeads(leads);

    return {
      ok: true,
      lead: clone(updated)
    };
  }

  function transitionLeadStatus(ref, nextStatus, meta) {
    const leads = listLeads();
    const index = getLeadIndex(leads, ref);

    if (index === -1) {
      return {
        ok: false,
        error: 'not_found'
      };
    }

    const current = leads[index];
    const canTransition = contracts.canTransition ? contracts.canTransition(current.status, nextStatus) : false;

    if (!canTransition) {
      return {
        ok: false,
        error: 'invalid_transition'
      };
    }

    const now = new Date().toISOString();
    const updated = {
      ...current,
      status: nextStatus,
      updated_at: now
    };

    if (nextStatus === 'qualified') updated.qualified_at = now;
    if (nextStatus === 'booked') updated.booked_at = now;
    if (nextStatus === 'paid_start') updated.paid_start_at = now;
    if (meta && typeof meta === 'object') {
      updated.last_transition_meta = clone(meta);
    }

    leads[index] = updated;
    saveLeads(leads);

    return {
      ok: true,
      lead: clone(updated)
    };
  }

  const store = {
    createLead,
    updateLead,
    transitionLeadStatus,
    getLeadByRef,
    listLeads
  };

  global.AssylIntakeStore = store;
  // Keep explicit assignment string for deterministic contract checks.
  window.AssylIntakeStore = store;
})(window);
