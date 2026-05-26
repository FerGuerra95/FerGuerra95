import { buildAiAuditRecord } from './aiAudit.service.js';
import { buildAiContext } from './aiContextBuilder.service.js';
import { AI_ERROR_CODES, AiServiceError } from './aiErrors.js';
import { generateAiDraft } from './aiClient.service.js';
import { AI_OUTPUT_LABELS, validateAiRequest } from './aiGuardrails.service.js';
import { getPromptDefinition } from './aiPromptRegistry.js';
import { AI_USE_CASES } from './aiUseCases.js';

const BOARD_REVIEW_TRUTHFULNESS = Object.freeze({
  sourceOfTruth: 'DSS_SIGNALS_ONLY',
  noScoreRecalculation: true,
  noCertification: true,
  noAutonomousDecision: true,
  humanReviewRequired: true
});

const HUMAN_REVIEW_CHECKLIST = Object.freeze([
  'Confirm all narrative statements against tenant-scoped DSS records.',
  'Verify insufficient_data items before board use.',
  'Confirm no legal, investment, certification, or board-approved language was introduced.',
  'Approve, edit, or discard the draft through a human workflow only.'
]);

function normalizeArray(value) {
  if (!value) {
    return [];
  }
  return Array.isArray(value) ? value : [value];
}

function summarizeSignal(signal, index) {
  if (!signal || typeof signal !== 'object') {
    return {
      label: `Signal ${index + 1}`,
      value: signal
    };
  }

  return {
    module: signal.module ?? signal.source ?? 'DSS',
    label: signal.label ?? signal.name ?? signal.title ?? `Signal ${index + 1}`,
    status: signal.status ?? signal.posture ?? signal.value ?? null,
    provenance: signal.provenance ?? signal.sourceLabel ?? null
  };
}

function buildStructuredMockDraft({
  executiveSummary,
  moduleSignals,
  riskHighlights,
  missingData,
  reportingMetadata,
  aiDraft
}) {
  const normalizedSignals = normalizeArray(moduleSignals).map(summarizeSignal);
  const normalizedRisks = normalizeArray(riskHighlights);
  const normalizedMissingData = normalizeArray(missingData);

  return {
    title: reportingMetadata?.title ?? 'AI Board Review Draft',
    executiveSummary: executiveSummary?.summary
      ?? executiveSummary?.text
      ?? aiDraft?.draftText
      ?? 'AI Draft (Mock). Requires Human Review. Based on supplied DSS signals only.',
    keySignals: normalizedSignals,
    risksAndLimitations: normalizedRisks,
    missingData: normalizedMissingData,
    recommendedReviewQuestions: [
      'Which DSS signals require executive confirmation before board circulation?',
      'Which insufficient_data items should be resolved or explicitly disclosed?',
      'Are any risk, compliance, funding, or M&A statements missing source labels?'
    ],
    humanReviewChecklist: [...HUMAN_REVIEW_CHECKLIST]
  };
}

function buildDisabledResponse({ organizationId, actorId, provider, promptDefinition, context, error }) {
  return {
    ok: false,
    useCase: AI_USE_CASES.BOARD_REVIEW_DRAFT,
    status: 'runtime_disabled',
    provider: provider ?? 'disabled',
    errorCode: error?.code ?? AI_ERROR_CODES.AI_RUNTIME_DISABLED,
    labels: [...AI_OUTPUT_LABELS],
    truthfulness: { ...BOARD_REVIEW_TRUTHFULNESS },
    audit: error?.details?.auditRecord ?? buildAiAuditRecord({
      useCase: AI_USE_CASES.BOARD_REVIEW_DRAFT,
      organizationId,
      actorId,
      provider: provider ?? 'disabled',
      promptVersion: promptDefinition?.version ?? null,
      result: 'blocked',
      blockedReason: error?.code ?? AI_ERROR_CODES.AI_RUNTIME_DISABLED,
      metadata: {
        contextVersion: context?.contextVersion,
        omittedFields: context?.omittedFields
      }
    })
  };
}

export function createBoardReviewDraft({
  organizationId,
  actorId,
  source,
  executiveSummary,
  moduleSignals,
  reportingMetadata,
  riskHighlights,
  missingData,
  provider = 'disabled',
  allowMock = false,
  useCase = AI_USE_CASES.BOARD_REVIEW_DRAFT
} = {}) {
  validateAiRequest({
    useCase,
    organizationId,
    actorId,
    outputMode: 'draft',
    humanReviewRequired: true,
    allowExternalSend: false,
    allowDatabaseMutation: false,
    allowScoreRecalculation: false,
    certificationClaim: false
  });

  const promptDefinition = getPromptDefinition(useCase);
  const context = buildAiContext({
    useCase,
    organizationId,
    actorId,
    source,
    summaries: [
      {
        type: 'executiveSummary',
        value: executiveSummary ?? null
      },
      {
        type: 'riskHighlights',
        value: normalizeArray(riskHighlights)
      },
      {
        type: 'missingData',
        value: normalizeArray(missingData)
      }
    ],
    moduleSignals: normalizeArray(moduleSignals),
    reportMetadata: reportingMetadata ?? {}
  });

  try {
    const aiDraft = generateAiDraft({
      useCase,
      organizationId,
      actorId,
      context,
      provider,
      allowMock
    });

    return {
      ok: true,
      useCase,
      status: 'draft_prepared',
      provider: aiDraft.provider,
      promptVersion: promptDefinition.id,
      labels: [...AI_OUTPUT_LABELS],
      draft: buildStructuredMockDraft({
        executiveSummary,
        moduleSignals,
        riskHighlights,
        missingData,
        reportingMetadata,
        aiDraft
      }),
      truthfulness: { ...BOARD_REVIEW_TRUTHFULNESS },
      audit: buildAiAuditRecord({
        useCase,
        organizationId,
        actorId,
        provider: aiDraft.provider,
        promptVersion: promptDefinition.version,
        result: 'draft',
        metadata: {
          contextVersion: context.contextVersion,
          omittedFields: context.omittedFields,
          labels: AI_OUTPUT_LABELS,
          sourceType: source?.type ?? null,
          reportingMetadata
        }
      })
    };
  } catch (error) {
    if (error instanceof AiServiceError && error.code === AI_ERROR_CODES.AI_RUNTIME_DISABLED) {
      return buildDisabledResponse({
        organizationId,
        actorId,
        provider,
        promptDefinition,
        context,
        error
      });
    }
    throw error;
  }
}
