import React from 'react';

export function Table({
  columns,
  rows,
  className = '',
  wrapClassName = ''
}) {
  const wrapCls =
    `table-wrap ceos-enterprise-table-wrap ${wrapClassName}`.trim();
  const tableCls = `table ceos-enterprise-table ${className}`.trim();

  return (
    <div className={wrapCls}>
      <table className={tableCls}>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key}>{column.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={row.id ?? index}>
              {columns.map((column) => (
                <td key={column.key}>
                  {typeof column.render === 'function'
                    ? column.render(row)
                    : row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
