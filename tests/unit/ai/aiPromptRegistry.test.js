import { describe, expect, it } from 'vitest';

import {
  getPromptDefinition,
  getPromptVersion
} from '../../../backend/services/ai/aiPromptRegistry.js';
import { AI_USE_CASES } from '../../../backend/services/ai/aiUseCases.js';

describe('aiPromptRegistry', () => {
  it('returns Board Review Draft labels and version', () => {
    const prompt = getPromptDefinition(AI_USE_CASES.BOARD_REVIEW_DRAFT);

    expect(getPromptVersion(AI_USE_CASES.BOARD_REVIEW_DRAFT)).toBe('board_review_draft_v1');
    expect(prompt.labels).toContain('AI Draft');
    expect(prompt.labels).toContain('Requires Human Review');
    expect(prompt.labels).toContain('Based on DSS Signals');
    expect(prompt.labels).toContain('Not Legal Advice');
    expect(prompt.labels).toContain('Not Investment Advice');
    expect(prompt.labels).toContain('Not Board Approved');
  });

  it('instructs the model not to invent, advise, certify, approve, or calculate official scores', () => {
    const instructions = getPromptDefinition(AI_USE_CASES.BOARD_REVIEW_DRAFT).systemInstructions;

    expect(instructions).toMatch(/Do not invent/i);
    expect(instructions).toMatch(/Do not calculate official scores/i);
    expect(instructions).toMatch(/Do not certify/i);
    expect(instructions).toMatch(/Do not provide legal advice or investment advice/i);
    expect(instructions).toMatch(/not board approved/i);
  });
});
