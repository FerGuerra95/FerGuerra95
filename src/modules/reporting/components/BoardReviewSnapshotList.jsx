import React from 'react';

import { BoardReviewStatusBadge } from './BoardReviewStatusBadge.jsx';
import { safeDate, safeText } from '../utils/reportSanitizers.js';

function isRevoked(snapshot) {
  return snapshot?.status === 'revoked' || Boolean(snapshot?.revokedAt);
}

export function BoardReviewSnapshotList({
  snapshots = [],
  selectedSnapshotId,
  onSelect,
  onPreview
}) {
  if (snapshots.length === 0) {
    return (
      <div className="reporting-empty">
        No persisted Board Review snapshots yet. Create a snapshot to preserve the current Board Review Draft state for review.
      </div>
    );
  }

  return (
    <div className="reporting-scroll" aria-label="Persisted Board Review snapshots">
      <table className="reporting-table">
        <thead>
          <tr>
            <th>Snapshot</th>
            <th>Status</th>
            <th>Created</th>
            <th>Reviewed</th>
            <th>Preview</th>
          </tr>
        </thead>
        <tbody>
          {snapshots.map((snapshot) => {
            const revoked = isRevoked(snapshot);
            const selected = selectedSnapshotId === snapshot.id;
            return (
              <tr key={snapshot.id}>
                <td>
                  <button
                    type="button"
                    className="reporting-table-link"
                    onClick={() => onSelect?.(snapshot)}
                  >
                    {safeText(snapshot.title, 'Board Review Draft')}
                  </button>
                  {selected ? <div className="reporting-muted">Selected persisted snapshot</div> : null}
                </td>
                <td>
                  <BoardReviewStatusBadge
                    status={snapshot.status}
                    aiUsed={snapshot.aiMetadata?.aiUsed}
                    reviewedBy={snapshot.reviewedBy}
                    reviewedAt={snapshot.reviewedAt}
                    internalFinalApproved={snapshot.status === 'internal_final'}
                  />
                </td>
                <td>{safeDate(snapshot.createdAt)}</td>
                <td>{snapshot.reviewedBy ? `${safeText(snapshot.reviewedBy)} / ${safeDate(snapshot.reviewedAt)}` : 'Human Review Required'}</td>
                <td>
                  <button
                    type="button"
                    className="reporting-table-action"
                    disabled={revoked}
                    onClick={() => onPreview?.(snapshot)}
                  >
                    {revoked ? 'Revoked' : 'Open persisted preview'}
                  </button>
                  {revoked ? (
                    <div className="reporting-muted">
                      This snapshot has been revoked and cannot be previewed as an active Board Review Draft.
                    </div>
                  ) : null}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default BoardReviewSnapshotList;
