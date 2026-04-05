# Technology Stack

**Analysis Date:** 2026-04-05

## Languages

**Primary:**
- HTML5 - Single-page application markup in `index.html`
- CSS (inline + utility classes) - Styling in `<style>` and Tailwind utility usage in `index.html`
- JavaScript (vanilla, browser-side) - Interactive behavior in `<script>` blocks in `index.html`

**Secondary:**
- YAML - CI/CD workflow definition in `.github/workflows/deploy.yml`
- Markdown - Operational documentation in `DOMAIN-SETUP.md`, `AGENTS.md`

## Runtime

**Environment:**
- Web browser runtime (client-side only) executing static assets from repository root (`index.html`, `hero.jpg`, `hero.webp`, `specialist.jpg`, `specialist.webp`)

**Package Manager:**
- Not detected (no `package.json`, `package-lock.json`, `yarn.lock`, `pnpm-lock.yaml`, `requirements.txt`, `pyproject.toml`, `go.mod`, or `Cargo.toml`)
- Lockfile: missing

## Frameworks

**Core:**
- Tailwind CSS (CDN-delivered runtime compiler) via `<script src="https://cdn.tailwindcss.com?v=3.4.1"></script>` in `index.html`
- Vanilla JS DOM scripting in `index.html` (menu toggle, checker logic, form handling, IntersectionObserver animations)

**Testing:**
- Not detected (no test framework config files or test directories)

**Build/Dev:**
- No local build tool detected; site is served/deployed as static files
- GitHub Pages deployment workflow in `.github/workflows/deploy.yml`

## Key Dependencies

**Critical:**
- Tailwind CSS CDN (`cdn.tailwindcss.com`) - Utility-first styling and theme extension configured inline in `index.html`
- Lucide Icons UMD (`https://unpkg.com/lucide@0.263.0/dist/umd/lucide.min.js`) - Icon rendering initialized by `lucide.createIcons()` in `index.html`
- Google Fonts (`fonts.googleapis.com`, `fonts.gstatic.com`) - Montserrat and Inter font families loaded/preloaded in `index.html`

**Infrastructure:**
- GitHub Actions Pages actions in `.github/workflows/deploy.yml`:
  - `actions/checkout@v4`
  - `actions/configure-pages@v5`
  - `actions/upload-pages-artifact@v3`
  - `actions/deploy-pages@v4`

## Configuration

**Environment:**
- Runtime config is hardcoded in `index.html` (phone number, WhatsApp links, social links, metadata, schema JSON-LD)
- No `.env` or runtime secret file detected in repository root
- Facebook Pixel toggle is controlled by `META_PIXEL_ID` variable in `index.html` (currently empty string)

**Build:**
- No compile/build config files detected (`tsconfig.json`, bundler configs, or package manifests not present)
- Deployment config is declarative in `.github/workflows/deploy.yml`

## Platform Requirements

**Development:**
- Any modern browser for local preview of `index.html`
- Git repository for content/versioning and workflow-triggered deploys

**Production:**
- GitHub Pages static hosting via workflow (`.github/workflows/deploy.yml`)
- Custom domain mapping via `CNAME` (`assylai.kz`) and external DNS/CDN setup described in `DOMAIN-SETUP.md`

---

*Stack analysis: 2026-04-05*
