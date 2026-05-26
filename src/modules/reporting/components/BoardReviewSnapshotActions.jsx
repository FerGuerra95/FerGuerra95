import React from 'react';

function isReadOnly(snapshot) {
  return snapshot?.status === 'archived' || snapshot?.status === 'revoked';
}

function canMarkReviewed(snapshot) {
  return Boolean(snapshot?.id) && !isReadOnly(snapshot) && snapshot.status !== 'reviewed' && snapshot.status !== 'internal_final';
}

function canMarkInternalFinal(snapshot) {
  return Boolean(snapshot?.id) && snapshot.status === 'reviewed' && !isReadOnly(snapshot);
}

export function BoardReviewSnapshotActions({
  snapshot,
  canCreate,
  canReview,
  canFinalize,
  canArchive,
  onCreate,
  onMarkReviewed,
  onMarkInternalFinal,
  onArchive,
  onRevoke,
  loading
}) {
  const hasSnapshot = Boolean(snapshot?.id);
  const readonly = isReadOnly(snapshot);

  return (
    <div className="reporting-snapshot-actions" aria-label="Persisted Board Review snapshot actions">
      <button
        type="button"
        className="reporting-button"
        disabled={!canCreate || loading}
        onClick={onCreate}
      >
        {canCreate ? 'Create persisted snapshot' : 'Requires permission'}
      </button>
      <button
        type="button"
        className="reporting-button"
        disabled={!canReview || !canMarkReviewed(snapshot) || loading}
        onClick={() => onMarkReviewed?.(snapshot)}
      >
        Mark reviewed
      </button>
      <button
        type="button"
        className="reporting-button"
        disabled={!canFinalize || !canMarkInternalFinal(snapshot) || loading}
        onClick={() => onMarkInternalFinal?.(snapshot)}
      >
        Mark internal final
      </button>
      <button
        type="button"
        className="reporting-button"
        disabled={!canArchive || !hasSnapshot || readonly || loading}
        onClick={() => onArchive?.(snapshot)}
      >
        Archive
      </button>
      <button
        type="button"
        className="reporting-button"
        disabled={!canArchive || !hasSnapshot || snapshot?.status === 'revoked' || loading}
        onClick={() => onRevoke?.(snapshot)}
      >
        Revoke
      </button>
      <p className="reporting-muted">
        Workflow changes are shown only after backend confirmation. Internal Final is not board approval.
      </p>
    </div>
  );
}

export default BoardReviewSnapshotActions;
