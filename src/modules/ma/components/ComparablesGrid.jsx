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

export function ComparablesGrid({ comparables, selectedMultiple = null }) {
  const safeComparables = getSafeComparables(comparables);
  const multiples = safeComparables.map((item) => getSafeMultiple(item.multiple));
  const minMultiple = multiples.length ? Math.min(...multiples) : 0;
  const maxMultiple = multiples.length ? Math.max(...multiples) : 0;
  const selected = getSafeMultiple(selectedMultiple);
  const hasRange = multiples.length > 0 && maxMultiple > minMultiple;
  const selectedPct = hasRange
    ? Math.max(0, Math.min(100, ((selected - minMultiple) / (maxMultiple - minMultiple)) * 100))
    : 50;

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
            Comparable multiples to contextualize the valuation range and position the asset
            against market references.
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

          <h3>No comparables available</h3>
          <p className="muted">
            Select a sector and run valuation to activate comparable multiple context.
          </p>
        </div>
      ) : (
        <>
          {hasRange && selected > 0 ? (
            <div className="ma-comparables-range" aria-label="Selected multiple within market range">
              <div className="ma-comparables-range-label">Selected multiple vs market range</div>
              <div className="ma-comparables-range-track">
                <span
                  className="ma-comparables-range-marker"
                  style={{ left: `${selectedPct}%` }}
                  aria-hidden="true"
                />
              </div>
              <div className="ma-comparables-range-scale">
                <span>x{minMultiple.toFixed(2)}</span>
                <span className="is-selected">x{selected.toFixed(2)} selected</span>
                <span>x{maxMultiple.toFixed(2)}</span>
              </div>
            </div>
          ) : null}

          <div
            className="ma-comparables-ledger ma-comparables-list-open"
            role="list"
          >
            {safeComparables.map((item, index) => {
              const multiple = getSafeMultiple(item.multiple);
              const name = item.name || `Comparable ${index + 1}`;
              const note =
                item.note ||
                'Market reference used to contextualize the valuation range.';

              return (
                <article
                  key={`${name}-${index}`}
                  className="ma-comparable-open-item"
                  role="listitem"
                >
                  <div className="ma-comparable-open-head">
                    <div className="ma-comparable-open-copy">
                      <h3 className="ma-comparable-name">{name}</h3>
                      <p className="ma-comparable-note">{note}</p>
                    </div>

                    <div
                      className="ma-comparable-open-multiple"
                      aria-label="Market multiple"
                    >
                      <div className="ma-comparable-multiple ma-val-financial-figure">
                        x{multiple.toFixed(2)}
                      </div>
                      <div className="ma-comparable-multiple-label">
                        Market multiple
                      </div>
                    </div>
                  </div>

                  <div className="ma-comparable-open-actions">
                    <span className="ma-comparable-action">
                      <TrendingUp size={13} />
                      Valuation input
                    </span>

                    <span className="ma-comparable-action">
                      <CheckCircle2 size={13} />
                      Benchmark
                    </span>
                  </div>
                </article>
              );
            })}
          </div>
        </>
      )}
    </section>
  );
}
