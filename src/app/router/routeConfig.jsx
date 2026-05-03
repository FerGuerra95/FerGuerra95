import React from 'react';
import {
  Activity,
  BarChart3,
  Calculator,
  CheckCheck,
  FileBadge,
  FileSearch,
  FolderKanban,
  FolderOpen,
  Landmark,
  Layers3,
  LineChart,
  Map,
  PieChart,
  Rocket,
  ShieldAlert,
  Sparkles,
  Users
} from 'lucide-react';

export const routeGroups = {
  overview: {
    label: 'Executive OS',
    items: [
      {
        to: '/overview',
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
  }
};

export const pageMetaMap = {
  '/overview': {
    title: 'Executive Command Center',
    description:
      'Capa ejecutiva superior de CEO’s OS: señales clave de M&A, Compliance y Funding en una única vista de decisión.'
  },

  '/ceo/overview': {
    title: 'Executive Command Center',
    description:
      'Capa ejecutiva superior de CEO’s OS: señales clave de M&A, Compliance y Funding en una única vista de decisión.'
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

  '/compliance/dashboard': {
    title: 'Supply Chain Compliance Dashboard',
    description:
      'Vista ejecutiva de proveedores, alertas, evidencias, revisiones humanas y exposición general de la cadena de suministro.'
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
  }
};
