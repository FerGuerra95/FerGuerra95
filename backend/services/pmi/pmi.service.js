import { createSqliteEntityStore } from '../../storage/sqliteEntityStore.service.js';
import { listAuditLogs, recordAuditLog } from '../audit/auditLog.service.js';
import { getMaDealById } from '../ma/deals.service.js';

const pmiCasesStore = createSqliteEntityStore('pmi_cases', 'pmi_case', {
  dealName: 'PMI case',
  buyerName: '',
  targetName: '',
  status: 'draft',
  integrationDay: 0,
  synergyTarget: 0,
  synergyCaptured: 0,
  integrationBudget: 0,
  integrationCostUsed: 0,
  currency: 'EUR',
  payload: {}
});

function createError(message, status = 400, code = 'PMI_ERROR') {
  const error = new Error(message);
  error.status = status;
  error.code = code;
  return error;
}

function normalizeText(value, fallback = '') {
  return String(value ?? fallback).trim();
}

function normalizeNumber(value, fallback = 0) {
  if (value === '' || value === null || value === undefined) return fallback;
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function assertOrganizationId(organizationId) {
  if (!normalizeText(organizationId)) {
    throw createError('Scope de organizacion no definido.', 403, 'INVALID_SCOPE');
  }
}

function sanitizePayload(payload = {}, { requireDealName = false } = {}) {
  const source = payload && typeof payload === 'object' ? payload : {};
  const next = {};

  if (requireDealName || source.dealName !== undefined) {
    next.dealName = normalizeText(source.dealName, 'PMI case') || 'PMI case';
  }
  if (source.buyerName !== undefined) next.buyerName = normalizeText(source.buyerName);
  if (source.targetName !== undefined) next.targetName = normalizeText(source.targetName);
  if (source.status !== undefined) next.status = normalizeText(source.status, 'draft') || 'draft';
  if (source.currency !== undefined) next.currency = normalizeText(source.currency, 'EUR') || 'EUR';
  if (source.integrationDay !== undefined) next.integrationDay = normalizeNumber(source.integrationDay);
  if (source.synergyTarget !== undefined) next.synergyTarget = normalizeNumber(source.synergyTarget);
  if (source.synergyCaptured !== undefined) next.synergyCaptured = normalizeNumber(source.synergyCaptured);
  if (source.integrationBudget !== undefined) next.integrationBudget = normalizeNumber(source.integrationBudget);
  if (source.integrationCostUsed !== undefined) {
    next.integrationCostUsed = normalizeNumber(source.integrationCostUsed);
  }

  const payloadPatch = {
    ...(source.payload && typeof source.payload === 'object' ? source.payload : {}),
    ...(source.closingDate !== undefined ? { closingDate: normalizeText(source.closingDate) } : {}),
    ...(source.sourceDealId !== undefined ? { sourceDealId: normalizeText(source.sourceDealId) } : {}),
    ...(Array.isArray(source.workstreams) ? { workstreams: source.workstreams } : {}),
    ...(Array.isArray(source.risks) ? { risks: source.risks } : {}),
    ...(Array.isArray(source.milestones) ? { milestones: source.milestones } : {}),
    ...(Array.isArray(source.boardActions) ? { boardActions: source.boardActions } : {}),
    ...(Array.isArray(source.synergyLedger) ? { synergyLedger: source.synergyLedger } : {}),
    ...(Array.isArray(source.playbooks) ? { playbooks: source.playbooks } : {}),
    ...(Array.isArray(source.dependencies) ? { dependencies: source.dependencies } : {})
  };

  if (Object.keys(payloadPatch).length > 0) {
    next.payload = payloadPatch;
  }

  return next;
}

function expandCase(item) {
  if (!item) return null;

  const payload = item.payload && typeof item.payload === 'object' ? item.payload : {};

  return {
    ...payload,
    ...item,
    workstreams: Array.isArray(payload.workstreams) ? payload.workstreams : [],
    risks: Array.isArray(payload.risks) ? payload.risks : [],
    milestones: Array.isArray(payload.milestones) ? payload.milestones : [],
    boardActions: Array.isArray(payload.boardActions) ? payload.boardActions : [],
    synergyLedger: Array.isArray(payload.synergyLedger) ? payload.synergyLedger : [],
    playbooks: Array.isArray(payload.playbooks) ? payload.playbooks : [],
    dependencies: Array.isArray(payload.dependencies) ? payload.dependencies : []
  };
}

function getAverageProgress(items = []) {
  if (!Array.isArray(items) || items.length === 0) return 0;

  const total = items.reduce((sum, item) => sum + normalizeNumber(item?.progress), 0);

  return Math.max(0, Math.min(100, Math.round(total / items.length)));
}

function getHighRiskCount(risks = []) {
  if (!Array.isArray(risks)) return 0;

  return risks.filter((risk) => {
    const severity = normalizeText(risk?.severity).toLowerCase();
    return severity.includes('high') || severity.includes('critical');
  }).length;
}

function getOpenRiskCount(risks = []) {
  if (!Array.isArray(risks)) return 0;

  return risks.filter((risk) => {
    const status = normalizeText(risk?.status, 'open').toLowerCase();
    return status !== 'closed' && status !== 'mitigated';
  }).length;
}

function getBlockedWorkstreams(workstreams = []) {
  if (!Array.isArray(workstreams)) return [];

  return workstreams.filter((item) => {
    const risk = normalizeText(item?.risk).toLowerCase();
    const progress = normalizeNumber(item?.progress);
    return risk.includes('high') || progress < 45;
  });
}

function getLedgerTotals(synergyLedger = []) {
  const items = Array.isArray(synergyLedger) ? synergyLedger : [];
  const forecast = items.reduce((sum, item) => sum + normalizeNumber(item?.forecast), 0);
  const captured = items.reduce((sum, item) => sum + normalizeNumber(item?.captured), 0);
  const confidence = items.reduce((sum, item) => sum + normalizeNumber(item?.confidence), 0);

  return {
    ledgerForecast: forecast,
    ledgerCaptured: captured,
    ledgerCaptureRate:
      forecast > 0 ? Math.max(0, Math.min(100, Math.round((captured / forecast) * 100))) : 0,
    ledgerConfidenceScore:
      items.length > 0 ? Math.max(0, Math.min(100, Math.round(confidence / items.length))) : 0
  };
}

function getPlaybookProgress(playbooks = []) {
  const checks = (Array.isArray(playbooks) ? playbooks : []).flatMap((item) =>
    Array.isArray(item?.checklist) ? item.checklist : []
  );
  if (checks.length > 0) {
    const done = checks.filter((item) => Boolean(item?.done)).length;
    return Math.max(0, Math.min(100, Math.round((done / checks.length) * 100)));
  }

  return getAverageProgress(playbooks);
}

function getBlockedDependencies(dependencies = []) {
  if (!Array.isArray(dependencies)) return [];

  return dependencies.filter((item) => {
    const status = normalizeText(item?.status).toLowerCase();
    const severity = normalizeText(item?.severity).toLowerCase();
    return status.includes('block') || severity.includes('high') || severity.includes('critical');
  });
}

function indexById(items = []) {
  return new Map(
    (Array.isArray(items) ? items : [])
      .filter((item) => item?.id)
      .map((item) => [String(item.id), item])
  );
}

function getPmiChangeEvents(existing = {}, updated = {}) {
  const events = [];
  const previousWorkstreams = indexById(existing.workstreams);
  const previousRisks = indexById(existing.risks);
  const previousMilestones = indexById(existing.milestones);
  const previousSynergies = indexById(existing.synergyLedger);
  const previousDependencies = indexById(existing.dependencies);

  for (const item of updated.workstreams || []) {
    const previous = previousWorkstreams.get(String(item.id));
    if (!previous) events.push({ action: 'pmi.workstream.created', id: item.id, name: item.name });
    if (previous && normalizeNumber(previous.progress) !== normalizeNumber(item.progress)) {
      events.push({ action: 'pmi.workstream.progress_changed', id: item.id, name: item.name });
    }
    if (previous && normalizeText(previous.risk) !== normalizeText(item.risk)) {
      events.push({ action: 'pmi.workstream.risk_changed', id: item.id, name: item.name });
    }
  }

  for (const item of existing.workstreams || []) {
    if (item?.id && !indexById(updated.workstreams).has(String(item.id))) {
      events.push({ action: 'pmi.workstream.removed', id: item.id, name: item.name });
    }
  }

  for (const item of updated.risks || []) {
    const previous = previousRisks.get(String(item.id));
    if (!previous) events.push({ action: 'pmi.risk.created', id: item.id, title: item.title });
    if (previous && normalizeText(previous.severity) !== normalizeText(item.severity)) {
      events.push({ action: 'pmi.risk.severity_changed', id: item.id, title: item.title });
    }
    if (previous && normalizeText(previous.status) !== normalizeText(item.status)) {
      events.push({ action: 'pmi.risk.status_changed', id: item.id, title: item.title });
    }
  }

  for (const item of existing.risks || []) {
    if (item?.id && !indexById(updated.risks).has(String(item.id))) {
      events.push({ action: 'pmi.risk.removed', id: item.id, title: item.title });
    }
  }

  for (const item of updated.milestones || []) {
    const previous = previousMilestones.get(String(item.id));
    if (!previous) events.push({ action: 'pmi.milestone.created', id: item.id, title: item.title });
    if (previous && normalizeText(previous.status) !== normalizeText(item.status)) {
      events.push({ action: 'pmi.milestone.status_changed', id: item.id, title: item.title });
    }
  }

  for (const action of updated.boardActions || []) {
    if (!(existing.boardActions || []).includes(action)) {
      events.push({ action: 'pmi.board_action.created', label: action });
    }
  }

  for (const action of existing.boardActions || []) {
    if (!(updated.boardActions || []).includes(action)) {
      events.push({ action: 'pmi.board_action.closed', label: action });
    }
  }

  for (const item of updated.synergyLedger || []) {
    const previous = previousSynergies.get(String(item.id));
    if (!previous) events.push({ action: 'pmi.synergy.created', id: item.id, name: item.name });
    if (previous && normalizeNumber(previous.captured) !== normalizeNumber(item.captured)) {
      events.push({ action: 'pmi.synergy.capture_changed', id: item.id, name: item.name });
    }
    if (previous && normalizeNumber(previous.forecast) !== normalizeNumber(item.forecast)) {
      events.push({ action: 'pmi.synergy.forecast_changed', id: item.id, name: item.name });
    }
  }

  for (const item of existing.synergyLedger || []) {
    if (item?.id && !indexById(updated.synergyLedger).has(String(item.id))) {
      events.push({ action: 'pmi.synergy.removed', id: item.id, name: item.name });
    }
  }

  for (const item of updated.dependencies || []) {
    const previous = previousDependencies.get(String(item.id));
    if (!previous) events.push({ action: 'pmi.dependency.created', id: item.id, title: item.title });
    if (previous && normalizeText(previous.status) !== normalizeText(item.status)) {
      events.push({ action: 'pmi.dependency.status_changed', id: item.id, title: item.title });
    }
  }

  for (const item of existing.dependencies || []) {
    if (item?.id && !indexById(updated.dependencies).has(String(item.id))) {
      events.push({ action: 'pmi.dependency.removed', id: item.id, title: item.title });
    }
  }

  return events.slice(0, 12);
}

function buildPmiSignal(pmiCase) {
  if (!pmiCase) {
    return {
      score: 58,
      posture: 'Seed integration plan',
      title: 'PMI enterprise layer ready',
      description:
        'PMI has an enterprise data contract. Create or sync an integration case to activate live synergy and execution signals.'
    };
  }

  const synergyTarget = normalizeNumber(pmiCase.synergyTarget);
  const synergyCaptured = normalizeNumber(pmiCase.synergyCaptured);
  const synergyCaptureRate =
    synergyTarget > 0
      ? Math.max(0, Math.min(100, Math.round((synergyCaptured / synergyTarget) * 100)))
      : 0;
  const workstreamProgress = getAverageProgress(pmiCase.workstreams);
  const milestoneProgress = getAverageProgress(pmiCase.milestones);
  const highRiskCount = getHighRiskCount(pmiCase.risks);
  const ledger = getLedgerTotals(pmiCase.synergyLedger);
  const playbookProgress = getPlaybookProgress(pmiCase.playbooks);
  const dependencyRiskScore = Math.max(0, 100 - getBlockedDependencies(pmiCase.dependencies).length * 22);
  const score = Math.max(
    0,
    Math.min(
      100,
      Math.round(
        workstreamProgress * 0.24 +
          milestoneProgress * 0.18 +
          synergyCaptureRate * 0.18 +
          ledger.ledgerCaptureRate * 0.12 +
          playbookProgress * 0.12 +
          dependencyRiskScore * 0.08 +
          Math.max(0, 100 - highRiskCount * 18) * 0.08
      )
    )
  );

  if (score >= 82) {
    return {
      score,
      posture: 'Accelerate synergy capture',
      title: 'Integration on track',
      description:
        'PMI shows strong execution, controlled risks and advanced synergy capture.'
    };
  }

  if (score < 58 || highRiskCount > 0) {
    return {
      score,
      posture: 'Prioritize risk mitigation',
      title: 'Integration risk requires attention',
      description:
        'PMI has relevant risks or execution gaps. Owners, mitigants and board actions should be reviewed.'
    };
  }

  return {
    score,
    posture: 'Manage execution',
    title: 'Integration plan in progress',
    description:
      'PMI has workstreams, milestones, risks and synergies ready for executive tracking.'
  };
}

async function recordPmiAudit({ organizationId, userId, action, entityId = '', metadata = {} }) {
  if (!normalizeText(userId)) return;

  try {
    await recordAuditLog({
      organizationId,
      userId,
      action,
      entityType: 'pmi_case',
      entityId,
      metadata
    });
  } catch {
    // Audit never blocks PMI operations.
  }
}

export async function listPmiCases(organizationId) {
  assertOrganizationId(organizationId);
  const items = await pmiCasesStore.listByOrganization(organizationId);
  return items.map(expandCase);
}

export async function getPmiCaseById(organizationId, id) {
  assertOrganizationId(organizationId);
  return expandCase(await pmiCasesStore.getByIdForOrganization(normalizeText(id), organizationId));
}

export async function createPmiCase(organizationId, payload = {}, actor = {}) {
  assertOrganizationId(organizationId);

  const created = expandCase(
    await pmiCasesStore.create({
      ...sanitizePayload(payload, { requireDealName: true }),
      organizationId,
      userId: normalizeText(actor.userId) || null
    })
  );

  await recordPmiAudit({
    organizationId,
    userId: actor.userId,
    action: 'pmi.case.created',
    entityId: created?.id || '',
    metadata: {
      dealName: created?.dealName || null,
      status: created?.status || null
    }
  });

  return created;
}

export async function createPmiCaseFromMaDeal(organizationId, dealId, actor = {}) {
  assertOrganizationId(organizationId);

  const deal = await getMaDealById(dealId, { organizationId });
  if (!deal) {
    throw createError('Deal M&A no encontrado para crear PMI.', 404, 'MA_DEAL_NOT_FOUND');
  }

  const payload = deal.payload && typeof deal.payload === 'object' ? deal.payload : {};
  const owner = normalizeText(deal.ownerName, 'M&A Owner') || 'M&A Owner';
  const dealName = normalizeText(deal.name, 'M&A deal');
  const equityValue = normalizeNumber(payload.equityValue);
  const synergyTarget = normalizeNumber(payload.synergyTarget || payload.expectedSynergies, Math.round(equityValue * 0.04));
  const currency = normalizeText(payload.currency, 'EUR') || 'EUR';
  const closingDate = normalizeText(deal.expectedCloseAt || payload.expectedCloseAt);

  const created = await createPmiCase(
    organizationId,
    {
      dealName: `${dealName} Integration`,
      buyerName: normalizeText(payload.buyerName || payload.buyer, 'Buyer / Sponsor'),
      targetName: dealName,
      closingDate,
      integrationDay: 0,
      synergyTarget,
      synergyCaptured: 0,
      integrationBudget: Math.max(0, Math.round(synergyTarget * 0.28)),
      integrationCostUsed: 0,
      currency,
      status: 'Active integration',
      sourceDealId: deal.id,
      workstreams: [
        {
          id: `ops-${deal.id}`,
          name: 'Operations integration',
          owner,
          progress: 0,
          risk: deal.riskLevel === 'high' ? 'High' : 'Medium',
          priority: deal.priority === 'high' ? 'High' : 'Medium',
          summary: 'Stabilize operating model, service continuity and critical dependencies.'
        },
        {
          id: `finance-${deal.id}`,
          name: 'Finance & reporting',
          owner: 'CFO Office',
          progress: 0,
          risk: 'Medium',
          priority: 'High',
          summary: 'Align reporting, cash discipline, synergy tracking and integration budget.'
        },
        {
          id: `people-${deal.id}`,
          name: 'People & culture',
          owner: 'HR Lead',
          progress: 0,
          risk: 'Medium',
          priority: 'Medium',
          summary: 'Secure key people, communication cadence and organizational decisions.'
        }
      ],
      risks: [
        {
          id: `deal-risk-${deal.id}`,
          title: 'Deal thesis execution risk',
          severity: deal.riskLevel === 'high' ? 'High' : 'Medium',
          status: 'open',
          owner,
          mitigation: normalizeText(deal.nextStep, 'Convert M&A thesis into owned PMI workstreams.')
        }
      ],
      milestones: [
        {
          id: `day1-${deal.id}`,
          label: 'Day 1',
          title: 'Control & communication',
          status: 'Pending',
          progress: 0,
          summary: 'Confirm governance, critical access, operating continuity and internal communications.'
        },
        {
          id: `day30-${deal.id}`,
          label: 'Day 30',
          title: 'Stabilize integration',
          status: 'Pending',
          progress: 0,
          summary: 'Validate workstream owners, risk register and first synergy baseline.'
        },
        {
          id: `day90-${deal.id}`,
          label: 'Day 90',
          title: 'Board integration review',
          status: 'Pending',
          progress: 0,
          summary: 'Review synergy capture, open risks, budget discipline and next-phase priorities.'
        }
      ],
      synergyLedger: [
        {
          id: `cost-synergy-${deal.id}`,
          name: 'Cost synergy baseline',
          type: 'Cost',
          owner: 'CFO Office',
          workstreamId: `finance-${deal.id}`,
          baseline: 0,
          forecast: Math.round(synergyTarget * 0.5),
          captured: 0,
          confidence: 55,
          status: 'Baseline',
          dueDate: closingDate
        },
        {
          id: `operating-synergy-${deal.id}`,
          name: 'Operating model efficiency',
          type: 'Cost',
          owner,
          workstreamId: `ops-${deal.id}`,
          baseline: 0,
          forecast: Math.round(synergyTarget * 0.3),
          captured: 0,
          confidence: 50,
          status: 'Baseline',
          dueDate: closingDate
        },
        {
          id: `revenue-synergy-${deal.id}`,
          name: 'Revenue synergy pipeline',
          type: 'Revenue',
          owner: 'Revenue Lead',
          workstreamId: `ops-${deal.id}`,
          baseline: 0,
          forecast: Math.round(synergyTarget * 0.2),
          captured: 0,
          confidence: 42,
          status: 'Thesis linked',
          dueDate: closingDate
        }
      ],
      playbooks: [
        {
          id: `day1-playbook-${deal.id}`,
          label: 'Day 1',
          title: 'Control and continuity',
          owner,
          status: 'Pending',
          checklist: [
            { id: `day1-comms-${deal.id}`, label: 'Stakeholder communications released', done: false },
            { id: `day1-access-${deal.id}`, label: 'Critical system access validated', done: false },
            { id: `day1-cash-${deal.id}`, label: 'Cash controls confirmed', done: false }
          ]
        },
        {
          id: `day30-playbook-${deal.id}`,
          label: 'Day 30',
          title: 'Stabilize the operating model',
          owner: 'PMI Office',
          status: 'Pending',
          checklist: [
            { id: `day30-owners-${deal.id}`, label: 'Workstream owners and cadence locked', done: false },
            { id: `day30-risks-${deal.id}`, label: 'Risk register reviewed by committee', done: false },
            { id: `day30-synergies-${deal.id}`, label: 'Synergy baseline approved by CFO', done: false }
          ]
        },
        {
          id: `day90-playbook-${deal.id}`,
          label: 'Day 90',
          title: 'Board integration review',
          owner: 'CEO Office',
          status: 'Pending',
          checklist: [
            { id: `day90-memo-${deal.id}`, label: 'Board Integration Memo drafted', done: false },
            { id: `day90-value-${deal.id}`, label: 'Captured value reconciled with thesis', done: false },
            { id: `day90-next-${deal.id}`, label: 'Next-phase priorities funded', done: false }
          ]
        }
      ],
      dependencies: [
        {
          id: `dependency-finance-ops-${deal.id}`,
          fromWorkstreamId: `ops-${deal.id}`,
          toWorkstreamId: `finance-${deal.id}`,
          title: 'Operating KPI handoff required for finance reporting',
          status: 'Monitoring',
          severity: deal.riskLevel === 'high' ? 'High' : 'Medium',
          owner,
          mitigation: 'Lock KPI owners and reporting evidence before first board review.'
        }
      ],
      boardActions: [
        'Confirm PMI owner and committee cadence.',
        'Validate Day 1 operating continuity plan.',
        'Translate M&A thesis into synergy baseline and workstream KPIs.'
      ],
      payload: {
        source: 'ma_deal',
        maDealId: deal.id,
        maCaseId: deal.caseId || null,
        maStage: deal.stage,
        maPriority: deal.priority,
        maIcMemoStatus: deal.icMemoStatus,
        thesis: normalizeText(payload.thesis || deal.nextStep),
        thesisDrivers: Array.isArray(payload.thesisDrivers) ? payload.thesisDrivers : []
      }
    },
    actor
  );

  await recordPmiAudit({
    organizationId,
    userId: actor.userId,
    action: 'pmi.case.created_from_ma_deal',
    entityId: created?.id || '',
    metadata: {
      maDealId: deal.id,
      maDealName: deal.name
    }
  });

  return created;
}

export async function duplicatePmiCase(organizationId, id, actor = {}) {
  assertOrganizationId(organizationId);

  const existing = await getPmiCaseById(organizationId, id);
  if (!existing) return null;

  const created = await createPmiCase(
    organizationId,
    {
      ...existing,
      dealName: `${existing.dealName || 'PMI case'} Copy`,
      status: 'Draft review',
      payload: {
        ...(existing.payload && typeof existing.payload === 'object' ? existing.payload : {}),
        duplicatedFrom: existing.id,
        duplicatedAt: new Date().toISOString()
      }
    },
    actor
  );

  await recordPmiAudit({
    organizationId,
    userId: actor.userId,
    action: 'pmi.case.duplicated',
    entityId: created?.id || '',
    metadata: {
      sourceCaseId: existing.id
    }
  });

  return created;
}

export async function updatePmiCase(organizationId, id, payload = {}, actor = {}) {
  assertOrganizationId(organizationId);

  const existing = await getPmiCaseById(organizationId, id);
  if (!existing) return null;

  const sanitizedPatch = sanitizePayload(payload);
  const nextPatch = {
    ...sanitizedPatch,
    ...(sanitizedPatch.payload
      ? {
          payload: {
            ...(existing.payload && typeof existing.payload === 'object'
              ? existing.payload
              : {}),
            ...sanitizedPatch.payload
          }
        }
      : {})
  };

  const updated = expandCase(
    await pmiCasesStore.updateForOrganization(
      normalizeText(id),
      nextPatch,
      organizationId
    )
  );

  if (!updated) return null;

  await recordPmiAudit({
    organizationId,
    userId: actor.userId,
    action: 'pmi.case.updated',
    entityId: updated.id,
    metadata: {
      status: updated.status
    }
  });

  for (const event of getPmiChangeEvents(existing, updated)) {
    await recordPmiAudit({
      organizationId,
      userId: actor.userId,
      action: event.action,
      entityId: updated.id,
      metadata: event
    });
  }

  return updated;
}

export async function deletePmiCase(organizationId, id, actor = {}) {
  assertOrganizationId(organizationId);

  const result = await pmiCasesStore.removeForOrganization(normalizeText(id), organizationId);

  if (result.deleted) {
    await recordPmiAudit({
      organizationId,
      userId: actor.userId,
      action: 'pmi.case.deleted',
      entityId: normalizeText(id)
    });
  }

  return result;
}

export async function listPmiAuditLogs(organizationId, options = {}) {
  assertOrganizationId(organizationId);

  return listAuditLogs({
    organizationId,
    entityType: 'pmi_case',
    entityId: normalizeText(options.caseId),
    limit: normalizeNumber(options.limit, 80)
  });
}

export async function getPmiExecutiveHubBrief(scope = {}) {
  assertOrganizationId(scope.organizationId);

  const cases = await listPmiCases(scope.organizationId);
  const sortedCases = [...cases].sort(
    (a, b) =>
      new Date(b.updatedAt || b.createdAt || 0).getTime() -
      new Date(a.updatedAt || a.createdAt || 0).getTime()
  );
  const latestCase = sortedCases[0] || null;
  const signal = buildPmiSignal(latestCase);
  const workstreams = latestCase?.workstreams || [];
  const risks = latestCase?.risks || [];
  const milestones = latestCase?.milestones || [];
  const synergyLedger = latestCase?.synergyLedger || [];
  const playbooks = latestCase?.playbooks || [];
  const dependencies = latestCase?.dependencies || [];
  const synergyTarget = normalizeNumber(latestCase?.synergyTarget);
  const synergyCaptured = normalizeNumber(latestCase?.synergyCaptured);
  const integrationBudget = normalizeNumber(latestCase?.integrationBudget);
  const integrationCostUsed = normalizeNumber(latestCase?.integrationCostUsed);
  const synergyCaptureRate =
    synergyTarget > 0
      ? Math.max(0, Math.min(100, Math.round((synergyCaptured / synergyTarget) * 100)))
      : 0;
  const budgetUsedRate =
    integrationBudget > 0
      ? Math.max(0, Math.min(100, Math.round((integrationCostUsed / integrationBudget) * 100)))
      : 0;
  const ledger = getLedgerTotals(synergyLedger);
  const blockedDependencies = getBlockedDependencies(dependencies);

  return {
    version: 'pmi-executive-hub-v2',
    organizationId: scope.organizationId,
    generatedAt: new Date().toISOString(),
    score: signal.score,
    posture: signal.posture,
    title: signal.title,
    description: signal.description,
    latestCase: latestCase && {
      id: latestCase.id,
      dealName: latestCase.dealName,
      buyerName: latestCase.buyerName,
      targetName: latestCase.targetName,
      status: latestCase.status,
      integrationDay: latestCase.integrationDay,
      currency: latestCase.currency,
      synergyTarget: latestCase.synergyTarget,
      synergyCaptured: latestCase.synergyCaptured,
      integrationBudget: latestCase.integrationBudget,
      integrationCostUsed: latestCase.integrationCostUsed,
      synergyLedgerCount: synergyLedger.length,
      playbooksCount: playbooks.length,
      dependenciesCount: dependencies.length,
      updatedAt: latestCase.updatedAt
    },
    metrics: {
      casesCount: cases.length,
      workstreamsCount: workstreams.length,
      risksCount: risks.length,
      highRiskCount: getHighRiskCount(risks),
      openRiskCount: getOpenRiskCount(risks),
      milestonesCount: milestones.length,
      workstreamProgress: getAverageProgress(workstreams),
      milestoneProgress: getAverageProgress(milestones),
      synergyCaptureRate,
      ...ledger,
      playbookProgress: getPlaybookProgress(playbooks),
      synergyGap: Math.max(0, synergyTarget - synergyCaptured),
      budgetUsedRate,
      budgetRemaining: Math.max(0, integrationBudget - integrationCostUsed),
      blockedWorkstreamsCount: getBlockedWorkstreams(workstreams).length,
      dependenciesCount: dependencies.length,
      blockedDependenciesCount: blockedDependencies.length,
      dependencyRiskScore: Math.max(0, 100 - blockedDependencies.length * 22 - dependencies.length * 3)
    }
  };
}

export default {
  listPmiCases,
  getPmiCaseById,
  createPmiCase,
  createPmiCaseFromMaDeal,
  duplicatePmiCase,
  updatePmiCase,
  deletePmiCase,
  listPmiAuditLogs,
  getPmiExecutiveHubBrief
};
