import { BOARD_REVIEW_DRAFT_LABELS } from './reportLabels.js';
import {
  ensureNoInvalidNumber,
  normalizeMissingData,
  safeDate,
  safeList,
  safeText,
  sanitizeSignal
} from './reportSanitizers.js';

const DEFAULT_REVIEW_QUESTIONS = Object.freeze([
  'Which DSS signals require owner confirmation before circulation?',
  'Which missing data should be resolved before internal final review?',
  'Are the stated limitations clear enough for board preparation?'
]);

const DEFAULT_HUMAN_REVIEW_CHECKLIST = Object.freeze([
  'Confirm source labels and data freshness.',
  'Review all insufficient_data and N/A fields.',
  'Verify this draft is not presented as board approved.'
]);

function firstDefined(...values) {
  return values.find((value) => value !== undefined && value !== null && value !== '');
}

function normalizeSignals(source) {
  return safeList(firstDefined(
    source.moduleSignals,
    source.signals,
    source.sections?.moduleSignals,
    source.snapshot?.moduleSignals
  )).map((signal) => sanitizeSignal(signal));
}

function normalizeRisks(source) {
  return safeList(firstDefined(
    source.keyRisks,
    source.risks,
    source.riskHighlights,
    source.sections?.keyRisks,
    source.snapshot?.keyRisks
  )).map((risk) => safeText(risk));
}

function normalizeAuditMetadata(source, generatedAt, sourceType) {
  const audit = source.auditMetadata && typeof source.auditMetadata === 'object'
    ? source.auditMetadata
    : {};

  return {
    reportId: safeText(firstDefined(audit.reportId, source.reportId, source.id), 'N/A'),
    boardPackId: safeText(firstDefined(audit.boardPackId, source.boardPackId, source.id), 'N/A'),
    status: safeText(firstDefined(audit.status, source.status), 'draft'),
    version: safeText(firstDefined(audit.version, source.version), 'draft-preview'),
    sourceType,
    generatedAt: safeDate(generatedAt),
    aiUsed: safeText(firstDefined(audit.aiUsed, source.aiUsed), 'No'),
    promptVersion: safeText(firstDefined(audit.promptVersion, source.promptVersion), 'N/A'),
    limitations: `${BOARD_REVIEW_DRAFT_LABELS.humanReview}; ${BOARD_REVIEW_DRAFT_LABELS.notBoardApproved}`
  };
}

export function toBoardReviewDraftInput({
  boardPack,
  report,
  organizationName,
  generatedAt = new Date(),
  fallbackScope = 'Reporting / Board Packs'
} = {}) {
  const source = boardPack || report || {};
  const sourceType = boardPack ? 'board_pack' : report ? 'report' : 'snapshot_required';
  const sourceHasSnapshot = Boolean(boardPack || report);
  const normalizedSignals = normalizeSignals(source);
  const missingData = normalizeMissingData(firstDefined(
    source.missingData,
    source.insufficientData,
    source.sections?.missingData,
    source.snapshot?.missingData,
    sourceHasSnapshot ? [] : ['board_pack_or_report_snapshot:insufficient_data']
  ));

  if (normalizedSignals.length === 0) {
    missingData.push('moduleSignals:insufficient_data');
  }

  const score = ensureNoInvalidNumber(firstDefined(source.completenessScore, source.score));
  const moduleSignals = normalizedSignals.length > 0
    ? normalizedSignals
    : [{
        module: 'Reporting',
        label: 'Board pack snapshot',
        status: 'insufficient_data',
        score,
        sourceLabel: 'Reporting preview'
      }];

  return {
    title: safeText(firstDefined(source.title, source.name), BOARD_REVIEW_DRAFT_LABELS.status),
    organizationName: safeText(firstDefined(organizationName, source.organizationName), ''),
    scopeLabel: safeText(firstDefined(source.scopeLabel, source.module, source.reportType, fallbackScope), fallbackScope),
    generatedAt,
    executiveSummary: safeText(firstDefined(
      source.executiveSummary,
      source.summary,
      source.sections?.executiveSummary,
      source.snapshot?.executiveSummary
    ), 'insufficient_data'),
    moduleSignals,
    keyRisks: normalizeRisks(source),
    missingData,
    reviewQuestions: safeList(firstDefined(source.reviewQuestions, source.decisionQuestions, source.sections?.reviewQuestions, DEFAULT_REVIEW_QUESTIONS)),
    humanReviewChecklist: safeList(firstDefined(source.humanReviewChecklist, source.sections?.humanReviewChecklist, DEFAULT_HUMAN_REVIEW_CHECKLIST)),
    auditMetadata: normalizeAuditMetadata(source, generatedAt, sourceType),
    logoSrc: source.logoSrc
  };
}

export default toBoardReviewDraftInput;
