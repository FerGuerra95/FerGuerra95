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
| EV_EBITDA | M&A | enterpriseValue = ebitda * multiple | ebitda, multiple | enterpriseValue | negative EBITDA needs human review | ma_valuation_ebitda_multiple_basic | Pending C.13 validation | Pending C.13 validation | Indicative DSS valuation only. Not fairness opinion. |
| NET_DEBT | M&A | netDebt = debt - cash | debt, cash | netDebt | | ma_valuation_equity_value_basic | Pending C.13 validation | Pending C.13 validation | Indicative only. |
| EQUITY_VALUE | M&A | equityValue = enterpriseValue - netDebt | enterpriseValue, netDebt | equityValue | | ma_valuation_equity_value_basic | Pending C.13 validation | Pending C.13 validation | Indicative only. |
| WATERFALL_SIMPLE | M&A | netCashToSeller = grossProceeds - transactionCosts - debtRepayment - sellerRollover | four currency inputs | netCashToSeller | negative proceeds human review | ma_waterfall_simple_distribution | Pending C.13 validation | Pending C.13 validation | Indicative waterfall only. |
| RUNWAY_MONTHS | Funding | runwayMonths = cashBalance / monthlyBurn | cashBalance, monthlyBurn | runwayMonths | monthlyBurn <= 0 => null; never Infinity/NaN | funding_runway_basic, funding_runway_zero_burn | Pending C.13 validation | Pending C.13 validation | Planning estimate. Not investment advice. |
| POST_MONEY | Funding | postMoney = preMoney + newInvestment | preMoney, newInvestment | postMoney | | funding_post_money_and_dilution_basic | Pending C.13 validation | Pending C.13 validation | Planning estimate. |
| INVESTOR_OWNERSHIP | Funding | investorOwnership = newInvestment / postMoney | newInvestment, postMoney | decimal and percent | postMoney <= 0 => null | funding_post_money_and_dilution_basic | Pending C.13 validation | Pending C.13 validation | Planning estimate. |
| COMPLIANCE_WEIGHTED_RISK | Compliance | weightedRiskScore = financialRisk*0.4 + jurisdictionRisk*0.4 + evidenceRisk*0.2 | financialRisk, jurisdictionRisk, evidenceRisk (each 0–100) | weightedRiskScore 0–100 | clamp 0–100 at presentation | compliance_weighted_risk_score_basic | Canonical for weightedRiskScore | Pending implementation helper/test | Benchmark/oracle. Not operational engine. |
| COMPLIANCE_OPERATIONAL_RISK | Compliance | operationalRiskScore = f(criticality, tier, region, alerts, evidence gap, confidence, review adjustment) | supplier + alerts + evidence + reviews | operationalRiskScore 0–100 | clamp 0–100 | N/A (not golden oracle) | Existing FE operational model | Existing FE behavior; pending SoT cleanup | Dashboard DSS. Must not be confused with weightedRiskScore. |
| COMPLIANCE_RESILIENCE | Compliance | resilienceScore = clamp(100 - riskScore + mitigationBonus, 0, 100) per golden anchor | riskScore input, mitigationBonus | resilienceScore 0–100 | clamp 0–100 | compliance_resilience_score_basic | Pending alignment | Pending alignment after naming cleanup | Golden formula differs from FE engine today. |
| PMI_CAPTURE_RATE | PMI | captureRate = captured / forecast | capturedSynergies, forecastSynergies | rate decimal/percent | forecast <= 0 => null; never Infinity/NaN | pmi_synergy_capture_rate_basic, pmi_synergy_zero_forecast | Pending C.13 validation | Pending C.13 validation | Not guarantee of capture. |
| BRIDGE_PRIORITY | Bridge | priority = impact*0.5 + urgency*0.3 + confidence*0.2 | three scores, weights | priorityScore | | bridge_priority_score_basic | Pending C.13 validation | Pending C.13 validation | DSS signal priority. Human review required. |
| RISK_LIKELIHOOD_IMPACT | Risk | riskScore = likelihood * impact | likelihood 1-5, impact 1-5 | riskScore, severity band | scale must be documented in code | risk_score_likelihood_impact_basic | Pending C.13 validation | Pending C.13 validation | DSS risk indicator. |
| REPORTING_VARIANCE | Reporting | varianceAmount = actual - budget; variancePercent = varianceAmount/budget*100 | actual, budget | amount and percent | budget = 0 => null for percent | reporting_kpi_variance_basic | Pending C.13 validation | Pending C.13 validation | Management reporting only. |
| EXEC_MODULE_HEALTH_AVG | Executive Overview | averageHealth = sum(scores)/count(scores) | moduleScores map | averageHealth | empty map => define explicit behavior | executive_module_health_average_basic | Pending C.13 validation | Pending C.13 validation | Aggregator metric only. |

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
| **Implementation status** | **Pending** — helper and golden test not yet in codebase |
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
| **Implementation status** | **Pending decision/fix** after naming and FE/BE precedence resolved |
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

C.13 must locate implementation files (frontend engine, backend service) for each row and update Implementation Status to Matches golden, Mismatch, or Duplicate implementation found.

Do not change this registry to hide code bugs.
