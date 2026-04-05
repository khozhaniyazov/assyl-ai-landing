/*
 * Assyl-ai lead contracts
 * Phase 01 / Plan 01 canonical shared constants
 */
(function initLeadContracts(global) {
  const contracts = {
    CONSENT_VERSION: '2026-04-05.v1',
    EVENTS: {
      VIEW_PAGE: 'view_page',
      CLICK_WHATSAPP: 'click_whatsapp',
      CLICK_PHONE: 'click_phone',
      SUBMIT_FORM: 'submit_form',
      SCROLL_50: 'scroll_50'
    },
    STORAGE_KEYS: {
      FIRST_TOUCH: 'assyl_first_touch',
      LAST_TOUCH: 'assyl_last_touch',
      EVENT_QUEUE: 'assyl_event_queue',
      LEAD_QUEUE: 'assyl_lead_queue'
    },
    WA_CODES: {
      FLOAT: 'WA_FLOAT',
      HERO: 'WA_HERO',
      CHECKER: 'WA_CHECKER',
      MID_CTA: 'WA_MID',
      FORM: 'WA_FORM',
      STICKY: 'WA_STICKY'
    }
  };

  global.AssylLeadContracts = contracts;
  // Keep explicit assignment string for deterministic contract checks.
  window.AssylLeadContracts = contracts;
})(window);
