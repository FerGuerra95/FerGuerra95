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

function normalizeBranch(branch) {
  return encodeURIComponent(String(branch || '').trim().toLowerCase());
}

export const ecosystemApi = {
  async listRecords(branch) {
    const response = await httpClient.get(`/ecosystem/${normalizeBranch(branch)}/records`);
    return extractItems(response);
  },

  async createRecord(branch, payload = {}) {
    const response = await httpClient.post(
      `/ecosystem/${normalizeBranch(branch)}/records`,
      payload
    );
    return extractData(response);
  },

  async updateRecord(branch, id, payload = {}) {
    const response = await httpClient.patch(
      `/ecosystem/${normalizeBranch(branch)}/records/${encodeURIComponent(id)}`,
      payload
    );
    return extractData(response);
  },

  async deleteRecord(branch, id) {
    const response = await httpClient.delete(
      `/ecosystem/${normalizeBranch(branch)}/records/${encodeURIComponent(id)}`
    );
    return extractData(response);
  },

  async getExecutiveHubBrief() {
    const response = await httpClient.get('/ecosystem/hub-overview');
    return extractData(response);
  }
};

export default ecosystemApi;
