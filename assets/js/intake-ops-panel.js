/*
 * Assyl-ai intake ops panel
 * Phase 03 / Plan 03 operator-only lifecycle controls
 */
(function initIntakeOpsPanel(global) {
  function getStore() {
    return global.AssylIntakeStore || null;
  }

  function getOperations() {
    return global.AssylIntakeOperations || null;
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function resolveNextStatuses(status) {
    const contracts = global.AssylIntakeContracts || {};
    const transitions = contracts.ALLOWED_TRANSITIONS || {};
    return transitions[status] || [];
  }

  function isoAtLocalDayStart(date) {
    const copy = new Date(date);
    copy.setHours(0, 0, 0, 0);
    return copy.toISOString();
  }

  function isoAtLocalDayEnd(date) {
    const copy = new Date(date);
    copy.setHours(23, 59, 59, 999);
    return copy.toISOString();
  }

  function buildWeeklyRange() {
    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - 6);
    return {
      weekStartISO: isoAtLocalDayStart(weekStart),
      weekEndISO: isoAtLocalDayEnd(now)
    };
  }

  function renderReportingBlock() {
    const reporting = global.AssylIntakeReporting;
    if (!reporting || typeof reporting.buildWeeklyFunnel !== 'function' || typeof reporting.formatWeeklySummary !== 'function') {
      return '<div class="mt-4 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-xl p-3">Reporting модулі табылмады. Weekly funnel көрінісі қолжетімсіз.</div>';
    }

    const range = buildWeeklyRange();
    const report = reporting.buildWeeklyFunnel(range);
    const summary = reporting.formatWeeklySummary(report);
    const totals = report.totals || { intent: 0, qualified: 0, booked: 0, paid: 0 };

    return `
      <div class="mt-4 bg-white border border-surface-200 rounded-2xl p-4">
        <div class="flex items-center justify-between gap-3 mb-3">
          <h4 class="font-semibold text-surface-900">Weekly Funnel (7 күн)</h4>
          <span class="text-xs text-surface-500">${escapeHtml(range.weekStartISO)} → ${escapeHtml(range.weekEndISO)}</span>
        </div>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3 text-sm">
          <div class="rounded-lg border border-surface-200 px-3 py-2"><span class="text-surface-500">intent</span><div class="font-bold text-surface-900">${totals.intent}</div></div>
          <div class="rounded-lg border border-surface-200 px-3 py-2"><span class="text-surface-500">qualified</span><div class="font-bold text-surface-900">${totals.qualified}</div></div>
          <div class="rounded-lg border border-surface-200 px-3 py-2"><span class="text-surface-500">booked</span><div class="font-bold text-surface-900">${totals.booked}</div></div>
          <div class="rounded-lg border border-surface-200 px-3 py-2"><span class="text-surface-500">paid</span><div class="font-bold text-surface-900">${totals.paid}</div></div>
        </div>
        <pre class="text-xs text-surface-700 bg-surface-50 border border-surface-100 rounded-lg p-3 overflow-x-auto">${escapeHtml(summary)}</pre>
      </div>
    `;
  }


  function renderActionButtons(lead) {
    const nextStatuses = resolveNextStatuses(lead.status || 'new');
    if (!nextStatuses.length) {
      return '<span class="text-xs text-surface-500">Келесі қадам жоқ</span>';
    }

    return nextStatuses
      .map((nextStatus) => (
        `<button type="button" data-action="advance-status" data-ref="${escapeHtml(lead.lead_ref)}" data-next-status="${escapeHtml(nextStatus)}" class="px-2 py-1 rounded-lg text-xs font-semibold bg-brand-50 text-brand-700 border border-brand-200 hover:bg-brand-100 transition">${escapeHtml(nextStatus)}</button>`
      ))
      .join(' ');
  }

  function renderRows(leads) {
    if (!leads.length) {
      return '<tr><td colspan="5" class="px-4 py-6 text-center text-surface-500">Лидтер әлі жоқ</td></tr>';
    }

    return leads
      .slice()
      .reverse()
      .map((lead) => `
        <tr class="border-t border-surface-100">
          <td class="px-4 py-3 font-mono text-xs text-surface-700">${escapeHtml(lead.lead_ref || '—')}</td>
          <td class="px-4 py-3 text-sm text-surface-700">${escapeHtml(lead.source_channel || 'unknown')}</td>
          <td class="px-4 py-3 text-sm font-semibold text-surface-900">${escapeHtml(lead.status || 'new')}</td>
          <td class="px-4 py-3 text-xs text-surface-500">${escapeHtml(lead.updated_at || lead.created_at || '—')}</td>
          <td class="px-4 py-3"><div class="flex flex-wrap gap-2">${renderActionButtons(lead)}</div></td>
        </tr>
      `)
      .join('');
  }

  function bindIntakeStatusActions(container) {
    if (!container) return;

    container.querySelectorAll('[data-action="advance-status"]').forEach((button) => {
      button.addEventListener('click', function onAdvanceClick() {
        const ref = button.getAttribute('data-ref');
        const nextStatus = button.getAttribute('data-next-status');
        const ops = getOperations();

        if (!ops || typeof ops.advanceLeadStatus !== 'function') return;

        ops.advanceLeadStatus(ref, nextStatus);
        renderIntakeOpsPanel(container);
      });
    });
  }

  function renderIntakeOpsPanel(container) {
    const host = container;
    if (!host) return;

    const store = getStore();
    const listLeads = store && typeof store.listLeads === 'function' ? store.listLeads.bind(store) : () => [];
    const leads = listLeads();

    host.innerHTML = `
      <div class="bg-surface-50 border-y border-surface-200">
        <div class="max-w-6xl mx-auto px-6 py-6">
          <div class="flex items-center justify-between gap-4 mb-4">
            <div>
              <h3 class="font-heading font-bold text-xl text-surface-900">Intake Operations Panel</h3>
              <p class="text-sm text-surface-600">Лид саны: ${leads.length}</p>
            </div>
            <span class="text-xs text-surface-500">ops=1 режимі</span>
          </div>
          <div class="overflow-x-auto bg-white border border-surface-200 rounded-2xl">
            <table class="min-w-full text-left">
              <thead class="bg-surface-100 text-surface-700 text-xs uppercase tracking-wide">
                <tr>
                  <th class="px-4 py-3">Lead Ref</th>
                  <th class="px-4 py-3">Source</th>
                  <th class="px-4 py-3">Status</th>
                  <th class="px-4 py-3">Updated</th>
                  <th class="px-4 py-3">Next</th>
                </tr>
              </thead>
              <tbody>
                ${renderRows(leads)}
              </tbody>
            </table>
          </div>
          ${renderReportingBlock()}
        </div>
      </div>
    `;

    bindIntakeStatusActions(host);
  }

  const api = {
    renderIntakeOpsPanel,
    bindIntakeStatusActions
  };

  global.AssylIntakeOpsPanel = api;
  // Keep explicit assignment string for deterministic checks.
  window.AssylIntakeOpsPanel = api;
})(window);
