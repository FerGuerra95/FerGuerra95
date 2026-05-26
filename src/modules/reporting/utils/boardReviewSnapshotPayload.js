import { toBoardReviewDraftInput } from './boardReviewDraftAdapter.js';
import { normalizeMissingData, safeList, safeText } from './reportSanitizers.js';

const TENANT_KEYS = new Set([
  'organizationId',
  'orgId',
  'organization_id',
  'tenantId',
  'tenant_id'
]);

const SENSITIVE_KEY_PATTERN =
  /(password|token|cookie|authorization|authheader|auth_header|secret|api[_-]?key|private[_-]?key|secure[_-]?share|bearer)/i;

function cloneSafe(value) {
  if (Array.isArray(value)) {
    return value.map(cloneSafe);
  }

  if (value && typeof value === 'object') {
    return Object.entries(value).reduce((acc, [key, nested]) => {
      if (TENANT_KEYS.has(key) || SENSITIVE_KEY_PATTERN.test(key)) {
        return acc;
      }
      acc[key] = cloneSafe(nested);
      return acc;
    }, {});
  }

  return value;
}

export function stripClientTenantFields(payload = {}) {
  return cloneSafe(payload);
}

export function stripSensitiveSnapshotFields(payload = {}) {
  return cloneSafe(payload);
}

export function sanitizeBoardReviewSnapshotPayload(payload = {}) {
  return cloneSafe(payload);
}

function collectInsufficientData(rendererInput = {}, snapshot = {}) {
  const values = [
    ...normalizeMissingData(rendererInput.missingData),
    ...safeList(snapshot.insufficientDataFlags)
  ];
  return [...new Set(values.filter(Boolean))];
}

export function buildCreateBoardReviewSnapshotPayload({
  boardPack,
  report,
  rendererInput,
  snapshot,
  organizationName,
  generatedAt = new Date(),
  fallbackScope = 'Reporting / Board Packs',
  statusInput,
  aiMetadata,
  sourceModules,
  dataFreshness
} = {}) {
  const input = rendererInput
    ? { ...rendererInput }
    : toBoardReviewDraftInput({
        boardPack,
        report,
        organizationName,
        generatedAt,
        fallbackScope,
        includeSnapshot: true,
        statusInput,
        aiMetadata,
        sourceModules,
        dataFreshness
      });

  const resolvedSnapshot = snapshot || input.snapshot || {};
  const resolvedRendererInput = input.rendererInput || input;
  const missingData = normalizeMissingData(
    resolvedRendererInput.missingData || resolvedSnapshot.missingData
  );
  const insufficientDataFlags = collectInsufficientData(
    resolvedRendererInput,
    resolvedSnapshot
  );

  return sanitizeBoardReviewSnapshotPayload({
    title: safeText(resolvedRendererInput.title, 'Board Review Draft'),
    status: safeText(resolvedSnapshot.status || statusInput?.status, 'human_review_required'),
    snapshotVersion: resolvedSnapshot.snapshotVersion || 1,
    rendererVersion: 'html_board_review_v1',
    reportId: report?.id || resolvedSnapshot.reportId,
    boardPackId: boardPack?.id || resolvedSnapshot.boardPackId,
    sourceModules: safeList(sourceModules || resolvedSnapshot.sourceModules || boardPack?.sourceModules || report?.sourceModules),
    dataFreshness: dataFreshness || resolvedSnapshot.dataFreshness || {},
    rendererInput: resolvedRendererInput,
    missingData,
    insufficientDataFlags,
    aiMetadata: aiMetadata || resolvedSnapshot.aiMetadata || {},
    truthfulness: {
      rendererIsSourceOfTruth: false,
      snapshotIsSourceOfTruth: true,
      humanReviewRequired: true,
      notBoardApproved: true,
      noScoreRecalculation: true,
      noCertification: true,
      ...(resolvedSnapshot.truthfulness || {})
    },
    auditMetadata: {
      ...(resolvedRendererInput.auditMetadata || {}),
      ...(resolvedSnapshot.auditMetadata || {}),
      sourceType: boardPack ? 'board_pack' : report ? 'report' : 'persisted_snapshot_candidate',
      statusLabel: 'Board Review Draft',
      humanReviewRequired: true,
      notBoardApproved: true,
      persistedSnapshotCandidate: true
    }
  });
}

export default buildCreateBoardReviewSnapshotPayload;
