import React from 'react';
import { Card } from '../../../shared/components/ui/Card.jsx';

const MULTIPLE_STEPS = [-1, -0.5, 0, 0.5, 1];
const EBIT_STEPS = [-10, -5, 0, 5, 10];

function formatMillions(value) {
  const safeValue = Number.isFinite(value) ? value : 0;
  return `${(safeValue / 1000000).toFixed(2)}M`;
}

export function SensitivityMatrix({ matrix = [], adjustedMultiple = 0 }) {
  const hasData = Array.isArray(matrix) && matrix.length > 0;

  return (
    <Card>
      <h3>Matriz de sensibilidad</h3>

      {!hasData ? (
        <p className="muted">No hay datos de sensibilidad disponibles.</p>
      ) : (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Mult \\ EBIT</th>
                {EBIT_STEPS.map((item) => (
                  <th key={item}>{item}%</th>
                ))}
              </tr>
            </thead>

            <tbody>
              {matrix.map((row, rowIndex) => {
                const rowMultiple =
                  (Number.isFinite(adjustedMultiple) ? adjustedMultiple : 0) +
                  MULTIPLE_STEPS[rowIndex];

                return (
                  <tr key={rowIndex}>
                    <td>{rowMultiple.toFixed(1)}x</td>

                    {row.map((value, colIndex) => {
                      const isCenter = rowIndex === 2 && colIndex === 2;

                      return (
                        <td
                          key={colIndex}
                          style={
                            isCenter
                              ? {
                                  fontWeight: 800,
                                  background: 'rgba(16,185,129,0.18)',
                                  color: '#d1fae5'
                                }
                              : undefined
                          }
                        >
                          {formatMillions(value)}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}