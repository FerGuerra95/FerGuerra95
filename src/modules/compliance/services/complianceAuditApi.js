import { httpClient } from '../../../shared/services/httpClient.js';

function extractItems(response) {
  const data = response.data ?? response;
  return Array.isArray(data?.items) ? data.items : [];
}

export const complianceAuditApi = {
  async listAuditRuns() {
    const response = await httpClient.get('/compliance/audit-runs');
    return extractItems(response);
  },

  async runAudit(payload = {}) {
    const response = await httpClient.post('/compliance/audit-runs', {
      scope: payload.scope || 'portfolio',
      frameworks: payload.frameworks || ['gdpr', 'iso27001', 'soc2', 'csddd'],
      ...(payload.supplierId ? { supplierId: payload.supplierId } : {}),
      ...(payload.maCaseId ? { maCaseId: payload.maCaseId } : {})
    });

    return response.data ?? response;
  },

  async getAuditRun(id) {
    const response = await httpClient.get(
      `/compliance/audit-runs/${encodeURIComponent(id)}`
    );

    return response.data ?? response;
  },

  async exportAuditLedger(id) {
    const response = await httpClient.get(
      `/compliance/audit-runs/${encodeURIComponent(id)}/ledger-export`
    );

    return response.data ?? response;
  },

  async listMaRiskImpacts({ maCaseId = '' } = {}) {
    const suffix = maCaseId ? `?maCaseId=${encodeURIComponent(maCaseId)}` : '';
    const response = await httpClient.get(`/compliance/ma-risk-impacts${suffix}`);

    return extractItems(response);
  },

  async getExecutiveHubBrief() {
    const response = await httpClient.get('/compliance/hub-overview');
    return response.data ?? response;
  }
};

export default complianceAuditApi;
