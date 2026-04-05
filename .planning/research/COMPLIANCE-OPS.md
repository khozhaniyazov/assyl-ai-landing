# COMPLIANCE-OPS: Privacy, Consent, and Intake Controls for WhatsApp Leads (Kazakhstan)

**Project:** Assyl-ai landing page  
**Date:** 2026-04-05  
**Scope:** Lead capture and first-contact workflow via website form + WhatsApp redirect  
**Important:** This is **operational guidance, not legal advice**. Validate with Kazakhstan-qualified counsel before policy finalization.

---

## 1) Executive Position (Opinionated)

For Assyl-ai’s current model (landing page + WhatsApp lead handling), treat every inbound lead as **personal data with potential health sensitivity context** and run a **minimum-data, explicit-consent, fast-response** operation.

The safest practical baseline is:

1. **Collect only parent contact + child age band + concern category** at first touch.
2. **Obtain explicit consent on-page before submission** (checkbox, not pre-checked).
3. **Use WhatsApp only for scheduling/triage**, not deep clinical history.
4. **Store structured lead records in a Kazakhstan-hosted system of record** (or avoid long-term storage until that exists).
5. **Apply strict SLA discipline** (rapid first response, bounded follow-ups, clear stop rules).

This reduces legal/compliance risk while preserving conversion performance.

---

## 2) Kazakhstan Privacy & Consent Expectations (Operational Interpretation)

## 2.1 What to assume by default

- Lead data (name, phone, child-related context) should be treated as personal data.
- Consent is expected for collection/processing in normal commercial intake flows.
- Data handling must be purpose-limited and proportionate (no “nice-to-have” collection at intake).
- Data protection measures must exist from the point of collection.

## 2.2 Practical consent standard for this landing page

At submission time, capture all of the following:

- **Identity of operator** (Assyl-ai legal entity / sole proprietor details as applicable)
- **Purpose** (callback, appointment scheduling, service suitability discussion)
- **Data categories** (phone, parent name, child age band, selected concern)
- **Transfer disclosure** (that communication may continue via WhatsApp)
- **Retention window** (e.g., retained for X days if no appointment is booked)
- **Revocation channel** (how parent can request stop/delete)

### Recommended checkbox text (Kazakh-first, RU backup)

Use a required checkbox near the submit button:

> «Мен жеке деректерімді (аты-жөнім, телефон, балам туралы бастапқы ақпарат) Assyl-ai-ға диагностика/кеңеске жазылу үшін өңдеуге және WhatsApp арқылы байланысуға келісемін. Құпиялық шарттарымен таныстым.»

Add a link to a short privacy notice page.

## 2.3 Child data stance

Even if parents submit the form, child-related info is high-risk in practice. Treat as restricted:

- No diagnosis claims in chat.
- No detailed medical history in first interaction.
- Move sensitive discussion to in-person/controlled channel with explicit informed context.

---

## 3) Intake Data Design (What to Collect vs Avoid)

## 3.1 Allowed at first touch (minimum viable)

- Parent name (or nickname)
- Parent phone
- Child age bracket (e.g., 2–3, 4–5, 6+)
- One concern tag (speech delay / behavior / school readiness / other)
- Preferred contact time

## 3.2 Avoid at first touch

- Full child legal identity (unless appointment confirmation requires it)
- Medical records/photos/videos in open chat
- National ID / IIN data
- Long free-text symptom narratives if avoidable

## 3.3 Data lifecycle rule

- **Unqualified/no-response leads:** auto-delete or anonymize after defined window (recommend 30–90 days)
- **Booked clients:** transfer into formal client record workflow with separate policy basis

---

## 4) WhatsApp-Specific Operational Constraints

## 4.1 Channel limitations

- WhatsApp is excellent for first response and scheduling, but weak as a regulated health-record system.
- Business message quality can degrade if users block/report; template behavior can be restricted.

## 4.2 Messaging policy-safe posture

- Send only expected, user-relevant messages.
- Keep proactive follow-ups tightly bounded.
- Immediately honor “stop/don’t message” requests.
- Do not spam reminders or promotional blasts to old leads without fresh opt-in.

## 4.3 Recommended messaging boundaries

- WhatsApp purpose: **triage + scheduling + reminders only**
- No storage of sensitive chat exports in personal staff devices
- Staff must use business-managed account(s), not personal numbers

---

## 5) SLA Recommendations for Lead Handling

## 5.1 Service levels (recommended)

| Stage | Target SLA | Escalation Trigger | Owner |
|---|---:|---|---|
| New lead acknowledgment | ≤ 5 minutes (working hours) | > 10 min | Intake coordinator |
| Human qualification response | ≤ 15 minutes | > 30 min | Intake coordinator |
| Appointment offer (time slots) | ≤ 30 minutes after qualification | > 60 min | Admin + specialist scheduler |
| Off-hours autoresponder | immediate | N/A | Bot/template |
| Unanswered lead follow-up #1 | +2 hours | N/A | Intake coordinator |
| Unanswered lead follow-up #2 (last) | +24 hours | Stop after this unless user replies | Intake coordinator |

## 5.2 Practical cadence

1. Instant acknowledgment template
2. Human handoff quickly (same channel)
3. 2 follow-up maximum without reply
4. Close lead as dormant; no repeated nudges

---

## 6) Risk Register & Controls (WhatsApp Lead Ops)

| Risk | Likelihood | Impact | Control | Monitoring |
|---|---|---|---|---|
| Missing or invalid consent evidence | Medium | High | Required checkbox + timestamp + consent text version logging | Weekly consent log audit |
| Over-collection of child-sensitive data | Medium | High | Intake script with forbidden questions at stage 1 | Chat QA sample review |
| Staff use personal phones / uncontrolled export | High | High | Business-only device/account policy; disable auto-backup where possible | Monthly device/access checklist |
| Slow response causing lead drop + repeated unsolicited follow-up | High | Medium | SLA dashboard + capped follow-up policy | Daily response-time report |
| User complaints / spam reports in WhatsApp | Medium | Medium/High | Relevance-first messaging, immediate opt-out handling | Template quality/error monitoring |
| No formal deletion workflow | Medium | Medium | Retention schedule + monthly purge task | Purge logs |
| Cross-border/data-location mismatch in tooling | Medium | High | Keep master lead register in KZ-hosted or compliant-reviewed system | Quarterly vendor review |

---

## 7) Minimum Operating Controls (Implement Now)

## P0 (must-have this sprint)

1. **Consent checkbox (required) + privacy notice link** on form.
2. **Consent proof capture** in form event log (timestamp, source URL, consent text version).
3. **Standard intake script** for WhatsApp agents (allowed/disallowed data).
4. **SLA tracker** (Google Sheet/CRM) with first-response timer.
5. **Stop-contact rule** and template for opt-out confirmation.

## P1 (next)

1. Role-based access to lead data.
2. Monthly deletion/anonymization routine.
3. Incident response SOP (including one-business-day regulator notification decision workflow if applicable).

## P2 (scale)

1. Migration from chat-centric storage to structured CRM as system of record.
2. QA scorecard for intake quality + consent hygiene.
3. Vendor due diligence pack for messaging and storage providers.

---

## 8) Suggested Intake Script Guardrails (for staff)

**Do ask:**
- Child age bracket
- Main concern category
- Preferred branch/time

**Do not ask in first chat:**
- Full medical history
- Diagnostic labels from prior providers (unless parent volunteers)
- Documents/photos unless absolutely needed for appointment prep

**If parent shares sensitive details anyway:**
- Acknowledge briefly
- Move to appointment booking
- Avoid discussing treatment specifics over chat

---

## 9) Compliance Artifacts Checklist

Maintain these artifacts for audit readiness:

- Current privacy notice (public)
- Consent text versions + effective dates
- Consent log export (sampled monthly)
- Data retention/deletion SOP
- Incident response SOP
- Staff training acknowledgment for intake scripts
- Vendor list and data-flow map (site form → WhatsApp → lead register)

---

## 10) Confidence & Validation Notes

- **Kazakhstan data protection baseline:** **MEDIUM** confidence (based on secondary but reputable legal summaries; official text retrieval had technical access issues in this run).
- **WhatsApp operations constraints:** **MEDIUM** confidence (Twilio docs summarizing platform mechanics; direct Meta/WhatsApp policy pages were not retrievable via this fetch path).
- **SLA and intake controls:** **HIGH (operational best practice)** for lead-conversion + risk reduction, but not a legal determination.

---

## Sources

1. DLA Piper, *Data protection laws in Kazakhstan* (last modified 13 Feb 2026): https://www.dlapiperdataprotection.com/index.html?t=law&c=KZ  
   - Used for: consent expectations, localization/storage mention, breach-notification timing, governance obligations.
2. Twilio Docs, *Send WhatsApp notification messages with templates* (accessed 2026-04-05): https://www.twilio.com/docs/whatsapp/tutorial/send-whatsapp-notification-messages-templates  
   - Used for: template workflow, 24-hour window concept, template pause/deactivation behavior.
3. Kazakhstan Law reference URL (official legal database, retrieval issue in tool session): https://adilet.zan.kz/eng/docs/Z1300000094  
   - Action: verify exact statutory language with local counsel / direct legal retrieval.
