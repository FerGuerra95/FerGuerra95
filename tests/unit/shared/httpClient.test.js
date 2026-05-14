import { beforeEach, describe, expect, it, vi } from 'vitest';

import { httpClient } from '../../../src/shared/services/httpClient.js';

describe('httpClient', () => {
  beforeEach(() => {
    localStorage.clear();
    globalThis.fetch = vi.fn(async () => ({
      ok: true,
      status: 200,
      headers: {
        get: () => ''
      },
      text: async () => JSON.stringify({ data: { ok: true }, error: null })
    }));
  });

  it('serializa query params y omite valores vacios', async () => {
    await httpClient.get('/funding/rounds', {
      params: {
        status: 'active',
        roundType: 'seed',
        empty: '',
        missing: null
      }
    });

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch.mock.calls[0][0]).toBe(
      '/api/funding/rounds?status=active&roundType=seed'
    );
  });

  it('conserva query strings existentes y soporta arrays', async () => {
    await httpClient.get('/audit/logs?limit=20', {
      params: {
        action: ['created', 'updated']
      }
    });

    expect(fetch.mock.calls[0][0]).toBe(
      '/api/audit/logs?limit=20&action=created&action=updated'
    );
  });
});
