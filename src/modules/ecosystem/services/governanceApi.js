import { httpClient } from '../../../shared/services/httpClient.js';

function extractData(response) {
  return response?.data ?? response ?? null;
}

function extractItems(response) {
  const data = extractData(response);
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.items)) return data.items;
  return [];
}

export const governanceApi = {
  async listDecisions() {
    return extractItems(await httpClient.get('/governance/decisions'));
  },

  async createDecision(payload = {}) {
    return extractData(await httpClient.post('/governance/decisions', payload));
  },

  async updateDecision(id, payload = {}) {
    return extractData(await httpClient.patch(`/governance/decisions/${encodeURIComponent(id)}`, payload));
  },

  async listControls() {
    return extractItems(await httpClient.get('/governance/controls'));
  },

  async createControl(payload = {}) {
    return extractData(await httpClient.post('/governance/controls', payload));
  },

  async updateControl(id, payload = {}) {
    return extractData(await httpClient.patch(`/governance/controls/${encodeURIComponent(id)}`, payload));
  },

  async listEsgMetrics() {
    return extractItems(await httpClient.get('/governance/esg-metrics'));
  },

  async createEsgMetric(payload = {}) {
    return extractData(await httpClient.post('/governance/esg-metrics', payload));
  },

  async updateEsgMetric(id, payload = {}) {
    return extractData(await httpClient.patch(`/governance/esg-metrics/${encodeURIComponent(id)}`, payload));
  },

  async getHubOverview() {
    return extractData(await httpClient.get('/governance/hub-overview'));
  }
};

export default governanceApi;
