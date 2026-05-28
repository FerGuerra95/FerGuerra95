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
