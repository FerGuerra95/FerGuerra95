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

---

## C.24.3g Focused M&A + Compliance Reports Notes

| Screen | Classification | Reason | Required wording | Notes |
|---|---|---|---|---|
| M&A dashboard action rows | SAFE_TO_SHOW_EXTERNAL | Action wrappers softened; real actions preserved | "Indicative M&A DSS preparation; human review required." | No fairness opinion or autonomous approval |
| M&A Deal Pipeline | SAFE_TO_SHOW_EXTERNAL | Pipeline board/empty-state spacing compacted | "Pipeline view for internal deal tracking." | No fake deal matching or guaranteed outcome |
| M&A Deals Repository | SAFE_TO_SHOW_EXTERNAL | Hero/archive spacing reduced before "Deal archive at a glance" | "Private deal archive; saved snapshots may differ from live engine." | Saved snapshot is not live valuation |
| Compliance Reports draft controls | SAFE_TO_SHOW_EXTERNAL | Builder framing replaced with review controls | "Draft controls; Human Review Required." | Not legal advice or certified audit |
| Compliance Reports evidence base | SAFE_TO_SHOW_EXTERNAL | Report content reframed as evidence/review base | "Evidence and review base for DSS draft." | Missing evidence remains visible |
| Compliance Reports library | SAFE_TO_SHOW_EXTERNAL | Generated-report staging language replaced with draft-library language | "Board review draft library." | Not board-approved; not certified PDF |

Validation notes:

- Build, unit tests, and Playwright navigation smoke passed after C.24.3g focused visual QA.

---

## C.24.3g-b Targeted Layer-Removal Notes

| Screen | Classification | Reason | Required wording | Notes |
|---|---|---|---|---|
| CEO Overview hero / readiness cards | SAFE_TO_SHOW_EXTERNAL | Removed double `ceo-glass-branch` frame on hero + inner cards | "Executive Command Center; decision-support only." | Deferred copy cleanup in C.24.3h |
| M&A dashboard action rows (re-check) | SAFE_TO_SHOW_EXTERNAL | Removed nested `.ma-glass-block` sticker layer | Same as M&A dashboard above | Re-verify after C.24.3g-b |
| M&A pipeline columns (re-check) | SAFE_TO_SHOW_EXTERNAL | Column height now content-driven | Same as pipeline above | Re-verify empty columns |
| Compliance Reports panels (re-check) | SAFE_TO_SHOW_EXTERNAL | `.report-panel-note` replaces nested glass blocks | Draft controls / evidence base / library | Re-verify no builder look |

Validation: `npm run build` PASS after C.24.3g-b. Operator visual pass required before recording.

---

## C.24.3g-c â?? Runtime Override Visual Fix

| Screen | Classification | Reason | Required wording | Notes |
|---|---|---|---|---|
| M&A dashboard action rows | SAFE_TO_SHOW_EXTERNAL | `maExecutiveTheme.css` no longer paints `.ma-action-row a` with permanent gradient box | Decision-support; not investment advice | Hard-refresh `/ma/dashboard` |
| M&A pipeline | SAFE_TO_SHOW_EXTERNAL | Removed `align-items: stretch` + `min-height: 380px` column override | Same as pipeline | Hard-refresh `/ma/pipeline` |
| M&A deals archive | SAFE_TO_SHOW_EXTERNAL | Tighter section rhythm; archive follows hero without artificial void | Private deal archive | Hard-refresh `/ma/deals` |
| CEO Overview hero | SAFE_TO_SHOW_EXTERNAL | Hero without `ceo-glass-branch`; readiness card not double-accented | Executive Command Center; DSS only | Hard-refresh `/dashboard` |
| Compliance Reports | SAFE_TO_SHOW_EXTERNAL | Flat list cards; Review controls / Board review draft library | Not certified audit | Hard-refresh `/compliance/reports` |

**Baseline:** `29bfc93`. **Validations:** build PASS; Playwright navigation smoke PASS; unit 537/552 (4 sqlite ABI skips local env).

---

## C.24.3j - Executive Inner Surface System (Demo Safety)

| Screen | Classification | Reason | Required wording | Notes |
|---|---|---|---|---|
| CEO Overview inner readiness/radar cards | SAFE_TO_SHOW_EXTERNAL | Uses shared curved executive inner surface primitive aligned to approved M&A card finish | "Executive Command Center; decision-support only." | Keep `N/A` / `insufficient_data` visible |
| Funding / Compliance / Reporting inner panels | SAFE_TO_SHOW_EXTERNAL | Equivalent inner surfaces aligned to shared executive primitive, reduced layered builder look | "Indicative DSS workspace; human review required." | No certification claims |
| Risk / PMI / Governance / Strategy inner panels | SAFE_TO_SHOW_EXTERNAL | Inner cards aligned to the same premium curved system | "Planning and monitoring DSS support." | Not autonomous approval |
| Bridge / Heritage visible inner panels | SAFE_TO_SHOW_EXTERNAL | Surface alignment only; no feature activation | "Internal DSS surface; human review required." | Maintain internal/future framing |

Validation notes:

- `npm run build` PASS.
- `npx vitest run tests/unit/ceo-overview/ceoOverviewTruthfulness.test.js` PASS.
- `npm run test:unit` has known local `better-sqlite3` ABI mismatch (environment-only; outside visual scope).

### C.24.3j-b demo safety note (CEO-first)

This checkpoint applies the approved M&A inner-surface copy to CEO Overview first.  
No other branch surface rollout is included in this subphase.

### C.24.3j-b demo safety note (visible branch rollout)

Expanded to visible branch inner surfaces using the same approved primitive:

- Funding (dashboard/readiness)
- Compliance (dashboard/reports)
- Reporting
- Risk
- PMI
- Governance
- Strategy

Safety posture unchanged: DSS-only, human review required, and no formula/backend changes.

### C.24.3j-c demo safety note (inner de-layering)

- The change flattens nested sticker-like child surfaces inside executive panels.
- Parent executive cards remain the primary visual anchor.
- No data logic, formulas, or compliance truthfulness semantics changed.

### C.24.3j-d demo safety note (hero integration + Funding composition)

- Funding dashboard and investor readiness are the primary demo routes to re-check after this pass.
- Hero side panels should read embedded in the hero shell (M&A reference), not as floating overlays.
- Funding memo/readiness/allocation rows should feel like one continuous workspace, not disconnected black gaps.
- Form rail at bottom should match panel surface language; scenario draft vs persisted badges unchanged.
- No data logic, formulas, or compliance truthfulness semantics changed.

### C.24.3j-e demo safety note (accent restoration + funding polish)

- Risk and Governance regained branch-colored borders/headers without nested sticker cards.
- Funding readiness score is rounded for display only; underlying engine unchanged.
- Re-check `/risk/register` and `/governance/dashboard` before recording ? tables should not look washed out.
- M&A and CEO remain reference / preserved surfaces.

### C.24.3h demo safety note (focused product copy)

- Copy cleanup only: no formula, score, permission, or data-path changes.
- CEO Overview and Funding dashboards use enterprise DSS language (decision support, human review, board review drafts).
- Do not narrate exports as certified, board-approved, or investment advice.
- N/A and insufficient_data remain valid demo outcomes ? do not substitute zeros.

### C.24.5A demo safety note (Executive Command Center redesign)

- CEO redesign is visual-only and scoped to the Executive Overview page.
- Lion/sovereign mark is decorative watermark from existing internal brand asset (no external media).
- CTA language remains draft/review-oriented, never certified or board-approved.
- Executive flow remains DSS decision support with human review required.
- Missing signals continue to show N/A/insufficient_data, not fabricated values.

### C.24.5A-fix demo safety note

- CEO page composition is now the 6-section command center only (no legacy technical dashboard blocks in main flow).
- Briefing/workflow language remains draft + human review only.

### C.24.5A-polish demo safety note

- Visual polish only: gold CTA, section shells, hero watermark ? no data or formula changes.
- Readiness ring shows real score or N/A; confidence shows N/A when missing (no fake 0).
- Decorative lion watermark from existing in-repo brand asset only.

### C.24.5A-exec-polish demo safety note

- Hero primary chart is Executive Readiness Index only; Unified readiness is contextual in §04.
- Corporate Health Radar preserved below module cards; no duplicate readiness calculations added.

### C.24.5A-radar-polish demo safety note

- Radar polygon draws only calculable branches; N/A shown in legend with dashed spoke markers.
- No scores hardcoded; hero Executive Readiness Index unchanged.

### C.24.5A-final-polish demo safety note

- Visual-only CSS/SVG sizing polish; no metric, formula, or API changes.
- Executive Readiness Index remains hero; Corporate Health Radar remains in §04.
