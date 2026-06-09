import React from 'react';
import { Link } from 'react-router-dom';
import {
  BarChart3,
  Briefcase,
  Coins,
  Database,
  FileText,
  LineChart,
  PenLine,
  ScanSearch,
  ScrollText,
  Shield,
  Sparkles,
  Target,
  TriangleAlert,
  UserCheck,
  Zap
} from 'lucide-react';
import { Button } from '../../../shared/components/ui/Button.jsx';
import { CorporateHealthRadar } from './CorporateHealthRadar.jsx';
import '../styles/ceoMaterialSystem.css';
import {
  buildExecutiveBoardReadinessSummary,
  buildExecutiveInputBlockers,
  buildExecutiveLiveDecisionQueueItems,
  buildExecutiveRecommendedActions,
  formatModuleScoreDisplay,
  formatScoreLabel,
  normalizeScoreOrNull
} from '../utils/ceoOverviewTruthfulness.js';
import { getCeoBranchAccentHex } from '../utils/ceoBranchAccents.js';

const CEO_LION_MARK_SRC = '/brand/ceos-lion-mark.png';

const DECISION_QUEUE_ICONS = {
  'Compliance Exposure': Shield,
  'Risk Radar Alert': TriangleAlert,
  'Funding Window': LineChart,
  'M&A Opportunity Update': Briefcase
};

const INTELLIGENCE_ICONS = {
  'Highest Impact': Zap,
  'Best Opportunity': Sparkles,
  'Focus Area': Target,
  'Board Review Draft': FileText
};

const WORKFLOW_STEPS = [
  {
    eyebrow: 'Step 1',
    title: 'Create Draft',
    copy: 'Generate board review draft from current executive signals.',
    icon: PenLine
  },
  {
    eyebrow: 'Step 2',
    title: 'Review Signals',
    copy: 'Validate compliance, risk, funding and M&A posture.',
    icon: ScanSearch
  },
  {
    eyebrow: 'Step 3',
    title: 'Executive Data Room',
    copy: 'Confirm supporting data and unresolved dependencies.',
    icon: Database
  },
  {
    eyebrow: 'Step 4',
    title: 'Board Review Draft',
    copy: 'Prepare review context for executive discussion.',
    icon: ScrollText
  },
  {
    eyebrow: 'Step 5',
    title: 'Human Review',
    copy: 'Share only after explicit user approval and review.',
    icon: UserCheck
  }
];

function CeoGoldCardIcon({ icon: Icon }) {
  if (!Icon) {
    return null;
  }

  return (
    <span className="ceo-gold-card-icon" aria-hidden="true">
      <Icon size={14} strokeWidth={1.65} />
    </span>
  );
}

const commandCenterCss = `
  .ceo-executive-command-page {
    --ceo-gold: #d4af37;
    --ceo-gold-soft: #f3da8a;
    --ceo-gold-deep: #8a6a16;
    --ceo-gold-border: rgba(212, 175, 55, 0.14);
    --ceo-gold-border-strong: rgba(245, 197, 92, 0.16);
    --ceo-gold-glow: rgba(245, 197, 92, 0.08);
    --ceo-gold-glow-soft: rgba(212, 175, 55, 0.12);
    --ceo-black: #050505;
    --ceo-graphite: #070707;
    --ceo-charcoal: rgba(10, 9, 8, 0.96);
    --ceo-charcoal-panel: rgba(12, 11, 9, 0.94);
    --ceo-card-inner: rgba(14, 13, 12, 0.82);
    --ceo-card-inner-alt: rgba(16, 15, 13, 0.78);
    --ceo-text-primary: #f8f3e7;
    --ceo-text-secondary: rgba(248, 243, 231, 0.72);
    --ceo-text-muted: rgba(248, 243, 231, 0.52);
    --ceo-line: rgba(212, 175, 55, 0.1);
    width: min(1480px, 100%);
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 26px;
    color: rgba(248, 243, 231, 0.96);
  }

  .ceo-command-section {
    display: flex;
    flex-direction: column;
    min-width: 0;
  }

  .ceo-command-section-shell {
    border-radius: 24px;
    border: 1px solid var(--ceo-gold-border);
    background:
      radial-gradient(ellipse 80% 60% at 50% 0%, rgba(245, 197, 92, 0.1), transparent 55%),
      radial-gradient(circle at 100% 100%, rgba(18, 16, 12, 0.42), transparent 48%),
      linear-gradient(180deg, var(--ceo-charcoal), rgba(5, 5, 5, 0.98));
    box-shadow:
      0 24px 56px rgba(0, 0, 0, 0.52),
      inset 0 1px 0 rgba(245, 197, 92, 0.12);
    padding: 22px 22px 20px;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .ceo-command-section-header {
    display: flex;
    align-items: flex-start;
    gap: 16px;
    padding-bottom: 4px;
    border-bottom: none;
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
    font-size: 22px;
    font-weight: 700;
    letter-spacing: -0.03em;
    color: var(--ceo-text-primary);
  }

  .ceo-command-section-copy {
    margin: 6px 0 0;
    color: var(--ceo-text-secondary);
    line-height: 1.55;
    font-size: 13px;
  }

  .ceo-command-section-body {
    min-width: 0;
  }

  .ceo-command-hero {
    position: relative;
    overflow: hidden;
    border-radius: 20px;
    border: 1px solid rgba(212, 175, 55, 0.1);
    background:
      radial-gradient(ellipse 55% 70% at 82% 38%, rgba(212, 175, 55, 0.09), transparent 58%),
      radial-gradient(ellipse 40% 50% at 12% 20%, rgba(212, 175, 55, 0.05), transparent 52%),
      linear-gradient(155deg, rgba(4, 4, 4, 0.99), rgba(8, 7, 6, 0.98) 48%, rgba(5, 5, 5, 0.99));
    box-shadow:
      inset 0 1px 0 rgba(243, 218, 138, 0.05),
      0 18px 48px rgba(0, 0, 0, 0.48);
    padding: 24px 22px 22px;
  }

  .ceo-command-hero::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(
      ellipse 48% 62% at 84% 36%,
      rgba(212, 175, 55, 0.08) 0%,
      rgba(7, 6, 5, 0.45) 38%,
      transparent 68%
    );
    pointer-events: none;
    z-index: 0;
  }

  .ceo-command-hero::after {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse 90% 85% at 50% 50%, transparent 42%, rgba(0, 0, 0, 0.42) 100%);
    pointer-events: none;
    z-index: 0;
  }

  .ceo-command-hero-main {
    position: relative;
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(168px, 290px);
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
    max-width: 300px;
    margin-left: auto;
    pointer-events: none;
    z-index: 1;
    flex-shrink: 0;
    background: transparent;
    overflow: visible;
  }

  .ceo-lion-mark-wrap::before {
    content: '';
    position: absolute;
    inset: -18% -12%;
    background: radial-gradient(
      circle at 50% 44%,
      rgba(212, 175, 55, 0.16) 0%,
      rgba(212, 175, 55, 0.06) 32%,
      rgba(5, 5, 5, 0.2) 58%,
      transparent 72%
    );
    z-index: 0;
    filter: blur(2px);
  }

  .ceo-executive-command-page .ceo-lion-mark {
    position: relative;
    z-index: 1;
    width: 100%;
    max-width: 276px;
    height: auto;
    display: block;
    object-fit: contain;
    opacity: 0.96;
    mix-blend-mode: screen;
    filter:
      drop-shadow(0 0 32px rgba(212, 175, 55, 0.24))
      drop-shadow(0 0 64px rgba(212, 175, 55, 0.08))
      drop-shadow(0 12px 28px rgba(0, 0, 0, 0.38));
    -webkit-mask-image: radial-gradient(ellipse 88% 88% at 50% 48%, #000 58%, transparent 100%);
    mask-image: radial-gradient(ellipse 88% 88% at 50% 48%, #000 58%, transparent 100%);
  }

  .ceo-command-status-grid {
    position: relative;
    z-index: 1;
    display: grid;
    grid-template-columns: minmax(0, 1.55fr) minmax(210px, 0.72fr) minmax(210px, 0.72fr);
    gap: 0;
    align-items: stretch;
    margin-top: 20px;
    padding-top: 20px;
    border-top: 1px solid rgba(212, 175, 55, 0.05);
  }

  .ceo-command-hero .ceo-command-card {
    border: none;
    border-radius: 0;
    background: transparent;
    box-shadow: none;
    padding: 0 18px;
  }

  .ceo-command-hero .ceo-readiness-card {
    border-left: none;
    border-right: none;
    box-shadow: inset 1px 0 0 rgba(212, 175, 55, 0.05), inset -1px 0 0 rgba(212, 175, 55, 0.05);
  }

  .ceo-command-hero .ceo-priorities-card {
    padding-right: 2px;
  }

  .ceo-command-hero .ceo-command-card:hover {
    border-color: transparent;
    box-shadow: none;
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
    color: rgba(243, 218, 138, 0.74);
    font-size: 10px;
    font-weight: 550;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    line-height: 1.4;
  }

  .ceo-command-badge-row .ceo-command-badge:first-child::before {
    content: '';
    display: inline-block;
    width: 4px;
    height: 4px;
    margin-right: 8px;
    border-radius: 999px;
    background: rgba(243, 218, 138, 0.58);
    box-shadow: 0 0 6px rgba(212, 175, 55, 0.28);
    vertical-align: middle;
    transform: translateY(-1px);
  }

  .ceo-command-badge + .ceo-command-badge::before {
    content: '·';
    margin: 0 10px;
    color: rgba(212, 175, 55, 0.34);
    font-weight: 400;
    letter-spacing: 0;
  }

  .ceo-command-hero-title {
    margin: 0;
    font-size: clamp(28px, 3.2vw, 40px);
    line-height: 1.04;
    letter-spacing: -0.05em;
    color: var(--ceo-text-primary);
  }

  .ceo-command-hero-title span {
    display: block;
    margin-top: 10px;
    font-size: clamp(15px, 1.6vw, 18px);
    color: var(--ceo-text-secondary);
    letter-spacing: -0.015em;
    line-height: 1.5;
    font-weight: 450;
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
    border: 1px solid rgba(245, 197, 92, 0.48);
    color: var(--ceo-text-primary);
    background: rgba(9, 8, 6, 0.88);
    box-shadow: inset 0 1px 0 rgba(212, 175, 55, 0.08);
  }

  .ceo-gold-secondary-action.button:hover:not(:disabled) {
    border-color: rgba(243, 218, 138, 0.58);
    background: rgba(16, 14, 11, 0.96);
    box-shadow:
      inset 0 1px 0 rgba(243, 218, 138, 0.1),
      0 0 16px rgba(212, 175, 55, 0.07);
  }

  .ceo-command-card {
    border-radius: 12px;
    border: 1px solid rgba(212, 175, 55, 0.08);
    background: rgba(10, 9, 7, 0.28);
    padding: 14px 14px 12px;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 8px;
    box-shadow: none;
    transition: border-color 160ms ease;
  }

  .ceo-command-card:hover {
    border-color: rgba(212, 175, 55, 0.14);
    box-shadow: none;
  }

  .ceo-decision-queue-grid .ceo-command-card,
  .ceo-intelligence-grid .ceo-command-card {
    border: none;
    border-bottom: none;
    border-radius: 0;
    background: transparent;
    box-shadow: none;
    padding: 14px 4px 16px;
    gap: 8px;
  }

  .ceo-decision-queue-grid .ceo-command-card + .ceo-command-card,
  .ceo-intelligence-grid .ceo-command-card + .ceo-command-card {
    box-shadow: inset 0 1px 0 rgba(212, 175, 55, 0.04);
  }

  .ceo-decision-queue-grid .ceo-command-card:last-child,
  .ceo-intelligence-grid .ceo-command-card:last-child {
    border-bottom: none;
  }

  .ceo-module-readiness-grid .ceo-command-card {
    position: relative;
    overflow: hidden;
    border: none;
    border-bottom: none;
    border-radius: 0;
    background: transparent;
    box-shadow: none;
    padding: 18px 12px 18px 14px;
    gap: 10px;
    transition:
      background 160ms ease,
      opacity 160ms ease;
  }

  .ceo-module-readiness-block {
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 18px 16px 16px;
    border-radius: 20px;
    border: 1px solid rgba(245, 197, 92, 0.22);
    background:
      radial-gradient(ellipse 92% 58% at 50% 0%, rgba(245, 197, 92, 0.1), transparent 58%),
      linear-gradient(180deg, #0b0a09 0%, #060606 52%, #040404 100%);
    box-shadow:
      inset 0 1px 0 rgba(245, 197, 92, 0.14),
      0 0 40px rgba(245, 197, 92, 0.08);
  }

  .ceo-gold-card-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex: 0 0 auto;
    width: auto;
    height: auto;
    padding: 0;
    border: none;
    border-radius: 0;
    background: transparent;
    box-shadow: none;
    color: rgba(245, 197, 92, 0.78);
  }

  .ceo-card-title-row,
  .ceo-card-kicker-row,
  .ceo-workflow-step-head {
    background: transparent;
    border: none;
    box-shadow: none;
  }

  .ceo-card-title-row,
  .ceo-card-kicker-row {
    display: flex;
    align-items: center;
    gap: 8px;
    min-width: 0;
  }

  .ceo-card-title-row strong {
    min-width: 0;
  }

  .ceo-workflow-step-head {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 6px;
  }

  .ceo-module-readiness-grid .ceo-command-card::before {
    content: '';
    position: absolute;
    inset: 8px auto 8px 0;
    width: 3px;
    border-radius: 999px;
    background: var(--branch-tone, var(--ceo-gold));
    box-shadow: 0 0 20px var(--branch-tone, rgba(212, 175, 55, 0.4));
    opacity: 0.96;
  }

  .ceo-module-readiness-grid .ceo-command-card::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(90deg, var(--branch-wash, rgba(212, 175, 55, 0.08)), transparent 68%);
    opacity: 0.5;
    pointer-events: none;
  }

  .ceo-module-readiness-grid .ceo-command-card > * {
    position: relative;
    z-index: 1;
  }

  .ceo-module-readiness-grid .ceo-command-card + .ceo-command-card {
    box-shadow: inset 0 1px 0 rgba(212, 175, 55, 0.04);
  }

  .ceo-module-readiness-grid .ceo-command-card:hover {
    background: rgba(255, 255, 255, 0.018);
    opacity: 0.92;
  }

  .ceo-module-readiness-grid .ceo-command-card:last-child {
    border-bottom: none;
  }

  .ceo-briefing-grid .ceo-command-card {
    border: none;
    border-bottom: none;
    border-radius: 14px;
    background: rgba(8, 7, 6, 0.32);
    box-shadow: inset 0 1px 0 rgba(212, 175, 55, 0.04);
    padding: 18px 16px 16px;
    transition:
      background 180ms ease,
      box-shadow 180ms ease,
      transform 180ms ease;
  }

  .ceo-briefing-grid .ceo-command-card:hover {
    background: rgba(12, 11, 9, 0.48);
    box-shadow:
      inset 0 1px 0 rgba(212, 175, 55, 0.08),
      0 8px 24px rgba(0, 0, 0, 0.28);
    transform: translateY(-1px);
  }

  .ceo-briefing-grid .ceo-command-card:last-child {
    border-bottom: none;
  }

  .ceo-command-card-kicker {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: rgba(243, 218, 138, 0.62);
    font-weight: 600;
    margin: 0;
    line-height: 1.4;
  }

  .ceo-module-branch-dot {
    flex: 0 0 auto;
    width: 11px;
    height: 11px;
    border-radius: 999px;
    box-shadow: 0 0 18px currentColor, 0 0 6px currentColor;
  }

  .ceo-command-card h3 {
    margin: 0;
    font-size: 24px;
    letter-spacing: -0.04em;
    color: var(--ceo-text-primary);
  }

  .ceo-command-card p {
    margin: 0;
    color: var(--ceo-text-secondary);
    line-height: 1.55;
    font-size: 14px;
  }

  .ceo-command-card strong {
    font-size: 16px;
    font-weight: 650;
    letter-spacing: -0.02em;
    color: rgba(248, 243, 231, 0.98);
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
    color: var(--ceo-text-primary);
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
    color: var(--ceo-text-muted);
    line-height: 1.5;
    margin: 0;
    padding-top: 6px;
    border-top: none;
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
    padding: 8px 0;
    border-bottom: 1px solid rgba(212, 175, 55, 0.05);
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
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.01em;
    color: rgba(243, 218, 138, 0.88);
    line-height: 1.42;
  }

  .ceo-priority-value {
    font-size: 13px;
    color: var(--ceo-text-secondary);
    line-height: 1.48;
  }

  .ceo-priority-empty {
    margin: 0;
    font-size: 12px;
    color: var(--ceo-text-muted);
    line-height: 1.48;
  }

  .ceo-decision-queue-grid,
  .ceo-intelligence-grid,
  .ceo-module-readiness-grid,
  .ceo-briefing-grid {
    display: grid;
    gap: 14px;
  }

  .ceo-decision-queue-grid,
  .ceo-intelligence-grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }

  .ceo-module-readiness-grid {
    grid-template-columns: repeat(5, minmax(0, 1fr));
  }

  .ceo-readiness-radar-row {
    margin-top: 10px;
  }

  .ceo-corporate-radar-card {
    gap: 14px;
    border: none;
    background: transparent;
    box-shadow: none;
    padding: 8px 0 0;
    align-items: center;
    text-align: center;
  }

  .ceo-corporate-radar-copy {
    margin: 0;
    font-size: 12px;
    color: var(--ceo-text-muted);
    line-height: 1.45;
  }

  .ceo-executive-command-page .executive-radar-panel.ceo-radar-premium {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    width: 100%;
  }

  .ceo-radar-visual-wrap {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    max-width: 420px;
    min-height: 340px;
    padding: 16px;
    border-radius: 16px;
    border: none;
    background:
      radial-gradient(circle at 50% 50%, rgba(212, 175, 55, 0.06), transparent 62%),
      rgba(6, 5, 4, 0.55);
    box-shadow:
      inset 0 0 60px rgba(212, 175, 55, 0.05),
      0 12px 40px rgba(0, 0, 0, 0.32);
  }

  .ceo-executive-command-page .ceo-radar-svg {
    width: 100%;
    max-width: 400px;
    min-height: 320px;
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
    stroke: rgba(245, 197, 92, 0.38);
    stroke-width: 1.2;
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
    stroke: rgba(252, 236, 180, 0.88);
    stroke-width: 2.2;
    stroke-linejoin: round;
    fill-opacity: 0.76;
  }

  .ceo-executive-command-page .executive-radar-center-focus {
    fill: rgba(212, 175, 55, 0.08);
    stroke: rgba(243, 218, 138, 0.22);
    stroke-width: 1;
  }

  .ceo-radar-legend-wrap {
    display: grid;
    gap: 10px;
    width: min(560px, 100%);
  }

  .ceo-radar-incomplete-note {
    margin: 0;
    padding: 0;
    border: none;
    border-radius: 0;
    background: transparent;
    color: var(--ceo-text-muted);
    font-size: 12px;
    line-height: 1.5;
    text-align: center;
    max-width: 520px;
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
    color: var(--ceo-text-muted);
  }

  .ceo-radar-legend-label {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    color: rgba(248, 243, 231, 0.9);
    min-width: 0;
    line-height: 1.35;
  }

  .ceo-radar-swatch {
    flex: 0 0 auto;
    width: 9px;
    height: 9px;
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
    font-size: 13px;
    font-weight: 650;
    letter-spacing: -0.01em;
  }

  .ceo-radar-legend-values small {
    color: var(--ceo-text-secondary);
    font-size: 11px;
    text-transform: none;
    font-weight: 560;
  }

  .ceo-executive-command-page .ceo-radar-point-label {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.03em;
    fill: rgba(248, 243, 231, 0.92);
    pointer-events: none;
    user-select: none;
    paint-order: stroke fill;
    stroke: rgba(5, 5, 5, 0.72);
    stroke-width: 2.5px;
    stroke-linejoin: round;
  }

  .ceo-executive-command-page .ceo-radar-point-label.is-missing {
    fill: rgba(248, 243, 231, 0.5);
    opacity: 0.85;
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
    gap: 14px;
  }

  .ceo-workflow-step {
    border: none;
    border-top: 2px solid rgba(245, 197, 92, 0.26);
    border-radius: 0;
    background: transparent;
    padding: 16px 12px 14px 4px;
    min-width: 0;
    box-shadow: none;
  }

  .ceo-workflow-step .ceo-step-eyebrow {
    font-size: 10px;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: rgba(243, 218, 138, 0.58);
    font-weight: 600;
    margin: 0;
    line-height: 1.4;
  }

  .ceo-workflow-step-head strong {
    display: block;
    margin-top: 0;
    font-size: 17px;
    font-weight: 650;
    color: var(--ceo-text-primary);
    line-height: 1.32;
    letter-spacing: -0.02em;
  }

  .ceo-workflow-step p {
    margin: 8px 0 0;
    font-size: 13.5px;
    color: rgba(248, 243, 231, 0.75);
    line-height: 1.58;
  }

  .ceo-decision-card-priority {
    display: inline-flex;
    width: max-content;
    padding: 0;
    border: 0;
    border-radius: 0;
    background: transparent;
    box-shadow: none;
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: rgba(243, 218, 138, 0.58);
    margin: 0;
    line-height: 1.4;
  }

  .ceo-decision-card-priority.is-high {
    color: rgba(252, 211, 77, 0.62);
  }

  .ceo-decision-card-priority.is-medium {
    color: rgba(243, 218, 138, 0.5);
  }

  .ceo-decision-card-priority.is-watch {
    color: var(--ceo-text-muted);
  }

  .ceo-decision-card-status {
    margin-top: auto;
    padding-top: 4px;
    display: block;
    width: auto;
    border: none;
    border-top: none;
    border-radius: 0;
    background: transparent;
    color: rgba(243, 218, 138, 0.76);
    font-size: 12px;
    font-weight: 620;
    letter-spacing: 0.02em;
    text-transform: none;
    line-height: 1.4;
  }

  .ceo-decision-card-status::before {
    display: none;
  }

  .ceo-module-posture {
    display: inline-block;
    font-size: 12px;
    letter-spacing: 0.02em;
    text-transform: none;
    color: rgba(248, 243, 231, 0.78);
    font-weight: 560;
    line-height: 1.4;
  }

  .ceo-module-score-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 10px;
  }

  .ceo-module-score-row .ceo-module-posture {
    text-align: right;
    max-width: 54%;
    line-height: 1.4;
  }

  .ceo-module-score-row strong {
    font-size: 24px;
    letter-spacing: -0.04em;
    color: var(--ceo-text-primary);
  }

  .ceo-module-progress {
    height: 5px;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.04);
    overflow: visible;
    margin-top: 4px;
  }

  .ceo-module-progress span {
    display: block;
    height: 100%;
    border-radius: inherit;
    box-shadow: 0 0 12px currentColor;
  }

  .ceo-truthfulness-banner {
    border: none;
    border-bottom: none;
    border-radius: 0;
    background: transparent;
    padding: 0 0 4px;
    font-size: 12px;
    color: var(--ceo-text-muted);
    line-height: 1.5;
  }

  .ceo-unified-context {
    margin: 8px 0 0;
    padding-top: 0;
    border-top: none;
    font-size: 12px;
    color: var(--ceo-text-secondary);
    line-height: 1.52;
    text-align: center;
    max-width: 640px;
    margin-left: auto;
    margin-right: auto;
  }

  @media (max-width: 1180px) {
    .ceo-command-status-grid {
      grid-template-columns: 1fr;
    }

    .ceo-command-hero-main {
      grid-template-columns: minmax(0, 1fr) minmax(140px, 220px);
    }

    .ceo-lion-mark-wrap {
      max-width: 220px;
    }

    .ceo-lion-mark-wrap .ceo-lion-mark {
      max-width: 200px;
    }

    .ceo-decision-queue-grid,
    .ceo-intelligence-grid,
    .ceo-module-readiness-grid,
    .ceo-briefing-grid,
    .ceo-workflow-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .ceo-readiness-radar-row {
      margin-top: 12px;
    }

    .ceo-radar-visual-wrap {
      min-height: 280px;
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

  if (!safe || safe === 'not_available') {
    return 'Pending inputs';
  }

  if (safe === 'insufficient_data' || safe.includes('insufficient') || safe.includes('missing')) {
    return 'Pending inputs';
  }

  if (safe === 'executive_attention' || safe === 'executive attention required') {
    return 'Executive review needed';
  }

  return safe
    .split(/[\s_]+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
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
  strategyOverview,
  reportingOverview,
  bridgeOverview,
  heritageOverview
}) {
  return [
    { key: 'ma', label: 'M&A', overview: maOverview, tone: getCeoBranchAccentHex('ma'), route: '/ma/dashboard' },
    {
      key: 'funding',
      label: 'Funding',
      overview: fundingOverview,
      tone: getCeoBranchAccentHex('funding'),
      route: '/funding/dashboard'
    },
    {
      key: 'compliance',
      label: 'Compliance',
      overview: complianceOverview,
      tone: getCeoBranchAccentHex('compliance'),
      route: '/compliance/dashboard'
    },
    {
      key: 'risk',
      label: 'Risk',
      overview: riskOverview,
      tone: getCeoBranchAccentHex('risk'),
      route: '/risk/dashboard'
    },
    {
      key: 'pmi',
      label: 'PMI / Synergies',
      overview: pmiOverview,
      tone: getCeoBranchAccentHex('pmi'),
      route: '/pmi/dashboard'
    },
    {
      key: 'governance',
      label: 'Governance',
      overview: governanceOverview,
      tone: getCeoBranchAccentHex('governance'),
      route: '/governance/dashboard'
    },
    {
      key: 'strategy',
      label: 'Strategy',
      overview: strategyOverview,
      tone: getCeoBranchAccentHex('strategy'),
      route: '/strategy/dashboard'
    },
    {
      key: 'reporting',
      label: 'Reporting',
      overview: reportingOverview,
      tone: getCeoBranchAccentHex('reporting'),
      route: '/reporting/dashboard'
    },
    {
      key: 'bridge',
      label: 'Bridge',
      overview: bridgeOverview,
      tone: getCeoBranchAccentHex('bridge'),
      route: '/bridge/dashboard'
    },
    {
      key: 'heritage',
      label: 'Heritage',
      overview: heritageOverview,
      tone: getCeoBranchAccentHex('heritage'),
      route: '/heritage/dashboard'
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
  commandSignals = [],
  commandBoardView = {},
  boardPackGeneratedAt = null,
  maOverview,
  complianceOverview,
  fundingOverview,
  pmiOverview,
  governanceOverview,
  riskOverview,
  strategyOverview,
  reportingOverview,
  bridgeOverview,
  heritageOverview,
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
    strategyOverview,
    reportingOverview,
    bridgeOverview,
    heritageOverview
  });

  const topPriorities = executivePriorityRows.slice(0, 3);
  const prioritiesAreInformational = executivePriorityRows.every((row) => row.isInformational);

  const liveDecisionQueueItems = buildExecutiveLiveDecisionQueueItems(commandDecisionQueue, {
    limit: 12
  });
  const recommendedActions = buildExecutiveRecommendedActions({
    alerts: commandAlerts,
    signals: commandSignals,
    limit: 5
  });
  const inputBlockers = buildExecutiveInputBlockers({
    readiness: commandReadiness,
    moduleOverviews: {
      ma: maOverview,
      funding: fundingOverview,
      compliance: complianceOverview,
      risk: riskOverview,
      pmi: pmiOverview,
      governance: governanceOverview,
      strategy: strategyOverview,
      reporting: reportingOverview,
      bridge: bridgeOverview,
      heritage: heritageOverview
    }
  });
  const boardReadinessSummary = buildExecutiveBoardReadinessSummary({
    boardView: commandBoardView,
    readiness: commandReadiness,
    briefingDraftPrepared: Boolean(boardPackGeneratedAt),
    boardPackGeneratedAt
  });
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
                    <span className="ceo-command-badge">Decision Support</span>
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
                    width={320}
                    height={320}
                    decoding="async"
                  />
                </div>
              </div>

              <ExecutiveReadinessHeroCard readiness={commandReadiness} />

              <article className="ceo-command-card ceo-priorities-card">
                <div className="ceo-command-card-kicker">
                  {prioritiesAreInformational ? 'Operating posture' : 'Executive attention'}
                </div>
                {prioritiesAreInformational ? (
                  <p className="ceo-priority-informational-note">
                    Informational posture · not a scored signal
                  </p>
                ) : null}
                {topPriorities.length ? (
                  <ul className="ceo-priority-list">
                    {topPriorities.map((row) => (
                      <li key={`${row.label}-${row.value}`} className="ceo-priority-item">
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
                <div className="ceo-card-title-row">
                  <CeoGoldCardIcon icon={DECISION_QUEUE_ICONS[card.title]} />
                  <strong>{card.title}</strong>
                </div>
                <p>{card.summary}</p>
                <span className="ceo-decision-card-status">{card.status}</span>
              </article>
            ))}
          </div>

          <div className="ceo-decision-intelligence-row">
            <article className="ceo-command-card ceo-live-queue-panel">
              <div className="ceo-command-card-kicker">Executive Decision Queue — Live</div>
              {liveDecisionQueueItems.length ? (
                <ul className="ceo-live-queue-list">
                  {liveDecisionQueueItems.map((item) => (
                    <li key={item.id} className="ceo-live-queue-item">
                      <div className="ceo-live-queue-head">
                        <strong>{item.title}</strong>
                        <span className={`ceo-live-queue-severity is-${item.severity}`}>
                          {item.severity}
                        </span>
                      </div>
                      <p className="ceo-live-queue-meta">
                        {item.module}
                        {item.priorityScore !== null ? ` · Priority ${item.priorityScore}` : ''}
                        {item.dueDate ? ` · Due ${item.dueDate}` : ''}
                      </p>
                      <p className="ceo-live-queue-action">
                        {item.recommendedAction || 'Review required'}
                      </p>
                      {item.route ? (
                        <Link to={item.route} className="ceo-live-queue-link">
                          Open module
                        </Link>
                      ) : null}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="ceo-panel-fallback">
                  No prioritized decisions queued · Confirm module data availability
                </p>
              )}
            </article>

            <article className="ceo-command-card ceo-recommended-actions-panel">
              <div className="ceo-command-card-kicker">Recommended Actions</div>
              {recommendedActions.length ? (
                <ul className="ceo-recommended-actions-list">
                  {recommendedActions.map((action) => (
                    <li key={action.id} className="ceo-recommended-action-item">
                      <div className="ceo-live-queue-head">
                        <strong>{action.title}</strong>
                        <span className={`ceo-live-queue-severity is-${action.severity}`}>
                          {action.severity}
                        </span>
                      </div>
                      <p className="ceo-live-queue-meta">{action.module}</p>
                      <p className="ceo-live-queue-action">{action.actionLabel}</p>
                      {action.route ? (
                        <Link to={action.route} className="ceo-live-queue-link">
                          Open module
                        </Link>
                      ) : null}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="ceo-panel-fallback">
                  Pending inputs — no recommended actions until module summaries load
                </p>
              )}
            </article>
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
                <div className="ceo-command-card-kicker ceo-card-kicker-row">
                  <CeoGoldCardIcon icon={INTELLIGENCE_ICONS[card.title]} />
                  <span>{card.title}</span>
                </div>
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
          <div className="ceo-module-readiness-block">
          <article className="ceo-command-card ceo-blockers-panel">
            <div className="ceo-command-card-kicker">Blocked by Missing Inputs</div>
            {inputBlockers.length ? (
              <ul className="ceo-blockers-list">
                {inputBlockers.map((blocker) => (
                  <li key={`${blocker.branch}-${blocker.description}`} className="ceo-blocker-item">
                    <div className="ceo-live-queue-head">
                      <strong>{blocker.branch}</strong>
                      <span className="ceo-blocker-effect">{blocker.effect}</span>
                    </div>
                    <p className="ceo-live-queue-meta">{blocker.description}</p>
                    {blocker.route ? (
                      <Link to={blocker.route} className="ceo-live-queue-link">
                        Open module
                      </Link>
                    ) : null}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="ceo-panel-fallback">No blockers identified</p>
            )}
          </article>

          <div className="ceo-module-readiness-grid">
            {moduleCards.map((module) => (
              <Link
                key={module.key}
                to={module.route}
                className="ceo-command-card"
                style={{
                  '--branch-tone': module.tone,
                  '--branch-wash': `${module.tone}44`,
                  textDecoration: 'none',
                  color: 'inherit'
                }}
              >
                <div className="ceo-command-card-kicker">
                  <span
                    className="ceo-module-branch-dot"
                    style={{ background: module.tone, color: module.tone }}
                    aria-hidden="true"
                  />
                  <span>{module.label}</span>
                </div>
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
                      background: module.tone,
                      color: module.tone
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
          </div>
        </SectionBlock>

        <SectionBlock
          number="05"
          title="Board Review Workflow"
          description="Draft-first workflow. Human review required before any distribution."
        >
          <article className="ceo-command-card ceo-board-readiness-panel">
            <div className="ceo-command-card-kicker">Board Readiness Summary</div>
            <p className="ceo-board-readiness-status">
              Status: <strong>{boardReadinessSummary.statusLabel}</strong>
            </p>
            <p className="ceo-board-readiness-fallback">{boardReadinessSummary.fallbackCopy}</p>
            <ul className="ceo-board-readiness-bullets">
              {boardReadinessSummary.bullets.map((bullet) => (
                <li key={bullet.label}>
                  <span>{bullet.label}</span>
                  <strong>{bullet.value}</strong>
                </li>
              ))}
            </ul>
          </article>

          <div className="ceo-workflow-grid">
            {WORKFLOW_STEPS.map((step) => (
              <article key={step.eyebrow} className="ceo-workflow-step">
                <p className="ceo-step-eyebrow">{step.eyebrow}</p>
                <div className="ceo-workflow-step-head">
                  <CeoGoldCardIcon icon={step.icon} />
                  <strong>{step.title}</strong>
                </div>
                <p>{step.copy}</p>
              </article>
            ))}
          </div>
        </SectionBlock>

        <SectionBlock
          number="06"
          title="Executive Briefing Packs"
          description="Draft review packs prepared for executive review — not certified outputs."
        >
          <div className="ceo-briefing-grid">
            <article className="ceo-command-card">
              <div className="ceo-card-title-row">
                <CeoGoldCardIcon icon={FileText} />
                <strong>Board review draft</strong>
              </div>
              <p>Status: {lastReportGeneratedAt ? 'Prepared' : 'Draft'}</p>
            </article>
            <article className="ceo-command-card">
              <div className="ceo-card-title-row">
                <CeoGoldCardIcon icon={Shield} />
                <strong>Compliance review</strong>
              </div>
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
              <div className="ceo-card-title-row">
                <CeoGoldCardIcon icon={BarChart3} />
                <strong>Strategic review</strong>
              </div>
              <p>
                Status:{' '}
                {strategyOverview.posture === 'insufficient_data' ? 'Pending inputs' : 'In review'}
              </p>
            </article>
            <article className="ceo-command-card">
              <div className="ceo-card-title-row">
                <CeoGoldCardIcon icon={Coins} />
                <strong>Funding review</strong>
              </div>
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
