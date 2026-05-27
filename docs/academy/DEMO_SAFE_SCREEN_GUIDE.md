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
