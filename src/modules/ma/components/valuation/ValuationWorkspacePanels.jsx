import React from 'react';
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  ShieldCheck
} from 'lucide-react';
import { formatCurrency } from '../../../../shared/utils/formatCurrency.js';

function readNumber(source, keys, fallback = 0) {
  for (const key of keys) {
    const value = source?.[key];
    const parsed = Number(value);

    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return fallback;
}

function formatCurrencyValue(value, currency = 'EUR') {
  return formatCurrency(value, currency);
}

function formatMultipleValue(value) {
  const parsed = Number(value);

  if (!Number.isFinite(parsed) || parsed <= 0) {
    return '0.0x';
  }

  return `${parsed.toFixed(1)}x`;
}

function formatScoreValue(value) {
  const parsed = Number(value);

  if (!Number.isFinite(parsed)) {
    return '0%';
  }

  const normalized = parsed <= 1 ? parsed * 100 : parsed;

  return `${Math.round(normalized)}%`;
}

function MetricBox({ label, value, hint }) {
  return (
    <div className="ma-premium-stat">
      <span>{label}</span>
      <strong className="ma-val-financial-figure">{value}</strong>
      <small>{hint}</small>
    </div>
  );
}

function BridgeRow({ number, title, description, value, meta }) {
  return (
    <div className="ma-bridge-row ma-valuation-ledger ma-valuation-bridge-step">
      <div className="ma-bridge-number">{number}</div>
      <div className="ma-bridge-copy">
        <strong>{title}</strong>
        <p className="muted">{description}</p>
      </div>
      <div className="ma-bridge-value">
        <strong className="ma-val-financial-figure">{value}</strong>
        <span>{meta}</span>
      </div>
    </div>
  );
}

export const VALUATION_LEDGER_TITLE = 'Value ledger — equity bridge';

export function getValuationEquityBridgeRows(derived = {}, settings = {}) {
  const normalizedEbitda = readNumber(derived, ['normalizedEbitda']);
  const adjustedMultiple = readNumber(derived, ['adjustedMultiple']);
  const evBase = readNumber(derived, ['evBase', 'enterpriseValue']);
  const netDebt = readNumber(derived, ['netDebt']);
  const wcAdjustment = readNumber(derived, [
    'wcAdjustment',
    'workingCapitalAdjustment'
  ]);
  const equityBase = readNumber(derived, ['equityBase', 'equityValue']);
  const netProceeds = readNumber(derived, ['netProceeds']);
  const reportCurrency =
    settings?.reportCurrency || derived?.reportCurrency || derived?.currency || 'EUR';

  return [
    {
      id: 'enterprise',
      number: '01',
      title: 'Adjusted DSS enterprise value',
      description:
        'Normalized EBITDA × adjusted multiple (sector, risk, quality, compliance).',
      numericValue: evBase,
      value: formatCurrencyValue(evBase, reportCurrency),
      meta: `${formatCurrencyValue(normalizedEbitda, reportCurrency)} x ${formatMultipleValue(adjustedMultiple)}`
    },
    {
      id: 'netDebt',
      number: '02',
      title: 'Net debt',
      description: 'Bridge from enterprise value toward equity (debt minus cash).',
      numericValue: netDebt,
      value: formatCurrencyValue(netDebt, reportCurrency),
      meta: 'Net financial debt / cash'
    },
    {
      id: 'workingCapital',
      number: '03',
      title: 'Working capital adjustment',
      description:
        'Actual working capital minus target working capital. Applied to adjusted equity.',
      numericValue: wcAdjustment,
      value: formatCurrencyValue(wcAdjustment, reportCurrency),
      meta: 'actualWC − targetWC'
    },
    {
      id: 'equity',
      number: '04',
      title: 'Adjusted equity value',
      description:
        'Enterprise value − net debt + working capital adjustment — not the simple Golden equity benchmark.',
      numericValue: equityBase,
      value: formatCurrencyValue(equityBase, reportCurrency),
      meta: 'Live engine · adjusted bridge'
    },
    {
      id: 'proceeds',
      number: '05',
      title: 'Estimated net proceeds',
      description:
        'Product waterfall output after fees and taxes — not simple seller-cash distribution.',
      numericValue: netProceeds,
      value: formatCurrencyValue(netProceeds, reportCurrency),
      meta: 'After fees/taxes · indicative DSS'
    }
  ];
}

export function ValuationDealStructurePanel({ derived, settings }) {
  const normalizedEbitda = readNumber(derived, ['normalizedEbitda']);
  const adjustedMultiple = readNumber(derived, ['adjustedMultiple']);
  const qualityScore = readNumber(derived, ['qualityScore']);
  const riskLabel = derived?.riskLevel?.label || derived?.riskLevel || 'Moderate';
  const reportCurrency =
    settings?.reportCurrency || derived?.reportCurrency || derived?.currency || 'EUR';

  return (
    <section className="ma-premium-deal-card ma-valuation-deal-structure ma-valuation-value-ledger ma-valuation-surface">
      <div className="ma-ma-panel-ambient" aria-hidden="true" />
      <div className="ma-premium-deal-inner">
        <div className="ma-premium-deal-header">
          <div>
            <div className="ma-kicker">
              <BarChart3 size={14} />
              Deal Structure
            </div>
            <h3>Clear, defensible equity bridge.</h3>
            <p className="muted">
              Live engine bridge: normalized EBITDA → adjusted DSS enterprise value →
              net debt and working capital → adjusted equity → estimated net proceeds
              after fees/taxes. Not simple Golden benchmarks.
            </p>
          </div>
          <div className="ma-premium-deal-icon">
            <ShieldCheck size={24} />
          </div>
        </div>

        <div className="ma-premium-stats-grid">
          <MetricBox
            label="Normalized EBITDA"
            value={formatCurrencyValue(normalizedEbitda, reportCurrency)}
            hint="Adjusted operating base"
          />
          <MetricBox
            label="Adjusted multiple"
            value={formatMultipleValue(adjustedMultiple)}
            hint="Risk, quality and sector"
          />
          <MetricBox
            label="Quality score"
            value={formatScoreValue(qualityScore)}
            hint="Asset quality read"
          />
          <MetricBox
            label="Risk level"
            value={String(riskLabel)}
            hint="Executive risk signal"
          />
        </div>

        <div className="ma-closing-structure-box">
          <div className="ma-closing-structure-title">
            <div>
              <h4>{VALUATION_LEDGER_TITLE}</h4>
              <p className="muted">
                Committee-format economic bridge: enterprise value, net debt,
                working capital adjustment, shareholder value and estimated proceeds.
              </p>
            </div>
            <div className="ma-closing-label">
              <CheckCircle2 size={14} />
              Executive view
            </div>
          </div>

          <div className="ma-bridge-list ma-bridge-list-open ma-value-ledger-build">
            {getValuationEquityBridgeRows(derived, settings).map((row) => (
              <BridgeRow
                key={row.id}
                number={row.number}
                title={row.title}
                description={row.description}
                value={row.value}
                meta={row.meta}
              />
            ))}
          </div>

          <div className="ma-closing-footer">
            <div className="ma-closing-footer-card">
              <strong>Recommended use</strong>
              <p className="muted">
                Internal decision-support summary only. Not a fairness opinion. Validate
                assumptions before committee, buyer or seller discussions.
              </p>
            </div>
            <div className="ma-closing-arrow">
              <ArrowRight size={22} />
            </div>
            <div className="ma-closing-footer-card">
              <strong>Next step</strong>
              <p className="muted">
                Validate debt, cash, normalized adjustments, client concentration and
                supporting documentation before issuing conclusions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function ValuationEvidenceLedgerPanel({ derived }) {
  const sources = Array.isArray(derived?.decisionSourcePack)
    ? derived.decisionSourcePack
    : [];
  const summary = derived?.decisionSourceSummary || {};
  const coverage = Number.isFinite(Number(summary.coverage))
    ? Number(summary.coverage)
    : 0;

  return (
    <section className="ma-traceability-panel ma-valuation-evidence-ledger ma-valuation-executive-ledger ma-valuation-surface ma-committee-readiness">
      <div className="ma-ma-panel-ambient" aria-hidden="true" />
      <div className="ma-panel-header ma-committee-readiness-header">
        <div>
          <div className="ma-kicker">
            <ShieldCheck size={14} />
            Committee readiness
          </div>
          <h3>Committee readiness checklist</h3>
          <p className="muted ma-committee-readiness-lead">
            Control evidence for committee circulation. Coverage reflects linked
            documents — not engine calculation status. Human review required before
            external use.
          </p>
        </div>
        <div className="ma-traceability-score ma-committee-coverage-score" aria-label="Evidence coverage">
          <span className="ma-val-financial-figure">{coverage}%</span>
          <small>Evidence coverage</small>
        </div>
      </div>

      <div className="ma-traceability-ledger ma-traceability-ledger-premium ma-evidence-checklist-table ma-committee-check-list">
        {sources.map((source) => {
          const docCount = source.documentCount || 0;
          const hasDocs =
            Array.isArray(source.documents) && source.documents.length > 0;
          const statusLabel = hasDocs ? 'Linked' : 'Pending';
          const evidenceLine = hasDocs
            ? source.documents
                .map((document) => document.title)
                .filter(Boolean)
                .join(' · ')
            : `Required: ${(source.requiredDocuments || []).join(', ') || 'source evidence'}`;

          return (
            <article
              key={source.sourceId}
              className={`ma-evidence-checklist-row ma-evidence-ledger-row ma-evidence-ledger-row-premium ma-valuation-ledger ma-committee-check-unit ${hasDocs ? 'is-linked' : 'is-pending'}`}
            >
              <div className="ma-committee-col ma-committee-col-control">
                <strong className="ma-evidence-ledger-title">{source.label}</strong>
                {source.sourceType ? (
                  <p className="ma-committee-check-category">{source.sourceType}</p>
                ) : null}
                <div className="ma-committee-meta-row ma-committee-meta-evidence">
                  <span className="ma-evidence-ledger-label">Source / evidence</span>
                  <span className="ma-evidence-ledger-value">{evidenceLine}</span>
                </div>
              </div>

              <div className="ma-committee-col ma-committee-col-formula ma-committee-meta-formula">
                <span className="ma-evidence-ledger-label">Formula / reference</span>
                <code className="ma-traceability-formula-ref">{source.sourceId}</code>
              </div>

              <div className="ma-committee-col ma-committee-col-coverage">
                <span className="ma-evidence-ledger-label">Coverage</span>
                <span className="ma-evidence-ledger-value">
                  {docCount} doc(s) linked
                </span>
              </div>

              <div className="ma-committee-col ma-committee-col-status">
                <span
                  className={`ma-committee-status-chip ${hasDocs ? 'is-linked' : 'is-pending'}`}
                >
                  {statusLabel}
                </span>
              </div>
            </article>
          );
        })}
      </div>

      <div className="ma-traceability-footer ma-committee-readiness-footer">
        <CheckCircle2 size={16} />
        <span>
          {summary.linked || 0}/{summary.total || sources.length} controls linked to
          documentation. Human review required before external circulation.
        </span>
      </div>
    </section>
  );
}
