import React from 'react';
import {
  BarChart3,
  CheckCircle2,
  LineChart,
  Scale,
  TrendingUp
} from 'lucide-react';

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
    <section className="ma-comparables-shell ma-valuation-comparables-module ma-valuation-surface">
      <div className="ma-comparables-shell-header">
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
        <div className="ma-comparables-ledger ma-comparables-ledger-premium" role="list">
          {safeComparables.map((item, index) => {
            const multiple = getSafeMultiple(item.multiple);
            const name = item.name || `Comparable ${index + 1}`;
            const note =
              item.note ||
              'Referencia de mercado utilizada para contextualizar el rango de valoración.';

            return (
              <article
                key={`${name}-${index}`}
                className="ma-comparable-row ma-comparable-row-premium ma-comparable-card-horizontal ma-valuation-surface ma-valuation-comparable-card"
                role="listitem"
              >
                <div className="ma-comparable-card-head">
                  <div className="ma-comparable-card-copy">
                    <h3 className="ma-comparable-name">{name}</h3>
                    <p className="ma-comparable-note">{note}</p>
                  </div>

                  <div className="ma-comparable-multiple-block">
                    <div className="ma-comparable-multiple ma-val-financial-figure">
                      x{multiple.toFixed(2)}
                    </div>
                    <div className="ma-comparable-multiple-label">
                      Market multiple
                    </div>
                  </div>
                </div>

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
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
