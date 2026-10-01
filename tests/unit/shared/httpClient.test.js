import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
  getResolvedApiBaseUrl,
  httpClient,
  resolveApiBaseUrl
} from '../../../src/shared/services/httpClient.js';

function vitePage(port) {
  return {
    hostname: '127.0.0.1',
    port: String(port),
    origin: `http://127.0.0.1:${port}`
  };
}

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

  it('does not send a Vite 5173 page to canonical port 4000', () => {
    const resolved = resolveApiBaseUrl({
      location: vitePage(5173),
      env: { VITE_API_BASE_URL: 'http://127.0.0.1:4000/api' }
    });

    expect(resolved).toBe('/api');
    expect(resolved).not.toContain(':4000');
    expect(getResolvedApiBaseUrl()).toBe('/api');
  });

  it('does not send a Vite 5174 page to canonical port 4000', () => {
    const resolved = resolveApiBaseUrl({
      location: vitePage(5174),
      env: { VITE_API_BASE_URL: 'http://localhost:4000/api' }
    });

    expect(resolved).toBe('/api');
    expect(resolved).not.toContain(':4000');
  });
});
