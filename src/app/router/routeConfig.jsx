import React from 'react';
import {
  Activity,
  BarChart3,
  Calculator,
  CheckCheck,
  ClipboardCheck,
  FileBadge,
  FileSearch,
  FolderKanban,
  FolderLock,
  FolderOpen,
  Gem,
  GitBranch,
  Landmark,
  Layers3,
  LineChart,
  Map,
  Network,
  PieChart,
  Radar,
  Rocket,
  Scale,
  ScrollText,
  ShieldAlert,
  Sparkles,
  Target,
  TrendingUp,
  Users
} from 'lucide-react';

export const routeGroups = {
  overview: {
    label: 'Executive OS',
    items: [
      {
        to: '/dashboard',
        label: 'Executive Overview',
        icon: <Sparkles size={18} />
      }
    ]
  },

  ma: {
    label: 'M&A',
    items: [
      {
        to: '/ma/dashboard',
        label: 'Executive Dashboard',
        icon: <Calculator size={18} />
      },
      {
        to: '/ma/valuation',
        label: 'Valuation Engine',
        icon: <BarChart3 size={18} />
      },
      {
        to: '/ma/pipeline',
        label: 'Deal Pipeline',
        icon: <Layers3 size={18} />
      },
      {
        to: '/ma/waterfall',
        label: 'Deal Waterfall',
        icon: <BarChart3 size={18} />
      },
      {
        to: '/ma/matching',
        label: 'Buyer Matching',
        icon: <Users size={18} />
      },
      {
        to: '/ma/cim',
        label: 'CIM Executive',
        icon: <FileSearch size={18} />
      },
      {
        to: '/ma/deals',
        label: 'Deal Repository',
        icon: <FolderOpen size={18} />
      },
      {
        to: '/ma/data-room',
        label: 'Data Room',
        icon: <FolderLock size={18} />
      }
    ]
  },

  compliance: {
    label: 'Compliance',
    items: [
      {
        to: '/compliance/dashboard',
        label: 'Risk Dashboard',
        icon: <ShieldAlert size={18} />
      },
      {
        to: '/compliance/audit-runs',
        label: 'Audit Ledger',
        icon: <FileBadge size={18} />
      },
      {
        to: '/compliance/suppliers',
        label: 'Supplier Registry',
        icon: <Users size={18} />
      },
      {
        to: '/compliance/risk-map',
        label: 'Risk Map',
        icon: <Map size={18} />
      },
      {
        to: '/compliance/alerts',
        label: 'Risk Alerts',
        icon: <ShieldAlert size={18} />
      },
      {
        to: '/compliance/evidence',
        label: 'Evidence Hub',
        icon: <FileBadge size={18} />
      },
      {
        to: '/compliance/reviews',
        label: 'Human Review',
        icon: <CheckCheck size={18} />
      },
      {
        to: '/compliance/reports',
        label: 'Compliance Reports',
        icon: <FileSearch size={18} />
      }
    ]
  },

  funding: {
    label: 'Funding',
    items: [
      {
        to: '/funding/dashboard',
        label: 'Funding Dashboard',
        icon: <Landmark size={18} />
      },
      {
        to: '/funding/readiness',
        label: 'Investor Readiness',
        icon: <Rocket size={18} />
      },
      {
        to: '/funding/capital-structure',
        label: 'Capital Structure',
        icon: <PieChart size={18} />
      },
      {
        to: '/funding/scenarios',
        label: 'Funding Scenarios',
        icon: <LineChart size={18} />
      },
      {
        to: '/funding/data-room',
        label: 'Investor Data Room',
        icon: <FolderKanban size={18} />
      }
    ]
  },

  pmi: {
    label: 'PMI',
    items: [
      {
        to: '/pmi/dashboard',
        label: 'PMI & Synergies',
        icon: <Activity size={18} />
      },
      {
        to: '/pmi/programs',
        label: 'Programs',
        icon: <Layers3 size={18} />
      },
      {
        to: '/pmi/synergies',
        label: 'Synergies',
        icon: <TrendingUp size={18} />
      },
      {
        to: '/pmi/milestones',
        label: 'Milestones',
        icon: <CheckCheck size={18} />
      },
      {
        to: '/pmi/risks',
        label: 'Risks',
        icon: <ShieldAlert size={18} />
      },
      {
        to: '/pmi/day-100',
        label: '100-Day Plan',
        icon: <Rocket size={18} />
      },
      {
        to: '/pmi/reports',
        label: 'PMI Reports',
        icon: <FileSearch size={18} />
      }
    ]
  },

  governance: {
    label: 'Governance & ESG',
    items: [
      {
        to: '/governance/dashboard',
        label: 'Dashboard',
        icon: <Scale size={18} />
      },
      {
        to: '/governance/decisions',
        label: 'Decision Register',
        icon: <ClipboardCheck size={18} />
      },
      {
        to: '/governance/board-packs',
        label: 'Board Packs',
        icon: <FileSearch size={18} />
      },
      {
        to: '/governance/committees',
        label: 'Committees',
        icon: <Users size={18} />
      },
      {
        to: '/governance/policies',
        label: 'Policies',
        icon: <FileBadge size={18} />
      },
      {
        to: '/governance/actions',
        label: 'Action Tracker',
        icon: <CheckCheck size={18} />
      },
      {
        to: '/governance/meetings',
        label: 'Meetings',
        icon: <FolderKanban size={18} />
      },
      {
        to: '/governance/reports',
        label: 'Reports',
        icon: <FileSearch size={18} />
      },
      {
        to: '/governance/audit-trail',
        label: 'Audit Trail',
        icon: <ScrollText size={18} />
      }
    ]
  },

  heritage: {
    label: 'Heritage & Legacy',
    items: [
      {
        to: '/heritage/dashboard',
        label: 'Dashboard',
        icon: <Gem size={18} />
      },
      {
        to: '/heritage/assets',
        label: 'Asset Register',
        icon: <Landmark size={18} />
      },
      {
        to: '/heritage/successions',
        label: 'Succession',
        icon: <Users size={18} />
      },
      {
        to: '/heritage/protections',
        label: 'Protection',
        icon: <ShieldAlert size={18} />
      },
      {
        to: '/heritage/documents',
        label: 'Evidence',
        icon: <FileBadge size={18} />
      },
      {
        to: '/heritage/reports',
        label: 'Reports',
        icon: <FileSearch size={18} />
      },
      {
        to: '/heritage/audit-trail',
        label: 'Audit Trail',
        icon: <ScrollText size={18} />
      }
    ]
  },

  bridge: {
    label: 'Bridge',
    items: [
      {
        to: '/bridge/dashboard',
        label: 'Bridge Dashboard',
        icon: <Network size={18} />
      },
      {
        to: '/bridge/signals',
        label: 'Signals',
        icon: <Activity size={18} />
      },
      {
        to: '/bridge/dependencies',
        label: 'Dependencies',
        icon: <GitBranch size={18} />
      },
      {
        to: '/bridge/conflicts',
        label: 'Conflicts',
        icon: <ShieldAlert size={18} />
      },
      {
        to: '/bridge/attention-queue',
        label: 'Attention Queue',
        icon: <ClipboardCheck size={18} />
      },
      {
        to: '/bridge/reports',
        label: 'Bridge Reports',
        icon: <FileSearch size={18} />
      }
    ]
  },

  risk: {
    label: 'Enterprise Risk',
    items: [
      {
        to: '/risk/dashboard',
        label: 'Risk Dashboard',
        icon: <Radar size={18} />
      },
      {
        to: '/risk/register',
        label: 'Risk Register',
        icon: <ShieldAlert size={18} />
      },
      {
        to: '/risk/heatmap',
        label: 'Heatmap',
        icon: <Map size={18} />
      },
      {
        to: '/risk/controls',
        label: 'Controls',
        icon: <CheckCheck size={18} />
      },
      {
        to: '/risk/mitigations',
        label: 'Mitigations',
        icon: <ClipboardCheck size={18} />
      },
      {
        to: '/risk/incidents',
        label: 'Incidents',
        icon: <ShieldAlert size={18} />
      },
      {
        to: '/risk/kri',
        label: 'KRI Tracker',
        icon: <LineChart size={18} />
      },
      {
        to: '/risk/appetite',
        label: 'Risk Appetite',
        icon: <Scale size={18} />
      },
      {
        to: '/risk/reports',
        label: 'Reports',
        icon: <FileSearch size={18} />
      },
      {
        to: '/risk/committee-reviews',
        label: 'Committee Reviews',
        icon: <Users size={18} />
      },
      {
        to: '/risk/evidence',
        label: 'Evidence Links',
        icon: <FileBadge size={18} />
      },
      {
        to: '/risk/notifications',
        label: 'Notifications',
        icon: <Activity size={18} />
      }
    ]
  },

  reporting: {
    label: 'Reporting',
    items: [
      { to: '/reporting/dashboard', label: 'Dashboard', icon: <FileSearch size={18} /> },
      { to: '/reporting/library', label: 'Report Library', icon: <FolderOpen size={18} /> },
      { to: '/reporting/templates', label: 'Templates', icon: <FileBadge size={18} /> },
      { to: '/reporting/board-pack', label: 'Board Pack', icon: <ClipboardCheck size={18} /> },
      { to: '/reporting/exports', label: 'Export Ledger', icon: <ScrollText size={18} /> },
      { to: '/reporting/schedules', label: 'Schedules', icon: <Activity size={18} /> },
      { to: '/reporting/evidence', label: 'Evidence', icon: <CheckCheck size={18} /> }
    ]
  },

  strategy: {
    label: 'Strategy',
    items: [
      { to: '/strategy/dashboard', label: 'Dashboard', icon: <Sparkles size={18} /> },
      { to: '/strategy/objectives', label: 'Objectives', icon: <Target size={18} /> },
      { to: '/strategy/initiatives', label: 'Initiatives', icon: <Rocket size={18} /> },
      { to: '/strategy/scenarios', label: 'Scenarios', icon: <LineChart size={18} /> },
      { to: '/strategy/market-notes', label: 'Market Notes', icon: <FileSearch size={18} /> },
      { to: '/strategy/risks', label: 'Strategic Risks', icon: <ShieldAlert size={18} /> },
      { to: '/strategy/reports', label: 'Reports', icon: <FileBadge size={18} /> }
    ]
  }
};

export const pageMetaMap = {
  '/dashboard': {
    title: 'Executive Command Center',
    description:
      'Decision support layer for enterprise leadership.'
  },

  '/overview': {
    title: 'Executive Command Center',
    description:
      'Capa ejecutiva superior de CEO’s OS: señales clave de M&A, Compliance, Funding, PMI y ramas enterprise en una única vista de decisión.'
  },

  '/ceo/overview': {
    title: 'Executive Command Center',
    description:
      'Capa ejecutiva superior de CEO’s OS: señales clave de M&A, Compliance, Funding, PMI y ramas enterprise en una única vista de decisión.'
  },

  '/ma/dashboard': {
    title: 'M&A Executive Dashboard',
    description:
      'Vista ejecutiva del deal: valoración, calidad del activo, riesgos principales y señales clave para la toma de decisión.'
  },

  '/ma/pipeline': {
    title: 'M&A Deal Pipeline',
    description:
      'Vista enterprise del pipeline M&A por fases: screening, NDA, due diligence, comité de inversión, negociación y cierre.'
  },

  '/ma/valuation': {
    title: 'Valuation Engine',
    description:
      'Motor de valoración M&A con inputs financieros, EBITDA normalizado, múltiplo ajustado, scoring de calidad y equity value.'
  },

  '/ma/waterfall': {
    title: 'Deal Waterfall',
    description:
      'Puente financiero desde Enterprise Value hasta Net Proceeds, incluyendo deuda neta, working capital, fees, impuestos y caja final para accionistas.'
  },

  '/ma/matching': {
    title: 'Buyer Matching',
    description:
      'Análisis del encaje de compradores potenciales según perfil financiero, riesgo, transferibilidad y lógica estratégica del activo.'
  },

  '/ma/cim': {
    title: 'CIM Executive',
    description:
      'Resumen ejecutivo exportable para presentar la oportunidad de inversión de forma clara, estructurada y profesional.'
  },

  '/ma/deals': {
    title: 'Deal Repository',
    description:
      'Repositorio de casos M&A guardados, con persistencia backend, recuperación de escenarios y continuidad del análisis.'
  },

  '/ma/data-room': {
    title: 'M&A Data Room',
    description:
      'Capa enterprise de distribucion controlada para documentos M&A, secure shares, clasificacion, revocacion y trazabilidad.'
  },

  '/compliance/dashboard': {
    title: 'Supply Chain Compliance Dashboard',
    description:
      'Vista ejecutiva de proveedores, alertas, evidencias, revisiones humanas y exposición general de la cadena de suministro.'
  },

  '/compliance/audit-runs': {
    title: 'Compliance Audit Ledger',
    description:
      'Historial enterprise de auditorías deterministas, evidencias citadas y exportación JSON firmada para auditores externos.'
  },

  '/compliance/suppliers': {
    title: 'Supplier Registry',
    description:
      'Registro centralizado de proveedores con segmentación, criticidad, spend, scoring de riesgo y resiliencia operativa.'
  },

  '/compliance/suppliers/:id': {
    title: 'Supplier Intelligence File',
    description:
      'Ficha individual del proveedor con riesgo, resiliencia, alertas asociadas, evidencias, revisiones humanas y timeline de actividad.'
  },

  '/compliance/risk-map': {
    title: 'Supply Chain Risk Map',
    description:
      'Mapa de exposición por región, proveedores críticos, alertas severas, spend expuesto y resiliencia de la cartera.'
  },

  '/compliance/alerts': {
    title: 'Risk Alerts',
    description:
      'Monitorización de hallazgos, señales de riesgo, incidencias abiertas y flujo de validación hacia revisión humana.'
  },

  '/compliance/evidence': {
    title: 'Evidence Hub',
    description:
      'Centro de evidencias con fuente, extracto, idioma, confianza, proveedor asociado y trazabilidad documental para soporte DSS.'
  },

  '/compliance/reviews': {
    title: 'Human Review Workflow',
    description:
      'Cola de revisión humana para validar, descartar o solicitar más evidencia antes de cerrar una decisión de compliance.'
  },

  '/compliance/reports': {
    title: 'Compliance Reports',
    description:
      'Generación de informes ejecutivos DSS con proveedor, alertas, evidencias, revisión humana y recomendaciones defendibles.'
  },

  '/funding/dashboard': {
    title: 'Funding Dashboard',
    description:
      'Resumen ejecutivo de financiación: runway, preparación del proceso, necesidades de capital y lectura inicial de readiness.'
  },

  '/funding/readiness': {
    title: 'Investor Readiness',
    description:
      'Checklist operativo para preparar la empresa antes de salir al mercado de deuda, equity, inversores o financiación estructurada.'
  },

  '/funding/capital-structure': {
    title: 'Capital Structure',
    description:
      'Análisis de estructura de capital, cap table actual, escenario post-ronda, dilución estimada y equilibrio deuda-equity.'
  },

  '/funding/scenarios': {
    title: 'Funding Scenarios',
    description:
      'Escenarios low, base y high para estimar capital a levantar, dilución, runway, hitos y sensibilidad de la operación.'
  },

  '/funding/data-room': {
    title: 'Investor Data Room',
    description:
      'Checklist documental para inversores, bancos o partners financieros con preparación de materiales clave para funding.'
  },

  '/pmi/dashboard': {
    title: 'PMI & Synergies Command Center',
    description:
      'Capa post-adquisición para controlar integración, sinergias, workstreams, riesgos y ejecución 30-60-90.'
  },

  '/governance/dashboard': {
    title: 'Governance Command Center',
    description:
      'Rama enterprise para decisiones ejecutivas, board packs, comites, politicas, acciones, actas y reporting de gobierno corporativo.'
  },

  '/governance/decisions': {
    title: 'Decision Register',
    description: 'Registro de decisiones ejecutivas con workflow de revision, aprobacion, rechazo, diferimiento, escalado e implementacion.'
  },

  '/governance/board-packs': {
    title: 'Governance Board Packs',
    description: 'Agenda, resumen ejecutivo, decisiones clave, riesgos, highlights y evidencias para readiness de consejo.'
  },

  '/governance/committees': {
    title: 'Governance Committees',
    description: 'Gestion de comites, miembros, cadencia, proximas reuniones, scope y decisiones vinculadas.'
  },

  '/governance/policies': {
    title: 'Governance Policies',
    description: 'Registro de politicas corporativas, revision, evidencia requerida, controles y riesgo por vencimiento.'
  },

  '/governance/actions': {
    title: 'Governance Action Tracker',
    description: 'Seguimiento de acciones, owners, deadlines, escalaciones, bloqueos y evidencia de cierre.'
  },

  '/governance/meetings': {
    title: 'Governance Meetings',
    description: 'Meeting minutes lite para agenda, asistentes, decisiones, acciones y resumen de acta.'
  },

  '/governance/reports': {
    title: 'Governance Reports',
    description: 'Board pack, decision memo, action tracker, policy summary, risk brief, readiness snapshot y audit summary.'
  },

  '/governance/security-audit': {
    title: 'Governance Audit Trail',
    description:
      'Registro de eventos de auditoría de la organización (M&A, autenticación y más) con exportación CSV.'
  },

  '/governance/audit-trail': {
    title: 'Governance Audit Trail',
    description:
      'Registro de eventos de auditoria governance con trazabilidad de decisiones, aprobaciones, politicas, acciones, meetings y reports.'
  },

  '/heritage/dashboard': {
    title: 'Heritage Command Center',
    description:
      'Rama enterprise para patrimonio, sucesion, proteccion de activos, evidencia, continuidad del owner y readiness de consejo.'
  },

  '/heritage/assets': {
    title: 'Heritage Asset Register',
    description: 'Registro patrimonial con owner, jurisdiccion, liquidez, riesgo, proteccion y valor estimado.'
  },

  '/heritage/successions': {
    title: 'Heritage Succession Planning',
    description: 'Protocolos de continuidad, successor readiness, evidencia y fechas efectivas.'
  },

  '/heritage/protections': {
    title: 'Heritage Protection Controls',
    description: 'Controles legales, fiscales, aseguradores y de gobierno para proteccion de activos.'
  },

  '/heritage/documents': {
    title: 'Heritage Evidence Register',
    description: 'Registro documental confidencial para evidencias patrimoniales, sucesion y continuidad.'
  },

  '/heritage/reports': {
    title: 'Heritage Continuity Reports',
    description: 'Informes ejecutivos para board readiness, continuidad patrimonial y riesgos del owner.'
  },

  '/heritage/audit-trail': {
    title: 'Heritage Audit Trail',
    description: 'Trazabilidad de cambios y eventos de Heritage por organizacion.'
  },

  '/bridge/dashboard': {
    title: 'Enterprise Bridge',
    description:
      'Capa transversal para señales cross-module, dependencias, conflictos, evidencias y atención ejecutiva.'
  },

  '/risk/dashboard': {
    title: 'Enterprise Risk Command Center',
    description:
      'Registro transversal de riesgos, heatmap, controles, mitigaciones, incidentes, KRIs, appetite y señales ejecutivas.'
  },

  '/risk/register': {
    title: 'Enterprise Risk Register',
    description:
      'Riesgos por categoría, severidad inherente, probabilidad, impacto, residual, owner, mitigación y revisión.'
  },

  '/risk/heatmap': {
    title: 'Risk Heatmap',
    description: 'Mapa de riesgo por probabilidad e impacto con filtros por categoría, owner y estado.'
  },

  '/risk/controls': {
    title: 'Controls Library',
    description: 'Biblioteca de controles, evidencia, frecuencia, pruebas y efectividad.'
  },

  '/risk/mitigations': {
    title: 'Mitigation Plans',
    description: 'Planes de mitigación con owners, deadlines, progreso, bloqueos y estado.'
  },

  '/risk/incidents': {
    title: 'Incident Log',
    description: 'Registro de incidentes, severidad, área impactada, resolución, causa raíz y riesgo asociado.'
  },

  '/risk/kri': {
    title: 'KRI Tracker',
    description: 'Indicadores clave de riesgo con umbrales, valores actuales, breaches y tendencia.'
  },

  '/risk/appetite': {
    title: 'Risk Appetite',
    description: 'Declaraciones de appetite, métricas, umbrales, manejo de breaches y owners.'
  },

  '/risk/reports': {
    title: 'Risk Reports',
    description: 'Enterprise Risk Brief, Risk Committee Pack, Control Effectiveness Report e Incident Summary.'
  },

  '/risk/committee-reviews': {
    title: 'Risk Committee Reviews',
    description: 'Revisiones formales del comité de riesgos, agendas, decisiones, actas y paquetes board-ready.'
  },

  '/risk/evidence': {
    title: 'Risk Evidence Links',
    description: 'Evidencias enlazadas, calidad, fuente, reviewer y estado de revisión humana.'
  },

  '/risk/notifications': {
    title: 'Executive Risk Notifications',
    description: 'Cola trazable de notificaciones y escalaciones de riesgo hacia ejecutivos y comité.'
  },

  '/reporting/dashboard': {
    title: 'Enterprise Reporting Command Center',
    description: 'Centro transversal de informes, board packs, plantillas, export ledger, versioning y evidencias.'
  },

  '/reporting/library': {
    title: 'Report Library',
    description: 'Biblioteca central por módulo, tipo, estado, owner, versión, export y completitud de evidencia.'
  },

  '/reporting/templates': {
    title: 'Template Manager',
    description: 'Plantillas, estructura, secciones requeridas y evidencia requerida por módulo.'
  },

  '/reporting/board-pack': {
    title: 'Board Pack Builder',
    description: 'Constructor de board packs con resumen ejecutivo, decisiones, riesgos y highlights cross-module.'
  },

  '/reporting/exports': {
    title: 'Export Ledger',
    description: 'Ledger de exportaciones con checksum, destino, confidencialidad y trazabilidad.'
  },

  '/reporting/schedules': {
    title: 'Scheduled Reports',
    description: 'Programación básica de informes recurrentes, owners, next run, estado y template.'
  },

  '/reporting/evidence': {
    title: 'Evidence-backed Reports',
    description: 'Evidencias enlazadas, missing evidence, calidad y revisión humana requerida.'
  },

  '/strategy/dashboard': {
    title: 'Strategy Command Center',
    description: 'Planificacion estrategica, objetivos, iniciativas, escenarios, riesgos y reporting ejecutivo.'
  },

  '/strategy/objectives': {
    title: 'Strategic Objectives',
    description: 'Objetivos por horizonte, prioridad, owner, metricas, modulo vinculado y decision de board.'
  },

  '/strategy/initiatives': {
    title: 'Strategic Initiatives',
    description: 'Iniciativas con progreso, bloqueos, dependencias, capital necesario, funding y riesgos vinculados.'
  },

  '/strategy/scenarios': {
    title: 'Strategic Scenarios',
    description: 'Escenarios, assumptions, upside, downside, capital impact, risk impact y confianza.'
  },

  '/strategy/market-notes': {
    title: 'Market Notes',
    description: 'Notas competitivas, senales de mercado, implicacion, fuente/evidencia y confianza.'
  },

  '/strategy/risks': {
    title: 'Strategic Risks',
    description: 'Riesgos estrategicos, impacto, mitigacion y vinculacion con enterprise risk.'
  },

  '/strategy/reports': {
    title: 'Strategy Reports',
    description: 'Strategy Board Memo, Scenario Pack, Execution Report y Capital Allocation Memo.'
  }
};
