import { BOARD_REVIEW_DRAFT_LIMITATIONS } from './reportLabels.js';
import { buildBoardReviewAuditMetadata } from './boardReviewAuditMetadata.js';
import {
  BOARD_REVIEW_STATUSES,
  createBoardReviewVersionMetadata,
  resolveBoardReviewStatus
} from './boardReviewVersioning.js';
import { normalizeMissingData, safeDate, safeList, safeText } from './reportSanitizers.js';

function stablePart(value) {
  return safeText(value, 'snapshot').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'snapshot';
}

function makeSnapshotId(source, generatedAt) {
  const sourceId = source.id || source.reportId || source.boardPackId || source.title || 'local';
  return `preview-${stablePart(sourceId)}-${stablePart(safeDate(generatedAt))}`;
}

function collectSourceModules(source, rendererInput, sourceModules) {
  const explicitModules = safeList(sourceModules).map((module) => safeText(module));
  if (explicitModules.length > 0) {
    return explicitModules;
  }

  return safeList(rendererInput?.moduleSignals).map((signal) => safeText(signal?.module, '')).filter(Boolean);
}

export function buildBoardReviewSnapshot({
  boardPack,
  report,
  rendererInput,
  organizationName,
  scopeLabel,
  generatedAt = new Date(),
  sourceModules,
  dataFreshness,
  aiMetadata,
  statusInput
} = {}) {
  const source = boardPack || report || {};
  const input = rendererInput || {
    title: safeText(source.title, 'Board Review Draft'),
    organizationName: safeText(organizationName || source.organizationName, ''),
    scopeLabel: safeText(scopeLabel || source.scopeLabel, 'Reporting / Board Packs'),
    generatedAt,
    executiveSummary: safeText(source.executiveSummary, 'insufficient_data'),
    moduleSignals: [],
    keyRisks: [],
    missingData: ['board_pack_or_report_snapshot:insufficient_data'],
    reviewQuestions: [],
    humanReviewChecklist: [],
    auditMetadata: {}
  };
  const status = resolveBoardReviewStatus({
    ...statusInput,
    aiUsed: aiMetadata?.aiUsed === true,
    aiOnly: aiMetadata?.aiOnly === true
  });
  const missingData = normalizeMissingData(input.missingData);
  const resolvedSourceModules = collectSourceModules(source, input, sourceModules);
  const sourceType = boardPack ? 'board_pack' : report ? 'report' : 'snapshot_required';
  const safeAiMetadata = aiMetadata
    ? {
        aiUsed: aiMetadata.aiUsed === true,
        promptVersion: safeText(aiMetadata.promptVersion, 'N/A'),
        aiOnly: aiMetadata.aiOnly === true,
        status: status === BOARD_REVIEW_STATUSES.REVIEWED || status === BOARD_REVIEW_STATUSES.INTERNAL_FINAL
          ? BOARD_REVIEW_STATUSES.HUMAN_REVIEW_REQUIRED
          : status
      }
    : null;
  const versionMetadata = createBoardReviewVersionMetadata({
    version: source.version,
    status,
    createdAt: generatedAt,
    generatedAt,
    reviewedAt: statusInput?.reviewedAt,
    reviewedBy: statusInput?.reviewedBy,
    source: sourceType,
    aiUsed: safeAiMetadata?.aiUsed === true,
    promptVersion: safeAiMetadata?.promptVersion,
    humanReviewed: statusInput?.humanReviewed,
    internalFinalApproved: statusInput?.internalFinalApproved,
    aiOnly: safeAiMetadata?.aiOnly
  });
  const auditMetadata = buildBoardReviewAuditMetadata({
    reportId: source.reportId || report?.id,
    boardPackId: source.boardPackId || boardPack?.id,
    organizationId: source.organizationId,
    actorId: source.actorId,
    generatedAt,
    sourceModules: resolvedSourceModules,
    aiUsed: safeAiMetadata?.aiUsed === true,
    promptVersion: safeAiMetadata?.promptVersion,
    limitations: BOARD_REVIEW_DRAFT_LIMITATIONS,
    insufficientDataFlags: missingData,
    previewOnly: true
  });

  return {
    snapshotId: makeSnapshotId(source, generatedAt),
    snapshotVersion: safeText(source.snapshotVersion, 'preview-v1'),
    status,
    createdAt: safeDate(generatedAt),
    generatedAt: safeDate(generatedAt),
    organizationName: safeText(organizationName || input.organizationName, ''),
    scopeLabel: safeText(scopeLabel || input.scopeLabel, 'Reporting / Board Packs'),
    sourceModules: resolvedSourceModules,
    dataFreshness: safeText(dataFreshness || source.dataFreshness, 'N/A'),
    rendererInput: {
      ...input,
      auditMetadata: {
        ...input.auditMetadata,
        ...versionMetadata,
        ...auditMetadata,
        snapshotId: makeSnapshotId(source, generatedAt),
        snapshotVersion: safeText(source.snapshotVersion, 'preview-v1')
      }
    },
    missingData,
    insufficientDataFlags: missingData.filter((item) => /insufficient_data/i.test(item)),
    aiMetadata: safeAiMetadata,
    truthfulness: {
      rendererIsSourceOfTruth: false,
      snapshotIsSourceOfTruth: false,
      humanReviewRequired: true,
      notBoardApproved: true,
      noScoreRecalculation: true,
      noCertification: true
    },
    versionMetadata,
    auditMetadata
  };
}

export function validateBoardReviewSnapshot(snapshot) {
  return Boolean(
    snapshot
    && snapshot.truthfulness?.rendererIsSourceOfTruth === false
    && snapshot.truthfulness?.snapshotIsSourceOfTruth === false
    && snapshot.truthfulness?.humanReviewRequired === true
    && snapshot.truthfulness?.notBoardApproved === true
    && snapshot.truthfulness?.noScoreRecalculation === true
    && snapshot.truthfulness?.noCertification === true
  );
}

export function sanitizeSnapshotForRenderer(snapshot) {
  if (!validateBoardReviewSnapshot(snapshot)) {
    return {
      title: 'Board Review Draft',
      scopeLabel: 'Reporting / Board Packs',
      executiveSummary: 'insufficient_data',
      moduleSignals: [],
      keyRisks: [],
      missingData: ['snapshot:insufficient_data'],
      reviewQuestions: [],
      humanReviewChecklist: [],
      auditMetadata: {}
    };
  }
  return snapshot.rendererInput;
}
