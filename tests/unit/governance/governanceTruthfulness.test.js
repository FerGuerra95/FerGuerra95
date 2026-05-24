import { describe, expect, it, afterEach } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import React from 'react';

import {
  buildGovernanceBridgeSignalDetails,
  buildGovernanceBridgeSignals,
  calculateGovernanceMetrics,
  summarizeGovernance
} from '../../../backend/services/governance/governance.service.js';
import { DecisionRegisterTable } from '../../../src/modules/governance/components/GovernanceComponents.jsx';
import { getPermissionsForRole, PERMISSIONS } from '../../../backend/api/middlewares/auth.middleware.js';

describe('governance truthfulness — empty org and hub baselines', () => {
  it('returns null readiness scores and insufficient_data for empty governance org', () => {
    const metrics = calculateGovernanceMetrics({
      decisions: [],
      boardPacks: [],
      committees: [],
      policies: [],
      actions: [],
      meetings: []
    });

    expect(metrics.governanceReadinessScore).toBeNull();
    expect(metrics.boardReadinessScore).toBeNull();
    expect(metrics.committeeReadiness).toBeNull();
    expect(metrics.decisionVelocity).toBeNull();
    expect(metrics.governanceStatus).toBe('insufficient_data');
    expect(metrics.dataSource).toBe('insufficient_data');
    expect(metrics.executiveSignalEligible).toBe(false);
    expect(metrics.scoringTruthfulness?.certifiedRating).toBe(false);
  });

  it('does not export 55/58/50 hub baselines when controls and ESG are empty', () => {
    const summary = summarizeGovernance({
      decisions: [{ id: 'd1', status: 'draft' }],
      controls: [],
      esgMetrics: [],
      boardPacks: [],
      committees: [],
      policies: [],
      actions: [],
      meetings: []
    });

    expect(summary.controlEffectiveness).toBeNull();
    expect(summary.esgReadiness).toBeNull();
    expect(summary.governanceReadinessScore).not.toBe(55);
    expect(summary.governanceReadinessScore).not.toBe(58);
  });
});

describe('governance truthfulness — board_pack_ready signal', () => {
  it('keeps legacy key but documents DSS heuristic metadata', () => {
    const signals = buildGovernanceBridgeSignals({ boardReadinessScore: 80 });
    const details = buildGovernanceBridgeSignalDetails({ boardReadinessScore: 80 });
    const ready = details.find((item) => item.key === 'governance.board_pack_ready');

    expect(signals).toContain('governance.board_pack_ready');
    expect(ready?.label).toMatch(/board review draft signal/i);
    expect(ready?.certifiedRating).toBe(false);
    expect(ready?.humanReviewRequired).toBe(true);
    expect(ready?.signalType).toBe('operational_dss');
  });

  it('does not emit board_pack_ready when boardReadinessScore is null', () => {
    expect(buildGovernanceBridgeSignals({ boardReadinessScore: null })).not.toContain('governance.board_pack_ready');
  });
});

describe('governance approve permission alignment', () => {
  afterEach(() => {
    cleanup();
  });

  it('user role has UPDATE but not APPROVE — UI must gate Approve separately', () => {
    const userPermissions = getPermissionsForRole('user');
    expect(userPermissions).toContain(PERMISSIONS.UPDATE_GOVERNANCE);
    expect(userPermissions).not.toContain(PERMISSIONS.APPROVE_GOVERNANCE_DECISION);
  });

  it('DecisionRegisterTable disables Approve when canApprove is false', () => {
    render(
      React.createElement(DecisionRegisterTable, {
        items: [{ id: 'd1', title: 'Test decision', status: 'under_review', owner: 'Secretary' }],
        canApprove: false,
        readOnly: false
      })
    );

    expect(screen.getByRole('button', { name: 'Approve' }).disabled).toBe(true);
  });

  it('DecisionRegisterTable enables Approve when canApprove is true', () => {
    render(
      React.createElement(DecisionRegisterTable, {
        items: [{ id: 'd1', title: 'Test decision', status: 'under_review', owner: 'Secretary' }],
        canApprove: true,
        readOnly: false
      })
    );

    expect(screen.getByRole('button', { name: 'Approve' }).disabled).toBe(false);
  });
});
