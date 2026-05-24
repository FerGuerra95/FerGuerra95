import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { initializeDatabaseSchema } from '../../../backend/storage/databaseSchema.js';
import { closeDatabase } from '../../../backend/storage/sqliteStorage.js';
import { createMaCase, addMaSnapshot } from '../../../backend/services/ma/cases.service.js';
import { createForOrganization } from '../../../backend/services/funding/funding.service.js';
import { createPmiCase } from '../../../backend/services/pmi/pmi.service.js';
import {
  createBridgeDocument,
  createBridgeOpportunity,
  generateBridgeNetworkReport
} from '../../../backend/services/bridge/bridge.service.js';
import {
  createGovernanceControl,
  createGovernanceDecision,
  createGovernanceEsgMetric
} from '../../../backend/services/governance/governance.service.js';
import {
  createHeritageAsset,
  createHeritageDocument,
  createHeritageProtection,
  createHeritageSuccession
} from '../../../backend/services/heritage/heritage.service.js';
import { runComplianceAudit } from '../../../backend/services/compliance/auditRuns.service.js';
import {
  generateBoardPack,
  generateExecutiveSummary
} from '../../../backend/services/reporting/boardPack.service.js';

let tempDir = '';

describe('Unified Board Pack reporting', () => {
  beforeAll(() => {
    closeDatabase();
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ceos-board-pack-'));
    process.env.DB_PATH = path.join(tempDir, 'test.sqlite');
    initializeDatabaseSchema();
  });

  afterAll(() => {
    closeDatabase();
    delete process.env.DB_PATH;

    if (tempDir) {
      fs.rmSync(tempDir, {
        recursive: true,
        force: true
      });
    }
  });

  it('consolida M&A, Compliance, Funding y PMI en un Board Pack ejecutivo', async () => {
    const organizationId = 'org_board_pack';
    const userId = 'u_board_pack';
    const maCase = await createMaCase({
      organizationId,
      userId,
      name: 'Board Pack Target',
      sector: 'SaaS',
      financials: {
        name: 'Board Pack Target',
        sector: 'SaaS',
        normalizedEbitda: 1200000,
        netDebt: 250000
      }
    });

    await addMaSnapshot(
      maCase.id,
      {
        adjustedMultiple: 7.5,
        enterpriseValue: 9000000,
        equityValue: 8750000
      },
      { organizationId }
    );

    await createForOrganization(
      organizationId,
      {
        roundType: 'Series A',
        amountRaised: 2500000,
        valuationPostMoney: 14000000,
        currentCash: 900000,
        monthlyBurnRate: 75000,
        dilutionPercentage: 17.8,
        status: 'active'
      },
      { userId }
    );

    await createPmiCase(
      organizationId,
      {
        dealName: 'Board Pack PMI',
        synergyTarget: 1000000,
        synergyCaptured: 550000,
        workstreams: [{ id: 'ops', progress: 70, risk: 'Medium' }],
        milestones: [{ id: 'day60', progress: 60, status: 'In progress' }],
        risks: [{ id: 'risk-1', severity: 'Medium', status: 'open' }],
        synergyLedger: [{ id: 'cost', forecast: 1000000, captured: 520000, confidence: 75 }],
        playbooks: [
          {
            id: 'day60',
            checklist: [
              { id: 'owners', done: true },
              { id: 'value', done: true },
              { id: 'dependencies', done: false }
            ]
          }
        ],
        dependencies: [{ id: 'ops-finance', status: 'Monitoring', severity: 'Medium' }]
      },
      { userId }
    );

    const bridgeOpportunity = await createBridgeOpportunity(
      organizationId,
      {
        title: 'Board Pack Bridge Opportunity',
        status: 'active',
        stage: 'Introductions',
        qualificationStatus: 'qualified',
        opportunityValue: 4000000,
        probability: 50,
        ndaStatus: 'signed',
        redactionLevel: 'teaser',
        dataRoomAccess: 'restricted',
        boardApprovalRequired: false
      },
      { userId }
    );
    await createBridgeDocument(
      organizationId,
      {
        title: 'Board Pack Bridge teaser',
        documentType: 'teaser',
        opportunityId: bridgeOpportunity.id,
        ndaStatus: 'signed',
        redactionLevel: 'teaser'
      },
      { userId }
    );
    await generateBridgeNetworkReport(
      { organizationId, userId },
      { title: 'Board Pack Bridge Network Memo', opportunityId: bridgeOpportunity.id }
    );

    await createGovernanceDecision(
      organizationId,
      {
        title: 'Approve Board Pack governance cadence',
        status: 'approved',
        evidenceStatus: 'approved',
        boardApprovalRequired: false
      },
      { userId }
    );
    await createGovernanceControl(
      organizationId,
      {
        name: 'Board decision ledger',
        domain: 'Board',
        effectiveness: 82
      },
      { userId }
    );
    await createGovernanceEsgMetric(
      organizationId,
      {
        metric: 'Evidence readiness',
        pillar: 'Governance',
        value: 80,
        target: 100,
        evidenceStatus: 'ready'
      },
      { userId }
    );

    await createHeritageAsset(
      organizationId,
      {
        name: 'Founder HoldCo',
        assetType: 'Operating company',
        estimatedValue: 7000000,
        protectionStatus: 'protected',
        liquidityProfile: 'medium',
        riskLevel: 'medium'
      },
      { userId }
    );
    await createHeritageSuccession(
      organizationId,
      {
        title: 'Owner succession protocol',
        status: 'active',
        readiness: 72,
        evidenceStatus: 'ready'
      },
      { userId }
    );
    await createHeritageProtection(
      organizationId,
      {
        name: 'Holding structure review',
        domain: 'Legal',
        coverage: 78
      },
      { userId }
    );
    await createHeritageDocument(
      organizationId,
      {
        title: 'Board Pack Heritage evidence',
        documentType: 'protocol',
        evidenceStatus: 'ready'
      },
      { userId }
    );

    await runComplianceAudit({
      organizationId,
      userId,
      scope: 'portfolio',
      frameworks: ['eu_supply_chain']
    });

    const boardPack = await generateBoardPack({
      organizationId,
      userId
    });

    expect(boardPack.version).toBe('board-pack-v1');
    expect(boardPack.scoringTruthfulness?.decisionSupportOnly).toBe(true);
    expect(boardPack.branches.ma.valuation).toBe(9000000);
    expect(boardPack.branches.ma.appliedMultiple).toBe(7.5);
    expect(boardPack.branches.funding.capTableStatus).toContain('dilution');
    expect(boardPack.branches.pmi.synergyCaptureRate).toBe(55);
    expect(boardPack.branches.pmi.ledgerCaptureRate).toBe(52);
    expect(boardPack.branches.pmi.playbookProgress).toBe(67);
    expect(boardPack.branches.bridge.weightedPipelineValue).toBe(2000000);
    expect(boardPack.branches.bridge.qualifiedOpportunitiesCount).toBe(1);
    expect(boardPack.branches.bridge.documentsCount).toBe(1);
    expect(boardPack.branches.bridge.reportsCount).toBe(1);
    expect(boardPack.branches.governance.controlsCount).toBe(1);
    expect(boardPack.branches.governance.esgReadiness).toBe(80);
    expect(boardPack.branches.heritage.totalAssetValue).toBe(7000000);
    expect(boardPack.branches.heritage.successionReadiness).toBe(72);
    expect(boardPack.branches.heritage.protectionCoverage).toBe(89);
    expect(boardPack.branches.compliance.auditLedgerStatus).toBe('completed');
    expect(boardPack.executiveSummary).toMatch(/organizacion|requiere|presenta/i);
  });

  it('redacta resumen condicional cuando funding esta fuerte pero compliance requiere atencion', () => {
    const summary = generateExecutiveSummary({
      ma: { valuation: 10000000, appliedMultiple: 8 },
      compliance: { healthScore: 58, criticalFindings: 2 },
      funding: { runwayMonths: 20, score: 82 },
      pmi: {
        synergyCaptureRate: 65,
        ledgerCaptureRate: 62,
        playbookProgress: 80,
        integrationProgress: 70,
        openRiskCount: 0
      },
      bridge: {
        weightedPipelineValue: 2000000,
        qualifiedOpportunitiesCount: 1,
        confidentialityExceptionsCount: 0
      },
      governance: {
        controlEffectiveness: 80,
        evidenceReadiness: 80,
        weakControlsCount: 0,
        openDecisionsCount: 0
      },
      heritage: {
        totalAssetValue: 5000000,
        successionReadiness: 80,
        protectionCoverage: 76,
        weakProtectionsCount: 0,
        openSuccessionItemsCount: 0,
        liquidityRiskCount: 0
      }
    });

    expect(summary).toContain('salud financiera solida');
    expect(summary).toContain('Compliance');
  });

  it('preserva PMI null capture rates and expone scoringTruthfulness en board pack', async () => {
    const organizationId = 'org_board_pack_null_pmi';
    const userId = 'u_board_pack_null';

    await createPmiCase(
      organizationId,
      {
        dealName: 'Zero Target PMI',
        synergyTarget: 0,
        synergyCaptured: 500000,
        synergyLedger: [{ forecast: 0, captured: 100000 }],
        workstreams: [],
        milestones: [],
        risks: []
      },
      { userId }
    );

    const boardPack = await generateBoardPack({ organizationId, userId });

    expect(boardPack.branches.pmi.synergyCaptureRate).toBeNull();
    expect(boardPack.branches.pmi.ledgerCaptureRate).toBeNull();
    expect(boardPack.scoringTruthfulness?.humanReviewRequired).toBe(true);
    expect(boardPack.scoringTruthfulness?.decisionSupportOnly).toBe(true);
    expect(boardPack.scoringTruthfulness?.moduleLayers?.pmi?.preservesNullCapture).toBe(true);
    expect(boardPack.humanReviewRequired).toBe(true);
    expect(Number.isNaN(boardPack.branches.pmi.synergyCaptureRate)).toBe(false);
  });

  it('no convierte compliance legalHealthScore null en score real 55', async () => {
    const boardPack = await generateBoardPack({
      organizationId: 'org_board_pack_no_compliance',
      userId: 'u_none'
    });

    expect(boardPack.branches.compliance.healthScore).toBeNull();
    expect(boardPack.branches.compliance.score).toBeNull();
    expect(boardPack.branches.compliance.insufficientData).toBe(true);
    expect(boardPack.branches.compliance.riskStatus).toBe('insufficient_data');
  });

  it('documenta Governance como operational DSS en scoringTruthfulness del board pack', async () => {
    const boardPack = await generateBoardPack({
      organizationId: 'org_board_pack_governance_truthfulness',
      userId: 'u_gov'
    });

    expect(boardPack.scoringTruthfulness?.moduleLayers?.governance?.certifiedRating).toBe(false);
    expect(boardPack.scoringTruthfulness?.moduleLayers?.governance?.sourceModule).toBe('governance');
    expect(boardPack.scoringTruthfulness?.moduleLayers?.governance?.governanceBoardPacksTable).toBe('governance_board_packs');
  });
});
