import React from 'react';

export function ReportSection({ title, eyebrow, status, children }) {
  return (
    <section
      className="ceos-report-section"
      style={{
        breakInside: 'avoid',
        pageBreakInside: 'avoid',
        border: '1px solid #e2e8f0',
        borderRadius: 8,
        padding: 18,
        marginBottom: 16,
        background: '#ffffff'
      }}
    >
      {eyebrow || status ? (
        <p style={{ margin: '0 0 6px', color: '#64748b', fontSize: 11, fontWeight: 800, textTransform: 'uppercase' }}>
          {[eyebrow, status].filter(Boolean).join(' - ')}
        </p>
      ) : null}
      <h2 style={{ margin: '0 0 12px', color: '#0f172a', fontSize: 18 }}>{title}</h2>
      {children}
    </section>
  );
}

export default ReportSection;
