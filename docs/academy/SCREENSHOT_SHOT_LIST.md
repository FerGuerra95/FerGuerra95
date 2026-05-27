# Screenshot Shot List

This shot list defines the screenshots to capture for the visual manual, practical walkthrough video, thumbnails, and commercial education assets. Store screenshots outside the repository unless a later phase explicitly authorizes media assets.

| Shot ID | Module | Screen | Purpose | Must show | Must not show | Caption | Risk label |
|---|---|---|---|---|---|---|---|
| CEO-01 | CEO Overview | Full dashboard | Opening visual for executive command center | Cards, radar/summary, synthetic context | Real company/client data | "Executive DSS overview using synthetic IberNova data." | Aggregator only |
| CEO-02 | CEO Overview | Executive cards | Explain branch signals | Module cards, N/A where applicable | Fake 0 values | "Module signals summarize, they do not certify." | No certified health score |
| CEO-03 | CEO Overview | Radar | Show aggregate visualization | Axis labels, readable scale | NaN/undefined/Infinity | "Radar values are DSS signals with eligibility limits." | N/A discipline |
| CEO-04 | CEO Overview | N/A / insufficient_data | Teach missing-data behavior | N/A, insufficient_data, missing question | Hidden missing data | "Missing data remains visible." | No fake certainty |
| REP-01 | Reporting | Reporting dashboard | Introduce Board Intelligence | Reporting navigation, KPI area | Board-approved copy | "Reporting is the Board Intelligence spine." | Draft-only |
| REP-02 | Reporting | Board Packs | Show board pack workspace | Board Packs title/actions | Certified report claim | "Board Packs prepare draft review artifacts." | Not certified |
| REP-03 | Reporting | Snapshot list | Show persistence | Snapshot title, status, dates | Tenant/org IDs, secrets | "Persisted snapshots preserve review state." | Tenant scoped |
| REP-04 | Reporting | Create snapshot | Show creation action | Create button, safe payload context | organizationId as source-of-truth | "State changes only after backend confirmation." | No fake persisted state |
| REP-05 | Reporting | Board Review Draft preview | Show premium preview | Logo/header, Board Review Draft, Human Review Required | Board Approved, Certified PDF | "HTML Board Review Draft for human review." | Not board-approved |
| REP-06 | Reporting | Workflow panel | Explain states | draft/reviewed/internal_final labels | AI approval claim | "Workflow states are human-gated." | Human review |
| REP-07 | Reporting | HTML preview | Manual artifact view | Confidential, Not Board Approved, metadata | Legal/investment advice | "Review-ready HTML draft." | DSS only |
| REP-08 | Reporting | Browser print/save PDF | Teach export workaround | Browser print dialog, Save as PDF | Certified PDF claim | "Browser-native save-as-PDF convenience copy." | Not certified PDF |
| FUN-01 | Funding | Dashboard | Show funding overview | Runway/dilution/readiness cards | Investment advice wording | "Funding supports scenario clarity." | Not advice |
| FUN-02 | Funding | Runway | Explain runway | Runway value or N/A | Fake zero | "Runway is shown only when inputs support it." | Missing stays N/A |
| FUN-03 | Funding | Dilution | Explain dilution display | Dilution value/N/A | NaN/Infinity | "Dilution is display-only and missing values remain N/A." | No fake 0 |
| FUN-04 | Funding | Funding risk/readiness | Show DSS signal | Risk/readiness labels | Guaranteed financing | "Readiness is a DSS signal." | Not guarantee |
| MA-01 | M&A | Dashboard | Show deal preparation | Pipeline/deals overview | Real target names | "M&A structures deal preparation." | Synthetic only |
| MA-02 | M&A | Valuation | Show valuation context | EV/equity/net debt labels | Certified valuation | "Indicative DSS valuation context." | Not fairness opinion |
| MA-03 | M&A | Waterfall | Show mechanics | Waterfall labels | Board decision claim | "Waterfall supports review, not final approval." | Indicative |
| MA-04 | M&A | Buyer matching | Show fit | Buyer fit labels | Live verified buyer network claim | "Buyer fit is a DSS signal." | Not marketplace |
| COMP-01 | Compliance | Suppliers | Show supplier risk | Supplier list/status | Real supplier data | "Supplier view uses synthetic data." | Not audit |
| COMP-02 | Compliance | Supplier detail | Show evidence gaps | Evidence/missing data | Personal data | "Evidence gaps become review questions." | Not legal clearance |
| COMP-03 | Compliance | Evidence | Show evidence workflow | Evidence cards/status | Certified compliance | "Evidence supports human review." | Not certified |
| RISK-01 | Risk | Risk map/heatmap | Show likelihood-impact | Heatmap/legend | Certified rating | "Heatmap is DSS risk visualization." | Not certification |
| RISK-02 | Risk | Register/report | Show risk list | Risk rows/mitigations | NaN/undefined | "Risks remain reviewable and traceable." | DSS severity |
| PMI-01 | PMI | Synergies | Show synergy planning | Estimate/capture/cost labels | Guaranteed synergy | "Synergies are forecast/demo signals." | Forecast label |
| PMI-02 | PMI | Integration risk | Show integration plan | Milestones/risk | Actual operating proof if demo only | "Integration plan is review context." | Demo/forecast |
| GOV-01 | Governance | Decisions/workflow | Show board workflow | Decision status, owner | Governance certification | "Decision traceability supports review." | Human review |
| STR-01 | Strategy | Initiatives | Show strategy alignment | Objectives/initiatives | Guaranteed strategy outcome | "Strategy organizes priorities." | Empty-state honesty |
| BRG-01 | Bridge | Signals/dashboard | Show cross-module signals | Internal/unlisted label | Public marketplace live | "Bridge is internal/unlisted demo context." | Future/internal |
| BRG-02 | Bridge | Marketplace if shown | Explain boundary | Future/internal wording | Success-fee live claim | "Future/internal opportunity layer, not live marketplace." | FUTURE_ONLY |
| HER-01 | Heritage | Dashboard | Show premium/future layer | Heritage labels | Enterprise maturity certification | "Heritage is premium/future continuity context." | FUTURE_ONLY |

## Thumbnail Candidates

- REP-05: Board Review Draft preview.
- CEO-01: CEO Overview full dashboard.
- REP-03: Persisted snapshots.
- FUN-01: Funding dashboard.
- MA-02: M&A valuation context.

