# CEO's OS / The Sovereign OS — Pilot Readiness Pack

**Status:** Draft · Internal pilot readiness · Subject to legal review  
**Not:** Final contract · Final SLA · Procurement pack · SOC2/ISO certification  
**Version:** C.14.5 — Controlled Enterprise DSS Pilot

---

## 1. Purpose

Convert the C.13 logic baseline and C.14.1–C.14.4 hardening into an **operational package** for a **controlled pilot**: who participates, which modules are in scope, how data is loaded, how success is measured, how the pilot is run weekly, and how it ends.

This pack is for **internal operators**, pilot sponsors, and customer success — not a sales contract or legal advice.

---

## 2. Pilot status

| Dimension | Status |
|---|---|
| **Pilot-ready (controlled internal use)** | **YES**, with conditions in this pack |
| **Enterprise certified** | **NO** |
| **Procurement-ready** | **NO** |
| **SOC2 / ISO** | **NO** |
| **SLA-backed production** | **NO** |
| **Autonomous decisions** | **NO** — human review required |

**Prerequisites before go-live:** C.14 security/privacy drafts reviewed · backup executed · smoke passed · C14-P1-CREDENTIAL-01 addressed · NDA/pilot agreement (legal).

---

## 3. Allowed positioning (can say)

- Private **Executive Decision Support System (DSS)** for pilot evaluation  
- **Human-reviewed** indicators, drafts, and board-review materials  
- **Operational decision-support** across M&A, Risk, Compliance, PMI, Governance, Strategy, Reporting, Funding (with Funding caveats)  
- **Golden-tested oracles** where documented in `docs/testing/GOLDEN_DATASETS.md`  
- Security/privacy **pilot pack drafted** (C.14.4)  
- Auth + Compliance CRUD **audit trail** (C.14.3)  
- Backup and integrity procedures **documented** (C.14.2)  
- Tenant-safe create hardening on selected modules (C.14.1)  
- Production auth smoke **passed** with documented P2 residuals  

---

## 4. Not allowed positioning (cannot say)

- Enterprise certified · Procurement-ready · SOC2/ISO ready  
- Legal reviewed (unless counsel confirms) · SLA-backed availability  
- Autonomous decision engine · Guaranteed outcomes  
- Certified compliance / governance / risk rating  
- Investment advice · Fairness opinion · Legal opinion  
- Board pack or report **approved** without human sign-off  
- Public deal marketplace · Complete PDF reporting (renderer pending)  
- GDPR fully compliant (pilot drafts only — legal review required)  

---

## 5. Pilot modules included (recommended)

| Module | Pilot role | Notes |
|---|---|---|
| **CEO Overview / Executive** | Command center; aggregated signals | Aggregator only — not master store; truthfulness gated C.13.10B |
| **M&A** | Valuation, waterfall, pipeline, buyer matching, CIM, data room | DSS only; not fairness opinion; secure share with ops guidelines |
| **Risk** | Register, heatmap, controls, mitigations | Golden basic score exists |
| **PMI** | Synergies, milestones, Day 1/100 | Demo merge removed C.13.12B; label forecasts |
| **Compliance** | Suppliers, evidence, reviews, reports, audit runs | CRUD audited C.14.3; weighted risk Golden where documented |
| **Reporting** | KPIs, board pack **draft** | Board pack = review draft, not approved pack |
| **Governance** | Decisions, committees, audit trail | Backend-strong; not certified governance system |
| **Strategy** | Objectives, initiatives, scenarios | DSS prioritization |
| **Funding** | Rounds, runway, scenarios | **Use with caution** — draft vs persisted SoT; label draft vs backend |

---

## 6. Pilot modules excluded or preview-only

| Item | Treatment |
|---|---|
| `/bridge/marketplace` | **Excluded** from pilot narrative — internal/unlisted demo only |
| **Heritage** | **Preview / partial** — not C.13 logic-audited; do not promise completeness |
| **Certified legal/compliance/risk** | **Excluded** — DSS only |
| **Certified valuation / fairness opinion** | **Excluded** |
| **Complete PDF reporting** | **Excluded** until renderer phase authorized |
| **Autonomous decision-making** | **Excluded** |
| **Enterprise SSO** | **Excluded** unless OIDC configured and C14-P1-OIDC-IDTOKEN-01 accepted |
| **Procurement / SOC2 pack** | **Excluded** from this pilot |

---

## 7. Data boundaries

**Allowed (with NDA/pilot agreement):**

- Anonymized or pilot-approved business data per `PILOT_DATA_INTAKE_TEMPLATE.md`  
- Synthetic demo data in dedicated pilot org  
- Metadata-first evidence (titles, types) — minimize full document text in pilot  

**Not allowed without explicit legal approval:**

- Special category personal data (GDPR Art. 9)  
- Production customer DB copies  
- Real customer credentials in shared accounts  
- Payment card or government ID bulk uploads  
- Secrets in tickets (passwords, tokens, share URLs)  

See `docs/privacy/DATA_PROCESSING_SUMMARY.md`.

---

## 8. Security prerequisites

- [ ] `SECURITY_PRIVACY_PILOT_PACK.md` reviewed with sponsor  
- [ ] `PILOT_SECURITY_RUNBOOK.md` + `PILOT_ONBOARDING_CHECKLIST.md` completed  
- [ ] `CREDENTIAL_HYGIENE.md` — rotation if exposed  
- [ ] Backup before pilot (`BACKUP_RESTORE_RUNBOOK.md`)  
- [ ] Production smoke (health + login + sample module reads)  
- [ ] CORS and `AUTH_SECRET` correct for environment  

---

## 9. Privacy prerequisites

- [ ] `RGPD_PILOT_READINESS.md` shared with customer legal (draft)  
- [ ] Data intake template signed off  
- [ ] Retention/deletion expectations documented (manual until automation)  
- [ ] DPA final — **pending** (`DPA_DRAFT_NOTES.md` index only)  

---

## 10. Human review requirements

Every pilot user must acknowledge:

1. Outputs are **indicative DSS** — not decisions.  
2. Board packs and compliance reports are **drafts for human review**.  
3. Scores and matches are **heuristics or Golden-benchmarked calculations** — not certifications.  
4. Escalation to legal/finance/board remains customer responsibility.  

Assign a named **Human Review Owner** in onboarding checklist.

---

## 11. Success criteria

Detailed in `PILOT_SUCCESS_CRITERIA.md`. Summary:

- Product: login, modules load, persist, audit/backup executed, no open P0/P1  
- Business: time saved, visibility, draft usefulness (qualitative)  
- Security: no credential leak, tenant isolation, audit usable  

---

## 12. Weekly operating cadence

| Activity | Owner | Artifact |
|---|---|---|
| Weekly pilot review (60 min) | Pilot lead | `PILOT_WEEKLY_REVIEW.md` |
| Issue triage | Engineering + pilot lead | Issue log / tracker |
| Audit sample review | Security/ops | `audit_logs` sample |
| Backup (weekly or per policy) | Ops | `backup-sqlite.js` log |
| User/access review | Admin | User list |
| Go/no-go checkpoint | Sponsor + pilot lead | Success criteria § exit |

---

## 13. Support and escalation

| Tier | Channel | Examples |
|---|---|---|
| P0 | Immediate — pilot lead + engineering | Suspected cross-tenant leak, credential in chat |
| P1 | Same day | Login failure spike, data loss |
| P2 | Next business day | UI copy confusion, P2 e2e residuals |
| Product truthfulness | Document in weekly review | Misread board pack as approved |

Reference: `PILOT_SECURITY_RUNBOOK.md` § incident escalation.

---

## 14. Exit and offboarding

Follow `PILOT_OFFBOARDING_CHECKLIST.md`:

- Export agreed artifacts  
- Revoke users and secure shares  
- Rotate credentials  
- Backup final state  
- Delete/retain per agreement (**manual** — document gap)  
- Final pilot report and go/no-go  

---

## 15. Open limitations (honest)

| Limitation | Phase / owner |
|---|---|
| C14-P1-CREDENTIAL-01 password rotation | Ops — **OPEN** (C.14.7); blocks expanded pilot until operator confirms rotation outside repo |
| Final DPA / privacy policy | Legal — pending |
| OIDC id_token verification | C.14.6 if SSO required |
| Secure share operational discipline | Customer + ops |
| Automated retention/DSR deletion | Future |
| PDF renderer | P2/P3 |
| Heritage full audit | Separate phase |
| Funding e2e copy P2 | Optional fix phase |

---

## Pilot document index

| Document | Path |
|---|---|
| Onboarding | `PILOT_ONBOARDING_CHECKLIST.md` |
| Data intake | `PILOT_DATA_INTAKE_TEMPLATE.md` |
| Success criteria | `PILOT_SUCCESS_CRITERIA.md` |
| Weekly review | `PILOT_WEEKLY_REVIEW.md` |
| Offboarding | `PILOT_OFFBOARDING_CHECKLIST.md` |
| Risk register | `PILOT_RISK_REGISTER.md` |
| Security runbook | `../operations/PILOT_SECURITY_RUNBOOK.md` |
| Security/privacy pack | `../security/SECURITY_PRIVACY_PILOT_PACK.md` |

---

## C14-PILOT-READINESS-01

**RESOLVED** / CONTROLLED PILOT PACK DOCUMENTED

Conditions: legal review for external use · credential rotation · no procurement/SOC2 claims.

---

**This document is an internal pilot readiness draft. It is not a contract, SLA, or legal advice.**
