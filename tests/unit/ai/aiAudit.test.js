import { describe, expect, it } from 'vitest';

import {
  buildAiAuditRecord,
  redactAiPayload
} from '../../../backend/services/ai/aiAudit.service.js';
import { AI_USE_CASES } from '../../../backend/services/ai/aiUseCases.js';

describe('aiAudit', () => {
  it('redacts secrets recursively', () => {
    const redacted = redactAiPayload({
      password: 'pw',
      nested: {
        accessToken: 'token',
        privateKey: 'key'
      },
      safe: 'visible'
    });

    expect(redacted.password).toBe('[REDACTED]');
    expect(redacted.nested.accessToken).toBe('[REDACTED]');
    expect(redacted.nested.privateKey).toBe('[REDACTED]');
    expect(redacted.safe).toBe('visible');
  });

  it('builds safe audit metadata without token/password/cookie values', () => {
    const record = buildAiAuditRecord({
      useCase: AI_USE_CASES.BOARD_REVIEW_DRAFT,
      organizationId: 'org_1',
      actorId: 'user_1',
      provider: 'disabled',
      promptVersion: 'board_review_draft_v1',
      result: 'blocked',
      blockedReason: 'AI_RUNTIME_DISABLED',
      metadata: {
        token: 'secret',
        cookie: 'secret',
        promptSize: 120
      }
    });

    expect(record.metadata.token).toBe('[REDACTED]');
    expect(record.metadata.cookie).toBe('[REDACTED]');
    expect(record.metadata.promptSize).toBe(120);
    expect(JSON.stringify(record)).not.toContain('secret');
  });
});
