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

export const pmiApi = {
  async listCases() {
    const response = await httpClient.get('/pmi/cases');
    return extractItems(response);
  },

  async getCase(id) {
    const response = await httpClient.get(`/pmi/cases/${encodeURIComponent(id)}`);
    return extractData(response);
  },

  async createCase(payload = {}) {
    const response = await httpClient.post('/pmi/cases', payload);
    return extractData(response);
  },

  async createCaseFromMaDeal(dealId) {
    const response = await httpClient.post(
      `/pmi/cases/from-ma-deal/${encodeURIComponent(dealId)}`,
      {}
    );
    return extractData(response);
  },

  async updateCase(id, payload = {}) {
    const response = await httpClient.patch(`/pmi/cases/${encodeURIComponent(id)}`, payload);
    return extractData(response);
  },

  async duplicateCase(id) {
    const response = await httpClient.post(`/pmi/cases/${encodeURIComponent(id)}/duplicate`, {});
    return extractData(response);
  },

  async deleteCase(id) {
    const response = await httpClient.delete(`/pmi/cases/${encodeURIComponent(id)}`);
    return extractData(response);
  },

  async listAuditLogs(params = {}) {
    const query = new URLSearchParams();
    if (params.caseId) query.set('caseId', params.caseId);
    if (params.limit) query.set('limit', params.limit);
    const suffix = query.toString() ? `?${query.toString()}` : '';
    const response = await httpClient.get(`/pmi/audit-logs${suffix}`);
    return extractItems(response);
  },

  async getExecutiveHubBrief() {
    const response = await httpClient.get('/pmi/hub-overview');
    return extractData(response);
  }
};

export default pmiApi;
