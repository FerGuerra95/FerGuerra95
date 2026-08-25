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
      <div>
        <span>{label}</span>
        <strong className="ma-val-financial-figure">{value}</strong>
      </div>
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

export function ValuationDealStructurePanel({ derived, settings }) {
  const normalizedEbitda = readNumber(derived, ['normalizedEbitda']);
  const adjustedMultiple = readNumber(derived, ['adjustedMultiple']);
  const evBase = readNumber(derived, ['evBase', 'enterpriseValue']);
  const netDebt = readNumber(derived, ['netDebt']);
  const equityBase = readNumber(derived, ['equityBase', 'equityValue']);
  const netProceeds = readNumber(derived, ['netProceeds']);
  const qualityScore = readNumber(derived, ['qualityScore']);
  const riskLabel = derived?.riskLevel?.label || derived?.riskLevel || 'Moderate';
  const reportCurrency =
    settings?.reportCurrency || derived?.reportCurrency || derived?.currency || 'EUR';

  return (
    <section className="ma-premium-deal-card ma-valuation-deal-structure ma-valuation-value-ledger ma-valuation-surface">
      <div className="ma-premium-deal-inner">
        <div className="ma-premium-deal-header">
          <div>
            <div className="ma-kicker">
              <BarChart3 size={14} />
              Deal Structure
            </div>
            <h3>Clear, defensible closing structure.</h3>
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
              <h4>Value ledger — closing structure</h4>
              <p className="muted">
                Committee-format economic bridge: enterprise value, debt/cash
                adjustments, shareholder value and estimated proceeds.
              </p>
            </div>
            <div className="ma-closing-label">
              <CheckCircle2 size={14} />
              Executive view
            </div>
          </div>

          <div className="ma-bridge-list ma-bridge-list-open ma-value-ledger-build">
            <BridgeRow
              number="01"
              title="Adjusted DSS enterprise value"
              description="Normalized EBITDA × adjusted multiple (sector, risk, quality, compliance)."
              value={formatCurrencyValue(evBase, reportCurrency)}
              meta={`${formatCurrencyValue(normalizedEbitda, reportCurrency)} x ${formatMultipleValue(adjustedMultiple)}`}
            />
            <BridgeRow
              number="02"
              title="Net debt"
              description="Bridge from enterprise value toward equity (debt minus cash)."
              value={formatCurrencyValue(netDebt, reportCurrency)}
              meta="Net financial debt / cash"
            />
            <BridgeRow
              number="03"
              title="Adjusted equity value"
              description="Includes net debt and working capital adjustment — not the simple Golden equity benchmark."
              value={formatCurrencyValue(equityBase, reportCurrency)}
              meta="Live engine · adjusted bridge"
            />
            <BridgeRow
              number="04"
              title="Estimated net proceeds"
              description="Product waterfall output after fees and taxes — not simple seller-cash distribution."
              value={formatCurrencyValue(netProceeds, reportCurrency)}
              meta="After fees/taxes · indicative DSS"
            />
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
    <section className="ma-traceability-panel ma-valuation-evidence-ledger ma-valuation-executive-ledger ma-valuation-surface">
      <div className="ma-panel-header">
        <div>
          <div className="ma-kicker">
            <ShieldCheck size={14} />
            Committee readiness
          </div>
          <h3>Committee readiness checklist</h3>
          <p className="muted">
            Critical controls linked to case documents. Review coverage before export or
            committee circulation.
          </p>
        </div>
        <div className="ma-traceability-score">
          <span className="ma-val-financial-figure">{coverage}%</span>
          <small>evidence coverage</small>
        </div>
      </div>

      <div className="ma-traceability-ledger ma-traceability-ledger-premium ma-evidence-checklist-table ma-committee-check-list">
        {sources.map((source) => {
          const docCount = source.documentCount || 0;
          const hasDocs =
            Array.isArray(source.documents) && source.documents.length > 0;
          const evidenceLine = hasDocs
            ? source.documents
                .map((document) => document.title)
                .filter(Boolean)
                .join(' · ')
            : `Required: ${(source.requiredDocuments || []).join(', ') || 'source evidence'}`;

          return (
            <article
              key={source.sourceId}
              className="ma-evidence-checklist-row ma-evidence-ledger-row ma-evidence-ledger-row-premium ma-valuation-ledger ma-committee-check-unit"
            >
              <div className="ma-committee-check-main">
                <strong className="ma-evidence-ledger-title">{source.label}</strong>
                <p className="ma-committee-check-explain">{source.sourceType}</p>
                <p className="ma-committee-check-source">
                  <span className="ma-evidence-ledger-label">Source / evidence</span>
                  <span className="ma-evidence-ledger-value">{evidenceLine}</span>
                </p>
              </div>

              <div className="ma-committee-check-rail" aria-label="Control metadata">
                <div className="ma-committee-check-rail-item">
                  <span className="ma-evidence-ledger-label">Formula / reference</span>
                  <code className="ma-traceability-formula-ref">{source.sourceId}</code>
                </div>
                <div className="ma-committee-check-rail-item">
                  <span className="ma-evidence-ledger-label">Coverage</span>
                  <span className="ma-evidence-ledger-value">
                    {docCount} doc(s) linked
                  </span>
                </div>
                <div className="ma-committee-check-rail-item ma-committee-check-status">
                  <span className="ma-evidence-ledger-label">Status</span>
                  <span className="ma-traceability-status-label">
                    {hasDocs ? 'Linked' : 'Pending'}
                  </span>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <div className="ma-traceability-footer">
        <CheckCircle2 size={16} />
        <span>
          {summary.linked || 0}/{summary.total || sources.length} controls linked to
          documentation. Human review required before external circulation.
        </span>
      </div>
    </section>
  );
}
