# Visual System CSS Architecture Audit — C.24.4A

**Status:** READ-ONLY AUDIT COMPLETE  
**Baseline:** `HEAD = origin/main = 9c361f0`  
**Mode:** READ ONLY — no `src/**`, tests, backend, or runtime changes  
**Date:** 2026-05-28  

---

## 1. Executive Summary

CEO's OS visual styling is spread across **four static CSS files**, **one runtime-injected stylesheet** (`ExecutivePremiumStyle.jsx` in AppShell), and **~55+ JSX files** with embedded `<style>` blocks. There is **no dedicated `src/shared/**/*.css`**; shared primitives live in `src/styles/` and are applied via class names (`ceos-executive-inner-surface`, `ceos-ws-hero`, etc.).

**Cascade order at runtime** (from `src/main.jsx`):

1. `src/styles.css` — base app shell, layout, components (~1,135 lines)
2. `src/modules/ma/styles/maExecutiveTheme.css` — M&A branch theme (~209 lines)
3. `src/styles/executivePolish.css` — global flatten / polish layer (~955 lines)
4. `src/styles/workspaceAccent.css` — workspace tokens + accent restoration (~1,419 lines)
5. **Runtime:** `<ExecutivePremiumStyle />` in `AppShell.jsx` (~468 lines injected after mount)

Because `workspaceAccent.css` loads last among static files but **ExecutivePremiumStyle injects later in the DOM**, M&A pages can receive **competing overrides** from steps 2, 3, 4, and 5 plus page-local inline CSS.

**Top findings:**

| Priority | Finding |
|---|---|
| **P0** | Attribute selectors in `executivePolish.css` (`[class*="card"]`, `[class*="panel"]`, `[class*="hero"]`) flatten shadows/backdrop globally; restoration depends on later `!important` rules — fragile and hard to debug. |
| **P1** | Hero / signal-card / panel glass duplicated per module (Funding, Compliance, PMI, CEO, M&A, Bridge, etc.) with near-identical gradients, radii, and pseudo-layers. |
| **P1** | `ExecutivePremiumStyle.jsx` overlaps `maExecutiveTheme.css` and parts of `executivePolish.css` — fifth styling layer not listed in recent C.24.3j docs. |
| **P1** | C.24.3j stack (`ceos-executive-inner-surface` + de-layer + branch accent) fights module-local heavy glass defined in inline CSS. |
| **P2** | ~55 embedded style blocks; Funding and M&A dashboards are largest debt carriers. |
| **P3** | Legacy class names (`ceos-glass-layer`, duplicate `-glass-block` variants) — mostly neutralized but still defined in places. |

**Recommendation:** Do **not** add new global primitives in C.24.4B. Consolidate into existing files per role (see §7). Quarantine `ExecutivePremiumStyle.jsx` merge into `maExecutiveTheme.css` + `executivePolish.css` in a controlled WRITE phase.

---

## 2. Current CSS Architecture Map

### 2.1 Static CSS files (`src/**/*.css`)

| File | Lines (approx.) | Role |
|---|---|---|
| `src/styles.css` | 1,135 | Base layout, `.page`, `.card`, sidebar/topbar hooks, legacy component styles |
| `src/modules/ma/styles/maExecutiveTheme.css` | 209 | M&A-only tokens (`--ma-exec-*`), hero/signal-card overrides with `!important` |
| `src/styles/executivePolish.css` | 955 | Global flatten: kill shadows, pseudo-layers, nested glass; page-scoped polish for M&A/Funding/CEO |
| `src/styles/workspaceAccent.css` | 1,419 | `--ws-*` tokens, sidebar/topbar accent, `ceos-executive-inner-surface`, de-layering (C.24.3j-c), hero anchoring (C.24.3j-d), branch accent (C.24.3j-e), enterprise table system |

**No `.scss` files.** **No `src/shared/**/*.css`.**

### 2.2 Runtime injected CSS

| Source | Lines (approx.) | Loaded via |
|---|---|---|
| `src/app/layout/ExecutivePremiumStyle.jsx` | 468 | `AppShell.jsx` — `<ExecutivePremiumStyle />` on every authenticated shell |

Targets primarily M&A page wrappers (`.ma-executive-page`, valuation, pipeline, waterfall, CIM, buyer, deals). Uses broad `.main-area :is(...) *` resets and premium surface rules.

### 2.3 Embedded JSX CSS (`<style>{`…`}</style>`)

**~55 files** with embedded blocks (count includes export HTML builders in services). Highest concentration:

| Module / area | Representative files | Notes |
|---|---|---|
| **Funding** | `FundingDashboardPage.jsx`, `InvestorReadinessPage.jsx`, `FundingHeroCard.jsx`, `FundingInputPanel.jsx` | Largest inline blocks; duplicates M&A hero grammar |
| **M&A** | `MADashboardPage.jsx`, `ValuationPage.jsx`, `DealPipelinePage.jsx`, `WaterfallPage.jsx`, … | Reference visuals; also duplicated in theme files |
| **Compliance** | `ComplianceDashboardPage.jsx`, `ComplianceReportPage.jsx`, `SuppliersPage.jsx`, … | Hero + signal-card copies |
| **CEO Overview** | `CEOOverviewPage.jsx` | Hero, radar, signal cards; uses shared primitives + local layout |
| **Enterprise components** | `RiskEnterpriseComponents.jsx`, `GovernanceComponents.jsx`, `ReportingEnterpriseComponents.jsx`, … | Panel + table styles inline |
| **PMI / Strategy / Bridge / Heritage** | Dashboard + entity pages | Same enterprise panel pattern |

**Module JSX file count:** 165 under `src/modules/`.

### 2.4 Shared visual class primitives (opt-in)

| Class | Defined in | Used in (sample) |
|---|---|---|
| `ceos-executive-inner-surface` | `workspaceAccent.css` | Funding, Compliance, PMI, Risk, Governance, Reporting, Strategy, CEO |
| `ceos-ws-hero` | `workspaceAccent.css` | Branch dashboard heroes |
| `ceos-ws-panel` | `workspaceAccent.css` | Funding input rail, side panels |
| `ceos-ws-card-accent` | `workspaceAccent.css` | CEO readiness/signal cards |
| `ceos-enterprise-table` | `workspaceAccent.css` | Risk, Reporting, Governance tables |
| `ceos-enterprise-filter-toolbar` | `workspaceAccent.css` | Risk, Governance filters |

M&A reference (`ma-signal-card`) intentionally **does not** use `ceos-executive-inner-surface` on hero side panel — local + `maExecutiveTheme.css` only.

### 2.5 Demo-safe routes (visual QA scope)

`/ma/dashboard`, `/dashboard`, `/ceo/overview`, `/funding/dashboard`, `/funding/readiness`, `/compliance/dashboard`, `/compliance/reports`, `/reporting/library`, `/risk/register`, `/pmi/dashboard`, `/governance/dashboard`, `/strategy/dashboard`

---

## 3. Duplicate Style Groups

| Group | Files / locations | Risk | Recommendation |
|---|---|---|---|
| **Hero shell + grid** (`*-hero`, `*-hero-layout`, `1.45fr / 0.55fr`) | `MADashboardPage.jsx`, `FundingDashboardPage.jsx`, `InvestorReadinessPage.jsx`, `CEOOverviewPage.jsx`, `ComplianceDashboardPage.jsx`, `PMIDashboardPage.jsx`, `executivePolish.css`, `workspaceAccent.css` | **P1** | Extract layout-only tokens to `executivePolish.css` (grid/gap); keep branch color in `workspaceAccent.css` |
| **Signal side card** (`*-signal-card`, gradient + `::before`) | M&A, Funding, Compliance, PMI, CEO, Bridge, Reviews, … inline CSS + `maExecutiveTheme.css` | **P1** | M&A stays canonical; other branches use `ceos-executive-inner-surface` + hero-embedded rules; delete duplicate local gradients in WRITE phase |
| **Enterprise panel glass** (`*-enterprise-panel`, pseudo blur layers) | `RiskEnterpriseComponents.jsx`, `GovernanceComponents.jsx`, `ReportingEnterpriseComponents.jsx`, … | **P1** | Parent = `ceos-executive-inner-surface`; strip module `::before/::after` blur stacks |
| **KPI / mini cards** | `funding-kpi-card`, `ma-kpi-card`, `compliance-kpi-card`, … | **P2** | Single KPI shell in `executivePolish.css`; branch tint via `--ws-*` only |
| **Glass blocks** | `funding-glass-block`, `ma-glass-block`, `buyer-glass-block`, … | **P2** | Keep as inner flat children under executive surface; no standalone glass |
| **Table shells** | `risk-enterprise-table`, `governance-enterprise-row`, `ceos-enterprise-table` | **P2** | Consolidate header/hover rules in `workspaceAccent.css` enterprise table section |
| **Action rows / toolbars** | `executivePolish.css`, module toolbars, `workspaceAccent.css` | **P2** | Already partially unified; extend `ceos-enterprise-table-toolbar` pattern |
| **M&A premium layer** | `maExecutiveTheme.css` + `ExecutivePremiumStyle.jsx` | **P1** | Merge into one M&A theme source; remove runtime duplicate |
| **De-layer vs accent** | C.24.3j-c flatten vs C.24.3j-e branch accent in `workspaceAccent.css` | **P1** | Document precedence: parent accent → child flat with `rgba(var(--ws-accent-rgb), …)` |

---

## 4. Aggressive / Global Selectors

| Selector | File | Risk | Recommendation |
|---|---|---|---|
| `[class*="card"]`, `[class*="panel"]`, `[class*="hero"]`, … `{ box-shadow: none !important; backdrop-filter: none !important; }` | `executivePolish.css` L69–82 | **P0** | Narrow to `.page .card` + explicit list; stop matching every class substring |
| `[class*="card"]::before/::after` `{ display: none !important; }` | `executivePolish.css` L88–103 | **P0** | Breaks intentional highlights; whitelist exceptions instead of global kill |
| `.card, [class*="panel"], … { background: var(--ceos-polish-surface-soft) !important; }` | `executivePolish.css` L105–118 | **P1** | Conflicts with `ceos-executive-inner-surface`; scope under `.page` without executive classes |
| `.main-area :is(.ma-executive-page, …) *` resets | `ExecutivePremiumStyle.jsx` | **P1** | Over-broad; replace with targeted component selectors |
| `.main-area[data-workspace] .ceos-executive-inner-surface { … !important }` | `workspaceAccent.css` | **P1** | Required today to win over polish layer; reduce need by fixing polish scope |
| `.page:has(.funding-dashboard-page) … !important` | `executivePolish.css` | **P2** | Acceptable page-scoped override; document as composition fix layer |
| `[class*="title"]`, `[class*="value"] { letter-spacing: 0 !important }` | `executivePolish.css` L47–49 | **P2** | Low runtime risk; may affect marketing/landing typography |
| `.main-area[data-workspace] .page :is([class*='-hero'], …) { background: var(--ws-hero-gradient) !important }` | `workspaceAccent.css` L1413+ | **P1** | Can fight inline hero backgrounds; ensure M&A exception path clear |

**Cascade tension (documented):** Module inline CSS (heavy glass) → `executivePolish` (flatten) → `workspaceAccent` (restore premium) → `ExecutivePremiumStyle` (M&A re-premium) → inline `!important` in module CSS again on some pages.

---

## 5. Dead CSS Candidates

| Class / file | Evidence | Recommendation |
|---|---|---|
| `ceos-glass-layer`, `ceos-glass-shine` | Only referenced in `executivePolish.css` to hide (`display: none`) | **DEAD CANDIDATE** — verify no JSX usage; quarantine in C.24.4C |
| `ceo-branch-surface` | Used in CEOOverviewPage (22 refs) alongside newer primitives | **POSSIBLY USED** — consolidate with `ceos-executive-inner-surface` in C.24.4B |
| Duplicate `-glass-block` variants per M&A subpages | Many defined; some pages may not render block | **DO NOT DELETE YET** — grep per class in C.24.4C |
| `FundingHeroCard` `.funding-signal-card` local CSS | Overlaps dashboard hero signal; card used in sub-layout | **POSSIBLY USED** — audit consumers before merge |
| `styles.css` legacy `.card` variants | May overlap with polish flatten | **POSSIBLY USED** — trace shared `Card.jsx` only |
| `bridge/marketplace` heavy inline CSS | Protected/unlisted demo | **DO NOT DELETE** — out of scope |

**Method note:** Full dead-code elimination requires static analysis + route coverage; this audit flags candidates only.

---

## 6. Runtime Risk Areas

| Area | Why risky | Mitigation in next phases |
|---|---|---|
| **M&A reference** | Five layers affect `/ma/dashboard` | C.24.4B: no changes without visual diff vs golden M&A screenshots |
| **CEO Overview** | Radar grid + `ceo-deal-readiness-card` layout history (C.24.3g-e) | No global `[class*="card"]` expansion; test `/ceo/overview` + Legal Compliance N/A |
| **Funding** | Largest inline CSS + composition overrides | Move layout to shared; keep calculations untouched |
| **Risk / Governance accents** | C.24.3j-e restored via `[data-workspace='risk'|'governance']` | Do not re-add generic gray panel override |
| **Enterprise tables** | Shared + module-local table CSS | Consolidate thead/hover in `workspaceAccent.css` only |
| **Protected files** | `workspaceAccent.css`, `executivePolish.css` touched heavily in C.24.3j | Any C.24.4B change requires PRE-FLIGHT + route matrix |

---

## 7. Proposed Target Architecture (existing files)

### `src/styles/workspaceAccent.css`

**Should own:**

- `--ws-*` / `--ws-accent-rgb` tokens per workspace (via `data-workspace`)
- Branch hero gradients (`--ws-hero-gradient`, `--ws-card-gradient`)
- Opt-in primitives: `ceos-executive-inner-surface`, `ceos-ws-hero`, `ceos-ws-panel`, enterprise table system
- Workspace-scoped accent restoration (Risk, Governance, Funding, …)
- Hero-embedded side panel anchoring (M&A pattern)
- Child de-layering inside executive surfaces (flat inner rows/cards)

**Should not own:**

- Base `.card` / form control resets
- M&A-only deal pipeline column exceptions

### `src/styles/executivePolish.css`

**Should own:**

- Global rhythm: `.page` gap, typography normalization
- Shared non-branch primitives: spacing, action rows, form rails, table wrappers
- **Scoped** flatten rules (explicit class list, not `[class*="card"]`)
- Page composition fixes (`:has(.funding-dashboard-page)` grids) until moved to modules as layout-only

**Should not own:**

- Branch colors (move to `workspaceAccent`)
- Premium gradients on executive surfaces

### `src/modules/ma/styles/maExecutiveTheme.css`

**Should own:**

- M&A-only exceptions not reusable elsewhere
- `--ma-exec-*` tokens
- Approved reference hero/signal styling for M&A sub-routes

**Should not own:**

- Duplicates of `ExecutivePremiumStyle.jsx` (merge in C.24.4B)

### Local module CSS (inline / future module `.css`)

**Should own:**

- Page-specific grid areas, one-off section order, responsive breakpoints
- Domain-specific component layout (pipeline columns, waterfall lanes)

**Should not own:**

- Premium glass stacks, duplicate signal-card gradients, global table theming

### `ExecutivePremiumStyle.jsx`

**Target state:** Deprecate / merge into `maExecutiveTheme.css` + selective `executivePolish.css` rules. **Do not delete in C.24.4A.**

---

## 8. Safe Consolidation Plan

### C.24.4B — Consolidate shared visual primitives (WRITE)

- Narrow `executivePolish.css` attribute selectors to explicit allowlist
- Document cascade contract in this file (§2.5)
- Merge `ExecutivePremiumStyle.jsx` M&A rules into `maExecutiveTheme.css` where safe
- Extract hero **layout-only** (grid columns/gap) to `executivePolish.css`; keep color in `workspaceAccent.css`
- No new CSS files unless split is explicitly approved

### C.24.4C — Dead CSS quarantine & removal (QUARANTINE → WRITE)

- Grep-verify candidates in §5
- Remove only classes with zero JSX/CSS references and no dynamic class names
- One module per commit; build + visual spot-check

### C.24.4D — Visual regression QA

- Hard refresh route matrix (§2.5)
- M&A + CEO no-regression mandatory
- Capture computed styles for hero side panel + one enterprise table per branch

---

## 9. Files Not To Touch (without explicit phase)

| Area | Reason |
|---|---|
| `backend/**` | Out of visual scope |
| `docs/testing/golden_inputs.json`, `GOLDEN_DATASETS.md`, `FORMULA_REGISTRY.md` | Oracle protection |
| `AppShell`, `Topbar`, `Sidebar`, router, auth | Protected shell |
| `/bridge/marketplace` internals | Unlisted demo |
| `dist/**` | Build output |
| Calculation engines / score formulas | Display-only CSS audit |

---

## 10. Stop Conditions (for downstream WRITE phases)

Stop and escalate if:

- A change requires new global `[class*="…"]` rules
- M&A or CEO hero regresses in visual QA
- Risk/Governance lose branch accent again
- De-layering removed without parent surface replacement
- `ExecutivePremiumStyle` removed before parity proof
- Golden Dataset / Formula Registry touched for visual work
- More than 3 failed fix attempts on same selector conflict (circuit breaker)

---

## Appendix A — Load Order Diagram

```text
styles.css
  └─ maExecutiveTheme.css
       └─ executivePolish.css  (flatten / global polish)
            └─ workspaceAccent.css  (tokens + restore + de-layer)
                 └─ ExecutivePremiumStyle.jsx  (runtime, AppShell)
                      └─ Page inline <style> blocks  (module-specific, often !important)
```

**Rule of thumb:** Later wins on equal specificity; `!important` in `workspaceAccent` currently wins over `executivePolish` for executive surfaces.

---

## Appendix B — Audit Commands Used

```text
git status --short; git rev-parse --short HEAD; git log --oneline -10
Glob: src/**/*.css
Grep: ceos-executive-inner-surface, [class*=, <style>, hero-layout, !important
Line counts: workspaceAccent.css, executivePolish.css, maExecutiveTheme.css, styles.css, ExecutivePremiumStyle.jsx
```

**Validation:** `npm run build` — PASS (docs-only phase; no src changes).
