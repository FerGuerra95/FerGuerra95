import React, { createContext, useContext, useMemo, useState } from 'react';

const PMIStoreContext = createContext(null);

const DEMO_PMI_CASE = {
  dealName: 'Iberia Industrial Services Integration',
  buyerName: 'Strategic Industrial Group',
  targetName: 'Iberia Industrial Services',
  closingDate: '2026-06-30',
  integrationDay: 42,
  synergyTarget: 4200000,
  synergyCaptured: 1450000,
  integrationBudget: 1800000,
  integrationCostUsed: 520000,
  currency: 'EUR',
  status: 'Active integration',
  workstreams: [
    {
      id: 'operations',
      name: 'Operations integration',
      owner: 'COO Office',
      progress: 62,
      risk: 'Medium',
      priority: 'High',
      summary: 'Normalizar procesos operativos, proveedores críticos y continuidad de servicio.'
    },
    {
      id: 'finance',
      name: 'Finance & reporting',
      owner: 'CFO Office',
      progress: 74,
      risk: 'Low',
      priority: 'High',
      summary: 'Unificar reporting, cash control, KPIs y control presupuestario post-cierre.'
    },
    {
      id: 'people',
      name: 'People & culture',
      owner: 'HR Lead',
      progress: 48,
      risk: 'Medium',
      priority: 'Medium',
      summary: 'Retención de talento clave, comunicación interna y estructura organizativa.'
    },
    {
      id: 'systems',
      name: 'Systems & data',
      owner: 'Technology Lead',
      progress: 36,
      risk: 'High',
      priority: 'High',
      summary: 'Migración de datos, accesos, seguridad, integraciones y continuidad tecnológica.'
    }
  ],
  risks: [
    {
      id: 'systems-delay',
      title: 'Systems migration delay',
      severity: 'High',
      owner: 'Technology Lead',
      mitigation: 'Crear plan paralelo de datos críticos y congelar cambios no esenciales.'
    },
    {
      id: 'supplier-dependency',
      title: 'Supplier dependency concentration',
      severity: 'Medium',
      owner: 'Operations',
      mitigation: 'Mapear proveedores críticos y activar plan de continuidad.'
    },
    {
      id: 'retention',
      title: 'Key talent retention',
      severity: 'Medium',
      owner: 'HR Lead',
      mitigation: 'Identificar perfiles clave y lanzar plan de comunicación y retención.'
    }
  ],
  milestones: [
    {
      id: 'day1',
      label: 'Day 1',
      title: 'Control & communication',
      status: 'Completed',
      progress: 100,
      summary: 'Comunicación inicial, governance, accesos críticos y control operativo.'
    },
    {
      id: 'day30',
      label: 'Day 30',
      title: 'Stabilize operations',
      status: 'Completed',
      progress: 100,
      summary: 'Primer mapa de riesgos, owners, reporting y quick wins.'
    },
    {
      id: 'day60',
      label: 'Day 60',
      title: 'Capture early synergies',
      status: 'In progress',
      progress: 58,
      summary: 'Validar sinergias, dependencia de proveedores y plan de sistemas.'
    },
    {
      id: 'day90',
      label: 'Day 90',
      title: 'Board integration review',
      status: 'Pending',
      progress: 24,
      summary: 'Informe a comité con sinergias capturadas, riesgos y próximos hitos.'
    }
  ],
  boardActions: [
    'Validar plan de sistemas y datos antes del día 60.',
    'Cerrar mapa de proveedores críticos y continuidad operativa.',
    'Actualizar forecast de sinergias capturadas vs objetivo.',
    'Preparar Board Integration Memo para revisión ejecutiva.'
  ]
};

export function PMIStoreProvider({ children }) {
  const [pmiCase, setPmiCase] = useState(DEMO_PMI_CASE);

  const value = useMemo(() => ({
    pmiCase,
    setPmiCase
  }), [pmiCase]);

  return (
    <PMIStoreContext.Provider value={value}>
      {children}
    </PMIStoreContext.Provider>
  );
}

export function usePMIStore() {
  const context = useContext(PMIStoreContext);

  if (!context) {
    throw new Error('usePMIStore must be used within PMIStoreProvider');
  }

  return context;
}
