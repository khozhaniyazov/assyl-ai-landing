---
phase: 04-quality-gates-and-deployment-readiness
plan: 01
subsystem: testing
tags: [node, quality-gates, accessibility, performance, link-integrity]
requires:
  - phase: 02-audience-messaging-and-trust-layer
    provides: Accessibility landmarks/labels and FAQ schema baseline in index.html
  - phase: 03-intake-operations-data-contract
    provides: Existing deterministic Node test style and modular assets/js references
provides:
  - Deterministic HTML baseline checker with JSON-LD parsing and schema type assertions
  - Deterministic link-integrity checker for in-page anchors and local file references
  - Deterministic accessibility baseline checker for skip-link, landmark, ARIA labels, and `_blank` rel safety
  - Deterministic performance budget checker for key images plus CDN version pinning
  - Single-command quality runner for local/CI pre-deploy gating
affects: [deployment-readiness, ci-gates, testing-runbook]
tech-stack:
  added: [none]
  patterns: [node-built-ins-only checks, explicit fail logging + non-zero exits, aggregated runner contract]
key-files:
  created:
    - tests/quality/check-html-baseline.test.cjs
    - tests/quality/check-links.test.cjs
    - tests/quality/check-a11y-baseline.test.cjs
    - tests/quality/check-performance-budget.test.cjs
    - tests/quality/run-quality-tests.cjs
  modified: []
key-decisions:
  - "Use built-in Node modules only to keep quality checks deterministic and dependency-free."
  - "Enforce structural, link, accessibility, and performance checks as separate scripts with one aggregate entry point."
patterns-established:
  - "Quality checks expose `run()` and support direct CLI execution with explicit PASS/FAIL output."
  - "Aggregate quality runner returns non-zero on first failure to support CI gating."
requirements-completed: [FR7, NFR1]
duration: 3m 33s
completed: 2026-04-05
---

# Phase 4 Plan 1: Deterministic Quality Check Suite Summary

**Dependency-free Node quality gates now validate HTML/schema baseline, link integrity, accessibility contracts, and performance budgets from one command.**

## Performance

- **Duration:** 3m 33s
- **Started:** 2026-04-05T15:30:36+05:00
- **Completed:** 2026-04-05T15:34:09+05:00
- **Tasks:** 2
- **Files modified:** 5

## Accomplishments
- Added FR7 structural checks for doctype/lang/main/canonical and parseable MedicalBusiness + FAQPage JSON-LD.
- Added deterministic anchor/asset checks to catch broken in-page navigation and missing local references before deploy.
- Added accessibility and performance guardrails plus an aggregate `runAll` command for local/CI reuse.

## Task Commits

1. **Task 1: Add HTML baseline and link-integrity quality checks (FR7)**
   - `5ec8e2f` (test): RED failing checks scaffold
   - `9846c57` (feat): GREEN implementation for HTML + links
2. **Task 2: Add accessibility/performance checks and aggregate runner (FR7 + NFR1)**
   - `58e6ba5` (test): RED failing checks scaffold
   - `ac292af` (feat): GREEN implementation for a11y + performance + runner

## Files Created/Modified
- `tests/quality/check-html-baseline.test.cjs` - Baseline HTML + JSON-LD assertions with parse validation.
- `tests/quality/check-links.test.cjs` - In-page anchor target checks and local file existence verification.
- `tests/quality/check-a11y-baseline.test.cjs` - Skip link/main landmark/form+float ARIA checks and `_blank` safety enforcement.
- `tests/quality/check-performance-budget.test.cjs` - Key image byte-budget checks and pinned dependency assertions.
- `tests/quality/run-quality-tests.cjs` - Sequential runner executing all quality checks with non-zero failure exit.

## Decisions Made
- Used deterministic regex/text parsing over external validators to avoid network flake and keep checks fast in CI.
- Kept checks split by concern while standardizing output/error behavior to simplify CI diagnosis.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- Quality suite is ready for workflow integration as a blocking gate.
- Team can run `node tests/quality/run-quality-tests.cjs` locally with deterministic results.

## Self-Check: PASSED
