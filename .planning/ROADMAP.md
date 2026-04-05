# ROADMAP

## Phases

- [x] **Phase 1: Consent, Attribution, and Reliable Handoffs** - Make every lead action consented, measurable, and reliably handed off to WhatsApp/call paths.
- [x] **Phase 2: Audience Messaging and Trust Layer** - Improve segment-fit messaging and evidence quality so parents can decide with confidence.
- [x] **Phase 3: Intake Operations Data Contract** - Standardize lead lifecycle data so operators can qualify, book, and track outcomes consistently.
- [x] **Phase 4: Quality Gates and Deployment Readiness** - Add pre-publish guardrails for quality, performance, accessibility, and safe releases.

## Phase Details

### Phase 1: Consent, Attribution, and Reliable Handoffs
**Goal**: Parents can start contact through WhatsApp/call/form with explicit consent, clear fallback behavior, and source attribution captured.
**Depends on**: Nothing (first phase)
**Requirements**: FR1, FR2, FR4, NFR3
**Success Criteria** (what must be TRUE):
  1. Parent cannot submit lead actions without actively granting consent and can open the privacy disclosure directly from the same action area.
  2. Parent can complete WhatsApp-first or call alternative flows on common mobile devices without broken sticky CTA behavior.
  3. Lead handoff UI communicates real outcome states (attempted, fallback, next step) so users are not falsely told submission succeeded.
  4. UTM/source markers and channel-specific WhatsApp codes are persisted and visible in captured lead/event records for core actions (page view, WhatsApp click, call click, form submit, major scroll).
**Exit Gate**: Consent enforcement + metadata logging + channel attribution + core event tracking are verified in production-like flow and meet the acceptance baseline for attribution completeness.
**Plans**: 3 plans
Plans:
- [x] 01-01-PLAN.md — Define shared lead contracts/runtime and bootstrap phase scripts.
- [x] 01-02-PLAN.md — Enforce consent and truthful WhatsApp/call handoff fallback UX.
- [x] 01-03-PLAN.md — Implement attribution/event tracking and webhook + queue persistence.
**UI hint**: yes

### Phase 2: Audience Messaging and Trust Layer
**Goal**: Parents in core segments see relevant concerns addressed, realistic progress expectations, and trustworthy proof that supports action.
**Depends on**: Phase 1
**Requirements**: FR3, FR6, NFR2
**Success Criteria** (what must be TRUE):
  1. Parents in top target segments can identify themselves in page messaging (segment-aware copy paths are visible and understandable).
  2. Top recurring objections are answerable from the FAQ and nearby CTA context without leaving the page.
  3. Parents can review realistic progress milestones and process expectations (including early-session expectations) before committing.
  4. Trust content (testimonials, specialist credibility, process transparency, disclaimers) is present and phrased with claim governance standards.
  5. Updated sections remain keyboard-accessible and announce form/status feedback appropriately for assistive technologies.
**Exit Gate**: Updated copy/trust blocks are live, objection coverage is complete for priority concerns, and accessibility checks for updated interaction points pass.
**Plans**: 3 plans
Plans:
- [x] 02-01-PLAN.md — Add segment-aware messaging and realistic 30/60/90 + early-session expectations.
- [x] 02-02-PLAN.md — Expand objection-first FAQ and govern trust claims with synchronized FAQ schema.
- [x] 02-03-PLAN.md — Harden accessibility status announcements and keyboard/screen-reader verification.
**UI hint**: yes

### Phase 3: Intake Operations Data Contract
**Goal**: Every new lead enters a minimal CRM-ready structure with consistent lifecycle states from first touch to paid-start.
**Depends on**: Phase 1
**Requirements**: FR5, NFR4
**Success Criteria** (what must be TRUE):
  1. Each lead record contains a defined minimum field set including first-touch and last-touch source values.
  2. Operators can move leads through explicit statuses (new, qualified, booked, paid-start) with no ambiguous state handling.
  3. Weekly funnel reporting can show intent → qualified → booked → paid by channel using the agreed schema.
  4. High-risk page logic relevant to intake tracking is isolated enough to reduce single-file regression risk during ongoing updates.
**Exit Gate**: CRM schema and state-transition contract are adopted in operations, and reporting can be produced repeatedly without manual data reconstruction.
**Plans**: 3 plans
Plans:
- [x] 03-01-PLAN.md — Define canonical intake schema and guarded lifecycle storage contract.
- [x] 03-02-PLAN.md — Wire intake operations into live lead flows and bootstrap ops panel host.
- [x] 03-03-PLAN.md — Add weekly funnel reporting and operator status panel isolation for maintainability.

### Phase 4: Quality Gates and Deployment Readiness
**Goal**: Releases are blocked unless core quality, link integrity, accessibility basics, and performance safeguards pass before GitHub Pages publish.
**Depends on**: Phase 2, Phase 3
**Requirements**: FR7, NFR1
**Success Criteria** (what must be TRUE):
  1. Deployment cannot proceed when HTML validity checks, broken-link checks, or baseline accessibility checks fail.
  2. Mobile-first landing experience remains performant after roadmap changes, without introducing heavy dependencies that degrade core vitals.
  3. Team can run and review pre-deploy checks in CI before publish, with clear pass/fail visibility.
**Exit Gate**: CI gating is active in the GitHub Pages workflow and successfully blocks known-bad changes while allowing compliant releases.
**Plans**: 2 plans
Plans:
- [x] 04-01-PLAN.md — Build deterministic local quality checks for HTML/link/a11y/performance guardrails.
- [x] 04-02-PLAN.md — Wire blocking quality gate into GitHub Pages workflow and update testing runbook.

## Requirement Coverage Map

| Requirement | Phase |
|-------------|-------|
| FR1 | Phase 1 |
| FR2 | Phase 1 |
| FR3 | Phase 2 |
| FR4 | Phase 1 |
| FR5 | Phase 3 |
| FR6 | Phase 2 |
| FR7 | Phase 4 |
| NFR1 | Phase 4 |
| NFR2 | Phase 2 |
| NFR3 | Phase 1 |
| NFR4 | Phase 3 |

**Coverage:** 11/11 requirements mapped (100%)

## Progress Table

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Consent, Attribution, and Reliable Handoffs | 3/3 | Complete | 2026-04-05 |
| 2. Audience Messaging and Trust Layer | 3/3 | Complete | 2026-04-05 |
| 3. Intake Operations Data Contract | 3/3 | Complete | 2026-04-05 |
| 4. Quality Gates and Deployment Readiness | 2/2 | Complete | 2026-04-05 |
