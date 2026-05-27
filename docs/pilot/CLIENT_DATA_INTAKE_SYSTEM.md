# Client Data Intake System

**Phase:** C.22.5  
**Purpose:** Start a controlled Board Intelligence pilot within 48 hours using minimum viable client data, clear human review, and visible missing-data boundaries.  
**Not:** Legal advice, investment advice, compliance certification, board approval, or autonomous AI workflow.

---

## 1. Objective

The intake system converts a client's early pilot materials into structured DSS context for CEO's OS. The goal is not to collect everything. The goal is to collect enough safe, reviewable, tenant-scoped information to create:

- Executive Overview signals;
- Reporting / Board Review Draft context;
- persisted Board Review Snapshots;
- a missing-data map;
- board-review questions for the first review session.

The first pilot should prefer **minimum useful data** over broad uncontrolled uploads.

---

## 2. Minimum Data for Board Intelligence Pilot

| Data area | Minimum required | Why it matters |
|---|---|---|
| Company profile | Legal name, sector, geography, employee count, operating units | Scope and board pack context |
| Financial summary | Revenue, EBITDA or operating profit, cash, debt, burn/runway if relevant | Executive and Funding signals |
| Current strategic question | Example: acquisition, funding, compliance remediation, board pack | Demo/pilot spine |
| Board pack objective | Audience, date, decision needed, owner | Reporting workflow |
| Human reviewer | Named sponsor or reviewer | Prevents draft-as-final misuse |
| Module priority | Reporting plus one optional module | Keeps pilot narrow |
| Known missing data | List of unknowns | Preserves truthfulness |

If these fields are absent, the pilot can still start as a discovery workspace, but the first Board Review Draft must be labelled **insufficient_data**.

---

## 3. Recommended Data by Module

### Executive Overview

| Data | Expected format | Minimum? |
|---|---|---|
| Company profile | Short text / CSV row | Required |
| Key operating metrics | CSV or spreadsheet | Recommended |
| Top 3 priorities | Text bullets | Required |
| Key risks | Text bullets | Recommended |
| Current board agenda | PDF/Doc summary or text | Recommended |

### Reporting

| Data | Expected format | Minimum? |
|---|---|---|
| Board pack objective | Text | Required |
| Reporting period | Date range | Required |
| Audience | Board, IC, executive committee | Required |
| Existing deck outline | PDF/Slides/Doc if available | Recommended |
| Decision questions | Text bullets | Recommended |
| Human reviewer | Name/role, not personal sensitive details | Required |

### M&A

| Data | Expected format | Minimum? |
|---|---|---|
| Target description | Text | Required if M&A in scope |
| Strategic rationale | Text bullets | Required |
| Indicative target revenue/EBITDA | Numeric, source labelled | Recommended |
| Deal stage | Option list | Recommended |
| Key diligence questions | Text bullets | Recommended |
| Valuation assumptions | Spreadsheet if available | Optional |

### Compliance

| Data | Expected format | Minimum? |
|---|---|---|
| Supplier/vendor list | CSV | Required if Compliance in scope |
| Risk categories | Option list / text | Recommended |
| Evidence status | Metadata-first list | Recommended |
| Open incidents | Text summary | Recommended |
| Policy gaps | Text bullets | Optional |

### Funding

| Data | Expected format | Minimum? |
|---|---|---|
| Target raise | Numeric + currency | Required if Funding in scope |
| Current cash | Numeric + currency | Recommended |
| Monthly burn | Numeric + currency | Recommended |
| Revenue/run-rate | Numeric + period | Recommended |
| Pre-money valuation assumption | Numeric + source labelled | Optional |
| Use of funds | Percent or amount allocation | Recommended |

### Risk

| Data | Expected format | Minimum? |
|---|---|---|
| Risk register | CSV | Required if Risk in scope |
| Likelihood/impact | 1-5 scale if known | Recommended |
| Controls | Text / CSV | Recommended |
| Owners | Role-level owner, no unnecessary PII | Recommended |
| Mitigation status | Option list | Recommended |

### PMI

| Data | Expected format | Minimum? |
|---|---|---|
| Integration thesis | Text | Required if PMI in scope |
| Synergy initiatives | CSV | Recommended |
| Day 1 / Day 100 milestones | CSV / text | Recommended |
| Owners | Role-level owner | Recommended |
| Dependencies and blockers | Text bullets | Recommended |

---

## 4. Minimum Documents

| Document | Required? | Notes |
|---|---|---|
| Company one-page profile | Required | Can be created during intake |
| Latest management accounts or summary P&L | Recommended | Summary is enough for first 48h |
| Existing board agenda or report outline | Recommended | Enables Board Review Draft context |
| Module-specific CSV | Optional | Only for selected module |
| Risk/compliance evidence index | Optional | Metadata-first; avoid raw sensitive files initially |
| NDA/DPA notes | Conditional | Required before real confidential or regulated data |

---

## 5. Expected Format

Preferred:

- CSV for lists;
- XLSX for financial summaries if already used by client;
- Markdown/Text for board questions and narrative;
- PDF only for high-level existing decks;
- metadata-first evidence list before raw documents.

Avoid:

- screenshots of spreadsheets as source data;
- email chains as primary source;
- bulk data dumps;
- raw exports containing unnecessary personal data;
- password-protected files without an agreed secure transfer process.

---

## 6. Data Not To Upload

Do not upload during initial 48h intake unless legal/security has explicitly approved:

- passwords, API keys, tokens, cookies, auth headers;
- full production database exports;
- payment card data;
- government ID numbers;
- special category personal data;
- employee medical, union, biometric, or highly sensitive HR data;
- raw customer personal data where aggregate/metadata would work;
- privileged legal advice;
- board minutes that are not approved for pilot use;
- third-party confidential data without permission.

---

## 7. Sensitive Data Handling

Rules:

1. Minimize data before upload.
2. Prefer role names over named people unless the named person is required for workflow.
3. Mark source, freshness, and confidence for each important data point.
4. Keep secrets out of tickets, chat, docs, demos, screenshots, and snapshots.
5. If unsure, classify as sensitive and escalate before upload.

---

## 8. Missing Data Treatment

Missing data is a product signal, not an embarrassment.

CEO's OS should show missing data as:

- **N/A**;
- **insufficient_data**;
- "Not provided";
- "Pending client confirmation";
- board-review question.

Never convert missing values into:

- `0`;
- "watch" by default;
- a fake score;
- a confident statement;
- a board conclusion.

---

## 9. Review Ownership

| Role | Responsibility |
|---|---|
| Pilot sponsor | Confirms scope and business objective |
| Human reviewer | Reviews Board Review Draft before circulation |
| Data owner | Confirms source and freshness |
| Operator | Loads structured pilot data and flags gaps |
| Security/privacy reviewer | Screens sensitive data and transfer method |
| Module lead | Reviews module-specific interpretation |

No Board Review Draft should be circulated externally without a named human reviewer.

---

## 10. 48-Hour Checklist

| Time | Activity | Output |
|---|---|---|
| Hour 0-2 | Confirm scope, sponsor, reviewer, module priority | Pilot scope note |
| Hour 2-6 | Collect minimum data package | Intake folder |
| Hour 6-12 | Screen for sensitive/unnecessary data | Safe upload set |
| Hour 12-24 | Load or structure data | Draft module context |
| Hour 24-30 | Build missing-data map | Missing-data questions |
| Hour 30-36 | Prepare first Board Review Draft context | Snapshot-ready narrative |
| Hour 36-44 | Human review session | Reviewed notes |
| Hour 44-48 | Confirm next sprint and success criteria | Pilot plan |

---

## 11. Criteria for "Insufficient Data"

Mark a topic as **insufficient_data** when:

- the source is unknown;
- the data is older than the agreed reporting period;
- the figure is a guess without label;
- the field is missing but material to the decision;
- a required module has no minimum viable input;
- a sensitive document cannot be used yet;
- values conflict and no owner has resolved them.

---

## 12. Turning Missing Data Into Board Review Questions

| Missing data | Board review question |
|---|---|
| No current cash figure | What is the latest cash balance and reporting date? |
| No target EBITDA source | Which source confirms the target's EBITDA and period? |
| No supplier risk owner | Who owns supplier remediation and evidence review? |
| No use-of-funds detail | What allocation is expected for product, sales, hiring, and runway? |
| No integration owner | Who owns Day 1 readiness and dependency tracking? |
| No risk likelihood/impact | Which risks require scoring before the next review? |

The best first draft may be a question map, not a polished conclusion.

---

## 13. Intake Decision

| Result | Meaning | Next action |
|---|---|---|
| Ready | Minimum data present and safe | Create first Board Review Snapshot |
| Ready with gaps | Enough for draft, gaps visible | Create draft with missing-data section |
| Discovery only | Not enough for draft | Run data workshop first |
| Blocked | Sensitive/legal/security issue | Escalate before upload |
