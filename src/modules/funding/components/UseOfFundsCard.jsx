import React from 'react';
import { Card } from '../../../shared/components/ui/Card.jsx';
import { formatCurrency } from '../../../shared/utils/formatCurrency.js';

export function UseOfFundsCard({ useOfFunds = [], currency = 'EUR' }) {
  return (
    <Card>
      <h3>Use of funds</h3>
      <div className="stack">
        {useOfFunds.map((item) => (
          <div key={item.key} className="deal-row">
            <div className="deal-row-head">
              <span>{item.label}</span>
              <span>{item.pct}% · {formatCurrency(item.amount, currency)}</span>
            </div>
            <div className="deal-row-bar">
              <span style={{ width: `${item.pct}%`, background: item.key === 'product' ? 'var(--info)' : item.key === 'goToMarket' ? 'var(--accent)' : item.key === 'operations' ? 'var(--warning)' : '#64748b' }} />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
