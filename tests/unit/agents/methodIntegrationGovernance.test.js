import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

import { HUMAN_GATES, validateCapsule } from '../../../scripts/agents/lib/capsule.mjs';
import { checkPaths, PolicyError } from '../../../scripts/agents/lib/policy.mjs';
import {
  authorizeGate,
  createInitialState,
  transition,
  TransitionError
} from '../../../scripts/agents/lib/stateMachine.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
const SHARED_BASELINE = 'c92aabd3b781af862cff9a85bb491ebd12eeaf58';
const STALE = /0adf5a3b56d324cc2d2f6985455868e4d233bec0|bc2d6ba41da3dd687264009faeb3d192a8e6705b|c04bbc8735c05745d19a2d3adfee6d6f805e384f/;
const ALLOWED_FILES = [
  'AGENTS.md',
  '.agents/README.md',
  '.agents/ACTIVE_TASKS.md',
  'docs/product/CEO_OS_MASTER_CONTROL_BASELINE.md',
  'docs/product/CODEBASE_HARDENING_STATUS.md',
  'docs/testing/TEST_STRATEGY.md',
  'docs/ai/AI_OPERATING_MODEL.md',
  'docs/ai/PROMPT_LIBRARY.md',
  'tests/unit/agents/methodIntegrationGovernance.test.js'
];

const docs = {
  agents: read('AGENTS.md'),
  readme: read('.agents/README.md'),
  active: read('.agents/ACTIVE_TASKS.md'),
  master: read('docs/product/CEO_OS_MASTER_CONTROL_BASELINE.md'),
  hardening: read('docs/product/CODEBASE_HARDENING_STATUS.md'),
  strategy: read('docs/testing/TEST_STRATEGY.md'),
  model: read('docs/ai/AI_OPERATING_MODEL.md'),
  prompts: read('docs/ai/PROMPT_LIBRARY.md')
};

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8');
}

function linesOf(text) {
  return text.split(/\r?\n/);
}

function lineHas(text, a, b) {
  return linesOf(text).some((line) => a.test(line) && b.test(line));
}

function headings(text) {
  return [...text.matchAll(/^#{2,3}\s+(.+)$/gm)].map((match) => match[1].trim());
}

function sectionAfter(text, pattern) {
  const match = text.match(pattern);
  if (!match) return '';
  const start = match.index + match[0].length;
  const rest = text.slice(start);
  const next = rest.search(/\n##\s+/);
  return next === -1 ? rest : rest.slice(0, next);
}

function methodCapsule(overrides = {}) {
  return validateCapsule({
    task: 'METHOD-INTEGRATION-01',
    baseline: SHARED_BASELINE,
    allowed_files: ALLOWED_FILES,
    forbidden_files: ['docs/roadmap.md', 'package.json'],
    protected_authorization: ['governance_handoff'],
    human_gates: {
      scope_expansion: false,
      source_of_truth_change: false,
      golden_change: false,
      governance_change: true,
      merge: false,
      production: false,
      destructive_real_data_action: false
    },
    ...overrides
  });
}

function implementing(authority = methodCapsule()) {
  return transition(createInitialState(authority), { to: 'IMPLEMENTING', role: 'engineering' }, { capsule: authority });
}

describe('METHOD-INTEGRATION-01 governance semantics', () => {
  it('keeps Legacy Guidance from widening capsule-authorized paths', () => {
    const authority = methodCapsule();
    const state = implementing(authority);
    const extra = 'docs/roadmap.md';
    expect(() => checkPaths({
      capsule: authority,
      state,
      changedFiles: [...ALLOWED_FILES, extra]
    })).toThrow(PolicyError);

    const wideningClaim = /(?:authorized|allowed)(?:\s+\w+){0,4}\s+(?:include|includes|are)\b[\s\S]{0,240}docs\/roadmap\.md/i;
    expect(docs.readme).not.toMatch(wideningClaim);
    expect(docs.prompts).not.toMatch(wideningClaim);
    expect(docs.model).not.toMatch(wideningClaim);
    expect(docs.agents).toMatch(/cannot widen capsule-authorized paths/i);
  });

  it('does not treat PASS prose as VERIFIED', () => {
    const authority = methodCapsule();
    const state = implementing(authority);
    expect(state.review_status).toBe('PENDING');
    expect(state.phase).toBe('IMPLEMENTING');
    expect(() => transition(state, { to: 'VERIFIED', role: 'engineering' }, { capsule: authority }))
      .toThrow(TransitionError);

    const prohibition = sectionAfter(docs.agents, /### Canonical governance, orchestration, and Legacy Guidance/);
    expect(prohibition).toMatch(/Prose cannot create `VERIFIED`/i);
    expect(prohibition).toMatch(/PASS[\s\S]{0,80}not Independent Review/i);
    expect(docs.prompts).toMatch(/A prompt saying PASS is not evidence/i);
  });

  it('does not treat completed prose as CLOSED', () => {
    const authority = methodCapsule();
    const state = implementing(authority);
    expect(() => transition(state, { to: 'CLOSED', role: 'engineering' }, { capsule: authority }))
      .toThrow(TransitionError);
    expect(state.phase).not.toBe('CLOSED');
    expect(state.builder_status).not.toBe('CLOSED');

    const prohibition = sectionAfter(docs.agents, /### Canonical governance, orchestration, and Legacy Guidance/);
    expect(prohibition).toMatch(/Prose cannot create `VERIFIED` or `CLOSED`/i);
    expect(prohibition).toMatch(/completed is not Independent Review and is not closure/i);
    expect(docs.prompts).toMatch(/A prompt saying done is not closure/i);
    expect(docs.active).toMatch(/CANONICALLY CLOSED locally/);
    expect(docs.active).not.toMatch(/IN PROGRESS \/ IMPLEMENTING/);
  });

  it('keeps merge authorization from implying governance_change or production', () => {
    const authority = validateCapsule({
      task: 'MERGE-GATE-ISOLATION',
      baseline: SHARED_BASELINE,
      allowed_files: ['AGENTS.md'],
      forbidden_files: [],
      protected_authorization: [],
      human_gates: {
        scope_expansion: false,
        source_of_truth_change: false,
        golden_change: false,
        governance_change: false,
        merge: true,
        production: false,
        destructive_real_data_action: false
      }
    });
    let state = createInitialState(authority);
    for (const step of [
      { to: 'IMPLEMENTING', role: 'engineering' },
      { to: 'READY_FOR_REVIEW', role: 'engineering' },
      { to: 'REVIEWING', role: 'reviewer' },
      { to: 'VERIFIED', role: 'reviewer' },
      { to: 'HUMAN_MERGE_GATE', role: 'reviewer' }
    ]) {
      state = transition(state, step, { capsule: authority });
    }
    state = authorizeGate(state, { gate: 'merge', role: 'human' }, { capsule: authority });
    expect(state.human_authorizations.merge).toBe(true);
    expect(state.human_authorizations.governance_change).toBe(false);
    expect(state.human_authorizations.production).toBe(false);
    expect(state.production_authorized).toBe(false);
    expect(() => authorizeGate(state, { gate: 'governance_change', role: 'human' }, { capsule: authority }))
      .toThrow(TransitionError);
    expect(() => authorizeGate(state, { gate: 'production', role: 'human' }, { capsule: authority }))
      .toThrow(TransitionError);

    expect(docs.agents).toMatch(/only one named gate/i);
    expect(docs.agents).toMatch(/non-transitive/i);
    expect(docs.agents).toMatch(/Merge authorization does not imply `governance_change`/i);
    expect(docs.agents).toMatch(/Prose cannot grant merge or production authority/i);
  });

  it('keeps .agents/README.md from establishing independent precedence', () => {
    expect(docs.readme).not.toMatch(/authority,\s*highest first/i);
    expect(docs.readme).not.toMatch(/^\s*\d+\.\s/m);
    expect(docs.readme).toMatch(/AGENTS\.md/);
    expect(docs.readme).toMatch(/precedence/i);
    expect(docs.readme).toMatch(/navigation pointer/i);
    expect(docs.readme).toMatch(/not a second constitution/i);
    expect(docs.readme).not.toMatch(/this directory owns authority/i);
    expect(docs.readme).toMatch(/do not establish independent precedence/i);
  });

  it('does not blanket-demote the AI Operating Model to advisory', () => {
    expect(docs.model).not.toMatch(/(this|the)\s+(entire|whole)\s+document\s+is\s+(advisory|subordinate|historical|non-authoritative)/i);
    expect(headings(docs.model).some((title) => /product[- ]ai/i.test(title))).toBe(true);
    expect(headings(docs.model).some((title) => /legacy/i.test(title))).toBe(true);

    const productAi = sectionAfter(docs.model, /^## Product-AI authority boundaries/m);
    expect(productAi).toMatch(/C\.16/);
    expect(productAi).toMatch(/AI_DATA_BOUNDARIES/);
    expect(productAi).toMatch(/Phase 10/);
    expect(productAi).toMatch(/must not become canonical authority/i);
    expect(productAi).toMatch(/permissions/);
    expect(productAi).toMatch(/tenant ownership/);
    expect(productAi).toMatch(/Source of Truth/);
    expect(productAi).not.toMatch(/\b(MIGRATE|DUPLICATED|CONTRADICTORY|OBSOLETE)\b/);

    const legacy = sectionAfter(docs.model, /^## Legacy developer operating guidance/m);
    expect(legacy).toMatch(/\b(KEEP|MIGRATE|DUPLICATED|CONTRADICTORY|OBSOLETE)\b/);
    expect(legacy).toMatch(/advisory and subordinate/i);
  });

  it('rejects stale hashes presented as current origin/main', () => {
    for (const [name, text] of Object.entries({
      active: docs.active,
      master: docs.master,
      hardening: docs.hardening
    })) {
      expect(text, name).toMatch(new RegExp(SHARED_BASELINE));
      expect(lineHas(text, /origin\/main/i, STALE), `${name} origin/main + stale`).toBe(false);
    }
    expect(docs.active).toMatch(/METHOD-INTEGRATION-01/);
    expect(lineHas(docs.active, /A04/, /not started/i)).toBe(true);
    expect(lineHas(docs.master, /A04/, /not started/i)).toBe(true);
    expect(lineHas(docs.hardening, /A04/, /OPEN P1/i)).toBe(true);
    expect(lineHas(docs.hardening, /A04/, /not started/i)).toBe(true);
    expect(docs.hardening).toMatch(/Phase 2[^\n]{0,160}ACTIVE/i);
  });

  it('keeps Prompt Library from claiming lifecycle authority', () => {
    expect(docs.prompts).not.toMatch(/official librar/i);
    expect(docs.prompts).not.toMatch(/verbatim into/i);
    expect(docs.prompts).toMatch(/advisory/i);
    expect(docs.prompts).toMatch(/AGENTS\.md/);
    expect(docs.prompts).not.toMatch(/HANDOFF_STATE[^\n]{0,80}authorit/i);
    expect(docs.prompts).not.toMatch(/authorit[^\n]{0,80}HANDOFF_STATE/i);
    expect(docs.prompts).toMatch(/cannot own or determine/i);
    expect(docs.prompts).toMatch(/canonical lifecycle/i);
    expect(docs.prompts).toMatch(/merge authorization/i);
    expect(docs.prompts).toMatch(/production authorization/i);
  });

  it('keeps Legacy Guidance from outranking canonical governance', () => {
    expect(docs.agents).toMatch(/Canonical governance owns authority/i);
    expect(docs.agents).toMatch(/Legacy Guidance[\s\S]{0,120}is subordinate/i);
    expect(docs.agents).toMatch(/must never become a second constitution/i);
    expect(docs.agents).toMatch(/must not override this contract/i);
    expect(docs.readme).toMatch(/Start at `AGENTS\.md`/);
    expect(docs.prompts).toMatch(/subordinate to `AGENTS\.md`/);
    expect(HUMAN_GATES).toEqual([
      'scope_expansion',
      'source_of_truth_change',
      'golden_change',
      'governance_change',
      'merge',
      'production',
      'destructive_real_data_action'
    ]);
  });

  it('requires structural assurance semantics rather than keyword presence alone', () => {
    const profile = sectionAfter(docs.strategy, /^## Provisional HIGH-risk A04 assurance profile/m);
    expect(profile).toMatch(/provisional/i);
    expect(profile).toMatch(/not[^\n]{0,60}globally mandatory/i);
    expect(profile).toMatch(/A04/);
    expect(profile).toMatch(/Independent Truth/);
    expect(profile).toMatch(/Oracle/);
    expect(profile).toMatch(/Adversarial Evidence Plan/);
    expect(profile).toMatch(/What plausible incorrect implementation could still pass this evidence plan\?/);
    expect(profile).toMatch(/Mutation Testing/);
    expect(profile).toMatch(/Fault Injection/);
    expect(profile).toMatch(/negative control/i);
    expect(profile).toMatch(/E0/);
    expect(profile).toMatch(/E5/);
    expect(profile).toMatch(/control-plane/);
    expect(profile).toMatch(/Reviewer evidence packet/);
    expect(profile).toMatch(/Assurance Question/);
    expect(profile).toMatch(/success criteria/i);
    expect(profile).toMatch(/proportional/i);
    expect(profile).toMatch(/have not been validated by A04/i);
    expect(profile).toMatch(/02B/);
    expect(profile).toMatch(/independent semantic review/i);

    const escaped = sectionAfter(docs.strategy, /### Escaped Defect vocabulary/);
    expect(escaped).toMatch(/DESIGN_ESCAPE/);
    expect(escaped).toMatch(/ENGINEERING_ESCAPE/);
    expect(escaped).toMatch(/REVIEW_ESCAPE/);
    expect(escaped).toMatch(/CLOSURE_ESCAPE/);
    expect(escaped).toMatch(/not current metrics/i);
    expect(escaped).toMatch(/later A04/i);

    const phases = linesOf(docs.master)
      .filter((line) => /^##\s+PHASE\s+\d+\s/i.test(line))
      .map((line) => Number(line.match(/^##\s+PHASE\s+(\d+)\s/i)[1]));
    expect(phases).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]);
    expect(docs.master).not.toMatch(/Assurance Baseline Audit[^\n]{0,160}\bIN PROGRESS\b/i);
    expect(lineHas(docs.hardening, /A31/, /IN PROGRESS/i)).toBe(true);
    expect(lineHas(docs.hardening, /Render/i, /SUSPENDED/i)).toBe(true);
    expect(docs.hardening).not.toMatch(/Method Integration[^\n]{0,200}(VERIFIED CLOSED|closes A[0-9])/i);
  });
});
