import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import { useAuth } from '../../../app/providers/AuthProvider.jsx';
import { pmiApi } from '../services/pmiApi.js';

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
      summary: 'Normalizar procesos operativos, proveedores criticos y continuidad de servicio.'
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
      summary: 'Retencion de talento clave, comunicacion interna y estructura organizativa.'
    },
    {
      id: 'systems',
      name: 'Systems & data',
      owner: 'Technology Lead',
      progress: 36,
      risk: 'High',
      priority: 'High',
      summary: 'Migracion de datos, accesos, seguridad, integraciones y continuidad tecnologica.'
    }
  ],
  risks: [
    {
      id: 'systems-delay',
      title: 'Systems migration delay',
      severity: 'High',
      owner: 'Technology Lead',
      mitigation: 'Crear plan paralelo de datos criticos y congelar cambios no esenciales.'
    },
    {
      id: 'supplier-dependency',
      title: 'Supplier dependency concentration',
      severity: 'Medium',
      owner: 'Operations',
      mitigation: 'Mapear proveedores criticos y activar plan de continuidad.'
    },
    {
      id: 'retention',
      title: 'Key talent retention',
      severity: 'Medium',
      owner: 'HR Lead',
      mitigation: 'Identificar perfiles clave y lanzar plan de comunicacion y retencion.'
    }
  ],
  milestones: [
    {
      id: 'day1',
      label: 'Day 1',
      title: 'Control & communication',
      status: 'Completed',
      progress: 100,
      summary: 'Comunicacion inicial, governance, accesos criticos y control operativo.'
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
      summary: 'Informe a comite con sinergias capturadas, riesgos y proximos hitos.'
    }
  ],
  synergyLedger: [
    {
      id: 'procurement-savings',
      name: 'Procurement consolidation',
      type: 'Cost',
      owner: 'COO Office',
      workstreamId: 'operations',
      baseline: 900000,
      forecast: 1200000,
      captured: 420000,
      confidence: 78,
      status: 'Capturing',
      dueDate: '2026-08-30'
    },
    {
      id: 'reporting-efficiency',
      name: 'Finance reporting efficiency',
      type: 'Cost',
      owner: 'CFO Office',
      workstreamId: 'finance',
      baseline: 450000,
      forecast: 650000,
      captured: 310000,
      confidence: 84,
      status: 'Validated',
      dueDate: '2026-07-31'
    },
    {
      id: 'cross-sell',
      name: 'Commercial cross-sell pipeline',
      type: 'Revenue',
      owner: 'Revenue Lead',
      workstreamId: 'operations',
      baseline: 0,
      forecast: 1500000,
      captured: 360000,
      confidence: 62,
      status: 'At risk',
      dueDate: '2026-09-30'
    }
  ],
  playbooks: [
    {
      id: 'day1-control',
      label: 'Day 1',
      title: 'Control and continuity',
      owner: 'Integration Lead',
      status: 'Completed',
      checklist: [
        { id: 'communications', label: 'Stakeholder communications released', done: true },
        { id: 'access', label: 'Critical system access validated', done: true },
        { id: 'cash', label: 'Cash controls and signing authorities confirmed', done: true }
      ]
    },
    {
      id: 'day30-stabilize',
      label: 'Day 30',
      title: 'Stabilize the operating model',
      owner: 'PMI Office',
      status: 'In progress',
      checklist: [
        { id: 'owners', label: 'Workstream owners and cadence locked', done: true },
        { id: 'risk-register', label: 'Risk register reviewed by committee', done: true },
        { id: 'synergy-baseline', label: 'Synergy baseline approved by CFO', done: false }
      ]
    },
    {
      id: 'day90-board',
      label: 'Day 90',
      title: 'Board integration review',
      owner: 'CEO Office',
      status: 'Pending',
      checklist: [
        { id: 'memo', label: 'Board Integration Memo drafted', done: false },
        { id: 'next-phase', label: 'Next-phase priorities funded', done: false },
        { id: 'dependencies', label: 'Critical dependencies closed or escalated', done: false }
      ]
    }
  ],
  dependencies: [
    {
      id: 'systems-finance',
      fromWorkstreamId: 'systems',
      toWorkstreamId: 'finance',
      title: 'ERP data model readiness for finance reporting',
      status: 'Blocked',
      severity: 'High',
      owner: 'Technology Lead',
      mitigation: 'Run parallel finance reporting until master data mapping is signed off.'
    },
    {
      id: 'supplier-ops',
      fromWorkstreamId: 'operations',
      toWorkstreamId: 'systems',
      title: 'Supplier master data required for procurement synergies',
      status: 'Monitoring',
      severity: 'Medium',
      owner: 'Operations',
      mitigation: 'Prioritize top 20 supplier records before Day 60.'
    }
  ],
  boardActions: [
    'Validar plan de sistemas y datos antes del dia 60.',
    'Cerrar mapa de proveedores criticos y continuidad operativa.',
    'Actualizar forecast de sinergias capturadas vs objetivo.',
    'Preparar Board Integration Memo para revision ejecutiva.'
  ]
};

const PMI_TEMPLATES = {
  industrial: {
    label: 'Industrial integration',
    workstreams: [
      'Operations integration',
      'Supplier continuity',
      'Finance & reporting',
      'Systems & data'
    ],
    risks: ['Supplier concentration', 'Systems migration delay'],
    synergyTarget: 4200000,
    integrationBudget: 1800000
  },
  saas: {
    label: 'SaaS platform integration',
    workstreams: [
      'Product roadmap',
      'Customer success retention',
      'Cloud & security',
      'Revenue operations'
    ],
    risks: ['ARR churn risk', 'Cloud security gap'],
    synergyTarget: 2600000,
    integrationBudget: 950000
  },
  healthcare: {
    label: 'Healthcare integration',
    workstreams: [
      'Clinical operations',
      'Regulatory continuity',
      'Data privacy',
      'People & retention'
    ],
    risks: ['Regulatory handoff risk', 'Patient data migration'],
    synergyTarget: 3200000,
    integrationBudget: 1400000
  },
  carveout: {
    label: 'Carve-out integration',
    workstreams: [
      'TSA separation',
      'Standalone finance',
      'IT carve-out',
      'Operating model'
    ],
    risks: ['TSA dependency', 'Standalone system readiness'],
    synergyTarget: 3800000,
    integrationBudget: 2200000
  }
};

function createLocalId(prefix) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

function mergeWithDemo(item) {
  return {
    ...DEMO_PMI_CASE,
    ...item
  };
}

function buildTemplateCase(templateKey = 'industrial') {
  const template = PMI_TEMPLATES[templateKey] || PMI_TEMPLATES.industrial;

  const workstreams = template.workstreams.map((name, index) => ({
    id: createLocalId(`template-workstream-${index + 1}`),
    name,
    owner: index === 0 ? 'Integration Lead' : 'PMI Owner',
    progress: 0,
    risk: index === 0 ? 'Medium' : 'Low',
    priority: index < 2 ? 'High' : 'Medium',
    summary: 'Template workstream ready for owner assignment and execution tracking.'
  }));

  return {
    ...DEMO_PMI_CASE,
    id: undefined,
    dealName: template.label,
    status: 'Draft review',
    integrationDay: 0,
    synergyTarget: template.synergyTarget,
    synergyCaptured: 0,
    integrationBudget: template.integrationBudget,
    integrationCostUsed: 0,
    workstreams,
    risks: template.risks.map((title, index) => ({
      id: createLocalId(`template-risk-${index + 1}`),
      title,
      severity: index === 0 ? 'High' : 'Medium',
      status: 'open',
      owner: 'PMI Owner',
      mitigation: 'Define mitigation plan, owner cadence and board escalation threshold.'
    })),
    milestones: [
      {
        id: createLocalId('template-day1'),
        label: 'Day 1',
        title: 'Control & communication',
        status: 'Pending',
        progress: 0,
        summary: 'Confirm governance, critical access and communication plan.'
      },
      {
        id: createLocalId('template-day30'),
        label: 'Day 30',
        title: 'Stabilize integration',
        status: 'Pending',
        progress: 0,
        summary: 'Validate owners, baseline risks and synergy tracking.'
      },
      {
        id: createLocalId('template-day90'),
        label: 'Day 90',
        title: 'Board integration review',
        status: 'Pending',
        progress: 0,
        summary: 'Review captured value, open risks and next phase priorities.'
      }
    ],
    synergyLedger: [
      {
        id: createLocalId('template-synergy-cost'),
        name: 'Cost synergy baseline',
        type: 'Cost',
        owner: 'CFO Office',
        workstreamId: workstreams[0]?.id || '',
        baseline: 0,
        forecast: Math.round(template.synergyTarget * 0.55),
        captured: 0,
        confidence: 55,
        status: 'Baseline',
        dueDate: ''
      },
      {
        id: createLocalId('template-synergy-revenue'),
        name: 'Revenue synergy pipeline',
        type: 'Revenue',
        owner: 'Revenue Lead',
        workstreamId: workstreams[1]?.id || '',
        baseline: 0,
        forecast: Math.round(template.synergyTarget * 0.45),
        captured: 0,
        confidence: 45,
        status: 'Baseline',
        dueDate: ''
      }
    ],
    playbooks: DEMO_PMI_CASE.playbooks.map((item) => ({
      ...item,
      id: createLocalId(`template-${item.id}`),
      status: 'Pending',
      checklist: (item.checklist || []).map((check) => ({
        ...check,
        id: createLocalId(`template-${check.id}`),
        done: false
      }))
    })),
    dependencies: [
      {
        id: createLocalId('template-dependency'),
        fromWorkstreamId: workstreams[0]?.id || '',
        toWorkstreamId: workstreams[1]?.id || '',
        title: 'Critical path dependency',
        status: 'Monitoring',
        severity: 'Medium',
        owner: 'PMI Owner',
        mitigation: 'Define dependency owner, evidence and escalation threshold.'
      }
    ],
    boardActions: [
      'Confirm PMI owner and committee cadence.',
      'Validate integration budget and synergy baseline.',
      'Prepare first Board Integration Memo.'
    ]
  };
}

export function PMIStoreProvider({ children }) {
  const { user } = useAuth();
  const [pmiCase, setPmiCase] = useState(DEMO_PMI_CASE);
  const [pmiCases, setPmiCases] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [backendStatus, setBackendStatus] = useState({
    loading: false,
    error: null,
    hydrated: false
  });
  const autosaveRef = useRef(null);

  useEffect(
    () => () => {
      if (autosaveRef.current) clearTimeout(autosaveRef.current);
    },
    []
  );

  useEffect(() => {
    let cancelled = false;

    async function hydratePmiCase() {
      setBackendStatus({
        loading: true,
        error: null,
        hydrated: false
      });

      try {
        const cases = await pmiApi.listCases();
        if (cancelled) return;

        if (cases[0]) {
          setPmiCases(cases.map(mergeWithDemo));
          setPmiCase(mergeWithDemo(cases[0]));
        } else {
          setPmiCases([]);
        }

        setBackendStatus({
          loading: false,
          error: null,
          hydrated: true
        });
      } catch (error) {
        if (cancelled) return;

        setBackendStatus({
          loading: false,
          error,
          hydrated: false
        });
      }
    }

    hydratePmiCase();

    return () => {
      cancelled = true;
    };
  }, [user?.organizationId]);

  async function savePmiCase(nextCase) {
    if (autosaveRef.current) {
      clearTimeout(autosaveRef.current);
      autosaveRef.current = null;
    }

    setPmiCase(nextCase);

    try {
      const saved = nextCase?.id
        ? await pmiApi.updateCase(nextCase.id, nextCase)
        : await pmiApi.createCase(nextCase);

      if (saved) {
        const merged = mergeWithDemo(saved);
        setPmiCase(merged);
        setPmiCases((items) => {
          const exists = items.some((item) => item.id === merged.id);
          if (exists) {
            return items.map((item) => (item.id === merged.id ? merged : item));
          }
          return [merged, ...items];
        });
      }

      setBackendStatus({
        loading: false,
        error: null,
        hydrated: true
      });

      return saved;
    } catch (error) {
      setBackendStatus({
        loading: false,
        error,
        hydrated: false
      });

      return nextCase;
    }
  }

  function schedulePmiCaseSave(nextCase, delay = 500) {
    setPmiCase(nextCase);

    if (autosaveRef.current) clearTimeout(autosaveRef.current);

    return new Promise((resolve) => {
      autosaveRef.current = setTimeout(async () => {
        autosaveRef.current = null;
        resolve(await savePmiCase(nextCase));
      }, delay);
    });
  }

  function patchPmiCase(patch = {}) {
    const nextCase = {
      ...pmiCase,
      ...patch
    };

    return schedulePmiCaseSave(nextCase);
  }

  async function selectPmiCase(id) {
    if (!id) {
      setPmiCase(DEMO_PMI_CASE);
      return DEMO_PMI_CASE;
    }

    const existing = pmiCases.find((item) => item.id === id);
    if (existing) {
      setPmiCase(existing);
      return existing;
    }

    try {
      const saved = await pmiApi.getCase(id);
      const merged = mergeWithDemo(saved);
      setPmiCase(merged);
      setPmiCases((items) => [merged, ...items.filter((item) => item.id !== merged.id)]);
      return merged;
    } catch (error) {
      setBackendStatus({
        loading: false,
        error,
        hydrated: false
      });
      return pmiCase;
    }
  }

  async function createBlankPmiCase(templateKey = 'industrial') {
    const templateCase = buildTemplateCase(templateKey);
    const created = await savePmiCase(templateCase);

    return created;
  }

  async function duplicatePmiCase(id = pmiCase.id) {
    if (!id) return createBlankPmiCase();

    try {
      const saved = await pmiApi.duplicateCase(id);
      const merged = mergeWithDemo(saved);
      setPmiCase(merged);
      setPmiCases((items) => [merged, ...items]);
      return merged;
    } catch (error) {
      setBackendStatus({
        loading: false,
        error,
        hydrated: false
      });
      return pmiCase;
    }
  }

  async function removePmiCase(id = pmiCase.id) {
    if (!id) return { deleted: false };

    try {
      const result = await pmiApi.deleteCase(id);
      const remaining = pmiCases.filter((item) => item.id !== id);
      setPmiCases(remaining);
      setPmiCase(remaining[0] || DEMO_PMI_CASE);
      return result;
    } catch (error) {
      setBackendStatus({
        loading: false,
        error,
        hydrated: false
      });
      return { deleted: false };
    }
  }

  async function createFromMaDeal(dealId) {
    if (!dealId) return pmiCase;

    try {
      const saved = await pmiApi.createCaseFromMaDeal(dealId);
      const merged = mergeWithDemo(saved);
      setPmiCase(merged);
      setPmiCases((items) => [merged, ...items]);
      return merged;
    } catch (error) {
      setBackendStatus({
        loading: false,
        error,
        hydrated: false
      });
      return pmiCase;
    }
  }

  async function refreshAuditLogs(caseId = pmiCase.id) {
    try {
      const items = await pmiApi.listAuditLogs({
        caseId,
        limit: 80
      });
      setAuditLogs(items);
      return items;
    } catch (error) {
      setAuditLogs([]);
      setBackendStatus((status) => ({
        ...status,
        error
      }));
      return [];
    }
  }

  function updateWorkstream(id, patch = {}) {
    const nextCase = {
      ...pmiCase,
      workstreams: (pmiCase.workstreams || []).map((item) =>
        item.id === id
          ? {
              ...item,
              ...patch
            }
          : item
      )
    };

    return schedulePmiCaseSave(nextCase);
  }

  function addWorkstream(payload = {}) {
    const name = String(payload.name || '').trim();
    if (!name) return Promise.resolve(pmiCase);

    const nextCase = {
      ...pmiCase,
      workstreams: [
        ...(pmiCase.workstreams || []),
        {
          id: createLocalId('workstream'),
          name,
          owner: String(payload.owner || 'PMI Owner').trim() || 'PMI Owner',
          progress: 0,
          risk: 'Medium',
          priority: 'Medium',
          summary: 'New integration workstream.'
        }
      ]
    };

    return schedulePmiCaseSave(nextCase);
  }

  function removeWorkstream(id) {
    const nextCase = {
      ...pmiCase,
      workstreams: (pmiCase.workstreams || []).filter((item) => item.id !== id)
    };

    return schedulePmiCaseSave(nextCase);
  }

  function updateRisk(id, patch = {}) {
    const nextCase = {
      ...pmiCase,
      risks: (pmiCase.risks || []).map((item) =>
        item.id === id
          ? {
              ...item,
              ...patch
            }
          : item
      )
    };

    return savePmiCase(nextCase);
  }

  function addRisk(payload = {}) {
    const title = String(payload.title || '').trim();
    if (!title) return Promise.resolve(pmiCase);

    const nextCase = {
      ...pmiCase,
      risks: [
        ...(pmiCase.risks || []),
        {
          id: createLocalId('risk'),
          title,
          severity: payload.severity || 'Medium',
          status: 'open',
          owner: String(payload.owner || 'PMI Owner').trim() || 'PMI Owner',
          mitigation: 'Define mitigation plan and owner cadence.'
        }
      ]
    };

    return savePmiCase(nextCase);
  }

  function removeRisk(id) {
    const nextCase = {
      ...pmiCase,
      risks: (pmiCase.risks || []).filter((item) => item.id !== id)
    };

    return savePmiCase(nextCase);
  }

  function updateMilestone(id, patch = {}) {
    const nextCase = {
      ...pmiCase,
      milestones: (pmiCase.milestones || []).map((item) =>
        item.id === id
          ? {
              ...item,
              ...patch
            }
          : item
      )
    };

    return savePmiCase(nextCase);
  }

  function addMilestone(payload = {}) {
    const title = String(payload.title || '').trim();
    if (!title) return Promise.resolve(pmiCase);

    const nextCase = {
      ...pmiCase,
      milestones: [
        ...(pmiCase.milestones || []),
        {
          id: createLocalId('milestone'),
          label: String(payload.label || 'Milestone').trim() || 'Milestone',
          title,
          status: 'Pending',
          progress: 0,
          summary: 'New PMI milestone.'
        }
      ]
    };

    return savePmiCase(nextCase);
  }

  function removeMilestone(id) {
    const nextCase = {
      ...pmiCase,
      milestones: (pmiCase.milestones || []).filter((item) => item.id !== id)
    };

    return savePmiCase(nextCase);
  }

  function updateSynergyInitiative(id, patch = {}) {
    const nextCase = {
      ...pmiCase,
      synergyLedger: (pmiCase.synergyLedger || []).map((item) =>
        item.id === id
          ? {
              ...item,
              ...patch
            }
          : item
      )
    };

    return schedulePmiCaseSave(nextCase);
  }

  function addSynergyInitiative(payload = {}) {
    const name = String(payload.name || '').trim();
    if (!name) return Promise.resolve(pmiCase);

    const nextCase = {
      ...pmiCase,
      synergyLedger: [
        ...(pmiCase.synergyLedger || []),
        {
          id: createLocalId('synergy'),
          name,
          type: payload.type || 'Cost',
          owner: String(payload.owner || 'PMI Owner').trim() || 'PMI Owner',
          workstreamId: payload.workstreamId || pmiCase.workstreams?.[0]?.id || '',
          baseline: Number(payload.baseline) || 0,
          forecast: Number(payload.forecast) || 0,
          captured: Number(payload.captured) || 0,
          confidence: Number(payload.confidence) || 50,
          status: payload.status || 'Baseline',
          dueDate: payload.dueDate || ''
        }
      ]
    };

    return savePmiCase(nextCase);
  }

  function removeSynergyInitiative(id) {
    const nextCase = {
      ...pmiCase,
      synergyLedger: (pmiCase.synergyLedger || []).filter((item) => item.id !== id)
    };

    return savePmiCase(nextCase);
  }

  function togglePlaybookCheck(playbookId, checkId) {
    const nextCase = {
      ...pmiCase,
      playbooks: (pmiCase.playbooks || []).map((playbook) =>
        playbook.id === playbookId
          ? {
              ...playbook,
              checklist: (playbook.checklist || []).map((check) =>
                check.id === checkId
                  ? {
                      ...check,
                      done: !check.done
                    }
                  : check
              )
            }
          : playbook
      )
    };

    return savePmiCase(nextCase);
  }

  function updateDependency(id, patch = {}) {
    const nextCase = {
      ...pmiCase,
      dependencies: (pmiCase.dependencies || []).map((item) =>
        item.id === id
          ? {
              ...item,
              ...patch
            }
          : item
      )
    };

    return schedulePmiCaseSave(nextCase);
  }

  function addDependency(payload = {}) {
    const title = String(payload.title || '').trim();
    if (!title) return Promise.resolve(pmiCase);

    const nextCase = {
      ...pmiCase,
      dependencies: [
        ...(pmiCase.dependencies || []),
        {
          id: createLocalId('dependency'),
          title,
          fromWorkstreamId: payload.fromWorkstreamId || pmiCase.workstreams?.[0]?.id || '',
          toWorkstreamId: payload.toWorkstreamId || pmiCase.workstreams?.[1]?.id || '',
          status: payload.status || 'Monitoring',
          severity: payload.severity || 'Medium',
          owner: String(payload.owner || 'PMI Owner').trim() || 'PMI Owner',
          mitigation: payload.mitigation || 'Define mitigation plan and escalation threshold.'
        }
      ]
    };

    return savePmiCase(nextCase);
  }

  function removeDependency(id) {
    const nextCase = {
      ...pmiCase,
      dependencies: (pmiCase.dependencies || []).filter((item) => item.id !== id)
    };

    return savePmiCase(nextCase);
  }

  function addBoardAction(label) {
    const action = String(label || '').trim();
    if (!action) return Promise.resolve(pmiCase);

    const nextCase = {
      ...pmiCase,
      boardActions: [...(pmiCase.boardActions || []), action]
    };

    return savePmiCase(nextCase);
  }

  function closeBoardAction(label) {
    const nextCase = {
      ...pmiCase,
      boardActions: (pmiCase.boardActions || []).filter((item) => item !== label)
    };

    return savePmiCase(nextCase);
  }

  const value = useMemo(
    () => ({
      pmiCase,
      pmiCases,
      auditLogs,
      setPmiCase,
      savePmiCase,
      patchPmiCase,
      selectPmiCase,
      createBlankPmiCase,
      duplicatePmiCase,
      removePmiCase,
      createFromMaDeal,
      pmiTemplates: PMI_TEMPLATES,
      refreshAuditLogs,
      updateWorkstream,
      addWorkstream,
      removeWorkstream,
      updateRisk,
      addRisk,
      removeRisk,
      updateMilestone,
      addMilestone,
      removeMilestone,
      updateSynergyInitiative,
      addSynergyInitiative,
      removeSynergyInitiative,
      togglePlaybookCheck,
      updateDependency,
      addDependency,
      removeDependency,
      addBoardAction,
      closeBoardAction,
      backendStatus
    }),
    [auditLogs, backendStatus, pmiCase, pmiCases]
  );

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
