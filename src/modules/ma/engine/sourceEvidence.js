const SOURCE_REQUIREMENTS = {
  'ma.financials.normalizedEbitda': {
    label: 'Normalized EBITDA support',
    sourceType: 'Financial evidence',
    requiredDocuments: ['Management accounts', 'EBITDA add-back schedule']
  },
  'ma.formula.adjustedMultiple': {
    label: 'Multiple selection support',
    sourceType: 'Valuation method',
    requiredDocuments: ['Sector comparables', 'Risk scoring assumptions']
  },
  'ma.formula.synergyValue': {
    label: 'Synergy case support',
    sourceType: 'Deal model',
    requiredDocuments: ['Synergy bridge', 'Integration assumptions']
  },
  'ma.financials.workingCapital': {
    label: 'Working capital bridge',
    sourceType: 'Financial evidence',
    requiredDocuments: ['Working capital schedule', 'Closing accounts policy']
  },
  'ma.formula.dcf': {
    label: 'DCF assumptions',
    sourceType: 'Valuation method',
    requiredDocuments: ['Forecast model', 'WACC and terminal growth support']
  },
  'ma.financials.regionHighRisk': {
    label: 'High-risk exposure support',
    sourceType: 'Risk evidence',
    requiredDocuments: ['Supply chain map', 'Jurisdiction risk memo']
  },
  'ma.financials.clientConcentration': {
    label: 'Customer concentration support',
    sourceType: 'Commercial evidence',
    requiredDocuments: ['Revenue by customer', 'Contract register']
  },
  'ma.financials.growth': {
    label: 'Growth support',
    sourceType: 'Financial evidence',
    requiredDocuments: ['Revenue bridge', 'Sales pipeline support']
  }
};

function toArray(value) {
  return Array.isArray(value) ? value : [];
}

function normalizeText(value, fallback = '') {
  const text = String(value ?? '').trim();
  return text || fallback;
}

function normalizeSourceIds(document = {}) {
  const raw = [
    document.sourceId,
    ...(Array.isArray(document.sourceIds) ? document.sourceIds : []),
    ...(Array.isArray(document.linkedSourceIds) ? document.linkedSourceIds : [])
  ];

  return [...new Set(raw.map((item) => normalizeText(item)).filter(Boolean))];
}

function collectEvidenceDocuments(...containers) {
  const documents = [];

  containers.forEach((container) => {
    if (!container || typeof container !== 'object') return;

    [
      container.evidenceDocuments,
      container.sourceDocuments,
      container.dataRoomDocuments,
      container.documents
    ].forEach((items) => {
      toArray(items).forEach((item) => {
        if (item && typeof item === 'object') {
          documents.push({
            ...item,
            sourceIds: normalizeSourceIds(item)
          });
        }
      });
    });
  });

  return documents.filter((item) => item.sourceIds.length > 0);
}

function getLinkedDocuments(sourceId, documents) {
  return documents.filter((document) => document.sourceIds.includes(sourceId));
}

function getEvidenceStatus(documents) {
  if (!documents.length) {
    return {
      evidenceStatus: 'required',
      status: 'Document required'
    };
  }

  const hasVerifiedDocument = documents.some((document) => {
    const status = normalizeText(document.status).toLowerCase();
    return ['approved', 'final', 'signed', 'verified', 'ready'].includes(status);
  });

  return {
    evidenceStatus: hasVerifiedDocument ? 'verified' : 'linked',
    status: hasVerifiedDocument ? 'Verified' : 'Linked'
  };
}

function addSource(sourceMap, source = {}) {
  const sourceId = normalizeText(source.sourceId);
  if (!sourceId) return;

  const requirement = SOURCE_REQUIREMENTS[sourceId] || {};

  sourceMap.set(sourceId, {
    sourceId,
    label: normalizeText(source.label, requirement.label || 'Decision source'),
    sourceType: normalizeText(source.sourceType, requirement.sourceType || 'Model source'),
    requiredDocuments: toArray(source.requiredDocuments).length
      ? source.requiredDocuments
      : toArray(requirement.requiredDocuments)
  });
}

export function buildDecisionSourcePack({
  financials = {},
  settings = {},
  derived = {}
} = {}) {
  const sourceMap = new Map();

  toArray(derived.thesisSources).forEach((source) => addSource(sourceMap, source));

  toArray(derived.inferences).forEach((item) => {
    addSource(sourceMap, {
      sourceId: item.sourceId,
      label: item.sourceLabel || item.type,
      sourceType: 'Risk signal'
    });
  });

  const documents = collectEvidenceDocuments(financials, settings, derived);

  const sources = Array.from(sourceMap.values()).map((source) => {
    const linkedDocuments = getLinkedDocuments(source.sourceId, documents);
    const status = getEvidenceStatus(linkedDocuments);

    return {
      ...source,
      ...status,
      documentCount: linkedDocuments.length,
      documents: linkedDocuments.map((document) => ({
        id: normalizeText(document.id, document.documentId || document.title),
        title: normalizeText(
          document.title || document.documentTitle || document.name,
          'Evidence document'
        ),
        status: normalizeText(document.status, 'linked'),
        sourceType: normalizeText(document.sourceType || document.type, 'document'),
        version: normalizeText(document.version, 'current'),
        uploadedAt: normalizeText(document.uploadedAt || document.createdAt),
        sourceUrl: normalizeText(document.sourceUrl || document.url)
      }))
    };
  });

  const linked = sources.filter((source) => source.documentCount > 0).length;
  const verified = sources.filter((source) => source.evidenceStatus === 'verified').length;
  const total = sources.length;

  return {
    sources,
    summary: {
      total,
      linked,
      verified,
      required: Math.max(0, total - linked),
      coverage: total > 0 ? Math.round((linked / total) * 100) : 100,
      verifiedCoverage: total > 0 ? Math.round((verified / total) * 100) : 100
    }
  };
}

export { SOURCE_REQUIREMENTS };
