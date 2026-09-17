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
  Search,
  ShieldCheck,
  UploadCloud,
  Check
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
import {
  countActiveSharesForDocument,
  isMaSecureShareActive,
  summarizeDataRoomShares
} from '../engine/maDataRoomCoherence.js';
import { MADataRoomControlFieldVisual } from '../components/MADataRoomControlFieldVisual.jsx';

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

const DOC_SORT_OPTIONS = [
  { value: 'updated_desc', label: 'Updated (newest)' },
  { value: 'updated_asc', label: 'Updated (oldest)' },
  { value: 'title_asc', label: 'Title (A–Z)' },
  { value: 'title_desc', label: 'Title (Z–A)' },
  { value: 'classification_asc', label: 'Classification' }
];

const COMMAND_VIEWS = [
  { id: 'documents', label: 'Documents' },
  { id: 'shares', label: 'Secure Shares' },
  { id: 'audit', label: 'Audit Trail' }
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

function isWithinDays(isoDate, days) {
  if (!isoDate) return false;
  const ts = new Date(isoDate).getTime();
  if (!Number.isFinite(ts)) return false;
  const horizon = days * 24 * 60 * 60 * 1000;
  return ts >= Date.now() - horizon && ts <= Date.now() + horizon;
}

function countSharesForDocument(documentItem, shares) {
  return countActiveSharesForDocument(documentItem, shares);
}

function CommandTabs({ activeView, counts, onChange }) {
  return (
    <div className="ma-vdr-command-tabs" role="tablist" aria-label="Data room views">
      {COMMAND_VIEWS.map((view) => {
        const count = counts[view.id];
        const isActive = activeView === view.id;

        return (
          <button
            key={view.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            className={`ma-vdr-command-tab${isActive ? ' is-active' : ''}`}
            onClick={() => onChange(view.id)}
          >
            <span>{view.label}</span>
            {typeof count === 'number' ? (
              <span className="ma-vdr-command-tab-count">{count}</span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}

function ViewSummary({ items }) {
  return (
    <div className="ma-vdr-view-summary">
      {items.map((item) => (
        <div key={item.label} className="ma-vdr-view-summary-item">
          <span className="ma-vdr-view-summary-label">{item.label}</span>
          <strong className="ma-vdr-view-summary-value">{item.value}</strong>
        </div>
      ))}
    </div>
  );
}

function DataRoomTable({
  documents,
  shares,
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
    <div className="ma-vdr-table-viewport ma-data-room-table-scroll ceos-enterprise-table-wrap">
      <table className="ma-data-room-table ma-vdr-table-compact ceos-enterprise-table">
        <thead>
          <tr>
            <th>Document</th>
            <th>Security</th>
            <th>Metadata</th>
            <th>Access</th>
            <th>Shares</th>
            <th>Updated</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {documents.map((item) => {
            const linkedShares = countSharesForDocument(item, shares);

            return (
              <tr key={item.id}>
                <td className="ma-vdr-col-primary">
                  <strong>{item.title}</strong>
                  <span>
                    {item.id}
                    {item.reportId ? ` · Report ${item.reportId}` : ''}
                  </span>
                </td>
                <td className="ma-vdr-col-security">
                  <span className="ma-vdr-meta-strong">{normalizeStatus(item.classification)}</span>
                  <StatusBadge value={item.status} />
                </td>
                <td className="ma-vdr-col-meta">
                  <span className="ma-vdr-meta-strong">{normalizeStatus(item.area || 'financial')}</span>
                  <span>
                    {normalizeStatus(item.documentType)} · {item.folder || 'General DD'}
                  </span>
                </td>
                <td className="ma-vdr-col-access">
                  <span className="ma-vdr-meta-strong">{formatAccessPolicy(item)}</span>
                  <span>
                    {item.storage?.kind === 'server_file'
                      ? formatFileSize(item.storage.sizeBytes)
                      : 'Metadata only'}
                  </span>
                </td>
                <td className="ma-vdr-col-shares">
                  <span className="ma-vdr-meta-strong">{linkedShares}</span>
                  <span>{linkedShares === 1 ? 'active link' : 'active links'}</span>
                </td>
                <td className="ma-vdr-col-updated">{formatDate(item.updatedAt || item.createdAt)}</td>
                <td className="ma-vdr-col-action">
                  <div className="ma-data-room-actions ma-vdr-row-actions">
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
                      Open
                    </Button>
                    <Button
                      variant="secondary"
                      disabled={!canManageDataRoom}
                      onClick={() => onToggleDownload(item)}
                    >
                      <LockKeyhole size={14} />
                    </Button>
                    <Button
                      variant="secondary"
                      disabled={!canReadAuditLog}
                      onClick={() => onExportDocumentAudit(item)}
                    >
                      <FileCheck2 size={14} />
                    </Button>
                    <Button
                      variant="secondary"
                      disabled={!canManageDataRoom || item.status === 'archived'}
                      onClick={() => onArchiveDocument(item)}
                    >
                      <Archive size={14} />
                    </Button>
                  </div>
                </td>
              </tr>
            );
          })}
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
    <div className="ma-vdr-table-viewport ma-data-room-table-scroll ceos-enterprise-table-wrap ma-vdr-shares-viewport">
      <table className="ma-data-room-table ma-vdr-table-compact ma-vdr-shares-table ceos-enterprise-table">
        <thead>
          <tr>
            <th>Document / Share</th>
            <th>Target</th>
            <th>Status</th>
            <th>Access</th>
            <th>Created</th>
            <th>Expiry</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {shares.map((item) => (
            <tr key={item.id}>
              <td className="ma-vdr-col-primary">
                <strong>{item.id}</strong>
                <span>{item.reportId ? `Report ${item.reportId}` : 'Unlinked share'}</span>
              </td>
              <td className="ma-vdr-col-meta">
                <span className="ma-vdr-meta-strong">{item.reportId || '—'}</span>
                <span>Authenticated link</span>
              </td>
              <td>
                <StatusBadge value={item.status} />
              </td>
              <td className="ma-vdr-col-access">
                <span className="ma-vdr-meta-strong">
                  {item.revokedAt ? 'Revoked' : item.status === 'active' ? 'Active' : normalizeStatus(item.status)}
                </span>
              </td>
              <td className="ma-vdr-col-updated">{formatDate(item.createdAt || item.expiresAt)}</td>
              <td className="ma-vdr-col-updated">{formatDate(item.expiresAt)}</td>
              <td className="ma-vdr-col-action">
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
    <div className="ma-vdr-table-viewport ma-data-room-table-scroll ceos-enterprise-table-wrap ma-vdr-audit-viewport">
      <table className="ma-data-room-table ma-vdr-table-compact ma-vdr-audit-table ceos-enterprise-table">
        <thead>
          <tr>
            <th>Time</th>
            <th>Actor</th>
            <th>Event</th>
            <th>Resource</th>
            <th>Result</th>
          </tr>
        </thead>

        <tbody>
          {auditLogs.map((item) => (
            <tr key={item.id}>
              <td className="ma-vdr-col-updated ma-vdr-audit-time">{formatDate(item.createdAt)}</td>
              <td className="ma-vdr-col-meta">
                <span className="ma-vdr-meta-strong">{item.userId || 'System'}</span>
              </td>
              <td className="ma-vdr-col-primary ma-vdr-audit-event">
                <strong>{item.action}</strong>
              </td>
              <td className="ma-vdr-col-meta ma-vdr-audit-resource">
                <span>{item.entityId || item.entityType || '—'}</span>
                {item.entityType ? <span>{item.entityType}</span> : null}
              </td>
              <td className="ma-vdr-col-access">
                <span className="ma-vdr-meta-strong">Recorded</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function DocumentControlRail({
  form,
  setForm,
  selectedFile,
  setSelectedFile,
  canManageDataRoom,
  isSubmitting,
  onSubmit
}) {
  return (
    <aside className="ma-data-room-panel ma-valuation-surface ma-vdr-command-rail">
      <div className="ma-vdr-rail-header">
        <h2>Document Control</h2>
        <p>Register controlled M&A material before external distribution.</p>
      </div>

      <div className="ma-vdr-rail-body">
        <form className="ma-data-room-form ma-vdr-rail-form" onSubmit={onSubmit}>
        <div className="ma-vdr-rail-section">
          <p className="ma-vdr-rail-section-label">Scope / Target</p>
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
          <div className="ma-data-room-policy-grid ma-vdr-rail-grid">
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
          </div>
        </div>

        <div className="ma-vdr-rail-section">
          <p className="ma-vdr-rail-section-label">Classification</p>
          <Select
            aria-label="Classification"
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
        </div>

        <div className="ma-vdr-rail-section">
          <p className="ma-vdr-rail-section-label">Access / Policy</p>
          <div className="ma-data-room-policy-grid ma-vdr-rail-grid">
            <Input
              className="ma-vdr-rail-date-field"
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
              className="ma-vdr-rail-date-field"
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
            <div className="ma-vdr-rail-toggle-row">
            <label
              className={`ma-data-room-checkbox ma-vdr-toggle-chip${
                form.allowDownload ? ' is-checked' : ''
              }`}
            >
              <input
                id="download-enabled-toggle"
                type="checkbox"
                checked={Boolean(form.allowDownload)}
                disabled={!canManageDataRoom}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    allowDownload: event.target.checked
                  }))
                }
              />
              <span className="ma-vdr-toggle-indicator" aria-hidden="true">
                {form.allowDownload ? (
                  <Check size={12} strokeWidth={3} />
                ) : null}
              </span>
              <span className="ma-vdr-toggle-label">Download enabled</span>
            </label>
            <label
              className={`ma-data-room-checkbox ma-vdr-toggle-chip${
                form.legalHold ? ' is-checked' : ''
              }`}
            >
              <input
                id="legal-hold-toggle"
                type="checkbox"
                checked={Boolean(form.legalHold)}
                disabled={!canManageDataRoom}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    legalHold: event.target.checked
                  }))
                }
              />
              <span className="ma-vdr-toggle-indicator" aria-hidden="true">
                {form.legalHold ? <Check size={12} strokeWidth={3} /> : null}
              </span>
              <span className="ma-vdr-toggle-label">Legal hold</span>
            </label>
            </div>
          </div>
        </div>

        <div className="ma-vdr-rail-section">
          <p className="ma-vdr-rail-section-label">Share Settings</p>
          <Input
            className="ma-vdr-rail-watermark-field"
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
        </div>

        <div className="ma-vdr-rail-section">
          <p className="ma-vdr-rail-section-label">Document Action</p>
          <div className="ma-data-room-file-input ma-vdr-file-upload">
            <span className="ma-vdr-file-field-label">Server-side VDR file</span>
            <label className="ma-vdr-file-upload-surface">
              <input
                id="ma-vdr-file"
                type="file"
                className="ma-vdr-file-native"
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
              <UploadCloud size={17} aria-hidden="true" />
              <span className="ma-vdr-file-upload-name">
                {selectedFile ? selectedFile.name : 'No file selected'}
              </span>
              <span className="ma-vdr-file-upload-action">Choose file</span>
            </label>
          </div>

          <Button type="submit" disabled={!canManageDataRoom} loading={isSubmitting}>
            {selectedFile ? <UploadCloud size={16} /> : <Plus size={16} />}
            {selectedFile ? 'Upload file' : 'Register document'}
          </Button>
        </div>
        </form>
      </div>
    </aside>
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
  const [activeView, setActiveView] = useState('documents');
  const [docSearch, setDocSearch] = useState('');
  const [docClassification, setDocClassification] = useState('all');
  const [docStatus, setDocStatus] = useState('all');
  const [docSort, setDocSort] = useState('updated_desc');

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
    const shareSummary = summarizeDataRoomShares(dataRoom.shares);
    const confidentialDocs = dataRoom.documents.filter(
      (item) => item.classification === 'confidential'
    ).length;
    const serverFiles = dataRoom.documents.filter(
      (item) => item.storage?.kind === 'server_file'
    ).length;
    const recentAudit = auditLogs.filter((item) => isWithinDays(item.createdAt, 7)).length;
    const expiringShares = dataRoom.shares.filter(
      (item) => isMaSecureShareActive(item) && isWithinDays(item.expiresAt, 7)
    ).length;

    return {
      documents: dataRoom.documents.length,
      activeShares: shareSummary.activeShares,
      confidentialDocs,
      serverFiles,
      recentAudit,
      expiringShares,
      revokedShares: shareSummary.revokedShares,
      totalShares: shareSummary.totalShares,
      totalAudit: auditLogs.length
    };
  }, [dataRoom, auditLogs]);

  const filteredDocuments = useMemo(() => {
    const query = docSearch.trim().toLowerCase();
    let rows = [...dataRoom.documents];

    if (query) {
      rows = rows.filter((item) => {
        const haystack = [
          item.title,
          item.id,
          item.reportId,
          item.folder,
          item.documentType,
          item.area,
          item.classification,
          item.status
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();
        return haystack.includes(query);
      });
    }

    if (docClassification !== 'all') {
      rows = rows.filter((item) => item.classification === docClassification);
    }

    if (docStatus !== 'all') {
      rows = rows.filter((item) => item.status === docStatus);
    }

    rows.sort((a, b) => {
      if (docSort === 'title_asc') return String(a.title).localeCompare(String(b.title));
      if (docSort === 'title_desc') return String(b.title).localeCompare(String(a.title));
      if (docSort === 'classification_asc') {
        return String(a.classification).localeCompare(String(b.classification));
      }
      if (docSort === 'updated_asc') {
        return new Date(a.updatedAt || a.createdAt) - new Date(b.updatedAt || b.createdAt);
      }
      return new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt);
    });

    return rows;
  }, [dataRoom.documents, docSearch, docClassification, docStatus, docSort]);

  const tabCounts = useMemo(
    () => ({
      documents: dataRoom.documents.length,
      shares: dataRoom.shares.length,
      audit: auditLogs.length
    }),
    [dataRoom.documents.length, dataRoom.shares.length, auditLogs.length]
  );

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
        selectedFile ? 'M&A VDR file uploaded' : 'M&A data room document registered'
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
      { type: 'application/json' }
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
        { type: 'application/json' }
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
    <div className="page">
      <main className="ma-executive-page ma-data-room-premium ma-data-room-page">
        <section className="ma-data-room-hero">
          <div className="ma-data-room-scene-atmo" aria-hidden="true" />
          <div className="ma-data-room-scene-glow" aria-hidden="true" />
          <div className="ma-data-room-vault-stage" aria-hidden="true">
            <MADataRoomControlFieldVisual />
          </div>
          <div className="ma-data-room-hero-grid">
            <div>
              <div className="ma-data-room-kicker">
                <FolderLock size={16} />
                M&A Enterprise Data Room
              </div>

              <h1 className="ma-data-room-title">
                <span className="ma-data-room-title-line">Controlled document</span>
                <span className="ma-data-room-title-line">distribution for</span>
                <span className="ma-data-room-title-line">confidential deal work.</span>
              </h1>

              <p className="ma-data-room-copy">
                Secure shares, report records, classification and revocation status are governed from the organization scope.
              </p>
            </div>

            <div className="ma-data-room-metrics-panel ma-valuation-surface">
              <div className="ma-data-room-metrics">
                <div className="ma-data-room-kpi ma-valuation-surface">
                  <div className="ma-data-room-metric-label">
                    <Archive size={15} />
                    Documents
                  </div>
                  <div className="ma-data-room-metric-value">{metrics.documents}</div>
                </div>

                <div className="ma-data-room-kpi ma-valuation-surface">
                  <div className="ma-data-room-metric-label">
                    <UploadCloud size={15} />
                    Server files
                  </div>
                  <div className="ma-data-room-metric-value">{metrics.serverFiles}</div>
                </div>

                <div className="ma-data-room-kpi ma-valuation-surface">
                  <div className="ma-data-room-metric-label">
                    <LockKeyhole size={15} />
                    Confidential
                  </div>
                  <div className="ma-data-room-metric-value">{metrics.confidentialDocs}</div>
                </div>

                <div className="ma-data-room-kpi ma-valuation-surface">
                  <div className="ma-data-room-metric-label">
                    <Link2 size={15} />
                    Active shares
                  </div>
                  <div className="ma-data-room-metric-value">{metrics.activeShares}</div>
                </div>
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
              <span>External circulation requires an explicit user action.</span>
            </div>
          </div>

          <div className="ma-data-room-control">
            <RefreshCw size={18} />
            <div>
              <strong>Revocation controls</strong>
              <span>Usable links can be revoked from the organization ledger.</span>
            </div>
          </div>
        </section>

        <section className="ma-vdr-command-center ma-valuation-surface" aria-label="Data room command center">
          <header className="ma-vdr-command-head">
            <p className="ma-vdr-command-kicker">M&A Private Data Room</p>
            <h2 className="ma-vdr-command-title">Data Room Command Center</h2>
          </header>

          <div className="ma-vdr-command-body">
            <DocumentControlRail
              form={form}
              setForm={setForm}
              selectedFile={selectedFile}
              setSelectedFile={setSelectedFile}
              canManageDataRoom={canManageDataRoom}
              isSubmitting={isSubmitting}
              onSubmit={handleSubmit}
            />

            <div className="ma-vdr-command-main">
              <CommandTabs activeView={activeView} counts={tabCounts} onChange={setActiveView} />

              {activeView === 'documents' ? (
                <div className="ma-vdr-command-view" role="tabpanel">
                  <ViewSummary
                    items={[
                      { label: 'Total documents', value: metrics.documents },
                      { label: 'Confidential', value: metrics.confidentialDocs },
                      { label: 'Active shares', value: metrics.activeShares },
                      { label: 'Recent activity', value: metrics.recentAudit }
                    ]}
                  />

                  <div className="ma-vdr-toolbar">
                    <label className="ma-vdr-toolbar-search">
                      <Search size={15} />
                      <input
                        type="search"
                        value={docSearch}
                        placeholder="Search documents"
                        onChange={(event) => setDocSearch(event.target.value)}
                      />
                    </label>

                    <Select
                      label="Classification"
                      value={docClassification}
                      options={[{ value: 'all', label: 'All classifications' }, ...CLASSIFICATION_OPTIONS]}
                      onChange={(event) => setDocClassification(event.target.value)}
                    />

                    <Select
                      label="Status"
                      value={docStatus}
                      options={[{ value: 'all', label: 'All statuses' }, ...STATUS_OPTIONS]}
                      onChange={(event) => setDocStatus(event.target.value)}
                    />

                    <Select
                      label="Sort"
                      value={docSort}
                      options={DOC_SORT_OPTIONS}
                      onChange={(event) => setDocSort(event.target.value)}
                    />

                    <div className="ma-vdr-toolbar-count">
                      {filteredDocuments.length} of {dataRoom.documents.length} documents
                    </div>
                  </div>

                  {isLoading ? (
                    <div className="ma-data-room-empty">Loading M&A data room.</div>
                  ) : (
                    <DataRoomTable
                      documents={filteredDocuments}
                      shares={dataRoom.shares}
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
              ) : null}

              {activeView === 'shares' ? (
                <div className="ma-vdr-command-view" role="tabpanel">
                  <ViewSummary
                    items={[
                      { label: 'Active', value: metrics.activeShares },
                      { label: 'Expiring', value: metrics.expiringShares },
                      { label: 'Revoked / inactive', value: metrics.revokedShares },
                      { label: 'Total', value: metrics.totalShares }
                    ]}
                  />

                  {isLoading ? (
                    <div className="ma-data-room-empty">Loading secure shares.</div>
                  ) : (
                    <SharesTable
                      shares={dataRoom.shares}
                      canRevokeShare={canRevokeShare}
                      onRevokeShare={handleRevokeShare}
                    />
                  )}
                </div>
              ) : null}

              {activeView === 'audit' ? (
                <div className="ma-vdr-command-view ma-vdr-audit-view" role="tabpanel">
                  <div className="ma-vdr-audit-head">
                    <p className="ma-vdr-view-lead">
                      Organization-scoped activity for cases, deals, reports, data room and secure shares.
                    </p>
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
                </div>
              ) : null}

              {error ? <div className="ma-data-room-empty ma-vdr-command-error">{error}</div> : null}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default MADataRoomPage;
