import React from 'react';

/**
 * C.24.14D — Presentational layout shell for /ma/valuation.
 * Visual structure only; no business logic.
 *
 * DOM order (required):
 *   PageShell → Hero → ContextStrip → BodyGrid(sidebar, main)
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

export function ValuationBodyGrid({ children }) {
  return <div className="ma-valuation-body-grid">{children}</div>;
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
