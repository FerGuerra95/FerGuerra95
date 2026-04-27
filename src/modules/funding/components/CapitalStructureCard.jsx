import React from 'react';
import { Card } from '../../../shared/components/ui/Card.jsx';

function OwnershipRow({ label, before, after }) {
  return (
    <div className="row" style={{ justifyContent: 'space-between' }}>
      <span>{label}</span>
      <span className="muted">{before.toFixed(1)}% → <strong style={{ color: 'var(--text)' }}>{after.toFixed(1)}%</strong></span>
    </div>
  );
}

export function CapitalStructureCard({ derived }) {
  return (
    <Card>
      <h3>Cap table post-ronda</h3>
      <div className="stack">
        <OwnershipRow label="Fundadores" before={derived.normalizedFounderOwnership} after={derived.postRoundOwnership.founders} />
        <OwnershipRow label="Inversores actuales" before={derived.normalizedExistingInvestorOwnership} after={derived.postRoundOwnership.existingInvestors} />
        <OwnershipRow label="Option pool" before={derived.normalizedOptionPool} after={derived.postRoundOwnership.optionPool} />
        <OwnershipRow label="Nuevos inversores" before={0} after={derived.postRoundOwnership.newInvestors} />
      </div>
    </Card>
  );
}
