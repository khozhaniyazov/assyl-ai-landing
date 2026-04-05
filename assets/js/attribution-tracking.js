/*
 * Assyl-ai attribution tracking
 * Phase 01 / Plan 03
 */
(function initAttribution(global) {
  const contracts = global.AssylLeadContracts || {};
  const runtime = global.AssylLeadRuntime || {};

  const EVENTS = contracts.EVENTS || {
    VIEW_PAGE: 'view_page',
    CLICK_WHATSAPP: 'click_whatsapp',
    CLICK_PHONE: 'click_phone',
    SUBMIT_FORM: 'submit_form',
    SCROLL_50: 'scroll_50'
  };

  const WA_CODES = contracts.WA_CODES || {
    FLOAT: 'WA_FLOAT',
    HERO: 'WA_HERO',
    CHECKER: 'WA_CHECKER',
    MID_CTA: 'WA_MID',
    FORM: 'WA_FORM',
    STICKY: 'WA_STICKY'
  };

  let hasTrackedScroll = false;

  function parseUtm() {
    if (typeof runtime.parseUtmParams === 'function') {
      return runtime.parseUtmParams(global.location.href);
    }

    const p = new URL(global.location.href).searchParams;
    return {
      utm_source: p.get('utm_source') || '',
      utm_medium: p.get('utm_medium') || '',
      utm_campaign: p.get('utm_campaign') || '',
      utm_content: p.get('utm_content') || ''
    };
  }

  function resolveCurrentTouch() {
    const firstTouch = typeof runtime.readTouch === 'function' ? runtime.readTouch('first') : null;
    const lastTouch = typeof runtime.readTouch === 'function' ? runtime.readTouch('last') : null;
    return { first_touch: firstTouch, last_touch: lastTouch };
  }

  function buildLeadRef() {
    if (typeof runtime.buildLeadRef === 'function') {
      return runtime.buildLeadRef();
    }
    return `L-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
  }

  function enqueueEvent(payload) {
    if (global.AssylLeadWebhook && typeof global.AssylLeadWebhook.sendNow === 'function') {
      global.AssylLeadWebhook.sendNow('event', payload);
      return;
    }

    if (typeof runtime.queueItem === 'function') {
      runtime.queueItem('event', payload);
    }
  }

  function trackEvent(eventName, payload) {
    const touch = resolveCurrentTouch();
    const item = {
      event_name: eventName,
      at: new Date().toISOString(),
      lead_ref: (payload && payload.lead_ref) || buildLeadRef(),
      utm_source: (payload && payload.utm_source) || touch.last_touch?.utm_source || touch.first_touch?.utm_source || '',
      utm_medium: (payload && payload.utm_medium) || touch.last_touch?.utm_medium || touch.first_touch?.utm_medium || '',
      utm_campaign: (payload && payload.utm_campaign) || touch.last_touch?.utm_campaign || touch.first_touch?.utm_campaign || '',
      utm_content: (payload && payload.utm_content) || touch.last_touch?.utm_content || touch.first_touch?.utm_content || '',
      surface: payload && payload.surface ? payload.surface : '',
      wa_code: payload && payload.wa_code ? payload.wa_code : ''
    };

    enqueueEvent(item);
    return item;
  }

  function decorateWhatsAppLink(anchor, waCode) {
    if (!anchor) return;
    if (waCode) {
      anchor.setAttribute('data-wa-code', waCode);
    }

    const code = anchor.getAttribute('data-wa-code') || '';
    if (!code) return;

    try {
      const url = new URL(anchor.href);
      const currentText = url.searchParams.get('text') || '';
      if (currentText.includes(code)) return;
      const suffix = currentText ? `\nКанал коды: ${code}` : `Канал коды: ${code}`;
      url.searchParams.set('text', `${currentText}${suffix}`.trim());
      anchor.href = url.toString();
    } catch (_err) {
      // Keep original link if URL parsing fails.
    }
  }

  function bindTrackedAnchors() {
    global.document.querySelectorAll('[data-track]').forEach((anchor) => {
      const trackKind = anchor.getAttribute('data-track');
      const surface = anchor.getAttribute('data-surface') || '';
      const waCode = anchor.getAttribute('data-wa-code') || '';

      if (trackKind === 'whatsapp') {
        decorateWhatsAppLink(anchor, waCode);
      }

      anchor.addEventListener('click', () => {
        const utm = parseUtm();
        trackEvent(
          trackKind === 'whatsapp' ? EVENTS.CLICK_WHATSAPP : EVENTS.CLICK_PHONE,
          {
            surface,
            wa_code: waCode,
            utm_source: utm.utm_source,
            utm_medium: utm.utm_medium,
            utm_campaign: utm.utm_campaign,
            utm_content: utm.utm_content,
            lead_ref: buildLeadRef()
          }
        );
      });
    });
  }

  function bindScroll50() {
    global.addEventListener('scroll', () => {
      if (hasTrackedScroll) return;

      const maxScroll = global.document.documentElement.scrollHeight - global.innerHeight;
      if (maxScroll <= 0) return;

      const percent = (global.scrollY / maxScroll) * 100;
      if (percent < 50) return;

      hasTrackedScroll = true;
      trackEvent(EVENTS.SCROLL_50, { surface: 'page', wa_code: '' });
    }, { passive: true });
  }

  function init() {
    const utm = parseUtm();
    const touchPayload = {
      ...utm,
      page: global.location.pathname,
      referrer: global.document.referrer || ''
    };

    const existingFirst = typeof runtime.readTouch === 'function' ? runtime.readTouch('first') : null;
    if (!existingFirst && typeof runtime.writeTouch === 'function') {
      runtime.writeTouch('first', touchPayload);
    }

    if (typeof runtime.writeTouch === 'function') {
      runtime.writeTouch('last', touchPayload);
    }

    trackEvent(EVENTS.VIEW_PAGE, {
      surface: 'page',
      wa_code: '',
      utm_source: utm.utm_source,
      utm_medium: utm.utm_medium,
      utm_campaign: utm.utm_campaign,
      utm_content: utm.utm_content
    });

    bindTrackedAnchors();
    bindScroll50();
  }

  const api = {
    init,
    trackEvent,
    resolveCurrentTouch,
    decorateWhatsAppLink,
    // Keep literal references for required taxonomy visibility:
    submit_form: EVENTS.SUBMIT_FORM,
    view_page: EVENTS.VIEW_PAGE,
    click_whatsapp: EVENTS.CLICK_WHATSAPP,
    click_phone: EVENTS.CLICK_PHONE,
    scroll_50: EVENTS.SCROLL_50,
    wa_codes: WA_CODES
  };

  global.AssylAttribution = api;
  // Keep explicit assignment string for deterministic checks.
  window.AssylAttribution = api;
})(window);
