/*
 * Assyl-ai intake contracts
 * Phase 03 / Plan 01 canonical intake schema and lifecycle
 */
(function initIntakeContracts(global) {
  const LEAD_SCHEMA_VERSION = '2026-04-05.v1';
  const ALLOWED_STATUSES = ['new', 'qualified', 'booked', 'paid_start'];
  const ALLOWED_TRANSITIONS = {
    new: ['qualified'],
    qualified: ['booked'],
    booked: ['paid_start'],
    paid_start: []
  };
  const REQUIRED_LEAD_FIELDS = [
    'lead_ref',
    'status',
    'first_touch',
    'last_touch',
    'source_channel',
    'consent',
    'created_at',
    'updated_at'
  ];

  function validateLeadRecord(record) {
    const candidate = record && typeof record === 'object' ? record : {};
    const missing = REQUIRED_LEAD_FIELDS.filter((field) => {
      const value = candidate[field];
      return value === undefined || value === null || value === '';
    });

    return {
      valid: missing.length === 0,
      missing
    };
  }

  function canTransition(fromStatus, toStatus) {
    const nextOptions = ALLOWED_TRANSITIONS[fromStatus] || [];
    return nextOptions.includes(toStatus);
  }

  const contracts = {
    LEAD_SCHEMA_VERSION,
    ALLOWED_STATUSES,
    ALLOWED_TRANSITIONS,
    REQUIRED_LEAD_FIELDS,
    validateLeadRecord,
    canTransition
  };

  global.AssylIntakeContracts = contracts;
  // Keep explicit assignment string for deterministic contract checks.
  window.AssylIntakeContracts = contracts;
})(window);
