import { describe, expect, it, vi } from 'vitest';

import { generateAiDraft } from '../../../backend/services/ai/aiClient.service.js';
import { buildAiContext } from '../../../backend/services/ai/aiContextBuilder.service.js';
import { AI_ERROR_CODES } from '../../../backend/services/ai/aiErrors.js';
import { AI_USE_CASES } from '../../../backend/services/ai/aiUseCases.js';

const baseRequest = {
  useCase: AI_USE_CASES.BOARD_REVIEW_DRAFT,
  organizationId: 'org_1',
  actorId: 'user_1',
  context: buildAiContext({
    useCase: AI_USE_CASES.BOARD_REVIEW_DRAFT,
    organizationId: 'org_1',
    actorId: 'user_1',
    summaries: [{ module: 'reporting', posture: 'insufficient_data' }]
  })
};

function expectClientError(input, code) {
  try {
    generateAiDraft(input);
  } catch (error) {
    expect(error.code).toBe(code);
    return error;
  }
  throw new Error(`Expected AI client error ${code}`);
}

describe('aiClient', () => {
  it('disabled provider throws controlled AI_RUNTIME_DISABLED with audit metadata', () => {
    const error = expectClientError(
      { ...baseRequest, provider: 'disabled' },
      AI_ERROR_CODES.AI_RUNTIME_DISABLED
    );

    expect(error.details.auditRecord.result).toBe('blocked');
    expect(error.details.auditRecord.blockedReason).toBe(AI_ERROR_CODES.AI_RUNTIME_DISABLED);
  });

  it('mock provider is deterministic when explicitly allowed', () => {
    const first = generateAiDraft({ ...baseRequest, provider: 'mock', allowMock: true });
    const second = generateAiDraft({ ...baseRequest, provider: 'mock', allowMock: true });

    expect(first.draftText).toBe(second.draftText);
    expect(first.labels).toContain('AI Draft');
    expect(first.labels).toContain('Mock Provider');
    expect(first.auditRecord.result).toBe('draft');
  });

  it('mock provider is blocked outside test mode unless explicitly allowed', () => {
    vi.stubEnv('NODE_ENV', 'production');
    expectClientError({ ...baseRequest, provider: 'mock', allowMock: false }, AI_ERROR_CODES.AI_PROVIDER_NOT_CONFIGURED);
    vi.unstubAllEnvs();
  });

  it('does not silently fallback for unknown providers', () => {
    expectClientError({ ...baseRequest, provider: 'openai' }, AI_ERROR_CODES.AI_PROVIDER_NOT_CONFIGURED);
  });

  it('rejects forbidden use cases before provider handling', () => {
    expectClientError(
      { ...baseRequest, useCase: AI_USE_CASES.AUTONOMOUS_AGENT, provider: 'mock', allowMock: true },
      AI_ERROR_CODES.AI_USE_CASE_FORBIDDEN
    );
  });
});
