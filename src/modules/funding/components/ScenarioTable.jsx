import React from 'react';
import { Table } from '../../../shared/components/ui/Table.jsx';
import { formatCurrency } from '../../../shared/utils/formatCurrency.js';

export function ScenarioTable({ scenarioRows = [], currency = 'EUR' }) {
  const columns = [
    { key: 'name', label: 'Scenario' },
    { key: 'raise', label: 'Raise', render: (row) => formatCurrency(row.raise, currency) },
    { key: 'preMoney', label: 'Pre-money', render: (row) => formatCurrency(row.preMoney, currency) },
    { key: 'postMoney', label: 'Post-money', render: (row) => formatCurrency(row.postMoney, currency) },
    { key: 'dilution', label: 'Dilution', render: (row) => `${row.dilution.toFixed(1)}%` },
    { key: 'runway', label: 'Runway', render: (row) => `${row.runway.toFixed(1)}m` }
  ];
  return <Table columns={columns} rows={scenarioRows} />;
}
