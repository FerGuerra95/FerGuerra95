import { buildAiAuditRecord } from './aiAudit.service.js';
import { buildAiContext } from './aiContextBuilder.service.js';
import { AI_ERROR_CODES, createAiError } from './aiErrors.js';
import { validateAiRequest } from './aiGuardrails.service.js';
import { getPromptDefinition } from './aiPromptRegistry.js';

function assertMockAllowed({ provider, allowMock }) {
  if (provider !== 'mock') {
    return;
  }
  if (allowMock === true || process.env.NODE_ENV === 'test') {
    return;
  }
  throw createAiError(AI_ERROR_CODES.AI_PROVIDER_NOT_CONFIGURED);
}

export function generateAiDraft({
  useCase,
  organizationId,
  actorId,
  context,
  provider = 'disabled',
  allowMock = false
} = {}) {
  const guardrailResult = validateAiRequest({
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
  if (!promptDefinition) {
    throw createAiError(AI_ERROR_CODES.AI_USE_CASE_NOT_ALLOWED);
  }

  const auditBase = {
    useCase,
    organizationId,
    actorId,
    provider,
    promptVersion: promptDefinition.version,
    metadata: {
      contextVersion: context?.contextVersion,
      labels: promptDefinition.labels
    }
  };

  if (provider === 'disabled') {
    const auditRecord = buildAiAuditRecord({
      ...auditBase,
      result: 'blocked',
      blockedReason: AI_ERROR_CODES.AI_RUNTIME_DISABLED
    });
    throw createAiError(AI_ERROR_CODES.AI_RUNTIME_DISABLED, { auditRecord });
  }

  assertMockAllowed({ provider, allowMock });
  if (provider !== 'mock') {
    throw createAiError(AI_ERROR_CODES.AI_PROVIDER_NOT_CONFIGURED);
  }

  const safeContext = context?.contextVersion
    ? context
    : buildAiContext({ useCase, organizationId, actorId, summaries: context?.summaries ?? [] });

  return {
    provider: 'mock',
    classification: 'draft',
    promptVersion: promptDefinition.version,
    labels: [...guardrailResult.labels, 'Mock Provider'],
    draftText: [
      'AI Draft (Mock). Requires Human Review.',
      `Use case: ${useCase}.`,
      `Context version: ${safeContext.contextVersion}.`,
      'This deterministic draft uses only supplied DSS context and is not board approved.'
    ].join(' '),
    auditRecord: buildAiAuditRecord({
      ...auditBase,
      result: 'draft',
      metadata: {
        contextVersion: safeContext.contextVersion,
        omittedFields: safeContext.omittedFields,
        labels: promptDefinition.labels
      }
    })
  };
}
