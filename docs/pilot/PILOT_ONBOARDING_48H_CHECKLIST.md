# Pilot Onboarding 48H Checklist

**Phase:** C.22.5b  
**Purpose:** Start a controlled CEO's OS Board Intelligence pilot within 48 hours.  
**Not:** Procurement certification, SLA, legal advice, investment advice, or board approval.

---

## Day 0 - Scope, Access, and Safe Intake

| Check | Owner | Output |
|---|---|---|
| Confirm pilot sponsor | Sales / Pilot lead | Named sponsor |
| Confirm human reviewer | Pilot lead | Named reviewer |
| Confirm pilot scope | Sponsor + pilot lead | One-sentence pilot objective |
| Confirm primary module | Sponsor | Reporting plus one optional module |
| Confirm NDA/DPA path if needed | Legal / sponsor | Legal status note |
| Create user list | Admin | Role/access matrix |
| Confirm data transfer method | Security / ops | Approved transfer channel |
| Request minimum data package | Pilot lead | Intake request sent |
| Identify data owner | Sponsor | Data owner named |
| Confirm no secrets in uploads | Security / ops | Intake hygiene confirmed |

Day 0 exit criteria:

- Sponsor and reviewer named.
- Scope is narrow.
- Data channel is approved.
- No passwords, tokens, raw DB dumps, or unnecessary sensitive data requested.

---

## Day 1 - Load, Quality Review, Missing-Data Map

| Check | Owner | Output |
|---|---|---|
| Receive minimum data package | Operator | Intake folder |
| Screen for prohibited data | Security / operator | Safe data set |
| Structure company profile | Operator | Company context |
| Structure financial summary | Operator | Finance context |
| Structure board objective | Pilot lead | Reporting context |
| Load selected module data | Operator | Module draft context |
| Identify stale fields | Data owner | Freshness notes |
| Identify conflicting fields | Data owner | Conflict notes |
| Build missing-data map | Pilot lead | Missing-data table |
| Convert gaps into questions | Pilot lead + reviewer | Board questions |

Day 1 exit criteria:

- Data is safe enough for pilot use.
- Missing data is visible.
- No missing score is converted into zero.
- First Board Review Draft can be prepared or correctly classified as discovery-only.

---

## Day 2 - Board Review Draft and Review Session

| Check | Owner | Output |
|---|---|---|
| Prepare Board Review Draft context | Pilot lead | Draft input |
| Create or prepare snapshot | Operator | Snapshot-ready context |
| Review labels | Product truthfulness reviewer | Required labels confirmed |
| Run human review session | Sponsor + reviewer | Review notes |
| Confirm success criteria | Sponsor + pilot lead | Pilot scorecard |
| Confirm next data requests | Data owner | Data action list |
| Confirm workflow owner | Reviewer | Review workflow owner |
| Confirm no external claims | Pilot lead | Claims check |
| Schedule weekly cadence | Pilot lead | Calendar hold |

Day 2 exit criteria:

- Board Review Draft exists or missing-data discovery map exists.
- Human reviewer has reviewed the draft or question map.
- Success criteria are agreed.
- Next sprint is defined.

---

## 48H Go / No-Go Decision

| Decision | Criteria |
|---|---|
| Go | Minimum data is safe, sponsor/reviewer named, draft or question map ready |
| Go with gaps | Draft useful but key missing data remains visible |
| Discovery first | Not enough data for Board Review Draft; run workshop |
| Stop | Sensitive/legal/security issue blocks use |

---

## Required Truthfulness Labels

Every first Board Review Draft must preserve:

- Board Review Draft.
- Human Review Required.
- Based on DSS Signals.
- Not Legal Advice.
- Not Investment Advice.
- Not Board Approved.
- Confidential.

---

## Common 48H Failure Modes

| Failure | Response |
|---|---|
| No reviewer named | Do not circulate draft externally |
| Data too broad | Reduce to minimum package |
| Sensitive data included | Stop and escalate |
| Missing financial source | Mark insufficient_data |
| Buyer wants final report | Reframe as Board Review Draft |
| AI asked to decide | Reframe AI as draft assistant foundation only |
