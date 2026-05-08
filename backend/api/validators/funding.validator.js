import {
  assertFiniteNumber,
  assertId,
  assertOptionalEnum,
  assertPlainObject,
  normalizeString
} from '../middlewares/validate.middleware.js';

const VALID_SCENARIOS = ['conservative', 'balanced', 'aggressive'];
const VALID_ROUND_TYPES = ['pre-seed', 'seed', 'series a', 'debt'];

function normalizeNumberLike(value) {
  if (value === undefined || value === null) return value;

  const number = Number(value);

  return Number.isFinite(number) ? number : value;
}

function normalizeInputs(value = {}) {
  const payload = assertPlainObject(value, 'funding inputs');

  return Object.fromEntries(
    Object.entries(payload).map(([key, item]) => [
      key,
      typeof item === 'string' ? normalizeString(item) : normalizeNumberLike(item)
    ])
  );
}

function normalizeSettings(value = {}) {
  const payload = value && typeof value === 'object' ? value : {};
  const scenarioMode = normalizeString(payload.scenarioMode || 'balanced')
    .toLowerCase();

  return {
    ...payload,
    reportCurrency: normalizeString(payload.reportCurrency || 'EUR').toUpperCase(),
    scenarioMode: VALID_SCENARIOS.includes(scenarioMode)
      ? scenarioMode
      : 'balanced'
  };
}

function snapshotBody(body = {}) {
  const payload = assertPlainObject(body, 'body');

  return {
    ...payload,
    fundingInputs: normalizeInputs(payload.fundingInputs || payload.inputs || payload),
    fundingSettings: normalizeSettings(payload.fundingSettings || payload.settings)
  };
}

function snapshotParams(params = {}) {
  return {
    ...params,
    id: assertId(params.id, 'funding snapshot id')
  };
}

function normalizeRoundType(value) {
  return assertOptionalEnum(
    normalizeString(value).toLowerCase(),
    VALID_ROUND_TYPES,
    'seed'
  );
}

function roundBody(body = {}) {
  const payload = assertPlainObject(body, 'body');

  return {
    roundType: normalizeRoundType(payload.roundType),
    status: normalizeString(payload.status || 'draft') || 'draft',
    fundingCaseId: normalizeString(payload.fundingCaseId || ''),
    amountRaised: assertFiniteNumber(payload.amountRaised, 'amountRaised') ?? 0,
    valuationPreMoney: assertFiniteNumber(
      payload.valuationPreMoney,
      'valuationPreMoney'
    ),
    valuationPostMoney: assertFiniteNumber(
      payload.valuationPostMoney,
      'valuationPostMoney'
    ),
    dilutionPercentage: assertFiniteNumber(
      payload.dilutionPercentage,
      'dilutionPercentage'
    ),
    investorName: normalizeString(payload.investorName || ''),
    closingDate: normalizeString(payload.closingDate || ''),
    monthlyBurnRate: assertFiniteNumber(payload.monthlyBurnRate, 'monthlyBurnRate'),
    currentCash: assertFiniteNumber(payload.currentCash, 'currentCash'),
    projectedRunwayMonths: assertFiniteNumber(
      payload.projectedRunwayMonths,
      'projectedRunwayMonths'
    ),
    riskStatus: normalizeString(payload.riskStatus || 'normal') || 'normal',
    payload:
      payload.payload && typeof payload.payload === 'object' && !Array.isArray(payload.payload)
        ? payload.payload
        : {},
    notes: normalizeString(payload.notes || '')
  };
}

function roundUpdate(body = {}) {
  const payload = assertPlainObject(body, 'body');

  return {
    ...Object.fromEntries(
      Object.entries(payload).filter(([key]) =>
        [
          'roundType',
          'status',
          'fundingCaseId',
          'amountRaised',
          'valuationPreMoney',
          'valuationPostMoney',
          'dilutionPercentage',
          'investorName',
          'closingDate',
          'monthlyBurnRate',
          'currentCash',
          'projectedRunwayMonths',
          'riskStatus',
          'payload',
          'notes'
        ].includes(key)
      )
    ),
    ...(payload.roundType !== undefined
      ? {
          roundType: normalizeRoundType(payload.roundType)
        }
      : {}),
    ...(payload.amountRaised !== undefined
      ? {
          amountRaised: assertFiniteNumber(payload.amountRaised, 'amountRaised')
        }
      : {}),
    ...(payload.valuationPreMoney !== undefined
      ? {
          valuationPreMoney: assertFiniteNumber(
            payload.valuationPreMoney,
            'valuationPreMoney'
          )
        }
      : {}),
    ...(payload.valuationPostMoney !== undefined
      ? {
          valuationPostMoney: assertFiniteNumber(
            payload.valuationPostMoney,
            'valuationPostMoney'
          )
        }
      : {}),
    ...(payload.dilutionPercentage !== undefined
      ? {
          dilutionPercentage: assertFiniteNumber(
            payload.dilutionPercentage,
            'dilutionPercentage'
          )
        }
      : {}),
    ...(payload.monthlyBurnRate !== undefined
      ? {
          monthlyBurnRate: assertFiniteNumber(
            payload.monthlyBurnRate,
            'monthlyBurnRate'
          )
        }
      : {}),
    ...(payload.currentCash !== undefined
      ? {
          currentCash: assertFiniteNumber(payload.currentCash, 'currentCash')
        }
      : {})
  };
}

function roundParams(params = {}) {
  return {
    ...params,
    id: assertId(params.id, 'funding round id')
  };
}

function roundsQuery(query = {}) {
  return {
    status: normalizeString(query.status || ''),
    roundType: query.roundType
      ? assertOptionalEnum(
          normalizeString(query.roundType).toLowerCase(),
          VALID_ROUND_TYPES,
          ''
        )
      : ''
  };
}

export const fundingValidator = {
  roundsQuery: {
    query: roundsQuery
  },
  roundBody: {
    body: roundBody
  },
  roundUpdate: {
    params: roundParams,
    body: roundUpdate
  },
  roundParams: {
    params: roundParams
  },
  snapshotBody: {
    body: snapshotBody
  },
  snapshotParams: {
    params: snapshotParams
  }
};

export default fundingValidator;
