import React from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Clock3,
  FileText,
  ShieldCheck
} from 'lucide-react';

const dataRoomChecklistCss = `
  .funding-dataroom-checklist {
    width: 100%;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .funding-dataroom-empty {
    width: 100%;
    padding: 24px;
    border-radius: 24px;
    border: 1px dashed rgba(148, 163, 184, 0.24);
    background:
      linear-gradient(135deg, rgba(255,255,255,0.055), rgba(255,255,255,0.022)),
      rgba(15, 23, 42, 0.62);
  }

  .funding-dataroom-row {
    width: 100%;
    min-width: 0;
    display: grid;
    grid-template-columns: 46px minmax(0, 1fr) minmax(150px, 220px);
    gap: 18px;
    align-items: center;
    padding: 19px;
    border-radius: 24px;
    border: 1px solid rgba(148, 163, 184, 0.15);
    background:
      linear-gradient(135deg, rgba(255,255,255,0.065), rgba(255,255,255,0.024)),
      rgba(15, 23, 42, 0.68);
    box-shadow:
      0 18px 52px rgba(0, 0, 0, 0.18),
      inset 0 1px 0 rgba(255,255,255,0.035);
    transition:
      transform .18s ease,
      border-color .18s ease,
      background .18s ease,
      box-shadow .18s ease;
  }

  .funding-dataroom-row:hover {
    transform: translateY(-2px);
    border-color: rgba(96, 165, 250, 0.26);
    background:
      linear-gradient(135deg, rgba(255,255,255,0.083), rgba(255,255,255,0.032)),
      rgba(15, 23, 42, 0.8);
    box-shadow:
      0 22px 64px rgba(0, 0, 0, 0.22),
      inset 0 1px 0 rgba(255,255,255,0.045);
  }

  .funding-dataroom-icon {
    width: 46px;
    height: 46px;
    border-radius: 18px;
    display: grid;
    place-items: center;
    background: rgba(37, 99, 235, 0.14);
    border: 1px solid rgba(96, 165, 250, 0.22);
    color: rgba(219, 234, 254, 0.98);
  }

  .funding-dataroom-icon.ready {
    background: rgba(16, 185, 129, 0.13);
    border-color: rgba(16, 185, 129, 0.24);
    color: #86efac;
  }

  .funding-dataroom-icon.pending {
    background: rgba(245, 158, 11, 0.13);
    border-color: rgba(245, 158, 11, 0.24);
    color: #fcd34d;
  }

  .funding-dataroom-icon.risk {
    background: rgba(239, 68, 68, 0.13);
    border-color: rgba(239, 68, 68, 0.24);
    color: #fca5a5;
  }

  .funding-dataroom-main {
    min-width: 0;
  }

  .funding-dataroom-title {
    display: block;
    margin-bottom: 7px;
    font-size: 15px;
    line-height: 1.28;
    color: rgba(248, 250, 252, 0.98);
    overflow-wrap: anywhere;
  }

  .funding-dataroom-description {
    margin: 0;
    color: rgba(148, 163, 184, 0.92);
    line-height: 1.55;
    overflow-wrap: anywhere;
  }

  .funding-dataroom-meta {
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 10px;
    align-items: flex-end;
    text-align: right;
  }

  .funding-dataroom-category {
    font-size: 11px;
    line-height: 1;
    text-transform: uppercase;
    letter-spacing: 0.14em;
    color: rgba(148, 163, 184, 0.9);
    overflow-wrap: anywhere;
  }

  .funding-dataroom-status {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    width: fit-content;
    max-width: 100%;
    padding: 8px 11px;
    border-radius: 999px;
    font-size: 12px;
    font-weight: 750;
    border: 1px solid rgba(148, 163, 184, 0.16);
    background: rgba(255,255,255,0.045);
    color: rgba(226, 232, 240, 0.96);
  }

  .funding-dataroom-status.ready {
    border-color: rgba(16, 185, 129, 0.24);
    background: rgba(16, 185, 129, 0.12);
    color: #bbf7d0;
  }

  .funding-dataroom-status.pending {
    border-color: rgba(245, 158, 11, 0.24);
    background: rgba(245, 158, 11, 0.12);
    color: #fde68a;
  }

  .funding-dataroom-status.risk {
    border-color: rgba(239, 68, 68, 0.24);
    background: rgba(239, 68, 68, 0.12);
    color: #fecaca;
  }

  @media (max-width: 860px) {
    .funding-dataroom-row {
      grid-template-columns: 46px minmax(0, 1fr);
    }

    .funding-dataroom-meta {
      grid-column: 1 / -1;
      align-items: flex-start;
      text-align: left;
      padding-left: 64px;
    }
  }

  @media (max-width: 560px) {
    .funding-dataroom-row {
      grid-template-columns: 1fr;
    }

    .funding-dataroom-meta {
      padding-left: 0;
    }
  }
`;

function getItemValue(item, keys, fallback = '') {
  for (const key of keys) {
    if (item?.[key] !== undefined && item?.[key] !== null && item?.[key] !== '') {
      return item[key];
    }
  }

  return fallback;
}

function getStatusMeta(item) {
  const rawStatus = String(
    getItemValue(item, ['status', 'state', 'completed', 'done'], '')
  ).toLowerCase();

  if (
    rawStatus === 'true' ||
    rawStatus === 'done' ||
    rawStatus === 'completed' ||
    rawStatus === 'ready' ||
    rawStatus === 'listo' ||
    rawStatus === 'completado'
  ) {
    return {
      tone: 'ready',
      label: 'Ready',
      icon: CheckCircle2
    };
  }

  if (
    rawStatus === 'risk' ||
    rawStatus === 'missing' ||
    rawStatus === 'blocked' ||
    rawStatus === 'critical'
  ) {
    return {
      tone: 'risk',
      label: 'Missing',
      icon: AlertTriangle
    };
  }

  return {
    tone: 'pending',
    label: 'Pending',
    icon: Clock3
  };
}

function getCategory(item) {
  return getItemValue(
    item,
    ['category', 'section', 'group', 'type'],
    'Data room'
  );
}

function getTitle(item, index) {
  return getItemValue(
    item,
    ['title', 'name', 'label', 'document', 'item'],
    `Documento ${index + 1}`
  );
}

function getDescription(item) {
  return getItemValue(
    item,
    ['description', 'detail', 'helper', 'notes', 'comment'],
    'Documento requerido para completar el paquete de financiación.'
  );
}

export function DataRoomChecklist({ items = [] }) {
  const safeItems = Array.isArray(items) ? items : [];

  if (safeItems.length === 0) {
    return (
      <div className="funding-dataroom-checklist">
        <style>{dataRoomChecklistCss}</style>

        <div className="funding-dataroom-empty">
          <div className="section-title">
            <div>
              <h3>No hay documentos generados todavía</h3>

              <p className="muted" style={{ marginBottom: 0 }}>
                Completa los inputs de Funding para generar el checklist del
                data room.
              </p>
            </div>

            <ShieldCheck size={20} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="funding-dataroom-checklist">
      <style>{dataRoomChecklistCss}</style>

      {safeItems.map((item, index) => {
        const status = getStatusMeta(item);
        const StatusIcon = status.icon;

        return (
          <article
            key={item.id || item.title || item.name || index}
            className="funding-dataroom-row"
          >
            <div className={`funding-dataroom-icon ${status.tone}`}>
              <FileText size={18} />
            </div>

            <div className="funding-dataroom-main">
              <strong className="funding-dataroom-title">
                {getTitle(item, index)}
              </strong>

              <p className="funding-dataroom-description">
                {getDescription(item)}
              </p>
            </div>

            <div className="funding-dataroom-meta">
              <span className="funding-dataroom-category">
                {getCategory(item)}
              </span>

              <span className={`funding-dataroom-status ${status.tone}`}>
                <StatusIcon size={14} />
                {status.label}
              </span>
            </div>
          </article>
        );
      })}
    </div>
  );
}