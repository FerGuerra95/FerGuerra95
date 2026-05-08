import React from 'react';
import {
  BarChart3,
  Building2,
  CheckCircle2,
  LineChart,
  Scale,
  TrendingUp
} from 'lucide-react';
import { Card } from '../../../shared/components/ui/Card.jsx';

const comparablesGridCss = `
  .ma-comparables-section {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .ma-comparables-header {
    position: relative;
    overflow: hidden;
    border-radius: 31px;
    padding: 30px;
    border: 1px solid rgba(148, 163, 184, 0.16);
    background:
      radial-gradient(circle at 0% 0%, rgba(59, 130, 246, 0.14), transparent 32%),
      radial-gradient(circle at 100% 0%, rgba(16, 185, 129, 0.10), transparent 30%),
      linear-gradient(135deg, rgba(255,255,255,0.062), rgba(255,255,255,0.022)),
      rgba(15, 23, 42, 0.68);
    box-shadow:
      0 24px 70px rgba(0, 0, 0, 0.21),
      inset 0 1px 0 rgba(255,255,255,0.035);
  }

  .ma-comparables-header::before {
    content: "";
    position: absolute;
    inset: 0;
    background:
      linear-gradient(rgba(255,255,255,0.024) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.024) 1px, transparent 1px);
    background-size: 44px 44px;
    mask-image: linear-gradient(to bottom, rgba(0,0,0,0.62), transparent 85%);
    pointer-events: none;
  }

  .ma-comparables-header-inner {
    position: relative;
    z-index: 1;
    display: flex;
    justify-content: space-between;
    gap: 24px;
    align-items: flex-start;
  }

  .ma-comparables-kicker {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 12px;
    font-size: 11px;
    line-height: 1;
    text-transform: uppercase;
    letter-spacing: 0.17em;
    color: rgba(148, 163, 184, 0.96);
  }

  .ma-comparables-header h2 {
    margin: 0;
    letter-spacing: -0.045em;
  }

  .ma-comparables-header p {
    max-width: 820px;
    margin: 11px 0 0;
    line-height: 1.68;
  }

  .ma-comparables-header-icon {
    flex: 0 0 auto;
    width: 48px;
    height: 48px;
    border-radius: 18px;
    display: grid;
    place-items: center;
    background: rgba(37, 99, 235, 0.16);
    border: 1px solid rgba(96, 165, 250, 0.24);
  }

  .ma-comparables-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 22px;
    align-items: stretch;
  }

  .ma-comparable-card {
    position: relative;
    overflow: hidden;
    min-height: 250px;
    border-radius: 30px;
    border: 1px solid rgba(148, 163, 184, 0.16);
    background:
      radial-gradient(circle at 100% 0%, rgba(16, 185, 129, 0.11), transparent 30%),
      linear-gradient(135deg, rgba(255,255,255,0.062), rgba(255,255,255,0.022)),
      rgba(15, 23, 42, 0.66);
    box-shadow:
      0 22px 62px rgba(0, 0, 0, 0.20),
      inset 0 1px 0 rgba(255,255,255,0.035);
    transition:
      transform .18s ease,
      border-color .18s ease,
      background .18s ease;
  }

  .ma-comparable-card:hover {
    transform: translateY(-3px);
    border-color: rgba(96, 165, 250, 0.25);
    background:
      radial-gradient(circle at 100% 0%, rgba(16, 185, 129, 0.14), transparent 30%),
      linear-gradient(135deg, rgba(255,255,255,0.078), rgba(255,255,255,0.03)),
      rgba(15, 23, 42, 0.78);
  }

  .ma-comparable-card::before {
    content: "";
    position: absolute;
    inset: 0;
    background:
      linear-gradient(rgba(255,255,255,0.020) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.020) 1px, transparent 1px);
    background-size: 42px 42px;
    mask-image: linear-gradient(to bottom, rgba(0,0,0,0.48), transparent 85%);
    pointer-events: none;
  }

  .ma-comparable-inner {
    position: relative;
    z-index: 1;
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 22px;
  }

  .ma-comparable-top {
    display: flex;
    justify-content: space-between;
    gap: 18px;
    align-items: flex-start;
  }

  .ma-comparable-title-wrap {
    min-width: 0;
  }

  .ma-comparable-name {
    margin: 10px 0 0;
    letter-spacing: -0.045em;
    overflow-wrap: anywhere;
  }

  .ma-comparable-icon {
    flex: 0 0 auto;
    width: 44px;
    height: 44px;
    border-radius: 17px;
    display: grid;
    place-items: center;
    background: rgba(16, 185, 129, 0.12);
    border: 1px solid rgba(16, 185, 129, 0.22);
    color: #86efac;
  }

  .ma-comparable-multiple-row {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 18px;
    padding: 20px;
    border-radius: 24px;
    background:
      linear-gradient(135deg, rgba(16, 185, 129, 0.105), rgba(59, 130, 246, 0.055));
    border: 1px solid rgba(16, 185, 129, 0.16);
  }

  .ma-comparable-multiple {
    font-size: 42px;
    font-weight: 850;
    line-height: 0.92;
    letter-spacing: -0.065em;
    color: #34d399;
  }

  .ma-comparable-multiple-label {
    max-width: 120px;
    text-align: right;
    color: rgba(148, 163, 184, 0.86);
    font-size: 11px;
    line-height: 1.35;
    text-transform: uppercase;
    letter-spacing: 0.12em;
  }

  .ma-comparable-note {
    margin: 0;
    color: var(--muted);
    line-height: 1.65;
  }

  .ma-comparable-footer {
    margin-top: auto;
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    padding-top: 18px;
    border-top: 1px solid rgba(148, 163, 184, 0.12);
  }

  .ma-comparable-chip {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    padding: 8px 10px;
    border-radius: 999px;
    background: rgba(255,255,255,0.052);
    border: 1px solid rgba(255,255,255,0.075);
    color: rgba(226, 232, 240, 0.88);
    font-size: 12px;
    font-weight: 720;
  }

  .ma-comparables-empty {
    border-radius: 30px;
    padding: 36px;
    border: 1px dashed rgba(148, 163, 184, 0.24);
    background:
      linear-gradient(135deg, rgba(255,255,255,0.045), rgba(255,255,255,0.018)),
      rgba(15, 23, 42, 0.58);
    text-align: center;
  }

  .ma-comparables-empty-icon {
    width: 58px;
    height: 58px;
    margin: 0 auto 18px;
    border-radius: 22px;
    display: grid;
    place-items: center;
    background: rgba(37, 99, 235, 0.14);
    border: 1px solid rgba(96, 165, 250, 0.22);
  }

  .ma-comparables-empty h3 {
    margin: 0;
    letter-spacing: -0.04em;
  }

  .ma-comparables-empty p {
    max-width: 560px;
    margin: 12px auto 0;
    line-height: 1.65;
  }

  @media (max-width: 1180px) {
    .ma-comparables-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  @media (max-width: 760px) {
    .ma-comparables-header {
      border-radius: 24px;
      padding: 24px;
    }

    .ma-comparables-header-inner {
      flex-direction: column;
    }

    .ma-comparables-grid {
      grid-template-columns: 1fr;
    }

    .ma-comparable-card {
      border-radius: 24px;
    }

    .ma-comparable-multiple-row {
      align-items: flex-start;
      flex-direction: column;
    }

    .ma-comparable-multiple-label {
      max-width: none;
      text-align: left;
    }
  }

  .ma-comparables-header,
  .ma-comparable-card,
  .ma-comparables-empty {
    background: rgba(15, 23, 42, 0.72) !important;
    background-image: none !important;
    border-color: rgba(148, 163, 184, 0.14) !important;
    box-shadow: none !important;
    transform: none !important;
  }

  .ma-comparables-header::before,
  .ma-comparable-card::before {
    content: none !important;
    display: none !important;
  }

  .ma-comparables-header-inner,
  .ma-comparables-grid,
  .ma-comparable-inner,
  .ma-comparable-top,
  .ma-comparable-title-wrap,
  .ma-comparable-footer,
  .ma-comparable-multiple-row,
  .ma-comparable-chip {
    background: transparent !important;
    background-image: none !important;
    border-color: rgba(148, 163, 184, 0.10) !important;
    box-shadow: none !important;
  }

  .ma-comparables-header h2,
  .ma-comparable-name,
  .ma-comparable-multiple,
  .ma-comparables-kicker,
  .ma-comparable-multiple-label {
    letter-spacing: 0 !important;
    text-shadow: none !important;
  }
`;

function getSafeComparables(comparables) {
  if (!Array.isArray(comparables)) return [];

  return comparables.filter(Boolean);
}

function getSafeMultiple(value) {
  const parsed = Number(value);

  if (!Number.isFinite(parsed)) return 0;

  return parsed;
}

export function ComparablesGrid({ comparables }) {
  const safeComparables = getSafeComparables(comparables);

  return (
    <section className="ma-comparables-section">
      <style>{comparablesGridCss}</style>

      <div className="ma-comparables-header">
        <div className="ma-comparables-header-inner">
          <div>
            <div className="ma-comparables-kicker">
              <Scale size={14} />
              Comparable intelligence
            </div>

            <h2>Market comparables</h2>

            <p className="muted">
              Lectura comparativa de múltiplos para contextualizar la valoración,
              reforzar el rango estimado y explicar la posición del activo frente
              a referencias de mercado.
            </p>
          </div>

          <div className="ma-comparables-header-icon">
            <LineChart size={20} />
          </div>
        </div>
      </div>

      {safeComparables.length === 0 ? (
        <div className="ma-comparables-empty">
          <div className="ma-comparables-empty-icon">
            <BarChart3 size={24} />
          </div>

          <h3>Sin comparables disponibles</h3>

          <p className="muted">
            Selecciona sector y actualiza valoración para activar la lectura
            comparativa de múltiplos.
          </p>
        </div>
      ) : (
        <div className="ma-comparables-grid">
          {safeComparables.map((item, index) => {
            const multiple = getSafeMultiple(item.multiple);
            const name = item.name || `Comparable ${index + 1}`;
            const note =
              item.note ||
              'Referencia de mercado utilizada para contextualizar el rango de valoración.';

            return (
              <Card key={`${name}-${index}`} className="ma-comparable-card">
                <div className="ma-comparable-inner">
                  <div className="ma-comparable-top">
                    <div className="ma-comparable-title-wrap">
                      <div className="kpi-label">Comparable</div>

                      <h3 className="ma-comparable-name">{name}</h3>
                    </div>

                    <div className="ma-comparable-icon">
                      <Building2 size={18} />
                    </div>
                  </div>

                  <div className="ma-comparable-multiple-row">
                    <div className="ma-comparable-multiple">
                      x{multiple.toFixed(2)}
                    </div>

                    <div className="ma-comparable-multiple-label">
                      Market multiple
                    </div>
                  </div>

                  <p className="ma-comparable-note">{note}</p>

                  <div className="ma-comparable-footer">
                    <span className="ma-comparable-chip">
                      <TrendingUp size={13} />
                      Valuation input
                    </span>

                    <span className="ma-comparable-chip">
                      <CheckCircle2 size={13} />
                      Benchmark
                    </span>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </section>
  );
}
