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

  /* C.24.24 — Valuation surfaces: Dashboard C.0.1 material (not navy petroleum) */
  .main-area .page .ma-valuation-premium-page {
    --premium-surface: rgba(8, 18, 18, 0.46);
    --premium-line: rgba(90, 255, 220, 0.09);
  }

  .main-area .page .ma-valuation-premium-page :is(
    .ma-intelligence-panel,
    .ma-traceability-panel,
    .ma-comparables-shell,
    .ma-equity-safe-card,
    .ma-premium-deal-card
  ).ma-valuation-surface {
    border: 1px solid var(--ma-ref-panel-border, rgba(90, 255, 220, 0.09)) !important;
    border-radius: 20px !important;
    background: var(--ma-ref-panel-bg) !important;
    background-image: var(--ma-ref-panel-bg) !important;
    background-color: transparent !important;
    box-shadow: var(--ma-ref-panel-shadow) !important;
    overflow: visible !important;
  }

  .main-area .page .ma-valuation-premium-page .ma-valuation-status-card.ma-valuation-surface {
    border: 1px solid var(--ma-ref-panel-border, rgba(90, 255, 220, 0.09)) !important;
    border-radius: 22px !important;
    background: var(--ma-ref-panel-bg) !important;
    background-image: var(--ma-ref-panel-bg) !important;
    background-color: transparent !important;
    box-shadow: var(--ma-ref-panel-shadow) !important;
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
    background: var(--ma-ref-panel-bg) !important;
    background-image: var(--ma-ref-panel-bg) !important;
    background-color: transparent !important;
    border: 1px solid rgba(90, 255, 220, 0.12) !important;
  }

  .main-area .page .ma-valuation-premium-page .ma-valuation-command-bar.ma-valuation-command-strip {
    background: var(--ma-ref-panel-bg) !important;
    background-image: var(--ma-ref-panel-bg) !important;
    background-color: transparent !important;
    border: 1px solid rgba(90, 255, 220, 0.12) !important;
  }

  .main-area .page .ma-valuation-premium-page .ma-val-ref-scene.ma-valuation-hero {
    min-height: clamp(420px, 36vw, 500px) !important;
    padding-bottom: 16px !important;
  }

  .main-area .page .ma-valuation-premium-page .ma-valuation-status-card.ma-valuation-surface {
    background: var(--ma-ref-panel-bg) !important;
    background-image: var(--ma-ref-panel-bg) !important;
    background-color: transparent !important;
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
    background: var(--ma-ref-panel-bg) !important;
    background-image: var(--ma-ref-panel-bg) !important;
    background-color: transparent !important;
    border: 1px solid rgba(90, 255, 220, 0.13) !important;
  }

  .main-area .page .ma-valuation-premium-page .ma-valuation-command-bar.ma-valuation-command-strip {
    background: var(--ma-ref-panel-bg) !important;
    background-image: var(--ma-ref-panel-bg) !important;
    background-color: transparent !important;
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
    background: var(--ma-ref-panel-bg) !important;
    background-image: var(--ma-ref-panel-bg) !important;
    background-color: transparent !important;
    border: 1px solid rgba(90, 255, 220, 0.12) !important;
  }

  .main-area .page .ma-valuation-premium-page :is(
    .ma-intelligence-panel,
    .ma-traceability-panel,
    .ma-comparables-shell,
    .ma-equity-safe-card,
    .ma-premium-deal-card
  ).ma-valuation-surface {
    background: var(--ma-ref-panel-bg) !important;
    background-image: var(--ma-ref-panel-bg) !important;
    background-color: transparent !important;
    border: 1px solid rgba(90, 255, 220, 0.12) !important;
  }

  /* C.24.28 — Premium final runtime sync */
  .main-area .page .ma-valuation-premium-page .ma-val-ref-scene.ma-valuation-hero {
    min-height: clamp(380px, 32vw, 456px) !important;
    padding-bottom: 8px !important;
  }

  .main-area .page .ma-valuation-premium-page .ma-valuation-command-bar.ma-valuation-command-strip {
    background: var(--ma-ref-panel-bg) !important;
    background-image: var(--ma-ref-panel-bg) !important;
    background-color: transparent !important;
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
    background: var(--ma-ref-panel-bg) !important;
    background-image: var(--ma-ref-panel-bg) !important;
    background-color: transparent !important;
    box-shadow:
      0 22px 50px rgba(0, 0, 0, 0.18),
      inset 0 1px 0 rgba(255, 255, 255, 0.075) !important;
  }

  /* C.24.29 — 85→95% runtime sync */
  .main-area .page .ma-valuation-premium-page .ma-valuation-command-bar.ma-valuation-command-strip {
    background: var(--ma-ref-panel-bg) !important;
    background-image: var(--ma-ref-panel-bg) !important;
    background-color: transparent !important;
    border: 1px solid rgba(90, 255, 220, 0.12) !important;
  }

  .main-area .page .ma-valuation-premium-page :is(
    .ma-intelligence-panel,
    .ma-traceability-panel,
    .ma-comparables-shell,
    .ma-equity-safe-card,
    .ma-premium-deal-card
  ).ma-valuation-surface {
    background: var(--ma-ref-panel-bg) !important;
    background-image: var(--ma-ref-panel-bg) !important;
    background-color: transparent !important;
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
    border: 1px solid rgba(90, 255, 220, 0.09) !important;
    background: var(--ma-ref-panel-bg) !important;
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

  /* C.24.33 — Unified surface tokens: OUTER teal + INNER blue (not same hue) */
  .main-area .page .ma-valuation-premium-page {
    --ma-val-page-bg: #010306;
    --ma-val-surface-card: rgba(10, 24, 24, 0.62);
    --ma-val-surface-card-end: rgba(8, 18, 18, 0.46);
    --ma-val-surface-table: rgba(4, 8, 14, 0.55);
    --ma-val-surface-table-end: rgba(2, 4, 8, 0.35);
    --ma-val-border-subtle: rgba(90, 255, 220, 0.09);
    --ma-val-border-visible: rgba(90, 255, 220, 0.09);
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
    background-color: #010306 !important;
    background-image: none !important;
  }

  .main-area .page .ma-valuation-premium-page {
    --premium-surface-soft: rgba(8, 22, 22, 0.42);
    --premium-line: rgba(90, 255, 220, 0.12);
    background-color: #010306 !important;
  }

  .main-area .page .ma-valuation-premium-page .ma-valuation-upper-suite {
    background: transparent !important;
    background-image: none !important;
    border: 0 !important;
    box-shadow: none !important;
  }

  .main-area .page .ma-valuation-premium-page .ma-valuation-upper-suite .ma-valuation-status-card.ma-valuation-surface {
    background: var(--ma-ref-panel-bg) !important;
    background-image: var(--ma-ref-panel-bg) !important;
    background-color: transparent !important;
    border: 1px solid var(--ma-ref-panel-border, rgba(90, 255, 220, 0.09)) !important;
  }

  .main-area .page .ma-valuation-premium-page :is(
    .ma-intelligence-panel,
    .ma-traceability-panel,
    .ma-comparables-shell,
    .ma-equity-safe-card,
    .ma-premium-deal-card,
    .ma-input-cockpit-shell.ma-valuation-sidebar-premium
  ).ma-valuation-surface {
    background: var(--ma-ref-panel-bg) !important;
    background-image: var(--ma-ref-panel-bg) !important;
    background-color: transparent !important;
    border: 1px solid var(--ma-ref-panel-border, rgba(90, 255, 220, 0.09)) !important;
    box-shadow: var(--ma-ref-panel-shadow) !important;
  }

  .main-area .page .ma-valuation-premium-page .ma-input-cockpit-shell :is(input, select, textarea) {
    background: var(--ma-ref-inset-bg, rgba(5, 9, 9, 0.38)) !important;
    background-image: none !important;
    border-color: var(--ma-ref-inset-border, rgba(90, 255, 220, 0.07)) !important;
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

  /* C.24.40 — OUTER rail shell: exact Dashboard --ma-ref-panel-* */
  .main-area[data-workspace='ma'] .page .ma-valuation-premium-page .ma-valuation-input-cockpit .ma-input-cockpit-shell.ma-valuation-sidebar-premium.ma-valuation-surface {
    background: var(--ma-ref-panel-bg) !important;
    background-image: var(--ma-ref-panel-bg) !important;
    background-color: transparent !important;
    border: 1px solid var(--ma-ref-panel-border, rgba(90, 255, 220, 0.09)) !important;
    box-shadow: var(--ma-ref-panel-shadow) !important;
    backdrop-filter: var(--ma-ref-panel-blur, blur(18px)) !important;
    -webkit-backdrop-filter: var(--ma-ref-panel-blur, blur(18px)) !important;
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
    background: rgba(5, 9, 9, 0.38) !important;
    border-color: rgba(90, 255, 220, 0.07) !important;
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.025) !important;
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
    border: 1px solid rgba(90, 255, 220, 0.09) !important;
    border-radius: 20px !important;
    background: var(--ma-ref-panel-bg) !important;
    box-shadow: var(--ma-ref-panel-shadow) !important;
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

  /* ========================================================================
     GREEN OUTER + BLUE INNER (chromatic hierarchy — do not unify hues)
     OUTER oracle: .ma-reference-workbench-tile / .ma-reference-bottom-slab
                   → --ma-ref-panel-* (teal/green)
     INNER oracle: .ma-reference-bottom-slab .ma-reference-snapshot-readout
                   → linear-gradient(135deg, rgba(4,8,14,.55), rgba(2,4,8,.35))
                   → border rgba(45,212,191,.06)
     L3 capsules: Dashboard .ma-reference-snapshot-metric dark nest
     DEPTH BED: same teal radials as .ma-reference-page::before
     No descendant green rules — outer selectors only on exact shells.
     ======================================================================== */

  /* Depth bed — DISABLED on valuation page shell.
     Was navy wash rgba(12,32,42) that read as residual blue global.
     Page uses flat Dashboard #010306 instead. */
  .main-area[data-workspace='ma'] .page .ma-valuation-premium-page:not(#__ceos_no_match__) {
    position: relative !important;
  }

  .main-area[data-workspace='ma'] .page .ma-valuation-premium-page:not(#__ceos_no_match__)::before {
    content: none !important;
    display: none !important;
    background: none !important;
    background-image: none !important;
  }

  .main-area[data-workspace='ma'] .page .ma-valuation-premium-page:not(#__ceos_no_match__) > * {
    position: relative !important;
    z-index: 1 !important;
  }

  /* LEVEL 1 OUTER — literal Dashboard green/teal (--ma-ref-panel-*) ONLY on shells
     (status card excluded — restored as glass below) */
  .main-area[data-workspace='ma'] .page .ma-valuation-premium-page :is(
    .ma-premium-deal-card,
    .ma-premium-equity-card,
    .ma-premium-intelligence-card,
    .ma-premium-committee-card,
    .ma-premium-comparables-card,
    .ma-equity-safe-card,
    .ma-intelligence-panel,
    .ma-traceability-panel,
    .ma-comparables-shell,
    .ma-input-cockpit-shell.ma-valuation-sidebar-premium,
    .ma-valuation-command-bar.ma-valuation-command-strip
  ).ma-valuation-surface:not(#__ceos_no_match__),
  .main-area[data-workspace='ma'] .page .ma-valuation-premium-page .ma-valuation-command-bar.ma-valuation-command-strip:not(#__ceos_no_match__),
  .main-area .page .ma-valuation-premium-page :is(
    .ma-premium-deal-card,
    .ma-equity-safe-card,
    .ma-intelligence-panel,
    .ma-traceability-panel,
    .ma-comparables-shell,
    .ma-input-cockpit-shell.ma-valuation-sidebar-premium
  ).ma-valuation-surface:not(#__ceos_no_match__) {
    background: linear-gradient(168deg, rgba(10, 24, 24, 0.62) 0%, rgba(8, 18, 18, 0.46) 100%) !important;
    background-image: linear-gradient(168deg, rgba(10, 24, 24, 0.62) 0%, rgba(8, 18, 18, 0.46) 100%) !important;
    background-color: transparent !important;
    border: 1px solid rgba(90, 255, 220, 0.09) !important;
    box-shadow:
      0 18px 44px rgba(0, 0, 0, 0.13),
      inset 0 1px 0 rgba(255, 255, 255, 0.038) !important;
    backdrop-filter: blur(18px) !important;
    -webkit-backdrop-filter: blur(18px) !important;
    filter: none !important;
  }

  /* LEVEL 2 INNER — RESTORED Dashboard blue (snapshot-readout). FREEZE. Not teal.
     KPI tables excluded — soft inset polish at end of file. */
  .main-area[data-workspace='ma'] .page .ma-valuation-premium-page .ma-closing-structure-box:not(#__ceos_no_match__),
  .main-area .page .ma-valuation-premium-page .ma-closing-structure-box:not(#__ceos_no_match__),
  .main-area[data-workspace='ma'] .page .ma-valuation-premium-page .ma-closing-footer-card:not(#__ceos_no_match__),
  .main-area .page .ma-valuation-premium-page .ma-closing-footer-card:not(#__ceos_no_match__),
  .main-area[data-workspace='ma'] .page .ma-valuation-premium-page .ma-valuation-input-cockpit .ma-input-panel:not(#__ceos_no_match__),
  .main-area .page .ma-valuation-premium-page .ma-valuation-input-cockpit .ma-input-panel:not(#__ceos_no_match__),
  .main-area[data-workspace='ma'] .page .ma-valuation-premium-page .ma-premium-comparables-range:not(#__ceos_no_match__),
  .main-area .page .ma-valuation-premium-page .ma-premium-comparables-range:not(#__ceos_no_match__),
  .main-area[data-workspace='ma'] .page .ma-valuation-premium-page .ma-comparables-range:not(#__ceos_no_match__),
  .main-area .page .ma-valuation-premium-page .ma-comparables-range:not(#__ceos_no_match__),
  .main-area[data-workspace='ma'] .page .ma-valuation-premium-page .ma-traceability-score:not(#__ceos_no_match__),
  .main-area .page .ma-valuation-premium-page .ma-traceability-score:not(#__ceos_no_match__),
  .main-area[data-workspace='ma'] .page .ma-valuation-premium-page .ma-valuation-status-list:not(#__ceos_no_match__),
  .main-area .page .ma-valuation-premium-page .ma-valuation-status-list:not(#__ceos_no_match__) {
    background: linear-gradient(135deg, rgba(4, 8, 14, 0.55), rgba(2, 4, 8, 0.35)) !important;
    background-image: linear-gradient(135deg, rgba(4, 8, 14, 0.55), rgba(2, 4, 8, 0.35)) !important;
    background-color: transparent !important;
    border: 1px solid rgba(45, 212, 191, 0.06) !important;
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.03) !important;
    backdrop-filter: none !important;
    -webkit-backdrop-filter: none !important;
  }

  /* LEVEL 3 — dark nests for non-capsule cockpit controls only.
     Capsule surfaces/inputs owned by CanonicalParity --ma-ref-panel-*. */
  .main-area[data-workspace='ma'] .page .ma-valuation-premium-page .ma-premium-equity-stat:not(#__ceos_no_match__),
  .main-area .page .ma-valuation-premium-page .ma-premium-equity-stat:not(#__ceos_no_match__),
  .main-area[data-workspace='ma'] .page .ma-valuation-premium-page .ma-valuation-input-cockpit .field:not(.ma-fb-numeric-capsule) .input:not(#__ceos_no_match__),
  .main-area[data-workspace='ma'] .page .ma-valuation-premium-page .ma-valuation-input-cockpit .field:not(.ma-fb-numeric-capsule) .select:not(#__ceos_no_match__),
  .main-area[data-workspace='ma'] .page .ma-valuation-premium-page .ma-valuation-input-cockpit .ma-input-cockpit-shell .field:not(.ma-fb-numeric-capsule) :is(
    input:not([type='range']),
    select,
    textarea
  ):not(#__ceos_no_match__) {
    background: rgba(5, 9, 9, 0.38) !important;
    background-image: none !important;
    background-color: rgba(5, 9, 9, 0.38) !important;
    border-color: rgba(90, 255, 220, 0.07) !important;
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.025) !important;
  }

  /* Kill shell ambient overlays that darken/recolor vs Dashboard */
  .main-area[data-workspace='ma'] .page .ma-valuation-premium-page .ma-input-cockpit-shell::before:not(#__ceos_no_match__),
  .main-area .page .ma-valuation-premium-page .ma-input-cockpit-shell::before:not(#__ceos_no_match__) {
    content: none !important;
    display: none !important;
    background: none !important;
    opacity: 0 !important;
  }

  /* Remove unwanted Financial Baseline reticule */
  .main-area[data-workspace='ma'] .page .ma-valuation-premium-page .ma-fb-surface-atmo:not(#__ceos_no_match__),
  .main-area .page .ma-valuation-premium-page .ma-fb-surface-atmo:not(#__ceos_no_match__) {
    display: none !important;
    visibility: hidden !important;
    background: none !important;
    background-image: none !important;
    opacity: 0 !important;
    pointer-events: none !important;
  }

  /* MICRO FIX — left OUTER only: kill #213743 / teal-radial mismatch vs Deal Structure.
     Exact same literals as LEVEL 1 OUTER above. Does not touch .ma-input-panel / capsules. */
  .main-area[data-workspace='ma'] .page .ma-valuation-premium-page .ma-valuation-input-cockpit .ma-input-cockpit-shell.ma-valuation-sidebar-premium.ma-valuation-surface:not(#__ceos_no_match__),
  .main-area .page .ma-valuation-premium-page .ma-valuation-input-cockpit .ma-input-cockpit-shell.ma-valuation-sidebar-premium.ma-valuation-surface:not(#__ceos_no_match__),
  .main-area[data-workspace='ma'] .page .ma-valuation-premium-page .ma-valuation-input-cockpit .ma-input-cockpit-shell.ma-valuation-underwriting-rail.ma-valuation-surface:not(#__ceos_no_match__) {
    background: linear-gradient(168deg, rgba(10, 24, 24, 0.62) 0%, rgba(8, 18, 18, 0.46) 100%) !important;
    background-image: linear-gradient(168deg, rgba(10, 24, 24, 0.62) 0%, rgba(8, 18, 18, 0.46) 100%) !important;
    background-color: transparent !important;
    border: 1px solid rgba(90, 255, 220, 0.09) !important;
    box-shadow:
      0 18px 44px rgba(0, 0, 0, 0.13),
      inset 0 1px 0 rgba(255, 255, 255, 0.038) !important;
    backdrop-filter: blur(18px) !important;
    -webkit-backdrop-filter: blur(18px) !important;
    filter: none !important;
  }

  /* ========================================================================
     GLOBAL PAGE BASE — BLACK only on page root (not descendants).
     Regression cause of prior pass: flat #010306 + killing atmosphere made
     translucent L1/L2 panels read as black. Keep black base; restore hierarchy
     AFTER this block with denser same-hue materials.
     Oracle page: .ma-executive-page.ma-dashboard-premium → #010306
     ======================================================================== */
  .main-area[data-workspace='ma']:has(.page .ma-valuation-premium-page):not(#__ceos_no_match__) {
    background-color: #010306 !important;
    background-image: none !important;
  }

  /* Page root ONLY — no descendant selector, no inherit onto cards */
  .main-area[data-workspace='ma'] .page .ma-valuation-premium.ma-valuation-premium-page:not(#__ceos_no_match__),
  .main-area[data-workspace='ma'] .page .ma-valuation-premium-page:not(#__ceos_no_match__),
  .main-area .page .ma-valuation-premium.ma-valuation-premium-page:not(#__ceos_no_match__),
  .main-area .page .ma-valuation-premium-page:not(#__ceos_no_match__) {
    --ma-val-bg: #010306;
    --ma-val-page-bg: #010306;
    --ma-val-page-bg-deep: #010306;
    background-color: #010306 !important;
    /* Dashboard executive atmosphere (teal + black ONLY — no rgba(12,32,42) blue) */
    background-image:
      radial-gradient(ellipse 110% 75% at 18% -12%, rgba(32, 201, 151, 0.08), transparent 56%),
      radial-gradient(ellipse 85% 58% at 92% 8%, rgba(45, 212, 191, 0.045), transparent 50%),
      radial-gradient(ellipse 60% 40% at 50% 100%, rgba(1, 3, 6, 0.85), transparent 72%) !important;
    border: 0 !important;
    border-radius: 0 !important;
    box-shadow: none !important;
    backdrop-filter: none !important;
    -webkit-backdrop-filter: none !important;
    outline: none !important;
  }

  /* No blue global ::before plate — atmosphere lives in page background-image above */
  .main-area[data-workspace='ma'] .page .ma-valuation-premium-page:not(#__ceos_no_match__)::before,
  .main-area[data-workspace='ma'] .page .ma-valuation-premium.ma-valuation-premium-page:not(#__ceos_no_match__)::before {
    content: none !important;
    display: none !important;
    background: none !important;
    background-image: none !important;
    opacity: 0 !important;
  }

  /* Upper suite stays open (not a global plate) */
  .main-area[data-workspace='ma'] .page .ma-valuation-premium-page .ma-valuation-upper-suite:not(#__ceos_no_match__),
  .main-area .page .ma-valuation-premium-page .ma-valuation-upper-suite:not(#__ceos_no_match__) {
    background: transparent !important;
    background-image: none !important;
    background-color: transparent !important;
    border: 0 !important;
    box-shadow: none !important;
  }

  /* ── RESTORE after page-black: LEVEL 1 OUTER green/teal
     (status card excluded — glass finish below) ── */
  .main-area[data-workspace='ma'] .page .ma-valuation-premium-page :is(
    .ma-premium-deal-card,
    .ma-premium-equity-card,
    .ma-premium-intelligence-card,
    .ma-premium-committee-card,
    .ma-premium-comparables-card,
    .ma-equity-safe-card,
    .ma-intelligence-panel,
    .ma-traceability-panel,
    .ma-comparables-shell,
    .ma-input-cockpit-shell.ma-valuation-sidebar-premium,
    .ma-valuation-command-bar.ma-valuation-command-strip
  ).ma-valuation-surface:not(#__ceos_no_match__),
  .main-area[data-workspace='ma'] .page .ma-valuation-premium-page .ma-valuation-command-bar.ma-valuation-command-strip:not(#__ceos_no_match__),
  .main-area .page .ma-valuation-premium-page :is(
    .ma-premium-deal-card,
    .ma-equity-safe-card,
    .ma-intelligence-panel,
    .ma-traceability-panel,
    .ma-comparables-shell,
    .ma-input-cockpit-shell.ma-valuation-sidebar-premium
  ).ma-valuation-surface:not(#__ceos_no_match__),
  .main-area[data-workspace='ma'] .page .ma-valuation-premium-page .ma-valuation-input-cockpit .ma-input-cockpit-shell.ma-valuation-sidebar-premium.ma-valuation-surface:not(#__ceos_no_match__),
  .main-area[data-workspace='ma'] .page .ma-valuation-premium-page .ma-valuation-input-cockpit .ma-input-cockpit-shell.ma-valuation-underwriting-rail.ma-valuation-surface:not(#__ceos_no_match__) {
    background: linear-gradient(168deg, rgba(10, 24, 24, 0.88) 0%, rgba(8, 18, 18, 0.78) 100%) !important;
    background-image: linear-gradient(168deg, rgba(10, 24, 24, 0.88) 0%, rgba(8, 18, 18, 0.78) 100%) !important;
    background-color: rgba(10, 24, 24, 0.88) !important;
    border: 1px solid rgba(90, 255, 220, 0.09) !important;
    box-shadow:
      0 18px 44px rgba(0, 0, 0, 0.13),
      inset 0 1px 0 rgba(255, 255, 255, 0.038) !important;
    backdrop-filter: blur(18px) !important;
    -webkit-backdrop-filter: blur(18px) !important;
    filter: none !important;
  }

  /* ── RESTORE LEVEL 2 INNER blue (snapshot-readout hue; denser on black page)
     KPI tables (quality-readout / equity-safe-stats / val-integrated-stats)
     excluded — soft inset polish below. ── */
  .main-area[data-workspace='ma'] .page .ma-valuation-premium-page .ma-closing-structure-box:not(#__ceos_no_match__),
  .main-area .page .ma-valuation-premium-page .ma-closing-structure-box:not(#__ceos_no_match__),
  .main-area[data-workspace='ma'] .page .ma-valuation-premium-page .ma-closing-footer-card:not(#__ceos_no_match__),
  .main-area .page .ma-valuation-premium-page .ma-closing-footer-card:not(#__ceos_no_match__),
  .main-area[data-workspace='ma'] .page .ma-valuation-premium-page .ma-valuation-input-cockpit .ma-input-panel:not(#__ceos_no_match__),
  .main-area .page .ma-valuation-premium-page .ma-valuation-input-cockpit .ma-input-panel:not(#__ceos_no_match__),
  .main-area[data-workspace='ma'] .page .ma-valuation-premium-page .ma-premium-comparables-range:not(#__ceos_no_match__),
  .main-area .page .ma-valuation-premium-page .ma-premium-comparables-range:not(#__ceos_no_match__),
  .main-area[data-workspace='ma'] .page .ma-valuation-premium-page .ma-comparables-range:not(#__ceos_no_match__),
  .main-area .page .ma-valuation-premium-page .ma-comparables-range:not(#__ceos_no_match__),
  .main-area[data-workspace='ma'] .page .ma-valuation-premium-page .ma-traceability-score:not(#__ceos_no_match__),
  .main-area .page .ma-valuation-premium-page .ma-traceability-score:not(#__ceos_no_match__),
  .main-area[data-workspace='ma'] .page .ma-valuation-premium-page .ma-valuation-status-list:not(#__ceos_no_match__),
  .main-area .page .ma-valuation-premium-page .ma-valuation-status-list:not(#__ceos_no_match__) {
    background: linear-gradient(135deg, rgba(4, 8, 14, 0.78), rgba(2, 4, 8, 0.62)) !important;
    background-image: linear-gradient(135deg, rgba(4, 8, 14, 0.78), rgba(2, 4, 8, 0.62)) !important;
    background-color: rgba(4, 8, 14, 0.78) !important;
    border: 1px solid rgba(45, 212, 191, 0.06) !important;
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.03) !important;
    backdrop-filter: none !important;
    -webkit-backdrop-filter: none !important;
  }

  /* LEVEL 3 dark nests — non-capsule cockpit controls only.
     Capsule surfaces stay on CanonicalParity --ma-ref-panel-* (approved material). */
  .main-area[data-workspace='ma'] .page .ma-valuation-premium-page .ma-valuation-input-cockpit .field:not(.ma-fb-numeric-capsule) .input:not(#__ceos_no_match__),
  .main-area[data-workspace='ma'] .page .ma-valuation-premium-page .ma-valuation-input-cockpit .field:not(.ma-fb-numeric-capsule) .select:not(#__ceos_no_match__),
  .main-area[data-workspace='ma'] .page .ma-valuation-premium-page .ma-valuation-input-cockpit .ma-input-cockpit-shell .field:not(.ma-fb-numeric-capsule) :is(
    input:not([type='range']),
    select,
    textarea
  ):not(#__ceos_no_match__) {
    background: rgba(5, 9, 9, 0.55) !important;
    background-image: none !important;
    background-color: rgba(5, 9, 9, 0.55) !important;
    border-color: rgba(90, 255, 220, 0.07) !important;
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.025) !important;
  }

  /* ========================================================================
     TOP-RIGHT STATUS CARD ONLY — FINAL MICRO POLISH
     Outer teal −~9%; inner opacity −~7%; more internal air (padding/gap).
     ======================================================================== */
  .main-area[data-workspace='ma'] .page .ma-valuation-premium-page .ma-valuation-upper-suite:not(#__ceos_no_match__) .ma-valuation-status-card.ma-valuation-surface:not(#__ceos_no_match__),
  .main-area[data-workspace='ma'] .page .ma-valuation-premium-page .ma-valuation-upper-suite .ma-valuation-status-card.ma-valuation-surface:not(#__ceos_no_match__),
  .main-area .page .ma-valuation-premium-page .ma-valuation-upper-suite .ma-valuation-status-card.ma-valuation-surface:not(#__ceos_no_match__),
  .main-area[data-workspace='ma'] .page .ma-valuation-premium-page .ma-valuation-status-card.ma-valuation-surface:not(#__ceos_no_match__) {
    padding: 36px 36px 38px !important;
    background:
      linear-gradient(
        180deg,
        rgba(255, 255, 255, 0.032) 0%,
        rgba(255, 255, 255, 0) 14%
      ),
      linear-gradient(
        158deg,
        rgba(255, 255, 255, 0.012) 0%,
        rgba(2, 4, 7, 0.045) 44%,
        rgba(1, 2, 4, 0.075) 100%
      ) !important;
    background-image:
      linear-gradient(
        180deg,
        rgba(255, 255, 255, 0.032) 0%,
        rgba(255, 255, 255, 0) 14%
      ),
      linear-gradient(
        158deg,
        rgba(255, 255, 255, 0.012) 0%,
        rgba(2, 4, 7, 0.045) 44%,
        rgba(1, 2, 4, 0.075) 100%
      ) !important;
    background-color: transparent !important;
    border: 1px solid rgba(148, 163, 184, 0.055) !important;
    border-top-color: rgba(90, 255, 220, 0.074) !important;
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.065),
      inset 1px 0 0 rgba(45, 212, 191, 0.016),
      0 10px 28px rgba(0, 0, 0, 0.2),
      0 -6px 18px rgba(45, 212, 191, 0.009) !important;
    backdrop-filter: blur(20px) saturate(86%) brightness(0.94) !important;
    -webkit-backdrop-filter: blur(20px) saturate(86%) brightness(0.94) !important;
    filter: none !important;
    overflow: visible !important;
  }

  /* Internal breathing — more air between title / copy / status table */
  .main-area[data-workspace='ma'] .page .ma-valuation-premium-page .ma-valuation-status-card .ma-valuation-status-inner:not(#__ceos_no_match__),
  .main-area .page .ma-valuation-premium-page .ma-valuation-status-card .ma-valuation-status-inner:not(#__ceos_no_match__) {
    gap: 24px !important;
  }

  .main-area[data-workspace='ma'] .page .ma-valuation-premium-page .ma-valuation-status-card .ma-valuation-status-top:not(#__ceos_no_match__),
  .main-area .page .ma-valuation-premium-page .ma-valuation-status-card .ma-valuation-status-top:not(#__ceos_no_match__) {
    gap: 20px !important;
    margin-bottom: 2px !important;
  }

  .main-area[data-workspace='ma'] .page .ma-valuation-premium-page .ma-valuation-status-card .ma-valuation-status-title:not(#__ceos_no_match__),
  .main-area .page .ma-valuation-premium-page .ma-valuation-status-card .ma-valuation-status-title:not(#__ceos_no_match__) {
    margin-top: 10px !important;
  }

  /* Kill legacy teal wash overlays on outer card */
  .main-area[data-workspace='ma'] .page .ma-valuation-premium-page .ma-valuation-upper-suite:not(#__ceos_no_match__) .ma-valuation-status-card:not(#__ceos_no_match__)::before,
  .main-area[data-workspace='ma'] .page .ma-valuation-premium-page .ma-valuation-upper-suite:not(#__ceos_no_match__) .ma-valuation-status-card:not(#__ceos_no_match__)::after,
  .main-area[data-workspace='ma'] .page .ma-valuation-premium-page .ma-valuation-status-card:not(#__ceos_no_match__)::before,
  .main-area[data-workspace='ma'] .page .ma-valuation-premium-page .ma-valuation-status-card:not(#__ceos_no_match__)::after,
  .main-area .page .ma-valuation-premium-page .ma-valuation-status-card:not(#__ceos_no_match__)::before,
  .main-area .page .ma-valuation-premium-page .ma-valuation-status-card:not(#__ceos_no_match__)::after {
    content: none !important;
    display: none !important;
    background: none !important;
    background-image: none !important;
    opacity: 0 !important;
  }

  /* Intro headline + description — text on glass only (kill independent rectangle) */
  .main-area[data-workspace='ma'] .page .ma-valuation-premium-page .ma-valuation-status-card .ma-valuation-status-box:not(#__ceos_no_match__),
  .main-area .page .ma-valuation-premium-page .ma-valuation-status-card .ma-valuation-status-box:not(#__ceos_no_match__) {
    background: transparent !important;
    background-image: none !important;
    background-color: transparent !important;
    border: 0 !important;
    border-radius: 0 !important;
    box-shadow: none !important;
    backdrop-filter: none !important;
    -webkit-backdrop-filter: none !important;
    margin: 0 0 6px !important;
    padding: 0 2px !important;
  }

  .main-area[data-workspace='ma'] .page .ma-valuation-premium-page .ma-valuation-status-card .ma-valuation-status-box:not(#__ceos_no_match__)::before,
  .main-area[data-workspace='ma'] .page .ma-valuation-premium-page .ma-valuation-status-card .ma-valuation-status-box:not(#__ceos_no_match__)::after,
  .main-area .page .ma-valuation-premium-page .ma-valuation-status-card .ma-valuation-status-box:not(#__ceos_no_match__)::before,
  .main-area .page .ma-valuation-premium-page .ma-valuation-status-card .ma-valuation-status-box:not(#__ceos_no_match__)::after {
    display: none !important;
    content: none !important;
  }

  .main-area[data-workspace='ma'] .page .ma-valuation-premium-page .ma-valuation-status-card .ma-valuation-status-box strong:not(#__ceos_no_match__),
  .main-area .page .ma-valuation-premium-page .ma-valuation-status-card .ma-valuation-status-box strong:not(#__ceos_no_match__) {
    margin: 0 0 10px !important;
  }

  /* Validation / Backend / Analysis / Access — softer inset (−~7% opacity) */
  .main-area[data-workspace='ma'] .page .ma-valuation-premium-page .ma-valuation-status-card .ma-valuation-status-list:not(#__ceos_no_match__),
  .main-area .page .ma-valuation-premium-page .ma-valuation-status-card .ma-valuation-status-list:not(#__ceos_no_match__) {
    background:
      linear-gradient(
        160deg,
        rgba(6, 12, 18, 0.26) 0%,
        rgba(3, 6, 11, 0.165) 100%
      ) !important;
    background-image:
      linear-gradient(
        160deg,
        rgba(6, 12, 18, 0.26) 0%,
        rgba(3, 6, 11, 0.165) 100%
      ) !important;
    background-color: transparent !important;
    border: 1px solid rgba(255, 255, 255, 0.03) !important;
    border-radius: 12px !important;
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.02) !important;
    backdrop-filter: blur(6px) !important;
    -webkit-backdrop-filter: blur(6px) !important;
    padding: 4px 14px !important;
    margin-top: 2px !important;
  }

  .main-area[data-workspace='ma'] .page .ma-valuation-premium-page .ma-valuation-status-card .ma-valuation-status-row:not(#__ceos_no_match__),
  .main-area .page .ma-valuation-premium-page .ma-valuation-status-card .ma-valuation-status-row:not(#__ceos_no_match__) {
    background: transparent !important;
    background-image: none !important;
    border: 0 !important;
    border-top: 1px solid rgba(255, 255, 255, 0.032) !important;
    border-radius: 0 !important;
    box-shadow: none !important;
  }

  .main-area[data-workspace='ma'] .page .ma-valuation-premium-page .ma-valuation-status-card .ma-valuation-status-list > .ma-valuation-status-row:first-child:not(#__ceos_no_match__),
  .main-area .page .ma-valuation-premium-page .ma-valuation-status-card .ma-valuation-status-list > .ma-valuation-status-row:first-child:not(#__ceos_no_match__) {
    border-top: 0 !important;
  }

  /* ========================================================================
     KPI TABLES — soft embedded inset (Quality Score + EV/EBITDA KPI rows)
     Not solid black stickers. Material only — layout/copy/typography untouched.
     ======================================================================== */
  .main-area[data-workspace='ma'] .page .ma-valuation-premium-page .ma-equity-safe-quality-readout:not(#__ceos_no_match__),
  .main-area .page .ma-valuation-premium-page .ma-equity-safe-quality-readout:not(#__ceos_no_match__),
  .main-area[data-workspace='ma'] .page .ma-valuation-premium-page .ma-equity-safe-quality-panel:not(#__ceos_no_match__),
  .main-area .page .ma-valuation-premium-page .ma-equity-safe-quality-panel:not(#__ceos_no_match__),
  .main-area[data-workspace='ma'] .page .ma-valuation-premium-page .ma-equity-safe-stats:not(#__ceos_no_match__),
  .main-area .page .ma-valuation-premium-page .ma-equity-safe-stats:not(#__ceos_no_match__),
  .main-area[data-workspace='ma'] .page .ma-valuation-premium-page .ma-val-integrated-stats:not(#__ceos_no_match__),
  .main-area .page .ma-valuation-premium-page .ma-val-integrated-stats:not(#__ceos_no_match__),
  .main-area[data-workspace='ma'] .page .ma-valuation-premium-page .ma-equity-safe-stats.ma-val-integrated-stats:not(#__ceos_no_match__),
  .main-area .page .ma-valuation-premium-page .ma-equity-safe-stats.ma-val-integrated-stats:not(#__ceos_no_match__),
  .main-area[data-workspace='ma'] .page .ma-valuation-premium-page .ma-valuation-executive-summary:not(#__ceos_no_match__) .ma-equity-safe-stats.ma-val-integrated-stats,
  .main-area .page .ma-valuation-premium-page .ma-valuation-executive-summary:not(#__ceos_no_match__) .ma-equity-safe-stats.ma-val-integrated-stats,
  .main-area[data-workspace='ma'] .page .ma-valuation-premium-page .ma-premium-stats-grid:not(#__ceos_no_match__),
  .main-area .page .ma-valuation-premium-page .ma-premium-stats-grid:not(#__ceos_no_match__) {
    background:
      linear-gradient(
        160deg,
        rgba(6, 14, 20, 0.3) 0%,
        rgba(3, 7, 12, 0.18) 100%
      ) !important;
    background-image:
      linear-gradient(
        160deg,
        rgba(6, 14, 20, 0.3) 0%,
        rgba(3, 7, 12, 0.18) 100%
      ) !important;
    background-color: transparent !important;
    border: 1px solid rgba(255, 255, 255, 0.032) !important;
    border-top: 1px solid rgba(255, 255, 255, 0.032) !important;
    border-radius: 14px !important;
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.022) !important;
    backdrop-filter: blur(8px) !important;
    -webkit-backdrop-filter: blur(8px) !important;
  }

  /* Soft inset breathing — material only (no column/structure change) */
  .main-area[data-workspace='ma'] .page .ma-valuation-premium-page .ma-equity-safe-quality-readout:not(#__ceos_no_match__),
  .main-area .page .ma-valuation-premium-page .ma-equity-safe-quality-readout:not(#__ceos_no_match__),
  .main-area[data-workspace='ma'] .page .ma-valuation-premium-page .ma-equity-safe-quality-panel:not(#__ceos_no_match__),
  .main-area .page .ma-valuation-premium-page .ma-equity-safe-quality-panel:not(#__ceos_no_match__) {
    padding: 14px 18px !important;
  }

  .main-area[data-workspace='ma'] .page .ma-valuation-premium-page .ma-equity-safe-stats.ma-val-integrated-stats:not(#__ceos_no_match__),
  .main-area .page .ma-valuation-premium-page .ma-equity-safe-stats.ma-val-integrated-stats:not(#__ceos_no_match__),
  .main-area[data-workspace='ma'] .page .ma-valuation-premium-page .ma-valuation-executive-summary:not(#__ceos_no_match__) .ma-equity-safe-stats.ma-val-integrated-stats,
  .main-area .page .ma-valuation-premium-page .ma-valuation-executive-summary:not(#__ceos_no_match__) .ma-equity-safe-stats.ma-val-integrated-stats,
  .main-area[data-workspace='ma'] .page .ma-valuation-premium-page .ma-premium-stats-grid:not(#__ceos_no_match__),
  .main-area .page .ma-valuation-premium-page .ma-premium-stats-grid:not(#__ceos_no_match__) {
    padding: 10px 12px !important;
  }

  /* KPI cells — transparent within soft grid (no mini-stickers) */
  .main-area[data-workspace='ma'] .page .ma-valuation-premium-page .ma-equity-safe-stats .ma-equity-safe-stat:not(#__ceos_no_match__),
  .main-area .page .ma-valuation-premium-page .ma-equity-safe-stats .ma-equity-safe-stat:not(#__ceos_no_match__),
  .main-area[data-workspace='ma'] .page .ma-valuation-premium-page .ma-val-integrated-stats .ma-equity-safe-stat:not(#__ceos_no_match__),
  .main-area .page .ma-valuation-premium-page .ma-val-integrated-stats .ma-equity-safe-stat:not(#__ceos_no_match__),
  .main-area[data-workspace='ma'] .page .ma-valuation-premium-page .ma-premium-stats-grid .ma-premium-stat:not(#__ceos_no_match__),
  .main-area .page .ma-valuation-premium-page .ma-premium-stats-grid .ma-premium-stat:not(#__ceos_no_match__) {
    background: transparent !important;
    background-image: none !important;
    background-color: transparent !important;
    border: 0 !important;
    border-right: 1px solid rgba(255, 255, 255, 0.04) !important;
    border-radius: 0 !important;
    box-shadow: none !important;
  }

  .main-area[data-workspace='ma'] .page .ma-valuation-premium-page .ma-equity-safe-stats .ma-equity-safe-stat:last-child:not(#__ceos_no_match__),
  .main-area .page .ma-valuation-premium-page .ma-equity-safe-stats .ma-equity-safe-stat:last-child:not(#__ceos_no_match__),
  .main-area[data-workspace='ma'] .page .ma-valuation-premium-page .ma-val-integrated-stats .ma-equity-safe-stat:last-child:not(#__ceos_no_match__),
  .main-area .page .ma-valuation-premium-page .ma-val-integrated-stats .ma-equity-safe-stat:last-child:not(#__ceos_no_match__),
  .main-area[data-workspace='ma'] .page .ma-valuation-premium-page .ma-premium-stats-grid .ma-premium-stat:last-child:not(#__ceos_no_match__),
  .main-area .page .ma-valuation-premium-page .ma-premium-stats-grid .ma-premium-stat:last-child:not(#__ceos_no_match__),
  .main-area[data-workspace='ma'] .page .ma-valuation-premium-page .ma-equity-safe-stats .ma-equity-safe-stat:nth-child(4n):not(#__ceos_no_match__),
  .main-area .page .ma-valuation-premium-page .ma-equity-safe-stats .ma-equity-safe-stat:nth-child(4n):not(#__ceos_no_match__),
  .main-area[data-workspace='ma'] .page .ma-valuation-premium-page .ma-premium-stats-grid .ma-premium-stat:nth-child(4n):not(#__ceos_no_match__),
  .main-area .page .ma-valuation-premium-page .ma-premium-stats-grid .ma-premium-stat:nth-child(4n):not(#__ceos_no_match__) {
    border-right: 0 !important;
  }

  .main-area[data-workspace='ma'] .page .ma-valuation-premium-page .ma-equity-safe-stats .ma-equity-safe-stat:not(#__ceos_no_match__)::before,
  .main-area .page .ma-valuation-premium-page .ma-equity-safe-stats .ma-equity-safe-stat:not(#__ceos_no_match__)::before,
  .main-area[data-workspace='ma'] .page .ma-valuation-premium-page .ma-premium-stats-grid .ma-premium-stat:not(#__ceos_no_match__)::before,
  .main-area .page .ma-valuation-premium-page .ma-premium-stats-grid .ma-premium-stat:not(#__ceos_no_match__)::before {
    display: none !important;
    content: none !important;
  }

  /* ========================================================================
     VALUE CAPSULES — ALIGNMENT ONLY
     Restores pair baseline when labels wrap to different line counts.
     Does NOT change capsule material (CanonicalParity --ma-ref-panel-*).
     ======================================================================== */
  .main-area[data-workspace='ma']
    .page
    .ma-valuation-premium-page
    .ma-valuation-input-cockpit:not(#__ceos_no_match__)
    .ma-financial-baseline-block
    .ma-input-grid {
    display: grid !important;
    grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
    align-items: stretch !important;
    column-gap: 14px !important;
    row-gap: 12px !important;
  }

  .main-area[data-workspace='ma']
    .page
    .ma-valuation-premium-page
    .ma-valuation-input-cockpit:not(#__ceos_no_match__)
    .ma-financial-baseline-block
    .ma-input-grid
    .field.ma-fb-numeric-capsule {
    display: flex !important;
    flex-direction: column !important;
    align-items: stretch !important;
    justify-content: flex-start !important;
    min-width: 0 !important;
    height: 100% !important;
    margin: 0 !important;
  }

  .main-area[data-workspace='ma']
    .page
    .ma-valuation-premium-page
    .ma-valuation-input-cockpit:not(#__ceos_no_match__)
    .ma-financial-baseline-block
    .ma-input-grid
    .field.ma-fb-numeric-capsule
    > label {
    display: flex !important;
    align-items: flex-end !important;
    min-height: 2.6em !important;
    margin: 0 0 8px !important;
    line-height: 1.3 !important;
    box-sizing: border-box !important;
  }

  .main-area[data-workspace='ma']
    .page
    .ma-valuation-premium-page
    .ma-valuation-input-cockpit:not(#__ceos_no_match__)
    .ma-financial-baseline-block
    .ma-input-grid
    .field.ma-fb-numeric-capsule
    .ma-fb-numeric-capsule-surface {
    width: 100% !important;
    min-height: 42px !important;
    height: 42px !important;
    box-sizing: border-box !important;
    margin: 0 !important;
    flex: 0 0 auto !important;
  }

  .main-area[data-workspace='ma']
    .page
    .ma-valuation-premium-page
    .ma-valuation-input-cockpit:not(#__ceos_no_match__)
    .ma-financial-baseline-block
    .ma-input-grid
    .field.ma-fb-numeric-capsule
    .ma-fb-numeric-capsule-surface
    .input {
    width: 100% !important;
    height: 100% !important;
    min-height: 0 !important;
    box-sizing: border-box !important;
  }
`;

export function ExecutivePremiumStyle() {
  return <style>{executivePremiumCss}</style>;
}
