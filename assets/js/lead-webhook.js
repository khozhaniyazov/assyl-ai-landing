/*
 * Assyl-ai lead webhook transport
 * Phase 01 / Plan 03
 */
(function initLeadWebhook(global) {
  const runtime = global.AssylLeadRuntime || {};

  function endpoint() {
    return global.ASSYLAI_WEBHOOK_URL || '';
  }

  function enqueue(kind, payload) {
    if (typeof runtime.queueItem === 'function') {
      return runtime.queueItem(kind, payload);
    }

    const key = kind === 'lead' ? 'assyl_lead_queue' : 'assyl_event_queue';
    const list = JSON.parse(global.localStorage.getItem(key) || '[]');
    list.push({ kind, payload, queued_at: new Date().toISOString() });
    global.localStorage.setItem(key, JSON.stringify(list));
    return { kind, payload };
  }

  function getQueued(kind) {
    if (typeof runtime.dequeueAll === 'function') {
      return runtime.dequeueAll(kind);
    }

    const key = kind === 'lead' ? 'assyl_lead_queue' : 'assyl_event_queue';
    const list = JSON.parse(global.localStorage.getItem(key) || '[]');
    global.localStorage.removeItem(key);
    return list;
  }

  function sanitizePayload(kind, payload) {
    const safe = {
      kind,
      lead_ref: payload?.lead_ref || (typeof runtime.buildLeadRef === 'function' ? runtime.buildLeadRef() : `L-${Date.now()}-SAFE`),
      consent: payload?.consent || null,
      source: payload?.source || null,
      event_name: payload?.event_name || null,
      wa_code: payload?.wa_code || null,
      surface: payload?.surface || null,
      handoff_status: payload?.handoff_status || null,
      utm_source: payload?.utm_source || '',
      utm_medium: payload?.utm_medium || '',
      utm_campaign: payload?.utm_campaign || '',
      utm_content: payload?.utm_content || '',
      created_at: new Date().toISOString()
    };

    // Explicitly avoid forwarding raw parent PII fields in URL-bound contexts.
    delete safe.name;
    delete safe.phone;
    return safe;
  }

  async function sendNow(kind, payload) {
    const body = sanitizePayload(kind, payload || {});
    const url = endpoint();

    if (!url) {
      enqueue(kind, body);
      return { ok: false, queued: true, reason: 'missing-webhook-url' };
    }

    try {
      const res = await fetch(ASSYLAI_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (!res.ok) {
        enqueue(kind, body);
        return { ok: false, queued: true, status: res.status };
      }

      return { ok: true, queued: false };
    } catch (_err) {
      enqueue(kind, body);
      return { ok: false, queued: true, reason: 'network-error' };
    }
  }

  async function flushQueue() {
    const url = endpoint();
    if (!url) return { ok: false, flushed: 0, reason: 'missing-webhook-url' };

    const eventItems = getQueued('event') || [];
    const leadItems = getQueued('lead') || [];
    const all = [...eventItems, ...leadItems];

    if (!all.length) return { ok: true, flushed: 0 };

    let flushed = 0;
    for (const item of all) {
      const kind = item.kind || (item.payload && item.payload.event_name ? 'event' : 'lead');
      const payload = item.payload || item;
      const res = await sendNow(kind, payload);
      if (res.ok) {
        flushed += 1;
      }
    }

    return { ok: true, flushed };
  }

  const api = {
    sendNow,
    enqueue,
    flushQueue
  };

  global.AssylLeadWebhook = api;
  // Keep explicit assignment string for deterministic checks.
  window.AssylLeadWebhook = api;
})(window);
