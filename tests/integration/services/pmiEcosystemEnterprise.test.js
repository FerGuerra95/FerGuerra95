import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { initializeDatabaseSchema } from '../../../backend/storage/databaseSchema.js';
import { closeDatabase, getSql } from '../../../backend/storage/sqliteStorage.js';
import {
  createPmiCase,
  createPmiCaseFromMaDeal,
  getPmiExecutiveHubBrief,
  listPmiAuditLogs,
  updatePmiCase
} from '../../../backend/services/pmi/pmi.service.js';
import { createMaDeal } from '../../../backend/services/ma/deals.service.js';
import {
  createEcosystemRecord,
  getEcosystemExecutiveHubBrief,
  updateEcosystemRecord
} from '../../../backend/services/ecosystem/ecosystem.service.js';
import {
  createBridgeCounterparty,
  createBridgeDocument,
  createBridgeIntroduction,
  createBridgeOpportunity,
  generateBridgeNetworkReport,
  getBridgeExecutiveHubBrief,
  getBridgeMatches
} from '../../../backend/services/bridge/bridge.service.js';
import {
  createGovernanceControl,
  createGovernanceDecision,
  createGovernanceEsgMetric,
  getGovernanceExecutiveHubBrief
} from '../../../backend/services/governance/governance.service.js';
import {
  createHeritageAsset,
  createHeritageDocument,
  createHeritageProtection,
  createHeritageSuccession,
  generateHeritageContinuityReport,
  getHeritageExecutiveHubBrief
} from '../../../backend/services/heritage/heritage.service.js';

let tempDir = '';

describe('PMI and ecosystem enterprise foundations', () => {
  beforeAll(() => {
    closeDatabase();
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ceos-pmi-ecosystem-'));
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

  it('aplica migraciones para PMI, ecosystem records y ramas enterprise', () => {
    const migration = getSql(
      `
        SELECT id
        FROM schema_migrations
        WHERE id = @id
        LIMIT 1
      `,
      { id: '007_pmi_ecosystem_foundation' }
    );
    const pmiTable = getSql(
      `
        SELECT name
        FROM sqlite_master
        WHERE type = 'table'
          AND name = 'pmi_cases'
        LIMIT 1
      `
    );
    const ecosystemTable = getSql(
      `
        SELECT name
        FROM sqlite_master
        WHERE type = 'table'
          AND name = 'ecosystem_records'
        LIMIT 1
      `
    );
    const bridgeTable = getSql(
      `
        SELECT name
        FROM sqlite_master
        WHERE type = 'table'
          AND name = 'bridge_opportunities'
        LIMIT 1
      `
    );
    const bridgeReportTable = getSql(
      `
        SELECT name
        FROM sqlite_master
        WHERE type = 'table'
          AND name = 'bridge_reports'
        LIMIT 1
      `
    );
    const governanceTable = getSql(
      `
        SELECT name
        FROM sqlite_master
        WHERE type = 'table'
          AND name = 'governance_decisions'
        LIMIT 1
      `
    );
    const heritageTable = getSql(
      `
        SELECT name
        FROM sqlite_master
        WHERE type = 'table'
          AND name = 'heritage_assets'
        LIMIT 1
      `
    );
    const heritageReportTable = getSql(
      `
        SELECT name
        FROM sqlite_master
        WHERE type = 'table'
          AND name = 'heritage_reports'
        LIMIT 1
      `
    );

    expect(migration?.id).toBe('007_pmi_ecosystem_foundation');
    expect(pmiTable?.name).toBe('pmi_cases');
    expect(ecosystemTable?.name).toBe('ecosystem_records');
    expect(bridgeTable?.name).toBe('bridge_opportunities');
    expect(bridgeReportTable?.name).toBe('bridge_reports');
    expect(governanceTable?.name).toBe('governance_decisions');
    expect(heritageTable?.name).toBe('heritage_assets');
    expect(heritageReportTable?.name).toBe('heritage_reports');
  });

  it('PMI hub resume sinergias, riesgos y progreso sin romper updates parciales', async () => {
    const created = await createPmiCase(
      'org_pmi_enterprise',
      {
        dealName: 'PMI Enterprise Case',
        synergyTarget: 1000000,
        synergyCaptured: 450000,
        workstreams: [
          { id: 'ops', progress: 80 },
          { id: 'systems', progress: 40 }
        ],
        milestones: [
          { id: 'day30', progress: 100 },
          { id: 'day60', progress: 50 }
        ],
        risks: [
          { id: 'systems-delay', severity: 'High' },
          { id: 'retention', severity: 'Medium' }
        ],
        synergyLedger: [
          { id: 'cost', forecast: 600000, captured: 300000, confidence: 80 },
          { id: 'revenue', forecast: 400000, captured: 100000, confidence: 60 }
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
          { id: 'systems-finance', status: 'Blocked', severity: 'High' }
        ]
      },
      { userId: 'u_pmi_enterprise' }
    );

    await updatePmiCase(
      'org_pmi_enterprise',
      created.id,
      { status: 'active' },
      { userId: 'u_pmi_enterprise' }
    );

    const brief = await getPmiExecutiveHubBrief({
      organizationId: 'org_pmi_enterprise'
    });

    expect(brief.version).toBe('pmi-executive-hub-v2');
    expect(brief.latestCase.dealName).toBe('PMI Enterprise Case');
    expect(brief.latestCase.status).toBe('active');
    expect(brief.metrics.workstreamsCount).toBe(2);
    expect(brief.metrics.highRiskCount).toBe(1);
    expect(brief.metrics.openRiskCount).toBe(2);
    expect(brief.metrics.synergyCaptureRate).toBe(45);
    expect(brief.metrics.synergyGap).toBe(550000);
    expect(brief.metrics.ledgerCaptureRate).toBe(40);
    expect(brief.metrics.playbookProgress).toBe(50);
    expect(brief.metrics.blockedDependenciesCount).toBe(1);
    expect(brief.score).toBeGreaterThan(0);
    expect(brief.executiveSignalEligible).toBe(true);
    expect(brief.dataSource).toBe('persisted');
    expect(brief.demoDataIncluded).toBe(false);
    expect(brief.truthfulness?.hasPersistedData).toBe(true);
  });

  it('crea PMI desde un deal M&A y expone auditoria enterprise', async () => {
    const deal = await createMaDeal({
      organizationId: 'org_pmi_ma_handoff',
      userId: 'u_pmi_ma_handoff',
      name: 'MedTech Platform',
      stage: 'closing',
      ownerName: 'M&A Lead',
      priority: 'high',
      riskLevel: 'high',
      nextStep: 'Confirm Day 1 operating model.',
      expectedCloseAt: '2026-09-30',
      payload: {
        buyerName: 'Strategic Buyer',
        equityValue: 50000000,
        expectedSynergies: 3500000,
        currency: 'EUR'
      }
    });

    const pmiCase = await createPmiCaseFromMaDeal(
      'org_pmi_ma_handoff',
      deal.id,
      { userId: 'u_pmi_ma_handoff' }
    );
    const auditLogs = await listPmiAuditLogs('org_pmi_ma_handoff', {
      caseId: pmiCase.id
    });

    expect(pmiCase.dealName).toBe('MedTech Platform Integration');
    expect(pmiCase.sourceDealId).toBe(deal.id);
    expect(pmiCase.workstreams.length).toBeGreaterThanOrEqual(3);
    expect(pmiCase.synergyLedger.length).toBeGreaterThanOrEqual(3);
    expect(pmiCase.playbooks.length).toBeGreaterThanOrEqual(3);
    expect(pmiCase.dependencies.length).toBeGreaterThanOrEqual(1);
    expect(pmiCase.risks[0].severity).toBe('High');
    expect(auditLogs.some((item) => item.action === 'pmi.case.created_from_ma_deal')).toBe(true);
  });

  it('registra auditoria granular cuando cambian workstreams, riesgos y acciones board', async () => {
    const created = await createPmiCase(
      'org_pmi_granular_audit',
      {
        dealName: 'Granular PMI Audit Case',
        workstreams: [{ id: 'ops', name: 'Operations', progress: 10, risk: 'Low' }],
        risks: [{ id: 'risk-1', title: 'Retention', severity: 'Medium', status: 'open' }],
        milestones: [{ id: 'day30', title: 'Day 30', status: 'Pending', progress: 0 }],
        boardActions: ['Review integration budget']
      },
      { userId: 'u_pmi_granular_audit' }
    );

    await updatePmiCase(
      'org_pmi_granular_audit',
      created.id,
      {
        workstreams: [{ id: 'ops', name: 'Operations', progress: 55, risk: 'High' }],
        risks: [{ id: 'risk-1', title: 'Retention', severity: 'High', status: 'mitigating' }],
        milestones: [{ id: 'day30', title: 'Day 30', status: 'In progress', progress: 30 }],
        boardActions: []
      },
      { userId: 'u_pmi_granular_audit' }
    );

    const auditLogs = await listPmiAuditLogs('org_pmi_granular_audit', {
      caseId: created.id
    });
    const actions = auditLogs.map((item) => item.action);

    expect(actions).toContain('pmi.workstream.progress_changed');
    expect(actions).toContain('pmi.workstream.risk_changed');
    expect(actions).toContain('pmi.risk.severity_changed');
    expect(actions).toContain('pmi.risk.status_changed');
    expect(actions).toContain('pmi.milestone.status_changed');
    expect(actions).toContain('pmi.board_action.closed');
  });

  it('ecosystem hub conecta governance, heritage y bridge por rama', async () => {
    const governance = await createEcosystemRecord(
      'org_ecosystem_enterprise',
      'governance',
      {
        title: 'Board ESG Control',
        status: 'active',
        score: '82',
        payload: { posture: 'Board controls active' }
      },
      { userId: 'u_ecosystem_enterprise' }
    );

    await updateEcosystemRecord(
      'org_ecosystem_enterprise',
      'governance',
      governance.id,
      { status: 'ready' },
      { userId: 'u_ecosystem_enterprise' }
    );
    await createGovernanceDecision(
      'org_ecosystem_enterprise',
      {
        title: 'Approve ESG control cadence',
        status: 'approved',
        evidenceStatus: 'approved',
        boardApprovalRequired: false
      },
      { userId: 'u_ecosystem_enterprise' }
    );
    await createGovernanceControl(
      'org_ecosystem_enterprise',
      {
        name: 'Board decision ledger',
        domain: 'Board',
        effectiveness: 84,
        status: 'active'
      },
      { userId: 'u_ecosystem_enterprise' }
    );
    await createGovernanceEsgMetric(
      'org_ecosystem_enterprise',
      {
        metric: 'Board evidence readiness',
        pillar: 'Governance',
        value: 80,
        target: 100,
        evidenceStatus: 'ready'
      },
      { userId: 'u_ecosystem_enterprise' }
    );

    const opportunity = await createBridgeOpportunity(
      'org_ecosystem_enterprise',
      {
        title: 'Verified Investor Network',
        status: 'active',
        stage: 'Introductions',
        qualificationStatus: 'qualified',
        opportunityValue: 5000000,
        probability: 50,
        ndaStatus: 'signed',
        redactionLevel: 'teaser',
        boardApprovalRequired: false
      },
      { userId: 'u_ecosystem_enterprise' }
    );
    const counterparty = await createBridgeCounterparty(
      'org_ecosystem_enterprise',
      {
        name: 'Verified Growth Fund',
        counterpartyType: 'Growth investor',
        sectorFocus: 'General',
        geography: 'Europe',
        ticketMin: 1000000,
        ticketMax: 10000000,
        kycStatus: 'verified'
      },
      { userId: 'u_ecosystem_enterprise' }
    );
    await createBridgeIntroduction(
      'org_ecosystem_enterprise',
      {
        opportunityId: opportunity.id,
        counterpartyId: counterparty.id,
        status: 'sent',
        ndaStatus: 'signed'
      },
      { userId: 'u_ecosystem_enterprise' }
    );
    await createBridgeDocument(
      'org_ecosystem_enterprise',
      {
        title: 'Verified teaser pack',
        documentType: 'teaser',
        opportunityId: opportunity.id,
        ndaStatus: 'signed',
        redactionLevel: 'teaser'
      },
      { userId: 'u_ecosystem_enterprise' }
    );
    await generateBridgeNetworkReport(
      {
        organizationId: 'org_ecosystem_enterprise',
        userId: 'u_ecosystem_enterprise'
      },
      { title: 'Verified network memo', opportunityId: opportunity.id }
    );
    await createHeritageAsset(
      'org_ecosystem_enterprise',
      {
        name: 'Founder HoldCo',
        assetType: 'Operating company',
        estimatedValue: 12000000,
        protectionStatus: 'protected',
        liquidityProfile: 'medium',
        riskLevel: 'medium'
      },
      { userId: 'u_ecosystem_enterprise' }
    );
    await createHeritageSuccession(
      'org_ecosystem_enterprise',
      {
        title: 'Owner succession protocol',
        status: 'active',
        readiness: 80,
        evidenceStatus: 'ready'
      },
      { userId: 'u_ecosystem_enterprise' }
    );
    await createHeritageProtection(
      'org_ecosystem_enterprise',
      {
        name: 'Asset protection review',
        domain: 'Legal',
        coverage: 76
      },
      { userId: 'u_ecosystem_enterprise' }
    );
    await createHeritageDocument(
      'org_ecosystem_enterprise',
      {
        title: 'Owner protocol evidence',
        documentType: 'protocol',
        evidenceStatus: 'ready'
      },
      { userId: 'u_ecosystem_enterprise' }
    );
    await generateHeritageContinuityReport(
      {
        organizationId: 'org_ecosystem_enterprise',
        userId: 'u_ecosystem_enterprise'
      },
      { title: 'Owner continuity report' }
    );

    const brief = await getEcosystemExecutiveHubBrief({
      organizationId: 'org_ecosystem_enterprise'
    });
    const bridgeBrief = await getBridgeExecutiveHubBrief({
      organizationId: 'org_ecosystem_enterprise'
    });
    const governanceBrief = await getGovernanceExecutiveHubBrief({
      organizationId: 'org_ecosystem_enterprise'
    });
    const heritageBrief = await getHeritageExecutiveHubBrief({
      organizationId: 'org_ecosystem_enterprise'
    });
    const matches = await getBridgeMatches('org_ecosystem_enterprise', opportunity.id);
    const governanceBranch = brief.branches.find((item) => item.branch === 'governance');
    const bridgeBranch = brief.branches.find((item) => item.branch === 'bridge');
    const heritageBranch = brief.branches.find((item) => item.branch === 'heritage');

    expect(brief.version).toBe('ecosystem-executive-hub-v1');
    expect(governanceBranch.score).toBe(governanceBrief.score);
    expect(governanceBranch.metrics.controlsCount).toBe(1);
    expect(governanceBranch.metrics.esgReadiness).toBe(80);
    expect(bridgeBranch.score).toBe(bridgeBrief.score);
    expect(bridgeBranch.metrics.totalOpportunityValue).toBe(5000000);
    expect(bridgeBranch.metrics.weightedPipelineValue).toBe(2500000);
    expect(bridgeBranch.metrics.introductionsCount).toBe(1);
    expect(bridgeBranch.metrics.qualifiedOpportunitiesCount).toBe(1);
    expect(bridgeBranch.metrics.counterpartiesCount).toBe(1);
    expect(bridgeBranch.metrics.documentsCount).toBe(1);
    expect(bridgeBranch.metrics.reportsCount).toBe(1);
    expect(matches[0].counterparty.id).toBe(counterparty.id);
    expect(heritageBranch.score).toBe(heritageBrief.score);
    expect(heritageBranch.metrics.totalAssetValue).toBe(12000000);
    expect(heritageBranch.metrics.successionReadiness).toBe(80);
    expect(heritageBranch.metrics.protectionCoverage).toBe(88);
    expect(heritageBranch.metrics.documentsCount).toBe(1);
    expect(heritageBranch.metrics.reportsCount).toBe(1);
    expect(brief.score).toBeGreaterThan(0);
  });
});
