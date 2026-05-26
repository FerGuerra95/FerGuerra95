import React from 'react';

import defaultLogoSrc from '../../../assets/brand/ceos-os-horizontal-color.png?url';
import { ReportFooter } from '../components/ReportFooter.jsx';
import { ReportHeader } from '../components/ReportHeader.jsx';
import { ReportSection } from '../components/ReportSection.jsx';
import { BOARD_REVIEW_DRAFT_LABELS, BOARD_REVIEW_DRAFT_LIMITATIONS } from '../utils/reportLabels.js';
import {
  normalizeMissingData,
  safeDate,
  safeList,
  safeText,
  sanitizeSignal
} from '../utils/reportSanitizers.js';

function ListBlock({ items, emptyLabel = 'N/A' }) {
  const list = safeList(items);
  if (list.length === 0) {
    return <p style={{ color: '#64748b' }}>{emptyLabel}</p>;
  }
  return (
    <ul>
      {list.map((item, index) => (
        <li key={`${safeText(item)}-${index}`}>{safeText(item)}</li>
      ))}
    </ul>
  );
}

export function BoardReviewDraftRenderer({
  title,
  organizationName,
  scopeLabel,
  generatedAt,
  executiveSummary,
  moduleSignals,
  keyRisks,
  missingData,
  reviewQuestions,
  humanReviewChecklist,
  auditMetadata,
  logoSrc = defaultLogoSrc
}) {
  const signals = safeList(moduleSignals).map(sanitizeSignal);
  const metadata = auditMetadata && typeof auditMetadata === 'object' ? auditMetadata : {};

  return (
    <article
      className="ceos-board-review-draft"
      style={{
        width: '210mm',
        minHeight: '297mm',
        margin: '0 auto',
        padding: '20mm',
        background: '#ffffff',
        color: '#0f172a',
        fontFamily: 'Arial, Helvetica, sans-serif'
      }}
    >
      <ReportHeader
        logoSrc={logoSrc}
        title={title || BOARD_REVIEW_DRAFT_LABELS.status}
        status={BOARD_REVIEW_DRAFT_LABELS.status}
        classification={BOARD_REVIEW_DRAFT_LABELS.confidential}
        generatedAt={generatedAt || new Date()}
        organizationName={organizationName}
        scopeLabel={scopeLabel}
        humanReviewRequired
      />

      <ReportSection title="Executive Summary" eyebrow={BOARD_REVIEW_DRAFT_LABELS.basedOnDss}>
        <p>{safeText(executiveSummary)}</p>
      </ReportSection>

      <ReportSection title="Module Signals">
        {signals.length === 0 ? (
          <p style={{ color: '#64748b' }}>insufficient_data</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th>Module</th>
                <th>Signal</th>
                <th>Status</th>
                <th>Score</th>
                <th>Source</th>
              </tr>
            </thead>
            <tbody>
              {signals.map((signal, index) => (
                <tr key={`${signal.module}-${signal.label}-${index}`}>
                  <td>{signal.module}</td>
                  <td>{signal.label}</td>
                  <td>{signal.status}</td>
                  <td>{safeText(signal.score)}</td>
                  <td>{signal.sourceLabel}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </ReportSection>

      <ReportSection title="Key Risks">
        <ListBlock items={keyRisks} />
      </ReportSection>

      <ReportSection title="Missing / Insufficient Data">
        <ListBlock items={normalizeMissingData(missingData)} emptyLabel="insufficient_data" />
      </ReportSection>

      <ReportSection title="Review Questions">
        <ListBlock items={reviewQuestions} />
      </ReportSection>

      <ReportSection title="Human Review Checklist">
        <ListBlock items={humanReviewChecklist} emptyLabel={BOARD_REVIEW_DRAFT_LABELS.humanReview} />
      </ReportSection>

      <ReportSection title="Audit Metadata">
        {Object.keys(metadata).length === 0 ? (
          <p style={{ color: '#64748b' }}>N/A</p>
        ) : (
          <dl>
            {Object.entries(metadata).map(([key, value]) => (
              <div key={key}>
                <dt>{safeText(key)}</dt>
                <dd>{key.toLowerCase().includes('at') ? safeDate(value) : safeText(value)}</dd>
              </div>
            ))}
          </dl>
        )}
      </ReportSection>

      <ReportSection title="Limitations">
        <ListBlock items={BOARD_REVIEW_DRAFT_LIMITATIONS} />
      </ReportSection>

      <ReportFooter />
    </article>
  );
}

export default BoardReviewDraftRenderer;
