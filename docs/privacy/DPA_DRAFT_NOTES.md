# CEO's OS — DPA Draft Notes (Index Only)

**Status:** DRAFT NOTES ONLY — LEGAL REVIEW REQUIRED  
**Not:** A Data Processing Agreement · Not legal advice · Not executable contract text

---

## Purpose

Provide an **index of topics** counsel should address when drafting a customer DPA for CEO's OS pilot or production. Do not distribute this file as a signed DPA.

---

## 1. Parties

- Customer (controller or joint controller — TBD)
- Provider / operator legal entity
- Contact persons for privacy and security

---

## 2. Roles

- Controller vs processor determination per processing activity
- Subprocessors and flow-down obligations

---

## 3. Subject matter & duration

- CEO's OS enterprise DSS platform
- Term aligned with pilot / subscription agreement
- Post-termination data handling

---

## 4. Nature and purpose of processing

- Decision-support, reporting preparation, audit trail, pilot evaluation
- Explicit exclusion: legal advice, investment advice, certified audit outcomes

---

## 5. Categories of data

- See `DATA_PROCESSING_SUMMARY.md`
- Annex: allow/prohibit special categories

---

## 6. Categories of data subjects

- Customer employees and authorized users
- Third parties named in uploaded business records (suppliers, counterparties) — customer responsibility for lawful upload

---

## 7. Security measures

- Reference technical measures: auth, tenant isolation, audit, backup, secure share controls
- Reference `SECURITY_REVIEW_CHECKLIST.md` and pilot pack
- Right to update measures with notice

---

## 8. Subprocessors

- Cloud host (e.g. Render)
- Email provider (if SMTP enabled)
- Optional Redis
- Process for notification and objection

---

## 9. International transfers

- Hosting region documentation
- SCCs or other mechanisms if transfers outside EEA

---

## 10. Confidentiality

- Personnel confidentiality obligations
- No use of customer data for unrelated purposes / model training (state policy explicitly)

---

## 11. Assistance with data subject rights

- Customer instructs provider; response timelines
- Export/delete support capabilities (note current **manual** pilot limits)

---

## 12. Deletion / return of data

- End of contract export window
- Deletion from production DB and backups (define backup retention exception)

---

## 13. Audit rights

- Customer audit or third-party report (SOC2 when available — **not claimed today**)
- Security questionnaire support using pilot pack

---

## 14. Breach notification

- Timelines (e.g. 72h assistance to controller)
- Contact channels
- Incident runbook reference (`PILOT_SECURITY_RUNBOOK.md` — expand for production)

---

## 15. Contact / escalation

- Privacy contact
- Security contact
- Escalation matrix

---

## 16. Product limitations (commercial protection)

Include clear limitations:

- DSS only — **human review required**
- Not SOC2/ISO certified unless separately attested
- Not legal, tax, or investment advice
- Calculated scores are indicative
- Secure share links are customer-operated secrets

---

## C14-P1-DPA-RGPD-PRIVACY-01

This index supports **PARTIALLY RESOLVED** status. Final DPA remains **OPEN** until counsel publishes executed agreement.

---

## Related

- `RGPD_PILOT_READINESS.md`
- `../security/SECURITY_PRIVACY_PILOT_PACK.md`
