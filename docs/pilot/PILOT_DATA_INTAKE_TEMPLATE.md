# CEO's OS — Pilot Data Intake Template

**Status:** Draft template — fill per pilot · **do not commit real customer data**  
**Legal review:** Required before loading customer data

---

## 1. Organization

| Field | Value (template) |
|---|---|
| Pilot organization name | _[e.g. Pilot Corp — Evaluation]_ |
| `organizationId` (system) | _[e.g. org_pilot_2026_q2]_ |
| Environment | [ ] Staging  [ ] Production pilot tenant |
| Pilot start date | __________ |
| Pilot end date | __________ |

---

## 2. Pilot owner

| Field | Value |
|---|---|
| Executive sponsor | __________ |
| Day-to-day pilot lead | __________ |
| Human Review Owner | __________ |
| Technical contact | __________ |

---

## 3. Modules included

Check modules in scope (align with `PILOT_READINESS_PACK.md`):

- [ ] CEO Overview / Executive  
- [ ] M&A  
- [ ] Risk  
- [ ] PMI  
- [ ] Compliance  
- [ ] Reporting / Board Review Draft  
- [ ] Governance  
- [ ] Strategy  
- [ ] Funding (caution — draft vs persisted)  

**Excluded / preview only:**

- [ ] Bridge marketplace — **out of scope**  
- [ ] Heritage — preview only if checked  

---

## 4. Data categories allowed

- [ ] User accounts (pilot team only)  
- [ ] Organization settings  
- [ ] Anonymized deal/supplier names  
- [ ] Financial **assumptions** (not audited financials unless agreed)  
- [ ] Risk register sample rows  
- [ ] Compliance supplier + evidence **metadata**  
- [ ] Governance decisions (business)  
- [ ] Strategy objectives/initiatives  
- [ ] Reporting KPI metadata  

---

## 5. Data categories excluded

- [ ] Special category personal data (health, biometric, etc.)  
- [ ] Full HR employee files  
- [ ] Unredacted government IDs  
- [ ] Production customer DB snapshot  
- [ ] Payment card data  
- [ ] Secrets (passwords, tokens, API keys)  

---

## 6. Data owner contact

| Field | Value |
|---|---|
| Customer data owner | __________ |
| Approval date for intake | __________ |

---

## 7. Data sensitivity

| Level | Description | Approved for this pilot? |
|---|---|---|
| Public | Marketing-safe | [ ] |
| Internal | Company confidential | [ ] |
| Restricted | Board/legal sensitive | [ ] — requires explicit approval |
| Regulated | Filing-ready | [ ] — **generally NO** for pilot without legal sign-off |

---

## 8. File types

| Type | Allowed? | Notes |
|---|---|---|
| CSV/Excel imports | [ ] | Via agreed process only |
| PDF uploads (data room) | [ ] | Size limits; virus scan policy TBD |
| Free-text evidence excerpts | [ ] | Minimize PII; not in audit logs |

---

## 9. Retention expectation

| Item | Agreement |
|---|---|
| Data retained after pilot | [ ] Yes  [ ] No  [ ] TBD |
| Retention period | __________ days/months |
| **System note** | Automated retention purge **not implemented** — manual ops |

---

## 10. Deletion expectation

| Item | Agreement |
|---|---|
| Delete all pilot data at end | [ ] Yes  [ ] No  [ ] Partial export then delete |
| Deletion method | Manual SQLite/export procedure until DSR automation |
| Confirmation required from customer | [ ] Yes |

---

## 11. Human review owner

Name: __________  
Responsibility: Approve external use of any board pack, compliance report, or M&A output.

---

## 12. Notes

___________________________________________________________________________

---

## Per-module intake (no real data — structure only)

### M&A

| Field | Pilot value |
|---|---|
| Deal name | _[Anonymized Deal A]_ |
| Financial assumptions | _[Revenue, EBITDA multiples — DSS inputs]_ |
| Valuation inputs | _[WACC, growth — label as scenario]_ |
| **Excluded claims** | Regulated investment advice; final IC decision; fairness opinion |

### Compliance

| Field | Pilot value |
|---|---|
| Supplier sample count | _[e.g. 5–20 suppliers]_ |
| Evidence | Metadata + short titles; avoid full contracts in pilot |
| **Excluded** | Unnecessary personal data; special categories |

### Risk

| Field | Pilot value |
|---|---|
| Register sample | _[N risks]_ |
| Likelihood / impact | Pilot scale agreed |
| Mitigations | Sample controls |

### PMI

| Field | Pilot value |
|---|---|
| Workstreams | _[e.g. IT, Finance]_ |
| Synergy forecasts | Label as **forecast / DSS** |
| Captured synergies | Actuals if customer provides |

### Reporting

| Field | Pilot value |
|---|---|
| Reports | KPI set names |
| Board review draft | **Draft only** — not approved pack |

### Governance

| Field | Pilot value |
|---|---|
| Decisions | Sample decision log |
| Committees | Names / cadence |
| Actions | Tracker sample |

### Strategy

| Field | Pilot value |
|---|---|
| Objectives | _[3–5 objectives]_ |
| Initiatives | Linked initiatives |
| Risks | Strategic risk sample |

### Funding

| Field | Pilot value |
|---|---|
| Rounds | Sample round metadata |
| Runway assumptions | Draft inputs |
| **Excluded claims** | Investment advice; guaranteed funding outcome |

---

## Approval signatures (template)

| Role | Name | Date |
|---|---|---|
| Pilot sponsor | | |
| Data owner | | |
| Legal (draft pack reviewed) | | |

---

**Do not store completed forms with real sensitive data in git.**
