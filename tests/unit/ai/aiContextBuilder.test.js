import { describe, expect, it } from 'vitest';

import { buildAiContext } from '../../../backend/services/ai/aiContextBuilder.service.js';
import { AI_ERROR_CODES } from '../../../backend/services/ai/aiErrors.js';
import { AI_USE_CASES } from '../../../backend/services/ai/aiUseCases.js';

const baseContext = {
  useCase: AI_USE_CASES.BOARD_REVIEW_DRAFT,
  organizationId: 'org_1',
  actorId: 'user_1'
};

function expectContextError(input, code) {
  try {
    buildAiContext(input);
  } catch (error) {
    expect(error.code).toBe(code);
    return;
  }
  throw new Error(`Expected AI context error ${code}`);
}

describe('aiContextBuilder', () => {
  it('rejects missing tenant scope', () => {
    expectContextError({ ...baseContext, organizationId: '' }, AI_ERROR_CODES.AI_TENANT_SCOPE_REQUIRED);
  });

  it('rejects tokens, cookies, password hashes, raw dumps, and cross-tenant data', () => {
    expectContextError({ ...baseContext, summaries: [{ token: 'secret' }] }, AI_ERROR_CODES.AI_SECRET_DETECTED);
    expectContextError({ ...baseContext, summaries: [{ cookie: 'secret' }] }, AI_ERROR_CODES.AI_SECRET_DETECTED);
    expectContextError({ ...baseContext, summaries: [{ passwordHash: 'secret' }] }, AI_ERROR_CODES.AI_SECRET_DETECTED);
    expectContextError({ ...baseContext, rawDbDump: [{ id: 1 }] }, AI_ERROR_CODES.AI_SECRET_DETECTED);
    expectContextError({ ...baseContext, moduleSignals: [{ crossTenantData: true }] }, AI_ERROR_CODES.AI_SECRET_DETECTED);
  });

  it('preserves insufficient_data markers', () => {
    const result = buildAiContext({
      ...baseContext,
      summaries: [{ module: 'compliance', posture: 'insufficient_data', score: null }]
    });

    expect(result.summaries[0].posture).toBe('insufficient_data');
    expect(result.summaries[0].score).toBeNull();
  });

  it('returns minimized context with omitted fields', () => {
    const result = buildAiContext({
      ...baseContext,
      summaries: [{ module: 'reporting', headline: 'Board pack', internalNote: 'omit' }],
      allowedFields: ['module', 'headline']
    });

    expect(result.organizationScope).toBe('backend-authenticated');
    expect(result.summaries[0]).toEqual({ module: 'reporting', headline: 'Board pack' });
    expect(result.omittedFields).toContain('summaries[0].internalNote');
  });
});
