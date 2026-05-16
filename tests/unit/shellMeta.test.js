import { describe, expect, it } from 'vitest';

import {
  WORKSPACE_SHELL_TITLES,
  getShellTopbarMeta
} from '../../src/app/layout/shellMeta.js';

describe('shellMeta', () => {
  it('maps workspace branches to shell titles (never product brand)', () => {
    expect(WORKSPACE_SHELL_TITLES.ma).toBe('M&A');
    expect(WORKSPACE_SHELL_TITLES.pmi).toBe('PMI & Synergies');
    expect(WORKSPACE_SHELL_TITLES.overview).toBe('Executive Command Center');
  });

  it('uses branch title with page description when route meta exists', () => {
    const meta = getShellTopbarMeta('/funding/dashboard', 'funding');
    expect(meta.title).toBe('Funding');
    expect(meta.description).toMatch(/readiness/i);
    expect(meta.pageLabel).toBe('Funding Dashboard');
  });

  it('falls back to workspace description for unmapped routes', () => {
    const meta = getShellTopbarMeta('/pmi/synergies', 'pmi');
    expect(meta.title).toBe('PMI & Synergies');
    expect(meta.description).toMatch(/integraci/i);
    expect(meta.pageLabel).toBeNull();
  });

  it('never returns CEO brand as topbar title', () => {
    const meta = getShellTopbarMeta('/pmi/unknown-route', 'pmi');
    expect(meta.title).not.toMatch(/CEO/i);
  });
});
