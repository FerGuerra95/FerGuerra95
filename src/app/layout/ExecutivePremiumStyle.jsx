import React from 'react';

const executivePremiumCss = `
  /*
    C.24.4B — M&A runtime theme (AppShell).
    Scope: M&A page wrappers only. Do not use universal * selectors.
    Full merge into maExecutiveTheme.css deferred to post-C.24.4C.
  */
  :root {
    --premium-surface: rgba(10, 15, 26, 0.94);
    --premium-surface-soft: rgba(2, 6, 23, 0.30);
    --premium-line: rgba(148, 163, 184, 0.14);
    --premium-line-strong: rgba(148, 163, 184, 0.20);
    --premium-accent: #20c997;
  }

  .main-area :is(
    .ma-executive-page,
    .ma-valuation-page,
    .ma-pipeline-page,
    .waterfall-page,
    .cim-page,
    .buyer-page,
    .deals-page,
    .ma-deal-detail-page
  ) {
    width: min(1380px, calc(100% - 48px)) !important;
    margin: 0 auto !important;
    gap: 26px !important;
    color: #f8fafc !important;
  }

  .main-area :is(
    .ma-executive-page,
    .ma-valuation-page,
    .ma-pipeline-page,
    .waterfall-page,
    .cim-page,
    .buyer-page,
    .deals-page,
    .ma-deal-detail-page
  ) :is(
    [class*="hero"],
    [class*="signal-card"],
    [class*="status-card"],
    [class*="command-item"],
    [class*="kpi-card"],
    [class*="summary-card"],
    [class*="panel"],
    [class*="card"],
    [class*="metric"],
    [class*="state-card"],
    [class*="workflow-card"],
    [class*="bridge-panel"],
    [class*="bridge-step"],
    [class*="bridge-row"],
    [class*="glass-block"],
    [class*="deal-card"],
    [class*="inference-item"],
    [class*="adjustment-item"],
    [class*="distribution-card"],
    [class*="score-module"],
    [class*="empty"]
  ) {
    background: var(--premium-surface) !important;
    background-image: none !important;
    border: 1px solid var(--premium-line) !important;
    border-radius: 18px !important;
    filter: none !important;
    transform: none !important;
    overflow: hidden !important;
  }

  .main-area :is(
    .ma-executive-page,
    .ma-valuation-page,
    .ma-pipeline-page,
    .waterfall-page,
    .cim-page,
    .buyer-page,
    .deals-page,
    .ma-deal-detail-page
  ) :is(
    [class*="hero"],
    [class*="signal-card"],
    [class*="status-card"],
    [class*="command-item"],
    [class*="kpi-card"],
    [class*="summary-card"],
    [class*="panel"],
    [class*="card"],
    [class*="metric"],
    [class*="state-card"],
    [class*="workflow-card"],
    [class*="bridge-panel"],
    [class*="bridge-step"],
    [class*="bridge-row"],
    [class*="glass-block"],
    [class*="deal-card"],
    [class*="inference-item"],
    [class*="adjustment-item"],
    [class*="distribution-card"],
    [class*="score-module"],
    [class*="empty"]
  )::before,
  .main-area :is(
    .ma-executive-page,
    .ma-valuation-page,
    .ma-pipeline-page,
    .waterfall-page,
    .cim-page,
    .buyer-page,
    .deals-page,
    .ma-deal-detail-page
  ) :is(
    [class*="hero"],
    [class*="signal-card"],
    [class*="status-card"],
    [class*="command-item"],
    [class*="kpi-card"],
    [class*="summary-card"],
    [class*="panel"],
    [class*="card"],
    [class*="metric"],
    [class*="state-card"],
    [class*="workflow-card"],
    [class*="bridge-panel"],
    [class*="bridge-step"],
    [class*="bridge-row"],
    [class*="glass-block"],
    [class*="deal-card"],
    [class*="inference-item"],
    [class*="adjustment-item"],
    [class*="distribution-card"],
    [class*="score-module"],
    [class*="empty"]
  )::after {
    content: none !important;
    display: none !important;
  }

  .main-area :is(
    .ma-executive-page,
    .ma-valuation-page,
    .ma-pipeline-page,
    .waterfall-page,
    .cim-page,
    .buyer-page,
    .deals-page,
    .ma-deal-detail-page
  ) :is(
    [class*="layout"],
    [class*="grid"],
    [class*="list"],
    [class*="inner"],
    [class*="header"],
    [class*="footer"],
    [class*="top"],
    [class*="head"],
    [class*="copy"],
    [class*="meta"],
    [class*="actions"],
    [class*="badges"],
    [class*="badge-row"],
    [class*="chip-row"],
    [class*="controls"],
    [class*="table"]
  ) {
    background: transparent !important;
    background-image: none !important;
    box-shadow: none !important;
  }

  .main-area :is(
    .ma-title,
    .ma-valuation-title,
    .ma-pipeline-title,
    .waterfall-title,
    .cim-title,
    .buyer-title,
    .deals-title,
    .ma-deal-detail-title
  ) {
    max-width: 880px !important;
    font-size: clamp(42px, 4.2vw, 62px) !important;
    line-height: 1.02 !important;
    font-weight: 850 !important;
    color: #f8fafc !important;
  }

  .main-area :is(
    .ma-title,
    .ma-valuation-title,
    .ma-pipeline-title,
    .waterfall-title,
    .cim-title,
    .buyer-title,
    .deals-title,
    .ma-deal-detail-title
  ) span {
    color: rgba(203, 213, 225, 0.72) !important;
  }

  .main-area :is(
    .ma-executive-page,
    .ma-valuation-page,
    .ma-pipeline-page,
    .waterfall-page,
    .cim-page,
    .buyer-page,
    .deals-page,
    .ma-deal-detail-page
  ) :is([class*="copy"], [class*="description"], .muted, p) {
    color: rgba(203, 213, 225, 0.72) !important;
    line-height: 1.62 !important;
  }

  .main-area :is(
    .ma-executive-page,
    .ma-valuation-page,
    .ma-pipeline-page,
    .waterfall-page,
    .cim-page,
    .buyer-page,
    .deals-page,
    .ma-deal-detail-page
  ) :is([class*="kicker"], .kpi-label, [class*="eyebrow"], [class*="label"]) {
    color: rgba(148, 163, 184, 0.90) !important;
    background: transparent !important;
    border: 0 !important;
    border-radius: 0 !important;
    padding-inline: 0 !important;
    text-transform: uppercase !important;
    font-size: 11px !important;
    font-weight: 800 !important;
  }

  .main-area :is(
    .ma-executive-page,
    .ma-valuation-page,
    .ma-pipeline-page,
    .waterfall-page,
    .cim-page,
    .buyer-page,
    .deals-page,
    .ma-deal-detail-page
  ) :is([class*="value"], [class*="amount"], [class*="score-core"] strong, [class*="ring-core"] strong, [class*="metric"] strong, [class*="kpi"] strong) {
    color: #f8fafc !important;
    font-variant-numeric: tabular-nums !important;
  }

  .main-area :is(
    .ma-executive-page,
    .ma-valuation-page,
    .ma-pipeline-page,
    .waterfall-page,
    .cim-page,
    .buyer-page,
    .deals-page,
    .ma-deal-detail-page
  ) :is([class*="icon"], [class*="number"], [class*="count"]) {
    background: rgba(32, 201, 151, 0.10) !important;
    border-color: rgba(32, 201, 151, 0.22) !important;
    color: #7dd3c7 !important;
  }

  .main-area :is(
    .ma-executive-page,
    .ma-valuation-page,
    .ma-pipeline-page,
    .waterfall-page,
    .cim-page,
    .buyer-page,
    .deals-page,
    .ma-deal-detail-page
  ) :is(.button, button, a.button, [class*="open"], [class*="link"], [class*="chip"], .badge) {
    border-radius: 999px !important;
  }

  .main-area :is(
    .ma-executive-page,
    .ma-valuation-page,
    .ma-pipeline-page,
    .waterfall-page,
    .cim-page,
    .buyer-page,
    .deals-page,
    .ma-deal-detail-page
  ) :is(input, select, textarea) {
    background: rgba(2, 6, 23, 0.62) !important;
    background-image: none !important;
    border-color: rgba(148, 163, 184, 0.16) !important;
    border-radius: 14px !important;
  }

  .main-area .ma-valuation-workspace {
    grid-template-columns: minmax(320px, 380px) minmax(0, 1fr) !important;
    gap: 26px !important;
  }

  .main-area :is(.ma-premium-metrics-grid, .ma-grid-kpis, .waterfall-grid-kpis, .deals-grid-kpis, .buyer-grid-kpis, .cim-grid-kpis) {
    grid-template-columns: repeat(4, minmax(150px, 1fr)) !important;
  }

  .main-area :is(.ma-equity-safe-score, .ma-comparable-multiple-row, .ma-closing-footer-card, .ma-slider-field, .waterfall-score-module, .deals-score-module, .buyer-score-module, .cim-score-module) {
    background: var(--premium-surface-soft) !important;
    border-color: rgba(148, 163, 184, 0.10) !important;
  }

  .main-area :is(.ma-comparables-header, .ma-comparables-section) {
    background: transparent !important;
    border-color: transparent !important;
  }

  .main-area .ma-comparables-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
    gap: 22px !important;
  }

  .main-area .ma-comparable-name {
    font-size: 18px !important;
    line-height: 1.18 !important;
    overflow-wrap: normal !important;
    word-break: normal !important;
    hyphens: none !important;
  }

  .main-area .ma-comparable-multiple {
    font-size: 34px !important;
    line-height: 1 !important;
  }

  .main-area .ma-comparable-multiple-label {
    max-width: 92px !important;
    font-size: 10px !important;
    line-height: 1.25 !important;
  }

  .main-area .deals-page {
    gap: 32px !important;
  }

  .main-area .deals-hero {
    overflow: visible !important;
    height: auto !important;
    min-height: 0 !important;
  }

  .main-area .deals-hero-layout {
    align-items: stretch !important;
    grid-template-columns: minmax(0, 1fr) minmax(340px, 390px) !important;
  }

  .main-area .deals-copy {
    max-width: 760px !important;
    margin-top: 20px !important;
  }

  .main-area .deals-command-bar {
    grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
  }

  .main-area .deals-signal-card {
    height: auto !important;
    min-height: 0 !important;
    align-self: stretch !important;
  }

  .main-area .deals-grid-kpis {
    grid-template-columns: repeat(4, minmax(190px, 1fr)) !important;
  }

  .main-area .deals-kpi-card {
    height: auto !important;
    min-height: 170px !important;
  }

  .main-area .deals-kpi-value {
    font-size: 23px !important;
    line-height: 1.16 !important;
    overflow-wrap: normal !important;
    word-break: normal !important;
  }

  .main-area .deals-panel {
    height: auto !important;
    min-height: 0 !important;
    padding: 28px !important;
  }

  .main-area .deals-case-card {
    height: auto !important;
    min-height: 0 !important;
  }

  .main-area .deals-case-metrics {
    grid-template-columns: repeat(4, minmax(160px, 1fr)) !important;
  }

  .main-area .deals-case-metric {
    height: auto !important;
    min-height: 82px !important;
  }

  .main-area .buyer-match-header {
    display: none !important;
  }

  .main-area .buyer-match-section {
    background: transparent !important;
    background-image: none !important;
    border-color: transparent !important;
    gap: 20px !important;
  }

  .main-area .buyer-match-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
    gap: 22px !important;
  }

  .main-area .buyer-match-card {
    min-height: 0 !important;
    height: auto !important;
  }

  .main-area .buyer-match-title {
    font-size: 20px !important;
    line-height: 1.18 !important;
    overflow-wrap: normal !important;
    word-break: normal !important;
    hyphens: none !important;
  }

  .main-area .buyer-match-description,
  .main-area .buyer-match-score-copy,
  .main-area .buyer-match-score-copy p {
    background: transparent !important;
    background-image: none !important;
  }

  .main-area .buyer-match-score-box {
    grid-template-columns: 82px minmax(0, 1fr) !important;
    gap: 16px !important;
  }

  .main-area .buyer-match-ring {
    width: 76px !important;
    height: 76px !important;
  }

  .main-area .buyer-match-ring-core {
    width: 56px !important;
    height: 56px !important;
  }

  @media (max-width: 1180px) {
    .main-area :is(.ma-valuation-workspace, [class*="hero-layout"], [class*="grid-two"]) {
      grid-template-columns: 1fr !important;
    }
  }

  @media (max-width: 780px) {
    .main-area :is(
      .ma-executive-page,
      .ma-valuation-page,
      .ma-pipeline-page,
      .waterfall-page,
      .cim-page,
      .buyer-page,
      .deals-page,
      .ma-deal-detail-page
    ) {
      width: min(100% - 24px, 1380px) !important;
    }

    .main-area :is(.ma-premium-metrics-grid, .ma-grid-kpis, .waterfall-grid-kpis, .deals-grid-kpis, .buyer-grid-kpis, .cim-grid-kpis) {
      grid-template-columns: 1fr !important;
    }
  }
`;

export function ExecutivePremiumStyle() {
  return <style>{executivePremiumCss}</style>;
}
