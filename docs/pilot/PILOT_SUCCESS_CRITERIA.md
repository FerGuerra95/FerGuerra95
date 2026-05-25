# CEO's OS — Pilot Success Criteria

**Status:** Draft · Agree with sponsor before pilot start  
**Not:** SLA · Guaranteed business outcomes · Certification

---

## How to use

1. Review with pilot sponsor at kickoff.  
2. Revisit in each `PILOT_WEEKLY_REVIEW.md`.  
3. Use **exit criteria** at pilot end for go/no-go.

---

## 1. Product success

| # | Criterion | Target | Evidence |
|---|---|---|---|
| P1 | Users can log in (password or approved SSO) | 100% pilot users | Smoke / weekly check |
| P2 | Selected modules load without P0 errors | All in-scope modules | User feedback + logs |
| P3 | Data persists across sessions | No unexplained data loss | Spot checks |
| P4 | Reports / board review **drafts** generate | At least one per Reporting pilot | Export sample |
| P5 | Human review workflow understood | Sponsor sign-off | Kickoff + weekly |
| P6 | No open **P0** issues | Zero P0 | Issue log |
| P7 | No open **P1** blocking pilot | Zero blocking P1 | Issue log (credential rotation = P1 ops) |
| P8 | Audit logs captured for auth + compliance actions | Sample review OK | C.14.3 tests + weekly sample |
| P9 | Backup process executed at least once | Before + during pilot | Backup log |
| P10 | Truthfulness labels / DSS limits understood | Training complete | Quiz or written ack |

**Optional P2 (non-blocking):** Funding e2e copy mismatch · Compliance radar empty-state · PDF renderer N/A.

---

## 2. Business success (qualitative — agree metrics)

| # | Criterion | Measurement |
|---|---|---|
| B1 | Time saved in executive review prep | Sponsor estimate (hours/week) |
| B2 | Better cross-module visibility | Survey 1–5 |
| B3 | Board review draft usefulness | Reviewer score 1–5 |
| B4 | Risk / compliance signal clarity | Workshop feedback |
| B5 | M&A / PMI decision-support usefulness | Use case stories (anonymized) |
| B6 | User satisfaction | NPS or 1–5 per role |

**Minimum bar (suggested):** Average ≥ 3/5 on B3–B6 for continue recommendation.

---

## 3. Security success

| # | Criterion | Target |
|---|---|---|
| S1 | No credential exposure in chat/commits | Zero incidents |
| S2 | No unauthorized cross-tenant access | Zero confirmed IDOR |
| S3 | Tenant isolation maintained | Integration tests green + no incidents |
| S4 | Audit trail usable for sample investigation | Weekly sample completed |
| S5 | Backup + integrity check executed | `integrity_check: ok` |
| S6 | Secure shares revoked after use | Inventory empty at offboarding |

---

## 4. Privacy success (pilot)

| # | Criterion | Target |
|---|---|---|
| PR1 | Data intake template approved | Signed template |
| PR2 | No prohibited data categories uploaded | Zero violations |
| PR3 | Retention/deletion expectations documented | Written agreement |
| PR4 | DPA final | **Not required for pilot end** — track as post-pilot legal |

---

## 5. Exit criteria (go / no-go)

| Decision | When | Requirements |
|---|---|---|
| **Continue pilot** | Week 4+ | Product P1–P8 met; no security incident; sponsor satisfied |
| **Expand modules** | Pilot success | Written scope addendum; Heritage only if audited |
| **Move to procurement** | Post-pilot | Legal DPA, SOC2 roadmap, SLA discussion — **separate phase** |
| **Stop pilot** | Failure or end date | Offboarding checklist complete |
| **Stop and delete data** | Contract requires | Manual deletion per ops; confirm with customer |

### Go / no-go matrix (template)

| Area | Go | No-go |
|---|---|---|
| Product | ≥ 8/10 product criteria met | P0 or >2 blocking P1 |
| Business | B3 ≥ 3/5 | Sponsor withdraws |
| Security | S1–S5 met | Any confirmed breach |
| Legal | Draft packs accepted | Customer requires final DPA before continue |

---

## 6. What success is NOT

- SOC2 / ISO certification achieved  
- Procurement contract signed as result of pilot alone  
- Board approval of any CEO's OS output without customer process  
- Golden coverage for all modules (only where documented)  

---

## Related

- `PILOT_WEEKLY_REVIEW.md`
- `PILOT_OFFBOARDING_CHECKLIST.md`
- `../testing/LOGIC_INTEGRITY_PROTOCOL.md` (commercial truthfulness)
