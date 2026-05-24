import { describe, expect, it } from 'vitest';

import { usePMIEngine } from '../../../src/modules/pmi/engine/usePMIEngine.js';

describe('usePMIEngine enterprise metrics', () => {
  it('calcula gap de sinergias, presupuesto restante, riesgos abiertos y workstreams bloqueados', () => {
    const engine = usePMIEngine({
      pmiCase: {
        synergyTarget: 1000,
        synergyCaptured: 400,
        integrationBudget: 500,
        integrationCostUsed: 125,
        workstreams: [
          { id: 'ops', progress: 80, risk: 'Low' },
          { id: 'systems', progress: 30, risk: 'High' }
        ],
        milestones: [
          { id: 'day30', progress: 100 },
          { id: 'day60', progress: 50 }
        ],
        risks: [
          { id: 'systems-delay', severity: 'High', status: 'mitigating' },
          { id: 'retention', severity: 'Medium', status: 'closed' }
        ],
        synergyLedger: [
          { id: 'cost', forecast: 500, captured: 250, confidence: 80 },
          { id: 'revenue', forecast: 500, captured: 100, confidence: 60 }
        ],
        playbooks: [
          {
            id: 'day30',
            checklist: [
              { id: 'owners', done: true },
              { id: 'risks', done: false }
            ]
          }
        ],
        dependencies: [
          { id: 'systems-finance', status: 'Blocked', severity: 'High' },
          { id: 'ops-finance', status: 'Monitoring', severity: 'Medium' }
        ]
      }
    });

    expect(engine.synergyGap).toBe(600);
    expect(engine.budgetRemaining).toBe(375);
    expect(engine.openRiskCount).toBe(1);
    expect(engine.highRiskCount).toBe(1);
    expect(engine.blockedWorkstreams.map((item) => item.id)).toEqual(['systems']);
    expect(engine.ledgerForecast).toBe(1000);
    expect(engine.ledgerCaptured).toBe(350);
    expect(engine.ledgerCaptureRate).toBe(35);
    expect(engine.ledgerConfidenceScore).toBe(70);
    expect(engine.playbookProgress).toBe(50);
    expect(engine.blockedDependencies.map((item) => item.id)).toEqual(['systems-finance']);
    expect(engine.executionVelocity).toBeGreaterThan(0);
  });

  it('returns null capture rates when synergy target or ledger forecast is zero', () => {
    const engine = usePMIEngine({
      pmiCase: {
        synergyTarget: 0,
        synergyCaptured: 500_000,
        synergyLedger: [{ forecast: 0, captured: 100_000 }]
      }
    });

    expect(engine.synergyCaptureRate).toBeNull();
    expect(engine.ledgerCaptureRate).toBeNull();
    expect(Number.isNaN(engine.integrationScore)).toBe(false);
  });
});
