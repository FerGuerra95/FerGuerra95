import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowRight,
  CheckCircle2,
  Download,
  FileBadge,
  FileJson,
  History,
  Link2,
  ShieldAlert,
  ShieldCheck,
  TriangleAlert
} from 'lucide-react';
import { Card } from '../../../shared/components/ui/Card.jsx';
import { Badge } from '../../../shared/components/ui/Badge.jsx';
import { Button } from '../../../shared/components/ui/Button.jsx';
import { EmptyState } from '../../../shared/components/ui/EmptyState.jsx';
import { useNotifications } from '../../../app/providers/NotificationsProvider.jsx';
import { complianceAuditApi } from '../services/complianceAuditApi.js';
import { httpClient } from '../../../shared/services/httpClient.js';

const auditDetailCss = `
  .compliance-audit-page {
    width: min(1540px, 100%);
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 30px;
  }

  .audit-detail-hero,
  .audit-detail-panel,
  .audit-history-panel,
  .audit-rule-card {
    border: 1px solid rgba(148, 163, 184, 0.16);
    background:
      linear-gradient(135deg, rgba(255,255,255,0.060), rgba(255,255,255,0.018)),
      rgba(15, 23, 42, 0.74);
    box-shadow:
      0 24px 70px rgba(0, 0, 0, 0.22),
      inset 0 1px 0 rgba(255,255,255,0.040);
  }

  .audit-detail-hero {
    border-radius: 34px;
    padding: 34px;
    display: grid;
    grid-template-columns: minmax(0, 1.25fr) minmax(320px, 0.75fr);
    gap: 28px;
    align-items: stretch;
  }

  .audit-detail-title {
    margin: 0;
    max-width: 880px;
    font-size: clamp(36px, 4.6vw, 64px);
    line-height: 0.95;
    letter-spacing: -0.065em;
  }

  .audit-detail-copy {
    margin: 18px 0 0;
    max-width: 830px;
    color: rgba(203, 213, 225, 0.86);
    line-height: 1.72;
  }

  .audit-detail-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 24px;
  }

  .audit-badge-row {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    align-items: center;
    margin-bottom: 22px;
  }

  .audit-kicker {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 12px;
    color: rgba(148, 163, 184, 0.96);
    font-size: 11px;
    line-height: 1;
    text-transform: uppercase;
    letter-spacing: 0.14em;
  }

  .audit-detail-link {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    min-height: 38px;
    padding: 10px 13px;
    border-radius: 999px;
    color: rgba(226, 232, 240, 0.94);
    background: rgba(37, 99, 235, 0.15);
    border: 1px solid rgba(96, 165, 250, 0.24);
    text-decoration: none;
    font-size: 13px;
    font-weight: 850;
  }

  .audit-score-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
  }

  .audit-score-tile {
    min-width: 0;
    padding: 17px;
    border-radius: 19px;
    background: rgba(255,255,255,0.045);
    border: 1px solid rgba(255,255,255,0.075);
  }

  .audit-score-tile strong {
    display: block;
    margin-top: 8px;
    font-size: 24px;
    line-height: 1.12;
    overflow-wrap: anywhere;
  }

  .audit-layout {
    display: grid;
    grid-template-columns: minmax(280px, 0.34fr) minmax(0, 0.66fr);
    gap: 24px;
    align-items: start;
  }

  .audit-detail-panel,
  .audit-history-panel {
    border-radius: 28px;
    padding: 26px;
  }

  .audit-panel-head {
    display: flex;
    justify-content: space-between;
    gap: 18px;
    align-items: flex-start;
    margin-bottom: 18px;
  }

  .audit-panel-title {
    margin: 0;
    letter-spacing: -0.04em;
  }

  .audit-history-list,
  .audit-rule-list,
  .audit-evidence-list {
    display: grid;
    gap: 12px;
  }

  .audit-history-row {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    gap: 14px;
    padding: 14px;
    border-radius: 18px;
    color: rgba(226, 232, 240, 0.94);
    background: rgba(255,255,255,0.035);
    border: 1px solid rgba(255,255,255,0.070);
    text-decoration: none;
  }

  .audit-history-row.is-active {
    border-color: rgba(16, 185, 129, 0.34);
    background: rgba(16, 185, 129, 0.08);
  }

  .audit-history-row strong,
  .audit-rule-card strong {
    overflow-wrap: anywhere;
  }

  .audit-rule-card {
    border-radius: 22px;
    padding: 20px;
  }

  .audit-rule-top {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    gap: 16px;
    align-items: start;
  }

  .audit-rule-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 12px;
  }

  .audit-status {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    min-height: 30px;
    padding: 7px 10px;
    border-radius: 999px;
    font-size: 12px;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: 0;
  }

  .audit-status.passed {
    color: #86efac;
    background: rgba(22, 163, 74, 0.14);
    border: 1px solid rgba(34, 197, 94, 0.26);
  }

  .audit-status.failed,
  .audit-status.warning {
    color: #fde68a;
    background: rgba(146, 64, 14, 0.20);
    border: 1px solid rgba(245, 158, 11, 0.24);
  }

  .audit-status.not_applicable {
    color: #cbd5e1;
    background: rgba(148, 163, 184, 0.10);
    border: 1px solid rgba(148, 163, 184, 0.18);
  }

  .audit-evidence-card {
    padding: 15px;
    border-radius: 18px;
    background: rgba(255,255,255,0.035);
    border: 1px solid rgba(255,255,255,0.070);
  }

  .audit-evidence-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 9px;
    margin-top: 12px;
  }

  .audit-excerpt {
    margin: 10px 0 0;
    color: rgba(203, 213, 225, 0.82);
    line-height: 1.62;
  }

  .audit-empty-inline {
    padding: 16px;
    border-radius: 18px;
    color: rgba(203, 213, 225, 0.72);
    background: rgba(255,255,255,0.030);
    border: 1px solid rgba(255,255,255,0.060);
  }

  @media (max-width: 1100px) {
    .audit-detail-hero,
    .audit-layout {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 720px) {
    .audit-detail-hero,
    .audit-detail-panel,
    .audit-history-panel {
      padding: 22px;
    }

    .audit-score-grid,
    .audit-rule-top {
      grid-template-columns: 1fr;
    }
  }
`;

function normalizeAuditScore(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? Math.max(0, Math.min(100, Math.round(parsed))) : 0;
}

function getRiskLabel(score) {
  const safeScore = normalizeAuditScore(score);

  if (safeScore >= 76) return 'Critical';
  if (safeScore >= 56) return 'High';
  if (safeScore >= 31) return 'Medium';
  return 'Low';
}

function formatDate(value) {
  if (!value) return 'N/A';

  try {
    return new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(value));
  } catch {
    return 'N/A';
  }
}

function downloadJson(fileName, payload) {
  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: 'application/json'
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');

  anchor.href = url;
  anchor.download = fileName;
  anchor.click();
  URL.revokeObjectURL(url);
}

function getStatusIcon(status) {
  if (status === 'passed') return CheckCircle2;
  if (status === 'not_applicable') return ShieldCheck;
  return TriangleAlert;
}

function mapRuleStatusPresentation(status) {
  const normalized = String(status || '').toLowerCase();

  switch (normalized) {
    case 'passed':
      return { code: normalized, label: 'Pass', toneClass: 'passed' };
    case 'failed':
      return { code: normalized, label: 'Fail', toneClass: 'failed' };
    case 'not_applicable':
      return {
        code: normalized,
        label: 'Not applicable',
        toneClass: 'not_applicable'
      };
    case 'warning':
      return { code: normalized, label: 'Warning', toneClass: 'warning' };
    default:
      return { code: normalized, label: normalized || 'Unknown', toneClass: 'warning' };
  }
}

function StatusPill({ status }) {
  const Icon = getStatusIcon(status);
  const mapped = mapRuleStatusPresentation(status);

  return (
    <span className={`audit-status ${mapped.toneClass}`}>
      <Icon size={14} />
      {mapped.label}
    </span>
  );
}

function EvidenceLinkCard({ link, result }) {
  const citation = link?.citation || {};
  const evidenceId = citation.evidenceId || link?.evidenceId || '';
  const sourceUrl = citation.sourceUrl || '';
  const fallbackUrl = evidenceId
    ? `/compliance/evidence?evidenceId=${encodeURIComponent(evidenceId)}`
    : '/compliance/evidence';
  const sourceHref = sourceUrl || fallbackUrl;
  const isExternal = /^https?:\/\//i.test(sourceHref);

  function handleDownloadCitation() {
    downloadJson(`evidence-citation-${evidenceId || link.id}.json`, {
      evidenceId,
      ruleId: result.ruleId,
      ruleResultId: result.id,
      citation,
      linkStatus: link.linkStatus
    });
  }

  async function handleVaultSnapshot() {
    if (!evidenceId) return;

    try {
      const payload = await httpClient.get(`/evidence/${encodeURIComponent(evidenceId)}`);
      const envelope = payload?.data ?? payload;

      downloadJson(`evidence-vault-${evidenceId}.bundle.json`, {
        bundleVersion: 'ceo_os_evidence_vault_snapshot_v1',
        requestedAt: new Date().toISOString(),
        evidenceId,
        evidenceRecord: envelope
      });
    } catch {
      window.alert('No se pudo descargar la evidencia desde el Evidence Vault API.');
    }
  }

  return (
    <article className="audit-evidence-card">
      <strong>{citation.title || `Evidence ${evidenceId || link.id}`}</strong>

      <p className="audit-excerpt">
        {citation.excerpt || 'No excerpt is stored for this evidence item.'}
      </p>

      <div className="audit-rule-meta">
        <Badge>{citation.sourceType || 'document'}</Badge>
        <Badge>{link.linkStatus || 'linked'}</Badge>
        <Badge>{Math.round(Number(citation.confidence || 0) * 100)}% confidence</Badge>
      </div>

      <div className="audit-evidence-actions">
        <a
          className="audit-detail-link"
          href={sourceHref}
          target={isExternal ? '_blank' : undefined}
          rel={isExternal ? 'noreferrer' : undefined}
        >
          <Link2 size={14} />
          Source / download
        </a>

        <Button variant="secondary" type="button" disabled={!evidenceId} onClick={handleVaultSnapshot}>
          <Download size={14} />
          Evidence Vault snapshot
        </Button>

        <Button variant="secondary" type="button" onClick={handleDownloadCitation}>
          <FileJson size={14} />
          Citation JSON
        </Button>
      </div>
    </article>
  );
}

function AuditRuleCard({ result }) {
  const evidenceLinks = Array.isArray(result.evidenceLinks)
    ? result.evidenceLinks
    : [];

  return (
    <article className="audit-rule-card">
      <div className="audit-rule-top">
        <div>
          <strong>{result.title || result.ruleId}</strong>

          <p className="audit-excerpt">
            {result.explanation || 'Deterministic rule executed without narrative override.'}
          </p>
        </div>

        <StatusPill status={result.status} />
      </div>

      <div className="audit-rule-meta">
        <Badge>{result.framework || 'framework'}</Badge>
        <Badge>{result.controlRef || 'control'}</Badge>
        <Badge>{result.severity || 'medium'}</Badge>
        <Badge>{Number(result.scoreImpact || 0)} risk pts</Badge>
      </div>

      <div className="audit-evidence-list" style={{ marginTop: 15 }}>
        {evidenceLinks.length > 0 ? (
          evidenceLinks.map((link) => (
            <EvidenceLinkCard key={link.id} link={link} result={result} />
          ))
        ) : (
          <div className="audit-empty-inline">
            No Evidence Vault item was linked to this rule result.
          </div>
        )}
      </div>
    </article>
  );
}

function AuditHistory({ auditRuns, activeId }) {
  return (
    <Card className="audit-history-panel">
      <div className="audit-panel-head">
        <div>
          <div className="audit-kicker">
            <History size={14} />
            Audit ledger timeline
          </div>
          <h3 className="audit-panel-title">Historial de auditorías (ledger)</h3>
        </div>
      </div>

      <div className="audit-history-list">
        {auditRuns.map((item) => (
          <Link
            className={`audit-history-row ${item.id === activeId ? 'is-active' : ''}`}
            key={item.id}
            to={`/compliance/audit-runs/${item.id}`}
          >
            <div>
              <strong>{item.framework || 'all frameworks'}</strong>
              <div className="muted">{formatDate(item.createdAt)}</div>
            </div>
            <Badge>{getRiskLabel(item.score)}</Badge>
          </Link>
        ))}

        {auditRuns.length === 0 ? (
          <div className="audit-empty-inline">
            No audit run has been executed yet.
          </div>
        ) : null}
      </div>
    </Card>
  );
}

export function ComplianceAuditDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const notifications = useNotifications();
  const [auditRuns, setAuditRuns] = useState([]);
  const [selectedAudit, setSelectedAudit] = useState(null);
  const [isLoadingList, setIsLoadingList] = useState(true);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState('');

  const sortedAuditRuns = useMemo(
    () =>
      [...auditRuns].sort(
        (left, right) =>
          new Date(right.createdAt || 0).getTime() -
          new Date(left.createdAt || 0).getTime()
      ),
    [auditRuns]
  );
  const activeAuditId = id || sortedAuditRuns[0]?.id || '';
  const summary = selectedAudit?.payload || {};
  const riskScore = normalizeAuditScore(selectedAudit?.score);
  const evidenceCoverage = normalizeAuditScore(summary.evidenceCoverage);

  useEffect(() => {
    let cancelled = false;

    async function loadHistory() {
      setIsLoadingList(true);
      setError('');

      try {
        const items = await complianceAuditApi.listAuditRuns();

        if (!cancelled) {
          setAuditRuns(items);
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError.message || 'Audit history could not be loaded.');
        }
      } finally {
        if (!cancelled) setIsLoadingList(false);
      }
    }

    loadHistory();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadDetail() {
      if (!activeAuditId) {
        setSelectedAudit(null);
        return;
      }

      setIsLoadingDetail(true);
      setError('');

      try {
        const item = await complianceAuditApi.getAuditRun(activeAuditId);

        if (!cancelled) {
          setSelectedAudit(item);
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError.message || 'Audit detail could not be loaded.');
        }
      } finally {
        if (!cancelled) setIsLoadingDetail(false);
      }
    }

    loadDetail();

    return () => {
      cancelled = true;
    };
  }, [activeAuditId]);

  async function handleExportLedger() {
    if (!activeAuditId) return;

    setIsExporting(true);
    setError('');

    try {
      const ledger = await complianceAuditApi.exportAuditLedger(activeAuditId);
      downloadJson(
        `compliance-ledger-${activeAuditId}.simulated-signed.json`,
        ledger
      );
      notifications?.pushToast?.(
        'Ledger exported with deterministic digest + auditor sandbox simulated signature.'
      );
    } catch (exportError) {
      setError(exportError.message || 'Ledger export could not be generated.');
    } finally {
      setIsExporting(false);
    }
  }

  return (
    <div className="page">
      <style>{auditDetailCss}</style>

      <div className="compliance-audit-page">
        <section className="audit-detail-hero">
          <div>
            <div className="audit-badge-row">
              <Badge>Compliance Enterprise</Badge>
              <Badge>Evidence Vault</Badge>
              <Badge>Audit Ledger</Badge>
            </div>

            <h1 className="audit-detail-title">
              Compliance Audit Detail.
            </h1>

            <p className="audit-detail-copy">
              Rule-by-rule evidence trail for deterministic GDPR, ISO 27001,
              SOC 2 and CSDDD checks. Each result links back to Evidence Vault
              citations and can be exported as a JSON ledger with a reproducible SHA-256
              digest — supporting evidence packs for external reviewers (DSS tooling, human review expected).
            </p>

            <div className="audit-detail-actions">
              <Button
                variant="secondary"
                loading={isExporting}
                disabled={!activeAuditId}
                onClick={handleExportLedger}
              >
                <Download size={15} />
                Export ledger JSON
              </Button>

              <Link className="audit-detail-link" to="/compliance/dashboard">
                <ShieldCheck size={14} />
                Compliance dashboard
              </Link>

              <Link className="audit-detail-link" to="/dashboard">
                <ArrowRight size={14} />
                Command Center
              </Link>
            </div>
          </div>

          <div className="audit-score-grid">
            <div className="audit-score-tile">
              <div className="kpi-label">Legal risk score</div>
              <strong>{selectedAudit ? `${riskScore}/100` : 'N/A'}</strong>
            </div>

            <div className="audit-score-tile">
              <div className="kpi-label">Risk level</div>
              <strong>{selectedAudit ? getRiskLabel(riskScore) : 'N/A'}</strong>
            </div>

            <div className="audit-score-tile">
              <div className="kpi-label">Critical findings</div>
              <strong>{selectedAudit?.criticalFindings ?? 'N/A'}</strong>
            </div>

            <div className="audit-score-tile">
              <div className="kpi-label">Evidence coverage</div>
              <strong>{selectedAudit ? `${evidenceCoverage}%` : 'N/A'}</strong>
            </div>
          </div>
        </section>

        {error ? (
          <div className="audit-empty-inline">
            {error}
          </div>
        ) : null}

        <section className="audit-layout">
          <AuditHistory auditRuns={sortedAuditRuns} activeId={activeAuditId} />

          <Card className="audit-detail-panel">
            <div className="audit-panel-head">
              <div>
                <div className="audit-kicker">
                  <FileBadge size={14} />
                  Rule evidence breakdown
                </div>
                <h3 className="audit-panel-title">
                  {selectedAudit
                    ? `${selectedAudit.framework || 'all'} audit run`
                    : 'No audit selected'}
                </h3>
                <p className="muted" style={{ marginTop: 9 }}>
                  {selectedAudit
                    ? `Executed ${formatDate(selectedAudit.createdAt)}.`
                    : 'Run an audit from the Compliance dashboard to populate this ledger.'}
                </p>
              </div>

              <ShieldAlert size={22} />
            </div>

            {isLoadingList || isLoadingDetail ? (
              <div className="audit-empty-inline">Loading audit ledger...</div>
            ) : null}

            {!isLoadingList && !isLoadingDetail && !selectedAudit ? (
              <EmptyState
                icon={FileJson}
                title="No compliance audit run yet"
                description="Execute an enterprise audit run to create the persistent audit ledger."
                actionLabel="Open Compliance"
                onAction={() => navigate('/compliance/dashboard')}
              />
            ) : null}

            {selectedAudit ? (
              <div className="audit-rule-list">
                {(selectedAudit.results || []).map((result) => (
                  <AuditRuleCard key={result.id} result={result} />
                ))}
              </div>
            ) : null}
          </Card>
        </section>
      </div>
    </div>
  );
}

export default ComplianceAuditDetail;
