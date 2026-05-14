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

export const bridgeApi = {
  async listOpportunities() {
    return extractItems(await httpClient.get('/bridge/opportunities'));
  },

  async createOpportunity(payload = {}) {
    return extractData(await httpClient.post('/bridge/opportunities', payload));
  },

  async updateOpportunity(id, payload = {}) {
    return extractData(await httpClient.patch(`/bridge/opportunities/${encodeURIComponent(id)}`, payload));
  },

  async deleteOpportunity(id) {
    return extractData(await httpClient.delete(`/bridge/opportunities/${encodeURIComponent(id)}`));
  },

  async createFromMaDeal(dealId) {
    return extractData(
      await httpClient.post(`/bridge/opportunities/from-ma-deal/${encodeURIComponent(dealId)}`)
    );
  },

  async createFromFundingRound(roundId) {
    return extractData(
      await httpClient.post(`/bridge/opportunities/from-funding-round/${encodeURIComponent(roundId)}`)
    );
  },

  async listCounterparties() {
    return extractItems(await httpClient.get('/bridge/counterparties'));
  },

  async createCounterparty(payload = {}) {
    return extractData(await httpClient.post('/bridge/counterparties', payload));
  },

  async updateCounterparty(id, payload = {}) {
    return extractData(await httpClient.patch(`/bridge/counterparties/${encodeURIComponent(id)}`, payload));
  },

  async deleteCounterparty(id) {
    return extractData(await httpClient.delete(`/bridge/counterparties/${encodeURIComponent(id)}`));
  },

  async listIntroductions(params = {}) {
    return extractItems(
      await httpClient.get('/bridge/introductions', {
        params: params.opportunityId ? { opportunityId: params.opportunityId } : {}
      })
    );
  },

  async createIntroduction(payload = {}) {
    return extractData(await httpClient.post('/bridge/introductions', payload));
  },

  async listDocuments() {
    return extractItems(await httpClient.get('/bridge/documents'));
  },

  async createDocument(payload = {}) {
    return extractData(await httpClient.post('/bridge/documents', payload));
  },

  async updateDocument(id, payload = {}) {
    return extractData(await httpClient.patch(`/bridge/documents/${encodeURIComponent(id)}`, payload));
  },

  async listReports() {
    return extractItems(await httpClient.get('/bridge/reports'));
  },

  async generateReport(payload = {}) {
    return extractData(await httpClient.post('/bridge/reports/generate', payload));
  },

  async listAuditLogs(params = {}) {
    return extractItems(await httpClient.get('/bridge/audit-logs', { params }));
  },

  async getMatches(opportunityId) {
    return extractItems(
      await httpClient.get(`/bridge/opportunities/${encodeURIComponent(opportunityId)}/matches`)
    );
  },

  async getHubOverview() {
    return extractData(await httpClient.get('/bridge/hub-overview'));
  }
};

export default bridgeApi;
