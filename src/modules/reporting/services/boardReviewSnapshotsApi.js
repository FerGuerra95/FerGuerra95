import { httpClient } from '../../../shared/services/httpClient.js';
import { sanitizeBoardReviewSnapshotPayload } from '../utils/boardReviewSnapshotPayload.js';

function data(response) {
  return response?.data ?? response ?? null;
}

function items(response) {
  const value = data(response);
  if (Array.isArray(value)) return value;
  if (Array.isArray(value?.items)) return value.items;
  return [];
}

const ERROR_MESSAGES = {
  400: 'Board Review snapshot payload needs review.',
  401: 'Authentication is required to access Board Review snapshots.',
  403: 'You do not have permission for this Board Review snapshot action.',
  404: 'Board Review snapshot was not found for this workspace.',
  409: 'Board Review workflow transition is not currently allowed.'
};

export class BoardReviewSnapshotApiError extends Error {
  constructor(error = {}) {
    const status = Number(error.status || 0);
    super(ERROR_MESSAGES[status] || 'Board Review snapshot request failed.');
    this.name = 'BoardReviewSnapshotApiError';
    this.status = status;
    this.code = error.code || `HTTP_${status || 0}`;
  }
}

function normalizeError(error) {
  return new BoardReviewSnapshotApiError(error);
}

async function requestJson(callback) {
  try {
    return await callback();
  } catch (error) {
    throw normalizeError(error);
  }
}

function encodeId(snapshotId) {
  return encodeURIComponent(String(snapshotId || '').trim());
}

export const boardReviewSnapshotsApi = {
  async listBoardReviewSnapshots() {
    return requestJson(async () =>
      items(await httpClient.get('/reporting/board-review-snapshots'))
    );
  },

  async getBoardReviewSnapshot(snapshotId) {
    return requestJson(async () =>
      data(await httpClient.get(`/reporting/board-review-snapshots/${encodeId(snapshotId)}`))
    );
  },

  async createBoardReviewSnapshot(payload = {}) {
    return requestJson(async () =>
      data(await httpClient.post(
        '/reporting/board-review-snapshots',
        sanitizeBoardReviewSnapshotPayload(payload)
      ))
    );
  },

  async markBoardReviewReviewed(snapshotId, reviewMetadata = {}) {
    return requestJson(async () =>
      data(await httpClient.post(
        `/reporting/board-review-snapshots/${encodeId(snapshotId)}/mark-reviewed`,
        { reviewMetadata: sanitizeBoardReviewSnapshotPayload(reviewMetadata) }
      ))
    );
  },

  async markBoardReviewInternalFinal(snapshotId, approvalMetadata = {}) {
    return requestJson(async () =>
      data(await httpClient.post(
        `/reporting/board-review-snapshots/${encodeId(snapshotId)}/mark-internal-final`,
        {
          approvalMetadata: sanitizeBoardReviewSnapshotPayload({
            explicitApproval: true,
            ...approvalMetadata
          })
        }
      ))
    );
  },

  async archiveBoardReviewSnapshot(snapshotId) {
    return requestJson(async () =>
      data(await httpClient.post(
        `/reporting/board-review-snapshots/${encodeId(snapshotId)}/archive`,
        {}
      ))
    );
  },

  async revokeBoardReviewSnapshot(snapshotId) {
    return requestJson(async () =>
      data(await httpClient.post(
        `/reporting/board-review-snapshots/${encodeId(snapshotId)}/revoke`,
        {}
      ))
    );
  }
};

export default boardReviewSnapshotsApi;
