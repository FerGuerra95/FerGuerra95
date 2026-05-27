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

