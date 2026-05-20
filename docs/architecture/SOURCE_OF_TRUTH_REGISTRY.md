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
| M&A valuation | enterprise value, equity value | Pending C.13 audit | Source unclear | FE/BE duplicate possible | ma_valuation_* | Not pilot-ready until validated |
| M&A waterfall | seller proceeds | Pending C.13 audit | Source unclear | | ma_waterfall_simple_distribution | |
| M&A buyer matching | match scores | Pending C.13 audit | Source unclear | | futureDatasetsRequired | |
| Funding rounds | round records | backend funding services/API | Assumed / Pending C.13 validation | | N/A | |
| Funding summary | dashboard summary | backend funding summary | Assumed / Pending C.13 validation | | N/A | |
| Funding scenarios | scenario inputs | Possible localStorage/client draft | Known duplicate risk | localStorage vs API | funding_* | Label in UI required |
| Compliance supplier | riskScore persisted | backend compliance tables | Assumed / Pending C.13 validation | Client calc may diverge | compliance_weighted_* | |
| Compliance scoring | displayed score | Unknown FE vs BE precedence | Known duplicate risk | | compliance_* | C.13.3 target |
| Compliance evidence | evidence/reviews | backend compliance services | Assumed / Pending C.13 validation | | N/A | |
| Governance decisions | decision workflow state | backend governance services | Assumed / Pending C.13 validation | Approve UX gaps | N/A | Strong backend per C.5 |
| PMI case dashboard | workstreams, ledger in case | pmi_cases JSON payload | Assumed / Pending C.13 validation | mergeWithDemo contamination | N/A | C.13.6 target |
| PMI enterprise synergies | synergy initiatives table | pmi_synergy_initiatives | Assumed / Pending C.13 validation | Not synced with case ledger | pmi_synergy_* | Dual model |
| Bridge signals | recalculated signals | bridge_signals + engine heuristics | Human review required | Heuristic not certified | bridge_priority_score_basic | |
| Bridge marketplace | opportunities | bridge_opportunities + DEMO fallback | Known demo/fallback contamination risk | Unlisted route | N/A | Do not promote |
| Risk register | likelihood x impact | Pending C.13 audit | Source unclear | | risk_score_likelihood_impact_basic | |
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

## Executive Overview Special Rule

Executive Overview reads module summaries and may show blended scores.

It must remain a read-mostly aggregation layer unless an explicit authorized workflow writes elsewhere.

Status: Assumed / Pending C.13 validation.

## Bridge Marketplace Special Rule

`/bridge/marketplace` data may show DEMO_BRIDGE fallback.

Status: Known demo/fallback contamination risk.

Not a source-of-truth for production pilot narrative.

## Next Step

C.13.0 and C.13.1–C.13.8 must validate this registry against actual code paths, stores, APIs, and tests.

Update status fields from Assumed to Confirmed, Mismatch, or Known duplicate risk only with audit evidence.
