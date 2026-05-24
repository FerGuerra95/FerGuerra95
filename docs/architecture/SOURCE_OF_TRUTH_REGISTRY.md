# CEO's OS / The Sovereign OS — Source of Truth Registry

## Purpose

Official registry of source-of-truth for data, calculations, permissions, modules, and executive signals.

This document defines intended ownership and known risks. It does not certify that current code implementation is correct until C.13 validation completes.

## Documentation Truthfulness

Every entry must use one of these statuses:

| Status | Meaning |
|---|---|
| Confirmed | Verified by audit or explicit architectural invariant |
| Assumed / Pending C.13 validation | Likely source; code audit not yet complete |
| Known duplicate risk | Two sources may disagree |
| Known demo/fallback contamination risk | Demo or fallback may appear as real |
| Source unclear | Cannot determine without deeper audit |
| Deprecated | Must not be used for new work |
| Human review required | DSS/heuristic; not certified output |

Do not mark Assumed entries as Confirmed before C.13.

## Core Source-of-Truth Table

| Domain | Data / Signal | Assumed Source of Truth | Status | Known Risk | Golden Dataset | Notes |
|---|---|---|---|---|---|---|
| Tenant scope | organizationId | Backend token/session/auth context | Confirmed | Cross-tenant if bypassed | N/A | Frontend never authoritative |
| Auth | roles/permissions | backend auth.middleware + AuthProvider mirror | Assumed / Pending C.13 validation | Viewer E2E gaps | N/A | Verify per endpoint |
| Users | user records | Backend users storage / SQLite | Assumed / Pending C.13 validation | N/A | N/A | |
| M&A valuation | enterprise value, equity metrics | FE `useValuationEngine` (live); Golden simple benchmarks separate | Partially resolved (C.13.4I) | snapshot drift; backend re-export policy | ma_valuation_* | Not fairness opinion |
| M&A waterfall | seller proceeds | FE product waterfall (`netProceeds`); Golden WATERFALL_SIMPLE separate | Partially resolved (C.13.4I) | Product ≠ golden simple bridge; netProceeds fallback fixed C.13.4H | ma_waterfall_simple_distribution | DSS only |
| M&A buyer matching | match scores | FE `buildBuyerMatches` heuristic | Partially resolved (C.13.4E labels) | Not certified matching | ma_buyer_matching_score (future) | DSS heuristic |
| Funding rounds | round records | backend funding services/API (`funding_rounds`) | Confirmed (C.13.3G) | FE draft must not replace | N/A | `GET/POST/PUT/DELETE /funding/rounds` |
| Funding summary | dashboard summary | backend `getFundingSummary` | Confirmed (C.13.3G) | Dashboard labels draft vs persisted (C.13.3H) | N/A | Window/risk = DSS heuristics |
| Funding snapshots | persisted scenario snapshots | backend `funding_snapshots` / hub-overview | Confirmed (C.13.3G) | FE pages do not consume createSnapshot yet | N/A | Optional enterprise commit path |
| Funding draft workspace | inputs, settings, scenario modelling | client localStorage (`funding_draft_by_org_v1_{organizationId}`) | Confirmed (C.13.3G) | Legacy global keys consumed on migrate (C.13.3J) | funding_* formulas on draft | Not enterprise persisted |
| Funding scenarios (UI) | Low/Base/High rows | FE `useFundingEngine` on draft inputs | Known duplicate risk | Differs from persisted rounds | funding_* | Label as scenario/draft required |
| Compliance weightedRiskScore | explicable 3-dimension score | Golden Dataset + `complianceWeightedRisk.js` + Formula Registry (`COMPLIANCE_WEIGHTED_RISK`) | Implemented + reports/export (C.13.1C-f2A/f4A) | Must not confuse with operationalRiskScore | compliance_weighted_risk_score_basic | Reports/export oracle; broader model adoption pending |
| Compliance operationalRiskScore | dashboard operational score | Frontend `calculateSupplierRiskScore` + `useComplianceEngine` (current) | Assumed / Pending hardening | Collides with field name `riskScore`; FE may override BE | N/A | Not golden oracle |
| Compliance riskScore persisted | stored supplier fields | backend `compliance_suppliers` via payload clamp | Confirmed persistence SoT | Not calculation SoT; may differ from UI displayed score | N/A | Persistence only |
| Compliance resilienceScore persisted | stored supplier fields | backend `compliance_suppliers` via payload clamp | Confirmed persistence SoT | FE recalculates on read; formula alignment pending | compliance_resilience_score_basic | C.13.1C-f1B |
| Compliance resilienceScore calculated | UI resilience metric | Frontend `calculateResilienceScore` (current) | Assumed / Pending alignment | Differs from golden formula | compliance_resilience_score_basic | Subphase after naming |
| Compliance evidence | evidence/reviews | backend compliance services | Assumed / Pending C.13 validation | | N/A | |
| Governance decisions | decision workflow state | backend governance services | **TRUTHFULNESS GATED** (C.13.9B) | Approve UX aligned; Golden pending | N/A | Strong backend per C.5 |
| PMI case dashboard | workstreams, ledger in case | `pmi_cases` JSON payload + FE store bridge | Partially resolved (C.13.7B docs) | mergeWithDemo contamination (C13-P1-09) | pmi_synergy_* (partial) | Multi-layer model documented; no code fix yet |
| PMI enterprise synergies | synergy initiatives table | `pmi_synergy_initiatives` | Partially resolved (C.13.7B docs) | Not synced with case ledger (C13-P1-13) | pmi_synergy_* (partial) | Enterprise operational layer; no Golden helper yet |
| Bridge signals | recalculated signals | bridge_signals + `bridge.service.js` heuristics | Partially resolved (C.13.5E Option C) | Dual-layer: `bridgePriorityGolden` vs `operationalSignalPriority`; product unchanged | bridge_priority_score_basic | DSS; human review required |
| Bridge marketplace | opportunities / matches | BE bridge API + DEMO fallback | Partially resolved (C.13.5B labels) | Unlisted route; not pilot marketplace | N/A | INTERNAL_UNLISTED_DEMO |
| Risk register / enterprise scoring | `risk_register` + `risk.service.js` | Partially resolved (C.13.6B Option C) | Dual-layer: `riskLikelihoodImpactGolden` vs `operationalEnterpriseRiskScore`; UI heatmap gaps pending | risk_score_likelihood_impact_basic | DSS; human review required; not insurance/regulatory certification |
| Reporting KPIs | variance metrics | `reportingGoldenFormulas.js` (Golden oracle only) | Golden tested; product deferred (C.13.8E) | Product must not consume generic variance | reporting_kpi_variance_basic | Per-module ownership required |
| Executive Overview | module health / radar / executive signal | Backend `executiveOverview.service.js` + CEO `ceoOverviewTruthfulness.js` | **TRUTHFULNESS GATED** (C.13.10B) | Fallback risk gated C.13.10B | executive_module_health_average_basic (future) | Aggregator only; not master store |
| Golden Datasets | calculation oracles | docs/testing/golden_inputs.json | Confirmed baseline seed | Implementation may mismatch | All IDs in file | Oracle not product data |
| Formulas | formula definitions | docs/testing/FORMULA_REGISTRY.md | Created IA-2 / Pending C.13 validation | | Mapped IDs | |

## Rules

1. One business value must have one official source-of-truth.
2. If frontend and backend disagree, classify P0 or P1 by business impact.
3. Do not silently switch source-of-truth in a patch.
4. Do not treat Executive Overview as master storage for operational entities.
5. Do not treat demo/fallback/localStorage as real persisted enterprise data in reports or board packs.
6. Do not mark Assumed architecture as Confirmed before C.13 code audit.
7. Any change to source-of-truth requires registry update in same PR or follow-up doc commit.

## Compliance Scoring Source-of-Truth (Decision C.13.1C-f1B — Option C Hybrid)

### weightedRiskScore

| Aspect | Decision |
|---|---|
| **Canonical definition** | `docs/testing/golden_inputs.json` + `docs/testing/FORMULA_REGISTRY.md` (`COMPLIANCE_WEIGHTED_RISK`) |
| **Formula** | `financialRisk*0.4 + jurisdictionRisk*0.4 + evidenceRisk*0.2` |
| **Implementation** | **Pending** — no production helper yet |
| **Usage** | Reports, benchmarks, golden tests, explicable DSS |
| **Must not** | Be confused with `operationalRiskScore` or legacy field `riskScore` |

### operationalRiskScore

| Aspect | Decision |
|---|---|
| **Current implementation** | Frontend engine (`complianceScoring.js`, orchestrated by `useComplianceEngine.js`) |
| **Authoritative for** | Operational dashboard signals today (interim) |
| **Not final** | Backend is not calculation SoT; naming/precedence cleanup pending (C13-P1-06) |
| **Must not** | Be treated as Golden `weightedRiskScore` (68-style oracle) |

### Persisted riskScore / resilienceScore (backend fields)

| Aspect | Decision |
|---|---|
| **Backend role** | **Persistence SoT** — stores and clamps values from API payload |
| **Backend does not** | Compute weighted or operational formulas today |
| **UI risk** | Displayed values may be FE-recalculated, not equal to persisted SQLite values |

### Future decisions required (documented, not implemented)

1. Whether backend should become calculation SoT for `operationalRiskScore` / aligned `resilienceScore`.
2. How UI labels **persisted** vs **calculated** scores (product truthfulness).
3. Whether to add explicit `weightedRiskScore` on reports/API without renaming operational engine in same PR.

Status: **Human review required** for pilot-facing exports until f2/f3 phases complete.

## Funding Source-of-Truth Policy (Decision C.13.3G — Option C Hybrid)

Documented after C.13.3F read-only audit. **C13-P1-03 is PARTIALLY RESOLVED** (C.13.3K): SoT decision, dashboard labels, store tests, and legacy migration fix completed; dashboard runtime/e2e and optional broader migration remain pending. **Do not mark RESOLVED global.**

### Enterprise persisted data (backend authoritative)

| Asset | Source of truth | Implementation |
|---|---|---|
| **Funding rounds** | Backend API / SQLite `funding_rounds` | `funding.service.js`, `/funding/rounds`; scoped by `organizationId` server-side |
| **Funding summary** | Backend `getFundingSummary` | Aggregates rounds + compliance/M&A bridge signals; optimal window, funding risk |
| **Funding snapshots** | Backend `funding_snapshots` | `enterprise.service.js`, `/funding/snapshots`; org-scoped |
| **Executive bridge signals** | Backend summary + hub (`/funding/hub-overview`) | Preferred over draft; resilient fallback may use latest snapshot — must be labelled if shown |

### Draft / scenario workspace (client only — not enterprise persisted)

| Asset | Source of truth | Storage / code |
|---|---|---|
| **Funding inputs panel** | Client draft workspace | `fundingStore.jsx` → `funding_draft_by_org_v1_{organizationId}` |
| **Funding settings** | Client draft workspace | Same bundle (`reportCurrency`, `scenarioMode`) |
| **Scenario rows (Low/Base/High)** | FE engine on draft | `useFundingEngine.js` — scenario/DSS, not official round history |
| **Readiness (workspace)** | FE `fundraisingScoring.js` on draft | Canonical for UI formulas (C.13.3E); distinct from `capitalEfficiencyScore` in summary |
| **Export memo (draft)** | Draft + derived | `fundingExportApi.js` — workspace output, not certified filing |

### Legacy localStorage (migration-only — not SoT)

| Key | Status |
|---|---|
| `funding_workspace_draft_v1` | Legacy global; **migration-only fallback**; consumed and removed after successful org-scoped migration (C.13.3J) |
| `funding_workspace_settings_v1` | Legacy global; paired with draft v1; **consumed on migrate** (C.13.3J) |
| `funding_draft_by_org_v1_{organizationId}` | Active org-scoped draft key — draft workspace only, not enterprise persisted |

**Policy (C.13.3J):** Legacy global keys are not source-of-truth and not enterprise persisted data. After first successful migration to org-scoped key, legacy globals are deleted so a second organization in the same browser cannot inherit the same draft.

**Residual risk (P2 optional):** Dashboard runtime/e2e consistency between draft engine metrics and API summary — labels added (C.13.3H); automated e2e optional.

### UI separation rule (implemented C.13.3H)

`FundingDashboardPage` must visually distinguish:

- **Draft / scenario workspace metrics** (engine on `fundingInputs`) — labels: scenario, workspace, draft, DSS estimate.
- **Persisted enterprise metrics** (rounds list, summary KPIs, executive widget) — labels: persisted rounds, backend summary, enterprise record.

Mixing both without source labels was a **P1 product truthfulness** gap — **addressed on dashboard** in C.13.3H; optional extension to other Funding pages remains.

### Security boundary

- **Authoritative `organizationId`:** backend token/session (`req.organizationId`).
- **`organizationId` inside localStorage JSON:** metadata only; not a security or tenancy authority.

### Future phases (not in C.13.3G–K closed scope)

1. Optional — dashboard runtime/e2e consistency tests (draft vs API).
2. Optional — labels on other Funding pages beyond dashboard.
3. Optional — persist workspace via `POST /funding/snapshots` with explicit user action.
4. Optional — full backend migration of draft workspace (higher enterprise scope).

## M&A Valuation Source-of-Truth (Decision C.13.4B — updated C.13.4G)

Documented after C.13.4A read-only audit; chain C.13.4A–G closed at docs level **May 2026**. **Do not mark M&A valuation as certified, externally approved, or fairness opinion.** Golden simple formulas are benchmarks/oracles; product uses adjusted DSS formulas that are intentionally different (unit-tested divergence C.13.4F).

### Metric / formula table

| Metric / Formula | Current SoT | Status | Usage | Limitations |
|---|---|---|---|---|
| **simpleEnterpriseValue** (`EV_EBITDA`) | Golden Dataset + `maGoldenFormulas.js` | Golden test implemented (C.13.4C) | Benchmark / oracle simple EV | Not product headline EV; negative EBITDA → human review |
| **adjustedEnterpriseValue** (`evBase`) | Frontend `useValuationEngine.js` | Implemented; report alignment unit-tested (C.13.4F) | Product DSS valuation headline (base case) | Uses normalized EBITDA + adjusted multiple (sector, risk mode, quality, compliance) |
| **dcfEnterpriseValue** | Frontend `valuationFormulas.js` → `calculateDcfEnterpriseValue` | Implemented; pending Formula Approval | Triangulation / committee view | Null if WACC ≤ terminal growth |
| **blendedEnterpriseValue** | Frontend `useValuationEngine.js` (65% evBase + 35% DCF when finite) | Implemented; pending Formula Approval | Secondary DSS metric | Not golden oracle |
| **netDebt** | Frontend `calculateCoreMetrics` (`debt - cash`) | Golden test implemented (C.13.4C) | Valuation bridge | Net cash (cash > debt) allowed |
| **simpleEquityValue** (`EQUITY_VALUE`) | Golden + `maGoldenFormulas.js` | Golden test implemented (C.13.4C) | Benchmark / oracle simple equity | Does not include working capital adjustment |
| **adjustedEquityValue** (`equityBase`) | Frontend `useValuationEngine.js` | Implemented; report alignment unit-tested (C.13.4F) | Product DSS equity bridge | `enterpriseValue - netDebt + workingCapitalAdjustment` |
| **netProceeds** | Frontend `useValuationEngine.js` (live); report via `formatMAReportData` | Implemented; report alignment unit-tested (C.13.4F/H) | Post-fees/taxes seller cash estimate | **Not** the same as `equityValue` or `netCashToSeller` golden; see **netProceedsFallback** |
| **waterfallSimple** (`WATERFALL_SIMPLE`) | Golden + `maGoldenFormulas.js` | Golden test implemented (C.13.4C) | Simple seller cash bridge benchmark | **Not** implemented as product waterfall today |
| **productWaterfall** (`MA_PRODUCT_WATERFALL`) | Frontend `useValuationEngine` + `WaterfallPanel.jsx` | Product DSS; alignment via derived in reports (C.13.4F) | Product DSS waterfall: EV → netDebt → WC → equity → fees → taxes → netProceeds | Not equivalent to WATERFALL_SIMPLE golden |
| **buyerMatchScore** | Frontend `reportBuilder.js` → `buildBuyerMatches` | Heuristic DSS; UI labels (C.13.4E) | DSS heuristic buyer fit | Not certified buyer/investor matching |
| **persistedValuationSnapshot** | Backend SQLite (`ma_cases` / snapshots via API) | Confirmed persistence SoT | Historical persisted record | **Not** live calculation SoT; client payload; snapshot drift vs engine possible |

### Report and snapshot policy (Decision C.13.4G — updated C.13.4I)

| Policy key | SoT / behavior | Status |
|---|---|---|
| **liveValuationReport** | `useValuationEngine` derived + `formatMAReportData` + `buildMAReportHtml` for live export | Unit-tested alignment (C.13.4F/H) — `maProductReportAlignment.test.js` |
| **savedValuationSnapshot** | Backend/client persisted snapshot captured at save/export time | Historical record SoT; **not** live recalculation |
| **netProceeds** | Product waterfall terminal value from `derived.netProceeds` or `derived.sellerProceeds` only | **Fixed C.13.4H** — `resolveNetProceeds(derived)` in `formatMAReportData` |
| **netProceedsFallback** | Legacy silent fallback to `equityBase` when `netProceeds` missing | **Removed C.13.4H** — missing → `null` + `netProceedsSource: 'missing'` |

**netProceeds report policy (C.13.4H/I):**

| Field | SoT | Missing behavior |
|---|---|---|
| `summary.netProceeds` | `derived.netProceeds` or `derived.sellerProceeds` (finite only) | `null` |
| `summary.netProceedsSource` | `'derived'` when finite proceeds present; `'missing'` otherwise | Always set |
| `summary.equityValueBase` | `derived.equityBase` / adjusted equity bridge | Independent — **must not** substitute for netProceeds |

**Rules:**

1. **Live export** must use live engine derived values.
2. **Saved / re-export** must preserve saved snapshot values.
3. **No silent merge** between live engine and saved snapshot unless documented field-by-field fallback.
4. **Missing terminal proceeds** must not silently fallback to intermediate valuation metrics (e.g. `equityBase`). Report marks missing via `netProceedsSource: 'missing'` (C.13.4H).

### Live calculation vs persisted snapshot

| Layer | Role |
|---|---|
| **Frontend `useValuationEngine`** | **Live calculation SoT** for current UI, live reports built from live derived state |
| **Backend M&A API** | Persists snapshots/values sent by client; **does not recalculate** valuation engine server-side today |
| **Reports / exports (live)** | Use live derived; DSS disclaimers required (unit-tested C.13.4F) |
| **Reports / exports (re-export from snapshot)** | Must preserve saved snapshot; UI labels distinguish live vs saved (C.13.4E) |

### Future phases (post C.13.4I)

1. **Backend snapshot/re-export policy** — integration/e2e enforcement; re-export from snapshot vs live engine (MA-P1-03).
2. Optional — M&A snapshot integration/e2e tests (MA-P1-06).
3. Optional — server-side calculation SoT / snapshot recalc (enterprise phase; human review required).
4. **C.13.5D** — BRIDGE_PRIORITY golden/helper tests (`d11c831`).
5. **C.13.5E** — Bridge priority dual-layer decision (Option C): `bridgePriorityGolden` vs `operationalSignalPriority`.
6. **C.13.5F** — Bridge operational priority heuristic tests (`operationalSignalPriority` / `calculateSignalPriority`).
7. **C.13.6B** — Risk dual-layer decision (Option C): `riskLikelihoodImpactGolden` vs `operationalEnterpriseRiskScore`.
8. **C.13.6C** — RISK_LIKELIHOOD_IMPACT golden helper/tests (pending).
9. **C.13.6D** — Risk operational score heuristic tests (pending).

## Bridge / Marketplace Source-of-Truth (Decision C.13.5B)

Documented after C.13.5A read-only audit. **Do not treat Bridge Marketplace as public product surface or certified matching.**

| Metric / Surface | Source of Truth | Current status | Usage | Limitations |
|---|---|---|---|---|
| **enterpriseBridgeSignals** | `backend/services/bridge/bridge.service.js` — `buildEnterpriseBridgeSignals`, `recalculateEnterpriseBridge`, tenant-scoped `bridge_signals` | Implemented; integration-tested | Internal DSS cross-module signal layer | Heuristic; human-review-required; not autonomous decisions |
| **bridgePriorityGolden** | `docs/testing/FORMULA_REGISTRY.md` + `golden_inputs.json` (`bridge_priority_score_basic`) + `backend/services/bridge/bridgeGoldenFormulas.js` (`calculateBridgePriorityGolden`) | Golden oracle implemented + unit-tested (C.13.5D) | Benchmark/oracle for impact/urgency/confidence weights; logic integrity reference | **Not** current product operational priority; do not conflate with attention-queue ordering |
| **operationalSignalPriority** | `calculateSignalPriority()` in `bridge.service.js` | Implemented; **intentionally separate from Golden** (C.13.5E Option C); unit-tested (C.13.5F) | Attention queue / signal ordering by severity/confidence/stale heuristics | DSS operational heuristic; not certified prioritization; not Golden-equivalent; human review required |
| **bridgeMarketplaceOpportunities** | Backend `bridge_opportunities` (org-scoped) when present; else FE `DEMO_BRIDGE_*` | Internal unlisted demo / future private network | Private-network preview modelling only | Not public marketplace; not enterprise SoT when demo fallback |
| **bridgeMarketplaceMatches** | `getMatchScore()` heuristic (FE page + BE service) | Heuristic DSS; Pending Formula Approval | Internal marketplace preview fit score | Not certified buyer/investor/funding recommendation |
| **marketplaceDemoFallback** | `BridgeMarketplacePage.jsx` `DEMO_BRIDGE_*` constants | Active when API empty/error | Labelled demo fallback in UI (C.13.5B) | Must not be presented as live verified network |
| **marketplaceSuccessFeeLogic** | None in product | **Future commercial strategy only** | Documented as future concept in UI | Not active billing, transaction layer or intermediation |
| **bridgePersistedReports** | Backend bridge reports + network memos | Org-scoped persisted records | Internal DSS memos / previews | Not fairness opinion or certified deal advice |

### Bridge Enterprise vs Marketplace

| Layer | Route prefix | Nav | Role |
|---|---|---|---|
| **Bridge Enterprise** | `/bridge/dashboard`, `/signals`, … | Listed | Cross-module DSS intelligence |
| **Bridge Marketplace** | `/bridge/marketplace` | **Unlisted** | INTERNAL_UNLISTED_DEMO / FUTURE_PRIVATE_NETWORK |

## Bridge Priority Dual-Layer Model (Decision C.13.5E — Option C)

Bridge signal priority has **two intentional layers**. Do not treat them as interchangeable.

| Layer | Logical name | Implementation (current) | Formula / inputs | Role |
|---|---|---|---|---|
| **Golden benchmark** | `bridgePriorityGolden` | `calculateBridgePriorityGolden()` in `bridgeGoldenFormulas.js` | `impact*0.5 + urgency*0.3 + confidence*0.2` | Oracle for logic integrity, Golden Dataset, CI tests |
| **Operational DSS** | `operationalSignalPriority` | `calculateSignalPriority()` in `bridge.service.js` | severity rank + confidenceLevel + blocking/stale heuristics | Product attention queue / signal ordering; tested in `bridgeOperationalPriority.test.js` |

**Rules:**

1. Golden benchmark validates mathematical oracle/searchability — **not** live operational ordering unless explicitly authorized in a future phase.
2. Operational priority is a **DSS heuristic** — not certified prioritization, not investment/governance advice, not autonomous decision output.
3. UI, reports and exports must **not** present operational priority as Golden-equivalent or formula-certified.
4. Aligning product to Golden (Option B) or extracting a pure operational helper mirror requires **C.13.5G** or separate authorized phase — not implied by C.13.5F.

**C13-P1-07 status:** PARTIALLY RESOLVED — dual-layer tests complete (Golden C.13.5D + operational C.13.5F); no global RESOLVED.

## Risk Enterprise Dual-Layer Model (Decision C.13.6B — Option C)

Risk Enterprise item scoring has **two intentional layers**. Do not treat them as interchangeable.

| Layer | Logical name | Implementation (current) | Formula / inputs | Role |
|---|---|---|---|---|
| **Golden benchmark** | `riskLikelihoodImpactGolden` | `calculateRiskLikelihoodImpactGolden()` in `riskGoldenFormulas.js` | `likelihood × impact` (1–5); severity bands per Golden | Oracle for logic integrity, Golden Dataset, CI tests (C.13.6C) |
| **Operational DSS** | `operationalEnterpriseRiskScore` | `riskScoreFrom()` in `risk.service.js` | `(severityRank + likelihood + impact) / 15 × 100` with inherent/residual severity | Dashboard KPIs, readiness, portfolio posture; unit-tested (C.13.6D) |

**Golden reference:** `risk_score_likelihood_impact_basic` — L=4, I=5 → **20**, severity **critical** (band 16–25).

**Operational reference (same L/I, product defaults):** medium/medium severities → score **~80**; critical/critical → **~93** — **not** Golden 20.

**Rules:**

1. Golden benchmark validates mathematical oracle — **not** live dashboard/residual KPI unless explicitly authorized in a future phase.
2. Operational score is a **DSS heuristic** — not regulatory risk certification, not insurance underwriting, not autonomous risk acceptance.
3. UI, reports and exports must **not** present `operationalEnterpriseRiskScore` / residual KPI as Golden-equivalent or formula-certified.
4. Separate Risk domains (M&A `riskScoring.js`, Compliance supplier risk, PMI/strategy risk entities) are **not** `RISK_LIKELIHOOD_IMPACT` — do not conflate in narrative.
5. Aligning product to Golden (Option B), golden helper (C.13.6C), operational tests (C.13.6D), or UI heatmap alignment (C.13.6E) require **separate authorized phases** — not implied by C.13.6B.

**C13-P1-08 status:** **RESOLVED / DUAL-LAYER RISK MODEL CLOSED** — dual-layer tests (Golden C.13.6C + operational C.13.6D); UI alignment (C.13.6E); report/export truthfulness (C.13.6F). Intentional operational vs Golden divergence documented under Option C.

## PMI Multi-Layer Logic Model (Decision C.13.7B — Option C)

PMI does **not** have a single production capture formula today. It has multiple intentional layers that must remain explicit in docs/UI/tests.

| Layer | Logical name | Formula / source | Role | Status |
|---|---|---|---|---|
| Golden benchmark | `pmiCaptureRateGolden` | `capturedSynergy / forecastSynergy`; if forecast = 0 => `null` | Oracle / Formula Approval benchmark | **IMPLEMENTED AND TESTED** (C.13.7C) — `backend/services/pmi/pmiGoldenFormulas.js` |
| Case operational capture | `operationalPmiCaseCapture` | `synergyCaptured / synergyTarget` (case payload) | DSS case dashboard signal | **OPERATIONAL TESTED** (C.13.7D) — harness mirrors service; target≠forecast |
| Ledger operational capture | `operationalPmiLedgerCapture` | `Σcaptured / Σforecast` (synergy ledger) | DSS ledger capture view | **ALIGNED** (C.13.7G) — zero forecast returns `null` (N/A in UI) |
| Enterprise operational capture | `operationalPmiEnterpriseCapture` | `capturedValue / targetValue` with case/ledger fallback in metrics pipeline | DSS enterprise initiatives view | **OPERATIONAL TESTED** (C.13.7D) — sync SoT still open (C13-P1-13 partial) |
| Readiness heuristic | `operationalPmiReadinessScore` | Weighted readiness/integration composite (`pmiReadinessScore`, `integrationReadinessScore`, `integrationScore`) | Operational DSS executive posture | **OPERATIONAL TESTED** (C.13.7D) — not Golden; `pmi_integration_health` still future |
| Demo/template layer | `demoPmiCase` | `DEMO_PMI_CASE` + explicit demo/template/fallback helpers in `pmiStore.jsx` | Template/fallback only | **DEMO GATED** (C.13.7E) — no silent `mergeWithDemo` into persisted cases |
| CEO / hub signal | `pmiExecutiveHubSignal` | Backend hub brief aggregation (`getPmiExecutiveHubBrief`) | Aggregated DSS signal for CEO layer | **HUB GATED** (C.13.7E) — `executiveSignalEligible`, `dataSource`, null score when empty |

### PMI source-of-truth rules (C.13.7B)

1. Golden capture benchmark is validation-only; it does not automatically replace operational PMI dashboards.
2. Operational capture layers with different denominators must be labelled separately; do not present them as one Golden capture rate.
3. Readiness/integration metrics are DSS heuristics, not Golden formulas or certified outcomes.
4. Demo/template layer is not enterprise source-of-truth and must not be mixed into executive truth without explicit labeling/gating.
5. CEO/Hub must distinguish persisted operational data vs demo/default/fallback states.

**PMI status:** **RESOLVED PRODUCT LOGIC / MULTI-LAYER PMI MODEL CLOSED** (C.13.7G). Golden (C.13.7C), operational tests (C.13.7D), demo/CEO gating (C.13.7E), UI/report truthfulness (C.13.7F), zero-denominator alignment (C.13.7G Option B) are in place. Residual: E2E/prod smoke when backend unavailable; future PDF/HTML report renderer — P2/P3, not P1 logic blockers.

## Reporting / Board Pack aggregation (C.13.8A–B)

| Layer | Role | Status |
|---|---|---|
| Reporting library | Persisted report metadata CRUD | **OPERATIONAL DSS** — tenant-scoped |
| Board Pack aggregator | Cross-module hub aggregation | **TRUTHFULNESS GATED** (C.13.8B) — preserves PMI null; Compliance null; scoringTruthfulness |
| Executive Command Center | Module summary + readiness index | **TRUTHFULNESS GATED** (C.13.8B) — insufficient_data for empty modules; no silent readiness fallbacks |
| REPORTING_VARIANCE | Golden KPI variance (`reportingVarianceGolden`) | **GOLDEN ORACLE ONLY** (C.13.8D) — **product alignment deferred** (C.13.8E OPTION C) |

**Reporting status:** **RESOLVED LOGIC BASELINE / PRODUCT VARIANCE DEFERRED / PDF-RENDERER PENDING** (C.13.8F) — not fully enterprise complete; e2e pass via `run-e2e.mjs` harness (local).

## REPORTING_VARIANCE — Source-of-Truth Decision (C.13.8C)

**Decision:** **OPTION C — Reporting variance as Golden benchmark / future product capability**

| Item | Decision |
|---|---|
| Logical name | `reportingVarianceGolden` |
| Golden ID | `reporting_kpi_variance_basic` |
| Formula (oracle) | `absoluteVariance = actual - expected` (Golden JSON uses `budget` as expected); `variancePercent = expected !== 0 ? (absoluteVariance / expected) * 100 : null` |
| Golden helper | `backend/services/reporting/reportingGoldenFormulas.js` — `calculateReportingVarianceGolden` | Oracle only (C.13.8D) |
| Product owner | **None today** — Reporting is not the cross-module variance engine |
| Product alignment (C.13.8E) | **OPTION C — deferred / per-module ownership required** |
| Board Pack / Executive / Reporting UI | **Prohibited** until module owner approves semantics + labels + truthfulness (future authorized phase) |
| Certified KPI | **No** — DSS / management reporting only; human review required |

**Options considered:** A defer entirely · B Golden helper/tests only (next) · **C selected** · D product implementation now (rejected — cross-module SoT risk)

**Module-specific variance remains owned by source modules** (M&A valuation bands, Funding runway, PMI capture vs forecast, Risk score movement, Compliance resilience, etc.). Reporting must not impose a single generic variance as enterprise truth.

## Reporting SoT layers (C.13.8C)

| Area | Source-of-truth | Product role | Status |
|---|---|---|---|
| Reporting library | SQLite `enterprise_reports`, templates, exports, evidence, schedules | Persisted **metadata** workflow; not Golden calculation engine | **OPERATIONAL DSS** |
| `reportingReadinessScore` | `calculateReportingMetrics` on metadata counts | Meta-reporting heuristic; null when no persisted data (C.13.8B) | **OPERATIONAL DSS** |
| Board Pack | `generateBoardPack` hub aggregation | DSS pack draft; `scoringTruthfulness`; not certified board-ready | **TRUTHFULNESS GATED** (C.13.8B) |
| Executive Command Center | `collectExecutiveModuleSummaries` + `readinessIndex` | DSS aggregation; `insufficient_data` for empty modules (C.13.8B) | **TRUTHFULNESS GATED** |
| REPORTING_VARIANCE | `golden_inputs.json` + `reportingGoldenFormulas.js` | Golden benchmark oracle only | **GOLDEN TESTED / PRODUCT DEFERRED** (C.13.8E) |

## REPORTING_VARIANCE — Product alignment decision (C.13.8E)

**Decision:** **OPTION C — Product alignment deferred / per-module ownership required**

`reportingVarianceGolden` remains a **Golden benchmark/oracle** (C.13.8C/D). Product **does not consume it yet** in Reporting UI, Board Pack, Executive, CEO Overview, report library, or exports.

**Options considered:** A global use now (rejected) · B Board Pack variance now (rejected) · **C deferred per-module ownership (selected)** · D UI pilot (rejected without feature flag)

### Product alignment rules

1. Reporting **does not calculate** productive variance by default.
2. Board Pack **does not compute** generic cross-module variance.
3. Executive/CEO **does not consume** generic variance as executive signal.
4. Reporting UI **does not display** generic Reporting variance.
5. Each source module **retains ownership** of its variance semantics.
6. `reportingVarianceGolden` may be used **only** as oracle/test until a future authorized implementation phase.
7. Product may use variance **only when** the source module has approved: actual + expected semantics, `expected=0` behavior, favorable/unfavorable meaning, UI labels, truthfulness metadata, and tests.

### Module variance ownership matrix

| Module | Possible variance | Owner | Product status | Reporting usage |
|---|---|---|---|---|
| M&A | Valuation actual vs expected; base vs scenario bands | M&A module | Pending module decision | **No** generic Reporting variance |
| Funding | Actual runway vs target; raise vs plan | Funding module | Pending module decision | **No** generic Reporting variance |
| PMI | Captured vs forecast synergy | PMI module | Golden + operational capture layers documented (C.13.7) | **Display only** if PMI provides approved payload; Reporting must not recalculate |
| Risk | Residual vs inherent; score movement | Risk module | Dual-layer model (Golden vs operational) | **No** generic Reporting variance |
| Compliance | Health/resilience score delta | Compliance module | Pending module decision | **No** generic Reporting variance |
| Bridge | Pipeline conversion vs target | Bridge module | Operational DSS only | **No** generic Reporting variance |
| Reporting | Generic actual vs expected/budget | Reporting Golden | Helper tested (C.13.8D); alignment deferred (C.13.8E) | **Not product-aligned yet** |

**Rule:** If no approved module owner, Reporting **must not calculate** variance.

### Prohibited until authorized future phase

| Surface | `reportingVarianceGolden` usage |
|---|---|
| Reporting UI | **Prohibited** |
| Board Pack | **Prohibited** |
| Executive Command Center | **Prohibited** |
| CEO Overview | **Prohibited** |
| Report library / exports | **Prohibited** |
| Product import of `reportingGoldenFormulas.js` | **Prohibited** (confirmed C.13.8F — no product imports) |

## C.13.8F — Reporting e2e/smoke closure + final status

**Validation (C.13.8F):**
- Product import check: `reportingGoldenFormulas` / `reportingVarianceGolden` — **only** in helper + unit tests + docs (no product wiring).
- Unit: 391 tests pass (includes 12 `reportingGoldenFormulas` oracle tests + reporting truthfulness).
- Integration: 61 tests pass — `executiveCommandCenter`, `boardPackReporting`, `reportingEnterprise` included.
- Build: pass.
- E2e: **pass** — `tests/e2e/reporting/reporting-enterprise-flow.spec.js` via `node scripts/run-e2e.mjs` (backend `:4000` + frontend `:5173` auto-started).

**Final Reporting classification (C.13.8 block):**
- Reporting library = **metadata DSS workflow** (tenant-scoped).
- Board Pack = **board review draft** DSS aggregator; truthfulness gated (C.13.8B).
- Executive = **DSS aggregation**; no silent numeric fallbacks (C.13.8B).
- `REPORTING_VARIANCE` = **Golden oracle tested**; **product alignment deferred** per-module (C.13.8E).

**Not closed / residual P2–P3:**
- PDF/HTML renderer (metadata/exportType only today).
- Per-module variance implementations (M&A, Funding, Compliance, Bridge pending owner).
- Board Pack M&A/Funding branch recalculation (documented, not Golden).
- Production smoke on deployed Render (separate from local e2e harness).
- Global cross-module SoT closure (C.13.9+).

## Governance / Board Pack boundary (C.13.9B)

**Governance status:** **DSS OPERATIONAL / PRODUCT LOGIC BASELINE / TRUTHFULNESS GATED / GOLDEN PENDING**

| Layer | Source-of-truth | Role | Status |
|---|---|---|---|
| Governance persisted data | SQLite `governance_*` via `governance.service.js` | Decisions, committees, policies, actions, controls, ESG | **OPERATIONAL DSS** |
| `governanceReadinessScore` / `boardReadinessScore` | `calculateGovernanceMetrics` | Operational DSS heuristics — **not Golden**, **not certified** | **TRUTHFULNESS GATED** (C.13.9B) |
| Governance decision packs | `governance_board_packs` | Module-owned governance decision/evidence packs | **MODULE SoT** |
| Reporting Board Pack | `boardPack.service.js` | Cross-module **board review draft** aggregator | **AGGREGATOR DSS** — not Governance workflow SoT |
| `governance.board_pack_ready` | Bridge signal key (legacy) | **Board review draft signal** — heuristic, `certifiedRating: false` | **TRUTHFULNESS LABELLED** (C.13.9B) |
| Approve workflow | API `APPROVE_GOVERNANCE_DECISION` | UI gated on same permission (C.13.9B) | **RESOLVED mismatch** |

**Empty org:** readiness scores **null**; `governanceStatus: insufficient_data`; `executiveSignalEligible: false`. Hub baselines 55/58/50 **removed** as exported scores.

**Not closed:** Golden helper/tests for governance readiness; workflow state-machine guards (P2); Controls/ESG UI gaps; CEO global fallbacks **gated C.13.10B**.

## CEO Overview / Executive Aggregator (C.13.10B)

**CEO Overview status:** **DSS AGGREGATOR / TRUTHFULNESS GATED / EXECUTIVE API ALIGNED / GOLDEN MODULES PENDING**

| Layer | Source-of-truth | Role | Status |
|---|---|---|---|
| Executive API module summaries | `executiveOverview.service.js` | Backend aggregator for command center | **TRUTHFULNESS GATED** (C.13.8–C.13.9) |
| CEO local overview helpers | `ceoOverviewTruthfulness.js` | Frontend DSS helpers — **no numeric fallbacks** when insufficient data | **TRUTHFULNESS GATED** (C.13.10B) |
| `getExecutiveSignal` | `ceoOverviewTruthfulness.js` | Averages **eligible** modules only — no fallback synthesis | **TRUTHFULNESS GATED** (C.13.10B) |
| Command Center fallback cards | `buildInsufficientFallbackModuleCards` | Empty API cards → `insufficient_data`, score null | **TRUTHFULNESS GATED** (C.13.10B) |
| Board view readiness | `boardView.service.js` | Null readiness preserved — not coerced to 0 | **TRUTHFULNESS GATED** (C.13.10B) |
| Risk empty org readiness | `risk.service.js` `calculateRiskMetrics` | No risks → `riskReadinessScore: null` | **TRUTHFULNESS GATED** (C.13.10B) |

**Empty org:** CEO local calculators return null / `insufficient_data`; radar labels N/A; executive signal pending when no eligible modules.

**Not closed:** Golden helpers for executive blend; CEO e2e empty org assertions; production smoke; cross-module SoT closure (C.13.11).

## Strategy / Board Pack boundary (C.13.9C)

**Strategy status:** **DSS OPERATIONAL / PRODUCT LOGIC BASELINE / TRUTHFULNESS GATED / GOLDEN PENDING**

| Layer | Source-of-truth | Role | Status |
|---|---|---|---|
| Strategy persisted data | SQLite `strategic_*` / `strategy_report_exports` via `strategy.service.js` | Objectives, initiatives, scenarios, market notes, risks, report metadata | **OPERATIONAL DSS** |
| `strategyReadinessScore` | `calculateStrategyMetrics` | Operational DSS heuristic — **not Golden**, **not certified** | **TRUTHFULNESS GATED** (C.13.9C) |
| `objectiveCompletion` / `scenarioConfidence` | `calculateStrategyMetrics` | Operational components — **no 60 defaults** when empty | **TRUTHFULNESS GATED** (C.13.9C) |
| `strategicRiskLevel` | `calculateStrategyMetrics` | Zero risks → `not_assessed` (not `controlled`) | **TRUTHFULNESS GATED** (C.13.9C) |
| Strategy reports | `strategy_report_exports` | **Metadata-only** draft records — not generated export pipeline | **TRUTHFULNESS LABELLED** (C.13.9C) |
| Reporting Board Pack — Strategy branch | `boardPack.service.js` | **Excluded by design** until Strategy SoT/Golden branch approved | **DOCUMENTED EXCLUSION** (C.13.9C) |
| CEO Overview Strategy score | `CEOOverviewPage.jsx` + `ceoOverviewTruthfulness.js` | Respects null / `executiveSignalEligible: false` — no fallback 60 | **TRUTHFULNESS GATED** (C.13.9C / C.13.10B) |

**Empty org:** readiness **null**; `strategyStatus: insufficient_data`; `executiveSignalEligible: false`. Defaults 60 **removed** as exported scores.

**Not closed:** Golden helper/tests for strategy readiness; Strategy Board Pack branch (future); CRUD gaps (P2); CEO global fallback audit **closed C.13.10B**.

## C.13.11A — Cross-Module Source-of-Truth Matrix

Transversal closure map after C.13.1–C.13.10B. **Human review required** on all DSS outputs unless explicitly Golden-tested and labelled.

| Module | Critical metric / signal | Owner | Type | Golden status | Product status | UI / report truthfulness | Executive / Board usage | Remaining risk |
|---|---|---|---|---|---|---|---|---|
| **M&A** | `adjustedEnterpriseValue` / `equityBase` / `netProceeds` | FE `useValuationEngine.js` | Operational DSS | Simple EV/equity/waterfall Golden tested (C.13.4C); product adjusted formulas intentionally diverge | Live engine + report alignment tested (C.13.4F/H) | DSS labels; no fairness opinion | Board Pack branch (draft); CEO M&A via API + local helpers gated | Backend snapshot/re-export policy; buyer match not certified |
| **M&A** | `buyerMatchScore` | FE `buildBuyerMatches` | Heuristic DSS | Future Golden ID | Heuristic only | Labelled DSS | CEO when deals exist | Not certified matching |
| **M&A** | `productWaterfall` / `WATERFALL_SIMPLE` | FE product vs Golden helper | Dual-layer | Golden oracle tested | Product waterfall separate | Unit-tested alignment | Reports use derived | Simple golden ≠ product waterfall |
| **Compliance** | `weightedRiskScore` | Golden helper + reports/export | Golden benchmark + report integration | `compliance_weighted_risk_score_basic` tested | Reports/export (C.13.1C-f4A) | Separated from operational | Board Pack when data | Broader model/API adoption pending |
| **Compliance** | `operationalRiskScore` | FE `useComplianceEngine` / `complianceScoring.js` | Operational DSS | N/A (not Golden) | Dashboard SoT interim | Labels/precedence (C.13.1C-f6B) | CEO via suppliers path | FE/BE field naming; persisted vs calculated |
| **Compliance** | `resilienceScore` | FE calc + Golden helper | Hybrid | `compliance_resilience_score_basic` tested | Labels/re-export (C.13.1C-f8B) | Operational vs Golden labelled | Reports when data | Backend calc SoT future |
| **Compliance** | `legalHealthScore` | Backend compliance summary | Operational DSS | Pending | Empty org null (C.13.8B/10B) | No “controlled” without data | Executive/Board Pack | CEO local helper gated |
| **Funding** | `postMoney` / ownership / dilution | FE `useFundingEngine` + Golden tests | Operational DSS + Golden oracles | `funding_*` Golden tested (C.13.3C) | Draft workspace formulas | Draft vs persisted labels (C.13.3H) | Summary via API | Dashboard runtime/e2e optional |
| **Funding** | `runway` / zero-burn | FE engine + BE summary | Operational DSS | Golden zero-burn aligned (C.13.1B) | null when zero burn | Labelled | Executive when rounds/data | localStorage draft not enterprise SoT |
| **Funding** | `readinessScore` (workspace) | FE `fundraisingScoring.js` | Operational DSS | Partial Golden coverage | Draft only | Scenario/DSS labels | Widget uses API summary | C13-P1-03 partially resolved |
| **Bridge** | `bridgePriorityGolden` | `bridgeGoldenFormulas.js` | Golden benchmark | `bridge_priority_score_basic` tested | Oracle only | Not shown as product priority | N/A in product | Do not conflate with operational |
| **Bridge** | `operationalSignalPriority` | `calculateSignalPriority()` | Operational DSS | Intentionally separate (C.13.5E) | Attention queue ordering | Human review required | Bridge signals in Executive | Not certified prioritization |
| **Bridge** | Marketplace opportunities/matches | BE + `DEMO_BRIDGE_*` fallback | Demo / future | N/A | **Quarantined** unlisted route | INTERNAL_UNLISTED_DEMO labels | Not executive SoT | Not public marketplace |
| **Risk** | `riskLikelihoodImpactGolden` | `riskGoldenFormulas.js` | Golden benchmark | `risk_score_likelihood_impact_basic` tested | Oracle only | Separated in reports (C.13.6F) | N/A as Golden in UI | Not regulatory certification |
| **Risk** | `operationalEnterpriseRiskScore` / `riskReadinessScore` | `risk.service.js` | Operational DSS | Dual-layer closed (C.13.6B) | Dashboard + readiness | Report truthfulness closed | CEO/Executive when risks exist | Empty org null (C.13.10B) |
| **PMI** | `pmiCaptureRateGolden` | `pmiGoldenFormulas.js` | Golden benchmark | Tested (C.13.7C) | Oracle only | Separated from operational | Hub when eligible | Zero forecast → null |
| **PMI** | `operationalPmiCaseCapture` / ledger / enterprise | `pmi.service.js` + FE | Operational DSS | Multi-layer documented | Zero denominator → null (C.13.7G) | UI/report labels (C.13.7F) | CEO hub gated (C.13.7E) | PDF renderer future |
| **PMI** | `operationalPmiReadinessScore` | PMI metrics pipeline | Operational DSS | Not Golden | Composite heuristic | DSS labelled | Executive/Board when data | Not certified integration health |
| **PMI** | `demoPmiCase` | `pmiStore.jsx` | Demo/template | N/A | Gated — no silent merge (C.13.7E) | Demo labelled | Not executive truth | Demo contamination if labels removed |
| **Reporting** | `reportingVarianceGolden` | `reportingGoldenFormulas.js` | Golden benchmark | Tested (C.13.8D) | **Product deferred** (C.13.8E) | Prohibited in UI/Board/CEO | **Prohibited** | Per-module variance ownership required |
| **Reporting** | Board Pack aggregator | `boardPack.service.js` | Aggregator DSS | N/A | Board **review draft** | Truthfulness gated (C.13.8B) | Executive path | Not certified board-ready |
| **Reporting** | `reportingReadinessScore` | `calculateReportingMetrics` | Operational DSS | Pending module Golden | Null when empty (C.13.8B) | Metadata workflow | Executive/Board | PDF/HTML renderer future |
| **Governance** | `governanceReadinessScore` / `boardReadinessScore` | `calculateGovernanceMetrics` | Operational DSS | **Golden pending** | Truthfulness gated (C.13.9B) | Empty → null | Executive/Board when data | Golden helper/tests pending |
| **Governance** | `governance.board_pack_ready` | Bridge signal | Heuristic DSS | N/A | `certifiedRating: false` | Board review draft | Bridge/Executive signal | Not Governance workflow SoT |
| **Governance** | Decision packs | `governance_board_packs` | Module SoT | N/A | Module-owned | Approve UI/API aligned | Distinct from Reporting Board Pack | State-machine guards P2 |
| **Strategy** | `strategyReadinessScore` | `calculateStrategyMetrics` | Operational DSS | **Golden pending** | Truthfulness gated (C.13.9C) | Empty → null | Executive when data | Golden helper/tests pending |
| **Strategy** | `strategicRiskLevel` | `calculateStrategyMetrics` | Operational DSS | N/A | Zero risks → `not_assessed` | Copy updated | CEO gated | Not certified risk posture |
| **Strategy** | Strategy reports | `strategy_report_exports` | Report metadata | N/A | Metadata-only drafts | Human review required | Board Pack **excluded** by design | No export pipeline |
| **CEO / Executive** | `executiveReadinessIndex` | `readinessIndex.service.js` | Aggregator DSS | Pending | Missing modules defensive | insufficient_data empty org | Command Center | Not certified enterprise rating |
| **CEO / Executive** | `getExecutiveSignal` | `ceoOverviewTruthfulness.js` | Aggregator DSS | N/A | Eligible modules only (C.13.10B) | No fallback synthesis | CEO ring display | Golden blend pending |
| **CEO / Executive** | `buildBoardViewSnapshot` readiness | `boardView.service.js` | Aggregator DSS | N/A | Null preserved (C.13.10B) | Board review draft copy | Board view panel | e2e empty org pending |
| **Heritage** | Continuity / assets / succession | `heritage.service.js` (assumed) | Operational / future | **Not C.13 audited** | Module exists; logic baseline not closed in C.13 | Treat as DSS preview | CEO ecosystem branch when API data | Do not overstate; Golden pending |
| **Heritage** | Ecosystem branch scores | Executive hub / ecosystem brief | Aggregator input | N/A | Null when no branch score | CEO gated via `getEcosystemBranchOverview` | CEO radar when eligible | Future module hardening |

### Cross-module usage rules (C.13.11A)

1. **Golden** metrics validate oracles in CI — they do not automatically become product headline scores unless explicitly authorized and labelled.
2. **Operational DSS** metrics are decision-support heuristics — human review required; not certified advice.
3. **Aggregators** (Reporting Board Pack, Executive, CEO) must not invent scores when module data is insufficient.
4. **Demo/template** layers must never appear as enterprise persisted truth without explicit labelling.
5. **Board Pack** outputs are **board review drafts** — not board-approved or certified filings.

## Executive Overview Special Rule

Executive Overview reads module summaries and may show blended scores when modules are eligible.

It must remain a read-mostly aggregation layer unless an explicit authorized workflow writes elsewhere.

Status: **TRUTHFULNESS GATED** (C.13.10B) — DSS aggregator; not master operational store; not enterprise certified.

## Bridge Marketplace Special Rule

`/bridge/marketplace` data may show `DEMO_BRIDGE_*` fallback.

**Policy (C.13.5B/C):** `INTERNAL_UNLISTED_DEMO / FUTURE_PRIVATE_NETWORK` — not public marketplace; transaction layer and success-fee logic **not active** in product; heuristic matching only; production quarantine guard `VITE_ENABLE_BRIDGE_MARKETPLACE` (C.13.5C).

Status: Partially resolved (quarantine labels C.13.5B + guard C.13.5C). Known demo/fallback contamination risk if labels removed.

Not a source-of-truth for production pilot narrative.

## C.13.11A — Global closure status

**C.13 global logic baseline:** **CLOSED / P2–P3 ENTERPRISE HARDENING PENDING** (C.13.12 final gate)

| Verdict | Meaning |
|---|---|
| **Logic baseline closed** | C.13.1–C.13.12 documented and verified (418 unit / 65 integration / build / 4 priority e2e) |
| **Not enterprise certified** | No module is externally certified; DSS + human review positioning required |
| **Not procurement-ready** | SOC2/ISO/SLA/legal certification not claimed |
| **Pending hardening** | Golden helpers (Governance/Strategy/Executive blend), production Render smoke, PDF renderer, per-module variance, e2e gaps |

**Do not use:** fully enterprise complete · production certified · SOC2 ready · certified compliance/risk/governance · autonomous decision engine · public marketplace · fairness opinion.

**Next authorized phases:** C.13.12 Global Logic Integrity Final Gate / Release Readiness Audit · Production Render smoke · Governance/Strategy Golden helpers · Sales/demo pack (after explicit authorization).

## C.13.12 — Global Logic Integrity Final Gate (CLOSED)

**Final status:** **C.13 GLOBAL LOGIC BASELINE CLOSED / P2–P3 ENTERPRISE HARDENING PENDING**

| Gate | Result |
|---|---|
| Unit tests | 418 passed |
| Integration tests | 65 passed |
| Build | pass |
| Reporting e2e | pass |
| Governance e2e | pass |
| Strategy e2e | pass |
| CEO command center e2e | pass |
| Golden product imports | none verified in `src/` |
| CEO fallback scores | gated (C.13.10B) |
| P1 logic blockers | **none known** |

**Not claimed:** enterprise certified · procurement-ready · SOC2/ISO · all modules complete · production certified.

**P2 residuals:** Governance/Strategy Golden · Render smoke · PDF renderer · per-module variance · ~~PMI `mergeWithDemo` stale reference~~ **resolved C.13.12B** · `executiveReports` readiness `\|\| 0` · Heritage audit · broader e2e.

**Next:** Production Render smoke · C.14 Enterprise Hardening.
