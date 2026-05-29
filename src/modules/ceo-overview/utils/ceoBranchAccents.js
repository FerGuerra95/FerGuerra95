import { WORKSPACE_THEMES } from '../../../shared/config/workspaceTheme.js';

function rgbToHex(rgb) {
  const parts = String(rgb || '')
    .split(',')
    .map((value) => Number(value.trim()));

  if (parts.length !== 3 || parts.some((value) => !Number.isFinite(value))) {
    return '#d4af37';
  }

  return `#${parts
    .map((value) => Math.max(0, Math.min(255, Math.round(value))))
    .map((value) => value.toString(16).padStart(2, '0'))
    .join('')}`;
}

/** Web workspace accent hex — single source via WORKSPACE_THEMES */
export const CEO_BRANCH_ACCENT_HEX = {
  overview: rgbToHex(WORKSPACE_THEMES.overview.rgb),
  ma: rgbToHex(WORKSPACE_THEMES.ma.rgb),
  compliance: rgbToHex(WORKSPACE_THEMES.compliance.rgb),
  funding: rgbToHex(WORKSPACE_THEMES.funding.rgb),
  governance: rgbToHex(WORKSPACE_THEMES.governance.rgb),
  pmi: rgbToHex(WORKSPACE_THEMES.pmi.rgb),
  bridge: rgbToHex(WORKSPACE_THEMES.bridge.rgb),
  heritage: rgbToHex(WORKSPACE_THEMES.heritage.rgb),
  risk: rgbToHex(WORKSPACE_THEMES.risk.rgb),
  reporting: rgbToHex(WORKSPACE_THEMES.reporting.rgb),
  strategy: rgbToHex(WORKSPACE_THEMES.strategy.rgb),
  legal: rgbToHex(WORKSPACE_THEMES.compliance.rgb),
  financial: rgbToHex(WORKSPACE_THEMES.ma.rgb),
  ops: rgbToHex(WORKSPACE_THEMES.pmi.rgb),
  esg: rgbToHex(WORKSPACE_THEMES.governance.rgb)
};

export function getCeoBranchAccentHex(key) {
  return CEO_BRANCH_ACCENT_HEX[key] || CEO_BRANCH_ACCENT_HEX.overview;
}
