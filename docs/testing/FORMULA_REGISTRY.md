# CEO's OS / The Sovereign OS — Formula Registry

## Purpose

Technical registry of official formulas, edge cases, Golden Dataset mapping, and implementation audit status.

This registry defines intended formula anchors. It does not certify that current implementation matches these formulas until C.13 validation is complete.

## Documentation Truthfulness

| Formula Status | Meaning |
|---|---|
| Golden validated | Code matches golden within tolerance (after C.13) |
| Pending C.13 validation | Formula defined; implementation not yet audited |
| Mismatch | Code differs from golden beyond tolerance |
| Duplicate implementation found | FE and BE (or two helpers) disagree |
| Source unclear | Cannot locate single implementation |
| Deprecated | Do not use for new features |
| Human review required | DSS/heuristic output |

## Implementation Status Legend

| Implementation Status | Meaning |
|---|---|
| Pending C.13 validation | Not yet compared to code |
| Matches golden | C.13 confirmed within tolerance |
| Mismatch documented | C.13 found divergence; stop condition |
| Duplicate paths | Multiple implementations found |
| Not applicable | Formula not yet implemented |

## Required Formula Table

| Formula ID | Module | Formula | Inputs | Output | Edge Cases | Golden Dataset ID | Formula Status | Implementation Status | Disclaimer |
|---|---|---|---|---|---|---|---|---|---|
| EV_EBITDA | M&A | enterpriseValue = ebitda * multiple (simple benchmark) | ebitda, multiple | enterpriseValue | negative EBITDA needs human review | ma_valuation_ebitda_multiple_basic | Pending C.13.4C Golden test | Simple benchmark only; product uses adjusted EV (C.13.4B) | Benchmark/oracle simple EV. Not fairness opinion. Not product headline EV. |
| NET_DEBT | M&A | netDebt = debt - cash | debt, cash | netDebt | net cash when cash > debt | ma_valuation_equity_value_basic | Pending C.13.4C Golden test | Core aligned in `calculateCoreMetrics`; golden test pending | Core valuation bridge. Indicative DSS only. |
| EQUITY_VALUE | M&A | simpleEquityValue = enterpriseValue - netDebt | enterpriseValue, netDebt | equityValue | product uses adjusted equity separately | ma_valuation_equity_value_basic | Pending C.13.4C Golden test | Simple benchmark; adjustedEquity adds WC adjustment | Simple equity oracle. Not netProceeds. Not fairness opinion. |
| WATERFALL_SIMPLE | M&A | netCashToSeller = grossProceeds - transactionCosts - debtRepayment - sellerRollover | four currency inputs | netCashToSeller | negative proceeds human review | ma_waterfall_simple_distribution | Pending C.13.4C Golden test | Simple seller cash bridge; **not** current product waterfall | Simple benchmark waterfall. Not product MA_PRODUCT_WATERFALL. |
| RUNWAY_MONTHS | Funding | runwayMonths = cashBalance / monthlyBurn | cashBalance, monthlyBurn | runwayMonths | monthlyBurn <= 0 => null; never Infinity/NaN | funding_runway_basic, funding_runway_zero_burn | Implemented and tested | See `FUNDING_RUNWAY_MONTHS` (C.13.2A) | Planning estimate. Not investment advice. |
| POST_MONEY | Funding | postMoney = preMoney + newInvestment | preMoney, newInvestment | postMoney | | funding_post_money_and_dilution_basic | Implemented and tested | `tests/unit/funding/fundingFormulas.test.js` (C.13.3C) | Planning estimate. Not certified valuation. |
| INVESTOR_OWNERSHIP | Funding | investorOwnership = newInvestment / postMoney | newInvestment, postMoney | decimal and percent | postMoney <= 0 => null | funding_post_money_and_dilution_basic | Implemented and tested | `tests/unit/funding/fundingFormulas.test.js` (C.13.3C/D edge) | Planning estimate. Not investment advice. |
| COMPLIANCE_WEIGHTED_RISK | Compliance | weightedRiskScore = financialRisk*0.4 + jurisdictionRisk*0.4 + evidenceRisk*0.2 | financialRisk, jurisdictionRisk, evidenceRisk (each 0–100) | weightedRiskScore 0–100 | clamp 0–100 at presentation | compliance_weighted_risk_score_basic | Implemented for limited scope | Helper + golden test + reports/export (C.13.2A) | Benchmark/oracle. Not operational engine. |
| COMPLIANCE_OPERATIONAL_RISK | Compliance | operationalRiskScore = f(criticality, tier, region, alerts, evidence gap, confidence, review adjustment) | supplier + alerts + evidence + reviews | operationalRiskScore 0–100 | clamp 0–100 | N/A (not golden oracle) | Pending validation | Existing FE; Formula Approval C.13.2A | Operational DSS. Not certified compliance score. |
| COMPLIANCE_RESILIENCE | Compliance | goldenResilienceScore = clamp(100 - riskScore + mitigationBonus, 0, 100) | riskScore input, mitigationBonus | goldenResilienceScore 0–100 | clamp 0–100 | compliance_resilience_score_basic | Implemented for limited scope | Golden helper/test only (C.13.2A); FE engine separate | Golden oracle. Not operational engine output. |
| PMI_CAPTURE_RATE | PMI | captureRate = captured / forecast | capturedSynergies, forecastSynergies | rate decimal/percent | forecast <= 0 => null; never Infinity/NaN | pmi_synergy_capture_rate_basic, pmi_synergy_zero_forecast | Pending C.13.x validation | Golden mapped; code audit pending (C.13.2B) | Not guarantee of capture. |
| BRIDGE_PRIORITY | Bridge | priority = impact*0.5 + urgency*0.3 + confidence*0.2 | three scores, weights | priorityScore | | bridge_priority_score_basic | Pending C.13.x validation | Golden mapped; code audit pending (C.13.2B) | DSS signal priority. Human review required. |
| RISK_LIKELIHOOD_IMPACT | Risk | riskScore = likelihood * impact | likelihood 1-5, impact 1-5 | riskScore, severity band | scale must be documented in code | risk_score_likelihood_impact_basic | Pending C.13.x validation | Golden mapped; code audit pending (C.13.2B) | DSS risk indicator. |
| REPORTING_VARIANCE | Reporting | varianceAmount = actual - budget; variancePercent = varianceAmount/budget*100 | actual, budget | amount and percent | budget = 0 => null for percent | reporting_kpi_variance_basic | Pending C.13.x validation | Golden mapped; code audit pending (C.13.2B) | Management reporting only. |
| EXEC_MODULE_HEALTH_AVG | Executive Overview | averageHealth = sum(scores)/count(scores) | moduleScores map | averageHealth | empty map => define explicit behavior | executive_module_health_average_basic | Pending C.13.x validation | Golden mapped; code audit pending (C.13.2B) | Aggregator metric only. |
| COMPLIANCE_OPERATIONAL_RESILIENCE | Compliance | operationalResilienceScore = calculateResilienceScore (FE engine) | supplier, alerts, evidence, reviews | operationalResilienceScore 0–100 | clamp 0–100 | N/A (not golden oracle) | Existing FE operational model | Existing FE behavior; pending SoT cleanup | Operational DSS signal. Not certified resilience rating. |

## Formula Approval Gate (C.13.2A)

First formal control layer for critical formulas. Metadata below is **minimum traceability** — not certification that all product paths match these definitions.

### Standard metadata template

Each approved or in-progress formula should document:

| Field | Purpose |
|---|---|
| **Formula ID** | Stable registry key |
| **Module** | Product module |
| **Owner** | Human accountability (not AI-generated) |
| **Source** | Golden Dataset, registry decision, documented phase, or pending external validation |
| **Status** | Implementation / validation state |
| **Formula** | Canonical expression |
| **Inputs** | Named inputs with units/ranges |
| **Units** | Input/output units |
| **Output** | Result field and range |
| **Golden ID** | `golden_inputs.json` dataset id, or `N/A` with justification |
| **Test file** | Vitest path or `pending` |
| **Edge cases** | Explicit null/clamp/divide-by-zero rules |
| **Usage limits** | DSS scope; no legal/financial/certified advice |
| **Approval** | Human approval scope (never auto-promoted by tooling) |
| **Last reviewed** | Date of metadata review |

**Allowed Status values:** Implemented and tested · Implemented for limited scope · Pending validation · Pending implementation · Pending Golden Dataset · Pending Formula Owner · Pending external validation · Pending C.13.x validation · Deprecated / do not use

**Allowed Approval values:** Pending human approval · Pending external validation · Approved for DSS/demo scope · Approved for reports/export scope · Not approved for certified/legal/financial/investment advice

**Rules:** Do not change Golden expected to pass code. Do not use AI/Cursor as formula source. Do not mix metrics under one label. Pending formulas stay Pending until human review.

### Formula Approval Inventory summary (C.13.2B)

| Module | Classified (approval blocks) | Primary gate status | Approval (typical) |
|---|---:|---|---|
| Funding | 3 (`FUNDING_RUNWAY_MONTHS`, `POST_MONEY`, `INVESTOR_OWNERSHIP`) | 3 implemented and tested (C.13.3C/D) | DSS/demo scope; not certified valuation/investment advice |
| M&A | 4 golden + 2 DSS pending (`MA_PRODUCT_WATERFALL`, buyer fit) | Pending C.13.4C Golden tests | DSS/demo scope; not certified valuation or buyer matching |
| Compliance | 5 (C.13.2A set) | 2 limited scope; 2 Pending validation | Mixed (see blocks) |
| PMI | 1 (`PMI_CAPTURE_RATE`) | Pending C.13.x validation | Pending human |
| Bridge | 1 (`BRIDGE_PRIORITY`) | Pending C.13.x validation | Pending human |
| Risk | 1 (`RISK_LIKELIHOOD_IMPACT`) | Pending C.13.x validation | Pending human |
| Reporting | 1 (`REPORTING_VARIANCE`) | Pending C.13.x validation | Pending human |
| Executive Overview | 1 (`EXEC_MODULE_HEALTH_AVG`) | Pending C.13.x validation | Pending human |
| Cross-module (discovery) | 8 rows | Pending discovery in C.13.x | Not approved for certified advice |

**Total Required Formula Table rows:** 16 · **With `###` approval blocks:** 16 · **Production-ready certified:** 0

---

### FUNDING_RUNWAY_MONTHS

**Formula ID:** FUNDING_RUNWAY_MONTHS  
**Registry table alias:** `RUNWAY_MONTHS` (same formula; approval gate uses this ID)  
**Module:** Funding  
**Owner:** Product / Logic Integrity  
**Source:** Golden Dataset  
**Status:** Implemented and tested  
**Formula:** `runwayMonths = cashBalance / monthlyBurn` when `monthlyBurn > 0`; else `null`  
**Inputs:** `cashBalance` (currency), `monthlyBurn` (currency per month, must be > 0 for division)  
**Units:** currency / (currency per month) → months (number or null)  
**Output:** `runwayMonths` — finite number or `null`  
**Golden ID:** `funding_runway_zero_burn` (edge case); also `funding_runway_basic`  
**Test file:** `tests/unit/funding/fundingFormulas.test.js`  
**Edge cases:** `monthlyBurn <= 0` => `runwayMonths = null`; never `Infinity` / `NaN` in user-facing output  
**Usage limits:** Planning estimate only. Not investment advice. DSS/demo scope.  
**Approval:** Approved for DSS/demo scope  
**Last reviewed:** 2026-05-20  

---

### COMPLIANCE_WEIGHTED_RISK

**Formula ID:** COMPLIANCE_WEIGHTED_RISK  
**Module:** Compliance  
**Owner:** Product / Logic Integrity  
**Source:** Golden Dataset + C.13.1C documented decision  
**Status:** Implemented for limited scope (helper + golden test + reports/export)  
**Formula:** `weightedRiskScore = financialRisk*0.4 + jurisdictionRisk*0.4 + evidenceRisk*0.2`  
**Inputs:** `financialRisk`, `jurisdictionRisk`, `evidenceRisk` — each 0–100  
**Units:** dimensionless scores 0–100 → `weightedRiskScore` 0–100 (clamp at presentation)  
**Output:** `weightedRiskScore`  
**Golden ID:** `compliance_weighted_risk_score_basic`  
**Test file:** `tests/unit/compliance/complianceWeightedRisk.test.js`  
**Edge cases:** Missing/non-finite inputs => helper returns null; do not show weighted score without explicit dimension inputs  
**Usage limits:** Benchmark/oracle and reports/export when inputs explicit. **Not** operational engine. **Not** certified compliance score. Label: Weighted risk (explicable).  
**Approval:** Approved for reports/export scope  
**Last reviewed:** 2026-05-20  

---

### COMPLIANCE_RESILIENCE

**Formula ID:** COMPLIANCE_RESILIENCE  
**Module:** Compliance  
**Owner:** Product / Logic Integrity  
**Source:** Golden Dataset + C.13.1C-f8A golden helper  
**Status:** Implemented for limited scope (golden helper/test only; separate from operational FE engine)  
**Formula:** `goldenResilienceScore = clamp(100 - riskScore + mitigationBonus, 0, 100)`  
**Inputs:** `riskScore` (0–100, golden/oracle context), `mitigationBonus` (number)  
**Units:** scores 0–100  
**Output:** `goldenResilienceScore` 0–100  
**Golden ID:** `compliance_resilience_score_basic`  
**Test file:** `tests/unit/compliance/complianceGoldenResilience.test.js`  
**Edge cases:** Missing/invalid inputs => null; clamp 0–100  
**Usage limits:** Golden benchmark/oracle only. Do not substitute for `operationalResilienceScore` on dashboards without explicit label. Not certified resilience rating.  
**Approval:** Approved for DSS/demo scope (oracle); not approved for certified/legal advice  
**Last reviewed:** 2026-05-20  

---

### COMPLIANCE_OPERATIONAL_RISK

**Formula ID:** COMPLIANCE_OPERATIONAL_RISK  
**Module:** Compliance  
**Owner:** Product / Logic Integrity  
**Source:** C.13.1C documented decision (FE operational engine)  
**Status:** Pending validation (existing FE engine; Formula Approval metadata added C.13.2A)  
**Formula:** `operationalRiskScore = calculateSupplierRiskScore(supplier, alerts, evidence, reviews)` — criticality, tier, region, alerts, evidence gap, confidence, review adjustments → clamp 0–100  
**Inputs:** `supplier`, `alerts`, `evidenceItems`, `reviews`  
**Units:** dimensionless 0–100  
**Output:** `operationalRiskScore` (often persisted/surfaced as `riskScore` pending rename)  
**Golden ID:** N/A — operational engine pending Formula Approval; no golden oracle by design in C.13.2A  
**Test file:** `tests/unit/compliance/compliancePrecedence.test.js` (precedence/labels; not full formula golden)  
**Edge cases:** clamp 0–100; re-export `report.riskScore ?? supplier?.riskScore`  
**Usage limits:** Operational DSS signal, not certified compliance score. Must not be confused with `weightedRiskScore`. Label: Operational risk score.  
**Approval:** Pending human approval  
**Last reviewed:** 2026-05-20  

---

### COMPLIANCE_OPERATIONAL_RESILIENCE

**Formula ID:** COMPLIANCE_OPERATIONAL_RESILIENCE  
**Module:** Compliance  
**Owner:** Product / Logic Integrity  
**Source:** C.13.1C documented decision (FE `resilienceScore.js` engine)  
**Status:** Pending validation (existing FE engine; separate from golden resilience oracle)  
**Formula:** `operationalResilienceScore = calculateResilienceScore(...)` — FE engine model (not golden clamp formula)  
**Inputs:** `supplier`, `alerts`, `evidence`, `reviews` (per engine)  
**Units:** dimensionless 0–100  
**Output:** `operationalResilienceScore` (often persisted/surfaced as `resilienceScore` pending rename)  
**Golden ID:** N/A — operational engine pending Formula Approval  
**Test file:** `tests/unit/compliance/compliancePrecedence.test.js` (precedence/labels; not golden formula test)  
**Edge cases:** clamp 0–100; re-export `report.resilienceScore ?? supplier?.resilienceScore`  
**Usage limits:** Operational DSS signal, not certified resilience rating. Must not be confused with `COMPLIANCE_RESILIENCE` golden oracle. Label: Operational resilience score.  
**Approval:** Pending human approval  
**Last reviewed:** 2026-05-20  

---

### EV_EBITDA

**Formula ID:** EV_EBITDA  
**Module:** M&A  
**Owner:** Pending Formula Owner (CFO/transaction advisor review)  
**Source:** Golden Dataset + Formula Registry  
**Status:** Pending C.13.4C Golden implementation test (C.13.4B decision)  
**Formula:** `enterpriseValue = ebitda * multiple` (**simple benchmark only**)  
**Inputs:** `ebitda`, `multiple`  
**Units:** currency × multiple → currency  
**Output:** `enterpriseValue` (simpleEnterpriseValue)  
**Golden ID:** `ma_valuation_ebitda_multiple_basic`  
**Test file:** pending (C.13.4C — target tests/unit/ma/maGoldenFormulas.test.js)  
**Product note (C.13.4B):** Product headline EV is **adjustedEnterpriseValue** (`evBase`) from `useValuationEngine` — normalized EBITDA × adjusted multiple. Do **not** substitute product with this simple golden automatically.  
**Edge cases:** Negative EBITDA requires human review; not auto-certified  
**Usage limits:** Benchmark/oracle simple EV only. Indicative DSS. Not fairness opinion. Not investment advice. Not product headline EV.  
**Approval:** Pending external validation · Not approved for certified/legal/financial advice  
**Last reviewed:** 2026-05-23 (C.13.4B)  

---

### NET_DEBT

**Formula ID:** NET_DEBT  
**Module:** M&A  
**Owner:** Pending Formula Owner  
**Source:** Golden Dataset + `calculateCoreMetrics` (aligned)  
**Status:** Pending C.13.4C Golden implementation test (C.13.4B decision)  
**Formula:** `netDebt = debt - cash`  
**Inputs:** `debt`, `cash` (currency)  
**Units:** currency  
**Output:** `netDebt`  
**Golden ID:** `ma_valuation_equity_value_basic` (shared valuation chain)  
**Test file:** pending (C.13.4C)  
**Edge cases:** Net cash when cash > debt is allowed; document in golden edge case future phase  
**Usage limits:** Core valuation bridge. Indicative DSS only.  
**Approval:** Pending human approval · Not approved for certified advice  
**Last reviewed:** 2026-05-23 (C.13.4B)  

---

### EQUITY_VALUE

**Formula ID:** EQUITY_VALUE  
**Module:** M&A  
**Owner:** Pending Formula Owner  
**Source:** Golden Dataset  
**Status:** Pending C.13.4C Golden implementation test (C.13.4B decision)  
**Formula:** `simpleEquityValue = enterpriseValue - netDebt` (**simple benchmark only**)  
**Inputs:** `enterpriseValue`, `netDebt`  
**Units:** currency  
**Output:** `equityValue` (simpleEquityValue)  
**Golden ID:** `ma_valuation_equity_value_basic`  
**Test file:** pending (C.13.4C)  
**Product note (C.13.4B):** Product uses **adjustedEquityValue** (`equityBase = enterpriseValue - netDebt + workingCapitalAdjustment`). **netProceeds** is separate (after fees/taxes). Do not conflate simple equity, adjusted equity, or net proceeds.  
**Edge cases:** Depends on EV and net debt SoT alignment; WC adjustment is product-only extension  
**Usage limits:** Simple equity oracle. Indicative only. Not fairness opinion. Not netProceeds.  
**Approval:** Pending external validation · Not approved for certified advice  
**Last reviewed:** 2026-05-23 (C.13.4B)  

---

### WATERFALL_SIMPLE

**Formula ID:** WATERFALL_SIMPLE  
**Module:** M&A  
**Owner:** Pending Formula Owner  
**Source:** Golden Dataset  
**Status:** Pending C.13.4C Golden implementation test (C.13.4B decision)  
**Formula:** `netCashToSeller = grossProceeds - transactionCosts - debtRepayment - sellerRollover`  
**Inputs:** four currency line items  
**Units:** currency  
**Output:** `netCashToSeller`  
**Golden ID:** `ma_waterfall_simple_distribution`  
**Test file:** pending (C.13.4C) (pure helper if needed)  
**Product note (C.13.4B):** Current product waterfall is **MA_PRODUCT_WATERFALL** (separate). Product does **not** implement WATERFALL_SIMPLE exact inputs today.  
**Edge cases:** Negative proceeds → human review  
**Usage limits:** Simple seller cash bridge benchmark. Not legal/financial certification. Not product waterfall.  
**Approval:** Pending human approval · Not approved for certified advice  
**Last reviewed:** 2026-05-23 (C.13.4B)  

---

### MA_PRODUCT_WATERFALL (Pending Formula Approval — C.13.4B)

**Formula ID:** MA_PRODUCT_WATERFALL  
**Module:** M&A  
**Owner:** Pending Formula Owner  
**Source:** Product code (`useValuationEngine.js`, `WaterfallPanel.jsx`)  
**Status:** Pending Formula Approval · Pending C.13.4 validation  
**Formula:** `EV → (-netDebt) → (+workingCapitalAdjustment) → adjustedEquityValue → (-fees%) → (-taxes%) → netProceeds`  
**Inputs:** evBase, netDebt, wcAdjustment, transactionFees %, taxRate %  
**Output:** `netProceeds` (and intermediate equityBase)  
**Golden ID:** N/A — distinct from `ma_waterfall_simple_distribution`  
**Test file:** pending — product unit tests exist; golden oracle N/A until policy decision  
**Usage limits:** Product DSS waterfall only. Not WATERFALL_SIMPLE golden. Not certified proceeds opinion.  
**Approval:** Pending human approval · Not approved for certified advice  
**Last reviewed:** 2026-05-23 (C.13.4B)  

---

### MA_BUYER_MATCH_FIT (Pending Formula Approval — C.13.4B)

**Formula ID:** MA_BUYER_MATCH_FIT  
**Module:** M&A  
**Owner:** Pending Formula Owner  
**Source:** `reportBuilder.js` → `buildBuyerMatches` (heuristic)  
**Status:** Pending Formula Approval · DSS heuristic  
**Formula:** Clamped weighted heuristic on qualityScore, leverageRatio, recurringRevenue, ownerDependency, clientConcentration (strategic / PE / search fund profiles)  
**Output:** `fit` score 0–100 per buyer profile  
**Golden ID:** `ma_buyer_matching_score` (future — not in golden_inputs.json yet)  
**Test file:** `pending`  
**Usage limits:** DSS heuristic buyer universe prioritization. **Not** certified buyer/investor matching or recommendation. Requires UI label in future phase.  
**Approval:** Pending human approval · Not approved for certified matching  
**Last reviewed:** 2026-05-23 (C.13.4B)  

---

### POST_MONEY

**Formula ID:** POST_MONEY  
**Module:** Funding  
**Owner:** Product / Logic Integrity  
**Source:** Golden Dataset + C.13.3B naming/SoT decision  
**Status:** Implemented and tested (C.13.3C golden; C.13.3E closure)  
**Formula:** `postMoney = preMoney + newInvestment`  
**FE equivalent:** `postMoneyValuation = preMoneyValuation + targetRaise` (`calculateFundingCore`)  
**Inputs:** `preMoney` / `preMoneyValuation`, `newInvestment` / `targetRaise` (currency)  
**Units:** currency  
**Output:** `postMoney` / `postMoneyValuation`  
**Golden ID:** `funding_post_money_and_dilution_basic` (expected post-money 10_000_000)  
**Test file:** `tests/unit/funding/fundingFormulas.test.js`  
**Edge cases:** Inputs must be finite; presentation rounding at UI layer  
**Usage limits:** DSS/demo planning estimate. Not certified valuation or investment advice.  
**Approval:** Approved for DSS/demo scope · Not approved for certified valuation/investment advice  
**Last reviewed:** 2026-05-20 (C.13.3E)  

---

### INVESTOR_OWNERSHIP

**Formula ID:** INVESTOR_OWNERSHIP  
**Module:** Funding  
**Owner:** Product / Logic Integrity  
**Source:** Golden Dataset + C.13.3B decision (dilution simple = alias)  
**Status:** Implemented and tested (C.13.3C golden; C.13.3D FE edge; C.13.3E closure)  
**Formula:** `investorOwnership = newInvestment / postMoney`; `dilutionPct = investorOwnership * 100`  
**FE equivalent:** `dilutionPct = targetRaise / postMoneyValuation * 100` when post-money > 0  
**Extended (separate):** `postRoundOwnership` cap-table model in `calculateFundingCore` — not the golden simple round  
**Inputs:** `newInvestment` / `targetRaise`, `postMoney` / `postMoneyValuation`  
**Units:** ratio 0–1 and percent  
**Output:** `investorOwnership`, `dilutionPct`  
**Golden ID:** `funding_post_money_and_dilution_basic` (expected 0.2 / 20%)  
**Test file:** `tests/unit/funding/fundingFormulas.test.js`  
**Edge cases:** `postMoney <= 0` => **`null`** for `dilutionPct` and `postRoundOwnership` (FE fixed C.13.3D); never `0` / `NaN` / `Infinity` as ownership signal  
**Usage limits:** Indicative capital structure / DSS. Not cap-table legal certification or investment advice.  
**Approval:** Approved for DSS/demo scope · Not approved for certified investment advice  
**Last reviewed:** 2026-05-20 (C.13.3E)  

---

### FUNDING_INVESTOR_READINESS (DSS signal)

**Formula ID:** FUNDING_INVESTOR_READINESS (discovery)  
**Module:** Funding  
**Owner:** Pending Formula Owner  
**Source:** C.13.3B — canonical engine only  
**Status:** Pending Formula Approval / Pending human validation (C.13.3E)  
**Canonical implementation:** `calculateReadinessScore` in `fundraisingScoring.js`  
**UI alignment (C.13.3D):** `FundingDashboardPage` and `InvestorReadinessPage` consume engine `derived.readinessScore` / `readinessLevel` — duplicate simple averages removed  
**Golden ID:** N/A  
**Test file:** `pending` (no golden oracle for readiness composite)  
**Usage limits:** DSS readiness signal. Not fundraising advice or certified investor readiness.  
**Approval:** Pending human approval · Not approved for certified investment advice  

---

### FUNDING_OPTIMAL_WINDOW / FUNDING_RISK (DSS signals)

**Status:** Pending discovery — backend heuristics (`evaluateOptimalFundingWindow`, `fundingRiskStatus` in `getFundingSummary`). Not mathematical formulas. Pending C.13.x module audit. DSS only; human review required.  

---

### PMI_CAPTURE_RATE

**Formula ID:** PMI_CAPTURE_RATE  
**Module:** PMI  
**Owner:** Pending Formula Owner (PMI program lead)  
**Source:** Golden Dataset  
**Status:** Pending C.13.x validation (C.13.6 PMI audit)  
**Formula:** `captureRate = capturedSynergies / forecastSynergies`  
**Inputs:** `capturedSynergies`, `forecastSynergies`  
**Units:** currency / currency → rate  
**Output:** `captureRate` (decimal/percent)  
**Golden ID:** `pmi_synergy_capture_rate_basic`, `pmi_synergy_zero_forecast`  
**Test file:** `pending`  
**Edge cases:** `forecastSynergies <= 0` => `null`; never Infinity/NaN  
**Usage limits:** Management DSS. Not guarantee of synergy capture.  
**Approval:** Pending human approval  
**Last reviewed:** 2026-05-20  

---

### BRIDGE_PRIORITY

**Formula ID:** BRIDGE_PRIORITY  
**Module:** Bridge  
**Owner:** Pending Formula Owner  
**Source:** Golden Dataset  
**Status:** Pending C.13.x validation (C.13.7 Bridge audit)  
**Formula:** `priorityScore = impact*0.5 + urgency*0.3 + confidence*0.2`  
**Inputs:** `impact`, `urgency`, `confidence` (normalized scores)  
**Units:** weighted score  
**Output:** `priorityScore`  
**Golden ID:** `bridge_priority_score_basic`  
**Test file:** `pending`  
**Edge cases:** Weights fixed in registry; code must document scale  
**Usage limits:** DSS signal priority. Human review required. Not autonomous decision.  
**Approval:** Pending human approval  
**Last reviewed:** 2026-05-20  

---

### RISK_LIKELIHOOD_IMPACT

**Formula ID:** RISK_LIKELIHOOD_IMPACT  
**Module:** Risk  
**Owner:** Pending Formula Owner (risk officer review)  
**Source:** Golden Dataset  
**Status:** Pending C.13.x validation (C.13.8 / Risk module audit)  
**Formula:** `riskScore = likelihood * impact` (scale 1–5 documented in code)  
**Inputs:** `likelihood`, `impact`  
**Units:** ordinal 1–5 → score + severity band  
**Output:** `riskScore`, severity band  
**Golden ID:** `risk_score_likelihood_impact_basic`  
**Test file:** `pending`  
**Edge cases:** Scale must match UI and exports; heatmap aggregation TBD in module audit  
**Usage limits:** DSS risk indicator. Not regulatory risk certification.  
**Approval:** Pending human approval · Pending external validation for enterprise risk reporting  
**Last reviewed:** 2026-05-20  

---

### REPORTING_VARIANCE

**Formula ID:** REPORTING_VARIANCE  
**Module:** Reporting  
**Owner:** Pending Formula Owner  
**Source:** Golden Dataset  
**Status:** Pending C.13.x validation (C.13.9 Reporting audit)  
**Formula:** `varianceAmount = actual - budget`; `variancePercent = varianceAmount / budget * 100`  
**Inputs:** `actual`, `budget`  
**Units:** currency; percent  
**Output:** `varianceAmount`, `variancePercent`  
**Golden ID:** `reporting_kpi_variance_basic`  
**Test file:** `pending`  
**Edge cases:** `budget = 0` => `variancePercent = null`  
**Usage limits:** Management reporting only. Not audited financial statements.  
**Approval:** Pending human approval  
**Last reviewed:** 2026-05-20  

---

### EXEC_MODULE_HEALTH_AVG

**Formula ID:** EXEC_MODULE_HEALTH_AVG  
**Module:** Executive Overview  
**Owner:** Product / Logic Integrity  
**Source:** Golden Dataset  
**Status:** Pending C.13.x validation (C.13.1 Executive Overview audit)  
**Formula:** `averageHealth = sum(moduleScores) / count(moduleScores)`  
**Inputs:** `moduleScores` map  
**Units:** score 0–100 average  
**Output:** `averageHealth`  
**Golden ID:** `executive_module_health_average_basic`  
**Test file:** `pending`  
**Edge cases:** Empty map behavior must be explicit in code (define in C.13.1)  
**Usage limits:** Aggregator metric only. Compliance/funding/M&A/risk signals are separate formulas.  
**Approval:** Pending human approval · Approved for DSS/demo scope (documentation only until audit)  
**Last reviewed:** 2026-05-20  

---

### Pending discovery — not in Required Formula Table (C.13.2B)

Do not invent math. Classify for future module audits:

| Area | Candidate metric | Classification | Target audit |
|---|---|---|---|
| M&A | Buyer matching score | **MA_BUYER_MATCH_FIT** — Pending Formula Approval (C.13.4B); DSS heuristic | C.13.4D+ labels |
| M&A | Product waterfall | **MA_PRODUCT_WATERFALL** — Pending Formula Approval (C.13.4B) | C.13.4C document gap vs WATERFALL_SIMPLE |
| M&A | Complex waterfall with preferences | Pending discovery — stub `ma_complex_waterfall_with_preferences` | Future phase |
| Funding | Liquidation preference | Pending discovery — stub `funding_liquidation_preference_future_phase_j` | C.13.4 Funding |
| Funding | Funding window / readiness / risk aggregates | Pending discovery in C.13.4 | C.13.4 Funding |
| Compliance | Jurisdiction exposure | Pending discovery — stub `compliance_jurisdiction_exposure` | C.13.3 Compliance |
| PMI | Integration health | Pending discovery — stub `pmi_integration_health` | C.13.6 PMI |
| Bridge | Recalculate cross-module signal | Pending discovery — stub `bridge_recalculate_cross_module_signal` | C.13.7 Bridge |
| Bridge | Branch opportunity / marketplace scoring | Pending discovery — formula-like heuristics; no registry row | C.13.7 Bridge |
| Risk | Control effectiveness / heatmap severity rollup | Pending discovery — stub `risk_control_effectiveness` | C.13.8 Risk |
| Reporting | Board pack KPI rollup | Pending discovery — stub `reporting_board_pack_kpi_rollup` | C.13.9 Reporting |
| Executive | Module signal aggregation (compliance/funding/risk/M&A posture) | Pending discovery — composite DSS; not single formula | C.13.1 Executive |
| Governance / Strategy | Program scoring | Pending discovery — no Formula Registry row yet | C.13.5 / C.13.10 |

## Compliance Scoring — Hybrid Model (Decision C.13.1C-f1B)

**Adopted decision:** Option C — controlled hybrid. Three separate metrics. Do not collapse into one ambiguous `riskScore`.

### A) weightedRiskScore (canonical for Golden / reports)

| Field | Value |
|---|---|
| **Status** | Canonical definition for `weightedRiskScore` |
| **Formula** | `weightedRiskScore = financialRisk*0.4 + jurisdictionRisk*0.4 + evidenceRisk*0.2` |
| **Inputs** | `financialRisk`, `jurisdictionRisk`, `evidenceRisk` — each normalized 0–100 |
| **Output** | `weightedRiskScore` 0–100 |
| **Golden Dataset ID** | `compliance_weighted_risk_score_basic` |
| **Implementation status** | **Implemented** — helper + golden test + reports/export (see C.13.2A approval block) |
| **Usage** | Executive reports, benchmark, golden tests, explicable decision-support |
| **Does not** | Replace `operationalRiskScore` automatically |

### B) operationalRiskScore (existing FE operational engine)

| Field | Value |
|---|---|
| **Status** | Existing operational engine — pending hardening and naming |
| **Formula (current FE)** | `calculateSupplierRiskScore` in `complianceScoring.js`: criticality + tier + region + alert-derived risk + evidence gap/low-confidence penalties + review adjustments → clamp 0–100 |
| **Inputs** | `criticality`, `tier`, `region`, `alerts`, `evidenceItems`, `reviews` |
| **Output (target name)** | `operationalRiskScore` 0–100 |
| **Current issue** | Often surfaced as `riskScore`; `useComplianceEngine.js` may override backend persisted values |
| **Implementation status** | **Existing FE behavior** — not golden oracle; SoT cleanup pending |
| **Usage** | Dashboards, operational prioritization, internal DSS signals |

### C) resilienceScore (pending alignment subphase)

| Field | Value |
|---|---|
| **Status** | Pending alignment — do not fix in same pass as weighted helper |
| **Golden formula** | `resilienceScore = clamp(100 - riskScore + mitigationBonus, 0, 100)` |
| **Golden Dataset ID** | `compliance_resilience_score_basic` |
| **Current FE formula** | `calculateResilienceScore` in `resilienceScore.js` — different model (`base 72` + penalties/bonuses) |
| **Implementation status** | **Golden helper implemented** — operational FE engine remains separate (C.13.2A) |
| **Note** | Golden `riskScore` input refers to weighted/oracle context in pedagogical dataset, not operational engine output |

### Compliance naming rule (documentation only until code phase)

- Do not label `operationalRiskScore` as `weightedRiskScore`.
- Do not use persisted backend `riskScore` as proof of operational or weighted calculation without explicit label.
- Field rename in code (`riskScore` → `operationalRiskScore`) is a **future** controlled fix — not part of C.13.1C-f1B.

## Calculation Rules

1. Do not round inside core calculation unless business rule requires it.
2. Round at presentation layer for display.
3. Never display Infinity or NaN to users for financial metrics.
4. Never modify Golden Dataset expected values to make failing code pass.
5. Any critical formula without Golden Dataset mapping is P1 gap before pilot readiness.
6. Any implementation not audited remains `Pending C.13 validation`.
7. Edge cases must be explicit in code and tests, not accidental JavaScript division behavior.

## Tutor Explanation Requirement

When auditing a formula, document:

- why this formula is used
- what inputs it trusts
- what the output means for executives
- what the output does not mean (not legal/financial certification)
- which test or golden proves it
- which disclaimer appears in UI/export

## Next Step

- **C.13.2C:** Progressive enforcement in `formulaRegistryCoverage.test.js` (by module lot; pending exceptions).
- **C.13.3–C.13.9:** Module Logic Integrity audits — compare code to Golden; add dedicated unit tests where missing.
- **C.13:** Update Implementation Status to Matches golden, Mismatch, or Duplicate implementation found per audit.

Do not change this registry to hide code bugs.
