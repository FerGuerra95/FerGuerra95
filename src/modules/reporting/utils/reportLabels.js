export const BOARD_REVIEW_DRAFT_LABELS = Object.freeze({
  status: 'Board Review Draft',
  humanReview: 'Human Review Required',
  confidential: 'Confidential',
  notLegalAdvice: 'Not Legal Advice',
  notInvestmentAdvice: 'Not Investment Advice',
  notBoardApproved: 'Not Board Approved',
  basedOnDss: 'Based on DSS Signals'
});

export const BOARD_REVIEW_DRAFT_LIMITATIONS = Object.freeze([
  BOARD_REVIEW_DRAFT_LABELS.status,
  BOARD_REVIEW_DRAFT_LABELS.humanReview,
  BOARD_REVIEW_DRAFT_LABELS.basedOnDss,
  BOARD_REVIEW_DRAFT_LABELS.notLegalAdvice,
  BOARD_REVIEW_DRAFT_LABELS.notInvestmentAdvice,
  BOARD_REVIEW_DRAFT_LABELS.notBoardApproved,
  BOARD_REVIEW_DRAFT_LABELS.confidential
]);
