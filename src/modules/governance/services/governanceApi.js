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

export const governanceApi = {
  getDashboard: async () => data(await httpClient.get('/governance/dashboard')),
  getSummary: async () => data(await httpClient.get('/governance/summary')),
  listDecisions: async () => items(await httpClient.get('/governance/decisions')),
  getDecision: async (id) => data(await httpClient.get(`/governance/decisions/${encodeURIComponent(id)}`)),
  createDecision: async (payload) => data(await httpClient.post('/governance/decisions', payload)),
  updateDecision: async (id, payload) => data(await httpClient.patch(`/governance/decisions/${encodeURIComponent(id)}`, payload)),
  submitDecision: async (id, payload = {}) => data(await httpClient.post(`/governance/decisions/${encodeURIComponent(id)}/submit`, payload)),
  approveDecision: async (id, payload = {}) => data(await httpClient.post(`/governance/decisions/${encodeURIComponent(id)}/approve`, payload)),
  rejectDecision: async (id, payload = {}) => data(await httpClient.post(`/governance/decisions/${encodeURIComponent(id)}/reject`, payload)),
  deferDecision: async (id, payload = {}) => data(await httpClient.post(`/governance/decisions/${encodeURIComponent(id)}/defer`, payload)),
  escalateDecision: async (id, payload = {}) => data(await httpClient.post(`/governance/decisions/${encodeURIComponent(id)}/escalate`, payload)),
  implementDecision: async (id, payload = {}) => data(await httpClient.post(`/governance/decisions/${encodeURIComponent(id)}/implement`, payload)),
  listBoardPacks: async () => items(await httpClient.get('/governance/board-packs')),
  createBoardPack: async (payload) => data(await httpClient.post('/governance/board-packs', payload)),
  listCommittees: async () => items(await httpClient.get('/governance/committees')),
  createCommittee: async (payload) => data(await httpClient.post('/governance/committees', payload)),
  listPolicies: async () => items(await httpClient.get('/governance/policies')),
  createPolicy: async (payload) => data(await httpClient.post('/governance/policies', payload)),
  listActions: async () => items(await httpClient.get('/governance/actions')),
  createAction: async (payload) => data(await httpClient.post('/governance/actions', payload)),
  completeAction: async (id, payload = {}) => data(await httpClient.post(`/governance/actions/${encodeURIComponent(id)}/complete`, payload)),
  listMeetings: async () => items(await httpClient.get('/governance/meetings')),
  createMeeting: async (payload) => data(await httpClient.post('/governance/meetings', payload)),
  listReports: async () => items(await httpClient.get('/governance/reports')),
  createReport: async (payload) => data(await httpClient.post('/governance/reports', payload)),
  listAuditTrail: async () => items(await httpClient.get('/governance/audit-trail'))
};

export default governanceApi;
