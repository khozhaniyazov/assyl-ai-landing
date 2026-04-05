/*
 * Assyl-ai lead runtime helpers
 * Phase 01 / Plan 01 shared utility layer
 */
(function initLeadRuntime(global) {
  const contracts = global.AssylLeadContracts || {};
  const storageKeys = contracts.STORAGE_KEYS || {
    FIRST_TOUCH: 'assyl_first_touch',
    LAST_TOUCH: 'assyl_last_touch',
    EVENT_QUEUE: 'assyl_event_queue',
    LEAD_QUEUE: 'assyl_lead_queue'
  };

  function safeParse(value, fallback) {
    if (!value) return fallback;
    try {
      return JSON.parse(value);
    } catch (_err) {
      return fallback;
    }
  }

  function parseUtmParams(url) {
    const href = url || global.location.href;
    const parsed = new URL(href, global.location.origin);
    const params = parsed.searchParams;

    return {
      utm_source: params.get('utm_source') || '',
      utm_medium: params.get('utm_medium') || '',
      utm_campaign: params.get('utm_campaign') || '',
      utm_content: params.get('utm_content') || '',
      utm_term: params.get('utm_term') || '',
      ref: params.get('ref') || '',
      source: params.get('source') || ''
    };
  }

  function resolveTouchKey(type) {
    return type === 'first' ? storageKeys.FIRST_TOUCH : storageKeys.LAST_TOUCH;
  }

  function readTouch(type) {
    const key = resolveTouchKey(type);
    return safeParse(global.localStorage.getItem(key), null);
  }

  function writeTouch(type, payload) {
    const key = resolveTouchKey(type);
    const value = {
      ...(payload || {}),
      updated_at: new Date().toISOString()
    };
    global.localStorage.setItem(key, JSON.stringify(value));
    return value;
  }

  function resolveQueueKey(kind) {
    return kind === 'lead' ? storageKeys.LEAD_QUEUE : storageKeys.EVENT_QUEUE;
  }

  function queueItem(kind, payload) {
    const key = resolveQueueKey(kind);
    const queue = safeParse(global.localStorage.getItem(key), []);
    const item = {
      kind,
      payload,
      queued_at: new Date().toISOString()
    };

    queue.push(item);
    global.localStorage.setItem(key, JSON.stringify(queue));
    return item;
  }

  function dequeueAll(kind) {
    const key = resolveQueueKey(kind);
    const queue = safeParse(global.localStorage.getItem(key), []);
    global.localStorage.removeItem(key);
    return queue;
  }

  function buildLeadRef() {
    const timestamp = Date.now();
    const randomChunk = Math.random().toString(36).slice(2, 6).toUpperCase();
    return `L-${timestamp}-${randomChunk}`;
  }

  const runtime = {
    parseUtmParams,
    readTouch,
    writeTouch,
    queueItem,
    dequeueAll,
    buildLeadRef
  };

  global.AssylLeadRuntime = runtime;
  // Keep explicit assignment string for deterministic contract checks.
  window.AssylLeadRuntime = runtime;
})(window);
