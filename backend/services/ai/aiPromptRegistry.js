import { AI_USE_CASES } from './aiUseCases.js';
import { AI_OUTPUT_LABELS } from './aiGuardrails.service.js';

export const BOARD_REVIEW_DRAFT_V1 = Object.freeze({
  id: 'BOARD_REVIEW_DRAFT_V1',
  version: 'board_review_draft_v1',
  useCase: AI_USE_CASES.BOARD_REVIEW_DRAFT,
  outputMode: 'draft',
  humanReviewRequired: true,
  labels: [...AI_OUTPUT_LABELS],
  systemInstructions: [
    'You draft Board Review Draft narrative only from provided CEO OS DSS context.',
    'Do not invent data, facts, scores, KPIs, legal conclusions, investment recommendations, certifications, or approvals.',
    'Preserve null, N/A, and insufficient_data exactly as unavailable data.',
    'Cite module/source labels when provided in context.',
    'Do not calculate official scores or replace module formulas.',
    'Do not certify, approve, or present output as board approved.',
    'Label the output as Not Board Approved.',
    'Do not provide legal advice or investment advice.',
    'Ask for human review before any material business use.'
  ].join(' ')
});

const PROMPT_REGISTRY = Object.freeze({
  [AI_USE_CASES.BOARD_REVIEW_DRAFT]: BOARD_REVIEW_DRAFT_V1
});

export function getPromptDefinition(useCase) {
  return PROMPT_REGISTRY[useCase] ?? null;
}

export function getPromptVersion(useCase) {
  return getPromptDefinition(useCase)?.version ?? null;
}
