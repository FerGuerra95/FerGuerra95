import React from 'react';
import { Card } from '../../../shared/components/ui/Card.jsx';

export function AlertCard() {
  return (
    <Card>
      <h3>Compliance alert review</h3>
      <p className="muted">
        Synthetic alert workspace. Human review required before any compliance
        conclusion or external circulation.
      </p>
    </Card>
  );
}
