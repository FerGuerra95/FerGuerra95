import { httpClient } from '../../../shared/services/httpClient.js';

function extractData(payload) {
  if (!payload) return null;
  return payload.data ?? payload;
}

function extractItems(payload) {
  const data = extractData(payload);

  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.items)) return data.items;

  return [];
}

export const maDealsApi = {
  async list() {
    return extractItems(await httpClient.get('/ma/deals'));
  },

  async create(payload = {}) {
    return extractData(await httpClient.post('/ma/deals', payload));
  },

  async update(id, payload = {}) {
    return extractData(await httpClient.patch(`/ma/deals/${id}`, payload));
  },

  async remove(id) {
    return extractData(await httpClient.delete(`/ma/deals/${id}`));
  }
};

export default maDealsApi;
