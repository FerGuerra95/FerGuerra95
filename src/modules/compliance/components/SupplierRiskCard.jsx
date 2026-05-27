import React from 'react';
import { Card } from '../../../shared/components/ui/Card.jsx';

export function SupplierRiskCard() {
  return (
    <Card>
      <h3>Supplier risk review</h3>
      <p className="muted">
        Operational DSS signal for supplier review. Not a certified compliance
        audit.
      </p>
    </Card>
  );
}
