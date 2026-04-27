import React, { useMemo, useState } from 'react';
import { Eye, FileBadge, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../../shared/components/ui/Card.jsx';
import { EmptyState } from '../../../shared/components/ui/EmptyState.jsx';
import { Button } from '../../../shared/components/ui/Button.jsx';
import { Input } from '../../../shared/components/ui/Input.jsx';
import { Select } from '../../../shared/components/ui/Select.jsx';
import { Badge } from '../../../shared/components/ui/Badge.jsx';
import {
  PERMISSIONS,
  useAuth
} from '../../../app/providers/AuthProvider.jsx';
import { useNotifications } from '../../../app/providers/NotificationsProvider.jsx';
import { useComplianceStore } from '../store/complianceStore.js';
import { useComplianceEngine } from '../engine/useComplianceEngine.js';

const SOURCE_TYPE_OPTIONS = [
  'manual',
  'internal_note',
  'external_report',
  'news',
  'document',
  'audit',
  'certification',
  'other'
];

const LANGUAGE_OPTIONS = ['es', 'en', 'fr', 'de', 'it', 'pt', 'other'];

function formatDate(value) {
  if (!value) return 'Sin fecha';

  try {
    return new Date(value).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  } catch {
    return 'Sin fecha';
  }
}

function getSupplierName(suppliers, supplierId) {
  const supplier = suppliers.find((item) => item.id === supplierId);
  return supplier?.name || 'Proveedor no identificado';
}

function getAlertTitle(alerts, alertId) {
  const alert = alerts.find((item) => item.id === alertId);
  return alert?.title || 'Sin alerta vinculada';
}

function getEmptyEvidenceForm(suppliers = []) {
  return {
    supplierId: suppliers[0]?.id || '',
    alertId: '',
    title: '',
    sourceType: 'manual',
    sourceUrl: '',
    language: 'es',
    excerpt: '',
    translatedExcerpt: '',
    confidence: '0.75'
  };
}

function normalizeText(value) {
  return String(value || '').trim();
}

function parseConfidence(value) {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return null;
  }

  return number;
}

export function EvidencePage() {
  const navigate = useNavigate();
  const { pushToast } = useNotifications();
  const { can, isViewer } = useAuth();

  const {
    suppliers,
    alerts,
    evidenceItems,
    reviews,
    activeSupplierId,
    setActiveSupplierId,
    addEvidence
  } = useComplianceStore();

  const canCreateEvidence = can(PERMISSIONS.CREATE_EVIDENCE);

  const engine = useComplianceEngine({
    suppliers,
    alerts,
    evidenceItems,
    reviews,
    activeSupplierId
  });

  const [query, setQuery] = useState('');
  const [supplierFilter, setSupplierFilter] = useState('all');
  const [sourceTypeFilter, setSourceTypeFilter] = useState('all');

  const [newEvidence, setNewEvidence] = useState(() =>
    getEmptyEvidenceForm(suppliers)
  );

  const supplierOptions = suppliers.map((supplier) => ({
    label: supplier.name,
    value: supplier.id
  }));

  const alertOptions = alerts
    .filter((alert) => {
      if (!newEvidence.supplierId) return true;
      return alert.supplierId === newEvidence.supplierId;
    })
    .map((alert) => ({
      label: alert.title,
      value: alert.id
    }));

  const filteredEvidence = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return evidenceItems.filter((item) => {
      const supplierName = getSupplierName(suppliers, item.supplierId);
      const alertTitle = getAlertTitle(alerts, item.alertId);

      const matchesQuery = !normalizedQuery
        ? true
        : [
            item.title,
            item.sourceType,
            item.sourceUrl,
            item.language,
            item.excerpt,
            item.translatedExcerpt,
            supplierName,
            alertTitle
          ]
            .join(' ')
            .toLowerCase()
            .includes(normalizedQuery);

      const matchesSupplier =
        supplierFilter === 'all' ? true : item.supplierId === supplierFilter;

      const matchesSourceType =
        sourceTypeFilter === 'all' ? true : item.sourceType === sourceTypeFilter;

      return matchesQuery && matchesSupplier && matchesSourceType;
    });
  }, [evidenceItems, suppliers, alerts, query, supplierFilter, sourceTypeFilter]);

  function updateNewEvidenceField(key, value) {
    setNewEvidence((prev) => {
      if (key === 'supplierId') {
        return {
          ...prev,
          supplierId: value,
          alertId: ''
        };
      }

      return {
        ...prev,
        [key]: value
      };
    });
  }

  async function handleCreateEvidence() {
    if (!canCreateEvidence) {
      pushToast('No tienes permisos para añadir evidencias');
      return;
    }

    const supplierId = normalizeText(newEvidence.supplierId);
    const title = normalizeText(newEvidence.title);
    const sourceUrl = normalizeText(newEvidence.sourceUrl);
    const excerpt = normalizeText(newEvidence.excerpt);
    const translatedExcerpt = normalizeText(newEvidence.translatedExcerpt);
    const confidenceValue = parseConfidence(newEvidence.confidence);

    if (suppliers.length === 0) {
      pushToast('Primero debes crear un proveedor');
      return;
    }

    if (!supplierId) {
      pushToast('Selecciona un proveedor para la evidencia');
      return;
    }

    const supplierExists = suppliers.some((supplier) => supplier.id === supplierId);

    if (!supplierExists) {
      pushToast('El proveedor seleccionado no existe');
      return;
    }

    if (!title) {
      pushToast('El título de la evidencia es obligatorio');
      return;
    }

    if (confidenceValue === null) {
      pushToast('La confianza debe ser un número entre 0 y 1');
      return;
    }

    if (confidenceValue < 0 || confidenceValue > 1) {
      pushToast('La confianza debe estar entre 0 y 1');
      return;
    }

    try {
      const created = await Promise.resolve(
        addEvidence({
          ...newEvidence,
          supplierId,
          title,
          sourceType: newEvidence.sourceType || 'manual',
          sourceUrl,
          language: newEvidence.language || 'es',
          excerpt:
            excerpt ||
            'Evidencia registrada manualmente para soporte del expediente.',
          translatedExcerpt,
          confidence: confidenceValue
        })
      );

      if (!created?.id) {
        pushToast('No se pudo añadir la evidencia');
        return;
      }

      setNewEvidence({
        ...getEmptyEvidenceForm(suppliers),
        supplierId
      });

      pushToast('Evidencia añadida correctamente');
    } catch (error) {
      pushToast(error?.message || 'No se pudo añadir la evidencia');
    }
  }

  function handleOpenSupplier(supplierId) {
    setActiveSupplierId(supplierId);
    navigate(`/compliance/suppliers/${supplierId}`);
  }

  return (
    <div className="page">
      <Card>
        <div className="section-title">
          <div>
            <h2>Evidence Hub</h2>
            <p className="muted">
              Centro de evidencias con fuente, extracto, idioma, confianza,
              proveedor asociado y trazabilidad documental para soporte DSS.
            </p>
          </div>

          <div className="row wrap">
            {isViewer ? <Badge>Modo solo lectura</Badge> : null}
            <Badge>{evidenceItems.length} evidencias</Badge>
          </div>
        </div>
      </Card>

      <div className="grid-4">
        <Card>
          <div className="kpi-label">Evidencias totales</div>
          <div className="kpi-value">{evidenceItems.length}</div>
          <p className="muted" style={{ marginBottom: 0 }}>
            Documentos, notas y fuentes
          </p>
        </Card>

        <Card>
          <div className="kpi-label">Cobertura evidencia</div>
          <div className="kpi-value">
            {engine.portfolioRisk.evidenceCoverage}%
          </div>
          <p className="muted" style={{ marginBottom: 0 }}>
            Proveedores con soporte
          </p>
        </Card>

        <Card>
          <div className="kpi-label">Confianza media</div>
          <div className="kpi-value">
            {engine.evidenceSummary.averageConfidence || 0}%
          </div>
          <p className="muted" style={{ marginBottom: 0 }}>
            Proveedor activo
          </p>
        </Card>

        <Card>
          <div className="kpi-label">Cobertura activa</div>
          <div className="kpi-value">
            {engine.evidenceSummary.coverageLabel || 'Sin datos'}
          </div>
          <p className="muted" style={{ marginBottom: 0 }}>
            Calidad documental
          </p>
        </Card>
      </div>

      <div className="grid-2">
        {canCreateEvidence ? (
          <Card>
            <h3>Evidence Intake</h3>

            <div className="stack">
              <Select
                label="Proveedor"
                value={newEvidence.supplierId}
                onChange={(e) =>
                  updateNewEvidenceField('supplierId', e.target.value)
                }
                options={
                  supplierOptions.length > 0
                    ? supplierOptions
                    : [{ label: 'Sin proveedores', value: '' }]
                }
              />

              <Select
                label="Alerta vinculada"
                value={newEvidence.alertId}
                onChange={(e) => updateNewEvidenceField('alertId', e.target.value)}
                options={[
                  { label: 'Sin alerta vinculada', value: '' },
                  ...alertOptions
                ]}
              />

              <Input
                label="Título de la evidencia"
                value={newEvidence.title}
                onChange={(e) => updateNewEvidenceField('title', e.target.value)}
              />

              <div className="grid-2">
                <Select
                  label="Tipo de fuente"
                  value={newEvidence.sourceType}
                  onChange={(e) =>
                    updateNewEvidenceField('sourceType', e.target.value)
                  }
                  options={SOURCE_TYPE_OPTIONS}
                />

                <Select
                  label="Idioma"
                  value={newEvidence.language}
                  onChange={(e) =>
                    updateNewEvidenceField('language', e.target.value)
                  }
                  options={LANGUAGE_OPTIONS}
                />
              </div>

              <Input
                label="URL / referencia de fuente"
                value={newEvidence.sourceUrl}
                onChange={(e) =>
                  updateNewEvidenceField('sourceUrl', e.target.value)
                }
              />

              <Input
                label="Extracto original"
                value={newEvidence.excerpt}
                onChange={(e) => updateNewEvidenceField('excerpt', e.target.value)}
              />

              <Input
                label="Traducción / resumen interno"
                value={newEvidence.translatedExcerpt}
                onChange={(e) =>
                  updateNewEvidenceField('translatedExcerpt', e.target.value)
                }
              />

              <Input
                label="Confianza de la evidencia (0 a 1)"
                inputMode="decimal"
                value={newEvidence.confidence}
                onChange={(e) =>
                  updateNewEvidenceField('confidence', e.target.value)
                }
              />

              <Button onClick={handleCreateEvidence}>
                <Plus size={16} />
                Añadir evidencia
              </Button>
            </div>
          </Card>
        ) : (
          <Card>
            <h3>Evidence Intake</h3>
            <EmptyState
              title="Sin permisos de creación"
              description="Tu rol actual solo permite consultar evidencias."
            />
          </Card>
        )}

        <Card>
          <h3>Evidence Filters</h3>

          <div className="stack">
            <Input
              label="Buscar"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />

            <Select
              label="Proveedor"
              value={supplierFilter}
              onChange={(e) => setSupplierFilter(e.target.value)}
              options={[{ label: 'Todos', value: 'all' }, ...supplierOptions]}
            />

            <Select
              label="Tipo de fuente"
              value={sourceTypeFilter}
              onChange={(e) => setSourceTypeFilter(e.target.value)}
              options={['all', ...SOURCE_TYPE_OPTIONS]}
            />

            <p className="muted">
              Las evidencias son la base defendible del workspace Compliance:
              deben conservar fuente, extracto, idioma, nivel de confianza y
              vínculo con proveedor o alerta.
            </p>
          </div>
        </Card>
      </div>

      <Card>
        <div className="section-title">
          <div>
            <h3>Evidence Library</h3>
            <p className="muted" style={{ marginBottom: 0 }}>
              Evidencias registradas para soportar alertas, revisiones humanas e informes.
            </p>
          </div>

          <Badge>{filteredEvidence.length} resultados</Badge>
        </div>

        {filteredEvidence.length === 0 ? (
          <EmptyState
            title="No hay evidencias"
            description={
              canCreateEvidence
                ? 'Añade una evidencia nueva o cambia los filtros de búsqueda.'
                : 'No hay evidencias visibles con los filtros actuales.'
            }
          />
        ) : (
          <div className="stack">
            {filteredEvidence.map((evidence) => {
              const supplierName = getSupplierName(suppliers, evidence.supplierId);
              const alertTitle = getAlertTitle(alerts, evidence.alertId);
              const confidence = Math.round(Number(evidence.confidence || 0) * 100);

              return (
                <div
                  key={evidence.id}
                  className="card"
                  style={{ background: 'rgba(255,255,255,0.04)' }}
                >
                  <div className="section-title">
                    <div>
                      <h3 style={{ marginBottom: 6 }}>{evidence.title}</h3>
                      <p className="muted" style={{ marginBottom: 0 }}>
                        {supplierName} · {alertTitle} · {formatDate(evidence.createdAt)}
                      </p>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div className="kpi-value text-info" style={{ fontSize: 22 }}>
                        {confidence}%
                      </div>
                      <div className="kpi-label">Confianza</div>
                    </div>
                  </div>

                  <div className="row wrap">
                    <Badge>{evidence.sourceType}</Badge>
                    <Badge>{evidence.language}</Badge>
                    <Badge>{confidence}% confianza</Badge>
                  </div>

                  <p className="muted" style={{ marginTop: 14 }}>
                    {evidence.translatedExcerpt || evidence.excerpt}
                  </p>

                  {evidence.sourceUrl ? (
                    <p className="muted" style={{ marginBottom: 0 }}>
                      Fuente: {evidence.sourceUrl}
                    </p>
                  ) : null}

                  <div className="row wrap" style={{ marginTop: 16 }}>
                    <Button
                      variant="secondary"
                      onClick={() => handleOpenSupplier(evidence.supplierId)}
                    >
                      <Eye size={16} />
                      Ver proveedor
                    </Button>

                    <Button variant="secondary">
                      <FileBadge size={16} />
                      Evidencia registrada
                    </Button>

                    {!canCreateEvidence ? <Badge>Solo lectura</Badge> : null}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}