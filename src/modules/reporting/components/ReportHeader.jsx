import React, { useState } from 'react';

import { BOARD_REVIEW_DRAFT_LABELS } from '../utils/reportLabels.js';
import { safeDate, safeText } from '../utils/reportSanitizers.js';

const headerStyle = {
  display: 'grid',
  gridTemplateColumns: 'minmax(140px, 220px) 1fr',
  gap: 20,
  alignItems: 'center',
  borderBottom: '2px solid #172033',
  paddingBottom: 18,
  marginBottom: 24
};

const logoStyle = {
  maxWidth: 200,
  maxHeight: 52,
  objectFit: 'contain'
};

const textMarkStyle = {
  fontWeight: 800,
  color: '#111827',
  fontSize: 22,
  letterSpacing: 0
};

const badgeRowStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: 8,
  marginTop: 10
};

const badgeStyle = {
  border: '1px solid #cbd5e1',
  borderRadius: 6,
  padding: '4px 8px',
  fontSize: 11,
  fontWeight: 800,
  textTransform: 'uppercase',
  letterSpacing: 0,
  color: '#172033',
  background: '#f8fafc'
};

export function ReportHeader({
  logoSrc,
  title,
  status = BOARD_REVIEW_DRAFT_LABELS.status,
  classification = BOARD_REVIEW_DRAFT_LABELS.confidential,
  generatedAt,
  organizationName,
  scopeLabel,
  humanReviewRequired = true
}) {
  const [logoFailed, setLogoFailed] = useState(false);
  const generatedLabel = safeDate(generatedAt || new Date());
  const scope = [organizationName, scopeLabel].map((item) => safeText(item, '')).filter(Boolean).join(' - ');

  return (
    <header className="ceos-report-header" style={headerStyle}>
      <div className="ceos-report-header-logo">
        {logoSrc && !logoFailed ? (
          <img
            src={logoSrc}
            alt="CEO's OS"
            style={logoStyle}
            onError={() => setLogoFailed(true)}
          />
        ) : (
          <div style={textMarkStyle}>CEO&apos;s OS</div>
        )}
      </div>
      <div>
        <p style={{ margin: '0 0 4px', fontSize: 12, color: '#64748b', fontWeight: 800 }}>
          {safeText(classification)}
        </p>
        <h1 style={{ margin: 0, fontSize: 28, lineHeight: 1.15, color: '#0f172a' }}>
          {safeText(title, 'Board Review Draft')}
        </h1>
        <div style={badgeRowStyle}>
          <span style={badgeStyle}>{safeText(status)}</span>
          {humanReviewRequired ? <span style={badgeStyle}>{BOARD_REVIEW_DRAFT_LABELS.humanReview}</span> : null}
          <span style={badgeStyle}>{BOARD_REVIEW_DRAFT_LABELS.notBoardApproved}</span>
          <span style={badgeStyle}>{BOARD_REVIEW_DRAFT_LABELS.basedOnDss}</span>
        </div>
        <p style={{ margin: '10px 0 0', color: '#475569', fontSize: 12 }}>
          Prepared at: {generatedLabel}{scope ? ` - Scope: ${scope}` : ''}
        </p>
      </div>
    </header>
  );
}

export default ReportHeader;
