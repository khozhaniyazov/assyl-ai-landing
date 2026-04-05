# Codebase Structure

**Analysis Date:** 2026-04-05

## Directory Layout

```text
assyl-ai-landing/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Pages deployment workflow
├── .planning/
│   └── codebase/               # Generated mapping docs for GSD workflows
├── .nojekyll                   # Disables Jekyll processing on GitHub Pages
├── AGENTS.md                   # Project operating context and constraints
├── CNAME                       # Custom domain binding (assylai.kz)
├── DOMAIN-SETUP.md             # Domain and DNS runbook
├── index.html                  # Entire page layout, styles, scripts, and metadata
├── hero.jpg                    # Hero image fallback asset
├── hero.webp                   # Hero image optimized format
├── specialist.jpg              # Specialist image fallback asset
└── specialist.webp             # Specialist image optimized format
```

## Directory Purposes

**`.github/workflows/`:**
- Purpose: CI/CD automation for static deployment.
- Contains: GitHub Actions workflow definitions.
- Key files: `.github/workflows/deploy.yml`.

**`.planning/codebase/`:**
- Purpose: Architecture/stack/quality/concern mapping artifacts used by GSD planning/execution commands.
- Contains: Generated markdown docs (e.g., `ARCHITECTURE.md`, `STRUCTURE.md`).
- Key files: `.planning/codebase/ARCHITECTURE.md`, `.planning/codebase/STRUCTURE.md`.

**Repository root (`/`):**
- Purpose: Runtime static site files directly served by GitHub Pages artifact upload.
- Contains: `index.html`, media assets, domain config files, project docs.
- Key files: `index.html`, `.nojekyll`, `CNAME`, `DOMAIN-SETUP.md`.

## Key File Locations

**Entry Points:**
- `index.html`: Browser entry for full landing page (markup + inline CSS + inline JS).
- `.github/workflows/deploy.yml`: Deployment entry triggered by push to `main`.

**Configuration:**
- `index.html`: Tailwind runtime configuration (`tailwind.config`), external CDN references, SEO schema, and metadata.
- `CNAME`: Custom production domain name.
- `.nojekyll`: Static serving compatibility for GitHub Pages.

**Core Logic:**
- `index.html`: Mobile menu toggling, intersection animation observer, specialist checker logic, form handling and WhatsApp redirect.

**Testing:**
- Not detected (no test directories/config files present in repository root).

## Naming Conventions

**Files:**
- Root-level, descriptive, lowercase-with-symbols for config/docs: `index.html`, `.nojekyll`, `deploy.yml`, `DOMAIN-SETUP.md`.
- Media assets follow semantic role naming: `hero.webp`, `specialist.jpg`.

**Directories:**
- Dot-prefixed system/config directories for tooling and generated docs: `.github/`, `.planning/`.

## Where to Add New Code

**New Feature (landing section or behavior):**
- Primary code: Add new semantic `<section>` and related script/css blocks in `index.html`.
- Tests: Not applicable in current structure; if introducing tests, add a new top-level test area (e.g., `tests/`) and document tooling.

**New Component/Module:**
- Implementation: Keep section-local markup in `index.html`; use stable IDs/classes for script hooks and co-locate corresponding JS in the bottom `<script>` block.

**Utilities:**
- Shared helpers: Define helper functions in the existing bottom script block of `index.html` and reuse across handlers.

## Special Directories

**`.github/`:**
- Purpose: CI/CD workflow definitions.
- Generated: No.
- Committed: Yes.

**`.planning/`:**
- Purpose: Planning/mapping documents consumed by orchestration commands.
- Generated: Yes (by mapper/planner flows).
- Committed: Yes.

## Deployment Topology

**Build/Publish Path:**
1. Developer pushes to `main`.
2. `.github/workflows/deploy.yml` runs `deploy` job on GitHub-hosted runner.
3. Workflow uploads repository root (`path: '.'`) as static Pages artifact.
4. GitHub Pages serves `index.html` and root assets directly, honoring `.nojekyll` and `CNAME`.

**Runtime Topology:**
- Hosting: GitHub Pages static hosting.
- Origin files: Repository root files.
- External runtime dependencies loaded by browser from CDNs declared in `index.html` (Tailwind CDN, Lucide UMD, Google Fonts).

---

*Structure analysis: 2026-04-05*
