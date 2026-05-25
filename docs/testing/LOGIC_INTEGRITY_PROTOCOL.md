# CEO's OS / The Sovereign OS — Logic Integrity Protocol
## Purpose
This protocol defines how CEO's OS audits business logic, calculations, legacy functions, duplicate sources of truth, Golden Datasets and test oracles.
The goal is to reduce AI-generated code risk and make every critical calculation explainable, testable and auditable.

## AI Operating Modes (C.14.0)

Every audit or fix phase must declare one primary mode. See `docs/ai/AI_OPERATING_MODEL.md` for full definitions.

| Mode | Writes allowed | Stop on debt found |
|---|---|---|
| READ-ONLY AUDIT | No | No — classify P0–P3 and continue |
| WRITE/FIX | Yes (whitelist) | Yes when fix blocked |
| PROPOSE ONLY | No | No — proposal only |
| QUARANTINE BEFORE DELETE | No (mark only) | No — document candidates |

**READ-ONLY AUDIT** must deliver whitelist/blacklist for a future phase without stopping for cross-imports, duplicates, legacy, or Pending documentation.

**WRITE/FIX** keeps strict stop conditions: whitelist, tests/build, no `git add .`, no unauthorized Golden/backend changes.

**PROPOSE ONLY** and **QUARANTINE BEFORE DELETE** must not delete or modify product code without a later authorized WRITE/FIX phase.

## Modular Sandbox Audit Order (C.14)

Do not start with a whole-repo audit unless explicitly global.

1. Specific module
2. Limited shared code
3. Related backend
4. Related tests
5. Related docs
6. Cross-cutting review only when authorized

## Logs / SQLite Inspection Policy

Do not permanently index `*.sqlite`, `*.db`, `*.log`, `backend-server.err`, `.env`, or secrets.

Controlled inspection via human-directed sanitized commands is allowed. Never paste secrets into context or commits.

Do not classify backend functions as dead without checking routes, services, tests, migrations, and dynamic references.

## Documentation Reconciliation Pass

When code/tests/source-of-truth change, update only affected documents.

Allowed status labels include: CONFIRMED, IMPLEMENTED AND TESTED, PARTIALLY RESOLVED, PENDING VALIDATION, PENDING HUMAN APPROVAL, PENDING EXTERNAL VALIDATION, DEPRECATED, DO NOT USE, UNKNOWN / NOT AUDITED.

Do not mark RESOLVED global for partial fixes. Phase closure must state what changed, what was verified, what remains pending, and which docs intentionally did not change.

## Core principle
A module is not safe just because:
- it compiles
- tests pass
- pages render
- no NaN is visible
- smoke tests pass
A module becomes safer when:
- inputs are known
- formulas are documented
- outputs are expected
- source-of-truth is clear
- tests validate business results
- demo/fallback data is labelled
- human review boundaries are explicit
## Required audit table
Every logic integrity audit must include:
| Metric / function | File | Inputs | Output | Formula / logic | Source-of-truth | Frontend/backend | Golden Dataset | Test real | Legacy/duplicated | Risk | Tutor explanation |
|---|---|---|---|---|---|---|---|---|---|---|---|
## No Legacy / No Duplicates
Before creating or modifying a function, service, endpoint, component, store or helper, verify:
- Does current functionality already exist?
- Is there a legacy version still imported?
- Is there a duplicate frontend/backend calculation?
- Is localStorage competing with backend?
- Is there a dead page or endpoint?
- Is there a placeholder test?
- Is there a demo/default value contaminating real output?
## Scope Lock
Before touching anything, define:
- files allowed
- files forbidden
- modules in scope
- modules out of scope
If the task requires touching forbidden files, stop and request explicit approval.
## Source-of-Truth Lock
Every business value must have one official source-of-truth.
If two sources disagree, mark P1 or P0 depending on impact.
## Multi-tenant Gate
Every business data read/write/update/delete must be scoped by backend-injected organizationId.
Frontend must never decide organization ownership.
## Migration Safety
Never edit already-applied migrations without explicit approval.
Destructive schema/data changes require explicit approval and backup/restore awareness.
## Secrets Guard
Never expose secrets, tokens, passwords, private keys, production .env values or customer data.
## Demo/Fallback Guard
Demo, fallback, seed, mock or localStorage recovery must be labelled or gated.
Demo/fallback data must not appear as real enterprise data.
## Draft vs Persisted Data Separation (Decision C.13.3G)

Funding and any module with client draft + backend persistence must follow these rules:

1. **UI must not present localStorage draft metrics as enterprise persisted data.**
   - Draft inputs, scenario modelling, readiness workspace and export memos are **scenario/DSS workspace** outputs unless explicitly saved via backend API (e.g. funding round, funding snapshot).

2. **Dashboards mixing draft and backend data must label the source** on each metric group or section.
   - Example: Funding — hero/multinational panels = draft workspace; round history and summary KPIs = persisted backend.
   - Unlabelled mixing is a **P1 product truthfulness** defect — **addressed on Funding dashboard** (C.13.3H); C13-P1-03 **PARTIALLY RESOLVED** (optional e2e/runtime checks remain).

3. **Legacy localStorage migration must not remain reusable across organizations after migration.**
   - Global keys (e.g. `funding_workspace_draft_v1`, `funding_workspace_settings_v1`) must migrate once to org-scoped key and be **consumed/removed** (C.13.3J).
   - Client-side `organizationId` in localStorage is metadata only, not authority.
   - Backend `req.organizationId` remains the enterprise security and persistence boundary.
   - Covered by `tests/unit/funding/fundingStore.test.js` (C.13.3I/J).

4. **Backend `organizationId` remains the security and source-of-truth boundary** for persisted enterprise data.
   - All reads/writes on `funding_rounds`, `funding_snapshots`, and summary must be server-scoped.

5. **Client-side `organizationId` in localStorage is metadata only, not authority.**
   - Frontend must not decide tenant ownership; Auth/session supplies org for API; localStorage org id is for key namespacing and traceability only.

6. **Any formula calculated on draft data must be labelled as scenario/draft** where user-facing.
   - Golden Dataset oracles apply to canonical formulas; draft workspace outputs are not automatic substitutes for persisted round/summary values.

7. **Bridge/executive resilient fallbacks** (e.g. summary empty → hub `latestSnapshot`) must not be shown as equivalent to official round history without labelling.

Applies first to **Funding** (`fundingStore.jsx`, `FundingDashboardPage`, `fundingEnterpriseApi`). Extend same pattern to other modules with localStorage vs API duplication during C.13.x.

## Valuation Formulas and Persisted Snapshots (Decision C.13.4B — M&A)

For M&A and any module with live valuation engines plus backend snapshots:

1. **Live calculation SoT must be explicit.**
   - M&A live SoT = frontend `useValuationEngine` (current product).
   - Backend SQLite snapshots = **persisted historical record**, not automatic recalculation SoT.

2. **Simple benchmark formulas must not be presented as equivalent to adjusted DSS product formulas.**
   - Golden `EV_EBITDA`, `EQUITY_VALUE`, `WATERFALL_SIMPLE` = simple benchmarks.
   - Product `adjustedEnterpriseValue`, `adjustedEquityValue`, `MA_PRODUCT_WATERFALL` = separate DSS metrics.

3. **Reports and exports must indicate source when relevant:**
   - live engine derived values vs stored snapshot payload (UI labels C.13.4E; policy C.13.4G).

4. **No valuation output is a fairness opinion, certified valuation, or investment advice.**
   - Buyer matching fit scores are DSS heuristics, not certified matching.

5. **Golden tests (C.13.4C) validate simple benchmarks first; product gaps documented before code fix.**

6. **Report alignment (C.13.4F/H):** `maProductReportAlignment.test.js` anchors live engine → `formatMAReportData` parity for adjusted metrics when derived is complete; missing `netProceeds` must not fallback to `equityBase` (C.13.4H).

## M&A live vs snapshot report policy (Decision C.13.4G — updated C.13.4I)

1. **Live exports** must use live engine derived values (`useValuationEngine` output passed to `formatMAReportData`).
2. **Saved / re-export flows** must preserve saved snapshot values captured at save or export time.
3. **Silent merge** between live engine and saved snapshot is **prohibited** unless a field-by-field fallback is explicitly documented.
4. **Missing terminal proceeds (C.13.4H):** if `derived.netProceeds` and `derived.sellerProceeds` are absent or non-finite, `formatMAReportData` sets `summary.netProceeds = null` and `summary.netProceedsSource = 'missing'`. **No silent fallback to `equityBase`.**
5. **Reports** must maintain DSS / not fairness opinion disclaimers (unit-tested in C.13.4F).

## No silent terminal-value fallback (Decision C.13.4H/I)

Terminal outputs such as **netProceeds** must not silently fallback to intermediate valuation metrics such as **equityBase**.

1. If a terminal value is missing or non-finite, the report must mark it **missing / unavailable** (`null` + source flag).
2. Intermediate values (e.g. adjusted equity) may remain available as **separate fields** — they must not substitute for terminal proceeds without explicit label.
3. Product truthfulness requires **source/fallback flags** when values are missing (`netProceedsSource: 'derived' | 'missing'`).
4. Do not present equity bridge values as estimated net proceeds in reports or exports.
5. Applies first to M&A report/export (`formatMAReportData`); extend same pattern to other modules with terminal vs intermediate metric confusion during C.13.x.

## Marketplace / transaction layer truthfulness (Decision C.13.5B)

1. **Internal/unlisted marketplace surfaces** must clearly state if they are demo, future private-network preview, or not a public marketplace.
2. **Success fee, transaction layer, buyer/seller/funding matching** must not be presented as active unless contracts, legal, permissions, billing and compliance are implemented in product.
3. **Demo fallback data** must be labelled and must not be presented as enterprise persisted marketplace or verified live network participants.
4. **Heuristic marketplace matching** must be labelled DSS heuristic — not certified recommendation; not investment or financing advice; no financing intermediation.
5. **Public marketplace activation** requires explicit future phase, legal/trust review, and registry update — not implied by route existence alone.

## Bridge priority dual-layer truthfulness (Decision C.13.5E — Option C)

Bridge signal priority uses **two separate models** by design:

1. **`bridgePriorityGolden`** — Golden/oracle benchmark only.
   - Formula: `impact * 0.5 + urgency * 0.3 + confidence * 0.2`.
   - Golden ID: `bridge_priority_score_basic` (expected **73** for sample inputs).
   - Reference implementation: `calculateBridgePriorityGolden()` (`bridgeGoldenFormulas.js`, C.13.5D).
   - Use: validation, logic integrity audit, CI oracle — **not** operational product ordering unless future phase explicitly authorizes alignment.

2. **`operationalSignalPriority`** — Product DSS heuristic (implemented as `calculateSignalPriority()`).
   - Uses severity/confidence/blocking/stale heuristics — **not** Golden impact/urgency weights.
   - Use: attention queue, signal ordering, cross-module bridge heuristics.
   - Must be labelled **operational DSS signal** — not certified prioritization, not Golden oracle, not autonomous decision output.

3. **Do not conflate layers** in UI, exports, docs or executive narrative:
   - Do not present operational priority scores as Golden-validated or formula-certified.
   - Do not imply Golden benchmark governs live attention-queue ordering without explicit product decision.

4. **C13-P1-07** remains **PARTIALLY RESOLVED** — dual-layer separated and both layers unit-tested (Golden C.13.5D, operational C.13.5F); product formula unchanged; no global RESOLVED.

5. **Next controlled phase:** optional C.13.5G — extract pure operational helper mirror if product refactor authorized; or product→Golden alignment only if separately authorized (Option B).

6. **Operational heuristic tests (C.13.5F):** `tests/unit/bridge/bridgeOperationalPriority.test.js` locks current `calculateSignalPriority` behavior without changing product code. Tests document conceptual name `operationalSignalPriority` and verify divergence from `bridgePriorityGolden`.

## Risk enterprise dual-layer truthfulness (Decision C.13.6B — Option C)

Risk Enterprise item scoring uses **two separate models** by design:

1. **`riskLikelihoodImpactGolden`** — Golden/oracle benchmark only.
   - Formula: `likelihood × impact` (scale 1–5).
   - Golden ID: `risk_score_likelihood_impact_basic` (expected **20** for L=4, I=5; severity **critical** for band 16–25).
   - Reference implementation: `calculateRiskLikelihoodImpactGolden()` (`riskGoldenFormulas.js`, C.13.6C).
   - Use: validation, logic integrity audit, CI oracle — **not** operational dashboard/residual KPI unless future phase explicitly authorizes alignment.

2. **`operationalEnterpriseRiskScore`** — Product DSS heuristic (implemented as internal `riskScoreFrom()` in `risk.service.js`).
   - Uses categorical inherent/residual severity + normalized likelihood/impact → 0–100 — **not** Golden L×I alone.
   - Feeds `calculateRiskMetrics`, readiness, posture, bridge signals, backend `buildHeatmap` scores.
   - Must be labelled **operational DSS signal** — not certified risk score, not Golden oracle, not insurance/regulatory certification.

3. **Do not conflate layers** in UI, exports, docs or executive narrative:
   - Do not present residual risk KPI or readiness scores as Golden-validated L×I.
   - Do not imply Golden benchmark governs live portfolio posture without explicit product decision.
   - Heatmap UI prefers backend-enriched `dashboard.heatmap` when present; shows L×I distribution reference and operational residual max per cell (C.13.6E). Does not compute `riskScoreFrom` on the client.

4. **C13-P1-08** **RESOLVED / DUAL-LAYER RISK MODEL CLOSED** — dual-layer separated, both layers unit-tested (Golden C.13.6C, operational C.13.6D), UI aligned (C.13.6E), report/export truthfulness verified (C.13.6F). Intentional divergence documented; not a product defect.

5. **Next controlled phases:**
   - **C.13.7** — PMI Logic Integrity / Synergy Formula Audit READ ONLY.
   - Product→Golden alignment (Option B) only if separately authorized.

6. **Operational heuristic tests (C.13.6D):** `tests/unit/risk/riskOperationalScore.test.js` locks current `riskScoreFrom` behavior. Tests document conceptual name `operationalEnterpriseRiskScore` and verify divergence from `riskLikelihoodImpactGolden`.

7. **Report/export truthfulness (C.13.6F):** Risk reports are metadata exports (`POST /risk/reports`) with operational summary payload — no PDF/HTML renderer. UI (`RiskReportsPanel`) and export payload (`scoringTruthfulness`, enhanced `boardReadyMemo.disclaimer`) label operational DSS scoring separately from Golden L×I benchmark. Unit tests: `riskReportTruthfulness.test.js`, `riskReportPanel.test.jsx`.

8. **C13-P1-08 status:** **RESOLVED / DUAL-LAYER RISK MODEL CLOSED** — decision documented (C.13.6B); Golden + operational tests (C.13.6C/D); UI alignment (C.13.6E); report/export truthfulness (C.13.6F). Dual-layer score divergence is intentional (Option C), not an open P1 defect.

9. **Separate risk domains:** M&A deal quality scoring, Compliance supplier risk, PMI integration risks, and Strategy strategic risks are **outside** this dual-layer model unless explicitly mapped in a future registry update.

## PMI multi-layer truthfulness (Decision C.13.7B — Option C)

PMI calculations are separated into multiple layers. Do not collapse them into one "capture rate" claim.

1. **Golden benchmark (`pmiCaptureRateGolden`)**
   - Formula: `captureRate = capturedSynergy / forecastSynergy`.
   - Zero denominator rule: if `forecastSynergy <= 0`, result is `null` / not meaningful.
   - Golden IDs: `pmi_synergy_capture_rate_basic`, `pmi_synergy_zero_forecast`.
   - Role: oracle / Formula Approval benchmark only.

2. **Operational capture layers (DSS)**
   - Case capture may use `synergyCaptured / synergyTarget`.
   - Ledger capture may use `Σcaptured / Σforecast`.
   - Enterprise initiatives may use `capturedValue / targetValue` with fallback paths.
   - These are operational DSS metrics and must be labelled as such.
   - They must not be presented as Golden-certified capture unless denominators are aligned by explicit approved phase.

3. **Operational readiness/integration health**
   - `pmiReadinessScore`, `integrationReadinessScore`, `integrationScore` are composite heuristics.
   - They are not `PMI_CAPTURE_RATE`.
   - They are not certified readiness ratings.
   - `pmi_integration_health` remains future/pending until dedicated phase.

4. **Demo/template/fallback guard**
   - `DEMO_PMI_CASE` / `mergeWithDemo` are template/fallback layers, not enterprise truth.
   - Demo/template values must not be promoted to executive truth without explicit labeling/gating.

5. **CEO/Hub exposure guard**
   - CEO/Hub PMI signals must distinguish:
     - persisted operational data,
     - DSS heuristic outputs,
     - demo/template/fallback/default states.
   - Avoid presenting demo/fallback maturity as real operational progress.

6. **No silent product→Golden alignment**
   - Do not align operational product formulas to Golden capture without explicit human-approved phase.
   - First lock Golden helper/tests, then evaluate product alignment separately.

7. **Test order requirement**
   - Golden helper/tests must exist before any PMI product formula changes.
   - Operational tests must verify current DSS behavior separately from Golden benchmark tests.

**PMI status after C.13.7B:** **MISMATCH CONFIRMED / SOT DECISION DOCUMENTED** (not approved, not globally resolved).

## PMI Golden benchmark tests (C.13.7C)

1. **Helper:** `backend/services/pmi/pmiGoldenFormulas.js` — `calculatePmiCaptureRateGolden` / `pmiCaptureRateGolden`.
2. **Formula:** `captureRateDecimal = capturedSynergy / forecastSynergy`; `captureRatePercent = captureRateDecimal * 100`.
3. **Zero/invalid denominator:** if `forecastSynergy <= 0` or inputs non-finite → `captureRateDecimal` / `captureRatePercent` = `null` (not `0%`).
4. **Golden IDs covered:** `pmi_synergy_capture_rate_basic`, `pmi_synergy_zero_forecast`.
5. **Tests:** `tests/unit/pmi/pmiGoldenFormulas.test.js` — oracle against `docs/testing/golden_inputs.json`; dual-layer test confirms Golden ignores `synergyTarget` as forecast.
6. **Product untouched:** no changes to `pmi.service.js`, PMI UI, `mergeWithDemo`, CEO/Hub, or operational formulas.

**C13-P1-10 status (C.13.7C):** **PARTIALLY RESOLVED / GOLDEN ZERO FORECAST TESTED** — Golden layer only; product zero-forecast may still return `0%` until C.13.7D+.

**C13-P1-11 status (C.13.7C):** **PARTIALLY RESOLVED / GOLDEN CAPTURE SEPARATED** — Golden uses forecast; operational case uses target; documented in tests.

**C13-P1-12 status (C.13.7C):** **PARTIALLY RESOLVED / GOLDEN HELPER TESTED** — helper + unit oracle exist; operational PMI tests pending C.13.7D.

**PMI status after C.13.7C:** **MISMATCH CONFIRMED / GOLDEN BENCHMARK TESTED** (not approved, not globally resolved).

## PMI operational DSS tests (C.13.7D)

1. **Harness:** `backend/services/pmi/pmiOperationalFormulas.js` — mirrors case capture and ledger capture from `pmi.service.js`; not imported by product.
2. **Tests:** `tests/unit/pmi/pmiOperationalMetrics.test.js` — locks operational case/ledger/enterprise capture and readiness via `calculatePmiEnterpriseMetrics`.
3. **Documented divergences (intentional):**
   - Case/ledger zero denominator → operational `0%`; Golden → `null`.
   - Case uses `synergyTarget`; Golden uses `forecastSynergy`.
   - Readiness (`pmiReadinessScore`) is DSS composite — not `PMI_CAPTURE_RATE` and not Golden-certified.
4. **Product untouched:** no formula changes; `pmi.service.js` behavior unchanged.

**C13-P1-13 status (C.13.7D):** **PARTIALLY RESOLVED / OPERATIONAL SOURCES TESTED** — layers tested separately; full sync SoT still open.

**C13-P1-14 status (C.13.7D):** **PARTIALLY RESOLVED / OPERATIONAL READINESS TESTED** — composite readiness bounded and sensitivity-tested; not Golden.

**C13-P1-10 / C13-P1-11:** remain **PARTIALLY RESOLVED** (Golden tested; operational zero-forecast/target divergence documented).

**C13-P1-09 / C13-P1-15:** remain **OPEN** — pending C.13.7E (demo/CEO Hub).

**PMI status after C.13.7D:** **MISMATCH CONFIRMED / GOLDEN + OPERATIONAL TESTED** (not approved, not globally resolved).

## PMI demo/fallback + CEO hub gating (C.13.7E)

1. **Store:** `normalizePersistedPmiCase` replaces silent `mergeWithDemo` for API cases; `buildDemoPreviewCase`, `buildTemplateCase`, `buildEmptyFallbackCase` are explicit layers with `dataSource` / `truthfulnessStatus`.
2. **Dashboard:** `CaseTruthfulnessBanner` labels demo/template/fallback/insufficient persisted data.
3. **Hub:** `getPmiExecutiveHubBrief` returns `executiveSignalEligible`, `truthfulness`, and `score: null` when no persisted case; `buildPmiSignal(null)` no longer returns score `58` as real maturity.
4. **CEO Overview:** `getPmiOverview` uses `scoreDisplay` pending-data copy when hub signal is not eligible.
5. **Tests:** `pmiDemoTruthfulness.test.js`, `pmiHubTruthfulness.test.js`.

**C13-P1-09 status (C.13.7E):** **RESOLVED / DEMO TRUTHFULNESS GATED** — persisted cases no longer auto-merge `DEMO_PMI_CASE`.

**C13-P1-15 status (C.13.7E):** **RESOLVED / CEO HUB GATING ADDED** — hub/CEO distinguish empty vs persisted; no default `58` as executive truth without data.

**PMI status after C.13.7E:** **MISMATCH CONFIRMED / GOLDEN + OPERATIONAL + DEMO GATED** (not approved, not globally resolved).

## PMI UI/report labels + cross-tenant tests (C.13.7F)

1. **Enterprise UI:** operational readiness/capture labels, DSS disclaimer, ledger status “Finance reviewed”, board pack draft copy, zero forecast/target N/A hints on case dashboard.
2. **Report export:** `generatePmiReport` payload includes `scoringTruthfulness`, `boardReadyMemo`, `humanReviewRequired` (pattern aligned with Risk C.13.6F).
3. **Cross-tenant:** `tests/integration/services/pmiMultiTenant.test.js` — cases, synergies, reports, hub brief scoped by `organizationId`.
4. **Unit tests:** `pmiUiTruthfulness.test.js`, `pmiReportTruthfulness.test.js`.

**C13-P1-10:** **PARTIALLY RESOLVED / GOLDEN ZERO FORECAST TESTED / PRODUCT BEHAVIOR PENDING** — UI documents operational 0% vs Golden null.

**C13-P1-11:** **PARTIALLY RESOLVED / GOLDEN VS OPERATIONAL SEPARATED** — labels reinforce separation.

**C13-P1-12:** **PARTIALLY RESOLVED / GOLDEN HELPER TESTED**.

**C13-P1-13:** **PARTIALLY RESOLVED / OPERATIONAL SOURCES TESTED + TENANT SCOPED**.

**C13-P1-14:** **PARTIALLY RESOLVED / OPERATIONAL READINESS LABELLED** — DSS readiness copy; not certified.

**PMI status after C.13.7F:** **MISMATCH CONFIRMED / GOLDEN + OPERATIONAL + DEMO + UI TRUTHFULNESS GATED** (not approved, not globally resolved).

## PMI zero denominator alignment (C.13.7G — Option B)

**Decision:** **Option B** — operational capture layers return `null` when target/forecast/denominator ≤ 0 (aligned with Golden `pmiCaptureRateGolden` null semantics). Composite readiness/integration scores use `(rate ?? 0)` only inside weighted formulas — not as displayed capture truth.

1. **Product:** `operationalCapturePercent` in `pmi.service.js`; mirrored in `usePMIEngine.js` and `pmiOperationalFormulas.js` harness.
2. **Layers aligned:** case capture, ledger capture, enterprise `synergyCaptureRatio`, hub brief case rate, `buildPmiSignal`.
3. **UI/export:** KPI card and enterprise widget show `N/A · insufficient denominator`; board memo HTML export uses N/A copy; signal rows already gated on target/forecast > 0.
4. **Reports:** `scoringTruthfulness.zeroDenominatorOperational` / `zeroDenominatorGolden` metadata on export payload.
5. **Enterprise status:** `valueCaptureStatus: not_calculable` when capture ratio is null.
6. **Golden untouched:** `pmiGoldenFormulas.js`, `golden_inputs.json`, Formula Registry unchanged.

**C13-P1-10 status (C.13.7G):** **RESOLVED / ZERO DENOMINATOR ALIGNED TO NULL**.

**C13-P1-11 status (C.13.7G):** **RESOLVED / GOLDEN VS OPERATIONAL SEPARATED** — same null edge for zero denominator; case still uses target vs Golden forecast (intentional layer difference).

**C13-P1-12:** **RESOLVED / GOLDEN HELPER TESTED** (unchanged from C.13.7C).

**C13-P1-13:** **RESOLVED / OPERATIONAL SOURCES TESTED + TENANT SCOPED**.

**C13-P1-14:** **RESOLVED / OPERATIONAL READINESS LABELLED** — DSS heuristic; not Golden.

**C13-P1-09 / C13-P1-15:** **RESOLVED** (C.13.7E).

**PMI status after C.13.7G:** **RESOLVED PRODUCT LOGIC / MULTI-LAYER PMI MODEL CLOSED** — E2E/prod smoke and PDF/HTML report renderer remain environment/future scope (P2/P3), not open P1 logic defects.

## Reporting aggregator audit (C.13.8A — READ ONLY)

**Status:** **AGGREGATOR RISK CONFIRMED / MISMATCH CONFIRMED / PENDING SOT** — Board Pack recalculates module metrics; Executive readiness used silent fallbacks; `REPORTING_VARIANCE` Golden mapped but not implemented.

**Findings (P1):** C13-P1-16..20, C13-P1-EXEC-01 documented in inventory.

## Reporting / Executive aggregation truthfulness (C.13.8B)

1. **Executive:** `collectExecutiveModuleSummaries` downgrades empty modules to `insufficient_data`; `readinessIndex` removes silent numeric fallbacks; empty org emits defensive signals.
2. **Board Pack:** `preserveNullablePercent` for PMI capture; Compliance null not defaulted to 55; `scoringTruthfulness` + `dssNotice` on pack payload.
3. **Reporting meta:** `reportingReadinessScore` null when no persisted reports/board packs/evidence.
4. **createBoardPack:** `generationStatus: failed` + `generation_failed` status when aggregation fails — not silent success.
5. **Tests:** `reportingAggregatorTruthfulness.test.js`, extended integration tests for Executive, Board Pack, Reporting.

**C13-P1-16:** **RESOLVED / BOARD PACK PMI NULL PRESERVED**
**C13-P1-16a:** **RESOLVED / BOARD PACK TRUTHFULNESS PAYLOAD ADDED**
**C13-P1-17:** **RESOLVED / EXECUTIVE EMPTY MODULE FALLBACKS GATED**
**C13-P1-EXEC-01:** **RESOLVED / EXECUTIVE EMPTY ORG DEFENSIVE SIGNALS RESTORED**
**C13-P1-18:** **RESOLVED / COMPLIANCE NULL SCORE NOT DEFAULTED**
**C13-P1-19:** **RESOLVED / BOARD PACK GENERATION FAILURE FLAGGED**
**C13-P1-20:** **PARTIALLY RESOLVED / REPORTING TRUTHFULNESS TESTS ADDED**

**Reporting global:** **AGGREGATOR RISK MITIGATED / PENDING REPORTING VARIANCE SOT** — not RESOLVED global (`REPORTING_VARIANCE` still unimplemented).

## Reporting variance SoT decision (C.13.8C — DOCS ONLY)

**Decision:** **OPTION C — Reporting variance as Golden benchmark / future product capability**

Reporting today remains:
- persisted reporting metadata workflow;
- evidence/report library;
- board pack DSS aggregator (truthfulness gated in C.13.8B);
- executive reporting aggregation layer;
- decision-support pack generator — **not** a cross-module calculation engine.

**REPORTING_VARIANCE (`reportingVarianceGolden`):**
- Golden benchmark / formula approval candidate (`reporting_kpi_variance_basic` in `golden_inputs.json`).
- **No product implementation** in `backend/services/reporting/**` (confirmed C.13.8A).
- **No use** in Board Pack, Executive Overview, or Reporting UI until C.13.8E product alignment is authorized.
- Does **not** override module-specific variance semantics (M&A, Funding, PMI, Risk, Compliance).

**Formula reference (oracle only):**
- `absoluteVariance = actual - expected`
- `variancePercent = expected !== 0 ? (absoluteVariance / expected) * 100 : null`
- Golden JSON maps `budget` → expected; `varianceAmount` → `absoluteVariance`.

**Options documented:** A defer · B helper/tests only (recommended next: C.13.8D) · **C approved** · D product now (rejected).

**C13-P1-20:** **PARTIALLY RESOLVED / REPORTING TRUTHFULNESS TESTS ADDED / VARIANCE SOT DOCUMENTED**

**C13-P2-REPORTING-01:** **REPORTING_VARIANCE MAPPED / NO PRODUCT IMPLEMENTATION / SOT DECISION DOCUMENTED**

**Reporting global:** **AGGREGATOR RISK MITIGATED / REPORTING VARIANCE SOT DOCUMENTED / PENDING HELPER TESTS** — not RESOLVED global.

**Roadmap (not executed in C.13.8C):**
- **C.13.8D** — Reporting variance Golden helper/tests (`reportingGoldenFormulas.js`, oracle only, no product).
- **C.13.8E** — Reporting product alignment decision (per-module vs generic variance in UI/Board Pack).
- **C.13.8F** — Reporting e2e/smoke closure (backend `:4000`).

**No code/tests/Golden Dataset changes in C.13.8C.**

## C.13.8D — Reporting variance Golden helper/tests

**Status:** **GOLDEN HELPER TESTED** — oracle only; product unchanged.

**Helper:** `backend/services/reporting/reportingGoldenFormulas.js` — `calculateReportingVarianceGolden` / alias `reportingVarianceGolden`.

**Tests:** `tests/unit/reporting/reportingGoldenFormulas.test.js` — asserts `reporting_kpi_variance_basic` from `golden_inputs.json` (tolerance per dataset).

**C13-P1-20:** **PARTIALLY RESOLVED / REPORTING TRUTHFULNESS TESTS ADDED / VARIANCE GOLDEN TESTED**

**C13-P2-REPORTING-01:** **PARTIALLY RESOLVED / REPORTING VARIANCE GOLDEN HELPER TESTED**

**Reporting global:** **AGGREGATOR RISK MITIGATED / REPORTING VARIANCE GOLDEN TESTED / PRODUCT ALIGNMENT PENDING** — not RESOLVED global.

**Not touched:** `reporting.service.js`, `boardPack.service.js`, Executive, Reporting UI, `golden_inputs.json`, `FORMULA_REGISTRY.md`.

**Next:** C.13.8E product alignment · C.13.8F e2e/smoke.

## C.13.8E — Reporting product alignment decision (DOCS ONLY)

**Decision:** **OPTION C — Product alignment deferred / per-module ownership required**

**Status:** Product **does not consume** `reportingVarianceGolden` in UI, Board Pack, Executive, CEO Overview, report library, or exports.

**Options documented:** A global use now (rejected) · B Board Pack variance now (rejected) · **C deferred per-module ownership (selected)** · D UI pilot (rejected without feature flag)

### Product alignment rules (Logic Integrity)

1. Reporting variance Golden **must not** be used in product without module owner approval.
2. Board Pack **must not** compute generic variance across modules.
3. Executive **must not** consume generic variance as executive signal.
4. `expected = 0` **must** preserve `variancePercent = null` (Golden oracle behavior).
5. Variance **must** be labelled as Golden benchmark, operational DSS, or module-owned product metric — never certified KPI.
6. Human review **required** for any future Board Pack/Executive variance use.
7. **No product import** of `reportingGoldenFormulas.js` until an authorized implementation phase after C.13.8E.
8. **No Reporting global RESOLVED** while product alignment is deferred and e2e/smoke pending.

### Module variance ownership

| Module | Possible variance | Owner | Reporting usage |
|---|---|---|---|
| M&A | Valuation vs expected / scenario bands | M&A | No generic Reporting variance |
| Funding | Runway vs target / raise vs plan | Funding | No generic Reporting variance |
| PMI | Captured vs forecast | PMI | Display only if PMI provides approved payload |
| Risk | Residual vs inherent / movement | Risk | No generic Reporting variance |
| Compliance | Health/resilience delta | Compliance | No generic Reporting variance |
| Bridge | Conversion vs target | Bridge | No generic Reporting variance |
| Reporting | Generic actual vs budget | Reporting Golden | Oracle only; not product-aligned |

**C13-P1-20:** **PARTIALLY RESOLVED / REPORTING TRUTHFULNESS + VARIANCE DECISION ADDED**

**C13-P2-REPORTING-01:** **PARTIALLY RESOLVED / REPORTING VARIANCE GOLDEN TESTED / PRODUCT ALIGNMENT DECIDED**

**Reporting global:** **AGGREGATOR RISK MITIGATED / VARIANCE GOLDEN TESTED / PRODUCT ALIGNMENT DEFERRED BY SOT** — not RESOLVED global.

**Not touched:** `reportingGoldenFormulas.js`, tests, product code, Golden Dataset, `FORMULA_REGISTRY.md`.

**Next:** C.13.9 Strategy/Governance audit · production smoke when authorized.

## C.13.8F — Reporting e2e/smoke closure + final Reporting status

**Status:** **RESOLVED LOGIC BASELINE / PRODUCT VARIANCE DEFERRED / PDF-RENDERER PENDING**

### Import check (product alignment)

| Symbol | Product import? | Evidence |
|---|---|---|
| `reportingGoldenFormulas` | **No** | Only `reportingGoldenFormulas.js`, unit test, docs |
| `calculateReportingVarianceGolden` | **No** | Same |
| `reportingVarianceGolden` | **No** | Same |

### Validation results

| Command | Result |
|---|---|
| `npm run test:unit` (reporting + full) | **391 passed** |
| `npm run test:integration` | **61 passed** |
| `npm run build` | **pass** |
| `node scripts/run-e2e.mjs tests/e2e/reporting/reporting-enterprise-flow.spec.js` | **1 passed** (32s) |

### C.13.8 block summary

| Subphase | Outcome |
|---|---|
| C.13.8A | Aggregator risk confirmed (read-only) |
| C.13.8B | Executive/Board Pack truthfulness fixed |
| C.13.8C | OPTION C — Golden benchmark / future capability |
| C.13.8D | `reportingGoldenFormulas.js` + 12 oracle tests |
| C.13.8E | OPTION C — product alignment deferred per-module |
| C.13.8F | Logic baseline validated; e2e pass |

**C13-P1-20:** **RESOLVED / REPORTING TRUTHFULNESS + VARIANCE GOLDEN + E2E VALIDATED**

**C13-P2-REPORTING-01:** **RESOLVED AS GOLDEN BENCHMARK / PRODUCT DEFERRED**

**Reporting global:** **RESOLVED LOGIC BASELINE / PRODUCT VARIANCE DEFERRED / PDF-RENDERER PENDING** — not fully enterprise complete.

**Residual risks:** PDF/HTML renderer · per-module variance · Board Pack M&A/Funding recalc not Golden · production Render smoke · global SoT · sales/demo pack after C.13.

**Not touched:** Golden Dataset, Formula Registry, product code, `reportingGoldenFormulas.js`.

**Next:** **C.13.9 — Strategy/Governance Logic Integrity Audit READ ONLY**

## C.13.9B — Governance SoT decision + truthfulness fix

**Fixes:** Approve UI uses `APPROVE_GOVERNANCE_DECISION`; empty org null readiness; hub baselines 55/58/50 gated; `governance.board_pack_ready` signal metadata; Governance vs Reporting board pack boundary.

**C13-P1-GOV-01:** **PARTIALLY RESOLVED / GOVERNANCE READINESS CLASSIFIED AS OPERATIONAL DSS / GOLDEN PENDING**

**C13-P1-GOV-02:** **RESOLVED / APPROVE UI API PERMISSION ALIGNED**

**C13-P1-GOV-03:** **RESOLVED / GOVERNANCE VS REPORTING BOARD PACK SOT BOUNDARY DOCUMENTED**

**C13-P1-GOV-04:** **RESOLVED / BOARD PACK READY SIGNAL LABELLED AS DSS HEURISTIC**

**C13-P2-GOV-04:** **RESOLVED / GOVERNANCE EMPTY BASELINES GATED**

**Governance global:** **DSS OPERATIONAL / PRODUCT LOGIC BASELINE / TRUTHFULNESS GATED / GOLDEN PENDING** — not RESOLVED global.

**Next:** C.13.9C Strategy SoT/truthfulness · C.13.10 CEO fallbacks.

## C.13.9C — Strategy SoT decision + truthfulness fix

**Fixes:** Empty org null readiness (no 60 defaults); `strategicRiskLevel` zero risks → `not_assessed`; Strategy report metadata labelled; CEO Strategy fallback 60 removed; Board Pack Strategy exclusion documented; `executiveSignalEligible` gating.

**C13-P1-STRAT-01:** **PARTIALLY RESOLVED / STRATEGY READINESS CLASSIFIED AS OPERATIONAL DSS / GOLDEN PENDING**

**C13-P1-STRAT-02:** **RESOLVED / EMPTY STRATEGY DEFAULTS GATED**

**C13-P1-STRAT-03:** **RESOLVED / CEO STRATEGY FALLBACK GATED**

**C13-P1-STRAT-04:** **RESOLVED / STRATEGY BOARD PACK EXCLUSION DOCUMENTED**

**C13-P2-STRAT-01:** **RESOLVED / STRATEGY COPY TRUTHFULNESS UPDATED**

**C13-P2-STRAT-02:** **RESOLVED / STRATEGY REPORT METADATA LABELLED**

**C13-P2-STRAT-04:** **RESOLVED / STRATEGIC RISK EMPTY STATE GATED**

**Strategy global:** **DSS OPERATIONAL / PRODUCT LOGIC BASELINE / TRUTHFULNESS GATED / GOLDEN PENDING** — not RESOLVED global.

**Next:** C.13.11 Cross-module SoT closure.

## C.13.10B — CEO Overview truthfulness fix

**Fixes:** CEO local calculators gated (no 64/60/58/62/65); `getExecutiveSignal` eligible-modules only; radar N/A labels; Command Center fallback cards insufficient_data; board view null readiness; Risk empty org null readiness; Compliance empty controlled posture removed; truthfulness tests.

**C13-P1-CEO-01:** **RESOLVED / CEO LOCAL FALLBACKS GATED**

**C13-P1-CEO-02:** **RESOLVED / EXECUTIVE SIGNAL NO LONGER SYNTHESIZED FROM FALLBACKS**

**C13-P1-CEO-03:** **RESOLVED / GOVERNANCE ESG RADAR FALLBACK REMOVED**

**C13-P1-CEO-04:** **RESOLVED / COMMAND CENTER FALLBACK CARDS GATED**

**C13-P1-EXEC-02:** **RESOLVED / BOARD VIEW NULL READINESS PRESERVED**

**C13-P1-EXEC-03:** **RESOLVED / RISK EMPTY STATE GATED**

**C13-P1-CEO-05:** **RESOLVED / COMPLIANCE EMPTY CONTROLLED POSTURE REMOVED**

**C13-P1-TEST-CEO-01:** **RESOLVED / CEO TRUTHFULNESS TESTS ADDED**

**CEO Overview global:** **DSS AGGREGATOR / TRUTHFULNESS GATED / EXECUTIVE API ALIGNED / GOLDEN MODULES PENDING** — not fully enterprise complete.

**Next:** C.13.12 Global Logic Integrity Final Gate / Release Readiness Audit.

## C.13.11A — Cross-module Source-of-Truth Closure (AUDIT / DOCS)

**Mode:** READ-ONLY audit synthesis + documentation closure only. **No product code changed.**

**Global decision:** **C.13 GLOBAL LOGIC BASELINE CLOSED / P2–P3 ENTERPRISE HARDENING PENDING** (confirmed C.13.12)

| Criterion | Verdict |
|---|---|
| Known P1 logic blockers after C.13.10B | **None verified** — CEO/Executive fallbacks gated; Risk/Compliance empty states gated; unit 418 / integration 65 / build pass (C.13.10B baseline) |
| Enterprise certified | **No** — DSS + human review only |
| Procurement / SOC2 / ISO | **Not claimed** |
| All modules Golden-complete | **No** — Governance, Strategy, Executive blend Golden pending |
| Pilot DSS (controlled internal use) | **Yes — selected modules** with documented limits |

### Commercial truthfulness — can say

- Private **Executive Decision Support System (DSS)** for internal executive, board-prep, and operating-team workflows.
- **Human review required** on calculated, aggregated, and heuristic outputs.
- **Board review draft** / board-prep material — not board-approved output.
- **Operational benchmarks** and **Golden-tested oracles** where documented (M&A simple benchmarks, Funding formulas, Bridge/Risk/PMI/Reporting variance oracles, Compliance weighted/resilience Golden paths).
- **Pilot-ready for controlled internal use** in modules with closed logic baseline: Risk, PMI, Reporting aggregator, M&A valuation chain (DSS), CEO/Executive truthfulness gated.
- **Marketplace quarantined** — internal unlisted demo / future private network only.

### Commercial truthfulness — do not sell as

- Certified enterprise SaaS or externally audited compliance/governance/risk rating.
- Autonomous decision engine or guaranteed outcomes (synergies, funding, deal matching, risk elimination).
- Legal advice, investment advice, fairness opinion, or certified audit.
- Board-approved or regulator-ready output without human review.
- Public deal marketplace or active transaction/success-fee layer.
- SOC2 / ISO / full SLA-backed enterprise suite (unless separately achieved).
- Complete PDF/HTML reporting suite (renderer future).
- “All modules enterprise complete” or “fully certified” narrative.

### C.13 final open items

**P1 (must before final demo/sales pack):** No known unresolved P1 logic defects in inventory after C.13.10B — **pending verification** via C.13.12 final gate and production smoke.

**P2 (enterprise hardening):**
- Governance Golden helper/tests for readiness scores.
- Strategy Golden helper/tests for readiness scores.
- Per-module variance product implementations (Reporting OPTION C deferred).
- CEO e2e empty-org / button copy assertions.
- ~~Production Render smoke~~ **executed 2026-05-24** — infra/health/SPA **PASS** (see inventory § Production Render Smoke).
- ~~Post-redeploy bundle verification~~ **executed 2026-05-24** — prod bundle updated; C.13.10B strings in `ExecutiveOverviewer` chunk **confirmed**.
- ~~Authenticated production smoke~~ **executed 2026-05-24** — login/API/CEO truthfulness **PASS**; Playwright prod CEO/Reporting/Governance/Strategy **PASS**; hubs Funding heading **P2** (see inventory).
- PDF/HTML report renderer.
- Governance workflow state-machine guards.
- Governance Controls/ESG UI gaps.
- Funding dashboard runtime consistency / optional e2e.
- Bridge optional product→Golden alignment (C.13.5G).
- Compliance backend calculation SoT / API rename (C13-P1-04/05/06 residual).
- M&A backend snapshot/re-export policy integration.
- Heritage module — not C.13 logic-audited; treat as preview/DSS partial.

**P3 (polish / ops):**
- Documentation polish, sales collateral alignment, broader e2e coverage, optional migrations.

### Module baseline summary (C.13.11A)

| Module | C.13 logic baseline | Pilot DSS | Enterprise complete? |
|---|---|---|---|
| M&A | Strong — Golden + product alignment tested | Yes (DSS) | No — not certified valuation |
| Compliance | Operational — chain advanced; rename/API partial | Yes (DSS) | No — not certified compliance |
| Funding | Formula baseline; persistence partial closure | Yes (DSS) | No — draft vs persisted separation |
| Bridge | Dual-layer + quarantine | Yes (signals only) | No — marketplace not product |
| Risk | **Resolved logic baseline** | Yes | No — not regulatory certification |
| PMI | **Resolved product logic** | Yes | No — PDF/smoke pending |
| Reporting | **Resolved aggregator baseline**; variance deferred | Yes (metadata/draft) | No — PDF renderer pending |
| Governance | Truthfulness gated; Golden pending | Yes (DSS) | No |
| Strategy | Truthfulness gated; Golden pending | Yes (DSS) | No |
| CEO/Executive | Truthfulness gated aggregator | Yes (with data) | No |
| Heritage | Not C.13 closed | Preview only | No |

**Next:** Production Render smoke · C.14 Enterprise Hardening.

## C.13.12 — Global Logic Integrity Final Gate / Release Readiness Audit

**Mode:** VALIDATION / DOCS — no product code changed.

**Final status:** **C.13 GLOBAL LOGIC BASELINE CLOSED / P2–P3 ENTERPRISE HARDENING PENDING**

### Validation matrix

| Layer | Command / check | Result |
|---|---|---|
| Unit | `npm run test:unit` | **418 passed** |
| Integration | `npm run test:integration` | **65 passed** |
| Build | `npm run build` | **pass** |
| E2E Reporting | `reporting-enterprise-flow.spec.js` | **1 passed** |
| E2E Governance | `governance-enterprise-flow.spec.js` | **1 passed** |
| E2E Strategy | `strategy-enterprise-flow.spec.js` | **1 passed** |
| E2E CEO | `ceo-command-center.spec.js` | **1 passed** |
| Golden → product import | grep `src/` | **none** |
| CEO fallback scores | C.13.10B + tests | **gated** |
| BoardView null readiness | C.13.10B | **preserved** |

### P1 after final gate

**None known.**

### P2 residuals

Governance/Strategy Golden · Render smoke · PDF renderer · per-module variance · Compliance API rename · M&A snapshot policy · Heritage audit · Funding e2e · Bridge alignment · ~~`pmiStore` stale `mergeWithDemo`~~ **resolved C.13.12B** · `executiveReports` readiness `\|\| 0` · broader e2e.

### Commercial truthfulness (final)

**Can say:** Private Executive DSS · human review · board review draft · Golden oracles where documented · pilot-ready selected modules · marketplace quarantined.

**Cannot say:** Certified enterprise · autonomous engine · legal/investment advice · certified ratings · board-approved · public marketplace · SOC2/ISO/SLA · complete PDF reporting · all modules complete · production certified.

**Next:** C.14.2 backup/restore · C.14.3 audit logs · credential rotation ops · optional P2 Funding hub e2e.

## C.14.1 — Tenant-safe create hardening

**C14-P1-TENANT-CREATE-01:** **RESOLVED** — `omitClientTenantFields` in `backend/utils/tenantPayload.js`; applied to Risk, Strategy, Reporting, Executive signal create/update paths. Session `organizationId` applied after sanitized payload.

**Tests:** `tests/unit/security/tenantPayload.test.js` + integration cases in risk/strategy/reporting/executive enterprise tests.

**C14-P1-CREDENTIAL-01:** **OPEN** — prod test password rotation (ops, outside repo).

**Not in scope:** Heritage/Bridge body-spread audit (C.14.1B if needed).

## C.13.12B — PMI stale mergeWithDemo reference fix

**Fix:** `pmiStore.jsx` `savePmiCase` — `mergeWithDemo(saved)` → `normalizePersistedPmiCase(saved)`.

**C13-P2-PMI-STALE-MERGE:** **RESOLVED** — no demo merge reintroduced; C.13.7E/G truthfulness preserved.

## C.13.10A — CEO Overview / Executive Aggregator Audit READ ONLY

**Verdict:** Dual-path mismatch — backend defensive, CEO frontend legacy fallbacks (P1=8).

**Next:** C.13.10B truthfulness fix.

## Auditability Rule
Enterprise state-changing actions should preserve auditability:
- actor
- organizationId
- action
- timestamp
- safe metadata
## Anti-Laziness
Do not output incomplete code patches with placeholders.
Forbidden examples:
- // ... existing code ...
- /* rest of function */
- // unchanged
- omitted for brevity
If the change is too large, split it into a smaller patch.
## Structured Verification
Before proposing a report or code change, produce a visible PRE-FLIGHT CHECKLIST:
- task scope
- files allowed
- files forbidden
- source-of-truth
- Golden Dataset requirement
- legacy/duplicate check
- test oracle check
- stop conditions
- why this is safe
Do not expose private chain-of-thought.
## Test Shielding
Do not edit tests, fixtures, snapshots, expected values or Golden Datasets to hide a business logic failure.
Fix the logic or trigger Stop Condition.
## Advanced Stability & Execution Guardrails
### Infinite Loop Circuit Breaker
If you fail to resolve a bug, lint error, compile failure, test failure, Golden Dataset mismatch, or runtime issue after 3 consecutive attempts, you MUST immediately stop.
Do not attempt a 4th modification.
When this circuit breaker triggers, report:
- exact command executed
- exact error log
- the 3 attempted fixes
- the 3 hypotheses tested
- what each attempt changed
- what each attempt proved or disproved
- current repo status
- files modified during the attempts
- safest recommended next action
This prevents blind patching, AI drift, accidental rewrites and cascading regressions.
### Strict Type Lock / Zero-Bypass Policy
Do not introduce weak typing or compiler bypasses.
If touching or creating TypeScript / TSX files, do not introduce:
- any
- unnecessary unknown
- // @ts-ignore
- // @ts-expect-error without written justification
- broad object types when precise domain types are possible
- unsafe casts to silence compiler errors
For JS/JSX files, do not weaken validation, guards, permissions, organizationId checks, expected object shape checks, parsing or fallback labelling.
Never convert a file to TypeScript or introduce new type tooling unless explicitly requested.
If precise typing requires a wider refactor, stop and report instead of bypassing safety.
### Lint & Style Alignment
Generated code must follow existing repository style.
Before modifying code, inspect nearby files and mimic:
- import ordering
- quote style
- semicolon usage
- spacing
- component structure
- helper naming
- error handling style
- test style
- formatting conventions
Do not add a new formatter, linter, dependency, config or style rule unless explicitly requested.
### Regression Shield & Idempotency
Do not refactor, simplify, rename, reorganize or clean up working historical code outside the explicit task scope.
Any change must be:
- minimal
- scoped
- reversible
- explainable
- idempotent where applicable
- isolated to approved files
Do not modify adjacent modules because they seem related.
Do not change public contracts, route names, API response shapes, storage keys, CSS selectors, migration behavior, or test oracles unless explicitly authorized.
If the same prompt is run twice, it must not duplicate rules, files, sections, datasets or checklist blocks.
### Three-Layer Validation Rule
For any non-documentation change, validation must cover three layers where applicable:
1. Static validation:
   - lint
   - type safety where relevant
   - build
2. Logic validation:
   - expected input
   - expected output
   - Golden Dataset if applicable
   - source-of-truth confirmation
3. Product validation:
   - UI does not misrepresent demo/fallback as real
   - permissions are respected
   - organizationId is respected
   - disclaimers remain correct
   - no user-facing regression
### No Silent Fallback Rule
Do not hide failures behind silent fallbacks.
A fallback is allowed only if:
- it is already part of the project pattern or explicitly requested
- it is labelled as demo/fallback/estimated where user-facing
- it does not override real persisted data
- it does not hide API failures that should be visible
- it does not contaminate executive reports, board packs, scores or calculations
If a fallback is used, document why it exists, when it triggers, what data it returns, whether it is safe in production and whether it affects pilot readiness.
### No Test Weakening Rule
Do not weaken tests to make a change pass.
Forbidden unless explicitly requested as a separate test-maintenance task:
- deleting assertions
- reducing expected values
- widening tolerances
- replacing business assertions with smoke checks
- skipping tests
- using .only
- using .skip
- changing Golden Dataset expected outputs
- changing fixtures to match broken logic
- replacing deterministic tests with vague snapshots
If a test is genuinely wrong, stop and provide manual calculation, business explanation, before/after expected values, why the old test was wrong and reviewer note required.
### Current Function Verification Rule
Before using any function, service, hook, endpoint, route, store, engine, helper or config, verify it is the current active implementation.
Search for:
- duplicate names
- old wrappers
- deprecated versions
- unused files
- old localStorage stores
- dead routes
- old demo helpers
- frontend/backend duplicate logic
- current imports
- tests referencing it
Do not build on a legacy implementation unless the task is specifically to audit or remove it.
If current vs legacy cannot be determined, stop and report ambiguity.
### Repeatable Execution Rule
All instructions must be safe to re-run.
Before writing files:
- create folders only if missing
- create files only if missing, unless the prompt explicitly says replace
- avoid duplicate markdown sections
- avoid duplicate JSON keys
- avoid duplicate Cursor rules
- avoid duplicate examples
- avoid duplicated checklist blocks
If a rule already exists with equivalent meaning, do not add a second version.
Report whether each file was created, updated, unchanged because already compliant, or skipped because of a stop condition.
### Human Review Escalation Rule
Escalate to human review instead of guessing when there is ambiguity in:
- legal positioning
- financial logic
- investment language
- fairness opinion risk
- compliance certification language
- multi-tenant ownership
- permissions
- source-of-truth
- Golden Dataset mismatch
- destructive migration
- production data exposure
- security-sensitive behavior
When escalating, provide exact ambiguity, files involved, business risk, safest options and recommended next action.
## Chat Refresh / Handoff
After closing a phase/subphase, or when context becomes long, generate:
# HANDOFF_STATE
Include:
- Current Phase/Subphase
- Last File Audited
- Verified Baseline Commit/HEAD
- Working Tree Status
- Summary of Discoveries/Bugs, max 3 bullets
- Decisions Made
- Exact Next Step
- Files Allowed To Touch Next
- Files Forbidden To Touch Next
- Active Stop Conditions or Blocks
- Pending Commit / Push Status
- Recommended Prompt To Run Next
## Stop Conditions

Mode-aware policy (C.14.0) applies.

**READ-ONLY AUDIT:** stop only for git hygiene violations, write/delete attempts, commit/push attempts, or secret exposure — not for audit findings.

**WRITE/FIX:** stop and report if you find:
- critical calculation without source
- Golden Dataset mismatch
- frontend/backend logic mismatch
- legacy function used as source-of-truth
- demo/fallback contaminating output
- cross-tenant risk
- permissions ambiguity
- test that validates the wrong thing
- output presented as legal/financial/certified advice
- destructive migration risk
- secret exposure risk
- more than 3 failed attempts to fix the same issue
- need to touch forbidden files
- unexpected git baseline
- unexpected working tree changes
## Tutor explanation
Every decision must explain:
- why this approach is used
- what alternative was avoided
- what risk it reduces
- what QA should validate
- what future maintainers must know
- what business users should not misunderstand
## Formula Approval Gate (C.13.2A+)

A **critical formula** is not production-ready until it has minimum traceability in `docs/testing/FORMULA_REGISTRY.md`:

- Formula ID
- owner (human accountability — not AI-generated)
- source
- inputs
- units
- formula
- edge cases
- Golden Dataset ID **or** documented `N/A` justification
- associated test file **or** explicit pending test status
- usage limits (DSS scope, no certified advice where applicable)
- approval status
- DSS / no-advice disclaimer when user-facing

### Gate rules

- **Do not** change Golden Dataset expected values to make failing code pass.
- **Do not** widen tolerances without human review.
- **Do not** use AI/Cursor output as the authoritative formula source.
- **Do not** mix distinct metrics under the same user-facing label (e.g. weighted vs operational risk).
- **Do not** present indicative or DSS calculations as certified, legal, or investment advice.
- **Do not** promote `Pending` → `Approved` without human review; tooling may only verify metadata presence.

### Coverage test

`tests/unit/golden/formulaRegistryCoverage.test.js` validates minimum metadata for formulas explicitly covered in a C.13.2 subphase. It does **not** require every row in the Required Formula Table to be complete.

### Status meanings (approval)

| Status | Meaning |
|---|---|
| Implemented and tested | Golden and/or unit test evidence on record |
| Implemented for limited scope | Helper/reports/export only; not full product SoT |
| Pending validation | Exists in product; metadata/traceability incomplete |
| Pending implementation | Defined; not yet in code |
| Deprecated / do not use | Do not build new features on this path |

## C.13 relationship
C.13 is the formal phase for:
- Logic Integrity
- Calculation Audit
- Golden Dataset Audit
- Legacy Function Audit
- Duplicate Function Audit
- Test Oracle Review
- Cross-module Consistency Review
C.13 must review both future branches and already audited branches.
