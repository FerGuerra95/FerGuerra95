import { httpClient } from '../../../shared/services/httpClient.js';

function data(response) {
  return response?.data ?? response ?? null;
}

function items(response) {
  const value = data(response);
  if (Array.isArray(value)) return value;
  if (Array.isArray(value?.items)) return value.items;
  return [];
}

export const bridgeApi = {
  getDashboard: async () => data(await httpClient.get('/bridge/dashboard')),
  getSummary: async () => data(await httpClient.get('/bridge/summary')),
  recalculate: async () => data(await httpClient.post('/bridge/recalculate', {})),
  listSignals: async () => items(await httpClient.get('/bridge/signals')),
  createSignal: async (payload) => data(await httpClient.post('/bridge/signals', payload)),
  acknowledgeSignal: async (id, payload = {}) => data(await httpClient.post(`/bridge/signals/${encodeURIComponent(id)}/acknowledge`, payload)),
  resolveSignal: async (id, payload = {}) => data(await httpClient.post(`/bridge/signals/${encodeURIComponent(id)}/resolve`, payload)),
  dismissSignal: async (id, payload = {}) => data(await httpClient.post(`/bridge/signals/${encodeURIComponent(id)}/dismiss`, payload)),
  listDependencies: async () => items(await httpClient.get('/bridge/dependencies')),
  createDependency: async (payload) => data(await httpClient.post('/bridge/dependencies', payload)),
  listConflicts: async () => items(await httpClient.get('/bridge/conflicts')),
  createConflict: async (payload) => data(await httpClient.post('/bridge/conflicts', payload)),
  listAttentionQueue: async () => items(await httpClient.get('/bridge/attention-queue')),
  listEvidenceLinks: async () => items(await httpClient.get('/bridge/evidence-links')),
  createEvidenceLink: async (payload) => data(await httpClient.post('/bridge/evidence-links', payload)),
  listReports: async () => items(await httpClient.get('/bridge/reports')),
  createReport: async (payload) => data(await httpClient.post('/bridge/reports', payload)),
  listSnapshots: async () => items(await httpClient.get('/bridge/snapshots')),
  createSnapshot: async (payload) => data(await httpClient.post('/bridge/snapshots', payload))
};

export default bridgeApi;
