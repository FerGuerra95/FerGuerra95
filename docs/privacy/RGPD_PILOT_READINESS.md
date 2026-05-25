# CEO's OS — RGPD Pilot Readiness (Draft)

**Status:** Draft · Subject to legal review  
**Not:** Final privacy policy · Final DPA · GDPR compliance certification  
**Audience:** Internal pilot leads, customer legal/security questionnaires (after counsel approval)

---

## 1. Draft status

This document describes **pilot readiness assumptions** for EU/EEA-style data protection conversations. Only qualified legal counsel may finalize roles, legal bases, retention, and contractual terms.

**Do not claim:** "GDPR fully compliant", "legal reviewed", or "procurement-ready".

---

## 2. Roles (contract-dependent)

| Party | Typical role (assumption) | Notes |
|---|---|---|
| Customer / pilot sponsor | **Controller** for business data they upload | Confirmed in contract |
| CEO's OS operator / hosting provider | **Processor** when processing on customer instructions | Confirmed in contract |
| Subprocessors (hosting, email) | Listed in future DPA annex | **Pending** formal list |

Final controller/processor split may vary (e.g. operator as controller for account metadata only). **Legal review required.**

---

## 3. Data categories

| Category | Examples | Special category? |
|---|---|---|
| User account data | Email, name, role, org membership | No (unless mis-uploaded) |
| Organization data | Org id, settings | No |
| M&A / deal data | Cases, valuations, pipeline, data room metadata | Business data |
| Compliance | Suppliers, evidence titles/metadata, reviews, reports | May contain third-party business PII if client uploads |
| Risk / PMI / Governance / Strategy | Registers, decisions, initiatives | Business data |
| Reporting | KPIs, board pack metadata | Business data |
| Audit logs | Actor, action, safe metadata | Operational |
| Secure share | Link id, expiry, access audit — **not** raw token in logs | Operational secret |
| Technical logs | Request ids, errors (must avoid PII/secrets) | Operational |

**Do not upload** special categories of personal data (Art. 9 GDPR) unless explicitly authorized and legally grounded.

---

## 4. Processing purposes

- Executive **decision-support** and scenario preparation  
- Internal **reporting** and board-pack drafting (human-reviewed)  
- **Audit trail** for accountability (auth, compliance CRUD, share access)  
- **Pilot evaluation** of the platform  

Not for automated legal decisions or unsupervised regulatory filing.

---

## 5. Legal basis

To be defined by **customer** and **legal counsel** per processing activity, e.g.:

- Contract (Art. 6(1)(b)) for providing the service  
- Legitimate interests (Art. 6(1)(f)) for security logging — balanced and documented  
- Consent where required for optional features  

CEO's OS documentation does not select legal bases on behalf of customers.

---

## 6. Retention

| Area | Pilot status |
|---|---|
| Business data | **Pending** formal retention policy per tenant |
| Audit logs | **Pending** retention schedule and purge job |
| Backups | Per `BACKUP_RESTORE_RUNBOOK.md` — provisional RPO 24h |
| Deleted users/orgs | **Pending** automated erasure workflow |

Pilot default: agree retention in pilot agreement; export/delete on offboarding manually until automated DSR process exists.

---

## 7. Deletion / export (DSR)

| Right | Pilot status |
|---|---|
| Access / portability | **Partial** — SQLite export/backup possible operationally; no self-service DSR portal |
| Erasure | **Pending** formal workflow per org |
| Restriction / objection | **Pending** — contractual + manual process |

Assistance to customer DSR requests should be described in future DPA (see `DPA_DRAFT_NOTES.md`).

---

## 8. Access control

- Authentication required for enterprise API (except designed public routes e.g. health, secure share public GET with token).  
- **Role-based** permissions (admin/user/viewer) — server-side enforcement required per endpoint.  
- **Tenant isolation:** `organizationId` from session/token; C.14.1 strips client tenant overrides on selected creates.  

---

## 9. Security measures (summary)

- Auth, password hashing, session revocation  
- Audit logging (auth + compliance CRUD; metadata sanitization)  
- Backup + integrity check runbook  
- CORS allowlist, security headers, rate limits  
- Secure share: hashed token, expiry, revocation  
- DSS truthfulness: no certification language in product docs  

See `SECURITY_PRIVACY_PILOT_PACK.md` and `SECURITY_REVIEW_CHECKLIST.md`.

---

## 10. Open gaps (honest)

| Gap | Priority |
|---|---|
| Final DPA text | P1 — legal |
| Final privacy policy / notice | P1 — legal |
| Retention policy + automated purge | P1 |
| DSR / erasure runbook | P1 |
| Subprocessor list + DPAs | P1 |
| Incident response + breach notification playbook | P1 |
| International transfer mechanisms (SCCs, etc.) | P1 if non-EEA hosting |
| DPIA support template | P2 |
| Records of processing activities (Art. 30) | P2 |

---

## 11. Do-not-claim

- Not **GDPR certification** or regulatory approval  
- Not **legal advice** — customers must use their counsel  
- Not **investment advice** or certified compliance audit  
- Pilot pack does not replace customer privacy notice to their employees/data subjects  

---

## C14-P1-DPA-RGPD-PRIVACY-01

**PARTIALLY RESOLVED** / PILOT PRIVACY PACK DRAFTED / LEGAL REVIEW REQUIRED

---

## Related documents

- `DATA_PROCESSING_SUMMARY.md`
- `DPA_DRAFT_NOTES.md`
- `../security/SECURITY_PRIVACY_PILOT_PACK.md`
- `../operations/PILOT_SECURITY_RUNBOOK.md`
