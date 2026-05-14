import {
  assertId,
  assertPlainObject,
  normalizeString
} from '../middlewares/validate.middleware.js';
import { normalizeBranch } from '../../services/ecosystem/ecosystem.service.js';

function branchParams(value = {}) {
  return {
    ...value,
    branch: normalizeBranch(value.branch)
  };
}

function recordParams(value = {}) {
  return {
    ...branchParams(value),
    id: assertId(value.id, 'id')
  };
}

function recordBody(value = {}) {
  const source = assertPlainObject(value, 'ecosystem record');
  const next = {};

  if (source.title !== undefined) next.title = normalizeString(source.title);
  if (source.status !== undefined) next.status = normalizeString(source.status, 'draft');
  if (source.score !== undefined) next.score = normalizeString(source.score);
  if (source.payload !== undefined) {
    next.payload = assertPlainObject(source.payload, 'payload');
  }

  return next;
}

export const ecosystemValidator = {
  branchParams: {
    params: branchParams
  },
  create: {
    params: branchParams,
    body: recordBody
  },
  update: {
    params: recordParams,
    body: recordBody
  },
  recordParams: {
    params: recordParams
  }
};

export default ecosystemValidator;
