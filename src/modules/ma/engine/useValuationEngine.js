import { useMemo } from 'react';
import { formatCurrency } from '../../../shared/utils/formatCurrency.js';
import {
  SECTOR_DATA,
  DEFAULT_SECTOR,
  parseFinancialInputs,
  calculateCoreMetrics
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

    const adjustedMultiple = clamp(
      sectorMeta.mult * riskModeMultiplier * (0.72 + qualityScore / 100),
      1.6,
      12
    );

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
        msg: `Riesgo CSDDD: ${inputs.regionHighRisk}% de la cadena en zona de conflicto. Auditoría física requerida.`
      });
    }

    if (inputs.clientConcentration > 30) {
      inferences.push({
        type: 'Risk',
        impact: 'Medium',
        msg: `Concentración de ingresos (${inputs.clientConcentration}%). Reforzar earn-out o cláusulas protectoras.`
      });
    }

    if (inputs.growth > 20) {
      inferences.push({
        type: 'Opportunity',
        impact: 'Low',
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
      adjustedMultiple,
      evLow,
      evBase,
      evHigh,
      equityLow,
      equityBase,
      equityHigh,
      totalSynergyValue,
      maxDebtCapacity,
      lboEquityReq,
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

    return {
      ...derived,
      ...narrative,
      pretty: {
        equityBase: formatCurrency(equityBase, reportCurrency),
        evBase: formatCurrency(evBase, reportCurrency),
        netDebt: formatCurrency(core.netDebt, reportCurrency),
        netProceeds: formatCurrency(netProceeds, reportCurrency)
      }
    };
  }, [financials, settings]);
}