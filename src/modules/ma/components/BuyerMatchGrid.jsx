import React from 'react';
import { Card } from '../../../shared/components/ui/Card.jsx';
import { Badge } from '../../../shared/components/ui/Badge.jsx';

export function BuyerMatchGrid({ buyers }) {
  return (
    <div className="grid-3">
      {buyers.map((item) => (
        <Card key={item.type}>
          <div className="section-title">
            <Badge>{item.type}</Badge>
            <Badge>{item.fit}% match</Badge>
          </div>
          <h3>{item.title}</h3>
          <p className="muted">{item.desc}</p>
        </Card>
      ))}
    </div>
  );
}
