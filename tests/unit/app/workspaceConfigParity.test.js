import { describe, expect, it } from 'vitest';

import { WORKSPACE_SHELL_TITLES } from '../../../src/app/layout/shellMeta.js';
import { routeGroups } from '../../../src/app/router/routeConfig.jsx';
import {
  WORKSPACES,
  WORKSPACE_ORDER
} from '../../../src/app/router/workspaceConfig.jsx';
import { WORKSPACE_THEMES } from '../../../src/shared/config/workspaceTheme.js';

function collectNavPaths(groups) {
  const paths = [];
  for (const group of Object.values(groups)) {
    if (!group?.items) continue;
    for (const item of group.items) {
      if (item?.to) paths.push(item.to);
    }
  }
  return paths;
}

describe('workspaceConfig parity (A.1.3b)', () => {
  const workspaceKeys = WORKSPACES.map((w) => w.key);
  const routeGroupKeys = Object.keys(routeGroups);
  const themeKeys = Object.keys(WORKSPACE_THEMES);
  const shellTitleKeys = Object.keys(WORKSPACE_SHELL_TITLES);

  it('aligns WORKSPACES keys with routeGroups keys', () => {
    expect(new Set(routeGroupKeys)).toEqual(new Set(workspaceKeys));
    expect(routeGroupKeys.length).toBe(workspaceKeys.length);
  });

  it('aligns WORKSPACES keys with WORKSPACE_THEMES keys', () => {
    expect(new Set(themeKeys)).toEqual(new Set(workspaceKeys));
  });

  it('aligns WORKSPACES keys with WORKSPACE_SHELL_TITLES keys', () => {
    expect(new Set(shellTitleKeys)).toEqual(new Set(workspaceKeys));
  });

  it('places each workspace.path in routeGroups[key].items', () => {
    for (const workspace of WORKSPACES) {
      const group = routeGroups[workspace.key];
      expect(group, `routeGroups missing key ${workspace.key}`).toBeTruthy();
      const paths = (group.items || []).map((item) => item.to);
      expect(paths).toContain(workspace.path);
    }
  });

  it('keeps WORKSPACE_ORDER aligned with WORKSPACES key order (sidebar / rail contract)', () => {
    expect(WORKSPACE_ORDER).toEqual(workspaceKeys);
  });

  it('includes heritage in all workspace maps', () => {
    expect(workspaceKeys).toContain('heritage');
    expect(routeGroups.heritage).toBeTruthy();
    expect(WORKSPACE_THEMES.heritage).toBeTruthy();
    expect(WORKSPACE_SHELL_TITLES.heritage).toBeTruthy();
  });

  it('does not list /bridge/marketplace in routeGroups nav items', () => {
    const navPaths = collectNavPaths(routeGroups);
    expect(navPaths).not.toContain('/bridge/marketplace');
  });
});
