import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../../../src/shared/services/httpClient.js', () => ({
  httpClient: {
    get: vi.fn(),
    post: vi.fn()
  }
}));

const { httpClient } = await import('../../../src/shared/services/httpClient.js');
const { boardReviewSnapshotsApi, BoardReviewSnapshotApiError } = await import(
  '../../../src/modules/reporting/services/boardReviewSnapshotsApi.js'
);

describe('boardReviewSnapshotsApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('lists snapshots from the correct endpoint', async () => {
    httpClient.get.mockResolvedValue({ data: { items: [{ id: 'snap_1' }] } });

    const items = await boardReviewSnapshotsApi.listBoardReviewSnapshots();

    expect(httpClient.get).toHaveBeenCalledWith('/reporting/board-review-snapshots');
    expect(items).toEqual([{ id: 'snap_1' }]);
  });

  it('creates snapshots after stripping tenant and sensitive fields', async () => {
    httpClient.post.mockResolvedValue({ data: { id: 'snap_1' } });

    await boardReviewSnapshotsApi.createBoardReviewSnapshot({
      organizationId: 'client_org',
      orgId: 'client_org',
      tenantId: 'client_org',
      title: 'Draft',
      rendererInput: {},
      token: 'secret'
    });

    const [, payload] = httpClient.post.mock.calls[0];
    expect(httpClient.post.mock.calls[0][0]).toBe('/reporting/board-review-snapshots');
    expect(payload.organizationId).toBeUndefined();
    expect(payload.orgId).toBeUndefined();
    expect(payload.tenantId).toBeUndefined();
    expect(payload.token).toBeUndefined();
  });

  it('calls workflow endpoints', async () => {
    httpClient.post.mockResolvedValue({ data: { id: 'snap_1' } });

    await boardReviewSnapshotsApi.markBoardReviewReviewed('snap_1', { reviewedAt: 'now' });
    await boardReviewSnapshotsApi.markBoardReviewInternalFinal('snap_1', {});

    expect(httpClient.post.mock.calls[0][0]).toBe('/reporting/board-review-snapshots/snap_1/mark-reviewed');
    expect(httpClient.post.mock.calls[1][0]).toBe('/reporting/board-review-snapshots/snap_1/mark-internal-final');
    expect(httpClient.post.mock.calls[1][1].approvalMetadata.explicitApproval).toBe(true);
  });

  it('normalizes 403 and 409 without leaking secrets', async () => {
    httpClient.post.mockRejectedValueOnce({
      status: 403,
      code: 'FORBIDDEN',
      message: 'token secret should not leak'
    });

    try {
      await boardReviewSnapshotsApi.createBoardReviewSnapshot({ title: 'Draft', rendererInput: {} });
      throw new Error('expected failure');
    } catch (error) {
      expect(error).toBeInstanceOf(BoardReviewSnapshotApiError);
      expect(error.message).not.toMatch(/secret/i);
      expect(error.status).toBe(403);
    }

    httpClient.post.mockRejectedValueOnce({ status: 409, code: 'CONFLICT' });
    await expect(
      boardReviewSnapshotsApi.archiveBoardReviewSnapshot('snap_1')
    ).rejects.toMatchObject({ status: 409 });
  });
});
