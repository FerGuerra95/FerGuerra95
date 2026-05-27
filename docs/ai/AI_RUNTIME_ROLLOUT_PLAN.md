# AI Runtime Rollout Plan

**Phase:** C.16.3  
**Status:** Planning only / future C.16.4 sequence

---

## C.16.4A - Sandbox Provider Client Behind Feature Flag

| Item | Requirement |
|---|---|
| Objective | Add provider adapter behind disabled-by-default feature flag |
| Allowed data | Synthetic only |
| Forbidden data | Real client data, personal data, secrets, regulated data |
| Required tests | disabled default, no key in repo, kill switch, no frontend SDK |
| Rollback criteria | any provider traffic outside sandbox or missing kill switch |
| Stop conditions | SDK/API key committed, external fetch outside adapter, real data use |

---

## C.16.4B - Synthetic-Only Board Review Draft Generation

| Item | Requirement |
|---|---|
| Objective | Generate draft narrative from IberNova/synthetic snapshots |
| Allowed data | Synthetic snapshots only |
| Forbidden data | Client data and raw data rooms |
| Required tests | labels, missing-data preservation, no fake certainty |
| Rollback criteria | output claims approval/certification/advice |
| Stop conditions | hidden `insufficient_data`, formula recalculation |

---

## C.16.4C - Internal-Only Redaction And Prompt Injection Tests

| Item | Requirement |
|---|---|
| Objective | Validate redaction and prompt-injection resistance |
| Allowed data | Internal non-client test data |
| Forbidden data | Real client data, secrets |
| Required tests | threat model suite, secret redaction, tenant markers |
| Rollback criteria | injection bypass or secret leakage |
| Stop conditions | cross-tenant context accepted |

---

## C.16.4D - Human Review Workflow Integration

| Item | Requirement |
|---|---|
| Objective | Place AI Draft into review workflow without approval authority |
| Allowed data | Synthetic/internal only unless legal gate complete |
| Forbidden data | Real client data without DPA/subprocessor approval |
| Required tests | AI cannot mark reviewed/internal_final; UI labels visible |
| Rollback criteria | AI output changes persisted status without human action |
| Stop conditions | autonomous state mutation |

---

## C.16.4E - Controlled Pilot With Explicit Legal Approval

| Item | Requirement |
|---|---|
| Objective | Limited customer pilot with approved provider path |
| Allowed data | Explicitly approved pilot data only |
| Forbidden data | excluded categories, secrets, unapproved personal/regulated data |
| Required tests | tenant scope, audit, redaction, output evaluation, kill switch |
| Rollback criteria | client data sent outside approval scope |
| Stop conditions | DPA/subprocessor gap, output quality fail |

---

## C.16.4F - Production-Restricted Release

| Item | Requirement |
|---|---|
| Objective | Restricted runtime for approved orgs/use cases |
| Allowed data | Contract-approved production data only |
| Forbidden data | secrets, unapproved regulated data, full DB/data-room prompts |
| Required tests | all controlled-pilot tests plus quotas/cost/incident drills |
| Rollback criteria | P0/P1 security/truthfulness event, cost abuse, provider issue |
| Stop conditions | missing audit, missing kill switch, missing human-review labels |

---

## Global Rollout Rule

Each phase must be explicitly authorized. Passing one phase does not authorize broader data classes, broader customers, autonomous actions, or source-of-truth changes.
