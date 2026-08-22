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
    [class*="hero"]:not(.ma-valuation-surface),
    [class*="signal-card"]:not(.ma-valuation-surface),
    [class*="status-card"]:not(.ma-valuation-surface),
    [class*="command-item"]:not(.ma-valuation-surface),
    [class*="kpi-card"]:not(.ma-valuation-surface),
    [class*="summary-card"]:not(.ma-valuation-surface),
    [class*="panel"]:not(.ma-valuation-surface),
    [class*="card"]:not(.ma-valuation-surface),
    [class*="metric"]:not(.ma-valuation-surface),
    [class*="state-card"]:not(.ma-valuation-surface),
    [class*="workflow-card"]:not(.ma-valuation-surface),
    [class*="bridge-panel"]:not(.ma-valuation-surface),
    [class*="bridge-step"]:not(.ma-valuation-surface),
    [class*="bridge-row"]:not(.ma-valuation-surface),
    [class*="glass-block"]:not(.ma-valuation-surface),
    [class*="deal-card"]:not(.ma-valuation-surface),
    [class*="inference-item"]:not(.ma-valuation-surface),
    [class*="adjustment-item"]:not(.ma-valuation-surface),
    [class*="distribution-card"]:not(.ma-valuation-surface),
    [class*="score-module"]:not(.ma-valuation-surface),
    [class*="empty"]:not(.ma-valuation-surface)
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
    [class*="hero"]:not(.ma-valuation-surface),
    [class*="signal-card"]:not(.ma-valuation-surface),
    [class*="status-card"]:not(.ma-valuation-surface),
    [class*="command-item"]:not(.ma-valuation-surface),
    [class*="kpi-card"]:not(.ma-valuation-surface),
    [class*="summary-card"]:not(.ma-valuation-surface),
    [class*="panel"]:not(.ma-valuation-surface),
    [class*="card"]:not(.ma-valuation-surface),
    [class*="metric"]:not(.ma-valuation-surface),
    [class*="state-card"]:not(.ma-valuation-surface),
    [class*="workflow-card"]:not(.ma-valuation-surface),
    [class*="bridge-panel"]:not(.ma-valuation-surface),
    [class*="bridge-step"]:not(.ma-valuation-surface),
    [class*="bridge-row"]:not(.ma-valuation-surface),
    [class*="glass-block"]:not(.ma-valuation-surface),
    [class*="deal-card"]:not(.ma-valuation-surface),
    [class*="inference-item"]:not(.ma-valuation-surface),
    [class*="adjustment-item"]:not(.ma-valuation-surface),
    [class*="distribution-card"]:not(.ma-valuation-surface),
    [class*="score-module"]:not(.ma-valuation-surface),
    [class*="empty"]:not(.ma-valuation-surface)
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
    [class*="hero"]:not(.ma-valuation-surface),
    [class*="signal-card"]:not(.ma-valuation-surface),
    [class*="status-card"]:not(.ma-valuation-surface),
    [class*="command-item"]:not(.ma-valuation-surface),
    [class*="kpi-card"]:not(.ma-valuation-surface),
    [class*="summary-card"]:not(.ma-valuation-surface),
    [class*="panel"]:not(.ma-valuation-surface),
    [class*="card"]:not(.ma-valuation-surface),
    [class*="metric"]:not(.ma-valuation-surface),
    [class*="state-card"]:not(.ma-valuation-surface),
    [class*="workflow-card"]:not(.ma-valuation-surface),
    [class*="bridge-panel"]:not(.ma-valuation-surface),
    [class*="bridge-step"]:not(.ma-valuation-surface),
    [class*="bridge-row"]:not(.ma-valuation-surface),
    [class*="glass-block"]:not(.ma-valuation-surface),
    [class*="deal-card"]:not(.ma-valuation-surface),
    [class*="inference-item"]:not(.ma-valuation-surface),
    [class*="adjustment-item"]:not(.ma-valuation-surface),
    [class*="distribution-card"]:not(.ma-valuation-surface),
    [class*="score-module"]:not(.ma-valuation-surface),
    [class*="empty"]:not(.ma-valuation-surface)
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

  /*
    C.24.18 — Valuation premium page runtime shield.
    Generic M&A flatten rules above match [class*="hero"|"card"|"panel"] and can
    clip or collapse /ma/valuation. These selectors win inside the same sheet.
  */
  .main-area .page .ma-valuation-premium-page {
    width: 100% !important;
    max-width: 100% !important;
    display: flex !important;
    flex-direction: column !important;
    gap: 22px !important;
    visibility: visible !important;
    opacity: 1 !important;
    min-height: 0 !important;
  }

  .main-area .page .ma-valuation-premium-page .ma-valuation-hero,
  .main-area .page .ma-valuation-premium-page .ma-val-ref-scene {
    overflow: visible !important;
    height: auto !important;
    min-height: clamp(420px, 38vw, 520px) !important;
  }

  .main-area .page .ma-valuation-premium-page .ma-val-ref-scene-layout {
    display: grid !important;
    grid-template-columns: minmax(0, 1.05fr) minmax(280px, 340px) !important;
    gap: 20px 36px !important;
    align-items: start !important;
    visibility: visible !important;
    opacity: 1 !important;
    overflow: visible !important;
    height: auto !important;
    width: 100% !important;
  }

  .main-area .page .ma-valuation-premium-page .ma-valuation-body-grid {
    display: grid !important;
    grid-template-columns: minmax(300px, 340px) minmax(0, 1fr) !important;
    gap: 28px !important;
    align-items: start !important;
    visibility: visible !important;
    opacity: 1 !important;
    overflow: visible !important;
    height: auto !important;
    width: 100% !important;
  }

  .main-area .page .ma-valuation-premium-page .ma-valuation-sidebar,
  .main-area .page .ma-valuation-premium-page .ma-valuation-main {
    visibility: visible !important;
    opacity: 1 !important;
    overflow: visible !important;
    height: auto !important;
    min-height: 0 !important;
    width: 100% !important;
  }

  .main-area .page .ma-valuation-premium-page .ma-valuation-main {
    display: flex !important;
    flex-direction: column !important;
    gap: 22px !important;
  }

  .main-area .page .ma-valuation-premium-page :is(
    .ma-valuation-surface,
    .ma-equity-safe-card,
    .ma-premium-deal-card,
    .ma-traceability-panel,
    .ma-comparables-shell,
    .ma-intelligence-panel,
    .ma-valuation-status-card,
    .ma-input-cockpit-shell,
    .ma-valuation-command-bar,
    .ma-comparable-card-legible,
    .ma-evidence-checklist-row,
    .ma-bridge-row,
    .ma-empty-engine,
    .ma-valuation-input-cockpit
  ) {
    overflow: visible !important;
    height: auto !important;
    min-height: 0 !important;
  }

  .main-area .page .ma-valuation-premium-page :is(
    .ma-comparable-name,
    .ma-comparable-note,
    .ma-evidence-ledger-title,
    .ma-evidence-ledger-value,
    .ma-bridge-copy strong,
    .ma-bridge-copy p,
    .ma-equity-safe-metric-description,
    .muted,
    .field label
  ) {
    overflow: visible !important;
    text-overflow: clip !important;
    white-space: normal !important;
    -webkit-line-clamp: unset !important;
    line-clamp: unset !important;
    max-height: none !important;
  }

  @media (max-width: 1180px) {
    .main-area .page .ma-valuation-premium-page .ma-valuation-body-grid {
      grid-template-columns: 1fr !important;
    }
  }

  /* C.24.19 — Valuation: no decorative capsules (runtime sheet wins over generic chip pills) */
  .main-area .page .ma-valuation-premium-page :is(
    .ma-comparable-chip,
    .ma-comparable-action,
    .ma-traceability-status-chip,
    .ma-traceability-status-label,
    .ma-traceability-formula-chip,
    .ma-traceability-formula-ref,
    .ma-closing-badge,
    .ma-closing-label,
    .ma-traceability-docs span,
    .ma-traceability-docs-required
  ) {
    border-radius: 0 !important;
    border: 0 !important;
    background: transparent !important;
    background-image: none !important;
    box-shadow: none !important;
    padding: 0 !important;
  }

  .main-area .page .ma-valuation-premium-page :is(
    .ma-equity-safe-metric,
    .ma-equity-safe-stat,
    .ma-premium-metric,
    .ma-premium-stat,
    .ma-inference-item,
    .ma-bridge-row,
    .ma-bridge-list-premium,
    .ma-bridge-list-open,
    .ma-comparable-card-legible,
    .ma-comparable-open-item,
    .ma-evidence-checklist-row,
    .ma-valuation-command-item,
    .ma-valuation-strip-cell,
    .ma-equity-safe-metrics,
    .ma-equity-safe-stats,
    .ma-premium-metrics-grid,
    .ma-premium-stats-grid,
    .ma-val-integrated-metrics,
    .ma-val-integrated-stats,
    [class*="metric-value"],
    [class*="metric-icon"],
    [class*="metric-head"]
  ) {
    border-radius: 0 !important;
    background: transparent !important;
    background-image: none !important;
    box-shadow: none !important;
    border: 0 !important;
    overflow: visible !important;
    filter: none !important;
    transform: none !important;
  }

  /* C.24.20 — Nuclear: EPS [class*="command-item"|"metric"|"card"] must not box inner cells */
  .main-area .page .ma-valuation-premium-page .ma-valuation-command-strip {
    display: grid !important;
    grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
    gap: 0 !important;
    padding: 0 !important;
    overflow: visible !important;
  }

  .main-area .page .ma-valuation-premium-page .ma-valuation-strip-cell {
    background: transparent !important;
    border: 0 !important;
    border-right: 1px solid rgba(90, 255, 220, 0.08) !important;
    border-radius: 0 !important;
    box-shadow: none !important;
    padding: 18px 24px !important;
    overflow: visible !important;
  }

  .main-area .page .ma-valuation-premium-page .ma-valuation-strip-cell:last-child {
    border-right: 0 !important;
  }

  /* C.24.21 — Valuation: flatten panel / icon / ring / multiple EPS attribute hooks */
  .main-area .page .ma-valuation-premium-page :is(
    .ma-equity-safe-quality-readout,
    .ma-equity-safe-quality-panel,
    .ma-equity-safe-signal,
    .ma-equity-safe-secondary-band,
    .ma-equity-safe-risk-row,
    .ma-equity-safe-risk-copy,
    .ma-comparable-open-multiple,
    .ma-comparable-open-metric,
    .ma-equity-safe-ring,
    .ma-equity-safe-ring-core,
    .ma-equity-safe-icon,
    .ma-comparables-header-icon,
    .ma-comparables-empty-icon,
    .ma-premium-deal-icon,
    .ma-panel-icon,
    .ma-inference-icon,
    .ma-closing-footer-card,
    .ma-closing-structure-box
  ) {
    border-radius: 0 !important;
    background: transparent !important;
    background-image: none !important;
    box-shadow: none !important;
    border: 0 !important;
    overflow: visible !important;
    filter: none !important;
    transform: none !important;
  }

  .main-area .page .ma-valuation-premium-page .ma-equity-safe-quality-readout {
    border-left: 1px solid rgba(90, 255, 220, 0.08) !important;
    padding-left: 28px !important;
  }

  .main-area .page .ma-valuation-premium-page .ma-equity-safe-quality-readout .ma-equity-safe-ring {
    display: none !important;
  }

  .main-area .page .ma-valuation-premium-page .ma-comparables-list-open,
  .main-area .page .ma-valuation-premium-page .ma-comparables-ledger.ma-comparables-list-open {
    display: flex !important;
    flex-direction: column !important;
    gap: 0 !important;
    grid-template-columns: unset !important;
  }

  .main-area .page .ma-valuation-premium-page .ma-comparable-open-item {
    padding: 24px 0 !important;
    border-bottom: 1px solid rgba(90, 255, 220, 0.08) !important;
  }

  .main-area .page .ma-valuation-premium-page .ma-comparable-open-item:last-child {
    border-bottom: 0 !important;
  }

  .main-area .page .ma-valuation-premium-page :is(
    .ma-equity-safe-icon,
    .ma-comparables-header-icon,
    .ma-comparables-empty-icon,
    .ma-equity-safe-stat-glyph
  ) {
    display: none !important;
  }

  /* C.24.22 — Signals inference row: flex layout (grid + hidden icon caused vertical text) */
  .main-area .page .ma-valuation-premium-page .ma-inference-list {
    display: flex !important;
    flex-direction: column !important;
    width: 100% !important;
    min-width: 0 !important;
    overflow: visible !important;
    border: 0 !important;
    border-radius: 0 !important;
    background: transparent !important;
    box-shadow: none !important;
    padding: 8px 0 0 !important;
    gap: 0 !important;
  }

  .main-area .page .ma-valuation-premium-page .ma-inference-item {
    display: flex !important;
    flex-direction: row !important;
    align-items: flex-start !important;
    gap: 14px !important;
    width: 100% !important;
    min-width: 0 !important;
    padding: 20px 0 !important;
    border: 0 !important;
    border-bottom: 1px solid rgba(90, 255, 220, 0.06) !important;
    border-radius: 0 !important;
    background: transparent !important;
    box-shadow: none !important;
    overflow: visible !important;
  }

  .main-area .page .ma-valuation-premium-page .ma-inference-item:last-child {
    border-bottom: 0 !important;
  }

  .main-area .page .ma-valuation-premium-page .ma-inference-icon {
    display: flex !important;
    flex: 0 0 20px !important;
    width: 20px !important;
    min-width: 20px !important;
    height: 20px !important;
    align-items: center !important;
    justify-content: center !important;
    margin-top: 2px !important;
    color: #39e7c2 !important;
    opacity: 0.85 !important;
  }

  .main-area .page .ma-valuation-premium-page .ma-inference-body {
    flex: 1 1 auto !important;
    min-width: 0 !important;
    width: 100% !important;
    max-width: 100% !important;
    overflow: visible !important;
  }

  .main-area .page .ma-valuation-premium-page .ma-inference-body strong,
  .main-area .page .ma-valuation-premium-page .ma-inference-body p {
    display: block !important;
    width: 100% !important;
    max-width: 100% !important;
    min-width: 0 !important;
    overflow: visible !important;
    white-space: normal !important;
    word-break: normal !important;
    overflow-wrap: break-word !important;
    writing-mode: horizontal-tb !important;
  }

  .main-area .page .ma-valuation-premium-page .ma-inference-item,
  .main-area .page .ma-valuation-premium-page .ma-inference-list {
    background: transparent !important;
    border: 0 !important;
    box-shadow: none !important;
    overflow: visible !important;
  }

  /* C.24.24 — Valuation ↔ Intelligence design system sync (runtime authority) */
  .main-area .page .ma-valuation-premium-page {
    --premium-surface: rgba(10, 16, 26, 0.94);
    --premium-line: rgba(148, 163, 184, 0.14);
  }

  .main-area .page .ma-valuation-premium-page :is(
    .ma-intelligence-panel,
    .ma-traceability-panel,
    .ma-comparables-shell,
    .ma-equity-safe-card,
    .ma-premium-deal-card
  ).ma-valuation-surface {
    border: 1px solid rgba(148, 163, 184, 0.07) !important;
    border-radius: 20px !important;
    background: linear-gradient(165deg, rgba(12, 20, 30, 0.72) 0%, rgba(8, 14, 22, 0.52) 100%) !important;
    box-shadow:
      0 24px 56px rgba(0, 0, 0, 0.28),
      inset 0 1px 0 rgba(255, 255, 255, 0.045) !important;
    overflow: visible !important;
  }

  .main-area .page .ma-valuation-premium-page .ma-valuation-status-card.ma-valuation-surface {
    border: 1px solid rgba(45, 212, 191, 0.14) !important;
    border-radius: 22px !important;
    background: linear-gradient(165deg, rgba(12, 22, 32, 0.78) 0%, rgba(8, 14, 22, 0.55) 100%) !important;
    box-shadow:
      0 24px 56px rgba(0, 0, 0, 0.28),
      inset 0 1px 0 rgba(255, 255, 255, 0.045),
      0 0 48px rgba(45, 212, 191, 0.06) !important;
  }

  .main-area .page .ma-valuation-premium-page .button.primary {
    background: linear-gradient(135deg, #2dd4bf, #20c997) !important;
    border-color: transparent !important;
    color: #010306 !important;
    font-weight: 700 !important;
    box-shadow: 0 4px 20px rgba(45, 212, 191, 0.25) !important;
  }

  .main-area .page .ma-valuation-premium-page .button.secondary {
    background: rgba(45, 212, 191, 0.07) !important;
    border-color: rgba(45, 212, 191, 0.2) !important;
    color: #f8fafc !important;
  }

  .main-area .page .ma-valuation-premium-page .button.secondary:hover {
    background: rgba(45, 212, 191, 0.12) !important;
    border-color: rgba(45, 212, 191, 0.3) !important;
  }

  /* C.24.25 — Final luminosity + hero compact + Intelligence parity polish */
  .main-area .page .ma-valuation-premium-page :is(
    .ma-intelligence-panel,
    .ma-traceability-panel,
    .ma-comparables-shell,
    .ma-equity-safe-card,
    .ma-premium-deal-card
  ).ma-valuation-surface {
    background: linear-gradient(168deg, #081616 0%, #071111 54%, #061010 100%) !important;
    border: 1px solid rgba(90, 255, 220, 0.12) !important;
  }

  .main-area .page .ma-valuation-premium-page .ma-valuation-command-bar.ma-valuation-command-strip {
    background: linear-gradient(165deg, #081616 0%, #071111 100%) !important;
    border: 1px solid rgba(90, 255, 220, 0.12) !important;
  }

  .main-area .page .ma-valuation-premium-page .ma-val-ref-scene.ma-valuation-hero {
    min-height: clamp(420px, 36vw, 500px) !important;
    padding-bottom: 16px !important;
  }

  .main-area .page .ma-valuation-premium-page .ma-valuation-status-card.ma-valuation-surface {
    background: linear-gradient(165deg, rgba(14, 26, 28, 0.88) 0%, rgba(8, 16, 18, 0.72) 100%) !important;
    border: 1px solid rgba(90, 255, 220, 0.14) !important;
  }

  /* C.24.26 — Suite polish runtime authority */
  .main-area .page .ma-valuation-premium-page :is(
    .ma-intelligence-panel,
    .ma-traceability-panel,
    .ma-comparables-shell,
    .ma-equity-safe-card,
    .ma-premium-deal-card
  ).ma-valuation-surface {
    background: linear-gradient(168deg, #081616 0%, #071111 52%, #061010 100%) !important;
    border: 1px solid rgba(90, 255, 220, 0.13) !important;
  }

  .main-area .page .ma-valuation-premium-page .ma-valuation-command-bar.ma-valuation-command-strip {
    background: linear-gradient(165deg, #081616 0%, #071111 100%) !important;
    border: 1px solid rgba(90, 255, 220, 0.13) !important;
    border-radius: 20px !important;
  }

  .main-area .page .ma-valuation-premium-page .ma-input-cockpit-shell .ma-input-card {
    border-radius: 0 !important;
    background: transparent !important;
    box-shadow: none !important;
    border: 0 !important;
    border-bottom: 1px solid rgba(90, 255, 220, 0.08) !important;
  }

  .main-area .page .ma-valuation-premium-page .ma-input-cockpit-shell .ma-input-card:last-child {
    border-bottom: 0 !important;
  }

  .main-area .page .ma-valuation-premium-page .ma-val-ref-scene.ma-valuation-hero {
    min-height: clamp(400px, 34vw, 480px) !important;
    padding-bottom: 12px !important;
  }

  /* C.24.27 — Final polish runtime authority */
  .main-area .page .ma-valuation-premium-page .ma-evidence-checklist-table {
    border: 0 !important;
    border-radius: 0 !important;
    background: transparent !important;
    box-shadow: none !important;
  }

  .main-area .page .ma-valuation-premium-page .ma-evidence-checklist-row {
    background: transparent !important;
    border-radius: 0 !important;
    box-shadow: none !important;
  }

  .main-area .page .ma-valuation-premium-page .ma-closing-footer-card {
    background: transparent !important;
    border-radius: 0 !important;
    box-shadow: none !important;
  }

  .main-area .page .ma-valuation-premium-page .ma-input-cockpit-shell .ma-input-card {
    background: transparent !important;
    border-radius: 0 !important;
    box-shadow: none !important;
  }

  .main-area .page .ma-valuation-premium-page .ma-valuation-command-bar.ma-valuation-command-strip {
    background: linear-gradient(165deg, #0a1818 0%, #081616 48%, #071111 100%) !important;
    border: 1px solid rgba(90, 255, 220, 0.12) !important;
  }

  .main-area .page .ma-valuation-premium-page :is(
    .ma-intelligence-panel,
    .ma-traceability-panel,
    .ma-comparables-shell,
    .ma-equity-safe-card,
    .ma-premium-deal-card
  ).ma-valuation-surface {
    background: linear-gradient(168deg, #081616 0%, #071111 50%, #061010 100%) !important;
    border: 1px solid rgba(90, 255, 220, 0.12) !important;
  }

  /* C.24.28 — Premium final runtime sync */
  .main-area .page .ma-valuation-premium-page .ma-val-ref-scene.ma-valuation-hero {
    min-height: clamp(380px, 32vw, 456px) !important;
    padding-bottom: 8px !important;
  }

  .main-area .page .ma-valuation-premium-page .ma-valuation-command-bar.ma-valuation-command-strip {
    background: linear-gradient(165deg, #0b1a1a 0%, #091818 45%, #081616 100%) !important;
    border: 1px solid rgba(90, 255, 220, 0.12) !important;
  }

  .main-area .page .ma-valuation-premium-page .ma-traceability-panel .ma-traceability-score {
    padding: 0 !important;
    border: 0 !important;
    border-radius: 0 !important;
    background: transparent !important;
    box-shadow: none !important;
  }

  .main-area .page .ma-valuation-premium-page :is(
    .ma-intelligence-panel,
    .ma-traceability-panel,
    .ma-comparables-shell,
    .ma-equity-safe-card,
    .ma-premium-deal-card
  ).ma-valuation-surface {
    background: linear-gradient(168deg, #081616 0%, #071111 48%, #061110 100%) !important;
    box-shadow:
      0 22px 50px rgba(0, 0, 0, 0.18),
      inset 0 1px 0 rgba(255, 255, 255, 0.075) !important;
  }

  /* C.24.29 — 85→95% runtime sync */
  .main-area .page .ma-valuation-premium-page .ma-valuation-command-bar.ma-valuation-command-strip {
    background: linear-gradient(165deg, #0c1c1c 0%, #0a1919 42%, #081616 100%) !important;
    border: 1px solid rgba(90, 255, 220, 0.12) !important;
  }

  .main-area .page .ma-valuation-premium-page :is(
    .ma-intelligence-panel,
    .ma-traceability-panel,
    .ma-comparables-shell,
    .ma-equity-safe-card,
    .ma-premium-deal-card
  ).ma-valuation-surface {
    background: linear-gradient(168deg, #081616 0%, #071111 46%, #061110 100%) !important;
    box-shadow:
      0 24px 52px rgba(0, 0, 0, 0.16),
      inset 0 1px 0 rgba(255, 255, 255, 0.08) !important;
  }

  .main-area .page .ma-valuation-premium-page .ma-evidence-checklist-table {
    background: transparent !important;
    border-radius: 0 !important;
    box-shadow: none !important;
  }

  .main-area .page .ma-valuation-premium-page .ma-closing-footer {
    background: linear-gradient(180deg, rgba(10, 22, 22, 0.22) 0%, transparent 72%) !important;
  }

  .main-area .page .ma-valuation-premium-page .ma-closing-footer-card {
    background: transparent !important;
    box-shadow: none !important;
  }

  /* C.24.30 — Upper suite: open shell (no exterior plate; hero owns atmosphere) */
  .main-area .page .ma-valuation-premium-page .ma-valuation-upper-suite {
    border: 0 !important;
    border-radius: 0 !important;
    background: transparent !important;
    background-image: none !important;
    box-shadow: none !important;
    overflow: visible !important;
  }

  .main-area .page .ma-valuation-premium-page .ma-valuation-upper-suite .ma-val-ref-scene.ma-valuation-hero {
    background: transparent !important;
    border: 0 !important;
    box-shadow: none !important;
    min-height: clamp(460px, 42vw, 540px) !important;
  }

  .main-area .page .ma-valuation-premium-page .ma-valuation-upper-suite .ma-valuation-status-card.ma-valuation-surface {
    border: 1px solid rgba(45, 212, 191, 0.14) !important;
    background: linear-gradient(165deg, rgba(12, 22, 32, 0.82) 0%, rgba(8, 14, 22, 0.62) 100%) !important;
  }

  /* C.24.31 — Composition grid: unified width, sidebar/main balance */
  .main-area[data-workspace='ma']:has(.page .ma-valuation-premium-page) {
    --ceos-content-max: 1440px;
    --ceos-content-pad: clamp(24px, 2.5vw, 32px);
  }

  .main-area .page .ma-valuation-premium-page {
    margin-inline: 0 !important;
    padding-inline: 0 !important;
    box-sizing: border-box !important;
  }

  .main-area .page .ma-valuation-premium-page .ma-valuation-upper-suite,
  .main-area .page .ma-valuation-premium-page .ma-valuation-body-grid {
    width: 100% !important;
    max-width: none !important;
    margin-inline: 0 !important;
  }

  .main-area .page .ma-valuation-premium-page .ma-valuation-body-grid,
  .main-area .page .ma-valuation-premium-page.ma-executive-page .ma-valuation-body-grid {
    grid-template-columns: minmax(300px, 340px) minmax(0, 1fr) !important;
    gap: clamp(24px, 2vw, 32px) !important;
  }

  .main-area .page .ma-valuation-premium-page .ma-valuation-main,
  .main-area .page .ma-valuation-premium-page .ma-valuation-main-workspace,
  .main-area .page .ma-valuation-premium-page .ma-valuation-main > * {
    width: 100% !important;
    max-width: none !important;
    min-width: 0 !important;
  }

  /* C.24.32 — Luminosity, strip premium, sidebar legibility, committee width */
  .main-area .page .ma-valuation-premium-page .ma-valuation-body-grid,
  .main-area .page .ma-valuation-premium-page.ma-executive-page .ma-valuation-body-grid {
    gap: 24px !important;
  }

  .main-area .page .ma-valuation-premium-page .ma-valuation-sidebar,
  .main-area .page .ma-valuation-premium-page .ma-valuation-input-cockpit {
    max-width: none !important;
    width: 100% !important;
  }

  /* C.24.33 — Unified surface tokens (runtime authority over flatten rules) */
  .main-area .page .ma-valuation-premium-page {
    --ma-val-page-bg: #020606;
    --ma-val-surface-card: #081616;
    --ma-val-surface-card-end: #071111;
    --ma-val-surface-table: #071313;
    --ma-val-surface-table-end: #091818;
    --ma-val-border-subtle: rgba(90, 255, 220, 0.10);
    --ma-val-border-visible: rgba(90, 255, 220, 0.14);
    --ma-val-divider: rgba(255, 255, 255, 0.055);
    --ma-val-row-hover: rgba(56, 231, 194, 0.045);
    --ma-val-text-primary: #f4f7f6;
    --ma-val-text-secondary: #a7b8b4;
    --ma-val-text-muted: #748783;
    --ma-val-accent: #39e7c2;
    --ma-val-muted: #a7b8b4;
    --ma-val-muted-soft: #748783;
    --ma-val-gold-line: rgba(90, 255, 220, 0.10);
    --ma-val-gold-micro: rgba(56, 231, 194, 0.08);
  }

  .main-area .page .ma-valuation-premium-page :is(
    .ma-bridge-row,
    .ma-evidence-checklist-row,
    .ma-inference-item,
    .ma-comparable-open-item,
    .ma-equity-safe-stat,
    .ma-premium-stat,
    .ma-premium-metric
  ) {
    background: transparent !important;
    background-image: none !important;
    box-shadow: none !important;
    border-color: var(--ma-val-divider) !important;
  }

  .main-area .page .ma-valuation-premium-page .ma-traceability-status-label {
    display: inline-block !important;
    padding: 5px 11px !important;
    border-radius: 4px !important;
    border: 1px solid var(--ma-val-border-subtle) !important;
    background: rgba(8, 18, 20, 0.55) !important;
    color: var(--ma-val-text-secondary) !important;
    font-size: 10px !important;
    font-weight: 800 !important;
    letter-spacing: 0.12em !important;
    text-transform: uppercase !important;
  }

  /* C.24.35 — Body width finale */
  .main-area[data-workspace='ma']:has(.page .ma-valuation-premium-page) {
    --ceos-content-max: 1480px;
  }

  .main-area .page .ma-valuation-premium-page .ma-valuation-body-grid,
  .main-area .page .ma-valuation-premium-page.ma-executive-page .ma-valuation-body-grid {
    grid-template-columns: 350px minmax(0, 1fr) !important;
    gap: 26px !important;
  }

  .main-area .page .ma-valuation-premium-page .ma-valuation-main,
  .main-area .page .ma-valuation-premium-page .ma-valuation-main > * {
    max-width: none !important;
    width: 100% !important;
  }

  /* C.24.36 — Anti-capsule runtime authority (wins over generic M&A flatten + executivePolish) */
  .main-area .page .ma-valuation-premium-page .ma-closing-footer-card {
    background: transparent !important;
    background-image: none !important;
    border: 0 !important;
    border-radius: 0 !important;
    box-shadow: none !important;
    padding: 0 !important;
  }

  .main-area .page .ma-valuation-premium-page .ma-closing-footer-card:first-of-type {
    border-right: 1px solid rgba(255, 255, 255, 0.055) !important;
    padding-right: 28px !important;
  }

  .main-area .page .ma-valuation-premium-page :is(
    .ma-equity-safe-value,
    .ma-equity-safe-primary,
    .ma-equity-safe-hero-band,
    .ma-equity-safe-inner,
    .ma-equity-safe-quality-readout,
    .ma-equity-safe-score-copy,
    .ma-equity-safe-stat,
    .ma-equity-safe-metric,
    .ma-premium-stat,
    .ma-premium-metric,
    .ma-valuation-strip-cell,
    .ma-valuation-command-item,
    .ma-bridge-number,
    .ma-bridge-value,
    .ma-closing-structure-box,
    .kpi-label
  ) {
    background: transparent !important;
    background-image: none !important;
    box-shadow: none !important;
    backdrop-filter: none !important;
    -webkit-backdrop-filter: none !important;
  }

  .main-area .page .ma-valuation-premium-page .ma-equity-safe-value,
  .main-area .page .ma-valuation-premium-page h2.ma-equity-safe-value {
    border: 0 !important;
    border-radius: 0 !important;
    padding: 0 !important;
    text-shadow: 0 0 40px rgba(57, 231, 194, 0.18) !important;
  }

  .main-area .page .ma-valuation-premium-page .ma-equity-safe-quality-readout {
    border: 0 !important;
    border-left: 1px solid rgba(255, 255, 255, 0.055) !important;
    padding-left: 28px !important;
  }

  .main-area .page .ma-valuation-premium-page .ma-equity-safe-quality-readout .ma-equity-safe-ring,
  .main-area .page .ma-valuation-premium-page .ma-equity-safe-ring-core {
    display: none !important;
  }

  .main-area .page .ma-valuation-premium-page .ma-equity-safe-badges .badge {
    background: rgba(8, 18, 20, 0.42) !important;
    border: 1px solid rgba(90, 255, 220, 0.12) !important;
    border-radius: 4px !important;
    padding: 4px 10px !important;
    box-shadow: none !important;
  }

  .main-area .page .ma-valuation-premium-page .kpi-label {
    border: 0 !important;
    border-radius: 0 !important;
    padding: 0 !important;
  }

  .main-area .page .ma-valuation-premium-page .ma-equity-safe-card :is(
    .ma-equity-safe-stat,
    .ma-equity-safe-metric,
    .ma-premium-stat,
    .ma-premium-metric
  ) {
    border-radius: 0 !important;
    border-top: 0 !important;
    border-bottom: 0 !important;
    border-left: 0 !important;
    border-right: 1px solid rgba(255, 255, 255, 0.055) !important;
  }

  .main-area .page .ma-valuation-premium-page .ma-equity-safe-card .ma-equity-safe-stat:nth-child(4n),
  .main-area .page .ma-valuation-premium-page .ma-equity-safe-card .ma-equity-safe-metric:nth-child(4n) {
    border-right: 0 !important;
  }

  /* C.24.37 — Sidebar breath + grid alignment runtime */
  .main-area[data-workspace='ma']:has(.page .ma-valuation-premium-page) {
    --ceos-content-max: 1480px;
    --ceos-content-pad: clamp(24px, 2.5vw, 32px);
  }

  .main-area .page .ma-valuation-premium-page .ma-valuation-body-grid,
  .main-area .page .ma-valuation-premium-page.ma-executive-page .ma-valuation-body-grid {
    grid-template-columns: minmax(320px, 350px) minmax(0, 1fr) !important;
    gap: 26px !important;
  }

  .main-area .page .ma-valuation-premium-page .ma-valuation-sidebar,
  .main-area .page .ma-valuation-premium-page .ma-valuation-input-cockpit,
  .main-area .page .ma-valuation-premium-page .ma-input-cockpit-shell {
    overflow: visible !important;
    max-width: none !important;
    width: 100% !important;
  }

  .main-area .page .ma-valuation-premium-page .ma-valuation-input-cockpit-band-title {
    white-space: normal !important;
    overflow: visible !important;
    text-overflow: clip !important;
  }

  .main-area[data-workspace='ma'] .page .ma-valuation-premium-page .ma-premium-deal-card.ma-valuation-value-ledger .ma-bridge-list-premium,
  .main-area .page .ma-valuation-premium-page .ma-bridge-list.ma-bridge-list-premium {
    background: transparent !important;
    box-shadow: none !important;
    border: 0 !important;
    padding: 0 !important;
  }

  .main-area .page .ma-valuation-premium-page .ma-valuation-main,
  .main-area .page .ma-valuation-premium-page .ma-valuation-main > *,
  .main-area .page .ma-valuation-premium-page .ma-valuation-upper-suite {
    max-width: none !important;
    width: 100% !important;
  }

  /* C.24.38 — Teal/charcoal palette lock (fix blue slate regression) */
  .main-area[data-workspace='ma']:has(.page .ma-valuation-premium-page) {
    background-color: #020606 !important;
    background-image: none !important;
  }

  .main-area .page .ma-valuation-premium-page {
    --premium-surface-soft: rgba(8, 22, 22, 0.42);
    --premium-line: rgba(90, 255, 220, 0.12);
    background-color: #020606 !important;
  }

  .main-area .page .ma-valuation-premium-page .ma-valuation-upper-suite {
    background: transparent !important;
    background-image: none !important;
    border: 0 !important;
    box-shadow: none !important;
  }

  .main-area .page .ma-valuation-premium-page .ma-valuation-upper-suite .ma-valuation-status-card.ma-valuation-surface {
    background: linear-gradient(165deg, #0c1a1a 0%, #0a1717 48%, #081616 100%) !important;
    border: 1px solid rgba(90, 255, 220, 0.14) !important;
  }

  .main-area .page .ma-valuation-premium-page :is(
    .ma-intelligence-panel,
    .ma-traceability-panel,
    .ma-comparables-shell,
    .ma-equity-safe-card,
    .ma-premium-deal-card,
    .ma-input-cockpit-shell.ma-valuation-sidebar-premium
  ).ma-valuation-surface {
    background: linear-gradient(168deg, #081616 0%, #071111 54%, #061010 100%) !important;
    border: 1px solid rgba(90, 255, 220, 0.12) !important;
    box-shadow:
      0 20px 48px rgba(0, 0, 0, 0.18),
      inset 0 1px 0 rgba(255, 255, 255, 0.055) !important;
  }

  .main-area .page .ma-valuation-premium-page .ma-input-cockpit-shell :is(input, select, textarea) {
    background: rgba(6, 16, 16, 0.88) !important;
    background-image: none !important;
    border-color: rgba(90, 255, 220, 0.12) !important;
    color: #f4f7f6 !important;
  }

  .main-area .page .ma-valuation-premium-page .ma-slider-field {
    background: transparent !important;
    border-color: transparent !important;
  }

  .main-area[data-workspace='ma'] .page .ma-valuation-premium-page :is(
    .ma-valuation-hero,
    .ma-val-ref-scene
  ) {
    background: transparent !important;
    border-color: transparent !important;
  }

  /* C.24.39 — Sidebar premium unification runtime (anti-sticker) */
  .main-area[data-workspace='ma'] .page .ma-valuation-premium-page .ma-valuation-input-cockpit .card,
  .main-area[data-workspace='ma'] .page .ma-valuation-premium-page .ma-valuation-input-cockpit .ma-input-card,
  .main-area[data-workspace='ma'] .page .ma-valuation-premium-page .ma-valuation-input-cockpit .card.ma-valuation-input-section {
    background: transparent !important;
    background-image: none !important;
    border: 0 !important;
    border-top: 1px solid rgba(90, 255, 220, 0.1) !important;
    border-radius: 0 !important;
    box-shadow: none !important;
    backdrop-filter: none !important;
  }

  .main-area[data-workspace='ma'] .page .ma-valuation-premium-page .ma-valuation-input-cockpit .ma-input-card:first-child,
  .main-area[data-workspace='ma'] .page .ma-valuation-premium-page .ma-valuation-input-cockpit .card.ma-valuation-input-section:first-child {
    border-top: 0 !important;
  }

  .main-area[data-workspace='ma'] .page .ma-valuation-premium-page .ma-valuation-input-cockpit .ma-slider-list {
    border: 0 !important;
    border-radius: 0 !important;
    background: transparent !important;
    box-shadow: none !important;
  }

  .main-area[data-workspace='ma'] .page .ma-valuation-premium-page .ma-valuation-input-cockpit .ma-slider-field {
    background: transparent !important;
    border-color: transparent !important;
    box-shadow: none !important;
  }

  .main-area[data-workspace='ma'] .page .ma-valuation-premium-page .ma-valuation-input-cockpit .ma-config-note {
    border: 0 !important;
    border-top: 1px solid rgba(90, 255, 220, 0.1) !important;
    border-radius: 0 !important;
    background: transparent !important;
    background-image: none !important;
    box-shadow: none !important;
  }

  .main-area[data-workspace='ma'] .page .ma-valuation-premium-page .ma-valuation-input-cockpit .ma-valuation-input-cockpit-band {
    background: transparent !important;
    background-image: none !important;
    box-shadow: none !important;
  }

  .main-area[data-workspace='ma'] .page .ma-valuation-premium-page .ma-valuation-input-cockpit .ma-valuation-input-cockpit-band-icon,
  .main-area[data-workspace='ma'] .page .ma-valuation-premium-page .ma-valuation-input-cockpit .ma-input-icon,
  .main-area[data-workspace='ma'] .page .ma-valuation-premium-page .ma-valuation-input-cockpit .ma-slider-dot {
    border: 0 !important;
    border-radius: 0 !important;
    background: transparent !important;
    box-shadow: none !important;
  }

  .main-area[data-workspace='ma'] .page .ma-valuation-premium-page .ma-valuation-input-cockpit .ma-input-icon {
    display: none !important;
  }

  .main-area[data-workspace='ma'] .page .ma-valuation-premium-page .ma-valuation-input-cockpit .field .input,
  .main-area[data-workspace='ma'] .page .ma-valuation-premium-page .ma-valuation-input-cockpit .field .select,
  .main-area[data-workspace='ma'] .page .ma-valuation-premium-page .ma-valuation-input-cockpit .ma-input-cockpit-shell :is(input, select, textarea) {
    background: rgba(6, 16, 16, 0.92) !important;
    background-image: none !important;
    border-color: rgba(90, 255, 220, 0.12) !important;
    box-shadow: none !important;
  }

  /* C.24.40 — Sidebar final anti-sticker runtime */
  .main-area[data-workspace='ma'] .page .ma-valuation-premium-page .ma-valuation-input-cockpit .ma-input-cockpit-shell.ma-valuation-sidebar-premium.ma-valuation-surface {
    background: #081616 !important;
    background-image: none !important;
    border-color: rgba(90, 255, 220, 0.09) !important;
    box-shadow:
      0 10px 28px rgba(0, 0, 0, 0.14),
      inset 0 1px 0 rgba(255, 255, 255, 0.03) !important;
  }

  .main-area[data-workspace='ma'] .page .ma-valuation-premium-page .ma-valuation-input-cockpit [class*='card'],
  .main-area[data-workspace='ma'] .page .ma-valuation-premium-page .ma-valuation-input-cockpit .ma-input-card-inner {
    background: transparent !important;
    border: 0 !important;
    box-shadow: none !important;
    border-radius: 0 !important;
  }

  .main-area[data-workspace='ma'] .page .ma-valuation-premium-page .ma-input-cockpit-shell .ma-input-card,
  .main-area[data-workspace='ma'] .page .ma-valuation-premium-page .ma-valuation-input-cockpit .ma-input-card,
  .main-area[data-workspace='ma'] .page .ma-valuation-premium-page .ma-valuation-input-cockpit .card.ma-valuation-input-section {
    border: 0 !important;
    border-top: 0 !important;
    border-bottom: 0 !important;
    background: transparent !important;
    box-shadow: none !important;
  }

  .main-area[data-workspace='ma'] .page .ma-valuation-premium-page .ma-valuation-input-cockpit .ma-input-card + .ma-input-card {
    box-shadow: inset 0 1px 0 rgba(90, 255, 220, 0.055) !important;
  }

  .main-area[data-workspace='ma'] .page .ma-valuation-premium-page .ma-valuation-input-cockpit .ma-valuation-input-cockpit-band-icon {
    display: none !important;
  }

  .main-area[data-workspace='ma'] .page .ma-valuation-premium-page .ma-valuation-input-cockpit .ma-slider-field {
    background: transparent !important;
    border: 0 !important;
    box-shadow: none !important;
  }

  .main-area[data-workspace='ma'] .page .ma-valuation-premium-page .ma-valuation-input-cockpit .ma-slider-list {
    border: 0 !important;
    background: transparent !important;
    box-shadow: none !important;
  }

  .main-area[data-workspace='ma'] .page .ma-valuation-premium-page .ma-valuation-input-cockpit .ma-config-note {
    margin-top: 18px !important;
    padding: 0 !important;
    border: 0 !important;
    background: transparent !important;
    box-shadow: none !important;
  }

  .main-area[data-workspace='ma'] .page .ma-valuation-premium-page .ma-valuation-input-cockpit .field .input,
  .main-area[data-workspace='ma'] .page .ma-valuation-premium-page .ma-valuation-input-cockpit .field .select,
  .main-area[data-workspace='ma'] .page .ma-valuation-premium-page .ma-valuation-input-cockpit .ma-input-cockpit-shell :is(input, select, textarea) {
    background: rgba(8, 20, 20, 0.55) !important;
    border-color: rgba(90, 255, 220, 0.09) !important;
    box-shadow: none !important;
  }

  /* C.24.41 — Sidebar width, anti-clip, premium sliders runtime */
  .main-area[data-workspace='ma'] .page .ma-valuation-premium-page .ma-valuation-body-grid,
  .main-area[data-workspace='ma'] .page .ma-valuation-premium-page.ma-executive-page .ma-valuation-body-grid,
  .main-area .page .ma-valuation-premium-page .ma-valuation-body-grid,
  .main-area .page .ma-valuation-premium-page.ma-executive-page .ma-valuation-body-grid {
    grid-template-columns: minmax(320px, 350px) minmax(0, 1fr) !important;
    gap: 26px !important;
  }

  @media (min-width: 1181px) {
    .main-area[data-workspace='ma'] .page .ma-valuation-premium-page .ma-valuation-body-grid,
    .main-area[data-workspace='ma'] .page .ma-valuation-premium-page.ma-executive-page .ma-valuation-body-grid,
    .main-area .page .ma-valuation-premium-page .ma-valuation-body-grid,
    .main-area .page .ma-valuation-premium-page.ma-executive-page .ma-valuation-body-grid {
      grid-template-columns: 350px minmax(0, 1fr) !important;
    }
  }

  .main-area[data-workspace='ma'] .page .ma-valuation-premium-page .ma-valuation-sidebar,
  .main-area[data-workspace='ma'] .page .ma-valuation-premium-page .ma-valuation-input-cockpit,
  .main-area .page .ma-valuation-premium-page .ma-valuation-input-cockpit .ma-input-cockpit-shell {
    overflow: visible !important;
    width: 100% !important;
    max-width: none !important;
  }

  .main-area[data-workspace='ma'] .page .ma-valuation-premium-page .ma-valuation-input-cockpit .ma-valuation-input-cockpit-band-title,
  .main-area[data-workspace='ma'] .page .ma-valuation-premium-page .ma-valuation-input-cockpit .ma-valuation-input-cockpit-band-lead,
  .main-area[data-workspace='ma'] .page .ma-valuation-premium-page .ma-valuation-input-cockpit .ma-input-header h3,
  .main-area[data-workspace='ma'] .page .ma-valuation-premium-page .ma-valuation-input-cockpit .field label {
    white-space: normal !important;
    overflow: visible !important;
    text-overflow: clip !important;
    max-width: none !important;
  }

  .main-area[data-workspace='ma'] .page .ma-valuation-premium-page .ma-valuation-input-cockpit .ma-valuation-input-cockpit-band-icon {
    display: grid !important;
    border: 0 !important;
    background: transparent !important;
    box-shadow: none !important;
  }

  .main-area[data-workspace='ma'] .page .ma-valuation-premium-page .ma-valuation-input-cockpit .ma-input-panel {
    padding: 0 !important;
    overflow: visible !important;
  }

  .main-area[data-workspace='ma'] .page .ma-valuation-premium-page .ma-valuation-input-cockpit .ma-slider-list {
    border: 0 !important;
    border-radius: 0 !important;
    background: transparent !important;
    background-image: none !important;
    box-shadow: none !important;
    overflow: visible !important;
  }

  .main-area[data-workspace='ma'] .page .ma-valuation-premium-page .ma-valuation-input-cockpit .ma-slider-field {
    padding: 22px 0 !important;
    background: transparent !important;
    border: 0 !important;
    box-shadow: none !important;
  }

  .main-area[data-workspace='ma'] .page .ma-valuation-premium-page .ma-valuation-input-cockpit .ma-slider-track-row {
    padding: 0 !important;
    border: 0 !important;
    background: transparent !important;
    box-shadow: none !important;
  }

  .main-area[data-workspace='ma'] .page .ma-valuation-premium-page .ma-valuation-input-cockpit .ma-input-cockpit-shell.ma-valuation-sidebar-premium.ma-valuation-surface {
    padding: 30px 26px 34px !important;
    overflow: visible !important;
  }

  .main-area[data-workspace='ma'] .page .ma-valuation-premium-page .ma-valuation-input-cockpit .field .input,
  .main-area[data-workspace='ma'] .page .ma-valuation-premium-page .ma-valuation-input-cockpit .field .select,
  .main-area[data-workspace='ma'] .page .ma-valuation-premium-page .ma-valuation-input-cockpit .ma-input-cockpit-shell :is(input, select, textarea) {
    min-height: 40px !important;
    padding: 10px 14px !important;
    background: #091818 !important;
    border-color: rgba(90, 255, 220, 0.1) !important;
    box-shadow: none !important;
  }

  .main-area[data-workspace='ma'] .page .ma-valuation-premium-page .ma-valuation-input-cockpit .ma-config-note {
    margin-top: 22px !important;
    padding: 16px 0 0 !important;
    border: 0 !important;
    border-top: 1px solid rgba(90, 255, 220, 0.06) !important;
    border-radius: 0 !important;
    background: transparent !important;
    box-shadow: none !important;
  }

  /* C.24.42 — Sidebar 360px + decapsulate range sliders runtime */
  .main-area[data-workspace='ma'] .page .ma-valuation-premium-page .ma-valuation-body-grid,
  .main-area[data-workspace='ma'] .page .ma-valuation-premium-page.ma-executive-page .ma-valuation-body-grid,
  .main-area .page .ma-valuation-premium-page .ma-valuation-body-grid,
  .main-area .page .ma-valuation-premium-page.ma-executive-page .ma-valuation-body-grid {
    grid-template-columns: minmax(330px, 360px) minmax(0, 1fr) !important;
    gap: 26px !important;
  }

  @media (min-width: 1181px) {
    .main-area[data-workspace='ma'] .page .ma-valuation-premium-page .ma-valuation-body-grid,
    .main-area[data-workspace='ma'] .page .ma-valuation-premium-page.ma-executive-page .ma-valuation-body-grid,
    .main-area .page .ma-valuation-premium-page .ma-valuation-body-grid,
    .main-area .page .ma-valuation-premium-page.ma-executive-page .ma-valuation-body-grid {
      grid-template-columns: 360px minmax(0, 1fr) !important;
    }
  }

  .main-area[data-workspace='ma'] .page .ma-valuation-premium-page .ma-valuation-sidebar,
  .main-area[data-workspace='ma'] .page .ma-valuation-premium-page .ma-valuation-input-cockpit {
    min-width: 330px !important;
    overflow: visible !important;
  }

  .main-area[data-workspace='ma'] .page .ma-valuation-premium-page .ma-valuation-input-cockpit .ma-input-cockpit-shell.ma-valuation-sidebar-premium.ma-valuation-surface {
    padding: 28px 20px 38px !important;
    overflow: visible !important;
  }

  .main-area[data-workspace='ma'] .page .ma-valuation-premium-page .ma-valuation-input-cockpit .ma-slider-list,
  .main-area[data-workspace='ma'] .page .ma-valuation-premium-page .ma-valuation-input-cockpit .ma-slider-field,
  .main-area[data-workspace='ma'] .page .ma-valuation-premium-page .ma-valuation-input-cockpit .ma-slider-track-row {
    border: 0 !important;
    border-radius: 0 !important;
    background: transparent !important;
    background-image: none !important;
    box-shadow: none !important;
    overflow: visible !important;
  }

  .main-area[data-workspace='ma'] .page .ma-valuation-premium-page .ma-valuation-input-cockpit .field .input,
  .main-area[data-workspace='ma'] .page .ma-valuation-premium-page .ma-valuation-input-cockpit .field .select,
  .main-area[data-workspace='ma'] .page .ma-valuation-premium-page .ma-valuation-input-cockpit .ma-input-cockpit-shell :is(
    input:not([type='range']),
    select,
    textarea
  ) {
    min-height: 42px !important;
    padding: 11px 14px !important;
    background: #0b1c1c !important;
    border-color: rgba(90, 255, 220, 0.1) !important;
    box-shadow: none !important;
  }

  .main-area[data-workspace='ma'] .page .ma-valuation-premium-page .ma-valuation-input-cockpit input[type='range'],
  .main-area[data-workspace='ma'] .page .ma-valuation-premium-page .ma-valuation-input-cockpit .ma-slider-track-row input[type='range'] {
    -webkit-appearance: none !important;
    appearance: none !important;
    height: 4px !important;
    min-height: 4px !important;
    max-height: 4px !important;
    margin: 12px 0 10px !important;
    padding: 0 !important;
    border: 0 !important;
    border-radius: 999px !important;
    background: rgba(255, 255, 255, 0.09) !important;
    background-image: none !important;
    box-shadow: none !important;
    outline: none !important;
    accent-color: #39e7c2 !important;
  }

  .main-area[data-workspace='ma'] .page .ma-valuation-premium-page .ma-valuation-input-cockpit .ma-input-card:last-child,
  .main-area[data-workspace='ma'] .page .ma-valuation-premium-page .ma-valuation-input-cockpit .card.ma-valuation-input-section:last-child {
    padding-top: 42px !important;
  }

  .main-area[data-workspace='ma'] .page .ma-valuation-premium-page .ma-valuation-input-cockpit .ma-config-note {
    margin-top: 24px !important;
    padding-top: 18px !important;
  }

  /* C.24.43 — Premium finish runtime (soft lines, integrated upper suite) */
  .main-area[data-workspace='ma'] .page .ma-valuation-premium-page,
  .main-area .page .ma-valuation-premium-page {
    --ma-val-divider: rgba(255, 255, 255, 0.045);
    --ma-val-divider-neutral: rgba(255, 255, 255, 0.05);
    --ma-val-border-subtle: rgba(90, 255, 220, 0.09);
  }

  .main-area[data-workspace='ma'] .page .ma-valuation-premium-page .ma-valuation-upper-suite,
  .main-area .page .ma-valuation-premium-page .ma-valuation-upper-suite {
    border: 0 !important;
    background: transparent !important;
    background-image: none !important;
    box-shadow: none !important;
  }

  .main-area[data-workspace='ma'] .page .ma-valuation-premium-page .ma-valuation-upper-suite .ma-valuation-command-bar.ma-valuation-command-strip,
  .main-area .page .ma-valuation-premium-page .ma-valuation-upper-suite .ma-valuation-command-bar.ma-valuation-command-strip {
    border: 1px solid rgba(148, 163, 184, 0.07) !important;
    border-radius: 20px !important;
    background: rgba(10, 16, 26, 0.72) !important;
    box-shadow: 0 8px 28px rgba(0, 0, 0, 0.2) !important;
  }

  .main-area[data-workspace='ma'] .page .ma-valuation-premium-page .ma-valuation-upper-suite .ma-valuation-status-card.ma-valuation-surface {
    border-color: rgba(90, 255, 220, 0.1) !important;
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.04),
      0 16px 40px rgba(0, 0, 0, 0.12) !important;
  }

  .main-area[data-workspace='ma'] .page .ma-valuation-premium-page .ma-valuation-surface:not(.ma-evidence-ledger-row):not(.ma-comparable-card-horizontal):not(.ma-valuation-upper-suite):not(.ma-valuation-status-card),
  .main-area .page .ma-valuation-premium-page .ma-valuation-surface:not(.ma-evidence-ledger-row):not(.ma-comparable-card-horizontal):not(.ma-valuation-upper-suite):not(.ma-valuation-status-card) {
    border-color: rgba(90, 255, 220, 0.09) !important;
    box-shadow:
      0 18px 44px rgba(0, 0, 0, 0.13),
      inset 0 1px 0 rgba(255, 255, 255, 0.038) !important;
  }

  .main-area[data-workspace='ma'] .page .ma-valuation-premium-page .ma-evidence-checklist-table,
  .main-area .page .ma-valuation-premium-page .ma-evidence-checklist-table {
    border: 0 !important;
    background: transparent !important;
    box-shadow: none !important;
  }

  .main-area[data-workspace='ma'] .page .ma-valuation-premium-page .ma-evidence-checklist-row,
  .main-area[data-workspace='ma'] .page .ma-valuation-premium-page .ma-bridge-row.ma-valuation-ledger,
  .main-area[data-workspace='ma'] .page .ma-valuation-premium-page .ma-comparable-open-item {
    border-bottom-color: rgba(255, 255, 255, 0.045) !important;
  }

  .main-area[data-workspace='ma'] .page .ma-valuation-premium-page .ma-valuation-input-cockpit .ma-input-cockpit-shell.ma-valuation-sidebar-premium.ma-valuation-surface {
    border-color: rgba(90, 255, 220, 0.08) !important;
  }

  .main-area[data-workspace='ma'] .page .ma-valuation-premium-page .button.secondary {
    border-color: rgba(90, 255, 220, 0.1) !important;
    box-shadow: none !important;
  }

  /* C.24.44 — Committee readiness outer shell: borderless integrated (runtime authority) */
  .main-area[data-workspace='ma'] .page .ma-valuation-premium-page .ma-traceability-panel.ma-valuation-evidence-ledger.ma-valuation-executive-ledger.ma-valuation-surface,
  .main-area .page .ma-valuation-premium-page .ma-traceability-panel.ma-valuation-evidence-ledger.ma-valuation-executive-ledger.ma-valuation-surface {
    border: 0 !important;
    border-color: transparent !important;
    outline: none !important;
    box-shadow: 0 18px 44px rgba(0, 0, 0, 0.11) !important;
  }

  /* C.24.45 — Page-wide premium integration (runtime authority) */
  .main-area[data-workspace='ma'] .page .ma-valuation-premium-page,
  .main-area .page .ma-valuation-premium-page {
    --ma-val-divider: rgba(255, 255, 255, 0.04);
    --ma-val-divider-neutral: rgba(255, 255, 255, 0.045);
  }

  .main-area[data-workspace='ma'] .page .ma-valuation-premium-page :is(
    .ma-equity-safe-card,
    .ma-premium-deal-card,
    .ma-intelligence-panel,
    .ma-comparables-shell
  ).ma-valuation-surface,
  .main-area .page .ma-valuation-premium-page :is(
    .ma-equity-safe-card,
    .ma-premium-deal-card,
    .ma-intelligence-panel,
    .ma-comparables-shell
  ).ma-valuation-surface {
    border: 0 !important;
    box-shadow: 0 18px 44px rgba(0, 0, 0, 0.1) !important;
  }

  .main-area[data-workspace='ma'] .page .ma-valuation-premium-page .ma-valuation-input-cockpit .ma-input-cockpit-shell.ma-valuation-sidebar-premium.ma-valuation-surface,
  .main-area .page .ma-valuation-premium-page .ma-valuation-input-cockpit .ma-input-cockpit-shell.ma-valuation-sidebar-premium.ma-valuation-surface {
    border: 0 !important;
    box-shadow: 0 18px 44px rgba(0, 0, 0, 0.1) !important;
  }

  .main-area[data-workspace='ma'] .page .ma-valuation-premium-page .ma-valuation-input-cockpit .ma-slider-list,
  .main-area[data-workspace='ma'] .page .ma-valuation-premium-page .ma-valuation-input-cockpit .ma-slider-field,
  .main-area[data-workspace='ma'] .page .ma-valuation-premium-page .ma-valuation-input-cockpit .ma-slider-track-row,
  .main-area .page .ma-valuation-premium-page .ma-valuation-input-cockpit .ma-slider-field {
    border: 0 !important;
    border-color: transparent !important;
    background: transparent !important;
    background-image: none !important;
    box-shadow: none !important;
  }

  .main-area[data-workspace='ma'] .page .ma-valuation-premium-page .ma-valuation-input-cockpit .ma-input-cockpit-shell :is(
    input:not([type='range']),
    select,
    textarea
  ) {
    border-color: rgba(90, 255, 220, 0.07) !important;
  }

  .main-area[data-workspace='ma'] .page .ma-valuation-premium-page .ma-premium-deal-card.ma-valuation-value-ledger .ma-bridge-list-premium,
  .main-area[data-workspace='ma'] .page .ma-valuation-premium-page .ma-bridge-list.ma-bridge-list-premium,
  .main-area .page .ma-valuation-premium-page .ma-bridge-list.ma-bridge-list-premium {
    border: 0 !important;
    background: transparent !important;
    box-shadow: none !important;
    padding: 0 !important;
  }

  .main-area[data-workspace='ma'] .page .ma-valuation-premium-page .ma-bridge-row.ma-valuation-ledger,
  .main-area .page .ma-valuation-premium-page .ma-bridge-row.ma-valuation-ledger {
    border: 0 !important;
    border-radius: 0 !important;
    background: transparent !important;
    box-shadow: none !important;
    border-bottom: 1px solid rgba(255, 255, 255, 0.04) !important;
  }

  .main-area[data-workspace='ma'] .page .ma-valuation-premium-page .ma-closing-footer-card,
  .main-area .page .ma-valuation-premium-page .ma-closing-footer-card {
    border: 0 !important;
    background: transparent !important;
    box-shadow: none !important;
  }

  .main-area[data-workspace='ma'] .page .ma-valuation-premium-page .ma-closing-footer-card:first-of-type,
  .main-area .page .ma-valuation-premium-page .ma-closing-footer-card:first-of-type {
    border-right: 1px solid rgba(255, 255, 255, 0.04) !important;
  }

  .main-area[data-workspace='ma'] .page .ma-valuation-premium-page .ma-evidence-checklist-row,
  .main-area .page .ma-valuation-premium-page .ma-evidence-checklist-row {
    padding: 48px 2px !important;
    border-bottom-color: rgba(255, 255, 255, 0.04) !important;
  }

  .main-area[data-workspace='ma'] .page .ma-valuation-premium-page .ma-traceability-status-label,
  .main-area .page .ma-valuation-premium-page .ma-traceability-status-label {
    font-size: 10px !important;
    font-weight: 650 !important;
    color: rgba(143, 163, 159, 0.78) !important;
    background: transparent !important;
    border: 0 !important;
  }

  .main-area[data-workspace='ma'] .page .ma-valuation-premium-page .ma-inference-item,
  .main-area .page .ma-valuation-premium-page .ma-inference-item {
    background: transparent !important;
    border-bottom-color: rgba(255, 255, 255, 0.04) !important;
  }

  .main-area[data-workspace='ma'] .page .ma-valuation-premium-page .ma-comparable-open-item,
  .main-area .page .ma-valuation-premium-page .ma-comparable-open-item {
    padding: 32px 0 !important;
    border-bottom-color: rgba(255, 255, 255, 0.04) !important;
  }

  /* C.24.47 — Sidebar only (revert C.24.46 runtime overrides) */
  .main-area[data-workspace='ma'] .page .ma-valuation-premium-page .ma-valuation-body-grid,
  .main-area .page .ma-valuation-premium-page .ma-valuation-body-grid {
    grid-template-columns: minmax(330px, 360px) minmax(0, 1fr) !important;
    gap: 28px !important;
  }

  @media (min-width: 1181px) {
    .main-area[data-workspace='ma'] .page .ma-valuation-premium-page .ma-valuation-body-grid,
    .main-area .page .ma-valuation-premium-page .ma-valuation-body-grid {
      grid-template-columns: 360px minmax(0, 1fr) !important;
    }
  }

  .main-area[data-workspace='ma'] .page .ma-valuation-premium-page .ma-valuation-input-cockpit .ma-slider-list,
  .main-area[data-workspace='ma'] .page .ma-valuation-premium-page .ma-valuation-input-cockpit .ma-slider-field,
  .main-area[data-workspace='ma'] .page .ma-valuation-premium-page .ma-valuation-input-cockpit .ma-slider-track-row,
  .main-area .page .ma-valuation-premium-page .ma-valuation-input-cockpit .ma-slider-field {
    border: 0 !important;
    background: transparent !important;
    background-image: none !important;
    box-shadow: none !important;
  }

  .main-area[data-workspace='ma'] .page .ma-valuation-premium-page .ma-valuation-input-cockpit .ma-input-cockpit-shell :is(
    input:not([type='range']),
    select,
    textarea
  ) {
    min-height: 42px !important;
    border-color: rgba(90, 255, 220, 0.07) !important;
  }

  .main-area[data-workspace='ma'] .page .ma-valuation-premium-page .ma-valuation-input-cockpit .ma-config-note {
    border: 0 !important;
    background: transparent !important;
    box-shadow: none !important;
  }

  /* C.24.48 — Sidebar premium panel (final runtime authority, cockpit ONLY) */
  .main-area[data-workspace='ma'] .page .ma-valuation-premium-page .ma-valuation-body-grid,
  .main-area .page .ma-valuation-premium-page .ma-valuation-body-grid {
    grid-template-columns: minmax(330px, 360px) minmax(0, 1fr) !important;
    gap: 28px !important;
  }

  @media (min-width: 1181px) {
    .main-area[data-workspace='ma'] .page .ma-valuation-premium-page .ma-valuation-body-grid,
    .main-area .page .ma-valuation-premium-page .ma-valuation-body-grid {
      grid-template-columns: 360px minmax(0, 1fr) !important;
    }
  }

  .main-area[data-workspace='ma'] .page .ma-valuation-premium-page .ma-valuation-input-cockpit .ma-input-cockpit-shell.ma-valuation-sidebar-premium.ma-valuation-surface,
  .main-area .page .ma-valuation-premium-page .ma-valuation-input-cockpit .ma-input-cockpit-shell.ma-valuation-sidebar-premium.ma-valuation-surface {
    border: 0 !important;
    box-shadow: 0 16px 40px rgba(0, 0, 0, 0.11) !important;
  }

  .main-area[data-workspace='ma'] .page .ma-valuation-premium-page .ma-valuation-input-cockpit .ma-valuation-input-cockpit-band-icon {
    display: flex !important;
    background: transparent !important;
    border: 0 !important;
    box-shadow: none !important;
  }

  .main-area[data-workspace='ma'] .page .ma-valuation-premium-page .ma-valuation-input-cockpit .ma-slider-list,
  .main-area[data-workspace='ma'] .page .ma-valuation-premium-page .ma-valuation-input-cockpit .ma-slider-field,
  .main-area[data-workspace='ma'] .page .ma-valuation-premium-page .ma-valuation-input-cockpit .ma-slider-track-row,
  .main-area .page .ma-valuation-premium-page .ma-valuation-input-cockpit .ma-slider-field {
    background: transparent !important;
    background-image: none !important;
    border: 0 !important;
    border-color: transparent !important;
    box-shadow: none !important;
    min-height: 0 !important;
  }

  .main-area[data-workspace='ma'] .page .ma-valuation-premium-page .ma-valuation-input-cockpit .ma-input-cockpit-shell :is(
    input:not([type='range']),
    select,
    textarea
  ) {
    min-height: 42px !important;
    border-color: rgba(90, 255, 220, 0.07) !important;
    box-shadow: none !important;
  }

  .main-area[data-workspace='ma'] .page .ma-valuation-premium-page .ma-valuation-input-cockpit input[type='range'],
  .main-area[data-workspace='ma'] .page .ma-valuation-premium-page .ma-valuation-input-cockpit .ma-slider-field input[type='range'] {
    -webkit-appearance: none !important;
    appearance: none !important;
    height: 4px !important;
    min-height: 4px !important;
    max-height: 4px !important;
    padding: 0 !important;
    border: 0 !important;
    background: rgba(255, 255, 255, 0.09) !important;
    box-shadow: none !important;
  }

  .main-area[data-workspace='ma'] .page .ma-valuation-premium-page .ma-valuation-input-cockpit .ma-input-card,
  .main-area[data-workspace='ma'] .page .ma-valuation-premium-page .ma-valuation-input-cockpit .card.ma-valuation-input-section,
  .main-area[data-workspace='ma'] .page .ma-valuation-premium-page .ma-valuation-input-cockpit .ma-input-card-inner {
    background: transparent !important;
    border: 0 !important;
    box-shadow: none !important;
  }

  /* C.24.49 — Sidebar width + legibility (runtime authority) */
  .main-area[data-workspace='ma'] .page .ma-valuation-premium-page .ma-valuation-body-grid,
  .main-area .page .ma-valuation-premium-page .ma-valuation-body-grid {
    grid-template-columns: minmax(330px, 340px) minmax(0, 1fr) !important;
    gap: 24px !important;
  }

  @media (min-width: 1181px) {
    .main-area[data-workspace='ma'] .page .ma-valuation-premium-page .ma-valuation-body-grid,
    .main-area .page .ma-valuation-premium-page .ma-valuation-body-grid {
      grid-template-columns: 340px minmax(0, 1fr) !important;
    }

    .main-area[data-workspace='ma'] .page .ma-valuation-premium-page .ma-valuation-body-grid > .ma-valuation-input-cockpit,
    .main-area .page .ma-valuation-premium-page .ma-valuation-body-grid > .ma-valuation-input-cockpit {
      min-width: 340px !important;
    }
  }

  .main-area[data-workspace='ma'] .page .ma-valuation-premium-page .ma-valuation-input-cockpit .ma-input-header h3,
  .main-area .page .ma-valuation-premium-page .ma-valuation-input-cockpit .ma-input-header h3 {
    font-size: 15px !important;
  }

  .main-area[data-workspace='ma'] .page .ma-valuation-premium-page .ma-valuation-input-cockpit .field label,
  .main-area .page .ma-valuation-premium-page .ma-valuation-input-cockpit .field label {
    font-size: 12px !important;
  }

  .main-area[data-workspace='ma'] .page .ma-valuation-premium-page .ma-valuation-input-cockpit .ma-input-cockpit-shell :is(
    input:not([type='range']),
    select,
    textarea
  ) {
    min-height: 42px !important;
    padding: 12px 14px !important;
    font-size: 14px !important;
  }

  .main-area[data-workspace='ma'] .page .ma-valuation-premium-page .ma-valuation-input-cockpit .ma-slider-field {
    padding: 30px 0 !important;
    background: transparent !important;
    border: 0 !important;
    box-shadow: none !important;
  }

  .main-area[data-workspace='ma'] .page .ma-valuation-premium-page .ma-valuation-input-cockpit input[type='range'] {
    height: 5px !important;
    min-height: 5px !important;
    max-height: 5px !important;
  }

  /* C.24.50 — Sidebar REAL width (runtime beats C.24.41/42/49 specificity wars) */
  .main-area[data-workspace='ma'] .page .ma-valuation-premium.ma-valuation-premium-page.ma-executive-page .ma-valuation-body-grid,
  .main-area[data-workspace='ma'] .page .ma-valuation-premium.ma-valuation-premium-page .ma-valuation-body-grid,
  .main-area .page .ma-valuation-premium.ma-valuation-premium-page.ma-executive-page .ma-valuation-body-grid,
  .main-area .page .ma-valuation-premium.ma-valuation-premium-page .ma-valuation-body-grid {
    display: grid !important;
    grid-template-columns: minmax(330px, 380px) minmax(0, 1fr) !important;
    column-gap: 24px !important;
    row-gap: 24px !important;
  }

  @media (min-width: 1181px) {
    .main-area[data-workspace='ma'] .page .ma-valuation-premium.ma-valuation-premium-page.ma-executive-page .ma-valuation-body-grid,
    .main-area[data-workspace='ma'] .page .ma-valuation-premium.ma-valuation-premium-page .ma-valuation-body-grid,
    .main-area .page .ma-valuation-premium.ma-valuation-premium-page.ma-executive-page .ma-valuation-body-grid,
    .main-area .page .ma-valuation-premium.ma-valuation-premium-page .ma-valuation-body-grid {
      grid-template-columns: 380px minmax(0, 1fr) !important;
    }
  }

  .main-area[data-workspace='ma'] .page .ma-valuation-premium.ma-valuation-premium-page .ma-valuation-body-grid > .ma-valuation-input-cockpit,
  .main-area[data-workspace='ma'] .page .ma-valuation-premium.ma-valuation-premium-page .ma-valuation-body-grid > .ma-valuation-sidebar.ma-valuation-input-cockpit,
  .main-area .page .ma-valuation-premium.ma-valuation-premium-page .ma-valuation-body-grid > .ma-valuation-input-cockpit,
  .main-area .page .ma-valuation-premium-page .ma-valuation-input-cockpit,
  .main-area .page .ma-valuation-premium-page .ma-valuation-sidebar {
    width: 100% !important;
    min-width: 330px !important;
    max-width: none !important;
    overflow: visible !important;
    transform: none !important;
  }

  @media (min-width: 1181px) {
    .main-area[data-workspace='ma'] .page .ma-valuation-premium.ma-valuation-premium-page .ma-valuation-body-grid > .ma-valuation-input-cockpit,
    .main-area .page .ma-valuation-premium.ma-valuation-premium-page .ma-valuation-body-grid > .ma-valuation-input-cockpit {
      min-width: 380px !important;
    }
  }

  .main-area[data-workspace='ma'] .page .ma-valuation-premium-page .ma-valuation-input-cockpit .ma-input-cockpit-shell,
  .main-area[data-workspace='ma'] .page .ma-valuation-premium-page .ma-valuation-input-cockpit .ma-input-cockpit-shell.ma-valuation-sidebar-premium.ma-valuation-surface {
    width: 100% !important;
    min-width: 100% !important;
    max-width: none !important;
    box-sizing: border-box !important;
    overflow: visible !important;
  }

  .main-area[data-workspace='ma'] .page .ma-valuation-premium-page .ma-valuation-input-cockpit .ma-slider-field,
  .main-area[data-workspace='ma'] .page .ma-valuation-premium-page .ma-valuation-input-cockpit .ma-slider-track-row {
    background: transparent !important;
    border: 0 !important;
    box-shadow: none !important;
    padding-left: 0 !important;
    padding-right: 0 !important;
  }

  .main-area[data-workspace='ma'] .page .ma-valuation-premium-page .ma-valuation-input-cockpit .ma-slider-field {
    padding-top: 32px !important;
    padding-bottom: 32px !important;
  }

  .main-area[data-workspace='ma'] .page .ma-valuation-premium-page .ma-valuation-input-cockpit .ma-input-cockpit-shell :is(
    input:not([type='range']),
    select,
    textarea
  ) {
    min-height: 42px !important;
    padding: 12px 14px !important;
    font-size: 14px !important;
    width: 100% !important;
  }
`;

export function ExecutivePremiumStyle() {
  return <style>{executivePremiumCss}</style>;
}
