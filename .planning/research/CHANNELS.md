# Acquisition Channels & Measurement (Assyl-ai)

## 1) Priority Channels (next 90 days)

| Channel | Role | Core Tactic | Primary CTA |
|---|---|---|---|
| Instagram (organic + paid) | Top/Mid funnel demand capture | Reels with parent pain points, before/after progress stories, local geo targeting (Aktau) | WhatsApp click |
| Search (Google) | High-intent capture | Brand + symptom keywords (Kazakh/Russian), FAQ-rich landing snippets | Call or WhatsApp |
| Maps (Google/2GIS) | Local trust + immediate action | Complete profile, reviews, photos, hours, pinned services | Call, route, website |
| Referrals (parents, doctors, kindergartens) | Lowest CAC, highest trust | Structured referral ask after milestone wins, partner handouts/QR | WhatsApp deep link |

## 2) Expected Funnel Metrics (realistic baseline)

Use as planning ranges; tighten after 4–6 weeks of data.

| Stage | Instagram | Search | Maps | Referrals |
|---|---:|---:|---:|---:|
| Visit → WhatsApp click (or call tap) | 4–9% | 8–15% | 10–20% | 15–30% |
| WhatsApp click → qualified conversation | 45–65% | 55–75% | 60–80% | 70–90% |
| Qualified conversation → booked diagnostic | 25–40% | 30–45% | 30–50% | 40–60% |
| Diagnostic booked → paid start | 45–65% | 45–65% | 45–70% | 55–75% |

Planning math (starting point):
- 1,000 targeted sessions/month → ~70–140 WhatsApp/call intents
- ~35–95 qualified conversations
- ~10–40 bookings
- ~5–26 paid starts

## 3) Attribution Constraints (WhatsApp-first flow)

1. **Cross-app drop-off:** click to `wa.me` exits site; no native end-to-end web conversion tracking.
2. **Pixel/API limits:** without Meta CAPI + backend events, downstream outcomes are mostly offline/manual.
3. **Multi-touch ambiguity:** parents often see Instagram, then search brand, then message in WhatsApp.
4. **Phone/call overlap:** calls from header/maps and WhatsApp chats may represent same lead.

Practical attribution model:
- **Primary:** Last non-direct touch (session-level, UTM-based).
- **Secondary:** Assisted touches (simple 7-day lookback in sheet/CRM).
- **Source of truth for revenue:** CRM row tied to lead ID, not ad platform dashboards.

## 4) Recommended Instrumentation (implement now)

### A. URL/Link Discipline
- Add UTM to all campaign links: `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`.
- Use channel-specific WhatsApp links with prefilled text token (e.g., `?text=IG_REEL_AKTAU` / `SEARCH_BRAND` / `MAPS_2GIS` / `REF_DOCTOR`).

### B. Frontend Event Tracking (GA4 + Meta Pixel when enabled)
Track these events with consistent params (`channel`, `campaign`, `content`, `device`):
- `view_page`
- `click_whatsapp`
- `click_phone`
- `submit_form` (if form remains)
- `scroll_50`, `scroll_90`

### C. Lead Capture in WhatsApp SOP
- First operator reply asks one structured qualifier set: child age, concern type, district, source code.
- Copy source code from prefilled message into CRM field (`lead_source_raw`).

### D. Lightweight CRM Schema (Sheet is enough)
Required fields:
- `lead_id` (timestamp + phone hash)
- `first_touch_source`, `last_touch_source`
- `wa_code` (from prefilled text)
- `qualified` (Y/N)
- `diagnostic_booked` (Y/N, date)
- `paid_start` (Y/N, date, package)

### E. Weekly Reporting (single dashboard)
Report by channel:
- Sessions
- WhatsApp/call intent rate
- Qualified conversation rate
- Booking rate
- Paid start rate
- Cost per qualified lead (if paid media)

## 5) Channel Execution Priority

1. **Maps + Referrals first** (fast trust + high conversion).
2. **Instagram second** (creative testing engine).
3. **Search third** (capture intent and brand demand once query volume is visible).

## 6) Success Criteria (first 60 days)

- 95%+ leads have non-empty source fields (`wa_code` or manually tagged source).
- Attribution match rate (platform vs CRM lead counts) within ±20%.
- At least 2 channels producing booked diagnostics weekly.
- Decision-ready CAC by channel (or clear organic equivalent efficiency).
