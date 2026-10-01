import { routeGroups } from '../router/routeConfig.jsx';
import { getWorkspaceByPathname } from '../router/workspaceConfig.jsx';

/**
 * Primary sidebar pages per workspace — migrated from legacy Sidebar.jsx filter.
 * Workspaces without an entry show all routeGroups items.
 */
export const WORKSPACE_PRIMARY_NAV_PATHS = {
  ma: new Set([
    '/ma/dashboard',
    '/ma/valuation',
    '/ma/pipeline',
    '/ma/deals',
    '/ma/data-room'
  ]),
  compliance: new Set([
    '/compliance/dashboard',
    '/compliance/suppliers',
    '/compliance/risk-map',
    '/compliance/evidence',
    '/compliance/reports'
  ]),
  governance: new Set([
    '/governance/dashboard',
    '/governance/decisions',
    '/governance/board-packs',
    '/governance/policies',
    '/governance/reports'
  ]),
  pmi: new Set([
    '/pmi/dashboard',
    '/pmi/programs',
    '/pmi/synergies',
    '/pmi/milestones',
    '/pmi/risks',
    '/pmi/day-100',
    '/pmi/reports'
  ]),
  bridge: new Set([
    '/bridge/dashboard',
    '/bridge/signals',
    '/bridge/dependencies',
    '/bridge/conflicts',
    '/bridge/attention-queue',
    '/bridge/reports'
  ]),
  risk: new Set([
    '/risk/dashboard',
    '/risk/register',
    '/risk/heatmap',
    '/risk/controls',
    '/risk/incidents',
    '/risk/reports'
  ]),
  reporting: new Set([
    '/reporting/dashboard',
    '/reporting/library',
    '/reporting/board-pack',
    '/reporting/exports',
    '/reporting/evidence'
  ]),
  strategy: new Set([
    '/strategy/dashboard',
    '/strategy/objectives',
    '/strategy/initiatives',
    '/strategy/scenarios',
    '/strategy/reports'
  ]),
  heritage: new Set([
    '/heritage/dashboard',
    '/heritage/assets',
    '/heritage/successions',
    '/heritage/protections',
    '/heritage/documents',
    '/heritage/reports',
    '/heritage/audit-trail'
  ])
};

export function getActiveWorkspaceKey(pathname = '') {
  return getWorkspaceByPathname(pathname);
}

export function getWorkspaceNavItems(workspaceKey) {
  const group = routeGroups[workspaceKey];

  if (!group?.items?.length) {
    return [];
  }

  const primaryPaths = WORKSPACE_PRIMARY_NAV_PATHS[workspaceKey];

  if (!primaryPaths) {
    return group.items;
  }

  return group.items.filter((item) => primaryPaths.has(item.to));
}
