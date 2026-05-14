import { describe, expect, it } from 'vitest';

import { calculateExecutiveReadinessIndex } from '../../../backend/services/executive/readinessIndex.service.js';
import { buildExecutiveSignals, rankExecutiveSeverity } from '../../../backend/services/executive/executiveSignals.service.js';
import { buildExecutiveDecisionQueue, sortDecisionQueue } from '../../../backend/services/executive/decisionQueue.service.js';
import { buildBoardViewSnapshot } from '../../../backend/services/executive/boardView.service.js';
import { buildExecutiveCalendar, sortCalendarItems } from '../../../backend/services/executive/executiveCalendar.service.js';

describe('CEO command center enterprise metrics', () => {
  it('calcula readiness index ponderado con missing data defensivo', () => {
    const readiness = calculateExecutiveReadinessIndex({
      ma: { status: 'available', data: { readinessScore: 82 } },
      compliance: { status: 'available', data: { legalHealthScore: 64 } },
      funding: { status: 'not_available', data: null },
      governance: { status: 'available', data: { metrics: { boardReadinessScore: 72 } } },
      pmi: { status: 'available', data: { metrics: { pmiReadinessScore: 68 } } },
      risk: { status: 'available', data: { metrics: { riskReadinessScore: 70 } } },
      reporting: { status: 'available', data: { metrics: { reportingReadinessScore: 76 } } },
      strategy: { status: 'available', data: { metrics: { strategyReadinessScore: 71 } } }
    });
    expect(readiness.score).toBeGreaterThan(0);
    expect(readiness.missingData).toContain('funding');
    expect(readiness.confidence).toBeLessThan(100);
  });

  it('ordena severidad, decision queue y calendario para atención ejecutiva', () => {
    expect(rankExecutiveSeverity('blocked')).toBeGreaterThan(rankExecutiveSeverity('risk'));
    const signals = buildExecutiveSignals({
      moduleSummaries: {
        compliance: { status: 'available', data: { legalHealthScore: 52 } },
        funding: { status: 'available', data: { projectedRunwayMonths: 5 } },
        risk: { status: 'available', data: { metrics: { criticalRiskCount: 1 } } }
      },
      readiness: { missingData: [] }
    });
    expect(signals[0].priorityScore).toBeGreaterThanOrEqual(signals.at(-1).priorityScore);

    const queue = buildExecutiveDecisionQueue({
      moduleSummaries: {
        governance: { status: 'available', data: { metrics: { pendingCriticalDecisions: 1 } } }
      },
      signals
    });
    expect(sortDecisionQueue(queue)[0].severity).toBe('blocked');

    const calendar = sortCalendarItems([
      { title: 'Normal item', priority: 'watch', dueDate: '2026-06-01' },
      { title: 'Critical item', priority: 'critical', dueDate: '2026-06-10' }
    ]);
    expect(calendar[0].title).toBe('Critical item');
  });

  it('prepara board view y calendar sin NaN/undefined visible', () => {
    const board = buildBoardViewSnapshot({
      moduleSummaries: {
        funding: { status: 'available', data: { projectedRunwayMonths: 8 } },
        reporting: { status: 'available', data: { metrics: { reportingReadinessScore: 74 } } }
      },
      signals: [{ module: 'Risk', severity: 'critical', title: 'Risk', recommendedAction: 'Review' }],
      decisionQueue: [{ title: 'Decision', module: 'Governance', severity: 'blocked' }],
      readiness: { score: 72, confidence: 88 }
    });
    expect(board.topRisks.length).toBe(1);
    expect(board.reportingReadiness).toBe(74);

    const calendar = buildExecutiveCalendar({
      moduleSummaries: { reporting: { status: 'available', data: { metrics: { missingEvidenceCount: 2 } } } },
      decisionQueue: []
    });
    expect(calendar.some((item) => item.title === 'Board pack evidence review')).toBe(true);
  });
});
