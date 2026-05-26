import { BOARD_REVIEW_DRAFT_LABELS } from './reportLabels.js';
import { normalizeMissingData, safeDate, safeList, safeText } from './reportSanitizers.js';

const SENSITIVE_KEY_PATTERN = /(password|token|cookie|authorization|authheader|auth_header|secret|apikey|api_key|privatekey|private_key|secureshare|secure_share|bearer)/i;
const REDACTED = '[REDACTED]';

function sanitizeAuditValue(value) {
  if (Array.isArray(value)) {
    return value.map((item) => sanitizeAuditValue(item));
  }
  if (value && typeof value === 'object') {
    return sanitizeBoardReviewAuditMetadata(value);
  }
  if (typeof value === 'boolean') {
    return value;
  }
  return safeText(value);
}

export function sanitizeBoardReviewAuditMetadata(metadata = {}) {
  const source = metadata && typeof metadata === 'object' ? metadata : {};

  return Object.entries(source).reduce((safeMetadata, [key, value]) => {
    safeMetadata[key] = SENSITIVE_KEY_PATTERN.test(key) ? REDACTED : sanitizeAuditValue(value);
    return safeMetadata;
  }, {});
}

export function buildBoardReviewAuditMetadata({
  reportId,
  boardPackId,
  organizationId,
  actorId,
  generatedAt,
  sourceModules,
  aiUsed,
  promptVersion,
  limitations,
  insufficientDataFlags,
  previewOnly = true
} = {}) {
  return sanitizeBoardReviewAuditMetadata({
    reportId: safeText(reportId, 'N/A'),
    boardPackId: safeText(boardPackId, 'N/A'),
    organizationId: safeText(organizationId, 'N/A'),
    actorId: safeText(actorId, 'N/A'),
    generatedAt: safeDate(generatedAt || new Date()),
    sourceModules: safeList(sourceModules).map((module) => safeText(module)),
    aiUsed: aiUsed === true,
    promptVersion: aiUsed === true ? safeText(promptVersion, 'N/A') : 'N/A',
    limitations: safeList(limitations).map((limitation) => safeText(limitation)),
    insufficientDataFlags: normalizeMissingData(insufficientDataFlags),
    previewOnly,
    exportType: 'html_preview',
    classification: BOARD_REVIEW_DRAFT_LABELS.confidential,
    statusLabel: BOARD_REVIEW_DRAFT_LABELS.status,
    humanReviewRequired: true
  });
}
