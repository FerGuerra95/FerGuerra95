import React from 'react';
import {
  Calculator,
  FileSearch,
  Landmark,
  Layers3,
  Network,
  Radar,
  Scale,
  ShieldCheck,
  Sparkles,
  Target
} from 'lucide-react';

export const WORKSPACES = [
  {
    key: 'overview',
    label: 'CEO Overview',
    title: 'Executive Command Center',
    description: 'Vista superior de señales ejecutivas, workspaces core y prioridades de decisión.',
    path: '/dashboard',
    sidebarLabel: 'EXECUTIVE OS',
    icon: <Sparkles size={18} />
  },
  {
    key: 'ma',
    label: 'M&A',
    title: 'M&A Intelligence',
    description: 'Valoración, deal design, buyer matching y reporting ejecutivo.',
    path: '/ma/dashboard',
    sidebarLabel: 'M&A',
    icon: <Calculator size={18} />
  },
  {
    key: 'compliance',
    label: 'Compliance',
    title: 'Compliance OS',
    description: 'Proveedores, alertas, evidencias, revisión humana y reportes DSS.',
    path: '/compliance/dashboard',
    sidebarLabel: 'COMPLIANCE',
    icon: <ShieldCheck size={18} />
  },
  {
    key: 'funding',
    label: 'Funding',
    title: 'Funding Studio',
    description: 'Readiness, estructura de capital, escenarios y data room inversor.',
    path: '/funding/dashboard',
    sidebarLabel: 'FUNDING',
    icon: <Landmark size={18} />
  },
  {
    key: 'governance',
    label: 'Governance',
    title: 'Governance',
    description: 'Decisiones ejecutivas, board packs, políticas, comités y trazabilidad de gobierno.',
    path: '/governance/dashboard',
    sidebarLabel: 'GOVERNANCE & ESG',
    icon: <Scale size={18} />
  },
  {
    key: 'pmi',
    label: 'PMI & Synergies',
    title: 'PMI & Synergies',
    description: 'Integración post-adquisición, sinergias, workstreams, riesgos y plan 30-60-90.',
    path: '/pmi/dashboard',
    sidebarLabel: 'PMI',
    icon: <Layers3 size={18} />
  },
  {
    key: 'bridge',
    label: 'Bridge',
    title: 'Enterprise Bridge',
    description: 'Señales, dependencias, conflictos y cola de atención ejecutiva cross-module.',
    path: '/bridge/dashboard',
    sidebarLabel: 'BRIDGE',
    icon: <Network size={18} />
  },
  {
    key: 'risk',
    label: 'Risk',
    title: 'Enterprise Risk',
    description: 'Risk register, heatmap, controles, incidentes, KRIs y appetite para comité.',
    path: '/risk/dashboard',
    sidebarLabel: 'ENTERPRISE RISK',
    icon: <Radar size={18} />
  },
  {
    key: 'reporting',
    label: 'Reporting',
    title: 'Enterprise Reporting',
    description: 'Board packs, report library, export ledger, versioning y evidencias.',
    path: '/reporting/dashboard',
    sidebarLabel: 'REPORTING',
    icon: <FileSearch size={18} />
  },
  {
    key: 'strategy',
    label: 'Strategy',
    title: 'Strategy Execution',
    description: 'Objetivos, iniciativas, escenarios, dependencias de capital y riesgos estratégicos.',
    path: '/strategy/dashboard',
    sidebarLabel: 'STRATEGY',
    icon: <Target size={18} />
  }
];

export const WORKSPACE_ORDER = WORKSPACES.map((workspace) => workspace.key);

export function getWorkspaceByKey(key) {
  return WORKSPACES.find((workspace) => workspace.key === key) || WORKSPACES[0];
}

export function getWorkspaceIndex(key) {
  const index = WORKSPACES.findIndex((workspace) => workspace.key === key);

  return index >= 0 ? index : 0;
}

export function getWorkspaceByPathname(pathname = '') {
  const path = String(pathname || '');

  if (
    path.startsWith('/dashboard') ||
    path.startsWith('/overview') ||
    path.startsWith('/ceo/overview')
  ) {
    return 'overview';
  }

  if (path.startsWith('/compliance')) return 'compliance';
  if (path.startsWith('/funding')) return 'funding';
  if (path.startsWith('/governance')) return 'governance';
  if (path.startsWith('/pmi')) return 'pmi';
  if (path.startsWith('/bridge')) return 'bridge';
  if (path.startsWith('/risk')) return 'risk';
  if (path.startsWith('/reporting')) return 'reporting';
  if (path.startsWith('/strategy')) return 'strategy';
  if (path.startsWith('/ma')) return 'ma';

  return 'overview';
}
