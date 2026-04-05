# Codebase Concerns

**Analysis Date:** 2026-04-05

## Prioritized Risk Register

| Priority | Concern | Category | Evidence | Impact | Likelihood | Suggested Mitigation |
|---|---|---|---|---|---|---|
| P1 | Lead capture depends on WhatsApp only; no durable backend pipeline | Product / Operational | `index.html` (lines 763-777, 868-915) shows form submission only opens `wa.me`; no API call or persistence layer in repository | High conversion leakage, no lead history, weak follow-up quality, no attribution fidelity | High | Add server-side lead endpoint and CRM storage; keep WhatsApp as secondary channel. Track `form_submit`, `wa_open_success`, and drop-off metrics. |
| P1 | Privacy and consent gap for personal data transfer to third-party messaging | Security / Privacy | `index.html` (lines 763-777, 890-905) sends parent name/phone through URL query to WhatsApp without explicit consent text/policy link | Compliance and trust risk (PII transfer without explicit consent disclosure), legal exposure | High | Add explicit consent checkbox and privacy policy link near submit button; state destination (WhatsApp/Meta) and retention rules; block submit unless consent is checked. |
| P1 | Marketing claims likely unverifiable in-code | Product / Legal / SEO trust | `index.html` (lines 208-212, 256-276, 685-686) includes hard claims like “1 айда нәтиже”, “93%”, “500+” with no evidence source in repo | Reputation/legal risk if challenged; reduced trust if users perceive overclaiming | Medium-High | Add source-backed qualifier text and visible methodology footnote; align copy with documented outcomes or convert to softer claim language. |
| P2 | Single-file architecture creates fragile change surface | Maintainability / Technical | Entire app is in `index.html` (918 lines), including markup, styling config, business logic (lines 98-153, 804-915) | High regression risk, slow edits, hard onboarding, difficult reuse/testing | High | Split into modular assets (`assets/js/*.js`, `assets/css/*.css`, section partials or static build step); isolate checker/form scripts and SEO schema blocks. |
| P2 | External CDN runtime dependency for core rendering/UX | Technical / Operational | `index.html` loads Tailwind CDN runtime (`cdn.tailwindcss.com` line 91), Lucide (`unpkg.com` line 96), Google Fonts (lines 92-95) | Outage/performance variability; render degradation if blocked; harder deterministic builds | Medium | Pin and self-host critical assets (CSS/icons/fonts) or add local fallback bundles; monitor third-party availability. |
| P2 | No automated quality gates before deployment | Operational / Maintainability | `.github/workflows/deploy.yml` only checks out and deploys (lines 24-37); no lint, HTML validation, link check, accessibility checks | Broken markup/links/accessibility can reach production directly | Medium-High | Add CI job for HTML lint, link checker, Lighthouse CI (performance/a11y), and schema validation before deploy step. |
| P2 | Analytics instrumentation is partial and optional | Product / Operational | `index.html` initializes Pixel script (lines 86-90), but `META_PIXEL_ID` defaults empty (line 88); only `Lead` event is conditional (line 894) | Incomplete funnel visibility and unreliable marketing attribution | Medium | Introduce explicit analytics strategy: first-party events + optional pixel; record core funnel events independent of third-party scripts. |
| P3 | Accessibility gaps in form semantics and dynamic status announcements | SEO/Accessibility | Inputs at `index.html` lines 765-770 use visual labels without `for`/`id`; success state at line 776 lacks live-region semantics | Screen-reader usability friction; lower a11y quality scores | Medium | Add `id` on inputs and matching `for` labels; mark success container with `role="status"`/`aria-live="polite"`; include inline error text region. |
| P3 | Potential footer markup inconsistency and structure brittleness | Maintainability / SEO semantics | Footer region in `index.html` (lines 785-802) contains nested closing tags that are hard to audit in monolithic file | Semantic/layout break risk in future edits; crawler parsing fragility | Medium | Validate HTML in CI and refactor footer/mobile CTA into isolated components to avoid accidental nesting issues. |
| P3 | No explicit 404 or fallback page for GitHub Pages | Operational / SEO | Repository root has `index.html`, `CNAME`, `.nojekyll` but no `404.html` | Poor UX for bad links, crawl inefficiency, lost traffic recovery paths | Medium | Add `404.html` with key CTAs and canonical navigation to recover users and preserve conversions. |

## Tech Debt

**Monolithic static page architecture:**
- Issue: All page sections, style config, and JavaScript behaviors are coupled inside one file.
- Files: `index.html`
- Impact: Small edits can introduce cross-section regressions; refactors are expensive and error-prone.
- Fix approach: Introduce a simple static build/layout structure (`assets/js/`, `assets/css/`, modular includes or template fragments) and keep each behavior in isolated scripts.

**Inlined business logic and DOM string templating:**
- Issue: Checker rendering and form logic build HTML/URLs directly in event handlers.
- Files: `index.html` (lines 836-865, 868-915)
- Impact: Hard to unit-test and sanitize; harder to expand behavior safely.
- Fix approach: Extract pure functions for input validation, specialist mapping, message generation, and UI rendering; test them independently.

## Known Bugs

**Submission success UI can appear even when WhatsApp navigation does not complete:**
- Symptoms: User sees “Жіберілді” status before confirming WhatsApp handoff outcome.
- Files: `index.html` (lines 896-905)
- Trigger: Popup blocked, interrupted navigation, or user cancellation after UI success state.
- Workaround: Encourage direct WhatsApp CTA links as fallback.

## Security Considerations

**PII in URL query parameters to third-party endpoint:**
- Risk: Name/phone are embedded in URL query string to `wa.me`, which can leak via browser history, device logs, and third-party telemetry.
- Files: `index.html` (lines 890-893, 902-905)
- Current mitigation: None detected besides HTTPS destination.
- Recommendations: Minimize PII in URL, ask only consented fields, offer first-party submit endpoint, and provide privacy notice with explicit consent.

**Third-party script trust boundary:**
- Risk: Remote scripts from CDNs execute in-page and can affect availability/security posture.
- Files: `index.html` (lines 91, 96)
- Current mitigation: Version pinning present for Lucide and Tailwind query pin.
- Recommendations: Prefer self-hosted assets or SRI-supported static files and keep dependency inventory documented.

## Performance Bottlenecks

**Runtime Tailwind compilation and large single payload path:**
- Problem: Rendering depends on Tailwind CDN runtime script and a large monolithic HTML document.
- Files: `index.html` (line 91; full 918-line document)
- Cause: No build step and no precompiled CSS bundle.
- Improvement path: Precompile Tailwind into static CSS, minify assets, and keep critical CSS inline only where necessary.

**Image delivery strategy still mixed:**
- Problem: Although `webp` variants exist, fallback JPGs remain primary for unsupported contexts and no responsive `srcset` widths are defined.
- Files: `index.html` (lines 235-238, 612-615), `hero.jpg`, `hero.webp`, `specialist.jpg`, `specialist.webp`
- Cause: Basic `<picture>` usage without responsive variants.
- Improvement path: Add multiple responsive sizes and width descriptors; ensure strongest compression for mobile-first delivery.

## Fragile Areas

**Form submission and CTA funnel logic:**
- Files: `index.html` (lines 744-777, 868-915)
- Why fragile: Critical conversion path is entirely client-side and interwoven with button state/UI timing.
- Safe modification: Change validation/message generation first, then handoff logic; verify mobile and desktop popup behavior after each change.
- Test coverage: No automated tests detected in repository.

**Checker interaction rendering:**
- Files: `index.html` (lines 294-374, 836-865)
- Why fragile: UI state, copy, and link generation are tightly coupled to DOM structure and `data-*` attributes.
- Safe modification: Keep a stable data contract (`data-specialist`), avoid direct HTML string concatenation where possible, and re-run icon hydration checks.
- Test coverage: No automated tests detected in repository.

## Scaling Limits

**Operational scaling of inbound leads:**
- Current capacity: Manual handling via a single WhatsApp number and phone line in `index.html` links.
- Limit: Throughput and response quality degrade as lead volume grows; no queueing or assignment logic.
- Scaling path: Add intake backend + CRM workflow (status, owner, SLA), then keep WhatsApp as communication endpoint rather than intake system.

## Dependencies at Risk

**CDN-hosted UI dependencies:**
- Risk: Availability and performance rely on third-party CDNs (`cdn.tailwindcss.com`, `unpkg.com`, Google Fonts).
- Impact: Broken styling/icons/fonts if CDN blocked or degraded.
- Migration plan: Vendor-lock minimal static assets into repository build output and serve from GitHub Pages/Cloudflare.

## Missing Critical Features

**Persistent lead tracking and attribution:**
- Problem: No durable lead capture, source attribution, or conversion telemetry pipeline exists in repository.
- Blocks: Reliable ROI analysis, campaign optimization, structured follow-up automation.

**Privacy policy and consent UX:**
- Problem: No visible policy page or explicit consent step in form flow.
- Blocks: Strong compliance posture and user trust for personal data handling.

## Test Coverage Gaps

**Core conversion behaviors untested:**
- What's not tested: Form validation, popup fallback flow, checker specialist mapping, and generated WhatsApp payloads.
- Files: `index.html` (lines 836-915)
- Risk: Silent conversion regressions and broken lead flow after copy/layout updates.
- Priority: High

**Deployment quality checks absent:**
- What's not tested: HTML validity, broken links, schema integrity, and accessibility regressions pre-deploy.
- Files: `.github/workflows/deploy.yml`, `index.html`
- Risk: Production issues shipped directly to live site.
- Priority: High

---

*Concerns audit: 2026-04-05*
