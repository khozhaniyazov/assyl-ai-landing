/*
 * Assyl-ai consent + handoff gate
 * Phase 01 / Plan 02
 */
(function initConsentHandoff(global) {
  const FALLBACK_TEL = '+77773321002';
  const contracts = global.AssylLeadContracts || {};

  const SURFACES = {
    checker: {
      consentId: 'consent-checker',
      errorId: 'consent-error-checker',
      statusId: 'status-checker',
      actionSelector: '#checker-wa'
    },
    form: {
      consentId: 'consent-form',
      errorId: 'consent-error-form',
      statusId: 'status-form',
      actionSelector: '#submitBtn'
    },
    sticky: {
      consentId: 'consent-sticky',
      errorId: 'consent-error-sticky',
      statusId: 'status-sticky',
      actionSelector: '#sticky-wa'
    }
  };

  function byId(id) {
    return global.document.getElementById(id);
  }

  function ensureStatusNode(surfaceId) {
    const surface = SURFACES[surfaceId];
    if (!surface) return null;

    let statusNode = byId(surface.statusId);
    if (statusNode) return statusNode;

    const actionNode = global.document.querySelector(surface.actionSelector);
    if (!actionNode) return null;

    statusNode = global.document.createElement('div');
    statusNode.id = surface.statusId;
    statusNode.setAttribute('role', 'status');
    statusNode.setAttribute('aria-live', 'polite');
    statusNode.setAttribute('aria-atomic', 'true');
    statusNode.className = 'mt-2 text-xs';
    actionNode.insertAdjacentElement('afterend', statusNode);
    return statusNode;
  }

  function setError(surfaceId, message) {
    const surface = SURFACES[surfaceId];
    if (!surface) return;
    const errorNode = byId(surface.errorId);
    if (!errorNode) return;

    if (message) {
      errorNode.textContent = message;
      errorNode.classList.remove('hidden');
    } else {
      errorNode.classList.add('hidden');
    }
  }

  function ensureConsent(surfaceId) {
    const surface = SURFACES[surfaceId];
    if (!surface) return false;
    const checkbox = byId(surface.consentId);
    const isConsented = Boolean(checkbox && checkbox.checked);

    if (!isConsented) {
      setError(surfaceId, 'Жалғастыру үшін келісімді белгілеңіз.');
      renderStatus(surfaceId, 'manual_next_step', {
        message: 'Алдымен келісімді белгілеңіз, содан кейін қайта әрекет жасаңыз.'
      });
      return false;
    }

    setError(surfaceId, '');
    return true;
  }

  function recordConsent(surfaceId) {
    const payload = {
      surfaceId,
      consentVersion: contracts.CONSENT_VERSION || '2026-04-05.v1',
      timestamp: new Date().toISOString(),
      pageUrl: global.location.href
    };

    const key = 'assyl_consent_log';
    const existing = JSON.parse(global.localStorage.getItem(key) || '[]');
    existing.push(payload);
    global.localStorage.setItem(key, JSON.stringify(existing));
    return payload;
  }

  function renderStatus(surfaceId, status, details) {
    const statusNode = ensureStatusNode(surfaceId);
    if (!statusNode) return;

    const fallbackTel = (details && details.fallbackTel) || FALLBACK_TEL;
    const detail = details || {};
    statusNode.dataset.status = status;

    if (status === 'attempted') {
      statusNode.className = 'mt-2 text-xs text-surface-600';
      statusNode.textContent = detail.message || 'Хабарлама жіберу әрекеті басталды...';
      return;
    }

    if (status === 'opened') {
      statusNode.className = 'mt-2 text-xs text-emerald-600';
      statusNode.textContent = detail.message || 'WhatsApp ашылды. Хабарламаңызды жіберіңіз.';
      return;
    }

    if (status === 'blocked_fallback') {
      statusNode.className = 'mt-2 text-xs text-amber-700';
      statusNode.innerHTML = `${detail.message || 'WhatsApp автоматты ашылмады.'} <a class="underline font-semibold" href="tel:${fallbackTel}">Қоңырау: ${fallbackTel}</a>`;
      return;
    }

    if (status === 'manual_next_step') {
      statusNode.className = 'mt-2 text-xs text-surface-700';
      statusNode.textContent = detail.message || `WhatsApp ашылмаса, ${fallbackTel} нөміріне қолмен хабарласыңыз.`;
      return;
    }
  }

  function beginHandoff(surfaceId, waUrl, fallbackTel) {
    const phone = fallbackTel || FALLBACK_TEL;
    renderStatus(surfaceId, 'attempted', { fallbackTel: phone });

    const openedWindow = global.window.open(waUrl, '_blank');

    if (openedWindow && !openedWindow.closed) {
      renderStatus(surfaceId, 'opened', { fallbackTel: phone });
      return { status: 'opened', opened: true };
    }

    renderStatus(surfaceId, 'blocked_fallback', {
      fallbackTel: phone,
      message: 'WhatsApp автоматты ашылмады. Балама әрекет қолданыңыз.'
    });
    renderStatus(surfaceId, 'manual_next_step', {
      fallbackTel: phone,
      message: `WhatsApp-қа өзіңіз өтіңіз немесе ${phone} нөміріне қоңырау шалыңыз.`
    });

    return { status: 'blocked_fallback', opened: false };
  }

  function bindChecker() {
    const checkerLink = global.document.getElementById('checker-wa');
    if (!checkerLink) return;

    const statusNode = ensureStatusNode('checker');
    if (statusNode && !statusNode.textContent.trim()) {
      statusNode.className = 'mt-2 text-xs text-surface-500';
      statusNode.textContent = 'WhatsApp-қа өтпес бұрын келісімді белгілеңіз.';
    }

    checkerLink.addEventListener('click', function onCheckerClick(e) {
      if (!ensureConsent('checker')) {
        e.preventDefault();
        return;
      }

      e.preventDefault();
      recordConsent('checker');
      beginHandoff('checker', checkerLink.href, FALLBACK_TEL);
    });
  }

  function bindSticky() {
    const stickyLink = global.document.getElementById('sticky-wa');
    if (!stickyLink) return;

    stickyLink.addEventListener('click', function onStickyClick(e) {
      if (!ensureConsent('sticky')) {
        e.preventDefault();
        return;
      }

      e.preventDefault();
      recordConsent('sticky');
      beginHandoff('sticky', stickyLink.href, FALLBACK_TEL);
    });
  }

  function bindForm() {
    const form = global.document.getElementById('lead-form');
    if (!form) return;

    form.addEventListener('submit', function onFormSubmit(e) {
      if (!ensureConsent('form')) {
        e.preventDefault();
        e.stopImmediatePropagation();
        return false;
      }

      recordConsent('form');
      return true;
    }, true);
  }

  const api = {
    ensureConsent,
    recordConsent,
    beginHandoff,
    renderStatus
  };

  global.AssylConsentHandoff = api;
  // Keep explicit assignment string for deterministic checks.
  window.AssylConsentHandoff = api;

  function init() {
    bindChecker();
    bindSticky();
    bindForm();
  }

  if (global.document.readyState === 'loading') {
    global.document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})(window);
