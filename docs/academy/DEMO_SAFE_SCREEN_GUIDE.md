# Demo-Safe Screen Guide

Use this guide to decide what can be shown in external visuals.

| Screen | Classification | Reason | Required wording | Notes |
|---|---|---|---|---|
| CEO Overview dashboard | SAFE_TO_SHOW_EXTERNAL | Core synthetic executive entry point | "Executive DSS aggregator, not source-of-truth." | Keep N/A visible |
| CEO Overview radar/cards | SHOW_WITH_LABELS | Aggregated signals can be overread | "DSS signal with eligibility limits." | No certified health score |
| Reporting dashboard | SAFE_TO_SHOW_EXTERNAL | Core Board Intelligence spine | "Reporting prepares Board Review Drafts." | Use synthetic data |
| Board Packs | SAFE_TO_SHOW_EXTERNAL | Core demo path | "Board Review Draft workspace." | No board-approved claim |
| Persisted snapshot list | SAFE_TO_SHOW_EXTERNAL | Shows traceability | "Persisted review snapshot." | Hide tenant/org internals |
| Create snapshot action | SAFE_TO_SHOW_EXTERNAL | Shows practical workflow | "State changes after backend confirmation." | No fake saved state |
| HTML Board Review Draft preview | SAFE_TO_SHOW_EXTERNAL | Core proof point | "HTML Board Review Draft, Human Review Required." | Not certified PDF |
| Workflow panel | SHOW_WITH_LABELS | States can be misunderstood | "reviewed/internal_final are human workflow states, not board approval." | Avoid destructive actions unless disposable |
| Browser print/save PDF | SHOW_WITH_LABELS | Export wording risk | "Browser-native save-as-PDF convenience copy." | Not product-certified PDF |
| M&A dashboard | SAFE_TO_SHOW_EXTERNAL | Useful branch demo | "Indicative DSS deal preparation." | Not fairness opinion |
| M&A valuation/waterfall | SHOW_WITH_LABELS | Valuation can be overread | "Indicative valuation context." | Not certified valuation |
| Buyer matching | SHOW_WITH_LABELS | Marketplace/network risk | "Buyer fit signal only." | No verified live buyer network claim |
| Funding dashboard | SAFE_TO_SHOW_EXTERNAL | Useful branch demo | "Scenario support, not investment advice." | Preserve N/A |
| Funding dilution/runway | SHOW_WITH_LABELS | Missing/ratio risk | "Display scenario, not recommendation." | No fake 0 |
| Compliance dashboard/suppliers | SAFE_TO_SHOW_EXTERNAL | Useful branch demo | "Operational compliance DSS." | Not certified audit |
| Supplier detail/evidence | SHOW_WITH_LABELS | Sensitive-data risk | "Synthetic evidence view." | No real supplier data |
| Risk heatmap/register | SAFE_TO_SHOW_EXTERNAL | Useful branch demo | "Likelihood/impact DSS visualization." | Not certified rating |
| PMI synergies | SHOW_WITH_LABELS | Forecast can be overread | "Forecast/demo synergy planning." | No guaranteed capture |
| Governance decisions | SAFE_TO_SHOW_EXTERNAL | Decision workflow fits DSS | "Decision traceability for review." | Not governance certification |
| Strategy initiatives | SAFE_TO_SHOW_EXTERNAL | Useful planning context | "Strategic planning support." | Empty-state honesty |
| Bridge dashboard/signals | SHOW_WITH_LABELS | Internal/demo signal layer | "Internal/unlisted demo signal layer." | Avoid public marketplace framing |
| Bridge Marketplace | FUTURE_ONLY | Marketplace-live claim risk | "Future/internal opportunity layer, not a live marketplace." | Do not show as active public marketplace |
| Heritage dashboard | FUTURE_ONLY | Premium/future layer | "Premium/future strategic layer, not core pilot scope." | Do not imply enterprise maturity certification |
| Developer console | DO_NOT_SHOW | Secret/debug risk | N/A | Close before capture |
| API/network panel | DO_NOT_SHOW | Token/data risk | N/A | Never show in external visuals |
| Account/profile with real email | DO_NOT_SHOW | Personal data risk | N/A | Use synthetic/blur outside repo if needed |

---

## C.24.3b Demo UI Polish Notes

| Screen | Classification | Reason | Required wording | Notes |
|---|---|---|---|---|
| Compliance alert/supplier review cards | SAFE_TO_SHOW_EXTERNAL | Placeholder copy removed | "Synthetic alert/supplier review; human review required." | Not a certified audit |
| Reporting snapshot table/actions | SAFE_TO_SHOW_EXTERNAL | Table wrapping and action hints improved | "Workflow changes appear only after backend confirmation." | Internal Final is not board approval |
| M&A report controls | SHOW_WITH_LABELS | Export wording can be misread | "HTML draft and browser print/save-as-PDF convenience copy." | Not certified PDF |
| CEO Overview Bridge card | SHOW_WITH_LABELS | Marketplace wording risk | "Internal/unlisted demo layer, not a live marketplace." | Keep future/demo boundary |

Validation notes:

- Build and unit tests passed after C.24.3b polish.
- Playwright navigation smoke was not completed because the local Vite server was not running; run it again during recording rehearsal.

---

## C.24.3c Demo UI Layout Integration Notes

| Screen | Classification | Reason | Required wording | Notes |
|---|---|---|---|---|
| Enterprise tables across demo-safe modules | SAFE_TO_SHOW_EXTERNAL | Table shells softened and integrated into panels | "DSS table evidence; human review required." | No floating/sticker table treatment |
| Reporting snapshot list | SAFE_TO_SHOW_EXTERNAL | Persisted snapshots now use shared enterprise table shell | "Persisted review snapshot." | Revoked snapshots remain blocked from active preview |
| Reporting table actions | SAFE_TO_SHOW_EXTERNAL | Buttons toned into panel/table surface | "Workflow changes appear only after backend confirmation." | Disabled states must remain visible |
| Reporting table headers | SAFE_TO_SHOW_EXTERNAL | Sticky/z-index visual stacking removed from enterprise table headers | "Board Review Draft workspace." | No board-approved claim |

Validation notes:

- Build and unit tests passed after C.24.3c layout integration polish.
- Playwright navigation smoke was not completed because the local Vite server was not running; run it again during recording rehearsal.

---

## C.24.3d Final Cross-Branch Visual Integration Notes

| Screen | Classification | Reason | Required wording | Notes |
|---|---|---|---|---|
| Cross-branch enterprise panels | SAFE_TO_SHOW_EXTERNAL | Repeated glow/shadow layers reduced | "DSS workspace; human review required." | Panels should feel native to page surface |
| Legacy table wrappers | SAFE_TO_SHOW_EXTERNAL | Aligned with enterprise table shell | "Evidence table; missing data remains visible." | No sticky/z-index header layer |
| M&A/Funding/Compliance/Risk/PMI tables | SHOW_WITH_LABELS | Table headers softened across branch surfaces | "Indicative DSS data; not certification or advice." | Preserve N/A and insufficient_data |
| Reporting/Strategy tables | SAFE_TO_SHOW_EXTERNAL | Existing table integration preserved and consolidated | "Board Review Draft / strategic DSS context." | No board-approved or certified claim |
| Bridge/Heritage surfaces | SHOW_WITH_LABELS | Styling remains surface-only | "Internal/demo/future layer." | Do not present as live marketplace or core pilot maturity |

Validation notes:

- Build and unit tests passed after C.24.3d cross-branch visual integration.
- Playwright navigation smoke was not completed because the local Vite server was not running; run it again during recording rehearsal.

---

## C.24.3e Cross-Branch Action Surface Integration Notes

| Screen | Classification | Reason | Required wording | Notes |
|---|---|---|---|---|
| Shared workspace action rows | SAFE_TO_SHOW_EXTERNAL | Accent-edge wrapper softened into integrated action surface | "DSS action surface; human review required." | Buttons should not appear on sticker rectangles |
| Reporting snapshot/filter actions | SAFE_TO_SHOW_EXTERNAL | Action wrappers toned down and aligned with table shell | "Workflow changes appear only after backend confirmation." | Internal Final is not board approval |
| Risk register/filter actions | SAFE_TO_SHOW_EXTERNAL | Toolbar treatment aligned with Reporting | "Risk DSS visualization, not certified rating." | Preserve N/A and insufficient_data |
| Strategy filter/actions | SAFE_TO_SHOW_EXTERNAL | Toolbar treatment aligned with Reporting/Risk | "Strategic planning support." | Empty-state honesty remains required |
| Enterprise table toolbars/footers | SAFE_TO_SHOW_EXTERNAL | Controls now sit inside the table surface | "Evidence table; missing data remains visible." | No floating/sticker toolbar treatment |
| Bridge/Heritage surfaces | SHOW_WITH_LABELS | Borders softened only; truthfulness labels preserved | "Internal/demo/future layer." | Do not present as live marketplace or core pilot maturity |

Validation notes:

- Build and unit tests passed after C.24.3e action-surface integration.
- Playwright navigation smoke passed after C.24.3e action-surface integration.

---

## C.24.3f Cross-Branch Visual Parity Notes

| Screen | Classification | Reason | Required wording | Notes |
|---|---|---|---|---|
| M&A reference surfaces | SAFE_TO_SHOW_EXTERNAL | Approved visual reference for integrated cards/actions | "Indicative DSS deal preparation." | Not fairness opinion |
| Funding dashboard cards | SAFE_TO_SHOW_EXTERNAL | Surface treatment aligned with approved M&A pattern | "Scenario support, not investment advice." | Preserve N/A and no fake 0 |
| Compliance dashboard/suppliers/evidence/reports | SAFE_TO_SHOW_EXTERNAL | Cards aligned with approved M&A pattern | "Operational compliance DSS; human review required." | Not certified audit |
| Reporting panels | SAFE_TO_SHOW_EXTERNAL | Panels aligned with approved M&A surface hierarchy | "Board Review Draft workspace." | No board-approved claim |
| Risk register/panels | SAFE_TO_SHOW_EXTERNAL | Panels aligned with approved M&A surface hierarchy | "Risk DSS visualization, not certified rating." | Keep insufficient_data visible |
| PMI/Governance/Strategy panels | SAFE_TO_SHOW_EXTERNAL | Panels aligned with approved M&A surface hierarchy | "Planning and governance DSS support." | Not certification or autonomous approval |

Validation notes:

- Build, unit tests, and Playwright navigation smoke passed after C.24.3f visual parity.
