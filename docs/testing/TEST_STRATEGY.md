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
| 1 — Isolation/discovery | JS/JSX discovery, real integration assertions, DB/VDR guard and fixture lifecycle | Phase 1 PASSED. Next block is A01, not A26/A27. |
| 2 — Unit/oracles | Production-path regressions and approved business expected outputs | Unexplained mismatch; altered oracle to fit code |
| 3 — API/services | Negative security tests; durable audit; fresh/upgraded schema parity | A01 and scoped P1 failures |
| 4 — Product E2E | Roles, tenants, persistence, reports, archive/share lifecycle and failure states | Material workflow or truthfulness failure |
| 5 — Build/runtime | Known-source production build and served-dist proof on canonical QA port | Unknown source/build/schema |
| 6 — Operations/UAT | Restore including VDR, environment/monitoring evidence, human review and scoped UAT | Open release-blocking P0/P1 |

A26 and A27 are VERIFIED CLOSED with Phase 1. A29 remains with Phase 5 product/oracle work. See [roadmap](../roadmap.md).
