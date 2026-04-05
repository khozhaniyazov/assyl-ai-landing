/*
 * Assyl-ai intake reporting
 * Phase 03 / Plan 03 weekly funnel aggregation
 */
(function initIntakeReporting(global) {
  function toTime(value) {
    const t = new Date(value).getTime();
    return Number.isNaN(t) ? null : t;
  }

  function isWithinWindow(lead, startMs, endMs) {
    const created = toTime(lead.created_at);
    if (created === null) return false;
    return created >= startMs && created <= endMs;
  }

  function initChannelBucket() {
    return {
      intent: 0,
      qualified: 0,
      booked: 0,
      paid: 0
    };
  }

  function bumpStageCounts(bucket, lead, startMs, endMs) {
    bucket.intent += 1;

    const status = lead.status;
    const qualifiedAt = toTime(lead.qualified_at);
    const bookedAt = toTime(lead.booked_at);
    const paidStartAt = toTime(lead.paid_start_at);

    const qualifiedByStatus = status === 'qualified' || status === 'booked' || status === 'paid_start';
    const bookedByStatus = status === 'booked' || status === 'paid_start';
    const paidByStatus = status === 'paid_start';

    const qualifiedByTime = qualifiedAt !== null && qualifiedAt >= startMs && qualifiedAt <= endMs;
    const bookedByTime = bookedAt !== null && bookedAt >= startMs && bookedAt <= endMs;
    const paidByTime = paidStartAt !== null && paidStartAt >= startMs && paidStartAt <= endMs;

    if (qualifiedByStatus || qualifiedByTime) bucket.qualified += 1;
    if (bookedByStatus || bookedByTime) bucket.booked += 1;
    if (paidByStatus || paidByTime) bucket.paid += 1;
  }

  function buildWeeklyFunnel(input) {
    const params = input && typeof input === 'object' ? input : {};
    const weekStartISO = params.weekStartISO;
    const weekEndISO = params.weekEndISO;

    const startMs = toTime(weekStartISO);
    const endMs = toTime(weekEndISO);

    if (startMs === null || endMs === null || endMs < startMs) {
      return {
        weekStartISO: weekStartISO || '',
        weekEndISO: weekEndISO || '',
        totals: initChannelBucket(),
        channels: {}
      };
    }

    const store = global.AssylIntakeStore;
    const listLeads = store && typeof store.listLeads === 'function' ? store.listLeads.bind(store) : () => [];
    const leads = listLeads();

    const channels = {};
    const totals = initChannelBucket();

    leads.filter((lead) => isWithinWindow(lead, startMs, endMs)).forEach((lead) => {
      const channel = lead.source_channel || 'unknown';
      if (!channels[channel]) {
        channels[channel] = initChannelBucket();
      }

      bumpStageCounts(channels[channel], lead, startMs, endMs);
      bumpStageCounts(totals, lead, startMs, endMs);
    });

    return {
      weekStartISO,
      weekEndISO,
      totals,
      channels
    };
  }

  function formatWeeklySummary(report) {
    const payload = report && typeof report === 'object' ? report : {};
    const channels = payload.channels || {};
    const channelLines = Object.keys(channels)
      .sort()
      .map((channel) => {
        const row = channels[channel];
        return `${channel}: intent=${row.intent}, qualified=${row.qualified}, booked=${row.booked}, paid=${row.paid}`;
      });

    const totals = payload.totals || initChannelBucket();

    return [
      `week: ${payload.weekStartISO || ''} -> ${payload.weekEndISO || ''}`,
      ...channelLines,
      `totals: intent=${totals.intent}, qualified=${totals.qualified}, booked=${totals.booked}, paid=${totals.paid}`
    ].join('\n');
  }

  const api = {
    buildWeeklyFunnel,
    formatWeeklySummary
  };

  global.AssylIntakeReporting = api;
  // Keep explicit assignment string for deterministic checks.
  window.AssylIntakeReporting = api;
})(window);
