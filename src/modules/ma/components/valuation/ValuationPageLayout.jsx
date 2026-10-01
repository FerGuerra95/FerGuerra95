import React from 'react';

/**
 * C.24.14D / C.24.97 — Presentational layout shell for /ma/valuation.
 * Visual structure only; no business logic.
 *
 * DOM order (required):
 *   PageShell → UpperSuite(Hero, ContextStrip) →
 *   WorkspaceGrid(sidebar, main: equity + deal structure + intelligence) →
 *   AnalyticalBand(full-width committee / comparables)
 *
 * ContextStrip is a post-hero band: sibling immediately AFTER Hero inside
 * UpperSuite. It must not sit inside the hero material surface.
 */

export function ValuationPageShell({ children }) {
  return (
    <div className="ma-executive-page ma-branch-premium-page ma-valuation-premium ma-valuation-premium-page">
      {children}
    </div>
  );
}

export function ValuationUpperSuite({ children }) {
  return (
    <div className="ma-valuation-upper-suite">
      {children}
    </div>
  );
}

export function ValuationHero({ children, titleId = 'ma-valuation-title' }) {
  return (
    <section
      className="ma-val-ref-scene ma-valuation-hero"
      aria-labelledby={titleId}
    >
      {children}
    </section>
  );
}

export function ValuationContextStrip({ children }) {
  return (
    <section
      className="ma-valuation-active-strip ma-valuation-context-strip"
      aria-label="Active case context"
    >
      {children}
    </section>
  );
}

/** Phase A — two-column underwriting workspace (Inputs | Equity + Deal Structure + Intelligence). */
export function ValuationBodyGrid({ children }) {
  return <div className="ma-valuation-body-grid ma-valuation-workspace-grid">{children}</div>;
}

export function ValuationInputCockpit({ children }) {
  return (
    <aside className="ma-valuation-sidebar ma-valuation-input-cockpit">
      {children}
    </aside>
  );
}

export function ValuationMainWorkspace({ children }) {
  return (
    <main className="ma-valuation-main ma-valuation-main-workspace">
      {children}
    </main>
  );
}

/** Phase B — full-width governance / market stack (Committee + Comparables). */
export function ValuationAnalyticalBand({ children }) {
  return (
    <div className="ma-valuation-analytical-band">
      {children}
    </div>
  );
}
