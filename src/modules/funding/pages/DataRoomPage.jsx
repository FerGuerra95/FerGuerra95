import React from 'react';
import { Download, FileCheck2, FileText, FolderKanban, ShieldCheck } from 'lucide-react';
import { Card } from '../../../shared/components/ui/Card.jsx';
import { Button } from '../../../shared/components/ui/Button.jsx';
import { Badge } from '../../../shared/components/ui/Badge.jsx';
import { useNotifications } from '../../../app/providers/NotificationsProvider.jsx';
import { useFundingStore } from '../store/fundingStore.jsx';
import { useFundingEngine } from '../engine/useFundingEngine.js';
import { DataRoomChecklist } from '../components/DataRoomChecklist.jsx';
import { fundingExportApi } from '../services/fundingExportApi.js';

function getChecklistStats(items = []) {
  const total = items.length;

  const completed = items.filter((item) => {
    const value = item.completed ?? item.done ?? item.status;

    return (
      value === true ||
      value === 'done' ||
      value === 'completed' ||
      value === 'ready'
    );
  }).length;

  const pending = Math.max(0, total - completed);
  const completion = total > 0 ? Math.round((completed / total) * 100) : 0;

  return {
    total,
    completed,
    pending,
    completion
  };
}

function getDataRoomLevel(completion) {
  if (completion >= 80) {
    return {
      label: 'Alta',
      color: 'text-success',
      description:
        'El data room está suficientemente preparado para conversaciones avanzadas con inversores.'
    };
  }

  if (completion >= 50) {
    return {
      label: 'Media',
      color: 'text-warning',
      description:
        'El data room puede utilizarse como base, pero conviene cerrar documentación pendiente antes de avanzar.'
    };
  }

  return {
    label: 'Baja',
    color: 'text-danger',
    description:
      'El data room necesita completarse antes de enviarse a inversores o partners.'
  };
}

export function DataRoomPage() {
  const { fundingInputs, fundingSettings } = useFundingStore();
  const { pushToast } = useNotifications();

  const derived = useFundingEngine({
    fundingInputs,
    fundingSettings
  });

  const checklistItems = derived.dataRoomChecklist || [];
  const stats = getChecklistStats(checklistItems);
  const level = getDataRoomLevel(stats.completion);

  function handleExport() {
    const ok = fundingExportApi.exportDataRoomMemo({
      fundingInputs,
      fundingSettings,
      derived
    });

    pushToast(
      ok
        ? 'Data room memo preparado para imprimir o guardar como PDF'
        : 'El navegador ha bloqueado la ventana emergente'
    );
  }

  return (
    <div className="page">
      <Card>
        <div className="section-title">
          <div>
            <Badge>Funding Workspace</Badge>

            <h2 style={{ marginTop: 10 }}>Investor Data Room</h2>

            <p className="muted" style={{ marginBottom: 0 }}>
              Checklist documental y paquete ejecutivo para preparar materiales
              de financiación antes de compartirlos con inversores, bancos o
              partners.
            </p>
          </div>

          <Button onClick={handleExport} variant="secondary">
            <Download size={16} />
            Exportar data room
          </Button>
        </div>
      </Card>

      <div className="grid-4">
        <Card>
          <div className="kpi-label">Data Room Readiness</div>
          <div className={`kpi-value ${level.color}`} style={{ fontSize: 22 }}>
            {stats.completion}%
          </div>
          <p className="muted" style={{ marginBottom: 0 }}>
            Preparación {level.label}
          </p>
        </Card>

        <Card>
          <div className="kpi-label">Documentos totales</div>
          <div className="kpi-value" style={{ fontSize: 22 }}>
            {stats.total}
          </div>
          <p className="muted" style={{ marginBottom: 0 }}>
            Checklist completo
          </p>
        </Card>

        <Card>
          <div className="kpi-label">Completados</div>
          <div className="kpi-value text-success" style={{ fontSize: 22 }}>
            {stats.completed}
          </div>
          <p className="muted" style={{ marginBottom: 0 }}>
            Items preparados
          </p>
        </Card>

        <Card>
          <div className="kpi-label">Pendientes</div>
          <div className="kpi-value text-warning" style={{ fontSize: 22 }}>
            {stats.pending}
          </div>
          <p className="muted" style={{ marginBottom: 0 }}>
            Items por cerrar
          </p>
        </Card>
      </div>

      <div className="grid-2">
        <Card>
          <div className="section-title">
            <div>
              <h3>Document Readiness</h3>
              <p className="muted" style={{ marginBottom: 0 }}>
                Lectura ejecutiva de la preparación documental antes de abrir
                una ronda o iniciar conversaciones de deuda.
              </p>
            </div>

            <FileCheck2 size={20} />
          </div>

          <p>{level.description}</p>

          <div className="stack">
            <div className="card" style={{ background: 'rgba(255,255,255,0.04)' }}>
              <strong>Financial materials</strong>
              <p className="muted" style={{ marginBottom: 0 }}>
                Métricas, histórico financiero, burn, runway, proyecciones,
                margen y uso de fondos deben estar preparados y ser consistentes.
              </p>
            </div>

            <div className="card" style={{ background: 'rgba(255,255,255,0.04)' }}>
              <strong>Company materials</strong>
              <p className="muted" style={{ marginBottom: 0 }}>
                Documentación societaria, equipo, producto, clientes, contratos
                clave y narrativa de mercado deben poder revisarse sin fricción.
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="section-title">
            <div>
              <h3>Export Package</h3>
              <p className="muted" style={{ marginBottom: 0 }}>
                Paquete inicial para presentar el estado de preparación y la
                narrativa de financiación.
              </p>
            </div>

            <FileText size={20} />
          </div>

          <div className="stack">
            <div className="card" style={{ background: 'rgba(255,255,255,0.04)' }}>
              <strong>Investor data room memo</strong>
              <p className="muted" style={{ marginBottom: 0 }}>
                Resume la preparación documental, items completados, pendientes
                y contexto financiero principal de la ronda.
              </p>
            </div>

            <div className="card" style={{ background: 'rgba(255,255,255,0.04)' }}>
              <strong>Data room checklist</strong>
              <p className="muted" style={{ marginBottom: 0 }}>
                Permite detectar qué documentos están listos y qué puntos deben
                cerrarse antes de enviar materiales.
              </p>
            </div>

            <Button onClick={handleExport}>
              <Download size={16} />
              Exportar paquete
            </Button>
          </div>
        </Card>
      </div>

      <Card>
        <div className="section-title">
          <div>
            <h3>Data Room Checklist</h3>
            <p className="muted" style={{ marginBottom: 0 }}>
              Checklist operativo de documentación financiera, societaria,
              comercial y de producto para inversores.
            </p>
          </div>

          <FolderKanban size={20} />
        </div>

        <DataRoomChecklist items={checklistItems} />
      </Card>

      <Card>
        <div className="section-title">
          <div>
            <h3>Missing Items</h3>
            <p className="muted" style={{ marginBottom: 0 }}>
              Puntos que conviene cerrar antes de compartir el data room.
            </p>
          </div>

          <ShieldCheck size={20} />
        </div>

        <div className="grid-3">
          <div className="card" style={{ background: 'rgba(255,255,255,0.04)' }}>
            <strong>1. Coherencia financiera</strong>
            <p className="muted" style={{ marginBottom: 0 }}>
              Revisar que ingresos, burn, caja, runway y capital objetivo
              cuentan una historia consistente.
            </p>
          </div>

          <div className="card" style={{ background: 'rgba(255,255,255,0.04)' }}>
            <strong>2. Material legal y societario</strong>
            <p className="muted" style={{ marginBottom: 0 }}>
              Tener preparada la documentación corporativa, cap table, contratos
              relevantes y estructura accionarial.
            </p>
          </div>

          <div className="card" style={{ background: 'rgba(255,255,255,0.04)' }}>
            <strong>3. Narrativa de crecimiento</strong>
            <p className="muted" style={{ marginBottom: 0 }}>
              Conectar la ronda con hitos concretos: producto, ventas, equipo,
              mercado y próximos 12-18 meses.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}