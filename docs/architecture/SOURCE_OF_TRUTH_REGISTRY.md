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
| Compliance weightedRiskScore | explicable 3-dimension score | Golden Dataset + Formula Registry (`COMPLIANCE_WEIGHTED_RISK`) | Canonical (docs) / Pending implementation | No helper in code yet | compliance_weighted_risk_score_basic | C.13.1C-f1B Option C |
| Compliance operationalRiskScore | dashboard operational score | Frontend `calculateSupplierRiskScore` + `useComplianceEngine` (current) | Assumed / Pending hardening | Collides with field name `riskScore`; FE may override BE | N/A | Not golden oracle |
| Compliance riskScore persisted | stored supplier fields | backend `compliance_suppliers` via payload clamp | Confirmed persistence SoT | Not calculation SoT; may differ from UI displayed score | N/A | Persistence only |
| Compliance resilienceScore persisted | stored supplier fields | backend `compliance_suppliers` via payload clamp | Confirmed persistence SoT | FE recalculates on read; formula alignment pending | compliance_resilience_score_basic | C.13.1C-f1B |
| Compliance resilienceScore calculated | UI resilience metric | Frontend `calculateResilienceScore` (current) | Assumed / Pending alignment | Differs from golden formula | compliance_resilience_score_basic | Subphase after naming |
| Compliance evidence | evidence/reviews | backend compliance services | Assumed / Pending C.13 validation | | N/A | |
| Governance decisions | decision workflow state | backend governance services | Assumed / Pending C.13 validation | Approve UX gaps | N/A | Strong backend per C.5 |
| PMI case dashboard | workstreams, ledger in case | pmi_cases JSON payload | Assumed / Pending C.13 validation | mergeWithDemo contamination | N/A | C.13.6 target |
| PMI enterprise synergies | synergy initiatives table | pmi_synergy_initiatives | Assumed / Pending C.13 validation | Not synced with case ledger | pmi_synergy_* | Dual model |
| Bridge signals | recalculated signals | bridge_signals + `bridge.service.js` heuristics | Partially resolved (C.13.5E Option C) | Dual-layer: `bridgePriorityGolden` vs `operationalSignalPriority`; product unchanged | bridge_priority_score_basic | DSS; human review required |
| Bridge marketplace | opportunities / matches | BE bridge API + DEMO fallback | Partially resolved (C.13.5B labels) | Unlisted route; not pilot marketplace | N/A | INTERNAL_UNLISTED_DEMO |
| Risk register / enterprise scoring | `risk_register` + `risk.service.js` | Partially resolved (C.13.6B Option C) | Dual-layer: `riskLikelihoodImpactGolden` vs `operationalEnterpriseRiskScore`; UI heatmap gaps pending | risk_score_likelihood_impact_basic | DSS; human review required; not insurance/regulatory certification |
| Reporting KPIs | variance metrics | Pending C.13 audit | Source unclear | | reporting_kpi_variance_basic | |
| Executive Overview | module health / radar | Aggregator from module summaries | Assumed / Pending C.13 validation | Fallback if API fails | executive_module_health_average_basic | Not master store |
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
| **Golden benchmark** | `riskLikelihoodImpactGolden` | **Pending** helper (C.13.6C) | `likelihood × impact` (1–5); severity bands per Golden | Oracle for logic integrity, Golden Dataset, CI tests |
| **Operational DSS** | `operationalEnterpriseRiskScore` | `riskScoreFrom()` in `risk.service.js` (internal) | `(severityRank + likelihood + impact) / 15 × 100` with inherent/residual severity | Dashboard KPIs, readiness, portfolio posture, bridge signals |

**Golden reference:** `risk_score_likelihood_impact_basic` — L=4, I=5 → **20**, severity **critical** (band 16–25).

**Operational reference (same L/I, product defaults):** medium/medium severities → score **~80**; critical/critical → **~93** — **not** Golden 20.

**Rules:**

1. Golden benchmark validates mathematical oracle — **not** live dashboard/residual KPI unless explicitly authorized in a future phase.
2. Operational score is a **DSS heuristic** — not regulatory risk certification, not insurance underwriting, not autonomous risk acceptance.
3. UI, reports and exports must **not** present `operationalEnterpriseRiskScore` / residual KPI as Golden-equivalent or formula-certified.
4. Separate Risk domains (M&A `riskScoring.js`, Compliance supplier risk, PMI/strategy risk entities) are **not** `RISK_LIKELIHOOD_IMPACT` — do not conflate in narrative.
5. Aligning product to Golden (Option B), golden helper (C.13.6C), operational tests (C.13.6D), or UI heatmap alignment (C.13.6E) require **separate authorized phases** — not implied by C.13.6B.

**C13-P1-08 status:** PARTIALLY RESOLVED / DECISION DOCUMENTED — mismatch separated; golden/operational tests pending; no global RESOLVED.

## Executive Overview Special Rule

Executive Overview reads module summaries and may show blended scores.

It must remain a read-mostly aggregation layer unless an explicit authorized workflow writes elsewhere.

Status: Assumed / Pending C.13 validation.

## Bridge Marketplace Special Rule

`/bridge/marketplace` data may show `DEMO_BRIDGE_*` fallback.

**Policy (C.13.5B/C):** `INTERNAL_UNLISTED_DEMO / FUTURE_PRIVATE_NETWORK` — not public marketplace; transaction layer and success-fee logic **not active** in product; heuristic matching only; production quarantine guard `VITE_ENABLE_BRIDGE_MARKETPLACE` (C.13.5C).

Status: Partially resolved (quarantine labels C.13.5B + guard C.13.5C). Known demo/fallback contamination risk if labels removed.

Not a source-of-truth for production pilot narrative.

## Next Step

C.13.0 and C.13.1–C.13.8 must validate this registry against actual code paths, stores, APIs, and tests.

Update status fields from Assumed to Confirmed, Mismatch, or Known duplicate risk only with audit evidence.
