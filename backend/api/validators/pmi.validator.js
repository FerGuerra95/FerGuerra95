import {
  assertFiniteNumber,
  assertId,
  assertPlainObject,
  normalizeString
} from '../middlewares/validate.middleware.js';

function normalizeArray(value) {
  return Array.isArray(value) ? value : undefined;
}

function caseBody(value = {}) {
  const source = assertPlainObject(value, 'PMI case');
  const next = {};

  if (source.dealName !== undefined) next.dealName = normalizeString(source.dealName);
  if (source.buyerName !== undefined) next.buyerName = normalizeString(source.buyerName);
  if (source.targetName !== undefined) next.targetName = normalizeString(source.targetName);
  if (source.status !== undefined) next.status = normalizeString(source.status, 'draft');
  if (source.currency !== undefined) next.currency = normalizeString(source.currency, 'EUR');
  if (source.integrationDay !== undefined) {
    next.integrationDay = assertFiniteNumber(source.integrationDay, 'integrationDay');
  }
  if (source.synergyTarget !== undefined) {
    next.synergyTarget = assertFiniteNumber(source.synergyTarget, 'synergyTarget');
  }
  if (source.synergyCaptured !== undefined) {
    next.synergyCaptured = assertFiniteNumber(source.synergyCaptured, 'synergyCaptured');
  }
  if (source.integrationBudget !== undefined) {
    next.integrationBudget = assertFiniteNumber(source.integrationBudget, 'integrationBudget');
  }
  if (source.integrationCostUsed !== undefined) {
    next.integrationCostUsed = assertFiniteNumber(
      source.integrationCostUsed,
      'integrationCostUsed'
    );
  }
  if (source.payload !== undefined) {
    next.payload = assertPlainObject(source.payload, 'payload');
  }

  const workstreams = normalizeArray(source.workstreams);
  const risks = normalizeArray(source.risks);
  const milestones = normalizeArray(source.milestones);
  const boardActions = normalizeArray(source.boardActions);
  const synergyLedger = normalizeArray(source.synergyLedger);
  const playbooks = normalizeArray(source.playbooks);
  const dependencies = normalizeArray(source.dependencies);

  if (workstreams) next.workstreams = workstreams;
  if (risks) next.risks = risks;
  if (milestones) next.milestones = milestones;
  if (boardActions) next.boardActions = boardActions;
  if (synergyLedger) next.synergyLedger = synergyLedger;
  if (playbooks) next.playbooks = playbooks;
  if (dependencies) next.dependencies = dependencies;

  return next;
}

function caseParams(value = {}) {
  return {
    ...value,
    id: assertId(value.id, 'id')
  };
}

function dealParams(value = {}) {
  return {
    ...value,
    dealId: assertId(value.dealId, 'dealId')
  };
}

function auditQuery(value = {}) {
  const next = {};

  if (value.caseId !== undefined && value.caseId !== '') {
    next.caseId = assertId(value.caseId, 'caseId');
  }

  if (value.limit !== undefined && value.limit !== '') {
    next.limit = assertFiniteNumber(value.limit, 'limit');
  }

  return next;
}

export const pmiValidator = {
  create: {
    body: caseBody
  },
  update: {
    body: caseBody,
    params: caseParams
  },
  params: {
    params: caseParams
  },
  dealParams: {
    params: dealParams
  },
  auditQuery: {
    query: auditQuery
  }
};

export default pmiValidator;
