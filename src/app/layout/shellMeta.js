import { pageMetaMap } from '../router/routeConfig.jsx';
import { getWorkspaceByKey } from '../router/workspaceConfig.jsx';

/** Topbar branch titles — never product brand. */
export const WORKSPACE_SHELL_TITLES = {
  overview: 'Executive Command Center',
  ma: 'M&A',
  compliance: 'Compliance',
  funding: 'Funding',
  governance: 'Governance',
  pmi: 'PMI & Synergies',
  bridge: 'Bridge',
  risk: 'Risk',
  reporting: 'Reporting',
  strategy: 'Strategy',
  heritage: 'Heritage'
};

function resolvePageMeta(pathname) {
  if (pageMetaMap[pathname]) {
    return pageMetaMap[pathname];
  }

  if (pathname.startsWith('/compliance/suppliers/')) {
    return pageMetaMap['/compliance/suppliers/:id'] || null;
  }

  if (pathname.startsWith('/compliance/audit-runs/')) {
    return (
      pageMetaMap['/compliance/audit-runs/:id'] ||
      pageMetaMap['/compliance/audit-runs'] ||
      null
    );
  }

  if (pathname.startsWith('/governance/decisions/')) {
    return pageMetaMap['/governance/decisions/:id'] || null;
  }

  if (pathname.startsWith('/pmi/programs/')) {
    return pageMetaMap['/pmi/programs/:id'] || null;
  }

  return null;
}

/**
 * Shell topbar copy: branch title + page or workspace description.
 * @param {string} pathname
 * @param {string} workspaceKey
 */
export function getShellTopbarMeta(pathname, workspaceKey) {
  const workspace = getWorkspaceByKey(workspaceKey);
  const pageMeta = resolvePageMeta(pathname);
  const title =
    WORKSPACE_SHELL_TITLES[workspaceKey] || workspace.label || 'Workspace';
  const description =
    pageMeta?.description ||
    workspace.description ||
    'Workspace ejecutivo privado dentro de la suite enterprise.';

  return {
    title,
    description,
    pageLabel: pageMeta?.title || null
  };
}
