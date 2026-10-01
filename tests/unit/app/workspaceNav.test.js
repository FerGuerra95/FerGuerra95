import { describe, expect, it } from 'vitest';

import {
  getActiveWorkspaceKey,
  getWorkspaceNavItems,
  WORKSPACE_PRIMARY_NAV_PATHS
} from '../../../src/app/navigation/workspaceNav.js';
import { routeGroups } from '../../../src/app/router/routeConfig.jsx';
import { WORKSPACES } from '../../../src/app/router/workspaceConfig.jsx';

describe('workspaceNav', () => {
  it('derives active workspace from route prefixes', () => {
    expect(getActiveWorkspaceKey('/ma/pipeline')).toBe('ma');
    expect(getActiveWorkspaceKey('/compliance/suppliers')).toBe('compliance');
    expect(getActiveWorkspaceKey('/dashboard')).toBe('overview');
  });

  it('returns only M&A primary pages for contextual sidebar', () => {
    const items = getWorkspaceNavItems('ma');
    const paths = items.map((item) => item.to);

    expect(paths).toEqual([
      '/ma/dashboard',
      '/ma/valuation',
      '/ma/pipeline',
      '/ma/deals',
      '/ma/data-room'
    ]);
    expect(paths).not.toContain('/ma/waterfall');
  });

  it('returns all route group items when no primary filter exists', () => {
    const fundingItems = getWorkspaceNavItems('funding');
    expect(fundingItems.length).toBe(routeGroups.funding.items.length);
  });

  it('keeps primary nav paths aligned with routeGroups', () => {
    for (const workspace of WORKSPACES) {
      const primaryPaths = WORKSPACE_PRIMARY_NAV_PATHS[workspace.key];
      if (!primaryPaths) continue;

      const groupPaths = new Set(routeGroups[workspace.key].items.map((item) => item.to));
      for (const path of primaryPaths) {
        expect(groupPaths.has(path), `${workspace.key} missing ${path}`).toBe(true);
      }
    }
  });
});
