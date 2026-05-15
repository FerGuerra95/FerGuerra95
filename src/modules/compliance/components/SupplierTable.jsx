import React from 'react';
import { Card } from '../../../shared/components/ui/Card.jsx';

export function SupplierTable() {
  return (
    <Card>
      <h3>Supplier intelligence</h3>
      <p className="muted">
        Insufficient validated data · Use the Suppliers command center for
        evidence-backed supplier records.
      </p>
    </Card>
  );
}
