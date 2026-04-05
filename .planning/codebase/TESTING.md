# Testing Patterns

**Analysis Date:** 2026-04-05

## Test Framework

**Runner:**
- Node CLI scripts (`node`) with deterministic assertions.
- Config: none required (built-in Node modules only).

**Assertion Library:**
- Native Node assertions (`assert`) and explicit throw/exit checks.

**Run Commands:**
```bash
node tests/quality/run-quality-tests.cjs   # Primary pre-deploy quality gate
node tests/intake-contracts.test.cjs       # Intake schema contract
node tests/intake-store.test.cjs           # Intake storage lifecycle
node tests/intake-operations.test.cjs      # Intake operations behavior
node tests/intake-reporting.test.cjs       # Weekly funnel reporting
```

## Test File Organization

**Location:**
- `tests/*.test.cjs` and `tests/quality/*.test.cjs`

**Naming:**
- `*.test.cjs` scripts executed directly with `node`.

**Structure:**
```
tests/
  intake-contracts.test.cjs
  intake-store.test.cjs
  intake-operations.test.cjs
  intake-reporting.test.cjs
  quality/
    check-html-baseline.test.cjs
    check-links.test.cjs
    check-a11y-baseline.test.cjs
    check-performance-budget.test.cjs
    run-quality-tests.cjs
```

## Test Structure

**Suite Organization:**
```typescript
// Not detected in repository.
```

**Patterns:**
- Setup pattern: Manual browser checks against `index.html` behavior.
- Teardown pattern: Manual reset via page reload and built-in UI reset timers in `index.html`.
- Assertion pattern: Visual/UI-state assertions (menu state, checker state, form success state) performed manually.

## Mocking

**Framework:**
- Not detected.

**Patterns:**
```typescript
// No automated mocking patterns detected.
```

**What to Mock:**
- Not applicable in current repository state.

**What NOT to Mock:**
- Not applicable in current repository state.

## Fixtures and Factories

**Test Data:**
```typescript
// No fixture/factory files detected.
```

**Location:**
- Not detected.

## Coverage

**Requirements:**
- None enforced.

**View Coverage:**
```bash
Not available
```

## Test Types

**Unit Tests:**
- Not used.

**Integration Tests:**
- Not used.

**E2E Tests:**
- Not used.

## Common Patterns

**Async Testing:**
```typescript
// Current behavior depends on timers and popup flow in `index.html`:
// - submit button disabled during send
// - success state shown immediately
// - form reset after 4 seconds
```

**Error Testing:**
```typescript
// Current validation path in `index.html`:
// if phone digits < 10 or > 13 => setCustomValidity + reportValidity + return
```

## Current Manual Verification Checklist

Use this checklist before merging quality-sensitive changes:

1. Open `index.html` locally in a browser.
2. Verify skip-link jumps to `<main id="main">` in `index.html`.
3. Verify mobile menu toggle updates `aria-expanded` and closes after nav click in `index.html`.
4. Verify checker section in `index.html`:
   - No selection shows `#checker-empty`.
   - Selection shows `#checker-result` and specialist list updates.
   - WhatsApp link in `#checker-wa` includes selected specialist names.
5. Verify form validation in `index.html`:
   - Empty required fields block submit.
   - Invalid phone length triggers custom validity message.
6. Verify submit flow in `index.html`:
   - Button enters loading state and disables.
   - Success message appears.
   - WhatsApp opens (or fallback redirect triggers).
   - Form/button reset after ~4 seconds.
7. Verify accessibility and SEO markers in `index.html`:
   - `lang="kk"`, canonical, OG/Twitter tags present.
   - JSON-LD `MedicalBusiness` and `FAQPage` blocks remain valid JSON.
   - External links using `target="_blank"` also include `rel="noopener noreferrer"`.
8. Verify deploy workflow integrity in `.github/workflows/deploy.yml` after changes.

## CI/CD Quality Gates

- GitHub Actions workflow (`.github/workflows/deploy.yml`) now runs a blocking `quality` job before deploy.
- CI quality gate command: `node tests/quality/run-quality-tests.cjs`.
- `deploy` job is configured with `needs: quality`, so publish is blocked when any quality check fails.
- Quality gate includes deterministic scripts:
  - `tests/quality/check-html-baseline.test.cjs`
  - `tests/quality/check-links.test.cjs`
  - `tests/quality/check-a11y-baseline.test.cjs`
  - `tests/quality/check-performance-budget.test.cjs`

## Technical Debt Risks Related to Testing Quality

- High regression risk in `index.html` due to single-file architecture and no automated safety net.
- Behavioral logic (menu, checker, form submission) in `index.html` is untested and can silently break on copy/layout edits.
- SEO/accessibility regressions in metadata and ARIA attributes in `index.html` are currently detectable only via manual review.
- Deployment at `.github/workflows/deploy.yml` can publish broken UI/JS because there is no pre-deploy verification stage.

---

*Testing analysis: 2026-04-05*
