import React from 'react';

import { BoardReviewStatusBadge } from './BoardReviewStatusBadge.jsx';
import {
  buildHumanReviewChecklistState,
  validateInternalFinalEligibility
} from '../utils/boardReviewWorkflow.js';
import { normalizeMissingData, safeList, safeText } from '../utils/reportSanitizers.js';

const panelStyle = {
  border: '1px solid rgba(148,163,184,.16)',
  borderRadius: 8,
  padding: 16,
  background: 'rgba(15,23,42,.58)',
  color: '#e2e8f0'
};

const sectionStyle = {
  marginTop: 12
};

const disabledButtonStyle = {
  minHeight: 34,
  border: '1px solid rgba(148,163,184,.24)',
  borderRadius: 8,
  padding: '0 12px',
  color: 'rgba(226,232,240,.68)',
  background: 'rgba(15,23,42,.62)',
  cursor: 'not-allowed',
  fontWeight: 800
};

function ListBlock({ items, emptyLabel }) {
  const list = safeList(items);
  if (list.length === 0) {
    return <p className="reporting-muted">{emptyLabel}</p>;
  }
  return (
    <ul>
      {list.map((item) => <li key={safeText(item)}>{safeText(item)}</li>)}
    </ul>
  );
}

export function BoardReviewWorkflowPanel({
  snapshot,
  checklist,
  reviewedItems,
  requiredItems,
  missingData,
  limitations,
  auditMetadata
}) {
  const resolvedAudit = auditMetadata || snapshot?.auditMetadata || {};
  const insufficientData = normalizeMissingData(missingData || snapshot?.insufficientDataFlags);
  const resolvedLimitations = safeList(limitations || resolvedAudit.limitations);
  const checklistState = buildHumanReviewChecklistState({
    checklist: checklist || snapshot?.rendererInput?.humanReviewChecklist,
    reviewedItems,
    requiredItems
  });
  const eligibility = validateInternalFinalEligibility({
    status: snapshot?.status,
    humanReviewed: snapshot?.versionMetadata?.status === 'reviewed',
    reviewedBy: snapshot?.versionMetadata?.reviewedBy,
    reviewedAt: snapshot?.versionMetadata?.reviewedAt,
    internalFinalApproved: snapshot?.versionMetadata?.status === 'internal_final',
    insufficientDataFlags: insufficientData,
    unresolvedLimitations: resolvedLimitations
  });

  return (
    <section style={panelStyle} aria-label="Board Review Draft workflow panel">
      <h3 style={{ margin: '0 0 10px' }}>Review workflow</h3>
      <BoardReviewStatusBadge
        status={snapshot?.status}
        aiUsed={snapshot?.aiMetadata?.aiUsed}
        reviewedBy={snapshot?.versionMetadata?.reviewedBy !== 'N/A' ? snapshot?.versionMetadata?.reviewedBy : ''}
        reviewedAt={snapshot?.versionMetadata?.reviewedAt !== 'N/A' ? snapshot?.versionMetadata?.reviewedAt : ''}
        internalFinalApproved={snapshot?.versionMetadata?.status === 'internal_final'}
      />

      <p className="reporting-muted" style={{ marginTop: 12 }}>
        Preview only. Requires backend persistence before review actions can be recorded.
      </p>

      <div style={sectionStyle}>
        <strong>Human review checklist</strong>
        {checklistState.length === 0 ? <p className="reporting-muted">Human Review Required</p> : (
          <ul>
            {checklistState.map((item) => (
              <li key={item.label}>
                {item.label} - {item.reviewed ? 'reviewed metadata present' : 'pending review'}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div style={sectionStyle}>
        <strong>Missing / insufficient data</strong>
        <ListBlock items={insufficientData} emptyLabel="insufficient_data" />
      </div>

      <div style={sectionStyle}>
        <strong>Limitations</strong>
        <ListBlock items={resolvedLimitations} emptyLabel="Human review required before circulation." />
      </div>

      <div style={sectionStyle}>
        <strong>Audit metadata</strong>
        <ListBlock
          items={Object.entries(resolvedAudit).map(([key, value]) => `${key}: ${safeText(value)}`)}
          emptyLabel="N/A"
        />
      </div>

      <div style={{ ...sectionStyle, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        <button type="button" style={disabledButtonStyle} disabled>Request human review - Preview only</button>
        <button type="button" style={disabledButtonStyle} disabled>Mark reviewed - Requires backend persistence</button>
        <button type="button" style={disabledButtonStyle} disabled={!eligibility.eligible}>
          Mark internal final - Requires backend persistence
        </button>
        <button type="button" style={disabledButtonStyle} disabled>Archive/Revoke - Requires backend persistence</button>
      </div>
    </section>
  );
}

export default BoardReviewWorkflowPanel;
