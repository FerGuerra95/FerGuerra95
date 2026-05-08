import React, { useEffect, useMemo, useState } from 'react';
import {
  Archive,
  Ban,
  Download,
  FileCheck2,
  FolderLock,
  Link2,
  LockKeyhole,
  Plus,
  RefreshCw,
  ShieldCheck,
  UploadCloud
} from 'lucide-react';
import { Button } from '../../../shared/components/ui/Button.jsx';
import { Input } from '../../../shared/components/ui/Input.jsx';
import { Select } from '../../../shared/components/ui/Select.jsx';
import { Badge } from '../../../shared/components/ui/Badge.jsx';
import { formatDate } from '../../../shared/utils/date.js';
import {
  PERMISSIONS,
  useAuth
} from '../../../app/providers/AuthProvider.jsx';
import { useNotifications } from '../../../app/providers/NotificationsProvider.jsx';
import { maDataRoomApi } from '../services/maDataRoomApi.js';

const maDataRoomCss = `
  .ma-data-room-page {
    width: min(1540px, 100%);
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 28px;
  }

  .ma-data-room-hero {
    position: relative;
    overflow: hidden;
    border-radius: 12px;
    padding: 34px;
    color: #f8fafc;
    background:
      linear-gradient(135deg, rgba(2, 6, 23, 0.99), rgba(15, 23, 42, 0.98));
    border: 1px solid rgba(148, 163, 184, 0.20);
    box-shadow:
      0 28px 80px rgba(15, 23, 42, 0.18),
      inset 0 1px 0 rgba(255, 255, 255, 0.05);
  }

  .ma-data-room-hero-grid {
    position: relative;
    z-index: 1;
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(280px, 430px);
    gap: 26px;
    align-items: end;
  }

  .ma-data-room-kicker {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 14px;
    font-size: 12px;
    font-weight: 850;
    color: rgba(226, 232, 240, 0.78);
    text-transform: uppercase;
    letter-spacing: 0;
  }

  .ma-data-room-title {
    margin: 0;
    max-width: 820px;
    font-size: clamp(30px, 4vw, 50px);
    line-height: 1;
    letter-spacing: 0;
  }

  .ma-data-room-copy {
    max-width: 820px;
    margin: 18px 0 0;
    color: rgba(226, 232, 240, 0.76);
    font-size: 16px;
    line-height: 1.65;
  }

  .ma-data-room-metrics {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
  }

  .ma-data-room-metric,
  .ma-data-room-panel,
  .ma-data-room-table-card,
  .ma-data-room-control {
    border-radius: 8px;
    border: 1px solid rgba(148, 163, 184, 0.18);
    background: rgba(255, 255, 255, 0.94);
    box-shadow: 0 16px 42px rgba(15, 23, 42, 0.08);
    min-width: 0;
  }

  .ma-data-room-metric {
    padding: 16px;
    background: rgba(15, 23, 42, 0.72);
    color: #f8fafc;
  }

  .ma-data-room-metric-label {
    display: flex;
    align-items: center;
    gap: 8px;
    color: rgba(226, 232, 240, 0.70);
    font-size: 12px;
    font-weight: 760;
  }

  .ma-data-room-metric-value {
    margin-top: 10px;
    font-size: 26px;
    font-weight: 920;
    letter-spacing: 0;
  }

  .ma-data-room-grid {
    display: grid;
    grid-template-columns: minmax(300px, 410px) minmax(0, 1fr);
    gap: 18px;
    align-items: start;
  }

  .ma-data-room-panel,
  .ma-data-room-table-card {
    padding: 22px;
  }

  .ma-data-room-panel h2,
  .ma-data-room-table-card h2 {
    margin: 0;
    color: #0f172a;
    font-size: 18px;
    line-height: 1.25;
    letter-spacing: 0;
  }

  .ma-data-room-panel p,
  .ma-data-room-table-card p {
    margin: 8px 0 0;
    color: #64748b;
    font-size: 13px;
    line-height: 1.55;
  }

  .ma-data-room-form {
    display: grid;
    gap: 14px;
    margin-top: 18px;
  }

  .ma-data-room-file-input {
    display: grid;
    gap: 8px;
  }

  .ma-data-room-policy-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
  }

  .ma-data-room-checkbox {
    display: flex;
    align-items: center;
    gap: 10px;
    min-height: 42px;
    color: #334155;
    font-size: 13px;
    font-weight: 720;
  }

  .ma-data-room-checkbox input {
    width: 16px;
    height: 16px;
    accent-color: #0f766e;
  }

  .ma-data-room-file-input label {
    color: #334155;
    font-size: 12px;
    font-weight: 780;
  }

  .ma-data-room-file-input input {
    width: 100%;
    border: 1px solid rgba(148, 163, 184, 0.28);
    border-radius: 8px;
    padding: 10px;
    color: #334155;
    background: #f8fafc;
    font-size: 13px;
  }

  .ma-data-room-controls {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 12px;
  }

  .ma-data-room-control {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    padding: 16px;
  }

  .ma-data-room-control svg {
    flex: 0 0 auto;
    color: #0f766e;
  }

  .ma-data-room-control strong {
    display: block;
    color: #0f172a;
    font-size: 13px;
    line-height: 1.3;
  }

  .ma-data-room-control span {
    display: block;
    margin-top: 4px;
    color: #64748b;
    font-size: 12px;
    line-height: 1.45;
  }

  .ma-data-room-table-scroll {
    margin-top: 18px;
    overflow-x: auto;
  }

  .ma-data-room-table {
    width: 100%;
    min-width: 1120px;
    border-collapse: collapse;
    font-size: 13px;
  }

  .ma-data-room-table th,
  .ma-data-room-table td {
    padding: 13px 12px;
    border-bottom: 1px solid rgba(148, 163, 184, 0.18);
    text-align: left;
    vertical-align: top;
    color: #334155;
  }

  .ma-data-room-table th {
    color: #64748b;
    font-size: 11px;
    font-weight: 850;
    text-transform: uppercase;
    letter-spacing: 0;
    background: #f8fafc;
  }

  .ma-data-room-table strong {
    display: block;
    color: #0f172a;
    line-height: 1.3;
    overflow-wrap: anywhere;
  }

  .ma-data-room-table span {
    color: #64748b;
    font-size: 12px;
    overflow-wrap: anywhere;
  }

  .ma-data-room-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .ma-data-room-empty {
    margin-top: 18px;
    border: 1px dashed rgba(148, 163, 184, 0.36);
    border-radius: 8px;
    padding: 18px;
    color: #64748b;
    background: #f8fafc;
    font-size: 13px;
  }

  @media (max-width: 1120px) {
    .ma-data-room-hero-grid,
    .ma-data-room-grid,
    .ma-data-room-controls {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 620px) {
    .ma-data-room-hero,
    .ma-data-room-panel,
    .ma-data-room-table-card {
      padding: 20px;
    }

    .ma-data-room-metrics {
      grid-template-columns: 1fr;
    }

    .ma-data-room-policy-grid {
      grid-template-columns: 1fr;
    }
  }
`;

const DOCUMENT_TYPE_OPTIONS = [
  { value: 'report', label: 'Report' },
  { value: 'cim', label: 'CIM' },
  { value: 'financials', label: 'Financials' },
  { value: 'legal', label: 'Legal' },
  { value: 'tax', label: 'Tax' },
  { value: 'operations', label: 'Operations' },
  { value: 'other', label: 'Other' }
];

const STATUS_OPTIONS = [
  { value: 'ready', label: 'Ready' },
  { value: 'draft', label: 'Draft' },
  { value: 'shared', label: 'Shared' },
  { value: 'archived', label: 'Archived' }
];

const CLASSIFICATION_OPTIONS = [
  { value: 'confidential', label: 'Confidential' },
  { value: 'restricted', label: 'Restricted' },
  { value: 'internal', label: 'Internal' }
];

const AREA_OPTIONS = [
  { value: 'financial', label: 'Financial' },
  { value: 'legal', label: 'Legal' },
  { value: 'tax', label: 'Tax' },
  { value: 'hr', label: 'HR' },
  { value: 'commercial', label: 'Commercial' },
  { value: 'operations', label: 'Operations' },
  { value: 'esg', label: 'ESG' },
  { value: 'technology', label: 'Technology' },
  { value: 'other', label: 'Other' }
];

const DEFAULT_FORM = {
  title: '',
  documentType: 'report',
  classification: 'confidential',
  status: 'ready',
  area: 'financial',
  folder: 'General DD',
  allowDownload: true,
  expiresAt: '',
  watermarkLabel: 'CONFIDENTIAL',
  allowedRoles: ['admin', 'user', 'viewer'],
  legalHold: false,
  retentionUntil: ''
};

function normalizeStatus(value) {
  return String(value || 'ready').replace(/_/g, ' ');
}

function StatusBadge({ value }) {
  return <Badge>{normalizeStatus(value)}</Badge>;
}

function formatFileSize(value = 0) {
  const bytes = Number(value) || 0;

  if (bytes >= 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  if (bytes >= 1024) return `${(bytes / 1024).toFixed(1)} KB`;

  return `${bytes} B`;
}

function formatAccessPolicy(item = {}) {
  if (item.access?.allowDownload === false) return 'Download disabled';
  if (item.access?.expiresAt) return `Expires ${formatDate(item.access.expiresAt)}`;

  return 'Active';
}

function DataRoomTable({
  documents,
  canDownload,
  canManageDataRoom,
  canReadAuditLog,
  onDownloadDocument,
  onToggleDownload,
  onArchiveDocument,
  onExportDocumentAudit
}) {
  if (!documents.length) {
    return (
      <div className="ma-data-room-empty">
        No controlled M&A documents registered yet.
      </div>
    );
  }

  return (
    <div className="ma-data-room-table-scroll">
      <table className="ma-data-room-table">
        <thead>
          <tr>
            <th>Document</th>
            <th>Area</th>
            <th>Type</th>
            <th>Classification</th>
            <th>Status</th>
            <th>Access</th>
            <th>Linked report</th>
            <th>File</th>
            <th>Updated</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {documents.map((item) => (
            <tr key={item.id}>
              <td>
                <strong>{item.title}</strong>
                <span>{item.id}</span>
              </td>
              <td>
                <strong>{normalizeStatus(item.area || 'financial')}</strong>
                <span>{item.folder || 'General DD'}</span>
              </td>
              <td>{normalizeStatus(item.documentType)}</td>
              <td>{normalizeStatus(item.classification)}</td>
              <td>
                <StatusBadge value={item.status} />
              </td>
              <td>
                <strong>{formatAccessPolicy(item)}</strong>
                <span>
                  {(item.access?.allowedRoles || ['admin', 'user', 'viewer']).join(', ')}
                </span>
              </td>
              <td>{item.reportId || 'Not linked'}</td>
              <td>
                {item.storage?.kind === 'server_file' ? (
                  <>
                    <strong>{formatFileSize(item.storage.sizeBytes)}</strong>
                    <span>{item.storage.checksumSha256?.slice(0, 12)}...</span>
                  </>
                ) : (
                  'Metadata only'
                )}
              </td>
              <td>{formatDate(item.updatedAt || item.createdAt)}</td>
              <td>
                <div className="ma-data-room-actions">
                  <Button
                    variant="secondary"
                    disabled={
                      !canDownload ||
                      item.storage?.kind !== 'server_file' ||
                      item.access?.allowDownload === false
                    }
                    onClick={() => onDownloadDocument(item)}
                  >
                    <Download size={14} />
                    Download
                  </Button>

                  <Button
                    variant="secondary"
                    disabled={!canManageDataRoom}
                    onClick={() => onToggleDownload(item)}
                  >
                    <LockKeyhole size={14} />
                    {item.access?.allowDownload === false ? 'Enable' : 'Lock'}
                  </Button>

                  <Button
                    variant="secondary"
                    disabled={!canManageDataRoom || item.status === 'archived'}
                    onClick={() => onArchiveDocument(item)}
                  >
                    <Archive size={14} />
                    Archive
                  </Button>

                  <Button
                    variant="secondary"
                    disabled={!canReadAuditLog}
                    onClick={() => onExportDocumentAudit(item)}
                  >
                    <FileCheck2 size={14} />
                    Audit
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SharesTable({ shares, canRevokeShare, onRevokeShare }) {
  if (!shares.length) {
    return (
      <div className="ma-data-room-empty">
        No secure shares have been issued for M&A reports.
      </div>
    );
  }

  return (
    <div className="ma-data-room-table-scroll">
      <table className="ma-data-room-table">
        <thead>
          <tr>
            <th>Share</th>
            <th>Report</th>
            <th>Status</th>
            <th>Expires</th>
            <th>Revoked</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {shares.map((item) => (
            <tr key={item.id}>
              <td>
                <strong>{item.id}</strong>
              </td>
              <td>{item.reportId || 'Not linked'}</td>
              <td>
                <StatusBadge value={item.status} />
              </td>
              <td>{formatDate(item.expiresAt)}</td>
              <td>{item.revokedAt ? formatDate(item.revokedAt) : 'No'}</td>
              <td>
                <Button
                  variant="secondary"
                  disabled={!canRevokeShare || item.status !== 'active'}
                  onClick={() => onRevokeShare(item)}
                >
                  <Ban size={14} />
                  Revoke
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function AuditLogTable({ auditLogs }) {
  if (!auditLogs.length) {
    return (
      <div className="ma-data-room-empty">
        No M&A audit events available for this organization.
      </div>
    );
  }

  return (
    <div className="ma-data-room-table-scroll">
      <table className="ma-data-room-table">
        <thead>
          <tr>
            <th>Action</th>
            <th>Entity</th>
            <th>User</th>
            <th>Created</th>
          </tr>
        </thead>

        <tbody>
          {auditLogs.map((item) => (
            <tr key={item.id}>
              <td>
                <strong>{item.action}</strong>
              </td>
              <td>{item.entityId || item.entityType}</td>
              <td>{item.userId}</td>
              <td>{formatDate(item.createdAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function MADataRoomPage() {
  const { can } = useAuth();
  const notifications = useNotifications();
  const [dataRoom, setDataRoom] = useState({
    documents: [],
    shares: []
  });
  const [auditLogs, setAuditLogs] = useState([]);
  const [form, setForm] = useState(DEFAULT_FORM);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const canManageDataRoom = can(PERMISSIONS.MANAGE_MA_DATA_ROOM);
  const canRevokeShare = can(PERMISSIONS.REVOKE_MA_SHARE);
  const canReadAuditLog = can(PERMISSIONS.READ_AUDIT_LOG);
  const canDownloadDocuments = can(PERMISSIONS.READ);

  async function loadDataRoom() {
    setIsLoading(true);
    setError('');

    try {
      const [payload, auditItems] = await Promise.all([
        maDataRoomApi.listDataRoom(),
        canReadAuditLog
          ? maDataRoomApi.listAuditLogs({ limit: 120 })
          : Promise.resolve([])
      ]);
      setDataRoom({
        documents: Array.isArray(payload?.documents) ? payload.documents : [],
        shares: Array.isArray(payload?.shares) ? payload.shares : []
      });
      setAuditLogs(auditItems);
    } catch (loadError) {
      setError(loadError.message || 'Data room could not be loaded.');
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadDataRoom();
  }, []);

  const metrics = useMemo(() => {
    const activeShares = dataRoom.shares.filter(
      (item) => item.status === 'active'
    ).length;
    const confidentialDocs = dataRoom.documents.filter(
      (item) => item.classification === 'confidential'
    ).length;
    const serverFiles = dataRoom.documents.filter(
      (item) => item.storage?.kind === 'server_file'
    ).length;

    return {
      documents: dataRoom.documents.length,
      activeShares,
      confidentialDocs,
      serverFiles
    };
  }, [dataRoom]);

  async function handleSubmit(event) {
    event.preventDefault();

    if (!canManageDataRoom) return;

    const title = form.title.trim();

    if (!title) {
      setError('Document title is required.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      if (selectedFile) {
        await maDataRoomApi.uploadFile(selectedFile, {
          ...form,
          title
        });
      } else {
        await maDataRoomApi.createDocument({
          ...form,
          title
        });
      }

      setForm(DEFAULT_FORM);
      setSelectedFile(null);
      notifications?.pushToast?.(
        selectedFile
          ? 'M&A VDR file uploaded'
          : 'M&A data room document registered'
      );
      await loadDataRoom();
    } catch (submitError) {
      setError(submitError.message || 'Document could not be registered.');
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDownloadDocument(item) {
    setError('');

    try {
      await maDataRoomApi.downloadDocument(item);
      notifications?.pushToast?.('M&A VDR file download started');
      await loadDataRoom();
    } catch (downloadError) {
      setError(downloadError.message || 'Document could not be downloaded.');
    }
  }

  async function handleToggleDownload(item) {
    if (!canManageDataRoom || !item?.id) return;

    setError('');

    try {
      await maDataRoomApi.updateDocumentGovernance(item.id, {
        allowDownload: item.access?.allowDownload === false
      });
      notifications?.pushToast?.(
        item.access?.allowDownload === false
          ? 'M&A VDR download enabled'
          : 'M&A VDR download locked'
      );
      await loadDataRoom();
    } catch (policyError) {
      setError(policyError.message || 'Document policy could not be updated.');
    }
  }

  async function handleArchiveDocument(item) {
    if (!canManageDataRoom || !item?.id) return;

    setError('');

    try {
      await maDataRoomApi.updateDocumentGovernance(item.id, {
        status: 'archived',
        allowDownload: false
      });
      notifications?.pushToast?.('M&A VDR document archived');
      await loadDataRoom();
    } catch (archiveError) {
      setError(archiveError.message || 'Document could not be archived.');
    }
  }

  async function handleRevokeShare(share) {
    if (!canRevokeShare || !share?.id) return;

    setError('');

    try {
      await maDataRoomApi.revokeShare(share.id);
      notifications?.pushToast?.('M&A secure share revoked');
      await loadDataRoom();
    } catch (revokeError) {
      setError(revokeError.message || 'Secure share could not be revoked.');
    }
  }

  function handleExportAuditLog() {
    const blob = new Blob(
      [
        JSON.stringify(
          {
            exportedAt: new Date().toISOString(),
            scope: 'ma',
            auditLogs
          },
          null,
          2
        )
      ],
      {
        type: 'application/json'
      }
    );
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = 'ma-audit-log-export.json';
    link.click();
    URL.revokeObjectURL(url);
  }

  async function handleExportDocumentAudit(item) {
    if (!canReadAuditLog || !item?.id) return;

    setError('');

    try {
      const items = await maDataRoomApi.listAuditLogs({
        limit: 200,
        entityId: item.id
      });
      const blob = new Blob(
        [
          JSON.stringify(
            {
              exportedAt: new Date().toISOString(),
              documentId: item.id,
              title: item.title,
              auditLogs: items
            },
            null,
            2
          )
        ],
        {
          type: 'application/json'
        }
      );
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');

      link.href = url;
      link.download = `${item.id}-audit-log.json`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (auditError) {
      setError(auditError.message || 'Document audit could not be exported.');
    }
  }

  return (
    <main className="ma-data-room-page">
      <style>{maDataRoomCss}</style>

      <section className="ma-data-room-hero">
        <div className="ma-data-room-hero-grid">
          <div>
            <div className="ma-data-room-kicker">
              <FolderLock size={16} />
              M&A Enterprise Data Room
            </div>

            <h1 className="ma-data-room-title">
              Controlled document distribution for confidential deal work.
            </h1>

            <p className="ma-data-room-copy">
              Secure shares, report records, classification and revocation status are governed from the organization scope.
            </p>
          </div>

          <div className="ma-data-room-metrics">
            <div className="ma-data-room-metric">
              <div className="ma-data-room-metric-label">
                <Archive size={15} />
                Documents
              </div>
              <div className="ma-data-room-metric-value">{metrics.documents}</div>
            </div>

            <div className="ma-data-room-metric">
              <div className="ma-data-room-metric-label">
                <UploadCloud size={15} />
                Server files
              </div>
              <div className="ma-data-room-metric-value">{metrics.serverFiles}</div>
            </div>

            <div className="ma-data-room-metric">
              <div className="ma-data-room-metric-label">
                <LockKeyhole size={15} />
                Confidential
              </div>
              <div className="ma-data-room-metric-value">{metrics.confidentialDocs}</div>
            </div>

            <div className="ma-data-room-metric">
              <div className="ma-data-room-metric-label">
                <Link2 size={15} />
                Active shares
              </div>
              <div className="ma-data-room-metric-value">{metrics.activeShares}</div>
            </div>
          </div>
        </div>
      </section>

      <section className="ma-data-room-controls">
        <div className="ma-data-room-control">
          <ShieldCheck size={18} />
          <div>
            <strong>Organization scoped</strong>
            <span>Documents and shares resolve through backend tenancy.</span>
          </div>
        </div>

        <div className="ma-data-room-control">
          <LockKeyhole size={18} />
          <div>
            <strong>Token hashed</strong>
            <span>Secure share tokens are stored server-side as hashes.</span>
          </div>
        </div>

        <div className="ma-data-room-control">
          <FileCheck2 size={18} />
          <div>
            <strong>Human review</strong>
            <span>Report circulation remains governed by review status.</span>
          </div>
        </div>

        <div className="ma-data-room-control">
          <RefreshCw size={18} />
          <div>
            <strong>Revocation controls</strong>
            <span>Active secure shares can be revoked from the ledger.</span>
          </div>
        </div>
      </section>

      <section className="ma-data-room-grid">
        <aside className="ma-data-room-panel">
          <h2>Document Control</h2>
          <p>Register controlled M&A material before external distribution.</p>

          <form className="ma-data-room-form" onSubmit={handleSubmit}>
            <Input
              label="Title"
              value={form.title}
              disabled={!canManageDataRoom}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  title: event.target.value
                }))
              }
            />

            <Select
              label="Type"
              value={form.documentType}
              options={DOCUMENT_TYPE_OPTIONS}
              disabled={!canManageDataRoom}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  documentType: event.target.value
                }))
              }
            />

            <Select
              label="Classification"
              value={form.classification}
              options={CLASSIFICATION_OPTIONS}
              disabled={!canManageDataRoom}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  classification: event.target.value
                }))
              }
            />

            <Select
              label="Status"
              value={form.status}
              options={STATUS_OPTIONS}
              disabled={!canManageDataRoom}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  status: event.target.value
                }))
              }
            />

            <div className="ma-data-room-policy-grid">
              <Select
                label="Area"
                value={form.area}
                options={AREA_OPTIONS}
                disabled={!canManageDataRoom}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    area: event.target.value
                  }))
                }
              />

              <Input
                label="Folder"
                value={form.folder}
                disabled={!canManageDataRoom}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    folder: event.target.value
                  }))
                }
              />

              <Input
                label="Access expires"
                type="datetime-local"
                value={form.expiresAt}
                disabled={!canManageDataRoom}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    expiresAt: event.target.value
                  }))
                }
              />

              <Input
                label="Watermark"
                value={form.watermarkLabel}
                disabled={!canManageDataRoom}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    watermarkLabel: event.target.value
                  }))
                }
              />

              <Input
                label="Retention until"
                type="date"
                value={form.retentionUntil}
                disabled={!canManageDataRoom}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    retentionUntil: event.target.value
                  }))
                }
              />

              <label className="ma-data-room-checkbox">
                <input
                  type="checkbox"
                  checked={form.allowDownload}
                  disabled={!canManageDataRoom}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      allowDownload: event.target.checked
                    }))
                  }
                />
                Download enabled
              </label>

              <label className="ma-data-room-checkbox">
                <input
                  type="checkbox"
                  checked={form.legalHold}
                  disabled={!canManageDataRoom}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      legalHold: event.target.checked
                    }))
                  }
                />
                Legal hold
              </label>
            </div>

            <div className="ma-data-room-file-input">
              <label htmlFor="ma-vdr-file">Server-side VDR file</label>
              <input
                id="ma-vdr-file"
                type="file"
                disabled={!canManageDataRoom}
                onChange={(event) => {
                  const file = event.target.files?.[0] || null;
                  setSelectedFile(file);

                  if (file && !form.title.trim()) {
                    setForm((current) => ({
                      ...current,
                      title: file.name
                    }));
                  }
                }}
              />
            </div>

            <Button
              type="submit"
              disabled={!canManageDataRoom}
              loading={isSubmitting}
            >
              {selectedFile ? <UploadCloud size={16} /> : <Plus size={16} />}
              {selectedFile ? 'Upload file' : 'Register document'}
            </Button>
          </form>

          {error ? <div className="ma-data-room-empty">{error}</div> : null}
        </aside>

        <div className="ma-data-room-table-card">
          <h2>Controlled Documents</h2>
          <p>Data room records linked to reports, cases and secure shares.</p>

          {isLoading ? (
            <div className="ma-data-room-empty">Loading M&A data room.</div>
          ) : (
            <DataRoomTable
              documents={dataRoom.documents}
              canDownload={canDownloadDocuments}
              canManageDataRoom={canManageDataRoom}
              canReadAuditLog={canReadAuditLog}
              onDownloadDocument={handleDownloadDocument}
              onToggleDownload={handleToggleDownload}
              onArchiveDocument={handleArchiveDocument}
              onExportDocumentAudit={handleExportDocumentAudit}
            />
          )}
        </div>
      </section>

      <section className="ma-data-room-table-card">
        <h2>Secure Share Ledger</h2>
        <p>Authenticated share links issued from M&A reports.</p>

          {isLoading ? (
            <div className="ma-data-room-empty">Loading secure shares.</div>
          ) : (
            <SharesTable
              shares={dataRoom.shares}
              canRevokeShare={canRevokeShare}
              onRevokeShare={handleRevokeShare}
            />
          )}
      </section>

      <section className="ma-data-room-table-card">
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: 12,
            alignItems: 'flex-start',
            flexWrap: 'wrap'
          }}
        >
          <div>
            <h2>M&A Audit Ledger</h2>
            <p>Organization-scoped activity for cases, deals, reports, data room and secure shares.</p>
          </div>

          <Button
            variant="secondary"
            disabled={!canReadAuditLog || auditLogs.length === 0}
            onClick={handleExportAuditLog}
          >
            <Download size={15} />
            Export audit
          </Button>
        </div>

        {isLoading ? (
          <div className="ma-data-room-empty">Loading audit log.</div>
        ) : (
          <AuditLogTable auditLogs={auditLogs} />
        )}
      </section>
    </main>
  );
}

export default MADataRoomPage;
