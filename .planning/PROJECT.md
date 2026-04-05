# Project Context

## Project
- Name: Assyl-ai landing and intake system
- Type: Brownfield static site project
- Domain: Pediatric speech therapy lead generation and intake (Aktau, Kazakhstan)
- Repository: `khozhaniyazov/assylai`

## Problem Statement
- The current site converts interest into WhatsApp chats, but lead handling, attribution, and quality controls are fragile.
- Growth decisions are constrained by limited funnel visibility and no durable first-party intake record.
- Trust and compliance requirements are increasing as traffic and claim visibility grow.

## Product Goal
- Turn the existing landing page into a measurable, compliance-aware, high-trust conversion system.

## Target Users
- Primary: Parents of children age 2-5 with speech development concerns.
- Secondary: Parents preparing children age 4-6 for school readiness.
- Influencer users: Co-decision maker parent (often father), referral partners.

## In Scope
- Landing page messaging and UX improvements.
- Conversion path hardening (WhatsApp, call, form flows).
- Consent and privacy UX controls.
- Funnel instrumentation and channel attribution foundations.
- Intake operations standards and lightweight CRM process.

## Out of Scope
- Full clinical backend or EHR-grade medical record system.
- Native mobile app.
- Multi-language expansion beyond current primary content strategy in this cycle.

## Success Metrics
- 95%+ leads with source attribution captured.
- Improved intent-to-qualified conversation rate.
- Reduced first-response latency to defined SLA targets.
- Increased qualified booking rate from WhatsApp/call intent.
- No major compliance or trust incidents from intake flow.

## Constraints
- Static hosting on GitHub Pages.
- No existing backend service in repository.
- Team process currently centered around WhatsApp operations.
- Single-page architecture with in-file JS/CSS requires careful refactoring.

## Inputs Used
- `.planning/codebase/STACK.md`
- `.planning/codebase/ARCHITECTURE.md`
- `.planning/codebase/CONCERNS.md`
- `.planning/research/SUMMARY.md`

## Default Execution Mode
- Auto planning flow enabled.
- Research completed and synthesized.
- Requirements and roadmap generated from existing artifacts.
