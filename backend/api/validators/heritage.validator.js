import {
  assertFiniteNumber,
  assertId,
  assertPlainObject,
  normalizeString
} from '../middlewares/validate.middleware.js';

function idParams(value = {}) {
  return { ...value, id: assertId(value.id, 'id') };
}

function pickStrings(source, keys) {
  const next = {};
  keys.forEach((key) => {
    if (source[key] !== undefined) next[key] = normalizeString(source[key]);
  });
  return next;
}

function assetBody(value = {}) {
  const source = assertPlainObject(value, 'heritage asset');
  const next = pickStrings(source, [
    'name',
    'assetType',
    'jurisdiction',
    'protectionStatus',
    'liquidityProfile',
    'owner',
    'riskLevel'
  ]);
  if (source.estimatedValue !== undefined) next.estimatedValue = assertFiniteNumber(source.estimatedValue, 'estimatedValue');
  if (source.payload !== undefined) next.payload = assertPlainObject(source.payload, 'payload');
  return next;
}

function successionBody(value = {}) {
  const source = assertPlainObject(value, 'heritage succession');
  const next = pickStrings(source, [
    'title',
    'status',
    'owner',
    'successor',
    'effectiveDate',
    'evidenceStatus'
  ]);
  if (source.readiness !== undefined) next.readiness = assertFiniteNumber(source.readiness, 'readiness');
  if (source.payload !== undefined) next.payload = assertPlainObject(source.payload, 'payload');
  return next;
}

function protectionBody(value = {}) {
  const source = assertPlainObject(value, 'heritage protection');
  const next = pickStrings(source, [
    'name',
    'domain',
    'status',
    'owner',
    'reviewCadence',
    'lastReviewAt',
    'nextReviewAt'
  ]);
  if (source.coverage !== undefined) next.coverage = assertFiniteNumber(source.coverage, 'coverage');
  if (source.payload !== undefined) next.payload = assertPlainObject(source.payload, 'payload');
  return next;
}

function documentBody(value = {}) {
  const source = assertPlainObject(value, 'heritage document');
  const next = pickStrings(source, [
    'title',
    'documentType',
    'classification',
    'status',
    'owner',
    'linkedEntityType',
    'linkedEntityId',
    'evidenceStatus',
    'reviewDueAt'
  ]);
  if (source.payload !== undefined) next.payload = assertPlainObject(source.payload, 'payload');
  return next;
}

function reportBody(value = {}) {
  const source = assertPlainObject(value, 'heritage report');
  const next = pickStrings(source, ['title', 'status', 'reportType']);
  if (source.payload !== undefined) next.payload = assertPlainObject(source.payload, 'payload');
  return next;
}

export const heritageValidator = {
  assetCreate: { body: assetBody },
  assetUpdate: { params: idParams, body: assetBody },
  successionCreate: { body: successionBody },
  successionUpdate: { params: idParams, body: successionBody },
  protectionCreate: { body: protectionBody },
  protectionUpdate: { params: idParams, body: protectionBody },
  documentCreate: { body: documentBody },
  documentUpdate: { params: idParams, body: documentBody },
  reportCreate: { body: reportBody },
  idParams: { params: idParams }
};

export default heritageValidator;
