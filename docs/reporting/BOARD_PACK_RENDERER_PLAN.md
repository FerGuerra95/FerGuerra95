# C.17.0 - Board Pack Renderer Plan

**Status:** PLANNED / NOT IMPLEMENTED IN C.17.0

## 1. Executive Summary

CEO's OS needs a premium Reporting / Board Pack renderer that preserves DSS truthfulness while making executive material easier to review, export, and circulate internally. C.17.0 is planning only: no renderer, PDF generation, runtime code, UI, tests, package changes, AI runtime changes, or module behavior changes.

## 2. Product Goal

Create an executive-grade rendering path for Board Review Draft materials that can later support printable HTML and PDF-quality exports without presenting drafts as certified, legal, investment, compliance, or formally approved board material.

## 3. What This Renderer Is

- A presentation layer for tenant-scoped Reporting, Executive Overview, and module summary signals.
- A Board Review Draft renderer for internal executive preparation.
- A future export surface with explicit status, version, source, limitation, and review metadata.
- A truthfulness-preserving bridge between DSS data and human-reviewed board preparation.

## 4. What This Renderer Is Not

- Not a source-of-truth for scores, formulas, module state, or compliance posture.
- Not a certified PDF generator.
- Not legal advice, investment advice, a fairness opinion, or compliance certification.
- Not an autonomous AI report writer.
- Not a formal approval mechanism.
- Not a public marketplace or external filing workflow.

## 5. Target Users

- CEO / executive sponsor preparing board review material.
- CFO / strategy owner reviewing financial and funding narrative.
- Compliance / risk owner validating limitations and missing evidence.
- Governance owner confirming review status and circulation readiness.
- Operating team members preparing supporting DSS evidence.

## 6. Report Types

Initial renderer scope should focus on:

1. Board Review Draft pack.
2. Executive summary appendix.
3. Module signal appendix.
4. Missing-data / insufficient-data appendix.
5. Human review checklist.

Out of scope for first implementation: certified PDF reports, filed board minutes, external investor memoranda, legal reports, compliance certificates, public marketplace reports, and autonomous AI-generated packs.

## 7. Data Sources

Renderer inputs must come from already tenant-scoped DSS data:

- Reporting board pack metadata and sections.
- Executive Overview module signals.
- Module-owned summaries from M&A, Compliance, Funding, Governance, PMI, Risk, Strategy, Bridge, and Heritage only when explicitly included by approved services.
- AI Board Review Draft text only as draft narrative and never as source-of-truth.
- Human review metadata when a reviewer explicitly records it.

## 8. Source-of-Truth Boundaries

- Module services and persisted module records remain authoritative for module data.
- Formula Registry and Golden Datasets remain engineering oracles, not customer-facing facts.
- Renderer snapshots preserve what was shown at export time; they do not recalculate business values.
- Rendered labels must distinguish real values, missing values, insufficient data, draft text, and reviewed metadata.

## 9. AI Boundaries

- AI may feed draft narrative only when clearly labeled.
- AI cannot set `reviewed`, `internal_final`, or any approval status.
- AI cannot calculate scores, fill missing data, certify posture, approve reports, or make recommendations as legal/investment advice.
- Renderer must preserve AI labels and human-review warnings.

## 10. Export Lifecycle

Recommended lifecycle:

1. `draft` - editable working material.
2. `ai_draft` - draft narrative includes AI-generated text.
3. `human_review_required` - requires named reviewer action before circulation.
4. `reviewed` - human reviewer has confirmed review metadata.
5. `internal_final` - explicitly confirmed internal final for the tenant workflow.
6. `archived` - retained for record.
7. `revoked` - no longer available for circulation or secure share.

## 11. Draft / Review / Internal-Final States

`Board Review Draft` means internal preparation material requiring human review. `Reviewed` requires a human action and audit metadata. `Internal final` means a tenant-internal confirmation, not board approval, certification, legal advice, investment advice, or external filing readiness.

## 12. Audit Requirements

Every future export should record safe metadata:

- report id, organization id, actor id;
- export timestamp and version;
- status at export time;
- source modules and data freshness;
- human reviewer when present;
- AI used yes/no and prompt version when present;
- limitations and insufficient-data flags.

No raw secrets, tokens, cookies, auth headers, session ids, API keys, or full sensitive prompt payloads.

## 13. Security Requirements

- Tenant scope must come from backend session/auth, not client-provided ownership.
- Secure share must preserve status labels and never expose draft as approved material.
- Revoked shares must remain unavailable.
- Export metadata must avoid secrets and excessive PII.
- External PDF services are out of scope; no data leaves the app for rendering.

## 14. UX Requirements

- A4-ready printable layout.
- Premium executive hierarchy with clear cover, classification, status, and review metadata.
- Page-break safe sections.
- No cut-off cards, undefined values, `NaN`, `Infinity`, fake scores, or hidden missing-data states.
- Required labels visible on every export: Board Review Draft, Human Review Required, Based on DSS Signals, Not Legal Advice, Not Investment Advice, Not Board Approved, Confidential.

## 15. Future Implementation Phases

1. C.17.1 - HTML Board Review Draft Renderer.
2. C.17.2 - Export audit and snapshot persistence.
3. C.17.3 - Print/PDF quality hardening.
4. C.17.4 - Secure share integration with status preservation.

## Conclusion

Renderer status: **PLANNED / NOT IMPLEMENTED IN C.17.0**

Recommended first implementation: **C.17.1 - HTML Board Review Draft Renderer**

Why HTML first:

- A4-ready browser export.
- Safer than binary PDF generation at first.
- Easier to test.
- Compatible with existing report/export patterns.
- No new package/dependency required initially.

## C.17.1 Implementation Status

**Status:** HTML BOARD REVIEW DRAFT RENDERER FOUNDATION IMPLEMENTED / NO PDF BINARY / NO ROUTE INTEGRATION.

C.17.1 adds a shared report header, footer, section component, sanitizers, labels, a printable HTML builder, and a React renderer foundation under `src/modules/reporting/**`.

Runtime posture:

- No binary PDF generation.
- No new dependency.
- No route or page integration.
- No backend change.
- No AI runtime change.
- Renderer remains a display layer, not source-of-truth.

The first foundation includes a shared CEO's OS logo/header so future reports do not paste logo markup individually.

## C.17.2 Integration Status

**Status:** REPORTING PREVIEW INTEGRATION IMPLEMENTED / NO BINARY PDF / NO BACKEND.

C.17.2 integrates the Board Review Draft HTML renderer into the Reporting / Board Packs preview flow. The integration uses a frontend-only adapter and window helper to open a printable HTML preview from an existing board pack or report snapshot.

Runtime posture:

- No backend, API, database, router, or AI runtime change.
- No PDF dependency, `jsPDF`, binary PDF generation, or external rendering service.
- No provider traffic and no customer data leaves the browser for rendering.
- Preview remains a display layer only and does not mutate persisted records.
- If no board pack or report snapshot exists, the UI shows a safe snapshot-required state.

Truthfulness posture:

- Board Review Draft, Confidential, Human Review Required, Based on DSS Signals, Not Legal Advice, Not Investment Advice, and Not Board Approved labels remain visible.
- Missing scores remain `N/A` or `insufficient_data`, not fake `0`.
- The preview does not create reviewed, internal-final, board-approved, certified, legal, investment, or compliance-certification output.

## C.17.3 Snapshot / Versioning Status

**Status:** FRONTEND SNAPSHOT METADATA FOUNDATION IMPLEMENTED / NO BACKEND PERSISTENCE.

C.17.3 extends the preview flow so Board Review Draft HTML previews can carry local snapshot, version, status, and audit metadata. This prepares future export/PDF work without adding persistence or final-report semantics.

Current scope:

- Frontend-only snapshot object.
- Safe audit metadata for preview display.
- Version metadata for `draft`, `ai_draft`, `human_review_required`, `reviewed`, `internal_final`, `archived`, and `revoked`.
- Review/final states gated by explicit human metadata.
- Snapshot and renderer remain display/export metadata only, not source-of-truth.

## C.17.4 Reviewed / Internal-Final Workflow Status

**Status:** FRONTEND WORKFLOW FOUNDATION IMPLEMENTED / NO BACKEND PERSISTENCE.

Reporting / Board Packs preview now displays review workflow state, human-review checklist posture, missing-data flags, limitations, and audit metadata in a preview-only panel.

Current scope:

- Visual status badge for Board Review Draft workflow states.
- Preview-only workflow panel.
- Disabled actions with backend-persistence requirement labels.
- Internal-final eligibility helper for future persistence phase.
- No saved/persisted claim and no formal approval claim.

## C.17.5 Backend Persistence Planning Status

**Status:** BACKEND PLAN ONLY / NO RUNTIME IMPLEMENTATION.

C.17.5 defines the future backend persistence architecture for Board Review Draft snapshots and workflow states. It does not implement backend services, routes, migrations, DB persistence, PDF export, secure share, or AI runtime.

Next backend phase: **C.17.6 - Backend persistence implementation for Board Review Draft snapshots**.

## C.17.6 Backend Persistence Status

**Status:** BACKEND PERSISTENCE FOUNDATION IMPLEMENTED / NO FRONTEND PERSISTED-SNAPSHOT INTEGRATION YET.

C.17.6 adds tenant-scoped backend persistence for Board Review Draft snapshots and workflow audit events. Reporting now has protected backend endpoints for snapshot create/list/read and reviewed/internal-final/archive/revoke transitions.

Current boundaries:

- No binary PDF generation.
- No public secure share.
- No AI runtime/provider traffic.
- No board-approved or certified output.
- Frontend preview integration with the persisted endpoints remains a future phase.

Next recommended phase: **C.17.7 - Frontend integration with persisted Board Review snapshots**.

## C.17.7 Persisted Snapshot Integration Status

**Status:** FRONTEND-TO-BACKEND SNAPSHOT LOOP IMPLEMENTED / NO BINARY PDF.

C.17.7 completes the first Reporting / Board Packs loop for persisted Board Review Draft snapshots:

- create persisted snapshot;
- list persisted snapshots;
- open persisted snapshot preview;
- show persisted workflow status;
- call backend workflow actions for reviewed/internal-final/archive/revoke.

The renderer still displays Board Review Draft material only. It does not generate PDF, certify output, create public share access, or claim board approval.
