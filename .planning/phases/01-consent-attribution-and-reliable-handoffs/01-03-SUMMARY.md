---
phase: 01-consent-attribution-and-reliable-handoffs
plan: 03
subsystem: ui
tags: [attribution, event-tracking, webhook, utm, localstorage-queue]
requires:
  - phase: 01-01
    provides: Shared contracts/runtime primitives (events, WA codes, storage keys, queue helpers)
  - phase: 01-02
    provides: Consent and handoff status flow used in lead payload metadata
provides:
  - Deterministic HTML tracking hooks for WhatsApp/call surfaces with WA channel codes
  - AssylAttribution runtime for first/last touch persistence and FR4 core event emission
  - AssylLeadWebhook transport with fetch POST and queue fallback for endpoint outages
affects: [reporting-readiness, consent-auditability, channel-optimization]
tech-stack:
  added: [vanilla-js-modules]
  patterns: [data-attribute-event-binding, localstorage-queue-retry, pii-minimized-wa-linking]
key-files:
  created: [assets/js/attribution-tracking.js, assets/js/lead-webhook.js, .planning/phases/01-consent-attribution-and-reliable-handoffs/01-03-SUMMARY.md]
  modified: [index.html]
key-decisions:
  - "Standardize CTA instrumentation through data-track/data-surface/data-wa-code attributes for deterministic analytics binding."
  - "Queue unsent webhook payloads locally and retry flush on load/interval to avoid silent event loss during endpoint downtime."
patterns-established:
  - "Attribution module initializes first-touch once and refreshes last-touch on every load before emitting events."
  - "Webhook payloads carry lead_ref + consent/source metadata while excluding raw name/phone in URL-bound handoff messages."
requirements-completed: [FR4, NFR3]
duration: 10m 47s
completed: 2026-04-05
---

# Phase 1 Plan 3: Implement attribution/event tracking and webhook + queue persistence Summary

**FR4 instrumentation now captures page/CTA/form/scroll events with UTM + WA channel markers, and a retryable webhook pipeline persists privacy-minimized lead/event records.**

## Performance

- **Duration:** 10m 47s
- **Started:** 2026-04-05T08:45:43Z
- **Completed:** 2026-04-05T08:56:30Z
- **Tasks:** 3
- **Files modified:** 3

## Accomplishments
- Added deterministic `data-track`, `data-surface`, and `data-wa-code` hooks to primary WhatsApp/call CTAs.
- Implemented `window.AssylAttribution` with `init`, `trackEvent`, `resolveCurrentTouch`, `decorateWhatsAppLink`, one-time `scroll_50`, and required core event taxonomy references.
- Implemented `window.AssylLeadWebhook` with `sendNow`, `enqueue`, `flushQueue`, `fetch(ASSYLAI_WEBHOOK_URL, ...)`, and queue fallback.
- Integrated runtime initialization in `index.html` (`window.ASSYLAI_WEBHOOK_URL`, `AssylAttribution.init()`, periodic queue flush every 30s).

## Task Commits

Each task was committed atomically:

1. **Task 1: Wire channel codes and trackable hooks into HTML** - `927aca3` (feat)
2. **Task 2: Implement attribution tracking module (UTM + core events)** - `dcae746` (feat)
3. **Task 3: Implement webhook transport with queue fallback and PII-minimized payloads** - `cdccf40` (feat)

## Files Created/Modified
- `assets/js/attribution-tracking.js` - Attribution init, UTM persistence, event listeners, and CTA decoration.
- `assets/js/lead-webhook.js` - Webhook sending, sanitization, enqueue fallback, and queue flush logic.
- `index.html` - Trackable CTA attributes, webhook URL constant, attribution init, and flush scheduling.

## Decisions Made
- Used data attributes as the stable contract between markup and instrumentation logic, avoiding brittle selector-based event wiring.
- Treated webhook outages/missing endpoint as normal reliability cases by queueing payloads instead of dropping them.

## Deviations from Plan

None - plan executed exactly as written.

## Known Stubs
- `index.html:87` — `window.ASSYLAI_WEBHOOK_URL = window.ASSYLAI_WEBHOOK_URL || '';` remains intentionally empty until deployment configuration provides the real endpoint.

## Authentication Gates
None.

## Issues Encountered
None.

## User Setup Required
External webhook service requires manual configuration:
- Set `window.ASSYLAI_WEBHOOK_URL` to a real POST endpoint in deployment/runtime config.
- Ensure endpoint accepts JSON payloads for both `event` and `lead` kinds.
- Verify by loading page and checking queued payload flush after network reconnect.

## Next Phase Readiness
- Phase 1 exit criteria are now met at implementation level: consent/handoff reliability + attribution/event persistence are in place.
- Phase 2 can proceed with messaging/trust work on top of established measurement and compliance foundations.

---
*Phase: 01-consent-attribution-and-reliable-handoffs*
*Completed: 2026-04-05*

## Self-Check: PASSED
