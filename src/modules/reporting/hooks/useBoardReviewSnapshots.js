import { useCallback, useEffect, useState } from 'react';

import { boardReviewSnapshotsApi } from '../services/boardReviewSnapshotsApi.js';

function userMessage(error) {
  if (error?.status === 403) return 'Read-only: this action requires additional permission.';
  if (error?.status === 409) return 'This workflow transition is not currently allowed.';
  if (error?.status === 404) return 'The persisted Board Review snapshot could not be found.';
  if (error?.status === 401) return 'Please sign in to access persisted Board Review snapshots.';
  return 'Board Review snapshots could not be updated.';
}

export function useBoardReviewSnapshots({ autoLoad = true } = {}) {
  const [snapshots, setSnapshots] = useState([]);
  const [selectedSnapshot, setSelectedSnapshot] = useState(null);
  const [state, setState] = useState({ loading: Boolean(autoLoad), error: null, message: '' });

  const refresh = useCallback(async () => {
    setState((current) => ({ ...current, loading: true, error: null }));
    try {
      const items = await boardReviewSnapshotsApi.listBoardReviewSnapshots();
      setSnapshots(items);
      setState({ loading: false, error: null, message: '' });
      return items;
    } catch (error) {
      setState({ loading: false, error, message: userMessage(error) });
      return [];
    }
  }, []);

  useEffect(() => {
    if (autoLoad) {
      refresh();
    }
  }, [autoLoad, refresh]);

  const applyUpdatedSnapshot = useCallback((snapshot) => {
    if (!snapshot?.id) return snapshot;
    setSnapshots((current) => {
      const exists = current.some((item) => item.id === snapshot.id);
      return exists
        ? current.map((item) => (item.id === snapshot.id ? snapshot : item))
        : [snapshot, ...current];
    });
    setSelectedSnapshot(snapshot);
    return snapshot;
  }, []);

  const runAction = useCallback(async (action, successMessage) => {
    setState((current) => ({ ...current, loading: true, error: null }));
    try {
      const snapshot = await action();
      applyUpdatedSnapshot(snapshot);
      setState({ loading: false, error: null, message: successMessage });
      return snapshot;
    } catch (error) {
      setState({ loading: false, error, message: userMessage(error) });
      return null;
    }
  }, [applyUpdatedSnapshot]);

  return {
    loading: state.loading,
    error: state.error,
    message: state.message,
    snapshots,
    selectedSnapshot,
    setSelectedSnapshot,
    refresh,
    createSnapshot: (payload) =>
      runAction(
        () => boardReviewSnapshotsApi.createBoardReviewSnapshot(payload),
        'Persisted Board Review snapshot created. Human review required.'
      ),
    markReviewed: (snapshotId, reviewMetadata = {}) =>
      runAction(
        () => boardReviewSnapshotsApi.markBoardReviewReviewed(snapshotId, reviewMetadata),
        'Board Review snapshot marked reviewed by backend.'
      ),
    markInternalFinal: (snapshotId, approvalMetadata = {}) =>
      runAction(
        () => boardReviewSnapshotsApi.markBoardReviewInternalFinal(snapshotId, approvalMetadata),
        'Board Review snapshot marked internal final by backend.'
      ),
    archive: (snapshotId) =>
      runAction(
        () => boardReviewSnapshotsApi.archiveBoardReviewSnapshot(snapshotId),
        'Board Review snapshot archived.'
      ),
    revoke: (snapshotId) =>
      runAction(
        () => boardReviewSnapshotsApi.revokeBoardReviewSnapshot(snapshotId),
        'Board Review snapshot revoked.'
      )
  };
}

export default useBoardReviewSnapshots;
