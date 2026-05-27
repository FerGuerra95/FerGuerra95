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
