# Architecture

**Analysis Date:** 2026-04-05

## Pattern Overview

**Overall:** Monolithic static-page architecture (single HTML document with inline configuration, styling, and behavior).

**Key Characteristics:**
- Single entry point at `index.html` containing metadata, UI sections, and JavaScript behaviors.
- Component-like page sections are organized by semantic `<section>` blocks and anchored IDs (`#checker`, `#results`, `#faq`, `#form`) in `index.html`.
- Client-side behavior is isolated to inline scripts in `index.html` (menu toggle, checker logic, form submission, animation observer), with no backend service layer.

## Layers

**Presentation Layer:**
- Purpose: Render page structure, content hierarchy, CTAs, and responsive section layouts.
- Location: `index.html` (`<body>`, section blocks, `<header>`, `<main>`, `<footer>`).
- Contains: Hero, urgency, checker, results, services, plans, specialist profile, process, FAQ, lead form, sticky mobile CTA.
- Depends on: Tailwind runtime config and utility classes declared/loaded in `index.html`.
- Used by: End users in browser.

**Styling Layer:**
- Purpose: Define visual system and micro-interactions.
- Location: Tailwind CDN setup and `tailwind.config` in `index.html`; custom CSS in `<style>` in `index.html`.
- Contains: Brand color tokens, font families, animations (`fadeUp`, `float`, `blob`), utility helper classes (`.fade-up-item`, `.whatsapp-float`, `.glass-card`).
- Depends on: `https://cdn.tailwindcss.com?v=3.4.1`, Google Fonts URLs in `index.html`.
- Used by: All visual elements in `index.html`.

**Behavior Layer:**
- Purpose: Attach interaction and state transitions to DOM.
- Location: Inline `<script>` block at bottom of `index.html`.
- Contains: Lucide icon initialization, mobile menu open/close, intersection observer animation trigger, specialist checker update/render, form submit and WhatsApp redirect flow.
- Depends on: DOM IDs/classes in `index.html` and `lucide` global from `https://unpkg.com/lucide@0.263.0/dist/umd/lucide.min.js`.
- Used by: Interactive UI controls and conversion flows.

**Delivery/Deployment Layer:**
- Purpose: Publish static artifact to GitHub Pages.
- Location: `.github/workflows/deploy.yml`, `.nojekyll`, `CNAME`.
- Contains: CI trigger on `main`, pages artifact upload from repo root, deployment to GitHub Pages environment.
- Depends on: GitHub Actions pages actions (`actions/configure-pages@v5`, `actions/upload-pages-artifact@v3`, `actions/deploy-pages@v4`).
- Used by: Release pipeline for production site.

## Data Flow

**Visitor-to-Lead Flow:**

1. Visitor enters via `index.html` and navigates section anchors from fixed header links (`#checker`, `#results`, `#form`).
2. Visitor selects symptoms in checker (`.symptom-cb` inputs in `index.html`), triggering JS recomputation of recommended specialists and dynamic WhatsApp CTA link.
3. Visitor submits form (`onsubmit="handleSubmit(event)"` in `index.html`), client script validates phone, shows success state, and opens WhatsApp prefilled message.

**State Management:**
- State is ephemeral and DOM-driven in `index.html` (checkbox checked states, hidden/visible result containers, button disabled state, success message visibility).
- No persisted client storage and no server-side session/state.

## Key Abstractions

**Section-as-Component Abstraction:**
- Purpose: Treat each business block as a self-contained content module with independent CTA focus.
- Examples: `index.html` sections for Hero, Checker (`id="checker"`), Results (`id="results"`), FAQ (`id="faq"`), Form (`id="form"`).
- Pattern: Semantic sectioning + utility-class styling + local anchors.

**DOM Hook Abstraction:**
- Purpose: Bind script behaviors to stable selectors and IDs.
- Examples: `#menuToggle`, `#mobileMenu`, `.fade-up-item`, `.symptom-cb`, `#checker-result`, `#checker-specialists`, `#submitBtn`, `#formSuccess` in `index.html`.
- Pattern: Query selector lookup + event listeners + class toggling/innerHTML rendering.

**External CTA Channel Abstraction:**
- Purpose: Route lead intent to external messaging channel without backend.
- Examples: WhatsApp deep links in `index.html` (`https://wa.me/77773321002?...`) for floating button, checker CTA, mid-page CTA, final form.
- Pattern: Encode user context into URL query string and redirect/open new tab.

## Entry Points

**Primary UI Entry Point:**
- Location: `index.html`
- Triggers: Browser HTTP request to site root on GitHub Pages domain.
- Responsibilities: Load metadata/SEO schema, render all sections, configure styles, execute client interactions.

**Deployment Entry Point:**
- Location: `.github/workflows/deploy.yml`
- Triggers: Push events on `main` branch.
- Responsibilities: Checkout repository, configure Pages, upload repository root as artifact, deploy to GitHub Pages.

## Error Handling

**Strategy:** Lightweight defensive client-side checks with graceful fallback navigation.

**Patterns:**
- Form input guard clauses in `handleSubmit` in `index.html` (empty check + digit-length validation with `setCustomValidity`).
- WhatsApp popup-blocker fallback in `index.html` (`window.open` failure falls back to `window.location.href`).

## Cross-Cutting Concerns

**Logging:** Minimal; no application log framework detected in `index.html`.
**Validation:** HTML required/pattern attributes and additional JS phone validation in `index.html`.
**Authentication:** Not applicable (public static landing, no authenticated routes).

---

*Architecture analysis: 2026-04-05*
