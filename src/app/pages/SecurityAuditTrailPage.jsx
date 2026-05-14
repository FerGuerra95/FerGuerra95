import React, { useCallback, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Download, RefreshCw, ScrollText } from 'lucide-react';

import { useAuth } from '../providers/AuthProvider.jsx';
import { httpClient } from '../../shared/services/httpClient.js';
import { Button } from '../../shared/components/ui/Button.jsx';

function extractData(payload) {
  if (!payload) return null;
  return payload.data ?? payload;
}

function downloadCsv(rows, filename) {
  const header = [
    'createdAt',
    'action',
    'entityType',
    'entityId',
    'userId',
    'metadata'
  ];
  const lines = [header.join(',')];
  for (const row of rows) {
    const meta = JSON.stringify(row.metadata || {}).replaceAll('"', '""');
    lines.push(
      [
        row.createdAt || '',
        row.action || '',
        row.entityType || '',
        row.entityId || '',
        row.userId || '',
        `"${meta}"`
      ].join(',')
    );
  }
  const blob = new Blob([lines.join('\n')], {
    type: 'text/csv;charset=utf-8'
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function SecurityAuditTrailPage() {
  const { can, PERMISSIONS } = useAuth();
  const allowed = can(PERMISSIONS.READ_AUDIT_LOG);

  const [items, setItems] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!allowed) return;
    setLoading(true);
    setError('');
    try {
      const payload = await httpClient.get(
        `/ma/audit-logs?entityType=all&limit=300`
      );
      const data = extractData(payload);
      setItems(Array.isArray(data?.items) ? data.items : []);
    } catch (e) {
      setError(e?.message || 'No se pudo cargar el registro de auditoría.');
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [allowed]);

  useEffect(() => {
    void load();
  }, [load]);

  if (!allowed) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="page" style={{ padding: '24px 28px', maxWidth: 1200 }}>
      <div
        className="row"
        style={{
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: 16,
          marginBottom: 20
        }}
      >
        <div>
          <h1
            className="page-title"
            style={{ display: 'flex', alignItems: 'center', gap: 10 }}
          >
            <ScrollText size={22} aria-hidden />
            Auditoría de seguridad
          </h1>
          <p className="muted" style={{ marginTop: 8, maxWidth: 720 }}>
            Eventos recientes de tu organización (M&amp;A, autenticación y otros)
            según permisos de auditoría.
          </p>
        </div>
        <div className="row" style={{ gap: 10 }}>
          <Button type="button" variant="secondary" onClick={() => load()}>
            <RefreshCw size={16} />
            Actualizar
          </Button>
          <Button
            type="button"
            variant="secondary"
            disabled={!items.length}
            onClick={() =>
              downloadCsv(
                items,
                `audit-trail-${new Date().toISOString().slice(0, 10)}.csv`
              )
            }
          >
            <Download size={16} />
            CSV
          </Button>
        </div>
      </div>

      {error ? (
        <div className="card login-form-error-card" role="alert">
          <p className="muted login-form-error-copy">{error}</p>
        </div>
      ) : null}

      {loading ? (
        <p className="muted">Cargando eventos…</p>
      ) : (
        <div
          className="card table-wrap"
          style={{ overflow: 'auto', borderRadius: 14, padding: 0 }}
        >
          <table className="table" style={{ width: '100%', fontSize: 13 }}>
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Acción</th>
                <th>Tipo</th>
                <th>Entidad</th>
                <th>Usuario</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan={5} className="muted" style={{ padding: 20 }}>
                    No hay eventos registrados todavía.
                  </td>
                </tr>
              ) : (
                items.map((row) => (
                  <tr key={row.id}>
                    <td>{row.createdAt}</td>
                    <td>{row.action}</td>
                    <td>{row.entityType}</td>
                    <td>{row.entityId}</td>
                    <td>{row.userId}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
