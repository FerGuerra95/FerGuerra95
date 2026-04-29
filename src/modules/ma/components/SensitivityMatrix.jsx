import React from 'react';
import {
  Activity,
  BarChart3,
  Gauge,
  Grid3X3,
  MoveDiagonal2,
  TrendingDown,
  TrendingUp
} from 'lucide-react';
import { Card } from '../../../shared/components/ui/Card.jsx';

const MULTIPLE_STEPS = [-1, -0.5, 0, 0.5, 1];
const EBIT_STEPS = [-10, -5, 0, 5, 10];

const sensitivityMatrixCss = `
  .ma-sensitivity-card {
    position: relative;
    overflow: hidden;
    border-radius: 31px;
    border: 1px solid rgba(148, 163, 184, 0.16);
    background:
      radial-gradient(circle at 0% 0%, rgba(59, 130, 246, 0.14), transparent 32%),
      radial-gradient(circle at 100% 0%, rgba(16, 185, 129, 0.10), transparent 30%),
      linear-gradient(135deg, rgba(255,255,255,0.064), rgba(255,255,255,0.022)),
      rgba(15, 23, 42, 0.68);
    box-shadow:
      0 24px 70px rgba(0, 0, 0, 0.21),
      inset 0 1px 0 rgba(255,255,255,0.035);
  }

  .ma-sensitivity-card::before {
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

  .ma-sensitivity-inner {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .ma-sensitivity-header {
    display: flex;
    justify-content: space-between;
    gap: 22px;
    align-items: flex-start;
    padding-bottom: 20px;
    border-bottom: 1px solid rgba(148, 163, 184, 0.14);
  }

  .ma-sensitivity-kicker {
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

  .ma-sensitivity-header h3 {
    margin: 0;
    letter-spacing: -0.045em;
  }

  .ma-sensitivity-header p {
    max-width: 720px;
    margin: 11px 0 0;
    line-height: 1.66;
  }

  .ma-sensitivity-icon-box {
    flex: 0 0 auto;
    width: 48px;
    height: 48px;
    border-radius: 18px;
    display: grid;
    place-items: center;
    background: rgba(37, 99, 235, 0.16);
    border: 1px solid rgba(96, 165, 250, 0.24);
  }

  .ma-sensitivity-summary {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 14px;
  }

  .ma-sensitivity-summary-card {
    min-width: 0;
    padding: 18px;
    border-radius: 22px;
    background: rgba(255,255,255,0.045);
    border: 1px solid rgba(255,255,255,0.078);
  }

  .ma-sensitivity-summary-card strong {
    display: block;
    margin-top: 8px;
    font-size: 21px;
    line-height: 1.12;
    letter-spacing: -0.045em;
    overflow-wrap: anywhere;
  }

  .ma-sensitivity-table-shell {
    overflow: auto;
    border-radius: 26px;
    border: 1px solid rgba(148, 163, 184, 0.14);
    background: rgba(255,255,255,0.032);
  }

  .ma-sensitivity-table {
    width: 100%;
    min-width: 720px;
    border-collapse: separate;
    border-spacing: 0;
  }

  .ma-sensitivity-table th,
  .ma-sensitivity-table td {
    padding: 15px 16px;
    border-bottom: 1px solid rgba(148, 163, 184, 0.12);
    border-right: 1px solid rgba(148, 163, 184, 0.10);
    text-align: right;
  }

  .ma-sensitivity-table th:last-child,
  .ma-sensitivity-table td:last-child {
    border-right: 0;
  }

  .ma-sensitivity-table tr:last-child td {
    border-bottom: 0;
  }

  .ma-sensitivity-table th {
    position: sticky;
    top: 0;
    z-index: 2;
    color: rgba(203, 213, 225, 0.84);
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.13em;
    background: rgba(15, 23, 42, 0.96);
    backdrop-filter: blur(12px);
  }

  .ma-sensitivity-table th:first-child,
  .ma-sensitivity-row-label {
    text-align: left;
  }

  .ma-sensitivity-row-label {
    position: sticky;
    left: 0;
    z-index: 1;
    min-width: 120px;
    background: rgba(15, 23, 42, 0.92);
    color: rgba(226, 232, 240, 0.92);
    font-weight: 820;
    letter-spacing: -0.02em;
  }

  .ma-sensitivity-cell {
    position: relative;
    min-width: 112px;
    font-weight: 760;
    letter-spacing: -0.025em;
    color: rgba(226, 232, 240, 0.92);
    background:
      linear-gradient(135deg, rgba(255,255,255,0.044), rgba(255,255,255,0.018));
  }

  .ma-sensitivity-cell::before {
    content: "";
    position: absolute;
    inset: 8px;
    border-radius: 14px;
    background: var(--cell-bg);
    border: 1px solid var(--cell-border);
    pointer-events: none;
  }

  .ma-sensitivity-cell span {
    position: relative;
    z-index: 1;
  }

  .ma-sensitivity-cell.is-center {
    color: #d1fae5;
    font-weight: 900;
  }

  .ma-sensitivity-cell.is-center::before {
    background:
      linear-gradient(135deg, rgba(16,185,129,0.24), rgba(59,130,246,0.10));
    border-color: rgba(16,185,129,0.34);
    box-shadow: 0 0 28px rgba(16,185,129,0.10);
  }

  .ma-sensitivity-note {
    padding: 18px;
    border-radius: 22px;
    background:
      linear-gradient(135deg, rgba(16, 185, 129, 0.09), rgba(59, 130, 246, 0.055));
    border: 1px solid rgba(148, 163, 184, 0.14);
  }

  .ma-sensitivity-note strong {
    display: block;
    margin-bottom: 8px;
  }

  .ma-sensitivity-note p {
    margin: 0;
    color: var(--muted);
    line-height: 1.65;
  }

  .ma-sensitivity-empty {
    border-radius: 26px;
    padding: 34px;
    border: 1px dashed rgba(148, 163, 184, 0.24);
    background: rgba(255,255,255,0.025);
    text-align: center;
  }

  .ma-sensitivity-empty-icon {
    width: 58px;
    height: 58px;
    margin: 0 auto 18px;
    border-radius: 22px;
    display: grid;
    place-items: center;
    background: rgba(37, 99, 235, 0.14);
    border: 1px solid rgba(96, 165, 250, 0.22);
  }

  .ma-sensitivity-empty h3 {
    margin: 0;
    letter-spacing: -0.04em;
  }

  .ma-sensitivity-empty p {
    max-width: 560px;
    margin: 12px auto 0;
    line-height: 1.65;
  }

  @media (max-width: 860px) {
    .ma-sensitivity-header {
      flex-direction: column;
    }

    .ma-sensitivity-summary {
      grid-template-columns: 1fr;
    }
  }
`;

function getSafeNumber(value) {
  const parsed = Number(value);

  if (!Number.isFinite(parsed)) return 0;

  return parsed;
}

function formatMillions(value) {
  const safeValue = getSafeNumber(value);
  return `${(safeValue / 1000000).toFixed(2)}M`;
}

function getSafeMatrix(matrix) {
  if (!Array.isArray(matrix)) return [];

  return matrix
    .filter((row) => Array.isArray(row))
    .map((row) => row.map((value) => getSafeNumber(value)));
}

function getFlatValues(matrix) {
  return matrix.flat().filter((value) => Number.isFinite(value));
}

function getCellStyle(value, centerValue, minValue, maxValue) {
  const safeValue = getSafeNumber(value);
  const safeCenter = getSafeNumber(centerValue);
  const rangeUp = Math.max(1, maxValue - safeCenter);
  const rangeDown = Math.max(1, safeCenter - minValue);

  if (safeValue >= safeCenter) {
    const strength = Math.min(0.34, 0.08 + ((safeValue - safeCenter) / rangeUp) * 0.26);

    return {
      '--cell-bg': `rgba(16, 185, 129, ${strength})`,
      '--cell-border': `rgba(16, 185, 129, ${Math.min(0.42, strength + 0.1)})`
    };
  }

  const strength = Math.min(0.30, 0.06 + ((safeCenter - safeValue) / rangeDown) * 0.24);

  return {
    '--cell-bg': `rgba(239, 68, 68, ${strength})`,
    '--cell-border': `rgba(239, 68, 68, ${Math.min(0.38, strength + 0.1)})`
  };
}

function SummaryCard({ label, value, icon: Icon, tone = '' }) {
  return (
    <div className="ma-sensitivity-summary-card">
      <div className="kpi-label">{label}</div>

      <strong className={tone}>
        <Icon size={16} style={{ marginRight: 8, verticalAlign: -2 }} />
        {value}
      </strong>
    </div>
  );
}

export function SensitivityMatrix({ matrix = [], adjustedMultiple = 0 }) {
  const safeMatrix = getSafeMatrix(matrix);
  const hasData = safeMatrix.length > 0;
  const safeAdjustedMultiple = getSafeNumber(adjustedMultiple);
  const flatValues = getFlatValues(safeMatrix);
  const minValue = flatValues.length ? Math.min(...flatValues) : 0;
  const maxValue = flatValues.length ? Math.max(...flatValues) : 0;
  const centerValue = getSafeNumber(safeMatrix[2]?.[2]);

  return (
    <Card className="ma-sensitivity-card">
      <style>{sensitivityMatrixCss}</style>

      <div className="ma-sensitivity-inner">
        <div className="ma-sensitivity-header">
          <div>
            <div className="ma-sensitivity-kicker">
              <Grid3X3 size={14} />
              Sensitivity engine
            </div>

            <h3>Matriz de sensibilidad</h3>

            <p className="muted">
              Lectura ejecutiva del impacto combinado entre variaciones de
              múltiplo y cambios en EBITDA normalizado sobre el valor estimado.
            </p>
          </div>

          <div className="ma-sensitivity-icon-box">
            <MoveDiagonal2 size={20} />
          </div>
        </div>

        {!hasData ? (
          <div className="ma-sensitivity-empty">
            <div className="ma-sensitivity-empty-icon">
              <BarChart3 size={24} />
            </div>

            <h3>No hay datos de sensibilidad disponibles</h3>

            <p className="muted">
              Completa la valoración para generar escenarios de sensibilidad por
              múltiplo y EBITDA normalizado.
            </p>
          </div>
        ) : (
          <>
            <div className="ma-sensitivity-summary">
              <SummaryCard
                label="Base multiple"
                value={`${safeAdjustedMultiple.toFixed(2)}x`}
                icon={Gauge}
              />

              <SummaryCard
                label="Downside case"
                value={formatMillions(minValue)}
                icon={TrendingDown}
                tone="text-danger"
              />

              <SummaryCard
                label="Upside case"
                value={formatMillions(maxValue)}
                icon={TrendingUp}
                tone="text-success"
              />
            </div>

            <div className="ma-sensitivity-table-shell">
              <table className="ma-sensitivity-table">
                <thead>
                  <tr>
                    <th>Mult \\ EBITDA</th>
                    {EBIT_STEPS.map((item) => (
                      <th key={item}>{item > 0 ? `+${item}` : item}%</th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {safeMatrix.map((row, rowIndex) => {
                    const rowMultiple =
                      safeAdjustedMultiple + (MULTIPLE_STEPS[rowIndex] ?? 0);

                    return (
                      <tr key={rowIndex}>
                        <td className="ma-sensitivity-row-label">
                          {rowMultiple.toFixed(1)}x
                        </td>

                        {row.map((value, colIndex) => {
                          const isCenter = rowIndex === 2 && colIndex === 2;

                          return (
                            <td
                              key={`${rowIndex}-${colIndex}`}
                              className={`ma-sensitivity-cell ${
                                isCenter ? 'is-center' : ''
                              }`.trim()}
                              style={getCellStyle(
                                value,
                                centerValue,
                                minValue,
                                maxValue
                              )}
                            >
                              <span>{formatMillions(value)}</span>
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="ma-sensitivity-note">
              <strong>Lectura ejecutiva</strong>

              <p>
                La celda central representa el escenario base. Las celdas hacia
                arriba/derecha muestran expansión de valor y las inferiores
                reflejan presión por menor EBITDA o múltiplos más conservadores.
              </p>
            </div>
          </>
        )}
      </div>
    </Card>
  );
}