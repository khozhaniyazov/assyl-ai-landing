# Requirements

## Scope
- Improve the existing Assyl-ai landing page into a reliable, measurable, and compliance-aware lead generation system.
- Preserve fast WhatsApp conversion while adding stronger trust, attribution, and intake quality controls.

## Business Outcomes
- Increase qualified diagnostic bookings from existing traffic.
- Reduce conversion leakage between site intent and operator qualification.
- Enable channel-level investment decisions with trustworthy attribution data.
- Reduce compliance and reputation risks tied to data handling and claims.

## Functional Requirements

### FR1: Consent and Privacy Controls
- Add required consent checkbox near primary lead submit actions.
- Add visible privacy policy link and concise disclosure about third-party messaging destination.
- Prevent submit when consent is not granted.
- Record consent metadata (timestamp, page/source, policy text version).

### FR2: Conversion Path Reliability
- Maintain WhatsApp-first flow and call alternatives.
- Ensure conversion UI states reflect true handoff attempts and clear fallback behavior.
- Keep mobile sticky CTA behavior functional across common devices.

### FR3: Audience-Specific Messaging
- Implement segment-aware copy for top parent segments.
- Add objection-first FAQ coverage for top recurring concerns.
- Add progress-expectation blocks with realistic milestone framing.

### FR4: Attribution and Event Instrumentation
- Capture and persist UTM fields and channel source markers.
- Implement channel-specific WhatsApp prefill tokens/codes.
- Track core events: page view, WhatsApp click, call click, form submit, major scroll depth.

### FR5: Intake Operations Data Contract
- Define and use minimal CRM schema for each lead.
- Include lead status transitions: new, qualified, booked, paid-start.
- Include first-touch and last-touch source fields.

### FR6: Trust and Evidence Layer
- Strengthen proof content quality (measurable testimonials, specialist credibility details, transparent process).
- Add claim governance guidance for outcome statements and disclaimers.

### FR7: Quality and Deployment Guardrails
- Add pre-deploy checks for HTML validity, broken links, and basic accessibility regressions.
- Keep deployment to GitHub Pages workflow with gating before publish.

## Non-Functional Requirements

### NFR1: Performance
- Preserve strong mobile load behavior for primary landing path.
- Avoid introducing heavy dependencies that degrade Core Web Vitals.

### NFR2: Accessibility
- Maintain keyboard accessibility and semantic structure.
- Improve form semantics and status announcements for assistive technologies.

### NFR3: Security and Privacy
- Minimize personal data transmitted in URL parameters when possible.
- Keep external dependency versions pinned and monitored.

### NFR4: Maintainability
- Reduce single-file fragility by isolating high-risk JS logic where practical.
- Keep planning artifacts updated as architecture evolves.

## Constraints
- Static site architecture and GitHub Pages hosting remain baseline.
- No full backend service currently exists in repo.
- Team operations currently depend on WhatsApp response workflows.

## Assumptions
- The project can introduce lightweight external services for analytics/CRM if needed.
- Privacy policy content can be drafted and approved during implementation.
- Existing brand and language direction remains primary (Kazakh-first).

## Acceptance Criteria
- Consent gate is enforced and logged for lead submissions.
- Source attribution completeness reaches >=95% of inbound leads.
- Event taxonomy is documented and validated in production.
- Weekly reporting can show intent -> qualified -> booked -> paid flow by channel.
- Objection and trust content updates are live and aligned with defined claim standards.
- Pre-deploy checks run before publish in CI workflow.

## Exclusions
- Building a full custom backend application in this phase.
- Replatforming away from GitHub Pages in this cycle.

## Requirement Implementation Status

- [x] FR1 — Phase 1 / Plan 02 implemented explicit consent gating with adjacent privacy disclosures across checker, form, and sticky CTA.
- [x] FR2 — Phase 1 / Plan 02 added truthful handoff outcomes and fallback guidance for blocked WhatsApp flows.
- [x] FR3 — Phase 2 / Plans 01+02 implemented segment-aware messaging, realistic expectation framing, and objection-first FAQ coverage.
- [x] FR4 — Phase 1 / Plans 01+03 delivered canonical event taxonomy, WA channel markers, UTM persistence, and core event instrumentation with webhook transport.
- [x] FR6 — Phase 2 / Plan 02 added claim-governed trust disclaimers and synchronized visible FAQ content with FAQPage JSON-LD.
- [x] FR5 — Phase 3 / Plans 01-03 delivered canonical intake schema, guarded lifecycle transitions, live intent/form lead wiring, and weekly funnel reporting (`intent -> qualified -> booked -> paid`) by channel.
- [x] NFR4 — Phase 3 / Plan 03 isolated intake reporting and operator workflow into dedicated `assets/js/intake-*` modules, reducing inline single-file fragility.
- [x] NFR2 — Phase 2 / Plan 03 hardened ARIA live/status semantics and validated keyboard/screen-reader feedback flow.
- [x] NFR3 — Phase 1 / Plans 01+03 use non-PII lead references in URL-bound handoff messages and keep raw personal details out of URL payloads.
- [x] FR7 — Phase 4 / Plans 01-02 added deterministic HTML/link/a11y/performance checks and enforced blocking quality gate before GitHub Pages deploy.
- [x] NFR1 — Phase 4 / Plans 01-02 introduced pre-deploy image budget and dependency pin checks without adding browser runtime dependencies.
