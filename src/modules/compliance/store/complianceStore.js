import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react';
import { httpClient } from '../../../shared/services/httpClient.js';
import { useAuth } from '../../../app/providers/AuthProvider.jsx';

export const COMPLIANCE_STORAGE_KEYS = {
  SUPPLIERS: 'compliance_suppliers_v1',
  ALERTS: 'compliance_alerts_v1',
  EVIDENCE: 'compliance_evidence_v1',
  REVIEWS: 'compliance_reviews_v1',
  REPORTS: 'compliance_reports_v1'
};

const DEFAULT_SUPPLIERS = [
  {
    id: 'supplier_001',
    name: 'IberTextile Manufacturing',
    country: 'España',
    region: 'Europa',
    tier: 'Tier 1',
    sector: 'Textil',
    criticality: 'Alta',
    spend: 420000,
    status: 'active',
    riskScore: 68,
    resilienceScore: 72,
    lastReviewAt: '2026-04-20T10:30:00.000Z'
  },
  {
    id: 'supplier_002',
    name: 'MetalWorks Components',
    country: 'Marruecos',
    region: 'África Norte',
    tier: 'Tier 2',
    sector: 'Industrial',
    criticality: 'Media',
    spend: 260000,
    status: 'watchlist',
    riskScore: 56,
    resilienceScore: 61,
    lastReviewAt: '2026-04-18T09:15:00.000Z'
  },
  {
    id: 'supplier_003',
    name: 'AsiaPack Logistics',
    country: 'Vietnam',
    region: 'Asia',
    tier: 'Tier 1',
    sector: 'Logística',
    criticality: 'Alta',
    spend: 610000,
    status: 'active',
    riskScore: 74,
    resilienceScore: 69,
    lastReviewAt: '2026-04-15T16:45:00.000Z'
  }
];

const DEFAULT_ALERTS = [
  {
    id: 'alert_001',
    supplierId: 'supplier_001',
    title: 'Posible dependencia crítica de proveedor único',
    category: 'Operational Risk',
    severity: 'medium',
    status: 'open',
    source: 'Internal assessment',
    createdAt: '2026-04-21T08:20:00.000Z',
    description:
      'El proveedor concentra una parte relevante del suministro. Conviene revisar alternativas y plan de continuidad.'
  },
  {
    id: 'alert_002',
    supplierId: 'supplier_002',
    title: 'Incremento de riesgo geográfico',
    category: 'Geopolitical Risk',
    severity: 'high',
    status: 'in_review',
    source: 'Country risk monitor',
    createdAt: '2026-04-22T11:10:00.000Z',
    description:
      'Se detecta aumento de riesgo regional. Requiere revisión humana antes de modificar el scoring final.'
  },
  {
    id: 'alert_003',
    supplierId: 'supplier_003',
    title: 'Evidencia documental pendiente',
    category: 'Evidence Gap',
    severity: 'low',
    status: 'open',
    source: 'Compliance checklist',
    createdAt: '2026-04-23T13:00:00.000Z',
    description:
      'Falta documentación actualizada sobre subcontratistas y medidas de trazabilidad.'
  }
];

const DEFAULT_EVIDENCE = [
  {
    id: 'evidence_001',
    supplierId: 'supplier_002',
    alertId: 'alert_002',
    title: 'Nota interna de riesgo regional',
    sourceType: 'internal_note',
    sourceUrl: '',
    language: 'es',
    excerpt:
      'Se recomienda revisar exposición regional, continuidad de suministro y alternativas de segundo proveedor.',
    translatedExcerpt: '',
    confidence: 0.78,
    createdAt: '2026-04-22T12:15:00.000Z'
  }
];

const DEFAULT_REVIEWS = [
  {
    id: 'review_001',
    alertId: 'alert_002',
    supplierId: 'supplier_002',
    status: 'pending',
    reviewer: '',
    decision: '',
    notes: '',
    createdAt: '2026-04-22T12:30:00.000Z',
    decidedAt: ''
  }
];

const DEFAULT_REPORTS = [];

const ComplianceStoreContext = createContext(null);

function getOrganizationId(user) {
  return user?.organizationId || 'org_demo';
}

function getUserId(user) {
  return user?.id || 'u_demo';
}

function attachOwnership(item, user, organizationIdOverride) {
  const organizationId = organizationIdOverride || getOrganizationId(user);
  const userId = getUserId(user);

  return {
    ...item,
    organizationId: item.organizationId || organizationId,
    userId: item.userId || userId
  };
}

function belongsToOrganization(item, organizationId) {
  if (!item) return false;
  if (!item.organizationId) return true;

  return item.organizationId === organizationId;
}

function filterByOrganization(items = [], organizationId) {
  return Array.isArray(items)
    ? items.filter((item) => belongsToOrganization(item, organizationId))
    : [];
}

function mergeOrganizationItems({
  allItems = [],
  organizationItems = [],
  organizationId,
  user
}) {
  const otherOrganizationItems = allItems.filter((item) => {
    if (!item.organizationId) return false;
    return item.organizationId !== organizationId;
  });

  const ownedItems = organizationItems.map((item) =>
    attachOwnership(
      {
        ...item,
        organizationId
      },
      user,
      organizationId
    )
  );

  return [...ownedItems, ...otherOrganizationItems];
}

function safeRead(key, fallback) {
  try {
    if (typeof localStorage === 'undefined') return fallback;

    const raw = localStorage.getItem(key);
    if (!raw) return fallback;

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
}

function safeWrite(key, value) {
  try {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Si localStorage falla, la app sigue funcionando en memoria.
  }
}

function readOrganizationCollection(key, fallback, organizationId, user) {
  const allItems = safeRead(key, fallback);

  return filterByOrganization(allItems, organizationId).map((item) =>
    attachOwnership(item, user, organizationId)
  );
}

function createId(prefix) {
  return `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2, 8)}`;
}

function extractData(payload) {
  if (!payload) return null;
  return payload.data ?? payload;
}

function extractCollection(payload) {
  const data = extractData(payload);

  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.items)) return data.items;

  return [];
}

async function listRemote(path) {
  const payload = await httpClient.get(path);
  return extractCollection(payload);
}

async function createRemote(path, item) {
  const payload = await httpClient.post(path, item);
  return extractData(payload);
}

async function updateRemote(path, id, patch) {
  if (!id) return null;

  const payload = await httpClient.patch(`${path}/${id}`, patch);
  return extractData(payload);
}

async function deleteRemote(path, id) {
  if (!id) return null;

  const payload = await httpClient.delete(`${path}/${id}`);
  return extractData(payload);
}

async function syncCollectionToBackend(path, items = []) {
  const results = [];

  for (const item of items) {
    try {
      const saved = await createRemote(path, item);
      if (saved) results.push(saved);
    } catch {
      // Si ya existe o falla el backend, mantenemos fallback local.
    }
  }

  return results;
}

export function ComplianceStoreProvider({ children }) {
  const { user } = useAuth();
  const organizationId = getOrganizationId(user);

  const [suppliers, setSuppliersState] = useState(() =>
    readOrganizationCollection(
      COMPLIANCE_STORAGE_KEYS.SUPPLIERS,
      DEFAULT_SUPPLIERS,
      organizationId,
      user
    )
  );

  const [alerts, setAlertsState] = useState(() =>
    readOrganizationCollection(
      COMPLIANCE_STORAGE_KEYS.ALERTS,
      DEFAULT_ALERTS,
      organizationId,
      user
    )
  );

  const [evidenceItems, setEvidenceItemsState] = useState(() =>
    readOrganizationCollection(
      COMPLIANCE_STORAGE_KEYS.EVIDENCE,
      DEFAULT_EVIDENCE,
      organizationId,
      user
    )
  );

  const [reviews, setReviewsState] = useState(() =>
    readOrganizationCollection(
      COMPLIANCE_STORAGE_KEYS.REVIEWS,
      DEFAULT_REVIEWS,
      organizationId,
      user
    )
  );

  const [reports, setReportsState] = useState(() =>
    readOrganizationCollection(
      COMPLIANCE_STORAGE_KEYS.REPORTS,
      DEFAULT_REPORTS,
      organizationId,
      user
    )
  );

  const [activeSupplierId, setActiveSupplierId] = useState(() => {
    const localSuppliers = readOrganizationCollection(
      COMPLIANCE_STORAGE_KEYS.SUPPLIERS,
      DEFAULT_SUPPLIERS,
      organizationId,
      user
    );

    return localSuppliers[0]?.id || '';
  });

  const [filters, setFilters] = useState({
    severity: 'all',
    status: 'all',
    tier: 'all',
    query: ''
  });

  const [backendStatus, setBackendStatus] = useState({
    isLoading: false,
    lastSyncAt: null,
    error: null
  });

  function persistOrganizationCollection({
    key,
    fallback,
    next,
    setter
  }) {
    const safeNext = Array.isArray(next) ? next : [];
    const allItems = safeRead(key, fallback);

    const nextAllItems = mergeOrganizationItems({
      allItems,
      organizationItems: safeNext,
      organizationId,
      user
    });

    const nextOrganizationItems = filterByOrganization(
      nextAllItems,
      organizationId
    ).map((item) => attachOwnership(item, user, organizationId));

    setter(nextOrganizationItems);
    safeWrite(key, nextAllItems);

    return nextOrganizationItems;
  }

  function setSuppliers(next) {
    return persistOrganizationCollection({
      key: COMPLIANCE_STORAGE_KEYS.SUPPLIERS,
      fallback: DEFAULT_SUPPLIERS,
      next,
      setter: setSuppliersState
    });
  }

  function setAlerts(next) {
    return persistOrganizationCollection({
      key: COMPLIANCE_STORAGE_KEYS.ALERTS,
      fallback: DEFAULT_ALERTS,
      next,
      setter: setAlertsState
    });
  }

  function setEvidenceItems(next) {
    return persistOrganizationCollection({
      key: COMPLIANCE_STORAGE_KEYS.EVIDENCE,
      fallback: DEFAULT_EVIDENCE,
      next,
      setter: setEvidenceItemsState
    });
  }

  function setReviews(next) {
    return persistOrganizationCollection({
      key: COMPLIANCE_STORAGE_KEYS.REVIEWS,
      fallback: DEFAULT_REVIEWS,
      next,
      setter: setReviewsState
    });
  }

  function setReports(next) {
    return persistOrganizationCollection({
      key: COMPLIANCE_STORAGE_KEYS.REPORTS,
      fallback: DEFAULT_REPORTS,
      next,
      setter: setReportsState
    });
  }

  function replaceOrganizationItem({
    key,
    fallback,
    setter,
    localId,
    item
  }) {
    if (!item?.id && !localId) return [];

    const allItems = safeRead(key, fallback);
    const organizationItems = filterByOrganization(allItems, organizationId);

    const ownedItem = attachOwnership(item, user, organizationId);
    const idsToMatch = new Set([localId, ownedItem.id].filter(Boolean));

    let found = false;

    const nextOrganizationItems = organizationItems.map((existing) => {
      if (idsToMatch.has(existing.id)) {
        found = true;
        return attachOwnership(
          {
            ...existing,
            ...ownedItem
          },
          user,
          organizationId
        );
      }

      return existing;
    });

    if (!found) {
      nextOrganizationItems.unshift(ownedItem);
    }

    return persistOrganizationCollection({
      key,
      fallback,
      next: nextOrganizationItems,
      setter
    });
  }

  async function syncBackend(action, onSuccess) {
    try {
      const result = await action();

      if (result && onSuccess) {
        onSuccess(result);
      }

      setBackendStatus((prev) => ({
        ...prev,
        lastSyncAt: new Date().toISOString(),
        error: null
      }));

      return result;
    } catch (error) {
      setBackendStatus((prev) => ({
        ...prev,
        error: error?.message || 'No se pudo sincronizar con backend'
      }));

      return null;
    }
  }

  function reloadLocalOrganizationData() {
    const nextSuppliers = readOrganizationCollection(
      COMPLIANCE_STORAGE_KEYS.SUPPLIERS,
      DEFAULT_SUPPLIERS,
      organizationId,
      user
    );

    const nextAlerts = readOrganizationCollection(
      COMPLIANCE_STORAGE_KEYS.ALERTS,
      DEFAULT_ALERTS,
      organizationId,
      user
    );

    const nextEvidence = readOrganizationCollection(
      COMPLIANCE_STORAGE_KEYS.EVIDENCE,
      DEFAULT_EVIDENCE,
      organizationId,
      user
    );

    const nextReviews = readOrganizationCollection(
      COMPLIANCE_STORAGE_KEYS.REVIEWS,
      DEFAULT_REVIEWS,
      organizationId,
      user
    );

    const nextReports = readOrganizationCollection(
      COMPLIANCE_STORAGE_KEYS.REPORTS,
      DEFAULT_REPORTS,
      organizationId,
      user
    );

    setSuppliersState(nextSuppliers);
    setAlertsState(nextAlerts);
    setEvidenceItemsState(nextEvidence);
    setReviewsState(nextReviews);
    setReportsState(nextReports);
    setActiveSupplierId(nextSuppliers[0]?.id || '');

    setSuppliers(nextSuppliers);
    setAlerts(nextAlerts);
    setEvidenceItems(nextEvidence);
    setReviews(nextReviews);
    setReports(nextReports);
  }

  useEffect(() => {
    reloadLocalOrganizationData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [organizationId, user]);

  async function refreshComplianceData() {
    setBackendStatus((prev) => ({
      ...prev,
      isLoading: true,
      error: null
    }));

    try {
      const localSuppliers = readOrganizationCollection(
        COMPLIANCE_STORAGE_KEYS.SUPPLIERS,
        DEFAULT_SUPPLIERS,
        organizationId,
        user
      );

      const localAlerts = readOrganizationCollection(
        COMPLIANCE_STORAGE_KEYS.ALERTS,
        DEFAULT_ALERTS,
        organizationId,
        user
      );

      const localEvidence = readOrganizationCollection(
        COMPLIANCE_STORAGE_KEYS.EVIDENCE,
        DEFAULT_EVIDENCE,
        organizationId,
        user
      );

      const localReviews = readOrganizationCollection(
        COMPLIANCE_STORAGE_KEYS.REVIEWS,
        DEFAULT_REVIEWS,
        organizationId,
        user
      );

      const localReports = readOrganizationCollection(
        COMPLIANCE_STORAGE_KEYS.REPORTS,
        DEFAULT_REPORTS,
        organizationId,
        user
      );

      const [
        remoteSuppliersRaw,
        remoteAlertsRaw,
        remoteEvidenceRaw,
        remoteReviewsRaw,
        remoteReportsRaw
      ] = await Promise.all([
        listRemote('/suppliers'),
        listRemote('/alerts'),
        listRemote('/evidence'),
        listRemote('/reviews'),
        listRemote('/reports?type=compliance')
      ]);

      const remoteSuppliers = filterByOrganization(
        remoteSuppliersRaw,
        organizationId
      ).map((item) => attachOwnership(item, user, organizationId));

      const remoteAlerts = filterByOrganization(
        remoteAlertsRaw,
        organizationId
      ).map((item) => attachOwnership(item, user, organizationId));

      const remoteEvidence = filterByOrganization(
        remoteEvidenceRaw,
        organizationId
      ).map((item) => attachOwnership(item, user, organizationId));

      const remoteReviews = filterByOrganization(
        remoteReviewsRaw,
        organizationId
      ).map((item) => attachOwnership(item, user, organizationId));

      const remoteReports = filterByOrganization(
        remoteReportsRaw,
        organizationId
      ).map((item) => attachOwnership(item, user, organizationId));

      const nextSuppliers =
        remoteSuppliers.length > 0 ? remoteSuppliers : localSuppliers;

      const nextAlerts = remoteAlerts.length > 0 ? remoteAlerts : localAlerts;

      const nextEvidence =
        remoteEvidence.length > 0 ? remoteEvidence : localEvidence;

      const nextReviews =
        remoteReviews.length > 0 ? remoteReviews : localReviews;

      const nextReports =
        remoteReports.length > 0 ? remoteReports : localReports;

      setSuppliers(nextSuppliers);
      setAlerts(nextAlerts);
      setEvidenceItems(nextEvidence);
      setReviews(nextReviews);
      setReports(nextReports);

      if (remoteSuppliers.length === 0 && localSuppliers.length > 0) {
        await syncCollectionToBackend('/suppliers', localSuppliers);
      }

      if (remoteAlerts.length === 0 && localAlerts.length > 0) {
        await syncCollectionToBackend('/alerts', localAlerts);
      }

      if (remoteEvidence.length === 0 && localEvidence.length > 0) {
        await syncCollectionToBackend('/evidence', localEvidence);
      }

      if (remoteReviews.length === 0 && localReviews.length > 0) {
        await syncCollectionToBackend('/reviews', localReviews);
      }

      if (remoteReports.length === 0 && localReports.length > 0) {
        await syncCollectionToBackend('/reports/compliance', localReports);
      }

      setActiveSupplierId((prev) => prev || nextSuppliers[0]?.id || '');

      setBackendStatus({
        isLoading: false,
        lastSyncAt: new Date().toISOString(),
        error: null
      });

      return {
        suppliers: nextSuppliers,
        alerts: nextAlerts,
        evidenceItems: nextEvidence,
        reviews: nextReviews,
        reports: nextReports
      };
    } catch (error) {
      setBackendStatus({
        isLoading: false,
        lastSyncAt: null,
        error: error?.message || 'No se pudo sincronizar Compliance'
      });

      return {
        suppliers,
        alerts,
        evidenceItems,
        reviews,
        reports
      };
    }
  }

  useEffect(() => {
    refreshComplianceData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [organizationId]);

  function createSupplier(payload = {}) {
    const supplier = attachOwnership(
      {
        id: payload.id || createId('supplier'),
        name: payload.name || '',
        country: payload.country || 'Sin país',
        region: payload.region || 'Sin región',
        tier: payload.tier || 'Tier 1',
        sector: payload.sector || 'General',
        criticality: payload.criticality || 'Media',
        spend: Number(payload.spend) || 0,
        status: payload.status || 'active',
        riskScore: Number(payload.riskScore) || 50,
        resilienceScore: Number(payload.resilienceScore) || 50,
        lastReviewAt: new Date().toISOString(),
        createdAt: payload.createdAt || new Date().toISOString(),
        ...payload
      },
      user,
      organizationId
    );

    const next = [supplier, ...suppliers];
    setSuppliers(next);
    setActiveSupplierId(supplier.id);

    syncBackend(
      () => createRemote('/suppliers', supplier),
      (saved) => {
        const savedSupplier = attachOwnership(
          {
            ...supplier,
            ...saved
          },
          user,
          organizationId
        );

        replaceOrganizationItem({
          key: COMPLIANCE_STORAGE_KEYS.SUPPLIERS,
          fallback: DEFAULT_SUPPLIERS,
          setter: setSuppliersState,
          localId: supplier.id,
          item: savedSupplier
        });

        if (savedSupplier.id !== supplier.id) {
          setActiveSupplierId(savedSupplier.id);
        }
      }
    );

    return supplier;
  }

  function updateSupplier(id, patch = {}) {
    const next = suppliers.map((supplier) =>
      supplier.id === id
        ? attachOwnership(
            {
              ...supplier,
              ...patch,
              lastReviewAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            },
            user,
            organizationId
          )
        : supplier
    );

    setSuppliers(next);

    syncBackend(
      () =>
        updateRemote('/suppliers', id, {
          ...patch,
          organizationId,
          userId: getUserId(user)
        }),
      (saved) => {
        replaceOrganizationItem({
          key: COMPLIANCE_STORAGE_KEYS.SUPPLIERS,
          fallback: DEFAULT_SUPPLIERS,
          setter: setSuppliersState,
          localId: id,
          item: saved
        });
      }
    );

    return next.find((supplier) => supplier.id === id) || null;
  }

  function deleteSupplier(id) {
    const supplierToDelete = suppliers.find((supplier) => supplier.id === id);

    if (!supplierToDelete) {
      return {
        deleted: false,
        id,
        reason: 'not_found'
      };
    }

    const removedAlerts = alerts.filter((alert) => alert.supplierId === id);
    const removedAlertIds = new Set(removedAlerts.map((alert) => alert.id));

    const removedEvidence = evidenceItems.filter((item) => {
      return item.supplierId === id || removedAlertIds.has(item.alertId);
    });

    const removedReviews = reviews.filter((review) => {
      return review.supplierId === id || removedAlertIds.has(review.alertId);
    });

    const removedReports = reports.filter((report) => {
      return report.supplierId === id;
    });

    const nextSuppliers = suppliers.filter((supplier) => supplier.id !== id);
    const nextAlerts = alerts.filter((alert) => alert.supplierId !== id);

    const nextEvidence = evidenceItems.filter((item) => {
      return item.supplierId !== id && !removedAlertIds.has(item.alertId);
    });

    const nextReviews = reviews.filter((review) => {
      return review.supplierId !== id && !removedAlertIds.has(review.alertId);
    });

    const nextReports = reports.filter((report) => report.supplierId !== id);

    setSuppliers(nextSuppliers);
    setAlerts(nextAlerts);
    setEvidenceItems(nextEvidence);
    setReviews(nextReviews);
    setReports(nextReports);

    if (activeSupplierId === id) {
      setActiveSupplierId(nextSuppliers[0]?.id || '');
    }

    syncBackend(() => deleteRemote('/suppliers', id));

    return {
      deleted: true,
      id,
      removed: {
        suppliers: 1,
        alerts: removedAlerts.length,
        evidence: removedEvidence.length,
        reviews: removedReviews.length,
        reports: removedReports.length
      }
    };
  }

  function createAlert(payload = {}) {
    const alert = attachOwnership(
      {
        id: payload.id || createId('alert'),
        supplierId: payload.supplierId || activeSupplierId || '',
        title: payload.title || '',
        category: payload.category || 'General Risk',
        severity: payload.severity || 'medium',
        status: payload.status || 'open',
        source: payload.source || 'Manual',
        createdAt: payload.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        description: payload.description || '',
        ...payload
      },
      user,
      organizationId
    );

    const next = [alert, ...alerts];
    setAlerts(next);

    syncBackend(
      () => createRemote('/alerts', alert),
      (saved) => {
        replaceOrganizationItem({
          key: COMPLIANCE_STORAGE_KEYS.ALERTS,
          fallback: DEFAULT_ALERTS,
          setter: setAlertsState,
          localId: alert.id,
          item: {
            ...alert,
            ...saved
          }
        });
      }
    );

    return alert;
  }

  function updateAlert(id, patch = {}) {
    const next = alerts.map((alert) =>
      alert.id === id
        ? attachOwnership(
            {
              ...alert,
              ...patch,
              updatedAt: new Date().toISOString()
            },
            user,
            organizationId
          )
        : alert
    );

    setAlerts(next);

    syncBackend(
      () =>
        updateRemote('/alerts', id, {
          ...patch,
          organizationId,
          userId: getUserId(user)
        }),
      (saved) => {
        replaceOrganizationItem({
          key: COMPLIANCE_STORAGE_KEYS.ALERTS,
          fallback: DEFAULT_ALERTS,
          setter: setAlertsState,
          localId: id,
          item: saved
        });
      }
    );

    return next.find((alert) => alert.id === id) || null;
  }

  function deleteAlert(id) {
    const alertToDelete = alerts.find((alert) => alert.id === id);

    if (!alertToDelete) {
      return {
        deleted: false,
        id,
        reason: 'not_found'
      };
    }

    const removedEvidence = evidenceItems.filter((item) => item.alertId === id);
    const removedReviews = reviews.filter((review) => review.alertId === id);

    setAlerts(alerts.filter((alert) => alert.id !== id));
    setEvidenceItems(evidenceItems.filter((item) => item.alertId !== id));
    setReviews(reviews.filter((review) => review.alertId !== id));

    syncBackend(() => deleteRemote('/alerts', id));

    return {
      deleted: true,
      id,
      removed: {
        alerts: 1,
        evidence: removedEvidence.length,
        reviews: removedReviews.length
      }
    };
  }

  function addEvidence(payload = {}) {
    const evidence = attachOwnership(
      {
        id: payload.id || createId('evidence'),
        supplierId: payload.supplierId || activeSupplierId || '',
        alertId: payload.alertId || '',
        title: payload.title || '',
        sourceType: payload.sourceType || 'manual',
        sourceUrl: payload.sourceUrl || '',
        language: payload.language || 'es',
        excerpt: payload.excerpt || '',
        translatedExcerpt: payload.translatedExcerpt || '',
        confidence: Number(payload.confidence) || 0.7,
        createdAt: payload.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ...payload
      },
      user,
      organizationId
    );

    const next = [evidence, ...evidenceItems];
    setEvidenceItems(next);

    syncBackend(
      () => createRemote('/evidence', evidence),
      (saved) => {
        replaceOrganizationItem({
          key: COMPLIANCE_STORAGE_KEYS.EVIDENCE,
          fallback: DEFAULT_EVIDENCE,
          setter: setEvidenceItemsState,
          localId: evidence.id,
          item: {
            ...evidence,
            ...saved
          }
        });
      }
    );

    return evidence;
  }

  function deleteEvidence(id) {
    const existing = evidenceItems.find((item) => item.id === id);

    if (!existing) {
      return {
        deleted: false,
        id,
        reason: 'not_found'
      };
    }

    setEvidenceItems(evidenceItems.filter((item) => item.id !== id));

    syncBackend(() => deleteRemote('/evidence', id));

    return {
      deleted: true,
      id,
      removed: {
        evidence: 1
      }
    };
  }

  function createReview(payload = {}) {
    const review = attachOwnership(
      {
        id: payload.id || createId('review'),
        alertId: payload.alertId || '',
        supplierId: payload.supplierId || activeSupplierId || '',
        status: payload.status || 'pending',
        reviewer: payload.reviewer || '',
        decision: payload.decision || '',
        notes: payload.notes || '',
        createdAt: payload.createdAt || new Date().toISOString(),
        decidedAt: payload.decidedAt || '',
        updatedAt: new Date().toISOString(),
        ...payload
      },
      user,
      organizationId
    );

    const next = [review, ...reviews];
    setReviews(next);

    syncBackend(
      () => createRemote('/reviews', review),
      (saved) => {
        replaceOrganizationItem({
          key: COMPLIANCE_STORAGE_KEYS.REVIEWS,
          fallback: DEFAULT_REVIEWS,
          setter: setReviewsState,
          localId: review.id,
          item: {
            ...review,
            ...saved
          }
        });
      }
    );

    return review;
  }

  function decideReview(id, payload = {}) {
    const decidedAt = new Date().toISOString();

    const next = reviews.map((review) =>
      review.id === id
        ? attachOwnership(
            {
              ...review,
              status: 'decided',
              reviewer: payload.reviewer || '',
              decision: payload.decision || 'validated',
              notes: payload.notes || '',
              decidedAt,
              updatedAt: decidedAt
            },
            user,
            organizationId
          )
        : review
    );

    setReviews(next);

    const decidedReview = next.find((review) => review.id === id);

    syncBackend(
      () =>
        httpClient.patch(`/reviews/${id}/decide`, {
          reviewer: payload.reviewer || '',
          decision: payload.decision || 'validated',
          notes: payload.notes || '',
          organizationId,
          userId: getUserId(user)
        }),
      (payloadResponse) => {
        const saved = extractData(payloadResponse);

        if (saved) {
          replaceOrganizationItem({
            key: COMPLIANCE_STORAGE_KEYS.REVIEWS,
            fallback: DEFAULT_REVIEWS,
            setter: setReviewsState,
            localId: id,
            item: saved
          });
        }
      }
    );

    if (decidedReview?.alertId) {
      const nextStatus =
        payload.decision === 'discarded'
          ? 'discarded'
          : payload.decision === 'validated'
            ? 'validated'
            : 'in_review';

      updateAlert(decidedReview.alertId, {
        status: nextStatus
      });
    }

    return decidedReview || null;
  }

  function deleteReview(id) {
    const existing = reviews.find((review) => review.id === id);

    if (!existing) {
      return {
        deleted: false,
        id,
        reason: 'not_found'
      };
    }

    setReviews(reviews.filter((review) => review.id !== id));

    syncBackend(() => deleteRemote('/reviews', id));

    return {
      deleted: true,
      id,
      removed: {
        reviews: 1
      }
    };
  }

  function createReport(payload = {}) {
    const report = attachOwnership(
      {
        id: payload.id || createId('report'),
        title: payload.title || 'Compliance Report',
        supplierId: payload.supplierId || activeSupplierId || '',
        supplierName: payload.supplierName || '',
        scope: payload.scope || 'supplier',
        status: payload.status || 'generated',
        riskScore: payload.riskScore ?? null,
        resilienceScore: payload.resilienceScore ?? null,
        riskLevel: payload.riskLevel || '',
        resilienceLevel: payload.resilienceLevel || '',
        recommendations: payload.recommendations || [],
        evidenceSummary: payload.evidenceSummary || null,
        createdAt: payload.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        summary: payload.summary || '',
        items: payload.items || [],
        ...payload
      },
      user,
      organizationId
    );

    const next = [report, ...reports];
    setReports(next);

    syncBackend(
      () => createRemote('/reports/compliance', report),
      (saved) => {
        replaceOrganizationItem({
          key: COMPLIANCE_STORAGE_KEYS.REPORTS,
          fallback: DEFAULT_REPORTS,
          setter: setReportsState,
          localId: report.id,
          item: {
            ...report,
            ...saved
          }
        });
      }
    );

    return report;
  }

  function deleteReport(id) {
    const existing = reports.find((report) => report.id === id);

    if (!existing) {
      return {
        deleted: false,
        id,
        reason: 'not_found'
      };
    }

    setReports(reports.filter((report) => report.id !== id));

    syncBackend(() => deleteRemote('/reports/compliance', id));

    return {
      deleted: true,
      id,
      removed: {
        reports: 1
      }
    };
  }

  function resetComplianceDemoData() {
    const ownedSuppliers = DEFAULT_SUPPLIERS.map((item) =>
      attachOwnership(item, user, organizationId)
    );

    const ownedAlerts = DEFAULT_ALERTS.map((item) =>
      attachOwnership(item, user, organizationId)
    );

    const ownedEvidence = DEFAULT_EVIDENCE.map((item) =>
      attachOwnership(item, user, organizationId)
    );

    const ownedReviews = DEFAULT_REVIEWS.map((item) =>
      attachOwnership(item, user, organizationId)
    );

    const ownedReports = DEFAULT_REPORTS.map((item) =>
      attachOwnership(item, user, organizationId)
    );

    setSuppliers(ownedSuppliers);
    setAlerts(ownedAlerts);
    setEvidenceItems(ownedEvidence);
    setReviews(ownedReviews);
    setReports(ownedReports);
    setActiveSupplierId(ownedSuppliers[0]?.id || '');

    syncCollectionToBackend('/suppliers', ownedSuppliers);
    syncCollectionToBackend('/alerts', ownedAlerts);
    syncCollectionToBackend('/evidence', ownedEvidence);
    syncCollectionToBackend('/reviews', ownedReviews);
  }

  const activeSupplier = suppliers.find(
    (supplier) => supplier.id === activeSupplierId
  );

  const value = useMemo(
    () => ({
      suppliers,
      alerts,
      evidenceItems,
      reviews,
      reports,

      activeSupplierId,
      activeSupplier,

      filters,
      setFilters,

      backendStatus,
      refreshComplianceData,

      setActiveSupplierId,

      createSupplier,
      updateSupplier,
      deleteSupplier,

      createAlert,
      updateAlert,
      deleteAlert,

      addEvidence,
      deleteEvidence,

      createReview,
      decideReview,
      deleteReview,

      createReport,
      deleteReport,

      resetComplianceDemoData,

      organizationId
    }),
    [
      suppliers,
      alerts,
      evidenceItems,
      reviews,
      reports,
      activeSupplierId,
      activeSupplier,
      filters,
      backendStatus,
      organizationId
    ]
  );

  return React.createElement(
    ComplianceStoreContext.Provider,
    { value },
    children
  );
}

export function useComplianceStore() {
  const context = useContext(ComplianceStoreContext);

  if (!context) {
    throw new Error(
      'useComplianceStore debe usarse dentro de ComplianceStoreProvider'
    );
  }

  return context;
}