/**
 * Workspace accent tokens — single source for rail, shell, sidebar and module surfaces.
 * Colors are accents only; page shells stay dark; gradients use subtle tint layers.
 */

/** @typedef {'overview' | 'ma' | 'compliance' | 'funding' | 'governance' | 'pmi' | 'bridge' | 'heritage' | 'risk' | 'reporting' | 'strategy'} WorkspaceThemeKey */

/**
 * @typedef {object} WorkspaceThemeTokens
 * @property {string} accent
 * @property {string} accentSoft
 * @property {string} accentGlow
 * @property {string} accentBorder
 * @property {string} accentBorderStrong
 * @property {string} accentText
 * @property {string} chartAccent
 * @property {string} rgb — "r, g, b" for documentation / legacy
 * @property {string} label
 * @property {string} accentSurface
 * @property {string} accentSurfaceStrong
 * @property {string} heroGradient
 * @property {string} cardGradient
 * @property {string} iconSurface
 */

/** @param {string} rgb @param {string} label @param {Partial<WorkspaceThemeTokens>} [overrides] */
function buildTheme(rgb, label, overrides = {}) {
  const accentSoft = overrides.accentSoft ?? `rgba(${rgb}, 0.18)`;
  const accentGlow = overrides.accentGlow ?? `rgba(${rgb}, 0.16)`;
  const accentBorder = overrides.accentBorder ?? `rgba(${rgb}, 0.28)`;
  const accentBorderStrong =
    overrides.accentBorderStrong ?? `rgba(${rgb}, 0.42)`;
  const accentSurface = overrides.accentSurface ?? `rgba(${rgb}, 0.10)`;
  const accentSurfaceStrong =
    overrides.accentSurfaceStrong ?? `rgba(${rgb}, 0.16)`;
  const heroGradient =
    overrides.heroGradient ??
    `linear-gradient(135deg, rgba(${rgb}, 0.18) 0%, #050505 52%, #080807 100%)`;
  const cardGradient =
    overrides.cardGradient ??
    `linear-gradient(145deg, rgba(${rgb}, 0.12) 0%, #0a0908 55%, #050504 100%)`;
  const iconSurface =
    overrides.iconSurface ??
    `linear-gradient(135deg, rgba(${rgb}, 0.22), rgba(${rgb}, 0.06))`;

  const base = {
    rgb,
    label,
    accent: overrides.accent ?? `rgba(${rgb}, 0.96)`,
    accentSoft,
    accentGlow,
    accentBorder,
    accentBorderStrong,
    accentText: overrides.accentText ?? `rgba(${rgb}, 0.92)`,
    chartAccent: overrides.chartAccent ?? `rgba(${rgb}, 0.85)`,
    accentSurface,
    accentSurfaceStrong,
    heroGradient,
    cardGradient,
    iconSurface
  };

  return { ...base, ...overrides };
}

/** @type {Record<WorkspaceThemeKey, WorkspaceThemeTokens>} */
export const WORKSPACE_THEMES = {
  overview: buildTheme('212, 175, 55', 'CEO Overview', {
    accentGlow: 'rgba(212, 175, 55, 0.20)',
    accentSurfaceStrong: 'rgba(212, 175, 55, 0.17)'
  }),
  ma: buildTheme('16, 185, 129', 'M&A'),
  compliance: buildTheme('59, 130, 246', 'Compliance', {
    accentSoft: 'rgba(59, 130, 246, 0.17)',
    accentGlow: 'rgba(59, 130, 246, 0.16)'
  }),
  funding: buildTheme('34, 211, 238', 'Funding', {
    accentGlow: 'rgba(34, 211, 238, 0.18)'
  }),
  governance: buildTheme('168, 85, 247', 'Governance', {
    accentSoft: 'rgba(168, 85, 247, 0.17)',
    accentGlow: 'rgba(168, 85, 247, 0.20)'
  }),
  pmi: buildTheme('249, 115, 22', 'PMI & Synergies', {
    accentGlow: 'rgba(249, 115, 22, 0.20)'
  }),
  bridge: buildTheme('236, 72, 153', 'Bridge', {
    accentSoft: 'rgba(236, 72, 153, 0.17)',
    accentGlow: 'rgba(236, 72, 153, 0.18)'
  }),
  heritage: buildTheme('20, 184, 166', 'Heritage', {
    accentSoft: 'rgba(20, 184, 166, 0.16)',
    accentGlow: 'rgba(20, 184, 166, 0.18)'
  }),
  risk: buildTheme('220, 38, 38', 'Enterprise Risk', {
    accentSoft: 'rgba(220, 38, 38, 0.14)',
    accentGlow: 'rgba(220, 38, 38, 0.12)',
    accentBorder: 'rgba(220, 38, 38, 0.26)',
    accentBorderStrong: 'rgba(220, 38, 38, 0.38)',
    accentSurface: 'rgba(220, 38, 38, 0.08)',
    accentSurfaceStrong: 'rgba(220, 38, 38, 0.11)',
    heroGradient:
      'linear-gradient(135deg, rgba(220, 38, 38, 0.12) 0%, #0a0406 52%, #080707 100%)',
    cardGradient:
      'linear-gradient(145deg, rgba(220, 38, 38, 0.08) 0%, #0a0908 58%, #050404 100%)',
    iconSurface:
      'linear-gradient(135deg, rgba(220, 38, 38, 0.16), rgba(220, 38, 38, 0.05))'
  }),
  reporting: buildTheme('100, 149, 237', 'Reporting', {
    accentSoft: 'rgba(100, 149, 237, 0.16)',
    accentGlow: 'rgba(100, 149, 237, 0.15)'
  }),
  strategy: buildTheme('99, 102, 241', 'Strategy', {
    accentSoft: 'rgba(99, 102, 241, 0.17)',
    accentGlow: 'rgba(99, 102, 241, 0.18)'
  })
};

export const WORKSPACE_THEME_KEYS = Object.keys(WORKSPACE_THEMES);

/**
 * @param {string} [key]
 * @returns {WorkspaceThemeTokens}
 */
export function getWorkspaceTheme(key) {
  return WORKSPACE_THEMES[key] || WORKSPACE_THEMES.overview;
}

/**
 * CSS custom properties for shell / sidebar / rail (also aliases legacy --workspace-* names).
 * @param {string} [key]
 * @returns {Record<string, string>}
 */
export function getWorkspaceThemeCssVars(key) {
  const theme = getWorkspaceTheme(key);

  return {
    '--ws-accent': theme.accent,
    '--ws-accent-soft': theme.accentSoft,
    '--ws-accent-glow': theme.accentGlow,
    '--ws-accent-border': theme.accentBorder,
    '--ws-border': theme.accentBorder,
    '--ws-border-strong': theme.accentBorderStrong,
    '--ws-accent-text': theme.accentText,
    '--ws-text': theme.accentText,
    '--ws-chart-accent': theme.chartAccent,
    '--ws-chart': theme.chartAccent,
    '--ws-accent-rgb': theme.rgb,
    '--ws-rgb': theme.rgb,
    '--ws-surface': theme.accentSurface,
    '--ws-surface-strong': theme.accentSurfaceStrong,
    '--ws-glow': theme.accentGlow,
    '--ws-hero-gradient': theme.heroGradient,
    '--ws-card-gradient': theme.cardGradient,
    '--ws-icon-surface': theme.iconSurface,
    '--workspace-accent': theme.accent,
    '--workspace-accent-soft': theme.accentSoft,
    '--workspace-accent-glow': theme.accentGlow
  };
}
