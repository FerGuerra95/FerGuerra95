# Visual QA Before Recording

Run this QA pass before recording or screenshot capture.

## Layout Integrity

- [ ] No overflow.
- [ ] No cut cards.
- [ ] No unintended horizontal scroll.
- [ ] No broken sidebar.
- [ ] No black screen.
- [ ] No ErrorBoundary.
- [ ] No clipped buttons.
- [ ] No unreadable labels.
- [ ] No low contrast labels or badges.
- [ ] No loading skeletons in final capture.
- [ ] No route-level 404.
- [ ] No stale route or wrong module.

## Browser / Environment Hygiene

- [ ] No local dev console.
- [ ] No browser bookmarks/private info.
- [ ] No unreviewed notifications.
- [ ] No private tabs or unrelated SaaS tabs.
- [ ] No terminal windows.
- [ ] No `.env`, logs, database files, or local paths.
- [ ] No cookies/tokens/session IDs/API keys.

## Data Hygiene

- [ ] IberNova/synthetic data only.
- [ ] No real client data.
- [ ] No real prospect/target data.
- [ ] No real email addresses.
- [ ] No personal data.
- [ ] No stale data that contradicts the narration.

## Product Truthfulness

- [ ] No unsupported claims.
- [ ] No board-approved wording.
- [ ] No certified PDF wording.
- [ ] No autonomous AI wording.
- [ ] No legal/investment advice wording.
- [ ] No SOC2/ISO certification wording.
- [ ] No production provider AI traffic wording.
- [ ] No public marketplace live wording.
- [ ] Bridge/Heritage are marked internal/demo/future where shown.

## Data Display Quality

- [ ] No `NaN`.
- [ ] No `undefined`.
- [ ] No `Infinity`.
- [ ] No fake `0` where missing data should be N/A.
- [ ] N/A and insufficient_data are visible and narratable.
- [ ] Percent vs ratio labels are clear.
- [ ] Chart legends and scales are readable.

## Final Decision

| Result | Action |
|---|---|
| All checks pass | Capture |
| Minor visual issue | Fix environment/zoom or retake |
| Claim/data/security issue | Block capture |
| Runtime product issue | Stop and classify separately |

---

## C.24.3b Demo UI Copy & Visual Readiness Polish

**Status:** COMPLETED / ready for recording QA pass.

Routes reviewed:

- `/dashboard` / `/ceo`
- `/reporting`
- `/reporting/library`
- `/funding/dashboard`
- `/ma/dashboard`
- `/compliance/dashboard`
- `/risk/register`
- `/pmi/dashboard`
- `/governance/dashboard`
- `/strategy/dashboard`

Visual/copy updates to verify during recording:

- Compliance cards should not show placeholder/build copy.
- Reporting snapshot tables should wrap long titles and keep horizontal overflow controlled.
- Reporting workflow buttons should explain disabled prerequisites and backend-confirmed state changes.
- M&A report controls should say HTML draft and browser print/save-as-PDF convenience copy, not certified PDF.
- Bridge should read as internal/unlisted demo layer, not live marketplace.

No calculation, formula, base theme, palette, or Golden Dataset changes were made.

Validation notes:

- Build and unit tests passed after polish.
- Automated navigation smoke still requires launching Vite at `127.0.0.1:5173` before recording rehearsal.

---

## C.24.3c Demo UI Layout Integration Polish

**Status:** COMPLETED / layout integration ready for recording QA pass.

Routes reviewed for layout integration:

- `/dashboard` / `/ceo`
- `/reporting`
- `/reporting/library`
- `/funding/dashboard`
- `/ma/dashboard`
- `/compliance/dashboard`
- `/compliance/suppliers`
- `/compliance/evidence`
- `/risk/register`
- `/pmi/dashboard`
- `/governance/dashboard`
- `/strategy/dashboard`

Visual layout updates to verify during recording:

- Enterprise tables should read as integrated panel content, not floating overlay cards.
- Reporting snapshot list should use the same table shell treatment as other persisted lists.
- Reporting table headers should not visually stack above the surrounding panel.
- Reporting table action buttons should sit calmly inside the table, with disabled states still clear.
- No table should hide N/A or insufficient_data to achieve a cleaner screenshot.

No calculation, formula, source-of-truth, base theme, palette, or Golden Dataset changes were made.

Validation notes:

- Build and unit tests passed after layout polish.
- Automated navigation smoke still requires launching Vite at `127.0.0.1:5173` before recording rehearsal.

---

## C.24.3d Final Cross-Branch Visual Integration & Style Cleanup

**Status:** COMPLETED / final recording-safe layout consolidation ready for QA pass.

Branches reviewed:

- CEO Overview
- Reporting / Board Packs / snapshots
- Funding
- M&A
- Compliance
- Risk
- PMI
- Governance
- Strategy
- Bridge/Heritage surfaces where shown

Visual updates to verify during recording:

- Tables across branches should feel integrated with the parent panel rather than glowing as separate stickers.
- Legacy table wrappers should match the softer enterprise table shell treatment.
- Table headers should not stick above or visually float over cards.
- Module cards and panels should keep the dark premium style with reduced duplicate glow/shadow layers.
- Reporting, Strategy, Risk, Funding, M&A, Compliance and PMI table headers should read as panel content.
- N/A and insufficient_data must remain visible even where the surface is visually calmer.

No calculation, formula, source-of-truth, workflow, base theme, palette, or Golden Dataset changes were made.

Validation notes:

- Build and unit tests passed after C.24.3d.
- Automated navigation smoke still requires launching Vite at `127.0.0.1:5173` before recording rehearsal.

---

## C.24.3e Cross-Branch Visual Coherence & Action Surface Integration Fix

**Status:** COMPLETED / action surfaces ready for recording QA pass.

Branches reviewed:

- CEO Overview
- Reporting / Board Packs / snapshots / workflow actions
- Funding
- M&A
- Compliance
- Risk
- PMI
- Governance
- Strategy
- Bridge/Heritage surfaces where shown

Visual updates to verify during recording:

- Buttons and pills should not have visible rectangular sticker wrappers behind them.
- Action rows should feel integrated with the card or table surface rather than added on top.
- Reporting snapshot actions, Reporting filters, Risk filters, and Strategy filters should share a calmer integrated toolbar treatment.
- Shared enterprise table toolbars and footers should read as table controls, not separate accent cards.
- Bridge and Heritage surfaces must still be labelled internal/demo/future as applicable.
- N/A and insufficient_data must remain visible even where the surface is visually calmer.

No calculation, formula, source-of-truth, workflow, base theme, palette, or Golden Dataset changes were made.

Validation notes:

- Build and unit tests passed after C.24.3e.
- Automated navigation smoke passed for C.24.3e.

---

## C.24.3f Cross-Branch Visual Parity Using Approved M&A Surface Pattern

**Status:** COMPLETED / visual parity ready for recording QA pass.

M&A reference pattern:

- Use the approved M&A Current Deal Snapshot / Recommended Next Step / Saved Valuation Snapshot surface treatment as the visual reference.
- Expected qualities: broad radius, feathered border/glow, low-alpha border, dark glass background, action rows without visible sticker wrapper, and content breathing inside the panel.

Branches corrected:

- Funding dashboard cards and flow panels.
- Compliance dashboard cards, supplier cards, evidence cards, and report cards.
- Reporting panels.
- Risk panels.
- PMI panels.
- Governance panels.
- Strategy panels.

Visual updates to verify during recording:

- Funding and Compliance should no longer look less polished than M&A.
- Card borders should feel feathered/integrated, not hard linear boxes.
- Buttons should sit inside the surface without a strong rectangle behind them.
- Tables and panels should inherit the same dark premium hierarchy.
- N/A and insufficient_data must remain visible.

No calculation, formula, source-of-truth, workflow, base theme, palette, or Golden Dataset changes were made.

Validation notes:

- Build, unit tests, and navigation smoke passed after C.24.3f.

---

## C.24.3g M&A + Compliance Reports Visual Fix Before Recording

**Status:** COMPLETED / focused recording-readiness pass for M&A and Compliance Reports.

Routes to verify in the recording rehearsal:

- `/ma/dashboard`
- `/ma/pipeline`
- `/ma/deals`
- `/compliance/reports`

Visual updates to verify:

- M&A dashboard action rows should no longer show a rectangular sticker surface behind buttons.
- M&A Current Deal Snapshot, Recommended Next Step, Saved Valuation Snapshot, and Clean Dashboard Mode should keep real actions but without fake wrapper layers.
- M&A pipeline columns and empty states should not create excessive black vertical whitespace.
- Deals Repository should flow naturally from the hero to "Deal archive at a glance".
- Compliance Reports should read as a premium draft-review workspace, not a builder or internal scaffolding page.
- Compliance Reports empty states should not use dashed placeholder styling.
- Compliance Reports draft controls, evidence base, and report library should feel integrated with the dark-premium system.

Copy notes:

- Localized Compliance copy was corrected from builder/generated-report language to draft controls, evidence base, and board review draft library language.
- Remaining cross-branch copy candidates are deferred to C.24.3h Product Copy Cleanup.

Validation notes:

- `npm run build` PASS.
- `npm run test:unit` PASS: 88 files / 552 tests.
- `npx playwright test tests/e2e/smoke/navigation-stability.spec.js` PASS.

---

## C.24.3g-b Targeted DOM/Class Visual Fix

**Status:** COMPLETED — operator must re-verify screenshots before recording.

Additional routes:

- `/dashboard` (CEO Overview / Executive Command Center)
- `/ma/valuation` (action-row parity check only)

Verify:

- M&A: no rectangular sticker behind hero/dashboard action rows.
- M&A pipeline: columns height follows content; empty columns stay compact.
- CEO Overview: upper internal readiness/radar cards integrate into hero (no screen-in-screen double frame).
- Compliance Reports: draft controls and library read as one dark-premium surface; no dashed empty placeholders.
- No new global polish layers added on top of old ones.

---

## C.24.3g-c — Runtime Override Visual Fix

**Baseline:** `29bfc93` (`fix(ui): remove visual layering issues before recording`)

**Overrides removed (root cause):**

| Area | File | Selector / class | Issue | Fix |
|---|---|---|---|---|
| M&A action rows | `src/modules/ma/styles/maExecutiveTheme.css` | `.ma-executive-page :is(.ma-arrow-link, .ma-action-row a)` | `!important` gradient box on all action links | Split: keep gradient on `.ma-arrow-link`; `.ma-action-row a` transparent + subtle hover |
| M&A pipeline | `maExecutiveTheme.css` + `executivePolish.css` | `.ma-pipeline-board` stretch; `.ma-pipeline-column` `min-height: 380px` | Empty columns stretched to viewport | `align-items: flex-start`; column `min-height: 0` |
| CEO hero | `CEOOverviewPage.jsx` | `ceo-glass-branch` on hero | Double glass / screen-in-screen | Removed class from hero; scoped `workspaceAccent` readiness card flatten |
| Compliance Reports | `ComplianceReportPage.jsx` + `workspaceAccent.css` | `.report-panel` / `.report-list-card` shared pseudo-glass | Builder / card-in-card | Panels keep single surface; list cards + empty states flat; list panel wrapper aplanado |

**Routes to hard-refresh before recording:**

- `/ma/dashboard`, `/ma/pipeline`, `/ma/deals`, `/ma/valuation`
- `/compliance/reports`
- `/dashboard` or `/ceo/overview` (CEO Overview hero)

**Validations (2026-05-28):**

- `npm run build` PASS
- `npm run test:unit` — 537 passed; 4 suites skipped (local `better-sqlite3` Node ABI mismatch; not UI-related)
- `npx playwright test tests/e2e/smoke/navigation-stability.spec.js` PASS

**Operator:** Confirm no permanent sticker backgrounds on M&A action rows, no giant empty pipeline columns, no CEO hero double frame, Compliance library reads as executive product (not internal builder).

---

## C.24.3j - Executive Inner Surface System QA

Routes to check before recording:

- `/ma/dashboard`
- `/dashboard`
- `/overview`
- `/ceo/overview`
- `/funding/dashboard`
- `/compliance/dashboard`
- `/compliance/reports`
- `/reporting`
- `/reporting/library`
- `/risk/register`
- `/pmi/dashboard`
- `/governance/dashboard`
- `/strategy/dashboard`

Visual pass criteria:

- Inner executive cards show curved surface finish (not hard rectangular boxes).
- Surface reads as embedded premium card (no screen-within-screen or table-sticker look).
- No double glass layering from old accent rules.
- No content clipping or horizontal overflow introduced by surface styling.
- CEO Deal Readiness card contains `.ceos-executive-inner-surface` and preserves `N/A` where data is missing.

### C.24.3j-b CEO-first checkpoint

Routes for this checkpoint:

- `/ma/dashboard` (reference only)
- `/dashboard`
- `/overview`
- `/ceo/overview`

Pass criteria:

- CEO top readiness inner card visibly matches M&A-like embedded surface finish.
- No cross-branch rollout expected in this checkpoint.

### C.24.3j-b rollout visual checklist

Routes validated for visible inner-surface rollout:

- `/funding/dashboard`
- `/funding/readiness`
- `/compliance/dashboard`
- `/compliance/reports`
- `/reporting/dashboard`
- `/reporting/library`
- `/risk/register`
- `/pmi/dashboard`
- `/governance/dashboard`
- `/strategy/dashboard`

Expected result:

- Inner panels in these routes use the same curved embedded executive family as M&A/CEO.
- No regressions on `/ma/dashboard`, `/dashboard`, `/ceo/overview`.

### C.24.3j-c de-layering checklist

Focus routes:

- `/funding/dashboard`
- `/funding/readiness`
- `/ceo/overview`
- `/compliance/reports`
- `/reporting/library`
- `/risk/register`
- `/pmi/dashboard`
- `/governance/dashboard`
- `/strategy/dashboard`

Expected visual outcome:

- Parent panel keeps premium curved surface.
- Internal child cards/rows look flatter (no sticker overlays, no heavy child glow/shadow).
- M&A reference panel remains unchanged.

### C.24.3j-d hero integration + Funding composition checklist

Focus routes:

- `/ma/dashboard` (reference — no regression)
- `/ceo/overview` (no regression)
- `/funding/dashboard`
- `/funding/readiness`
- `/compliance/dashboard`
- `/compliance/reports`
- `/reporting/library`
- `/risk/register`
- `/pmi/dashboard`
- `/governance/dashboard`
- `/strategy/dashboard`

Expected visual outcome:

- Hero side signal panel stretches with hero row; clear border; not a floating sticker.
- Funding: Capital allocation / Raise Overview / Memo / Readiness columns align with equal width; reduced black vertical voids.
- Funding form rail (`Base de financiación`) reads as same workspace family as panels above.

### C.24.3j-e accent + funding final checklist

Focus routes:

- `/funding/dashboard`, `/funding/readiness`, `/risk/register`, `/governance/dashboard`
- `/ma/dashboard`, `/ceo/overview` (no regression)

Expected:

- Risk/Governance panels and tables show workspace accent (border/header/icon), not flat gray generic shell.
- Funding panels show Funding accent; inner children stay flat (no sticker stacks).
- Readiness score displays as integer `/100` (e.g. `37/100`), not long decimals; missing => `N/A`.
- Funding form rail integrated (no hard inner admin Card box).

### C.24.4B cascade control checklist

Focus routes (hard refresh after CSS cascade changes):

- `/ma/dashboard`, `/ceo/overview` (reference — no regression)
- `/funding/dashboard`, `/funding/readiness`
- `/risk/register`, `/governance/dashboard`
- `/compliance/dashboard`, `/compliance/reports`
- `/reporting/library`, `/pmi/dashboard`, `/strategy/dashboard`

Expected:

- No new sticker stacks or heavy nested glass on inner children inside `ceos-executive-inner-surface`.
- M&A signal cards and hero pseudo-layers intact (not globally flattened).
- Risk/Governance workspace accent visible (border/header/icon tint).
- Funding readiness score integer `/100`; missing => `N/A`.
- No horizontal overflow; no clipped buttons; N/A and insufficient_data visible.

### C.24.4D visual regression QA (post CSS consolidation)

**Report:** `docs/academy/VISUAL_REGRESSION_QA_REPORT.md`

**Baseline:** `56ceb09`

**Result:** No P0/P1 visual regressions from C.24.4B/C.24.4C. Navigation stability smoke PASS. Core routes M&A / CEO / Funding PASS under authenticated E2E.

**Before recording:** operator hard refresh on production after deploy includes `56ceb09`.

### C.24.4C dead CSS cleanup checklist

**Status:** COMPLETED (closure).

Routes (hard refresh after dead-selector removal):

- `/ma/dashboard`, `/dashboard`, `/ceo/overview`
- `/funding/dashboard`, `/funding/readiness`
- `/risk/register`, `/governance/dashboard`
- `/compliance/dashboard`, `/compliance/reports`
- `/reporting/library`, `/pmi/dashboard`, `/strategy/dashboard`

Expected (unchanged from C.24.4B):

- M&A signal cards and hero intact; no sticker buttons.
- CEO N/A / insufficient_data; no fake `0`.
- Funding composition + integer readiness score (`37/100` style).
- Risk/Governance workspace accent on panels/tables.
- No black screen; no horizontal overflow; no NaN/undefined/Infinity in view.

### C.24.3h focused product copy cleanup

**Baseline:** `2042cc3` (post C.24.4D visual QA).

**Copy-only:** No CSS/layout changes in this phase. Re-check text fit on hero cards and section headers after hard refresh (longer English labels on CEO Overview and Funding).

**Pilot-safe language:** DSS + human review; board review drafts (not board-approved); N/A and insufficient_data must remain visible.

**Before recording:** confirm `/ceo/overview`, `/funding/dashboard`, `/compliance/reports`, `/reporting/library` read as enterprise pilot copy, not internal scaffolding.

### C.24.5A Executive Overviewer premium command center checklist

Focus routes:

- `/dashboard`
- `/ceo/overview`
- Non-regression spot-check: `/ma/dashboard`, `/funding/dashboard`, `/risk/register`, `/governance/dashboard`

Expected:

- CEO page clearly reads as premium executive command center (dark + gold hierarchy).
- Hero shows subtle lion/sovereign watermark integrated in background.
- Primary CTA appears gold and visually dominant; secondary CTA is dark and subordinate.
- Sections are numbered and ordered by executive decision flow.
- Decision queue, cross-module summary, readiness overview, workflow, and briefing packs are visible.
- N/A and insufficient_data remain visible; no NaN/undefined/Infinity.

### C.24.5A-fix composition checklist

Confirm `/dashboard` and `/ceo/overview` now show only the 6 numbered command-center sections (no legacy radar stack, no 9-card module wall, no old executive-command-layer blocks).

### C.24.5A-polish visual checklist

- Primary CTA **Generate Board Review Draft** is gold (not cyan/green).
- Each section sits inside a premium gold-bordered shell (`.ceo-command-section-shell`).
- Hero shows black/gold treatment with visible lion/sovereign watermark.
- Cards are charcoal/black with subtle gold borders (not blue SaaS panels).
- Decision readiness uses circular ring indicator; missing score shows N/A.
- No horizontal overflow; no clipped text; N/A preserved.

### C.24.5A-exec-polish CEO flow checklist

- Hero ring shows **Executive Readiness Index** (not Unified readiness).
- Hero includes confidence + missing data + human review copy.
- Section 04 radar is compact, gold-styled, legible (not black giant circle).
- Unified readiness appears only as contextual footnote in §04 with distinct label.

### C.24.5A-radar-polish checklist

- Corporate Health Radar is visually prominent (not mini-chart).
- Radar left ~42%, legend right ~58% on desktop.
- Missing branches show N/A in legend; polygon excludes N/A (no silent 0).
- Hero Executive Readiness Index unchanged.

### C.24.5A-final-polish checklist

- Radar ~46% width, SVG up to 360px; polygon glow visible.
- Legend rows thin/transparent (not table boxes).
- Hero reads black/gold; lion watermark with seal ring aura.
- Gold CTA unchanged; ERI hero metric unchanged.

### C.24.5A-hero-integration-fix checklist

- Lion lives inside primary hero block (not behind ERI / Top Priorities panels).
- Hero grid: main block | ERI | priorities — lion only in main block.
- No metric, formula, or backend changes.

### C.24.5A-text-decontainerize checklist

- Hero badges are light labels (not input-like pills).
- Top priorities render as executive list with dot markers.
- Status labels (HIGH/MEDIUM/WATCH) are text, not bordered pills.
- Radar legend uses fine separators, not spreadsheet cells.

### C.24.5A-texture-polish checklist

- Cards read charcoal/black/gold (not blue panels).
- Module postures show Pending inputs, not raw insufficient_data pills.
- Unified readiness note is executive copy, still truthfulness-safe.
- Decision queue HIGH/MEDIUM/WATCH are text accents, not form bars.

### C.24.5A-logo-integration checklist

- Hero shows clean lion mark from `/brand/ceos-lion-mark.png`.
- No branch wheel / M&A·Compliance labels in hero logo.
- Lion remains inside primary hero block (not behind Top Priorities).

### C.24.5A-logo-fix checklist

- Hero shows geometric lion emblem (not CEO's OS wordmark image).
- Asset path `/brand/ceos-lion-mark.png` serves lion + ring + spheres only.
