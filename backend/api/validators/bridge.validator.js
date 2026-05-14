import {
  assertFiniteNumber,
  assertId,
  assertPlainObject,
  normalizeString
} from '../middlewares/validate.middleware.js';

function optionalNumber(source, target, key) {
  if (source[key] !== undefined) target[key] = assertFiniteNumber(source[key], key);
}

function opportunityBody(value = {}) {
  const source = assertPlainObject(value, 'bridge opportunity');
  const next = {};

  [
    'title',
    'sourceBranch',
    'sourceId',
    'counterpartyType',
    'sector',
    'geography',
    'stage',
    'qualificationStatus',
    'status',
    'owner',
    'ndaStatus',
    'redactionLevel',
    'dataRoomAccess',
    'nextStep'
  ].forEach((key) => {
    if (source[key] !== undefined) next[key] = normalizeString(source[key]);
  });
  optionalNumber(source, next, 'opportunityValue');
  optionalNumber(source, next, 'probability');
  if (source.boardApprovalRequired !== undefined) {
    next.boardApprovalRequired = Boolean(source.boardApprovalRequired);
  }
  if (source.payload !== undefined) next.payload = assertPlainObject(source.payload, 'payload');

  return next;
}

function counterpartyBody(value = {}) {
  const source = assertPlainObject(value, 'bridge counterparty');
  const next = {};

  [
    'name',
    'title',
    'counterpartyType',
    'sectorFocus',
    'geography',
    'riskAppetite',
    'kycStatus',
    'ndaStatus',
    'contactOwner',
    'status',
    'score'
  ].forEach((key) => {
    if (source[key] !== undefined) next[key] = normalizeString(source[key]);
  });
  optionalNumber(source, next, 'ticketMin');
  optionalNumber(source, next, 'ticketMax');
  if (source.payload !== undefined) next.payload = assertPlainObject(source.payload, 'payload');

  return next;
}

function introductionBody(value = {}) {
  const source = assertPlainObject(value, 'bridge introduction');
  const next = {
    opportunityId: assertId(source.opportunityId, 'opportunityId'),
    counterpartyId: assertId(source.counterpartyId, 'counterpartyId')
  };
  ['status', 'ndaStatus', 'introducedAt', 'nextStep'].forEach((key) => {
    if (source[key] !== undefined) next[key] = normalizeString(source[key]);
  });
  if (source.payload !== undefined) next.payload = assertPlainObject(source.payload, 'payload');
  return next;
}

function documentBody(value = {}) {
  const source = assertPlainObject(value, 'bridge document');
  const next = {};
  [
    'title',
    'documentType',
    'classification',
    'status',
    'owner',
    'opportunityId',
    'counterpartyId',
    'ndaStatus',
    'redactionLevel'
  ].forEach((key) => {
    if (source[key] !== undefined) next[key] = normalizeString(source[key]);
  });
  if (source.payload !== undefined) next.payload = assertPlainObject(source.payload, 'payload');
  return next;
}

function reportBody(value = {}) {
  const source = assertPlainObject(value, 'bridge report');
  const next = {};
  ['title', 'status', 'reportType', 'opportunityId'].forEach((key) => {
    if (source[key] !== undefined) next[key] = normalizeString(source[key]);
  });
  if (source.payload !== undefined) next.payload = assertPlainObject(source.payload, 'payload');
  return next;
}

function genericBridgeBody(value = {}) {
  const source = assertPlainObject(value, 'bridge payload');
  const next = {};
  const numberKeys = new Set(['confidenceLevel', 'priorityScore']);
  Object.entries(source).forEach(([key, raw]) => {
    if (raw === undefined) return;
    if (Array.isArray(raw)) {
      next[key] = raw;
      return;
    }
    if (raw && typeof raw === 'object') {
      next[key] = assertPlainObject(raw, key);
      return;
    }
    if (typeof raw === 'boolean') {
      next[key] = raw;
      return;
    }
    next[key] = numberKeys.has(key) ? assertFiniteNumber(raw, key) : normalizeString(raw);
  });
  return next;
}

function idParams(value = {}) {
  return { ...value, id: assertId(value.id, 'id') };
}

function dealParams(value = {}) {
  return { ...value, dealId: assertId(value.dealId, 'dealId') };
}

function roundParams(value = {}) {
  return { ...value, roundId: assertId(value.roundId, 'roundId') };
}

export const bridgeValidator = {
  opportunityCreate: { body: opportunityBody },
  opportunityUpdate: { params: idParams, body: opportunityBody },
  counterpartyCreate: { body: counterpartyBody },
  counterpartyUpdate: { params: idParams, body: counterpartyBody },
  introductionCreate: { body: introductionBody },
  documentCreate: { body: documentBody },
  documentUpdate: { params: idParams, body: documentBody },
  reportCreate: { body: reportBody },
  signalCreate: { body: genericBridgeBody },
  signalUpdate: { params: idParams, body: genericBridgeBody },
  workflow: { params: idParams, body: genericBridgeBody },
  dependencyCreate: { body: genericBridgeBody },
  dependencyUpdate: { params: idParams, body: genericBridgeBody },
  conflictCreate: { body: genericBridgeBody },
  conflictUpdate: { params: idParams, body: genericBridgeBody },
  evidenceCreate: { body: genericBridgeBody },
  evidenceUpdate: { params: idParams, body: genericBridgeBody },
  snapshotCreate: { body: genericBridgeBody },
  idParams: { params: idParams },
  dealParams: { params: dealParams },
  roundParams: { params: roundParams }
};

export default bridgeValidator;
