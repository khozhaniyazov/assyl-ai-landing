# Assyl-ai Landing Page - Project Context

## What is this?
A static HTML landing page for **Assyl-ai** — a children's speech therapy and development center in Aktau, Kazakhstan. Content is in Kazakh language.

**Live URL:** https://khozhaniyazov.github.io/assylai/
**Repo:** https://github.com/khozhaniyazov/assylai
**Stack:** Single `index.html`, Tailwind CSS (CDN v3.4.1), Lucide Icons (CDN v0.263.0), Google Fonts (Montserrat + Inter), vanilla JS.

## Hosting
- **Migrated from Netlify to GitHub Pages** (Netlify hit bandwidth limits after 3 days).
- Deployed via GitHub Actions workflow at `.github/workflows/deploy.yml`.
- GitHub Pages enabled with `build_type: workflow`.
- `.nojekyll` file present for proper static serving.

## What was done

### Conversion Optimization (2026-03-26)
- **Branding fix** — corrected name from "Assyl AI" to "Assyl-ai" throughout site.
- **Pricing strategy** — removed all prices from checker tool to avoid sticker shock and premature bounce.
- **Checker redesign** — now qualification-focused, shows needed specialists without pricing, leads to WhatsApp for personalized quote.
- **Hero section** — rewritten with direct promise: "1 айда нәтиже көресіз", emotional hook, WhatsApp CTA prioritized.
- **Trust metrics** — changed to results-focused: "93% балалар 1 айда прогресс", "500+ бала сөйлей бастады".
- **Urgency section** — added "2-5 жас — алтын кезең" with neuroscience backing, fear of missing the window.
- **Results section** — specific timelines: "6 апта — 15+ сөз", "8 апта — 2-3 сөзден сөйлем", "3 ай — анық сөйлеу".
- **Testimonials** — rewritten with specific outcomes: "1,5 ай сабақтан кейін 10-нан астам сөз айтады".
- **Services** — benefit-driven copy: "Балаңыз алғашқы сөздерді айтады" instead of "Дыбыстарды қою".
- **Mid-page CTA** — added conversion break after services with urgency message.
- **Specialist section** — rewritten to emphasize 500+ children results.
- **Process section** — reduced risk: "Тегін диагностика", "Ешбір міндеттеме жоқ", "Шешім сізде".
- **Form section** — stronger urgency, WhatsApp button added, "24 сағат ішінде хабарласамыз".
- **Sticky mobile CTA** — added bottom bar with WhatsApp + phone buttons for mobile users.

### Latest Improvements (2026-03-26)
- **Navigation** — added fixed header with phone CTA, nav links (Маманды анықтау, Нәтижелер, Байланыс), and mobile phone icon.
- **Accessibility** — added skip-to-content link, ARIA labels on WhatsApp float/FAQ section/form, `loading="lazy"` on specialist image.
- **SEO** — added FAQ schema markup (JSON-LD FAQPage) for rich snippets in search results.
- **UX** — added clickable `tel:` phone links in header and footer, 2GIS map link for address, `autocomplete` attributes on form inputs.
- **Performance** — added `<link rel="preconnect">` for unpkg.com CDN, explicit `loading="eager"` on hero image.
- **Security** — added `rel="noopener noreferrer"` to all `target="_blank"` links (WhatsApp, Instagram, 2GIS).
- **Semantic HTML** — extracted footer from the form section into proper `<footer>` element, wrapped page content in `<main id="main">`, added top padding to hero for fixed header clearance.

### Hosting Migration
- Removed Netlify config (`.netlify/`, `.github/workflows/netlify.yml`).
- Created GitHub Pages deploy workflow (`.github/workflows/deploy.yml`).
- Renamed repo from `assyl-ai-landing` to `assylai`.
- Enabled GitHub Pages via `gh api`.

### Bug Fixes
- **Form submission** — was permanently disabling the submit button after first use. Now resets after 4s.
- **FAQ section placement** — was after the footer. Moved before the CTA form section (correct flow: FAQ → Form).
- **Facebook Pixel** — placeholder `YOUR_PIXEL_ID` was making failed requests. Commented out until real ID is provided.
- **Lucide icons version** — pinned to `0.263.0` (typo `0.263.1` caused 404, all icons disappeared).
- **animation-delay-2000** — CSS class was used in HTML but never defined. Added to `<style>` block.
- **Combo discount logic** — was applying first matching combo, not the best one. Fixed to find lowest price across all matching combos.

### SEO Improvements
- Fixed `<html lang="ru">` to `lang="kk"` (Kazakh).
- Added Open Graph meta tags (og:title, og:description, og:image, og:locale).
- Added Twitter Card meta tags.
- Added `<link rel="canonical">`.
- Added `<meta name="theme-color">`.
- Added JSON-LD structured data (`MedicalBusiness` schema with address, phone, hours, Instagram).

### Performance
- Pinned Tailwind CSS CDN to v3.4.1 (was unpinned `@latest`).
- Pinned Lucide Icons to v0.263.0 (was unpinned `@latest`).
- Added `<link rel="preload">` for Google Fonts.

### Accessibility
- Fixed image alt text from Russian to Kazakh.
- Added `inputmode="tel"` and `pattern` to phone input.

### UX
- Added phone number validation (strips non-digits, checks 10-13 length).
- Added popup blocker fallback for WhatsApp redirect.
- Updated testimonial names to proper Kazakh names (Әсем Қ., Гүлнар Б., Мәдина С.).

### Cleanup
- Removed unused files: `specialist.png`, `reorder.py`, `frontend-brief.md`, `package.json`, `opencode.json`.
- Added `CNAME` file for custom domain setup.
- Added `DOMAIN-SETUP.md` with step-by-step instructions for connecting `assylai.kz`.
- Added `.nojekyll` for GitHub Pages.

## Domain Setup (Future)
- Domain: `assylai.kz` (~10,000 ₸/year from ps.kz)
- Hosting: GitHub Pages (FREE)
- CDN: Cloudflare Free plan (FREE)
- See `DOMAIN-SETUP.md` for complete setup instructions

## Known Issues / TODO
- Facebook Pixel is commented out — needs real Pixel ID when ready.
- No backend for form data — leads only go through WhatsApp redirect.
- Using Tailwind CDN runtime compiler (not ideal for production, but acceptable for a single-page static site without a build step).
- No 404 page configured.
- Images (hero.png, specialist.jpg) are not optimized/compressed — could benefit from WebP conversion.

## Key Files
| File | Purpose |
|---|---|
| `index.html` | Entire landing page (~850 lines) |
| `hero.png` | Hero section image (82K) |
| `specialist.jpg` | Specialist portrait (63K) |
| `CNAME` | Custom domain config for GitHub Pages |
| `DOMAIN-SETUP.md` | Step-by-step domain setup guide |
| `.github/workflows/deploy.yml` | GitHub Pages CI/CD |
| `.nojekyll` | GitHub Pages config |
