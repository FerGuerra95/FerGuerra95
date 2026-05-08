import { useMemo } from 'react';
import { formatCurrency } from '../../../shared/utils/formatCurrency.js';
import {
  SECTOR_DATA,
  DEFAULT_SECTOR,
  parseFinancialInputs,
  calculateCoreMetrics,
  calculateDcfEnterpriseValue
} from './valuationFormulas.js';
import {
  getRiskModeMultiplier,
  calculateQualityScore,
  buildRiskLevel
} from './riskScoring.js';
import {
  buildComparables,
  buildBuyerMatches,
  buildNarrative
} from './reportBuilder.js';
import { buildDecisionSourcePack } from './sourceEvidence.js';
import { applyComplianceValuationImpact } from './complianceValuationBridge.js';
import { clamp } from '../../../shared/utils/validators.js';

export function useValuationEngine({ financials, settings }) {
  return useMemo(() => {
    const activeSector = financials?.sector || DEFAULT_SECTOR;
    const sectorMeta = SECTOR_DATA[activeSector] ?? SECTOR_DATA[DEFAULT_SECTOR];
    const reportCurrency = settings?.reportCurrency || 'EUR';
    const riskMode = settings?.riskMode || 'balanced';

    const inputs = parseFinancialInputs(financials);
    const core = calculateCoreMetrics(inputs);

    const qualityScore = calculateQualityScore({
      inputs,
      sectorMeta
    });

    const riskModeMultiplier = getRiskModeMultiplier(riskMode);

    const preComplianceMultiple = clamp(
      sectorMeta.mult * riskModeMultiplier * (0.72 + qualityScore / 100),
      1.6,
      12
    );
    const complianceValuation = applyComplianceValuationImpact(
      preComplianceMultiple,
      settings?.complianceRiskImpact
    );
    const adjustedMultiple = complianceValuation.adjustedMultiple;

    const evLow =
      core.normalizedEbitda * clamp(adjustedMultiple - 0.5, 1.4, 11);
    const evBase = core.normalizedEbitda * adjustedMultiple;
    const evHigh =
      core.normalizedEbitda * clamp(adjustedMultiple + 0.6, 1.8, 13);

    const equityLow = evLow - core.netDebt + core.wcAdjustment;
    const equityBase = evBase - core.netDebt + core.wcAdjustment;
    const equityHigh = evHigh - core.netDebt + core.wcAdjustment;

    const totalSynergyValue = inputs.synergiesCost * 4.5 + inputs.synergiesRev * 3;
    const maxDebtCapacity = core.normalizedEbitda * inputs.leverageRatioSetting;
    const lboEquityReq = evBase - maxDebtCapacity;
    const dcf = calculateDcfEnterpriseValue({
      normalizedEbitda: core.normalizedEbitda,
      growthPct: inputs.growth,
      taxRatePct: inputs.taxRate,
      waccPct: inputs.wacc,
      terminalGrowthPct: inputs.terminalGrowth,
      projectionYears: inputs.projectionYears,
      depreciationAmortization: inputs.depreciationAmortization,
      capex: inputs.capex,
      changeInWorkingCapital: inputs.changeInWorkingCapital
    });
    const dcfEnterpriseValue = dcf.enterpriseValue;
    const blendedEnterpriseValue = Number.isFinite(Number(dcfEnterpriseValue))
      ? evBase * 0.65 + Number(dcfEnterpriseValue) * 0.35
      : evBase;

    const feesVal = equityBase * (inputs.transactionFees / 100);
    const taxableAmount = Math.max(0, equityBase - feesVal);
    const taxesVal = taxableAmount * (inputs.taxRate / 100);
    const netProceeds = equityBase - feesVal - taxesVal;

    const foundersCash = netProceeds * (inputs.foundersEquity / 100);
    const investorsCash = netProceeds * (1 - inputs.foundersEquity / 100);

    const cashAtClosing = clamp(
      Math.round(
        84 -
          inputs.ownerDependency * 0.16 -
          inputs.clientConcentration * 0.1 -
          core.leverageRatio * 5
      ),
      55,
      90
    );

    const escrow = clamp(
      Math.round(5 + sectorMeta.risk * 10 + core.leverageRatio),
      5,
      12
    );

    const earnOut = clamp(100 - cashAtClosing - escrow, 5, 30);

    const sensitivityMatrix = [-1, -0.5, 0, 0.5, 1].map((multipleStep) =>
      [-10, -5, 0, 5, 10].map((ebitStep) => {
        const scenarioEbitda = core.normalizedEbitda * (1 + ebitStep / 100);
        const scenarioMultiple = adjustedMultiple + multipleStep;

        return (
          scenarioEbitda * scenarioMultiple -
          core.netDebt +
          core.wcAdjustment
        );
      })
    );

    const inferences = [];

    if (inputs.regionHighRisk > 20) {
      inferences.push({
        type: 'Legal Risk',
        impact: 'High',
        sourceId: 'ma.financials.regionHighRisk',
        sourceLabel: 'High-risk supply chain exposure input',
        msg: `Riesgo CSDDD: ${inputs.regionHighRisk}% de la cadena en zona de conflicto. Auditoría física requerida.`
      });
    }

    if (inputs.clientConcentration > 30) {
      inferences.push({
        type: 'Risk',
        impact: 'Medium',
        sourceId: 'ma.financials.clientConcentration',
        sourceLabel: 'Client concentration input',
        msg: `Concentración de ingresos (${inputs.clientConcentration}%). Reforzar earn-out o cláusulas protectoras.`
      });
    }

    if (inputs.growth > 20) {
      inferences.push({
        type: 'Opportunity',
        impact: 'Low',
        sourceId: 'ma.financials.growth',
        sourceLabel: 'Reported YoY growth input',
        msg: `Crecimiento acelerado (${inputs.growth}% YoY). Prima razonable de mercado.`
      });
    }

    const riskLevel = buildRiskLevel(qualityScore);

    const comparables = buildComparables(activeSector, adjustedMultiple);

    const buyerMatches = buildBuyerMatches({
      sector: activeSector,
      qualityScore,
      leverageRatio: core.leverageRatio,
      recurringRevenue: inputs.recurringRevenue,
      ownerDependency: inputs.ownerDependency,
      clientConcentration: inputs.clientConcentration
    });

    const derived = {
      ...inputs,
      ...core,
      sectorMeta,
      qualityScore,
      preComplianceMultiple,
      adjustedMultiple,
      complianceRiskImpact: complianceValuation.complianceRiskImpact,
      evLow,
      evBase,
      evHigh,
      equityLow,
      equityBase,
      equityHigh,
      totalSynergyValue,
      maxDebtCapacity,
      lboEquityReq,
      dcfEnterpriseValue,
      dcfAnnualCashFlows: dcf.annualCashFlows,
      dcfTerminalValue: dcf.terminalValue,
      dcfTerminalPresentValue: dcf.terminalPresentValue,
      dcfWarnings: dcf.warnings,
      blendedEnterpriseValue,
      feesVal,
      taxesVal,
      netProceeds,
      foundersCash,
      investorsCash,
      cashAtClosing,
      escrow,
      earnOut,
      riskLevel,
      inferences,
      sensitivityMatrix,
      comparables,
      buyerMatches
    };

    const narrative = buildNarrative({
      financials,
      settings,
      derived
    });

    const decisionSourcePack = buildDecisionSourcePack({
      financials,
      settings,
      derived: {
        ...derived,
        ...narrative
      }
    });

    return {
      ...derived,
      ...narrative,
      decisionSourcePack: decisionSourcePack.sources,
      decisionSourceSummary: decisionSourcePack.summary,
      pretty: {
        equityBase: formatCurrency(equityBase, reportCurrency),
        evBase: formatCurrency(evBase, reportCurrency),
        dcfEnterpriseValue: formatCurrency(dcfEnterpriseValue, reportCurrency),
        blendedEnterpriseValue: formatCurrency(blendedEnterpriseValue, reportCurrency),
        netDebt: formatCurrency(core.netDebt, reportCurrency),
        netProceeds: formatCurrency(netProceeds, reportCurrency)
      }
    };
  }, [financials, settings]);
}
