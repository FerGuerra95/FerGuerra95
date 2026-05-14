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
  Landmark,
  Layers3,
  LineChart,
  Map,
  Network,
  PieChart,
  Rocket,
  Scale,
  ScrollText,
  ShieldAlert,
  Sparkles,
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
    label: 'The Bridge',
    items: [
      {
        to: '/bridge/dashboard',
        label: 'Bridge Marketplace',
        icon: <Network size={18} />
      }
    ]
  }
};

export const pageMetaMap = {
  '/dashboard': {
    title: 'Executive Command Center',
    description:
      'Capa ejecutiva superior de CEO’s OS: señales clave de M&A, Compliance, Funding, PMI y ramas enterprise en una única vista de decisión.'
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
    title: 'The Bridge Marketplace',
    description:
      'Capa futura de red para conectar oportunidades M&A y Funding con inversores, compradores y capital verificado.'
  }
};
