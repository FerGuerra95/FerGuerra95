export const AI_USE_CASES = Object.freeze({
  BOARD_REVIEW_DRAFT: 'BOARD_REVIEW_DRAFT',
  COMPLIANCE_MEMO_DRAFT: 'COMPLIANCE_MEMO_DRAFT',
  MA_IC_MEMO_DRAFT: 'MA_IC_MEMO_DRAFT',
  EXECUTIVE_BRIEF: 'EXECUTIVE_BRIEF',
  AUTONOMOUS_AGENT: 'AUTONOMOUS_AGENT',
  LEGAL_ADVICE: 'LEGAL_ADVICE',
  INVESTMENT_ADVICE: 'INVESTMENT_ADVICE',
  MARKETPLACE_MATCHING: 'MARKETPLACE_MATCHING'
});

export const AI_USE_CASE_STATUSES = Object.freeze({
  ALLOWED: 'allowed_design_only',
  FUTURE: 'future',
  FORBIDDEN: 'forbidden'
});

const USE_CASE_POLICIES = Object.freeze({
  [AI_USE_CASES.BOARD_REVIEW_DRAFT]: Object.freeze({
    status: AI_USE_CASE_STATUSES.ALLOWED,
    outputMode: 'draft',
    humanReviewRequired: true,
    externalSendAllowed: false,
    databaseMutationAllowed: false,
    scoreRecalculationAllowed: false,
    certificationClaimAllowed: false
  }),
  [AI_USE_CASES.COMPLIANCE_MEMO_DRAFT]: Object.freeze({ status: AI_USE_CASE_STATUSES.FUTURE }),
  [AI_USE_CASES.MA_IC_MEMO_DRAFT]: Object.freeze({ status: AI_USE_CASE_STATUSES.FUTURE }),
  [AI_USE_CASES.EXECUTIVE_BRIEF]: Object.freeze({ status: AI_USE_CASE_STATUSES.FUTURE }),
  [AI_USE_CASES.AUTONOMOUS_AGENT]: Object.freeze({ status: AI_USE_CASE_STATUSES.FORBIDDEN }),
  [AI_USE_CASES.LEGAL_ADVICE]: Object.freeze({ status: AI_USE_CASE_STATUSES.FORBIDDEN }),
  [AI_USE_CASES.INVESTMENT_ADVICE]: Object.freeze({ status: AI_USE_CASE_STATUSES.FORBIDDEN }),
  [AI_USE_CASES.MARKETPLACE_MATCHING]: Object.freeze({ status: AI_USE_CASE_STATUSES.FORBIDDEN })
});

export function getAiUseCasePolicy(useCase) {
  return USE_CASE_POLICIES[useCase] ?? null;
}

export function isAiUseCaseAllowed(useCase) {
  return getAiUseCasePolicy(useCase)?.status === AI_USE_CASE_STATUSES.ALLOWED;
}

export function isAiUseCaseForbidden(useCase) {
  return getAiUseCasePolicy(useCase)?.status === AI_USE_CASE_STATUSES.FORBIDDEN;
}
