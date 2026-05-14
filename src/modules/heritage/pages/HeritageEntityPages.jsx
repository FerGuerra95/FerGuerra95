import React, { useEffect, useState } from 'react';
import { Badge } from '../../../shared/components/ui/Badge.jsx';
import { PERMISSIONS, useAuth } from '../../../app/providers/AuthProvider.jsx';
import { heritageApi } from '../services/heritageApi.js';
import {
  HeritageAssetTable,
  HeritageListPanel,
  heritageEnterpriseCss
} from '../components/HeritageEnterpriseComponents.jsx';

function EntityPage({ badge, title, copy, load, create, defaults, fields, render, permission }) {
  const { can } = useAuth();
  const canCreate = can(permission);
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(defaults);
  const [status, setStatus] = useState({ loading: true, error: null });

  async function refresh() {
    try {
      setItems(await load());
      setStatus({ loading: false, error: null });
    } catch (error) {
      setStatus({ loading: false, error });
    }
  }

  useEffect(() => { refresh(); }, []);

  async function submit(event) {
    event.preventDefault();
    if (!canCreate) return;
    await create(form);
    setForm(defaults);
    await refresh();
  }

  return (
    <div className="page">
      <style>{heritageEnterpriseCss}</style>
      <div className="heritage-enterprise-page">
        <section className="heritage-enterprise-hero">
          <Badge>{badge}</Badge>
          <h1 className="heritage-enterprise-title">{title}</h1>
          <p className="heritage-enterprise-copy">{copy}</p>
        </section>
        <form className="heritage-enterprise-toolbar" onSubmit={submit}>
          {fields.map((field) => (
            <label className="heritage-enterprise-field" key={field}>
              <span>{field}</span>
              <input
                aria-label={field}
                className="heritage-enterprise-input"
                disabled={!canCreate}
                value={form[field] || ''}
                onChange={(event) => setForm((current) => ({ ...current, [field]: event.target.value }))}
              />
            </label>
          ))}
          <button className="heritage-enterprise-button" disabled={!canCreate}>
            {canCreate ? 'Create' : 'Read only'}
          </button>
        </form>
        {status.loading ? <div className="heritage-enterprise-empty">Loading records.</div> : null}
        {status.error ? <div className="heritage-enterprise-empty">Records could not be loaded.</div> : null}
        {render(items)}
      </div>
    </div>
  );
}

export function HeritageAssetsPage() {
  return (
    <EntityPage
      badge="Asset Register"
      title="Controlled patrimony register."
      copy="Assets mapped by owner, jurisdiction, protection posture, liquidity profile and estimated value."
      load={heritageApi.listAssets}
      create={heritageApi.createAsset}
      defaults={{ name: '', assetType: '', estimatedValue: '' }}
      fields={['name', 'assetType', 'estimatedValue']}
      permission={PERMISSIONS.CREATE_HERITAGE}
      render={(items) => <HeritageAssetTable items={items} />}
    />
  );
}

export function HeritageSuccessionsPage() {
  return (
    <EntityPage
      badge="Succession"
      title="Succession planning."
      copy="Owner continuity protocols with successor clarity, evidence readiness and effective dates."
      load={heritageApi.listSuccessions}
      create={heritageApi.createSuccession}
      defaults={{ title: '', owner: '', readiness: '' }}
      fields={['title', 'owner', 'readiness']}
      permission={PERMISSIONS.MANAGE_HERITAGE_SUCCESSION}
      render={(items) => <HeritageListPanel title="Succession protocols" items={items} primary="title" secondary="readiness" />}
    />
  );
}

export function HeritageProtectionsPage() {
  return (
    <EntityPage
      badge="Protection"
      title="Asset protection controls."
      copy="Legal, insurance, tax and governance controls with coverage, owner and review cadence."
      load={heritageApi.listProtections}
      create={heritageApi.createProtection}
      defaults={{ name: '', owner: '', coverage: '' }}
      fields={['name', 'owner', 'coverage']}
      permission={PERMISSIONS.MANAGE_HERITAGE_PROTECTION}
      render={(items) => <HeritageListPanel title="Protection controls" items={items} primary="name" secondary="coverage" />}
    />
  );
}

export function HeritageDocumentsPage() {
  return (
    <EntityPage
      badge="Evidence"
      title="Controlled documents."
      copy="Confidential evidence register for succession, asset protection and continuity reporting."
      load={heritageApi.listDocuments}
      create={heritageApi.createDocument}
      defaults={{ title: '', documentType: '' }}
      fields={['title', 'documentType']}
      permission={PERMISSIONS.CREATE_HERITAGE}
      render={(items) => <HeritageListPanel title="Evidence register" items={items} primary="title" secondary="evidenceStatus" />}
    />
  );
}

export function HeritageReportsPage() {
  const { can } = useAuth();
  const [items, setItems] = useState([]);

  async function refresh() {
    setItems(await heritageApi.listReports());
  }

  useEffect(() => { refresh(); }, []);

  async function generate() {
    if (!can(PERMISSIONS.EXPORT_HERITAGE_REPORT)) return;
    await heritageApi.generateReport({ title: 'Heritage Continuity Report' });
    await refresh();
  }

  return (
    <div className="page">
      <style>{heritageEnterpriseCss}</style>
      <div className="heritage-enterprise-page">
        <section className="heritage-enterprise-hero">
          <Badge>Reports</Badge>
          <h1 className="heritage-enterprise-title">Continuity reports.</h1>
          <p className="heritage-enterprise-copy">Board-ready continuity, evidence and owner-risk reporting for strategic governance review.</p>
          <button className="heritage-enterprise-button" type="button" disabled={!can(PERMISSIONS.EXPORT_HERITAGE_REPORT)} onClick={generate}>
            Generate report
          </button>
        </section>
        <HeritageListPanel title="Generated reports" items={items} primary="title" secondary="reportType" />
      </div>
    </div>
  );
}

export function HeritageAuditTrailPage() {
  const [items, setItems] = useState([]);
  useEffect(() => { heritageApi.listAuditTrail().then(setItems).catch(() => setItems([])); }, []);
  return (
    <div className="page">
      <style>{heritageEnterpriseCss}</style>
      <div className="heritage-enterprise-page">
        <section className="heritage-enterprise-hero">
          <Badge>Audit Trail</Badge>
          <h1 className="heritage-enterprise-title">Heritage audit trail.</h1>
          <p className="heritage-enterprise-copy">Organization-scoped traceability for patrimony, succession, protection, documents and reports.</p>
        </section>
        <HeritageListPanel title="Audit events" items={items} primary="action" secondary="createdAt" />
      </div>
    </div>
  );
}
