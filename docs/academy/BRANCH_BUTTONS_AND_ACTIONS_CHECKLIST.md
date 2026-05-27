# Branch Buttons and Actions Checklist

Use this checklist while recording the practical user manual video. Button names may vary slightly by UI state; use the visible product label on screen.

Use `DEMO_SAFE_SCREEN_GUIDE.md` before deciding whether to show, label, limit, or skip a screen.

| Branch | Main buttons/actions | Demonstrate | Do not demonstrate | Data needed | Expected result | Risk/truthfulness note |
|---|---|---|---|---|---|---|
| CEO Overview | Sidebar nav, cards, detail links, radar/attention queue | Executive aggregation and N/A behavior | Certified enterprise health | Synthetic module signals | Cards/radar load | Aggregator only, not SoT |
| Reporting | Reporting nav, Board Packs, create snapshot, preview | Persisted Board Review Draft workflow | Certified export or board approval | Board pack context | Snapshot created/listed/previewed | Draft + Human Review Required |
| M&A | Dashboard, pipeline, valuation, waterfall, reports | Indicative deal preparation | Fairness opinion or final valuation | Synthetic deal/target context | Deal context visible | DSS only |
| Funding | Dashboard, capital structure, scenarios | Runway/dilution/readiness scenario | Investment advice or guaranteed financing | Synthetic funding values | Scenario cards/charts visible | Missing dilution stays N/A |
| Compliance | Dashboard, suppliers, evidence, reports | Evidence/risk workflow | Certified compliance or legal clearance | Supplier/evidence context | Risk/evidence summary visible | Not certified audit |
| Risk | Register, heatmap, mitigations, reports | Likelihood/impact review | Certified risk rating | Risk register | Heatmap/register visible | DSS severity only |
| PMI | Programs, synergies, milestones, risks | Integration planning | Guaranteed synergy capture | Forecast/demo PMI data | Plan/forecast visible | Label forecast/demo |
| Governance | Decisions, meetings, committees, audit trail | Decision workflow | Certified governance maturity | Synthetic decisions | Workflow visible | Human review required |
| Strategy | Objectives, initiatives, scenarios, risks | Strategy alignment | Guaranteed outcome | Synthetic initiatives | Initiatives/scenarios visible | Empty state honesty |
| Bridge | Dashboard, signals, marketplace if shown | Internal signal layer | Public marketplace live or success-fee platform | Synthetic/internal signals | Internal signals visible | Internal/unlisted/demo only |
| Heritage | Dashboard, assets, succession, reports | Future/premium narrative | Enterprise maturity certification | Synthetic/future context | Narrative visible | Roadmap/premium context |

## Pre-Recording Action Safety

- Prefer view-only actions unless the video needs to demonstrate snapshot creation.
- Avoid destructive actions unless the runbook explicitly requires them.
- If showing archive/revoke, use a clearly disposable synthetic snapshot.
- Do not show real credentials, real user profiles, real customer names, or debug consoles.

## Show / Do-Not-Show Classification

| Classification | Meaning |
|---|---|
| SAFE_TO_SHOW_EXTERNAL | Can appear in synthetic external academy material after normal QA |
| SHOW_WITH_LABELS | Can appear only with explicit narration/onscreen caveat |
| INTERNAL_ONLY | Keep for operator training unless separately approved |
| FUTURE_ONLY | Mention as roadmap/future/internal context only |
| DO_NOT_SHOW | Do not capture or publish |
