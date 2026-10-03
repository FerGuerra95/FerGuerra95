# CEO's OS — Test Strategy and Validation Foundation

**Baseline:** 17 September 2026 · forensic HEAD `43e470f630b8b2b79cc5241aeac6279492108081` plus the dirty/untracked audit manifest. This document specifies future validation; it does not change or execute tests.

This is the Level 2 canonical validation and acceptance authority. It remains subordinate to the [Master Control](../product/CEO_OS_MASTER_CONTROL_BASELINE.md) for active phase/status; Golden and Logic Integrity documents remain protected specialized authorities.

## Observed inventory and current evidence

VERIFIED FACT: 105 unit files (97 `.test.js`, 8 `.test.jsx`), 21 integration files, 22 nested E2E specs plus one helper, and six root E2E specs: 155 files total. Inventory is not executed coverage.

Astra did not run unit, integration or E2E suites. Existing “passed” artifacts and older documentation results lack sufficient current-source/build/database provenance. **Historical PASS output is not current validation.** The existing JS bundle budget was checked read-only; it does not establish functional, security, CSS or build correctness.

## A26 — discovery and placeholders VERIFIED CLOSED

Current status: Vite discovers `tests/unit/**/*.test.{js,jsx}` and `tests/integration/**/*.test.{js,jsx}`. The three named integration suites below no longer use `expect(true).toBe(true)`. Closure evidence is the isolated Vitest run of those suites. The list that follows is the historical defect, not a live exclusion.

`vite.config.js` includes only `tests/unit/**/*.test.js` and `tests/integration/**/*.test.js`. Eight JSX suites are currently excluded:

- `tests/unit/funding/FundingExecutiveWidget.test.jsx`
- `tests/unit/reporting/BoardReviewSnapshotActions.test.jsx`
- `tests/unit/reporting/BoardReviewSnapshotList.test.jsx`
- `tests/unit/reporting/BoardReviewStatusBadge.test.jsx`
- `tests/unit/reporting/BoardReviewWorkflowPanel.test.jsx`
- `tests/unit/reporting/ReportHeader.test.jsx`
- `tests/unit/risk/riskReportPanel.test.jsx`
- `tests/unit/risk/riskUiAlignment.test.jsx`

Three integration suites contain placeholder `expect(true).toBe(true)` assertions:

- `tests/integration/api/maApi.test.js`
- `tests/integration/api/complianceApi.test.js`
- `tests/integration/services/complianceReportsApi.test.js`

Future closure must prove discovery of all intended JS/JSX suites and replace placeholders with meaningful API/service assertions. Existing service tests in the same domains remain useful; these gaps do not mean there are no real integration tests.

## Unit and business-oracle strategy

Exercise production functions and their composed consumers, including null, zero, negative, empty, locale and currency cases. Avoid a test-only mirror that repeats implementation mistakes. Test output contracts and invariants, not merely rendering or `Number.isFinite`.

Golden authority is `golden_inputs.json`, [Golden Dataset documentation](GOLDEN_DATASETS.md), [Formula Registry](FORMULA_REGISTRY.md) and [Logic Integrity Protocol](LOGIC_INTEGRITY_PROTOCOL.md). Fourteen dataset IDs were observed across M&A, Funding, Compliance, PMI, Bridge, Risk, Reporting and Executive. Governance, Strategy and Heritage lack corresponding approved Golden coverage; full composed product oracles remain A29.

Simple M&A EV/equity/waterfall Golden formulas are not the full adjusted valuation engine. Bridge operational priority and Risk operational score intentionally differ from their Golden benchmarks. Reporting generic variance remains an oracle, not a universal module metric. A metadata registry assertion permitting “pending” does not validate business output.

Future expected outputs must be manually calculated and business-reviewed for the actual production contract, then trace input → calculation → persistence → reload → UI/report. No expected-value, fixture, tolerance or Golden change may be used to hide a defect.

Priority counterexamples: invalid DCF null (A16), low/base EV ordering (A17), mixed currency (A20), Funding null dilution (A21), PMI numerator/denominator source pairing (A22), empty Heritage (A23), Executive authority/fallback and review flag (A24/A25).

## Integration strategy

Use real routers/services with isolated SQLite and filesystem roots. Assert tenant boundaries, permissions, privileged transitions, validation errors, actor attribution, persistence acknowledgement and durable audit failure behavior. Cover both fresh schema and upgrades from a controlled prior schema (A28). Never use a production/customer database copy.

For A01, create synthetic files for two isolated tenants and verify that an organization cannot reference the other's physical storage object even when its key is known. For A02, cover generic create/update plus dedicated approve; UI hiding alone is insufficient.

A01 closure evidence, independently verified and re-run after merge: isolated synthetic tenant and document fixtures; a cross-tenant negative read; a same-tenant wrong-document negative read; a forged storage reference; an organization-binding regression that fails when only organization-directory binding is removed; mutation sensitivity for document binding, client-storage rejection and validator rejection; A27 isolated DB and VDR; post-merge A01 regression 8/8. Product commit `46932c22021be9c0baedd4754c108f6d74411225`. That evidence closes physical VDR file ownership binding only.

A02 closure evidence, independently verified and re-run after merge: the clean-baseline bypass was reproduced before the fix; a service-level direct-call guard; validator-level rejection of forbidden status writes; negative create and update privileged transitions; the `under_review` to `draft` request-changes edge; a dedicated approval positive path that writes `approvedAt`, `lockedAt`, history and the audit action; permission separation under `APPROVE_GOVERNANCE_DECISION`; tenant isolation; Board Pack and PMI/Ecosystem fixtures migrated to the canonical workflow; mutation sensitivity; A27 temporary DB and VDR; post-merge A02 focused 13/13 and combined 37/37, with build PASS. Product commit `cbc97d692021b5f03ce2549524bae46eaa76b5e4`. That evidence closes the generic Governance decision workflow-transition bypass only.

A03 closure evidence, independently verified and re-run after merge: the clean baseline failed 3 and passed 1 before the fix. The normal product server startup path was exercised in a child process with a synthetic temporary `.env`, a temporary DB and VDR, and an ephemeral port that was never 4000. HMAC signing matched the dotenv AUTH_SECRET. Production health matched dotenv `NODE_ENV`. The login limiter matched dotenv `CEOS_E2E`. Pre-existing `process.env` precedence was preserved. Supported product entrypoints were audited independently and all enter through `backend/server.js`. Reviewer verdict: VERIFIED. Post-merge focused 4/4, regression 36/36, A27 isolation PASS, and build PASS. Product commit `46348857294d41a1c1feb995d9c65032f08bf1ed`. That evidence closes deterministic environment bootstrap ordering for supported product runtime startup only.

A-MULTI-02A orchestration-core evidence, re-run on local main after fast-forward: `tests/unit/agents/aMulti02aOrchestrationCore.test.js` 29/29, governance regression 9/9, `npm run agents:orchestrate -- --help` exit 0, and `npm run build` PASS. Infrastructure commit `4b2b9907829b37d80daf6b8ffd73614582d224ce`. That evidence supports the orchestration-control core only. It is manually executed and reported. It is not trusted machine-generated evidence, Git/test/build attestation, or candidate-SHA binding. Those remain A-MULTI-02B, which is not started. Green tests alone do not close high-risk infrastructure. P0/P1 security, architecture, Source of Truth, Golden, persistence, multi-agent infrastructure and production-sensitive work still require design preflight, design freeze, independent adversarial review and a human merge gate. The next product finding remains A04.

## A27 — DB, VDR and fixture isolation VERIFIED CLOSED

The E2E harness allocates unique run-owned DB, VDR and port resources, rejects canonical paths and port 4000, requires an explicit API target and verifies canonical DB/WAL/SHM and VDR snapshots before cleanup.

Verified harness contract:

1. Allocate unique per-run DB and VDR directories under an explicitly controlled temporary test root; set all relevant paths before app/storage imports.
2. Resolve absolute paths and reject canonical/default DB/VDR locations, user directories outside the test root, production hosts and accidental reuse of the canonical server.
3. Use a dedicated process/port and synthetic tenant/user fixtures; do not point mutating suites at the existing canonical `127.0.0.1:4000` database.
4. Refuse execution if isolation cannot be proven. Record safe path metadata and run identity, never credentials/tokens.
5. Track created IDs and tenant ownership. Archive is not physical cleanup: M&A case “delete” now archives; repeated fixtures by name can accumulate.
6. Dispose only the verified run-owned root after closing DB/process handles. No broad deletion or cross-shell computed-path cleanup.
7. Assert canonical DB/WAL/VDR hashes or equivalent guarded invariants remain unchanged.

Phase-1 evidence, independently re-reviewed on 2 October 2026: focused unit and isolation tests passed 15/15; one independent full `npm run test:e2e` passed 26/26; four post-fix full suites passed in total. The backend survived, teardown removed the run-owned root, and the canonical DB digest was unchanged. Negative checks abort a missing target, Render, any other external host, port 4000, the canonical database and the canonical VDR. Pages on 5173 and 5174 resolve to same-origin `/api`. Residual P2 fixture collisions and the unrendered `commandCalendar` do not reopen A27. The earlier seven stale Command Center heading assertions were reconciled to the rendered surface and are not an isolation defect.

Authenticated GETs can update session/access metadata; public secure-share resolution can audit access; Compliance hydration can POST data. “Read-only smoke” must be defined by actual side effects.

## E2E and visual strategy

Cover save/reload/error, stable case/deal IDs, lifecycle, share expiry/revocation, VDR upload/download, archive relationships, approvals, review workflow, role/tenant negatives and report values. A spec title mentioning export or navigation does not prove export or SPA continuity if it only visits URLs.

Preserve M&A black canvas, workspace accent, geometry and reference surfaces. Capture approved/computed-style evidence at 1440 and 1920 where applicable, plus responsive checks, after functional isolation is safe. Do not refresh snapshots to conceal regressions.

Canonical final production-build QA is port 4000, in an explicitly isolated/approved data environment. Development-harness port 5173 is not evidence for the served `dist` release.

## Run and build provenance

Every validation record must include: timestamp; exact commit and dirty/untracked manifest hashes; OS/Node/package-lock identity; command/suite discovery/skips/results; fixture version; isolated DB/VDR identity; migration/schema fingerprint; process/port; build command and asset hashes; source-to-served-dist mapping; errors and reviewer. Redact credentials and bearer/share tokens.

A HEAD SHA alone is insufficient while A30 is open. A passing existing artifact, source marker in a chunk, or root HTML equality is insufficient build provenance.

## Future release validation hierarchy

| Gate | Required evidence | Blocks next step |
|---|---|---|
| 0 — Baseline | Reviewed docs, accepted source manifest and explicit file scope | Unexplained source/provenance changes |
| 1 — Isolation/discovery | JS/JSX discovery, real integration assertions, DB/VDR guard and fixture lifecycle | Phase 1 PASSED. A01, A02 and A03 are VERIFIED CLOSED. Next product finding is A04. |
| 2 — Unit/oracles | Production-path regressions and approved business expected outputs | Unexplained mismatch; altered oracle to fit code |
| 3 — API/services | Negative security tests; durable audit; fresh/upgraded schema parity | Remaining open P1 failures. A01 physical-file binding, the A02 generic workflow-transition bypass, and A03 deterministic environment bootstrap ordering are VERIFIED CLOSED. |
| 4 — Product E2E | Roles, tenants, persistence, reports, archive/share lifecycle and failure states | Material workflow or truthfulness failure |
| 5 — Build/runtime | Known-source production build and served-dist proof on canonical QA port | Unknown source/build/schema |
| 6 — Operations/UAT | Restore including VDR, environment/monitoring evidence, human review and scoped UAT | Open release-blocking P0/P1 |

A26 and A27 are VERIFIED CLOSED with Phase 1. A29 remains with Phase 5 product/oracle work. See [roadmap](../roadmap.md).

## GOV-ASSURANCE-01 evidence obligations

Gate names, risk tiers, and the high-risk lifecycle are canonical in section 21 of the [Master Control](../product/CEO_OS_MASTER_CONTROL_BASELINE.md). Placement is in the [roadmap](../roadmap.md). This section states what evidence those gates require. Recording the obligation does not mark a gate passed. Phase 2 remains ACTIVE. A-MULTI-02B is not started, so evidence may still be partly manually executed and reported. Trusted machine-generated evidence is not claimed.

Risk changes the evidence burden. A low-risk local non-security change needs the focused regression that covers its contract. A medium-risk workflow or domain change needs the shared contracts and negative paths it can affect. High-risk work, including P0/P1 security, architecture, Source of Truth, Golden or business oracle, persistence, multi-agent infrastructure, production-sensitive change, AI authority, and tenant or customer-data access, needs the full lifecycle and no implementation before Design Freeze.

From Phase 2 onward, phase-closure evidence includes a lightweight Architecture Health record and a Security Regression record. Architecture Health evidence names any competing Source of Truth, semantic duplication, frontend/backend rule or contract divergence, ownership conflict, dependency-direction violation, new cycle, new god file or service, legacy path treated as authority, or accidental cross-module coupling found, or states that the check found none. Stylistic imperfection is not a failed check. Security Regression evidence shows that new endpoints, data paths, AI tools, reports, integrations, jobs, and import/export paths introduced by the phase do not bypass the Phase 2 customer and tenant baseline. A mini-UAT is required when the phase exposes a meaningful usable workflow, including negative paths for that workflow.

Phase 2 Client Security evidence, where the surface exists, covers authentication, authorization, tenant isolation, cross-tenant negative access, ID or reference tampering, direct API bypass, service-layer bypass, privileged workflow bypass, document and VDR isolation, secret handling, fail-closed behavior, and sensitive data in logs or telemetry. Later phases repeat Security Regression. They do not treat Phase 2 as the last security check.

Phase 3 recovery evidence includes an executed restore. A backup artifact alone is not recoverability evidence. The same evidence set covers swallowed persistence failures, transaction and partial-write behavior, audit-trail correctness, migration and rollback safety, schema compatibility, retention or deletion where relevant, test-data separation, and customer-data lifecycle.

Phase 5 business-correctness evidence keeps the business oracle or Golden truth independent of the implementation. A test generated only by copying the implementation is not oracle evidence. The same rule applies to financial calculations, valuation, metrics, business-state transitions, and frontend/backend calculation divergence.

The post-Phase-5 360° audit is an evidence package for the twenty areas named in Master Control section 21. It is not a substitute for the finding exit gates and it is not Phase 6.

Release evidence at Phase 13 must separate missing product scope from implementation defects, show full Security Regression, support human reviewability from canonical documents, and trace source SHA, lockfile identity, build, artifact, staging, and production release. That provenance chain is a future requirement. This document does not claim it already exists. A Release Candidate cannot leave security, tenant isolation, persistence, financial or business calculations, Source of Truth, AI authority, deployment provenance, or recovery classified only as unknown or not audited. Known limitations and known non-critical debt may remain. Unknown critical behavior must not be labeled verified.

The final Astra audit is two evidence passes. Pass A uses the Release Candidate SHA, repository, requirements, business oracles, and threat model, without previous verified conclusions as assumptions. Pass B then reconciles that reconstruction with machine evidence, tests, the Source of Truth registry, architecture documents, the security model, known limitations, and previous verified states. Each important domain uses one classification: verified by evidence, verified with limited scope, not verified, contradictory, or not audited / insufficient evidence. A general statement that everything looks good is not audit evidence.

A green build, a green suite, a finished-looking UI, or an agent verdict of verified is not release readiness. Data-lifecycle evidence, where the change touches it, covers classification, tenant ownership, sensitive data, retention, deletion, export, backup, restore, fixtures, logs, and production versus non-production separation. Supply-chain evidence covers dependency review, lockfile integrity, known vulnerabilities, unnecessary dependencies, install and build scripts, and runtime provenance. Neither evidence set is a SOC 2, ISO, or other regulatory certification.
