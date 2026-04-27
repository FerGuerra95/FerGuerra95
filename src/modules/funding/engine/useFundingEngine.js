import { useMemo } from 'react';
import { formatCurrency } from '../../../shared/utils/formatCurrency.js';
import { parseFundingInputs, calculateFundingCore } from './fundingFormulas.js';
import { calculateReadinessScore, buildReadinessLevel, getScenarioMultiplier } from './fundraisingScoring.js';
import { buildInvestorTargets, buildReadinessChecklist, buildDataRoomChecklist, buildFundingNarrative } from './fundingNarrative.js';

export function useFundingEngine({ fundingInputs, fundingSettings }) {
  return useMemo(() => {
    const inputs = parseFundingInputs(fundingInputs);
    const settings = fundingSettings || { reportCurrency: 'EUR', scenarioMode: 'balanced' };
    const core = calculateFundingCore(inputs);

    const readinessScore = calculateReadinessScore({ inputs, core });
    const readinessLevel = buildReadinessLevel(readinessScore);
    const investorTargets = buildInvestorTargets({ inputs, core, readinessScore });
    const readinessChecklist = buildReadinessChecklist({ inputs, core, readinessLevel });
    const dataRoomChecklist = buildDataRoomChecklist(inputs);

    const m = getScenarioMultiplier(settings.scenarioMode);
    const scenarioRows = [
      { name: 'Low', raise: inputs.targetRaise * 0.85, preMoney: inputs.preMoneyValuation * 0.9, burn: inputs.monthlyBurn * 1.05 },
      { name: 'Base', raise: inputs.targetRaise * m.raise, preMoney: inputs.preMoneyValuation * m.valuation, burn: inputs.monthlyBurn * m.burn },
      { name: 'High', raise: inputs.targetRaise * 1.15, preMoney: inputs.preMoneyValuation * 1.1, burn: inputs.monthlyBurn * 0.95 }
    ].map((scenario) => {
      const postMoney = scenario.preMoney + scenario.raise;
      const dilution = postMoney > 0 ? (scenario.raise / postMoney) * 100 : 0;
      const runway = scenario.burn > 0 ? (inputs.currentCash + scenario.raise) / scenario.burn : 999;
      return { ...scenario, postMoney, dilution, runway };
    });

    const blockers = readinessChecklist.filter((item) => item.status !== 'ok');
    const narrative = buildFundingNarrative({ inputs, settings, derived: { ...core, readinessScore, dilutionPct: core.dilutionPct, postMoneyValuation: core.postMoneyValuation, runwayAfterRaiseMonths: core.runwayAfterRaiseMonths } });

    return {
      ...inputs,
      ...core,
      readinessScore,
      readinessLevel,
      readinessChecklist,
      dataRoomChecklist,
      investorTargets,
      scenarioRows,
      blockers,
      ...narrative,
      pretty: {
        targetRaise: formatCurrency(inputs.targetRaise, settings.reportCurrency),
        preMoney: formatCurrency(inputs.preMoneyValuation, settings.reportCurrency),
        postMoney: formatCurrency(core.postMoneyValuation, settings.reportCurrency)
      }
    };
  }, [fundingInputs, fundingSettings]);
}
