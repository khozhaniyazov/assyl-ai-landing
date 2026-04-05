# External Integrations

**Analysis Date:** 2026-04-05

## APIs & External Services

**UI/CDN Dependencies:**
- Tailwind CSS CDN - Runtime CSS utility engine used directly by `index.html`
  - SDK/Client: Script include `https://cdn.tailwindcss.com?v=3.4.1` in `index.html`
  - Auth: Not applicable
- Lucide Icons CDN - Icon library rendered via browser UMD bundle in `index.html`
  - SDK/Client: Script include `https://unpkg.com/lucide@0.263.0/dist/umd/lucide.min.js`
  - Auth: Not applicable
- Google Fonts - External font delivery for typography in `index.html`
  - SDK/Client: Stylesheet/preload URLs from `fonts.googleapis.com` and `fonts.gstatic.com`
  - Auth: Not applicable

**Customer Communication:**
- WhatsApp deep-link API (`wa.me`) - Primary lead handoff channel from CTA links and form submit in `index.html`
  - SDK/Client: URL-based integration (`https://wa.me/77773321002?text=...`)
  - Auth: Not applicable (public deep-link)
- Phone dialer (`tel:` links) - Secondary contact channel in `index.html`
  - SDK/Client: Native browser/OS protocol handlers
  - Auth: Not applicable

**Social/Discovery:**
- Instagram profile link - Social proof/profile destination in `index.html`
  - SDK/Client: Browser link to `https://www.instagram.com/assylai.munaily/`
  - Auth: Not applicable
- 2GIS location link - Map/navigation destination in `index.html`
  - SDK/Client: Browser link to `https://2gis.kz/aktau/geo/70000001063739176`
  - Auth: Not applicable

**Analytics/Marketing:**
- Meta Pixel script endpoint - Optional tracking path in `index.html`
  - SDK/Client: `https://connect.facebook.net/en_US/fbevents.js`
  - Auth: `META_PIXEL_ID` JavaScript variable in `index.html` (currently unset)

## Data Storage

**Databases:**
- None detected
  - Connection: Not applicable
  - Client: Not applicable

**File Storage:**
- Local static files in repository root (`index.html`, `hero.jpg`, `hero.webp`, `specialist.jpg`, `specialist.webp`), served by GitHub Pages via `.github/workflows/deploy.yml`

**Caching:**
- CDN edge caching through GitHub Pages delivery path
- Optional additional edge/CDN layer documented via Cloudflare setup in `DOMAIN-SETUP.md`

## Authentication & Identity

**Auth Provider:**
- Not applicable (public static landing page; no user login flow detected in `index.html`)
  - Implementation: None

## Monitoring & Observability

**Error Tracking:**
- None enforced
- Optional marketing event instrumentation through Meta Pixel in `index.html` (`fbq('track', 'Lead')`)

**Logs:**
- No application-side logging pipeline detected (client-side only, no backend)

## CI/CD & Deployment

**Hosting:**
- GitHub Pages, configured by workflow in `.github/workflows/deploy.yml`
- Custom domain declared in `CNAME` (`assylai.kz`)

**CI Pipeline:**
- GitHub Actions on push to `main` in `.github/workflows/deploy.yml`
- Uses `actions/configure-pages@v5`, `actions/upload-pages-artifact@v3`, `actions/deploy-pages@v4`

## Environment Configuration

**Required env vars:**
- None required for site rendering or deploy workflow based on current files
- Optional runtime identifier: `META_PIXEL_ID` variable set inside `index.html` (not an environment variable)

**Secrets location:**
- No secret files detected in repository root
- If future credentials are needed, store in GitHub Actions Secrets / repository settings (not in tracked files)

## Webhooks & Callbacks

**Incoming:**
- None detected (no server endpoints; static hosting only)

**Outgoing:**
- Browser-initiated redirects/links from `index.html` to:
  - `https://wa.me/...` (lead/contact handoff)
  - `tel:+77773321002` (phone dial action)
  - `https://www.instagram.com/assylai.munaily/` (social)
  - `https://2gis.kz/aktau/geo/70000001063739176` (maps)
  - `https://connect.facebook.net/en_US/fbevents.js` (optional analytics script)

## Data Flow Boundaries

- **In-browser boundary:** user enters name/phone into form in `index.html`; validation and message composition happen fully client-side.
- **Handoff boundary:** submitted contact intent is transferred to WhatsApp via URL redirect (`window.open` / `window.location.href` in `index.html`), not persisted by this codebase.
- **Hosting boundary:** repository files are packaged and served by GitHub Pages workflow in `.github/workflows/deploy.yml`.

## Operational Dependencies

- Availability of third-party CDNs (`cdn.tailwindcss.com`, `unpkg.com`, `fonts.googleapis.com`, `fonts.gstatic.com`) directly affects rendering/icons/fonts.
- Availability of WhatsApp deep-link service (`wa.me`) directly affects lead capture workflow.
- GitHub Actions + GitHub Pages availability is required for deploy and content publishing (`.github/workflows/deploy.yml`).
- DNS/custom-domain routing depends on `CNAME` plus external registrar/Cloudflare configuration documented in `DOMAIN-SETUP.md`.

---

*Integration audit: 2026-04-05*
