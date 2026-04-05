# Coding Conventions

**Analysis Date:** 2026-04-05

## Naming Patterns

**Files:**
- Use root-level static asset names in lowercase (example: `index.html`, `hero.jpg`, `hero.webp`, `specialist.jpg`, `specialist.webp`).
- Use uppercase for operational docs when intended as standalone references (example: `AGENTS.md`, `DOMAIN-SETUP.md`).

**Functions:**
- Use `camelCase` for JavaScript function names in `index.html` (example: `handleSubmit`).
- Use IIFE wrappers for feature-local behavior in `index.html` (mobile menu and checker logic blocks).

**Variables:**
- Use `const` for DOM bindings and immutable values in `index.html` (example: `menuToggle`, `checker-wa`, `successDiv`).
- Use short, contextual names for callback params in inline logic (example: `e`, `cb`, `f`).

**Types:**
- Not applicable: no TypeScript or explicit type definitions detected in `index.html`.

## Code Style

**Formatting:**
- Tool used: Not detected (no `.prettierrc*`, no formatter config files).
- Follow current style in `index.html`: 2-space indentation, semicolon-terminated JS, and section comments (`<!-- SECTION ... -->`).

**Linting:**
- Tool used: Not detected (no `.eslintrc*`, `eslint.config.*`, or `biome.json`).
- Preserve existing guard-clause style and explicit DOM null assumptions in `index.html` when editing nearby blocks.

## Import Organization

**Order:**
1. Not applicable for JS modules (no `import` statements detected).
2. External runtime dependencies are loaded in `<head>` via script/link tags in `index.html`.
3. Inline configuration and inline runtime script are colocated in `index.html`.

**Path Aliases:**
- Not applicable.

## Error Handling

**Patterns:**
- Use guard clauses before side effects (example: `if (!name || !phone) return;` in `handleSubmit` at `index.html`).
- Use browser-native validation feedback with `setCustomValidity` and `reportValidity` for form errors in `index.html`.
- Use popup fallback logic for external redirect robustness (`window.open` + `window.location.href`) in `index.html`.

## Logging

**Framework:** console not used for routine logging.

**Patterns:**
- Keep production script free of debug logging in `index.html`.
- Prefer visible UI feedback (`#formSuccess`) over console messages for user-facing flow in `index.html`.

## Comments

**When to Comment:**
- Use high-signal section comments for structure and flow boundaries (`<!-- SECTION 1: HERO -->`, `// Checker Logic`) in `index.html`.
- Comment non-obvious behavior, especially fallback logic and accessibility intent in `index.html`.

**JSDoc/TSDoc:**
- Not used.

## Function Design

**Size:**
- Keep functions focused on one interaction path; current model is feature-local blocks inside `index.html` script.

**Parameters:**
- Event-driven handlers accept browser event objects (`handleSubmit(e)` in `index.html`).

**Return Values:**
- Use early returns for invalid states; DOM-event functions generally return `void` in `index.html`.

## Module Design

**Exports:**
- Not applicable: single-page script in `index.html` with global `handleSubmit` for inline form attribute usage.

**Barrel Files:**
- Not applicable.

## Content Conventions (Kazakh Landing Copy)

- Keep all user-facing copy in Kazakh to match `lang="kk"` in `index.html`.
- Use conversion-focused structure: problem → urgency → proof → CTA, as implemented across sections in `index.html`.
- Use specific, measurable claims formatting (`93%`, `500+`, `1 ай`) consistently in headings and proof blocks in `index.html`.
- Keep WhatsApp CTA phrasing consistent across anchor links in `index.html` to reduce intent mismatch.

## Accessibility & SEO Practices

- Preserve semantic landmarks: `<main id="main">`, `<header>`, `<footer>` in `index.html`.
- Keep skip-link behavior (`href="#main"`) and ARIA attributes (`aria-label`, `aria-expanded`) in `index.html`.
- Keep alt text in Kazakh and preserve image loading strategy (`loading="eager"` hero, `loading="lazy"` specialist) in `index.html`.
- Maintain security-safe external links with `target="_blank"` + `rel="noopener noreferrer"` in `index.html`.
- Maintain metadata completeness in `index.html`: canonical URL, Open Graph, Twitter Card, `MedicalBusiness` and `FAQPage` JSON-LD.

## CI Quality Gates

- CI workflow at `.github/workflows/deploy.yml` only deploys static content to GitHub Pages on `push` to `main`.
- No automated lint, formatting, test, accessibility, or SEO gate is configured in `.github/workflows/deploy.yml`.
- Treat manual pre-merge validation as required quality gate until CI checks are added.

## Quality Risks / Debt (Conventions)

- `index.html` is monolithic (918 lines), increasing regression risk and reducing review precision.
- Inline JS/CSS in `index.html` lacks automated linting/format enforcement, causing style drift risk.
- Repeated CTA/link patterns in `index.html` are manually duplicated, increasing inconsistency risk during updates.
- No centralized content schema for claims/testimonials in `index.html`, so copy updates can desync visible text and structured data.

---

*Convention analysis: 2026-04-05*
