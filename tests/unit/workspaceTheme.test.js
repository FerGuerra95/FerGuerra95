import { describe, expect, it } from 'vitest';

import {
  WORKSPACE_THEMES,
  getWorkspaceTheme,
  getWorkspaceThemeCssVars
} from '../../src/shared/config/workspaceTheme.js';

describe('workspaceTheme', () => {
  it('exposes accent tokens for every workspace branch', () => {
    const keys = [
      'overview',
      'ma',
      'compliance',
      'funding',
      'governance',
      'pmi',
      'bridge',
      'heritage',
      'risk',
      'reporting',
      'strategy'
    ];

    keys.forEach((key) => {
      const theme = WORKSPACE_THEMES[key];
      expect(theme.accent).toMatch(/^rgba\(/);
      expect(theme.accentSoft).toMatch(/^rgba\(/);
      expect(theme.chartAccent).toMatch(/^rgba\(/);
    });
  });

  it('maps funding to cyan and governance to purple accents', () => {
    expect(getWorkspaceTheme('funding').rgb).toBe('34, 211, 238');
    expect(getWorkspaceTheme('governance').rgb).toBe('168, 85, 247');
    expect(getWorkspaceTheme('bridge').rgb).toBe('236, 72, 153');
  });

  it('returns css variables with legacy workspace aliases', () => {
    const vars = getWorkspaceThemeCssVars('ma');
    expect(vars['--ws-accent']).toBe(vars['--workspace-accent']);
    expect(vars['--ws-accent-soft']).toBe(vars['--workspace-accent-soft']);
  });

  it('maps gradient and surface tokens into css variables', () => {
    const vars = getWorkspaceThemeCssVars('funding');
    expect(vars['--ws-hero-gradient']).toContain('linear-gradient');
    expect(vars['--ws-card-gradient']).toContain('linear-gradient');
    expect(vars['--ws-surface']).toMatch(/^rgba\(/);
    expect(vars['--ws-chart']).toBe(vars['--ws-chart-accent']);
    expect(vars['--ws-rgb']).toBe('34, 211, 238');
  });

  it('falls back to overview for unknown keys', () => {
    expect(getWorkspaceTheme('unknown').label).toBe('CEO Overview');
  });
});
