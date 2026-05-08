import { getExecutiveComplianceHubBrief } from '../compliance/executiveHub.service.js';
import { listMaDeals } from '../ma/deals.service.js';

function normalizeText(value, fallback = '') {
  return String(value ?? fallback).trim();
}

function toSafeNumber(value) {
  if (value === null || value === undefined || value === '') return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function assertOrganizationId(organizationId) {
  if (!normalizeText(organizationId)) {
    const error = new Error(
      'Scope de organizacion no definido. No se puede operar sin organizationId.'
    );
    error.status = 403;
    error.code = 'INVALID_ORGANIZATION_SCOPE';
    throw error;
  }
}

function pickLatestByDate(items = []) {
  const safeItems = Array.isArray(items) ? items.filter(Boolean) : [];
  if (safeItems.length === 0) return null;

  return [...safeItems].sort((left, right) => {
    const leftTime = new Date(left.updatedAt || left.createdAt || 0).getTime();
    const rightTime = new Date(right.updatedAt || right.createdAt || 0).getTime();
    return rightTime - leftTime;
  })[0];
}

function extractDealValuation(deal = {}) {
  return (
    toSafeNumber(deal.equityValue) ??
    toSafeNumber(deal.payload?.equityValue) ??
    null
  );
}

export async function getComplianceFundingSignal(scope = {}) {
  assertOrganizationId(scope.organizationId);

  try {
    const hub = await getExecutiveComplianceHubBrief({
      organizationId: scope.organizationId
    });
    const complianceScore = toSafeNumber(hub?.legalHealthScore);

    if (complianceScore === null) {
      return {
        complianceScore: null,
        complianceStatus: 'not_available',
        requiresHumanReview: true,
        rationale:
          'Compliance score unavailable. Human review recommended before investor outreach.'
      };
    }

    if (complianceScore < 70) {
      return {
        complianceScore,
        complianceStatus: 'high_risk_audit_required',
        requiresHumanReview: true,
        rationale:
          'Compliance score below enterprise threshold. Audit review required before investor outreach.'
      };
    }

    return {
      complianceScore,
      complianceStatus: 'validated',
      requiresHumanReview: false,
      rationale: 'Compliance score within enterprise threshold.'
    };
  } catch {
    return {
      complianceScore: null,
      complianceStatus: 'not_available',
      requiresHumanReview: true,
      rationale:
        'Compliance score unavailable. Human review recommended before investor outreach.'
    };
  }
}

export async function getMaValuationFundingSignal(scope = {}) {
  assertOrganizationId(scope.organizationId);

  try {
    const deals = await listMaDeals({
      organizationId: scope.organizationId
    });
    const latestDealWithValuation = pickLatestByDate(
      (Array.isArray(deals) ? deals : []).filter(
        (item) => extractDealValuation(item) !== null
      )
    );

    if (!latestDealWithValuation) {
      return {
        suggestedPreMoneyValuation: null,
        suggestedValuationSource: 'not_available',
        suggestedValuationConfidence: 'none',
        rationale: 'No M&A valuation signal available. Manual valuation review required.'
      };
    }

    return {
      suggestedPreMoneyValuation: extractDealValuation(latestDealWithValuation),
      suggestedValuationSource: 'ma_valuation',
      suggestedValuationConfidence: 'medium',
      rationale:
        'Suggested valuation available from M&A intelligence. Human validation required before investor use.'
    };
  } catch {
    return {
      suggestedPreMoneyValuation: null,
      suggestedValuationSource: 'not_available',
      suggestedValuationConfidence: 'none',
      rationale: 'No M&A valuation signal available. Manual valuation review required.'
    };
  }
}

export default {
  getComplianceFundingSignal,
  getMaValuationFundingSignal
};
