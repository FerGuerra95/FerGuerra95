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
    <div className="ma-premium-metric ma-valuation-kpi">
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
    <div className="ma-bridge-row ma-valuation-ledger">
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
            <h3>Estructura de cierre clara, amplia y defendible.</h3>
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

        <div className="ma-premium-metrics-grid">
          <MetricBox
            label="EBITDA normalizado"
            value={formatCurrencyValue(normalizedEbitda, reportCurrency)}
            hint="Base operativa ajustada"
          />
          <MetricBox
            label="Múltiplo ajustado"
            value={formatMultipleValue(adjustedMultiple)}
            hint="Riesgo, calidad y sector"
          />
          <MetricBox
            label="Quality score"
            value={formatScoreValue(qualityScore)}
            hint="Lectura de calidad del activo"
          />
          <MetricBox
            label="Risk level"
            value={String(riskLabel)}
            hint="Señal ejecutiva de riesgo"
          />
        </div>

        <div className="ma-closing-structure-box">
          <div className="ma-closing-structure-title">
            <div>
              <h4>Value ledger — estructura de cierre</h4>
              <p className="muted">
                Recorrido económico del deal en formato comité: valoración de empresa,
                ajustes de deuda/caja, valor para accionistas y proceeds estimados.
              </p>
            </div>
            <div className="ma-closing-badge">
              <CheckCircle2 size={14} />
              Executive view
            </div>
          </div>

          <div className="ma-bridge-list ma-bridge-list-premium">
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
              meta="Deuda financiera neta / caja"
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
              <strong>Uso recomendado</strong>
              <p className="muted">
                Internal decision-support summary only. Not a fairness opinion. Validate
                assumptions before committee, buyer or seller discussions.
              </p>
            </div>
            <div className="ma-closing-arrow">
              <ArrowRight size={22} />
            </div>
            <div className="ma-closing-footer-card">
              <strong>Próximo paso</strong>
              <p className="muted">
                Validar deuda, caja, ajustes normalizados, concentración de clientes y
                documentación soporte antes de emitir conclusión.
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
            Evidence Control
          </div>
          <h3>Control documental de comite.</h3>
          <p className="muted">
            Fuentes criticas vinculadas a documentos del caso, con cobertura visible
            antes de exportar o elevar conclusiones.
          </p>
        </div>
        <div className="ma-traceability-score">
          <span className="ma-val-financial-figure">{coverage}%</span>
          <small>evidence coverage</small>
        </div>
      </div>

      <div className="ma-traceability-ledger ma-traceability-ledger-premium">
        {sources.map((source) => {
          const docCount = source.documentCount || 0;
          const hasDocs =
            Array.isArray(source.documents) && source.documents.length > 0;

          return (
            <article key={source.sourceId} className="ma-evidence-ledger-row ma-evidence-ledger-row-premium ma-valuation-ledger ma-valuation-surface">
              <div className="ma-evidence-ledger-row-head">
                <div>
                  <div className="kpi-label">Control</div>
                  <strong className="ma-evidence-ledger-title">{source.label}</strong>
                </div>
                <span className="ma-traceability-status-chip">
                  {hasDocs ? 'Linked' : 'Pending'}
                </span>
              </div>

              <div className="ma-evidence-ledger-body">
                <div className="ma-evidence-ledger-field">
                  <span className="ma-evidence-ledger-label">What we check</span>
                  <span className="ma-evidence-ledger-value">{source.sourceType}</span>
                </div>

                <div className="ma-evidence-ledger-field">
                  <span className="ma-evidence-ledger-label">Source / evidence</span>
                  <div className="ma-traceability-docs">
                    {hasDocs ? (
                      source.documents.map((document) => (
                        <span key={document.id || document.title}>
                          {document.title}
                        </span>
                      ))
                    ) : (
                      <span className="ma-traceability-docs-required">
                        Required:{' '}
                        {(source.requiredDocuments || []).join(', ') ||
                          'source evidence'}
                      </span>
                    )}
                  </div>
                </div>

                <div className="ma-evidence-ledger-field">
                  <span className="ma-evidence-ledger-label">Formula / reference</span>
                  <code className="ma-traceability-formula-chip">{source.sourceId}</code>
                </div>

                <div className="ma-evidence-ledger-field ma-evidence-ledger-field-meta">
                  <span className="ma-evidence-ledger-label">Coverage</span>
                  <span className="ma-evidence-ledger-value">
                    {docCount} doc(s) linked
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
          {summary.linked || 0}/{summary.total || sources.length} controles con documento
          vinculado. Validacion humana requerida para circulacion externa.
        </span>
      </div>
    </section>
  );
}
