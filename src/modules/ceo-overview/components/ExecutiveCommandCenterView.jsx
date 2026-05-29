import React from 'react';
import { Link } from 'react-router-dom';
import { FileText } from 'lucide-react';
import { Button } from '../../../shared/components/ui/Button.jsx';
import { CorporateHealthRadar } from './CorporateHealthRadar.jsx';
import {
  formatModuleScoreDisplay,
  formatScoreLabel,
  normalizeScoreOrNull
} from '../utils/ceoOverviewTruthfulness.js';

const CEO_LION_MARK_SRC = '/brand/ceos-lion-mark.png?v=20260529-lion';

const commandCenterCss = `
  .ceo-executive-command-page {
    --ceo-gold: #d4af37;
    --ceo-gold-soft: #f3da8a;
    --ceo-gold-deep: #8a6a16;
    --ceo-black: #060608;
    --ceo-charcoal: #0c0c10;
    --ceo-line: rgba(212, 175, 55, 0.22);
    width: min(1480px, 100%);
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 18px;
    color: rgba(236, 230, 216, 0.94);
  }

  .ceo-command-section {
    display: flex;
    flex-direction: column;
    min-width: 0;
  }

  .ceo-command-section-shell {
    border-radius: 22px;
    border: 1px solid rgba(212, 175, 55, 0.24);
    background:
      radial-gradient(circle at 0% 0%, rgba(212, 175, 55, 0.06), transparent 42%),
      linear-gradient(180deg, rgba(8, 8, 12, 0.98), rgba(4, 4, 6, 0.99));
    box-shadow:
      0 18px 48px rgba(0, 0, 0, 0.42),
      inset 0 1px 0 rgba(243, 218, 138, 0.06);
    padding: 16px 16px 14px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .ceo-command-section-header {
    display: flex;
    align-items: flex-start;
    gap: 14px;
    padding-bottom: 2px;
    border-bottom: 1px solid rgba(212, 175, 55, 0.1);
  }

  .ceo-command-number {
    flex: 0 0 auto;
    width: 42px;
    height: 42px;
    border-radius: 999px;
    display: grid;
    place-items: center;
    font-size: 12px;
    font-weight: 850;
    letter-spacing: 0.04em;
    color: #111827;
    border: 1px solid rgba(243, 218, 138, 0.72);
    background: linear-gradient(145deg, #fcecb8, #d4af37 55%, #9a7518);
    box-shadow:
      0 0 0 1px rgba(212, 175, 55, 0.18),
      0 0 22px rgba(212, 175, 55, 0.28);
  }

  .ceo-command-section-title {
    margin: 0;
    font-size: 20px;
    letter-spacing: -0.03em;
    color: rgba(248, 250, 252, 0.98);
  }

  .ceo-command-section-copy {
    margin: 4px 0 0;
    color: rgba(210, 198, 170, 0.72);
    line-height: 1.48;
    font-size: 12px;
  }

  .ceo-command-section-body {
    min-width: 0;
  }

  .ceo-command-hero {
    position: relative;
    overflow: hidden;
    border-radius: 18px;
    border: 1px solid rgba(212, 175, 55, 0.38);
    background:
      radial-gradient(circle at 22% 28%, rgba(212, 175, 55, 0.16), transparent 44%),
      radial-gradient(circle at 8% 0%, rgba(212, 175, 55, 0.1), transparent 38%),
      linear-gradient(145deg, rgba(2, 2, 3, 0.99), rgba(8, 7, 5, 0.98));
    box-shadow:
      inset 0 1px 0 rgba(243, 218, 138, 0.14),
      inset 0 0 0 1px rgba(212, 175, 55, 0.06),
      0 14px 40px rgba(0, 0, 0, 0.42);
    padding: 18px;
  }

  .ceo-command-hero-main {
    position: relative;
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(130px, 220px);
    gap: 14px;
    align-items: center;
    min-width: 0;
    padding: 4px 2px 4px 0;
  }

  .ceo-command-hero-copy {
    display: flex;
    flex-direction: column;
    gap: 12px;
    min-width: 0;
    position: relative;
    z-index: 1;
  }

  .ceo-lion-mark-wrap {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    max-width: 210px;
    margin-left: auto;
    pointer-events: none;
    z-index: 0;
    flex-shrink: 0;
  }

  .ceo-lion-mark-wrap::before {
    content: '';
    position: absolute;
    inset: -4%;
    border-radius: 999px;
    background: radial-gradient(circle, rgba(212, 175, 55, 0.16) 0%, transparent 72%);
    pointer-events: none;
  }

  .ceo-executive-command-page .ceo-lion-mark {
    position: relative;
    z-index: 1;
    width: 100%;
    max-width: 196px;
    height: auto;
    display: block;
    object-fit: contain;
    opacity: 1;
    filter: drop-shadow(0 0 24px rgba(212, 175, 55, 0.34));
  }

  .ceo-command-status-grid {
    position: relative;
    z-index: 1;
    display: grid;
    grid-template-columns: minmax(0, 1.55fr) minmax(210px, 0.72fr) minmax(210px, 0.72fr);
    gap: 12px;
    align-items: stretch;
  }


  .ceo-command-badge-row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0;
  }

  .ceo-command-badge {
    display: inline;
    min-height: 0;
    padding: 0;
    border: none;
    border-radius: 0;
    background: transparent;
    color: rgba(243, 218, 138, 0.58);
    font-size: 9px;
    font-weight: 550;
    letter-spacing: 0.14em;
    text-transform: uppercase;
  }

  .ceo-command-badge + .ceo-command-badge::before {
    content: '·';
    margin: 0 10px;
    color: rgba(212, 175, 55, 0.24);
    font-weight: 400;
    letter-spacing: 0;
  }

  .ceo-command-hero-title {
    margin: 0;
    font-size: clamp(28px, 3.2vw, 40px);
    line-height: 1.04;
    letter-spacing: -0.05em;
    color: rgba(248, 250, 252, 0.98);
  }

  .ceo-command-hero-title span {
    display: block;
    margin-top: 8px;
    font-size: clamp(14px, 1.5vw, 17px);
    color: rgba(220, 210, 188, 0.74);
    letter-spacing: -0.02em;
    line-height: 1.45;
    font-weight: 500;
  }

  .ceo-command-hero-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    align-items: center;
  }

  .ceo-gold-primary-action.button {
    border: 1px solid rgba(243, 218, 138, 0.62);
    color: #111827;
    background: linear-gradient(135deg, #f8e6a8 0%, #d4af37 46%, #9a7518 100%);
    box-shadow:
      0 12px 28px rgba(212, 175, 55, 0.32),
      inset 0 1px 0 rgba(255, 251, 234, 0.55);
  }

  .ceo-gold-primary-action.button:hover:not(:disabled) {
    filter: brightness(1.04);
    box-shadow:
      0 16px 34px rgba(212, 175, 55, 0.38),
      0 0 22px rgba(212, 175, 55, 0.14),
      inset 0 1px 0 rgba(255, 251, 234, 0.68);
  }

  .ceo-gold-secondary-action.button {
    border: 1px solid rgba(212, 175, 55, 0.42);
    color: rgba(248, 250, 252, 0.96);
    background: rgba(6, 6, 8, 0.88);
    box-shadow: inset 0 1px 0 rgba(212, 175, 55, 0.08);
  }

  .ceo-gold-secondary-action.button:hover:not(:disabled) {
    border-color: rgba(243, 218, 138, 0.58);
    background: rgba(12, 12, 16, 0.96);
  }

  .ceo-command-card {
    border-radius: 15px;
    border: 1px solid rgba(212, 175, 55, 0.12);
    background: linear-gradient(180deg, rgba(5, 5, 6, 0.98), rgba(2, 2, 3, 0.99));
    padding: 14px 14px 12px;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 8px;
    box-shadow: none;
    transition: border-color 160ms ease;
  }

  .ceo-command-card:hover {
    border-color: rgba(212, 175, 55, 0.22);
    box-shadow: none;
  }

  .ceo-command-card-kicker {
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.14em;
    color: rgba(243, 218, 138, 0.68);
    font-weight: 650;
    margin: 0;
  }

  .ceo-command-card h3 {
    margin: 0;
    font-size: 24px;
    letter-spacing: -0.04em;
    color: rgba(248, 250, 252, 0.98);
  }

  .ceo-command-card p {
    margin: 0;
    color: rgba(210, 200, 180, 0.72);
    line-height: 1.42;
    font-size: 12px;
  }

  .ceo-command-card strong {
    font-size: 15px;
    letter-spacing: -0.02em;
    color: rgba(248, 250, 252, 0.96);
  }

  .ceo-readiness-card {
    align-items: center;
    text-align: center;
    gap: 10px;
  }

  .ceo-readiness-ring-wrap {
    position: relative;
    width: 112px;
    height: 112px;
    margin: 2px auto 0;
  }

  .ceo-readiness-ring {
    width: 100%;
    height: 100%;
    transform: rotate(-90deg);
  }

  .ceo-readiness-ring-track {
    fill: none;
    stroke: rgba(212, 175, 55, 0.14);
    stroke-width: 7;
  }

  .ceo-readiness-ring-progress {
    fill: none;
    stroke-width: 7;
    stroke-linecap: round;
    transition: stroke-dashoffset 420ms ease;
  }

  .ceo-readiness-ring-center {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 2px;
    pointer-events: none;
  }

  .ceo-readiness-ring-center strong {
    font-size: 22px;
    letter-spacing: -0.04em;
    color: rgba(248, 250, 252, 0.98);
  }

  .ceo-readiness-ring-center span {
    font-size: 10px;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: rgba(243, 218, 138, 0.78);
    font-weight: 700;
  }

  .ceo-readiness-meta {
    width: 100%;
    font-size: 11px;
    color: rgba(210, 200, 180, 0.68);
    line-height: 1.5;
    margin: 0;
    padding-top: 4px;
    border-top: 1px solid rgba(212, 175, 55, 0.08);
  }

  .ceo-priorities-card {
    gap: 6px;
  }

  .ceo-priority-list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
  }

  .ceo-priority-item {
    display: flex;
    gap: 10px;
    align-items: flex-start;
    padding: 9px 0;
    border-bottom: 1px solid rgba(212, 175, 55, 0.07);
  }

  .ceo-priority-item:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }

  .ceo-priority-item:first-child {
    padding-top: 2px;
  }

  .ceo-priority-dot {
    flex: 0 0 auto;
    width: 5px;
    height: 5px;
    border-radius: 999px;
    background: rgba(212, 175, 55, 0.55);
    margin-top: 6px;
    box-shadow: 0 0 6px rgba(212, 175, 55, 0.28);
  }

  .ceo-priority-copy {
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .ceo-priority-title {
    font-size: 11px;
    font-weight: 650;
    letter-spacing: 0.02em;
    color: rgba(243, 218, 138, 0.86);
    line-height: 1.3;
  }

  .ceo-priority-value {
    font-size: 11px;
    color: rgba(210, 200, 180, 0.76);
    line-height: 1.42;
  }

  .ceo-priority-empty {
    margin: 0;
    font-size: 11px;
    color: rgba(210, 200, 180, 0.68);
    line-height: 1.42;
  }

  .ceo-decision-queue-grid,
  .ceo-intelligence-grid,
  .ceo-module-readiness-grid,
  .ceo-briefing-grid {
    display: grid;
    gap: 10px;
  }

  .ceo-decision-queue-grid,
  .ceo-intelligence-grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }

  .ceo-module-readiness-grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }

  .ceo-readiness-radar-row {
    margin-top: 10px;
  }

  .ceo-corporate-radar-card {
    gap: 12px;
  }

  .ceo-corporate-radar-copy {
    margin: 0;
    font-size: 12px;
    color: rgba(210, 198, 170, 0.68);
    line-height: 1.45;
  }

  .ceo-executive-command-page .executive-radar-panel.ceo-radar-premium {
    display: grid;
    grid-template-columns: minmax(280px, 46%) minmax(0, 54%);
    gap: 16px;
    align-items: center;
  }

  .ceo-radar-visual-wrap {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 300px;
    padding: 10px;
    border-radius: 18px;
    border: 1px solid rgba(212, 175, 55, 0.2);
    background:
      radial-gradient(circle at 50% 50%, rgba(212, 175, 55, 0.12), transparent 64%),
      linear-gradient(180deg, rgba(5, 5, 6, 0.72), rgba(2, 2, 3, 0.88));
    box-shadow: inset 0 0 36px rgba(212, 175, 55, 0.06);
  }

  .ceo-executive-command-page .ceo-radar-svg {
    width: 100%;
    max-width: 360px;
    min-height: 290px;
    height: auto;
    display: block;
  }

  .ceo-executive-command-page .executive-radar-outer-ring {
    fill: rgba(212, 175, 55, 0.05);
    stroke: rgba(212, 175, 55, 0.24);
    stroke-width: 1.1;
  }

  .ceo-executive-command-page .executive-radar-grid,
  .ceo-executive-command-page .executive-radar-axis {
    fill: none;
    stroke: rgba(212, 175, 55, 0.28);
    stroke-width: 1.1;
  }

  .ceo-executive-command-page .executive-radar-axis.is-missing {
    stroke: rgba(180, 170, 150, 0.24);
    stroke-dasharray: 4 4;
  }

  .ceo-executive-command-page .executive-radar-reference {
    fill: rgba(212, 175, 55, 0.06);
    stroke: rgba(212, 175, 55, 0.22);
    stroke-width: 1.1;
  }

  .ceo-executive-command-page .executive-radar-fill {
    stroke: rgba(252, 236, 180, 0.92);
    stroke-width: 2.6;
    stroke-linejoin: round;
    fill-opacity: 0.78;
  }

  .ceo-radar-legend-wrap {
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .ceo-radar-incomplete-note {
    margin: 0;
    padding: 0 0 8px;
    border: none;
    border-bottom: 1px solid rgba(212, 175, 55, 0.08);
    border-radius: 0;
    background: transparent;
    color: rgba(210, 200, 180, 0.68);
    font-size: 10px;
    line-height: 1.45;
  }

  .ceo-executive-command-page .ceo-radar-legend {
    display: flex;
    flex-direction: column;
    gap: 0;
  }

  .ceo-executive-command-page .ceo-radar-legend-item {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 16px;
    padding: 6px 0;
    border-radius: 0;
    border: none;
    border-bottom: none;
    background: transparent;
    color: inherit;
    text-decoration: none;
  }

  .ceo-executive-command-page .ceo-radar-legend-item + .ceo-radar-legend-item {
    border-top: 1px solid rgba(212, 175, 55, 0.05);
  }

  .ceo-executive-command-page .ceo-radar-legend-item:hover {
    background: transparent;
  }

  .ceo-executive-command-page .ceo-radar-legend-item.is-missing .ceo-radar-legend-values strong {
    color: rgba(190, 180, 160, 0.72);
  }

  .ceo-radar-legend-label {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-size: 11px;
    color: rgba(230, 222, 204, 0.86);
    min-width: 0;
  }

  .ceo-radar-swatch {
    flex: 0 0 auto;
    width: 6px;
    height: 6px;
    border-radius: 999px;
    box-shadow: none;
  }

  .ceo-radar-legend-values {
    display: inline-flex;
    align-items: baseline;
    gap: 8px;
    text-align: right;
    flex-shrink: 0;
  }

  .ceo-radar-legend-values strong {
    color: rgba(243, 218, 138, 0.9);
    font-size: 11px;
    font-weight: 650;
    letter-spacing: -0.01em;
  }

  .ceo-radar-legend-values small {
    color: rgba(190, 180, 160, 0.62);
    font-size: 9px;
    text-transform: capitalize;
    font-weight: 500;
  }

  .ceo-unified-context {
    margin: 4px 0 0;
    padding-top: 8px;
    border-top: 1px solid rgba(212, 175, 55, 0.1);
    font-size: 11px;
    color: rgba(203, 213, 225, 0.68);
    line-height: 1.45;
  }

  .ceo-executive-command-page .executive-readiness-card {
    border: none;
    background: transparent;
    padding: 0;
    box-shadow: none;
  }

  .ceo-briefing-grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }

  .ceo-workflow-grid {
    display: grid;
    grid-template-columns: repeat(5, minmax(0, 1fr));
    gap: 10px;
  }

  .ceo-workflow-step {
    border-radius: 14px;
    border: 1px solid rgba(212, 175, 55, 0.12);
    background: transparent;
    padding: 12px 12px 10px;
    min-width: 0;
    box-shadow: none;
  }

  .ceo-workflow-step .ceo-command-card-kicker {
    font-size: 9px;
    letter-spacing: 0.1em;
    color: rgba(243, 218, 138, 0.52);
    font-weight: 600;
  }

  .ceo-workflow-step strong {
    display: block;
    margin-top: 2px;
    font-size: 13px;
    color: rgba(248, 250, 252, 0.96);
  }

  .ceo-workflow-step p {
    margin: 6px 0 0;
    font-size: 11px;
    color: rgba(210, 198, 170, 0.64);
    line-height: 1.42;
  }

  .ceo-decision-card-priority {
    font-size: 9px;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: rgba(243, 218, 138, 0.52);
  }

  .ceo-decision-card-priority.is-high {
    color: rgba(252, 211, 77, 0.72);
  }

  .ceo-decision-card-priority.is-medium {
    color: rgba(243, 218, 138, 0.58);
  }

  .ceo-decision-card-priority.is-watch {
    color: rgba(210, 200, 180, 0.52);
  }

  .ceo-decision-card-status {
    margin-top: auto;
    padding-top: 8px;
    display: block;
    width: auto;
    border: none;
    border-radius: 0;
    background: transparent;
    color: rgba(210, 200, 180, 0.62);
    font-size: 10px;
    font-weight: 550;
    letter-spacing: 0.03em;
    text-transform: none;
  }

  .ceo-decision-card-status::before {
    display: none;
  }

  .ceo-module-posture {
    font-size: 9px;
    letter-spacing: 0.06em;
    text-transform: none;
    color: rgba(210, 200, 180, 0.58);
    font-weight: 550;
  }

  .ceo-module-score-row .ceo-module-posture {
    text-align: right;
    max-width: 48%;
    line-height: 1.35;
  }

  .ceo-module-score-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 8px;
  }

  .ceo-module-score-row strong {
    font-size: 20px;
    letter-spacing: -0.03em;
    color: rgba(248, 250, 252, 0.98);
  }

  .ceo-module-progress {
    height: 6px;
    border-radius: 999px;
    background: rgba(212, 175, 55, 0.1);
    overflow: hidden;
    margin-top: 2px;
  }

  .ceo-module-progress span {
    display: block;
    height: 100%;
    border-radius: inherit;
  }

  .ceo-truthfulness-banner {
    border: none;
    border-bottom: 1px solid rgba(212, 175, 55, 0.1);
    border-radius: 0;
    background: transparent;
    padding: 0 0 10px;
    font-size: 11px;
    color: rgba(210, 200, 180, 0.66);
    line-height: 1.45;
  }

  @media (max-width: 1180px) {
    .ceo-command-status-grid {
      grid-template-columns: 1fr;
    }

    .ceo-command-hero-main {
      grid-template-columns: minmax(0, 1fr) minmax(110px, 180px);
    }

    .ceo-lion-mark-wrap .ceo-lion-mark {
      max-width: 160px;
    }

    .ceo-decision-queue-grid,
    .ceo-intelligence-grid,
    .ceo-module-readiness-grid,
    .ceo-briefing-grid,
    .ceo-workflow-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .ceo-readiness-radar-row {
      margin-top: 8px;
    }

    .ceo-executive-command-page .executive-radar-panel.ceo-radar-premium {
      grid-template-columns: 1fr;
    }

    .ceo-radar-visual-wrap {
      min-height: 250px;
    }

    .ceo-executive-command-page .ceo-radar-legend {
      gap: 0;
    }
  }

  @media (max-width: 720px) {
    .ceo-command-hero-main {
      grid-template-columns: 1fr;
    }

    .ceo-lion-mark-wrap {
      max-width: 180px;
      margin: 0 auto;
      order: -1;
    }

    .ceo-lion-mark-wrap .ceo-lion-mark {
      max-width: 150px;
    }

    .ceo-decision-queue-grid,
    .ceo-intelligence-grid,
    .ceo-module-readiness-grid,
    .ceo-briefing-grid,
    .ceo-workflow-grid {
      grid-template-columns: 1fr;
    }
  }
`;

function progressWidth(score) {
  if (score === null || score === undefined || !Number.isFinite(Number(score))) {
    return 0;
  }

  return Math.max(0, Math.min(100, Math.round(Number(score))));
}

function formatPostureLabel(posture) {
  const safe = String(posture || '').trim().toLowerCase();

  if (!safe || safe === 'insufficient_data' || safe === 'not_available') {
    return 'Pending inputs';
  }

  return safe.replace(/_/g, ' ');
}

function buildUnifiedReadinessNote({
  unifiedReadinessScore,
  maValuationSignal,
  maOverview,
  legalHealthRadar,
  complianceDragPenalty
}) {
  const maScore = normalizeScoreOrNull(maValuationSignal ?? maOverview?.score);
  const legalScore = normalizeScoreOrNull(legalHealthRadar);
  const hasIncompleteInputs =
    unifiedReadinessScore === null || maScore === null || legalScore === null;

  let note =
    'Unified readiness is shown separately from the Executive Readiness Index.';

  if (hasIncompleteInputs) {
    return `${note} Some branch inputs remain incomplete.`;
  }

  note += ` Current unified blend: ${formatModuleScoreDisplay(unifiedReadinessScore)}.`;

  if (complianceDragPenalty != null && Number.isFinite(Number(complianceDragPenalty))) {
    note += ` Compliance drag signal: ${complianceDragPenalty} pts.`;
  }

  return note;
}

function mapQueueStatus(posture, { actionRequired = false, opportunity = false } = {}) {
  if (posture === 'insufficient_data' || posture === 'not_available') {
    return 'Pending inputs';
  }

  if (actionRequired) {
    return 'Action required';
  }

  if (opportunity) {
    return 'Opportunity';
  }

  return 'Review';
}

function buildDecisionQueueCards({
  complianceOverview,
  riskOverview,
  fundingOverview,
  maOverview,
  commandDecisionQueue
}) {
  const fromApi = (moduleKey) =>
    commandDecisionQueue.find((item) => String(item?.module || '').toLowerCase().includes(moduleKey));

  const complianceApi = fromApi('compliance');
  const riskApi = fromApi('risk');
  const fundingApi = fromApi('funding');
  const maApi = fromApi('ma') || fromApi('m&a');

  return [
    {
      title: 'Compliance Exposure',
      priority: complianceOverview.openAlerts > 0 ? 'High' : 'Medium',
      summary:
        complianceApi?.recommendedAction ||
        (complianceOverview.openAlerts > 0
          ? `${complianceOverview.openAlerts} open alerts require executive review.`
          : complianceOverview.posture === 'insufficient_data'
            ? 'Insufficient persisted compliance inputs.'
            : 'Compliance posture available for review.'),
      status:
        complianceApi?.status ||
        mapQueueStatus(complianceOverview.posture, {
          actionRequired: complianceOverview.openAlerts > 0
        })
    },
    {
      title: 'Risk Radar Alert',
      priority:
        riskOverview.posture === 'executive_attention' || (riskOverview.activeRecordsCount || 0) > 0
          ? 'High'
          : 'Medium',
      summary:
        riskApi?.recommendedAction ||
        riskOverview.latestTitle ||
        (riskOverview.posture === 'insufficient_data'
          ? 'Risk register data pending for executive signal.'
          : 'Risk posture available for human review.'),
      status:
        riskApi?.status ||
        mapQueueStatus(riskOverview.posture, {
          actionRequired: (riskOverview.activeRecordsCount || 0) > 0
        })
    },
    {
      title: 'Funding Window',
      priority: fundingOverview.requiresExecutiveUpdate ? 'High' : 'Medium',
      summary:
        fundingApi?.recommendedAction ||
        (fundingOverview.executiveSignalEligible
          ? `Funding window: ${fundingOverview.fundingWindowStatus}. Runway signal requires review.`
          : 'Funding inputs pending for executive readiness signal.'),
      status:
        fundingApi?.status ||
        mapQueueStatus(fundingOverview.posture, {
          actionRequired: Boolean(fundingOverview.requiresExecutiveUpdate)
        })
    },
    {
      title: 'M&A Opportunity Update',
      priority: maOverview.executiveSignalEligible ? 'Medium' : 'Watch',
      summary:
        maApi?.recommendedAction ||
        maOverview.targetName ||
        (maOverview.posture === 'insufficient_data'
          ? 'No persisted deal or case eligible for executive scoring.'
          : 'M&A posture available for executive review.'),
      status:
        maApi?.status ||
        mapQueueStatus(maOverview.posture, {
          opportunity: maOverview.executiveSignalEligible
        })
    }
  ];
}

function buildIntelligenceCards({
  executiveSignal,
  complianceOverview,
  fundingOverview,
  maOverview,
  commandAlerts,
  lastReportPrepared
}) {
  const criticalAlert = commandAlerts[0];
  const highestImpact =
    criticalAlert?.title ||
    (complianceOverview.openAlerts > 0
      ? `Compliance exposure (${complianceOverview.openAlerts} alerts)`
      : executiveSignal.title || 'Pending executive signal');

  const bestOpportunity =
    maOverview.executiveSignalEligible && maOverview.targetName
      ? `${maOverview.targetName} · ${maOverview.posture}`
      : fundingOverview.executiveSignalEligible
        ? `Funding readiness signal · ${fundingOverview.posture}`
        : 'Pending inputs';

  const focusArea =
    complianceOverview.posture === 'insufficient_data'
      ? 'Compliance inputs'
      : riskOverviewPostureLabel(complianceOverview, fundingOverview, maOverview);

  return [
    {
      title: 'Highest Impact',
      summary: highestImpact,
      status: criticalAlert?.severity ? 'Action required' : 'Review'
    },
    {
      title: 'Best Opportunity',
      summary: bestOpportunity,
      status: maOverview.executiveSignalEligible || fundingOverview.executiveSignalEligible
        ? 'Opportunity'
        : 'Pending inputs'
    },
    {
      title: 'Focus Area',
      summary: focusArea,
      status: 'Review'
    },
    {
      title: 'Board Review Draft',
      summary: lastReportPrepared
        ? 'Board review draft prepared for executive review.'
        : 'Draft assembly pending supporting inputs.',
      status: lastReportPrepared ? 'Prepared' : 'Draft'
    }
  ];
}

function riskOverviewPostureLabel(complianceOverview, fundingOverview, maOverview) {
  if (complianceOverview.openAlerts > 0) {
    return 'Compliance exposure and evidence gaps';
  }

  if (fundingOverview.requiresExecutiveUpdate) {
    return 'Funding window and runway review';
  }

  if (maOverview.posture && maOverview.posture !== 'insufficient_data') {
    return `M&A posture · ${maOverview.posture}`;
  }

  return 'Cross-module executive review';
}

function buildModuleReadinessCards({
  maOverview,
  fundingOverview,
  complianceOverview,
  riskOverview,
  pmiOverview,
  governanceOverview,
  strategyOverview
}) {
  return [
    { key: 'ma', label: 'M&A', overview: maOverview, tone: '#10b981', route: '/ma/dashboard' },
    {
      key: 'funding',
      label: 'Funding',
      overview: fundingOverview,
      tone: '#f59e0b',
      route: '/funding/dashboard'
    },
    {
      key: 'compliance',
      label: 'Compliance',
      overview: complianceOverview,
      tone: '#3b82f6',
      route: '/compliance/dashboard'
    },
    { key: 'risk', label: 'Risk', overview: riskOverview, tone: '#ef4444', route: '/risk/dashboard' },
    { key: 'pmi', label: 'PMI / Synergies', overview: pmiOverview, tone: '#a855f7', route: '/pmi/dashboard' },
    {
      key: 'governance',
      label: 'Governance',
      overview: governanceOverview,
      tone: '#0ea5e9',
      route: '/governance/dashboard'
    },
    {
      key: 'strategy',
      label: 'Strategy',
      overview: strategyOverview,
      tone: '#38bdf8',
      route: '/strategy/dashboard'
    }
  ];
}

function ReadinessRing({ score, label, sublabel = 'Executive readiness' }) {
  const hasScore = Number.isFinite(Number(score));
  const pct = hasScore ? progressWidth(score) : 0;
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (pct / 100) * circumference;
  const ringGradientId = `ceoReadinessGold-${sublabel.replace(/\s+/g, '-').toLowerCase()}`;

  return (
    <div className="ceo-readiness-ring-wrap">
      <svg className="ceo-readiness-ring" viewBox="0 0 96 96" aria-hidden="true">
        <defs>
          <linearGradient id={ringGradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f3da8a" />
            <stop offset="52%" stopColor="#d4af37" />
            <stop offset="100%" stopColor="#9a7518" />
          </linearGradient>
        </defs>
        <circle className="ceo-readiness-ring-track" cx="48" cy="48" r={radius} />
        <circle
          className="ceo-readiness-ring-progress"
          cx="48"
          cy="48"
          r={radius}
          stroke={`url(#${ringGradientId})`}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="ceo-readiness-ring-center">
        <strong>{label}</strong>
        <span>{sublabel}</span>
      </div>
    </div>
  );
}

function formatConfidenceDisplay(confidence) {
  const value = Number(confidence);
  if (!Number.isFinite(value)) {
    return 'N/A';
  }

  return `${Math.round(value)}%`;
}

function ExecutiveReadinessHeroCard({ readiness }) {
  const executiveScore = normalizeScoreOrNull(readiness?.score);
  const scoreLabel = formatModuleScoreDisplay(executiveScore);
  const missingBranches = (readiness?.missingData || []).filter(Boolean);

  return (
    <article className="ceo-command-card ceo-readiness-card">
      <div className="ceo-command-card-kicker">Executive Readiness Index</div>
      <ReadinessRing
        score={executiveScore}
        label={scoreLabel}
        sublabel="Executive readiness"
      />
      <p className="ceo-readiness-meta">
        Confidence {formatConfidenceDisplay(readiness?.confidence)}
        {missingBranches.length ? ` · Missing data: ${missingBranches.join(', ')}` : ''}
        · Trend {readiness?.trend || 'stable'} · Human review required.
      </p>
    </article>
  );
}

function SectionBlock({ number, title, description, children }) {
  return (
    <section className="ceo-command-section">
      <div className="ceo-command-section-shell">
        <div className="ceo-command-section-header">
          <div className="ceo-command-number">{number}</div>
          <div>
            <h2 className="ceo-command-section-title">{title}</h2>
            <p className="ceo-command-section-copy">{description}</p>
          </div>
        </div>
        <div className="ceo-command-section-body">{children}</div>
      </div>
    </section>
  );
}

export function ExecutiveCommandCenterView({
  executiveSignal,
  commandReadiness,
  commandRadarAxes = [],
  dealReadinessCombined,
  complianceDragPenalty,
  legalHealthRadar,
  maValuationSignal,
  commandDecisionQueue,
  commandAlerts,
  maOverview,
  complianceOverview,
  fundingOverview,
  pmiOverview,
  governanceOverview,
  riskOverview,
  strategyOverview,
  executivePriorityRows,
  lastReportGeneratedAt,
  canGenerateBoardPack,
  boardPackLoading,
  onGenerateBoardPack,
  onViewExecutiveBriefing
}) {
  const unifiedReadinessScore = normalizeScoreOrNull(dealReadinessCombined);

  const decisionQueueCards = buildDecisionQueueCards({
    complianceOverview,
    riskOverview,
    fundingOverview,
    maOverview,
    commandDecisionQueue
  });

  const intelligenceCards = buildIntelligenceCards({
    executiveSignal,
    complianceOverview,
    fundingOverview,
    maOverview,
    commandAlerts,
    lastReportPrepared: Boolean(lastReportGeneratedAt)
  });

  const moduleCards = buildModuleReadinessCards({
    maOverview,
    fundingOverview,
    complianceOverview,
    riskOverview,
    pmiOverview,
    governanceOverview,
    strategyOverview
  });

  const topPriorities = executivePriorityRows.slice(0, 3);
  const unifiedReadinessNote = buildUnifiedReadinessNote({
    unifiedReadinessScore,
    maValuationSignal,
    maOverview,
    legalHealthRadar,
    complianceDragPenalty
  });

  return (
    <>
      <style>{commandCenterCss}</style>

      <div className="ceo-executive-command-page" data-testid="ceo-command-center-enterprise">
        <div className="ceo-truthfulness-banner">
          Decision-support only · Human review required · Board review draft (not board-approved) · Not
          legal or investment advice.
        </div>

        <SectionBlock
          number="01"
          title="Executive Status"
          description="Operational posture, decision readiness and top executive priorities."
        >
          <div className="ceo-command-hero">
            <div className="ceo-command-status-grid">
              <div className="ceo-command-hero-main">
                <div className="ceo-command-hero-copy">
                  <div className="ceo-command-badge-row">
                    <span className="ceo-command-badge">Executive Command Center</span>
                    <span className="ceo-command-badge">Decision support</span>
                    <span className="ceo-command-badge">Human review required</span>
                  </div>

                  <h1 className="ceo-command-hero-title">
                    Operational with priority reviews.
                    <span>
                      Critical systems are active. Priority items require executive review.
                    </span>
                  </h1>

                  <div className="ceo-command-hero-actions">
                    <Button
                      onClick={onGenerateBoardPack}
                      loading={boardPackLoading}
                      disabled={!canGenerateBoardPack}
                      className="ceo-gold-primary-action"
                    >
                      <FileText size={16} />
                      Generate Board Review Draft
                    </Button>
                    <Button
                      onClick={onViewExecutiveBriefing}
                      variant="secondary"
                      className="ceo-gold-secondary-action"
                    >
                      View Executive Briefing
                    </Button>
                  </div>
                </div>

                <div className="ceo-lion-mark-wrap" aria-hidden="true">
                  <img
                    className="ceo-lion-mark"
                    src={CEO_LION_MARK_SRC}
                    alt=""
                    width={196}
                    height={196}
                    decoding="async"
                  />
                </div>
              </div>

              <ExecutiveReadinessHeroCard readiness={commandReadiness} />

              <article className="ceo-command-card ceo-priorities-card">
                <div className="ceo-command-card-kicker">Top priorities</div>
                {topPriorities.length ? (
                  <ul className="ceo-priority-list">
                    {topPriorities.map((row) => (
                      <li key={row.label} className="ceo-priority-item">
                        <span className="ceo-priority-dot" aria-hidden="true" />
                        <div className="ceo-priority-copy">
                          <span className="ceo-priority-title">{row.label}</span>
                          <span className="ceo-priority-value">{row.value}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="ceo-priority-empty">No priority rows available · Pending inputs.</p>
                )}
              </article>
            </div>
          </div>
        </SectionBlock>

        <SectionBlock
          number="02"
          title="Executive Decision Queue"
          description="Priority decisions across compliance, risk, funding and M&A."
        >
          <div className="ceo-decision-queue-grid">
            {decisionQueueCards.map((card) => (
              <article key={card.title} className="ceo-command-card">
                <div
                  className={`ceo-decision-card-priority is-${String(card.priority || 'medium').toLowerCase()}`}
                >
                  {card.priority}
                </div>
                <strong>{card.title}</strong>
                <p>{card.summary}</p>
                <span className="ceo-decision-card-status">{card.status}</span>
              </article>
            ))}
          </div>
        </SectionBlock>

        <SectionBlock
          number="03"
          title="Cross-Module Intelligence Summary"
          description="Highest-impact signals and review focus across branches."
        >
          <div className="ceo-intelligence-grid">
            {intelligenceCards.map((card) => (
              <article key={card.title} className="ceo-command-card">
                <div className="ceo-command-card-kicker">{card.title}</div>
                <p>{card.summary}</p>
                <span className="ceo-decision-card-status">{card.status}</span>
              </article>
            ))}
          </div>
        </SectionBlock>

        <SectionBlock
          number="04"
          title="Module Readiness Overview"
          description="Branch readiness scores from existing DSS signals. Missing data remains N/A."
        >
          <div className="ceo-module-readiness-grid">
            {moduleCards.map((module) => (
              <Link
                key={module.key}
                to={module.route}
                className="ceo-command-card"
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <div className="ceo-command-card-kicker">{module.label}</div>
                <div className="ceo-module-score-row">
                  <strong>{formatModuleScoreDisplay(module.overview.score)}</strong>
                  <span className="ceo-module-posture">
                    {formatPostureLabel(module.overview.posture)}
                  </span>
                </div>
                <div className="ceo-module-progress">
                  <span
                    style={{
                      width: `${progressWidth(module.overview.score)}%`,
                      background: module.tone
                    }}
                  />
                </div>
                <p>{formatScoreLabel(module.overview.score)} · DSS signal</p>
              </Link>
            ))}
          </div>

          <div className="ceo-readiness-radar-row">
            <article className="ceo-command-card ceo-corporate-radar-card">
              <div className="ceo-command-card-kicker">Corporate Health Radar</div>
              <strong>Enterprise readiness radar</strong>
              <p className="ceo-corporate-radar-copy">
                Cross-branch posture across deal, funding, compliance, risk and governance signals.
              </p>
              <CorporateHealthRadar axes={commandRadarAxes} />
              <p className="ceo-unified-context">{unifiedReadinessNote}</p>
            </article>
          </div>
        </SectionBlock>

        <SectionBlock
          number="05"
          title="Board Review Workflow"
          description="Draft-first workflow. Human review required before any distribution."
        >
          <div className="ceo-workflow-grid">
            <article className="ceo-workflow-step">
              <div className="ceo-command-card-kicker">Step 1</div>
              <strong>Create Draft</strong>
              <p>Generate board review draft from current executive signals.</p>
            </article>
            <article className="ceo-workflow-step">
              <div className="ceo-command-card-kicker">Step 2</div>
              <strong>Review Signals</strong>
              <p>Validate compliance, risk, funding and M&A posture.</p>
            </article>
            <article className="ceo-workflow-step">
              <div className="ceo-command-card-kicker">Step 3</div>
              <strong>Executive Data Room</strong>
              <p>Confirm supporting data and unresolved dependencies.</p>
            </article>
            <article className="ceo-workflow-step">
              <div className="ceo-command-card-kicker">Step 4</div>
              <strong>Board Review Draft</strong>
              <p>Prepare review context for executive discussion.</p>
            </article>
            <article className="ceo-workflow-step">
              <div className="ceo-command-card-kicker">Step 5</div>
              <strong>Human Review</strong>
              <p>Share only after explicit user approval and review.</p>
            </article>
          </div>
        </SectionBlock>

        <SectionBlock
          number="06"
          title="Executive Briefing Packs"
          description="Draft review packs prepared for executive review — not certified outputs."
        >
          <div className="ceo-briefing-grid">
            <article className="ceo-command-card">
              <strong>Board review draft</strong>
              <p>Status: {lastReportGeneratedAt ? 'Prepared' : 'Draft'}</p>
            </article>
            <article className="ceo-command-card">
              <strong>Compliance review</strong>
              <p>
                Status:{' '}
                {complianceOverview.openAlerts > 0
                  ? 'In review'
                  : complianceOverview.posture === 'insufficient_data'
                    ? 'Pending inputs'
                    : 'Prepared'}
              </p>
            </article>
            <article className="ceo-command-card">
              <strong>Strategic review</strong>
              <p>
                Status:{' '}
                {strategyOverview.posture === 'insufficient_data' ? 'Pending inputs' : 'In review'}
              </p>
            </article>
            <article className="ceo-command-card">
              <strong>Funding review</strong>
              <p>
                Status:{' '}
                {fundingOverview.executiveSignalEligible ? 'Prepared' : 'Pending inputs'}
              </p>
            </article>
          </div>
        </SectionBlock>
      </div>
    </>
  );
}

export default ExecutiveCommandCenterView;
