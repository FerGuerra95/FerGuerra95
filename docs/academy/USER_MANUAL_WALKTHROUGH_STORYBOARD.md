# User Manual Walkthrough Storyboard

This storyboard supports the practical end-to-end user manual video. It is designed for synthetic data only.

Use `SCREENSHOT_SHOT_LIST.md` for shot IDs and `VIDEO_CHAPTER_CAPTURE_PLAN.md` for chapter-level capture order.

| Step | Screen | Action | Button/Menu | Expected result | Narration | Risk label |
|---:|---|---|---|---|---|---|
| 1 | Login | Enter app | Login | Authenticated workspace opens | "We start with a controlled demo account using synthetic data." | No credentials on screen |
| 2 | App shell | Orient user | Sidebar/topbar | Branch navigation visible | "Branches map to executive workflows." | Do not imply all branches are equally mature |
| 3 | CEO Overview | Review cards/radar | CEO Overview nav | Executive summary visible | "This aggregates module signals; it is not source-of-truth." | N/A must not be 0 |
| 4 | CEO Overview | Inspect missing data | Cards/radar | N/A or insufficient_data visible where applicable | "Missing data remains visible." | No fake certainty |
| 5 | Reporting | Open Reporting | Reporting nav | Reporting dashboard loads | "Reporting is the Board Intelligence spine." | Not certified reporting |
| 6 | Board Packs | Open board packs | Board Packs | Board pack area loads | "This is where drafts are prepared." | Board Review Draft only |
| 7 | Snapshots | Create snapshot | Create persisted snapshot | Snapshot appears after API success | "Snapshot state changes only after backend confirmation." | No fake persisted state |
| 8 | Snapshot list | Refresh/list | Refresh/list | Persisted snapshots visible | "The list is the traceability layer." | Tenant data must be scoped |
| 9 | Preview | Open draft | Open preview | HTML Board Review Draft opens | "This preview uses persisted renderer input." | No recalculation claim |
| 10 | Draft header | Confirm labels | None | Human Review Required / Not Board Approved visible | "Labels matter more than polish here." | No board-approved wording |
| 11 | Workflow | Show actions | Mark reviewed/internal final if safe | Action succeeds or is gated | "Human workflow gates apply." | AI cannot approve |
| 12 | Workflow | Explain archive/revoke | Archive/Revoke only if demo-safe | State changes or gated message | "Archived is read-only; revoked is not active." | Avoid destructive demo if unnecessary |
| 13 | Browser print | Save PDF manually | Ctrl+P / Print / Save as PDF | Browser save dialog opens | "This is browser-native save as PDF, not certified PDF export." | No certified PDF claim |
| 14 | M&A | Navigate branch | M&A nav | M&A dashboard loads | "Indicative deal-prep workflow." | Not fairness opinion |
| 15 | M&A | Show valuation/waterfall | Valuation/waterfall page | Context visible | "Use as board preparation, not certified valuation." | No final deal advice |
| 16 | Funding | Navigate branch | Funding nav | Funding dashboard loads | "Funding supports scenarios." | Not investment advice |
| 17 | Funding | Show dilution/runway | Funding cards/charts | N/A preserved where missing | "Missing dilution remains N/A." | No fake 0 |
| 18 | Compliance | Navigate branch | Compliance nav | Compliance dashboard loads | "Evidence and supplier risk support." | Not certified audit |
| 19 | Risk | Open heatmap/register | Risk nav | Heatmap/register visible | "Likelihood and impact guide review." | Not certified risk rating |
| 20 | PMI | Navigate branch | PMI nav | PMI dashboard loads | "Planning and forecast/demo signals." | No guaranteed synergies |
| 21 | Governance | Navigate branch | Governance nav | Decision workflow visible | "Trace decisions for review." | Not certified governance maturity |
| 22 | Strategy | Navigate branch | Strategy nav | Initiatives/scenarios visible | "Connect priorities to board prep." | Empty-state honesty |
| 23 | Bridge | Optional view | Bridge nav | Internal signals visible | "Internal/unlisted signals only." | Not public marketplace |
| 24 | Heritage | Optional view | Heritage nav | Future/premium narrative visible | "Future/premium continuity layer." | Not core proof |
| 25 | Closing | Return to Reporting | Reporting nav | Board Draft context visible | "Use snapshots, human review, and legal/data gates." | No autonomous AI |

## Shot ID References

- CEO Overview steps should use `CEO-01` through `CEO-04`.
- Reporting and Board Review Draft steps should use `REP-01` through `REP-08`.
- Funding steps should use `FUN-01` through `FUN-04`.
- M&A steps should use `MA-01` through `MA-04`.
- Compliance/Risk steps should use `COMP-01` through `COMP-03` and `RISK-01` through `RISK-02`.
- PMI/Governance/Strategy steps should use `PMI-01`, `PMI-02`, `GOV-01`, and `STR-01`.
- Bridge/Heritage steps should use `BRG-01`, `BRG-02`, and `HER-01` only with future/internal labels.
