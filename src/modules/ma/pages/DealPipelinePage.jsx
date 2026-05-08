import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  BriefcaseBusiness,
  CheckCircle2,
  Clock3,
  Filter,
  Globe2,
  Layers3,
  LockKeyhole,
  RefreshCw,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  Users
} from 'lucide-react';
import { Badge } from '../../../shared/components/ui/Badge.jsx';
import { Button } from '../../../shared/components/ui/Button.jsx';
import {
  PERMISSIONS,
  useAuth
} from '../../../app/providers/AuthProvider.jsx';
import { useMAStore } from '../store/maStore.jsx';
import { maDealsApi } from '../services/maDealsApi.js';
import { useValuationEngine } from '../engine/useValuationEngine.js';
import { formatCurrency } from '../../../shared/utils/formatCurrency.js';
import { ENTERPRISE_MA_PIPELINE_DEALS } from '../../../shared/config/demoData.js';

const PIPELINE_STAGES = [
  {
    id: 'screening',
    label: 'Screening',
    description: 'Initial fit, mandate logic and preliminary target review.'
  },
  {
    id: 'nda',
    label: 'NDA',
    description: 'Confidentiality, access control and buyer/seller perimeter.'
  },
  {
    id: 'due-diligence',
    label: 'Due Diligence',
    description: 'Financial, legal, commercial and operational diligence.'
  },
  {
    id: 'ic-review',
    label: 'IC Review',
    description: 'Investment committee review, memo and decision discipline.'
  },
  {
    id: 'negotiation',
    label: 'Negotiation',
    description: 'LOI, SPA perimeter, bridge items and closing conditions.'
  },
  {
    id: 'closing',
    label: 'Closing',
    description: 'Final approvals, signing, completion and archive.'
  }
];

const PRIORITY_FILTERS = [
  { value: 'all', label: 'All priorities' },
  { value: 'high', label: 'High' },
  { value: 'review', label: 'Review' },
  { value: 'watch', label: 'Watch' },
  { value: 'build', label: 'Build' }
];

const DEMO_PIPELINE_DEALS = ENTERPRISE_MA_PIPELINE_DEALS;
const pipelineCss = `
  .ma-pipeline-page {
    width: min(1540px, 100%);
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 34px;
  }

  .ma-pipeline-hero {
    position: relative;
    overflow: hidden;
    border-radius: 38px;
    padding: 38px;
    border: 1px solid rgba(148, 163, 184, 0.18);
    background:
      radial-gradient(circle at 8% 2%, rgba(37, 99, 235, 0.38), transparent 30%),
      radial-gradient(circle at 88% 8%, rgba(16, 185, 129, 0.18), transparent 27%),
      radial-gradient(circle at 60% 110%, rgba(234, 179, 8, 0.08), transparent 30%),
      linear-gradient(135deg, rgba(2, 6, 23, 0.99), rgba(15, 23, 42, 0.97));
    box-shadow:
      0 38px 120px rgba(0, 0, 0, 0.42),
      inset 0 1px 0 rgba(255, 255, 255, 0.055);
  }

  .ma-pipeline-hero::before {
    content: "";
    position: absolute;
    inset: 0;
    background:
      linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px);
    background-size: 50px 50px;
    mask-image: linear-gradient(to bottom, rgba(0,0,0,0.9), transparent 82%);
    pointer-events: none;
  }

  .ma-pipeline-hero::after {
    content: "";
    position: absolute;
    inset: auto -190px -210px auto;
    width: 520px;
    height: 520px;
    border-radius: 999px;
    background: radial-gradient(circle, rgba(16, 185, 129, 0.13), transparent 70%);
    pointer-events: none;
  }

  .ma-pipeline-hero-inner {
    position: relative;
    z-index: 1;
    display: grid;
    grid-template-columns: minmax(0, 1.35fr) minmax(360px, 0.65fr);
    gap: 34px;
    align-items: stretch;
  }

  .ma-pipeline-badges {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    align-items: center;
    margin-bottom: 24px;
  }

  .ma-pipeline-title {
    margin: 0;
    max-width: 930px;
    font-size: clamp(42px, 5vw, 72px);
    line-height: 0.92;
    letter-spacing: -0.075em;
  }

  .ma-pipeline-title span {
    display: block;
    margin-top: 8px;
    color: rgba(226, 232, 240, 0.7);
  }

  .ma-pipeline-copy {
    max-width: 860px;
    margin: 26px 0 0;
    font-size: 17px;
    line-height: 1.82;
    color: rgba(203, 213, 225, 0.86);
  }

  .ma-pipeline-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 14px;
    margin-top: 34px;
  }

  .ma-pipeline-command-bar {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 14px;
    margin-top: 34px;
    padding-top: 28px;
    border-top: 1px solid rgba(148, 163, 184, 0.16);
  }

  .ma-pipeline-command-item {
    padding: 18px;
    border-radius: 22px;
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.078);
  }

  .ma-pipeline-command-item strong {
    display: block;
    margin-top: 8px;
    line-height: 1.25;
    overflow-wrap: anywhere;
  }

  .ma-pipeline-signal-card {
    position: relative;
    min-height: 100%;
    border-radius: 32px;
    padding: 28px;
    background:
      linear-gradient(135deg, rgba(255,255,255,0.086), rgba(255,255,255,0.026)),
      rgba(15, 23, 42, 0.76);
    border: 1px solid rgba(148, 163, 184, 0.2);
    backdrop-filter: blur(22px);
    display: flex;
    flex-direction: column;
    gap: 24px;
    box-shadow:
      0 26px 70px rgba(0, 0, 0, 0.24),
      inset 0 1px 0 rgba(255,255,255,0.05);
  }

  .ma-pipeline-signal-card::before {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: 32px;
    background: radial-gradient(circle at 18% 0%, rgba(96, 165, 250, 0.13), transparent 35%);
    pointer-events: none;
  }

  .ma-pipeline-signal-inner {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    gap: 22px;
  }

  .ma-pipeline-signal-top {
    display: flex;
    justify-content: space-between;
    gap: 18px;
    align-items: flex-start;
  }

  .ma-pipeline-icon-box {
    flex: 0 0 auto;
    width: 50px;
    height: 50px;
    border-radius: 19px;
    display: grid;
    place-items: center;
    background: rgba(37, 99, 235, 0.16);
    border: 1px solid rgba(96, 165, 250, 0.24);
  }

  .ma-pipeline-signal-title {
    margin-top: 10px;
    font-size: 23px;
    line-height: 1.16;
    letter-spacing: -0.04em;
  }

  .ma-pipeline-signal-box {
    border-radius: 25px;
    padding: 20px;
    background: rgba(255,255,255,0.047);
    border: 1px solid rgba(255,255,255,0.085);
  }

  .ma-pipeline-signal-box strong {
    display: block;
    margin-bottom: 8px;
  }

  .ma-pipeline-signal-box p {
    margin: 0;
    line-height: 1.62;
  }

  .ma-pipeline-summary-grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 18px;
  }

  .ma-pipeline-summary-card {
    min-height: 154px;
    border-radius: 30px;
    padding: 24px;
    border: 1px solid rgba(148, 163, 184, 0.16);
    background:
      linear-gradient(135deg, rgba(255,255,255,0.064), rgba(255,255,255,0.022)),
      rgba(15, 23, 42, 0.64);
    box-shadow:
      0 24px 70px rgba(0, 0, 0, 0.21),
      inset 0 1px 0 rgba(255,255,255,0.035);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 18px;
  }

  .ma-pipeline-summary-top {
    display: flex;
    justify-content: space-between;
    gap: 16px;
    align-items: flex-start;
  }

  .ma-pipeline-summary-icon {
    flex: 0 0 auto;
    width: 44px;
    height: 44px;
    border-radius: 17px;
    display: grid;
    place-items: center;
    background: rgba(37, 99, 235, 0.14);
    border: 1px solid rgba(96, 165, 250, 0.22);
  }

  .ma-pipeline-summary-card strong {
    display: block;
    margin-top: 10px;
    font-size: 25px;
    line-height: 1.1;
    letter-spacing: -0.045em;
    overflow-wrap: anywhere;
  }

  .ma-pipeline-summary-card p {
    margin: 0;
    line-height: 1.55;
  }

  .ma-pipeline-toolbar {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 220px 220px;
    gap: 16px;
    align-items: center;
    padding: 18px;
    border-radius: 28px;
    background:
      linear-gradient(135deg, rgba(255,255,255,0.058), rgba(255,255,255,0.022)),
      rgba(15, 23, 42, 0.62);
    border: 1px solid rgba(148, 163, 184, 0.16);
    box-shadow:
      0 20px 56px rgba(0, 0, 0, 0.18),
      inset 0 1px 0 rgba(255,255,255,0.03);
  }

  .ma-pipeline-search,
  .ma-pipeline-select {
    width: 100%;
    min-height: 46px;
    border: 1px solid rgba(148, 163, 184, 0.16);
    border-radius: 18px;
    background: rgba(2, 6, 23, 0.34);
    color: rgba(248, 250, 252, 0.92);
    outline: none;
  }

  .ma-pipeline-search {
    display: grid;
    grid-template-columns: 42px minmax(0, 1fr);
    align-items: center;
    padding: 0 14px;
  }

  .ma-pipeline-search input {
    width: 100%;
    border: 0;
    background: transparent;
    color: inherit;
    outline: none;
    font: inherit;
  }

  .ma-pipeline-search input::placeholder {
    color: rgba(148, 163, 184, 0.76);
  }

  .ma-pipeline-select {
    padding: 0 14px;
  }

  .ma-pipeline-board-shell {
    position: relative;
    overflow: hidden;
    border-radius: 34px;
    padding: 30px;
    border: 1px solid rgba(148, 163, 184, 0.17);
    background:
      radial-gradient(circle at 4% 0%, rgba(37, 99, 235, 0.18), transparent 30%),
      radial-gradient(circle at 92% 4%, rgba(16, 185, 129, 0.11), transparent 28%),
      linear-gradient(135deg, rgba(255,255,255,0.062), rgba(255,255,255,0.024)),
      rgba(15, 23, 42, 0.68);
    box-shadow:
      0 28px 80px rgba(0, 0, 0, 0.24),
      inset 0 1px 0 rgba(255,255,255,0.04);
  }

  .ma-pipeline-board-shell::before {
    content: "";
    position: absolute;
    inset: 0;
    background:
      linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
    background-size: 44px 44px;
    mask-image: linear-gradient(to bottom, rgba(0,0,0,0.82), transparent 90%);
    pointer-events: none;
  }

  .ma-pipeline-board-shell > * {
    position: relative;
    z-index: 1;
  }

  .ma-pipeline-board-header {
    display: flex;
    justify-content: space-between;
    gap: 24px;
    align-items: flex-end;
    margin-bottom: 26px;
  }

  .ma-pipeline-kicker {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 12px;
    font-size: 11px;
    line-height: 1;
    text-transform: uppercase;
    letter-spacing: 0.17em;
    color: rgba(148, 163, 184, 0.96);
  }

  .ma-pipeline-board-header h2 {
    margin: 0;
    letter-spacing: -0.045em;
  }

  .ma-pipeline-board-header p {
    max-width: 820px;
    margin: 11px 0 0;
    line-height: 1.68;
  }

  .ma-pipeline-board {
    display: grid;
    grid-template-columns: repeat(6, minmax(240px, 1fr));
    gap: 15px;
    overflow-x: auto;
    padding-bottom: 4px;
  }

  .ma-pipeline-column {
    min-width: 240px;
    min-height: 420px;
    border-radius: 26px;
    padding: 16px;
    background:
      linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.026)),
      rgba(2, 6, 23, 0.25);
    border: 1px solid rgba(255,255,255,0.082);
  }

  .ma-pipeline-column-header {
    display: flex;
    justify-content: space-between;
    gap: 14px;
    align-items: flex-start;
    padding-bottom: 14px;
    margin-bottom: 14px;
    border-bottom: 1px solid rgba(148, 163, 184, 0.14);
  }

  .ma-pipeline-column-header strong {
    display: block;
    line-height: 1.2;
  }

  .ma-pipeline-column-header p {
    margin: 7px 0 0;
    font-size: 12px;
    line-height: 1.45;
  }

  .ma-pipeline-count {
    flex: 0 0 auto;
    min-width: 34px;
    height: 34px;
    padding: 0 10px;
    border-radius: 999px;
    display: grid;
    place-items: center;
    color: #dbeafe;
    background: rgba(37, 99, 235, 0.17);
    border: 1px solid rgba(96, 165, 250, 0.24);
    font-size: 12px;
    font-weight: 850;
  }

  .ma-pipeline-card-list {
    display: flex;
    flex-direction: column;
    gap: 13px;
  }

  .ma-deal-card {
    position: relative;
    overflow: hidden;
    border-radius: 23px;
    padding: 18px;
    background:
      radial-gradient(circle at 100% 0%, rgba(37,99,235,0.11), transparent 34%),
      linear-gradient(135deg, rgba(255,255,255,0.07), rgba(255,255,255,0.027)),
      rgba(15, 23, 42, 0.64);
    border: 1px solid rgba(255,255,255,0.092);
    box-shadow:
      0 16px 42px rgba(0, 0, 0, 0.18),
      inset 0 1px 0 rgba(255,255,255,0.04);
    transition:
      transform .18s ease,
      border-color .18s ease,
      background .18s ease;
  }

  .ma-deal-card:hover {
    transform: translateY(-3px);
    border-color: rgba(96, 165, 250, 0.25);
    background:
      radial-gradient(circle at 100% 0%, rgba(37,99,235,0.16), transparent 34%),
      linear-gradient(135deg, rgba(255,255,255,0.082), rgba(255,255,255,0.035)),
      rgba(15, 23, 42, 0.78);
  }

  .ma-deal-card::after {
    content: "";
    position: absolute;
    right: -52px;
    bottom: -60px;
    width: 140px;
    height: 140px;
    border-radius: 999px;
    background: rgba(37, 99, 235, 0.08);
    pointer-events: none;
  }

  .ma-deal-card-top {
    position: relative;
    z-index: 1;
    display: flex;
    justify-content: space-between;
    gap: 12px;
    align-items: flex-start;
  }

  .ma-deal-card h3 {
    margin: 0;
    font-size: 16px;
    line-height: 1.18;
    letter-spacing: -0.035em;
  }

  .ma-deal-priority {
    flex: 0 0 auto;
    padding: 7px 9px;
    border-radius: 999px;
    color: #dbeafe;
    background: rgba(37, 99, 235, 0.16);
    border: 1px solid rgba(96, 165, 250, 0.22);
    font-size: 10px;
    font-weight: 850;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .ma-deal-priority.high {
    color: #bbf7d0;
    background: rgba(16, 185, 129, 0.13);
    border-color: rgba(16, 185, 129, 0.24);
  }

  .ma-deal-priority.review {
    color: #dbeafe;
    background: rgba(37, 99, 235, 0.16);
    border-color: rgba(96, 165, 250, 0.22);
  }

  .ma-deal-priority.watch,
  .ma-deal-priority.build {
    color: #fde68a;
    background: rgba(234, 179, 8, 0.12);
    border-color: rgba(234, 179, 8, 0.22);
  }

  .ma-deal-meta {
    position: relative;
    z-index: 1;
    display: grid;
    gap: 9px;
    margin-top: 14px;
  }

  .ma-deal-meta-row {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    align-items: center;
    color: rgba(203, 213, 225, 0.82);
    font-size: 12px;
  }

  .ma-deal-meta-row span {
    display: inline-flex;
    align-items: center;
    gap: 7px;
  }

  .ma-deal-meta-row strong {
    color: rgba(248,250,252,0.94);
    text-align: right;
  }

  .ma-deal-footer {
    position: relative;
    z-index: 1;
    display: flex;
    justify-content: space-between;
    gap: 12px;
    align-items: center;
    margin-top: 15px;
    padding-top: 14px;
    border-top: 1px solid rgba(148, 163, 184, 0.13);
  }

  .ma-deal-owner {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    color: rgba(203, 213, 225, 0.82);
    font-size: 12px;
  }

  .ma-deal-open {
    width: 34px;
    height: 34px;
    border-radius: 14px;
    display: grid;
    place-items: center;
    color: inherit;
    text-decoration: none;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.08);
  }

  .ma-pipeline-empty {
    min-height: 190px;
    border-radius: 21px;
    padding: 18px;
    display: grid;
    place-items: center;
    text-align: center;
    color: rgba(203, 213, 225, 0.7);
    background: rgba(255,255,255,0.03);
    border: 1px dashed rgba(148, 163, 184, 0.18);
  }

  .ma-pipeline-empty strong {
    display: block;
    margin-bottom: 6px;
    color: rgba(226, 232, 240, 0.9);
  }

  .ma-pipeline-empty p {
    margin: 0;
    font-size: 12px;
    line-height: 1.45;
  }


  /* M&A PIPELINE · PREMIUM DEAL GLASS SYSTEM */
  .ma-pipeline-page {
    --ma-branch-a: 16, 185, 129;
    --ma-branch-b: 37, 99, 235;
    --ma-branch-c: 167, 243, 208;
    --ma-branch-glow: 16, 185, 129;
  }

  .ma-pipeline-hero,
  .ma-pipeline-signal-card,
  .ma-pipeline-command-item,
  .ma-pipeline-signal-box,
  .ma-pipeline-summary-card,
  .ma-pipeline-toolbar,
  .ma-pipeline-search,
  .ma-pipeline-board-shell,
  .ma-pipeline-column,
  .ma-deal-card,
  .ma-pipeline-empty,
  .ma-pipeline-count,
  .ma-deal-open {
    position: relative;
    isolation: isolate;
    overflow: hidden;
    border-color: rgba(255,255,255,0.026) !important;
    background:
      radial-gradient(circle at 0% 0%, rgba(var(--ma-branch-a), 0.148), transparent 36%),
      radial-gradient(circle at 100% 8%, rgba(var(--ma-branch-b), 0.104), transparent 42%),
      linear-gradient(
        115deg,
        rgba(var(--ma-branch-a), 0.088) 0%,
        rgba(255,255,255,0.016) 44%,
        rgba(var(--ma-branch-b), 0.064) 100%
      ),
      rgba(15, 23, 42, 0.58) !important;
    box-shadow:
      0 28px 82px rgba(0, 0, 0, 0.30),
      0 0 42px rgba(var(--ma-branch-glow), 0.120),
      inset 0 1px 0 rgba(255,255,255,0.065),
      inset 1px 0 0 rgba(var(--ma-branch-a), 0.085),
      inset -1px 0 0 rgba(var(--ma-branch-b), 0.070) !important;
    backdrop-filter: blur(22px) saturate(138%);
    -webkit-backdrop-filter: blur(22px) saturate(138%);
  }

  .ma-pipeline-select {
    background:
      linear-gradient(
        135deg,
        rgba(var(--ma-branch-a), 0.055),
        rgba(var(--ma-branch-b), 0.032)
      ),
      rgba(2, 6, 23, 0.58) !important;
    border-color: rgba(var(--ma-branch-a), 0.135) !important;
    box-shadow:
      inset 0 1px 0 rgba(255,255,255,0.045),
      0 0 18px rgba(var(--ma-branch-glow), 0.050) !important;
  }

  .ma-pipeline-hero::before,
  .ma-pipeline-signal-card::before,
  .ma-pipeline-command-item::before,
  .ma-pipeline-signal-box::before,
  .ma-pipeline-summary-card::before,
  .ma-pipeline-toolbar::before,
  .ma-pipeline-search::before,
  .ma-pipeline-board-shell::before,
  .ma-pipeline-column::before,
  .ma-deal-card::before,
  .ma-pipeline-empty::before,
  .ma-pipeline-count::before,
  .ma-deal-open::before {
    content: "";
    position: absolute;
    inset: -30%;
    z-index: 0;
    pointer-events: none;
    background:
      radial-gradient(circle at 0% 10%, rgba(var(--ma-branch-a), 0.145), transparent 34%),
      radial-gradient(circle at 100% 8%, rgba(var(--ma-branch-b), 0.120), transparent 38%),
      radial-gradient(circle at 54% 120%, rgba(255,255,255,0.040), transparent 42%);
    filter: blur(28px);
    opacity: 0.68;
    mix-blend-mode: screen;
  }

  .ma-pipeline-hero::after,
  .ma-pipeline-signal-card::after,
  .ma-pipeline-command-item::after,
  .ma-pipeline-signal-box::after,
  .ma-pipeline-summary-card::after,
  .ma-pipeline-toolbar::after,
  .ma-pipeline-search::after,
  .ma-pipeline-board-shell::after,
  .ma-pipeline-column::after,
  .ma-deal-card::after,
  .ma-pipeline-empty::after,
  .ma-pipeline-count::after,
  .ma-deal-open::after {
    content: "";
    position: absolute;
    inset: 1px;
    z-index: 0;
    pointer-events: none;
    border-radius: inherit;
    background:
      linear-gradient(
        135deg,
        rgba(255,255,255,0.080),
        rgba(255,255,255,0.014) 32%,
        transparent 58%,
        rgba(255,255,255,0.024) 100%
      );
    opacity: 0.36;
  }

  .ma-pipeline-hero > *,
  .ma-pipeline-signal-card > *,
  .ma-pipeline-command-item > *,
  .ma-pipeline-signal-box > *,
  .ma-pipeline-summary-card > *,
  .ma-pipeline-toolbar > *,
  .ma-pipeline-search > *,
  .ma-pipeline-board-shell > *,
  .ma-pipeline-column > *,
  .ma-deal-card > *,
  .ma-pipeline-empty > *,
  .ma-pipeline-count > *,
  .ma-deal-open > * {
    position: relative;
    z-index: 1;
  }

  .ma-pipeline-command-item:hover,
  .ma-pipeline-summary-card:hover,
  .ma-pipeline-signal-box:hover,
  .ma-pipeline-column:hover,
  .ma-deal-card:hover,
  .ma-pipeline-empty:hover,
  .ma-deal-open:hover {
    transform: translateY(-3px);
    border-color: rgba(var(--ma-branch-c), 0.18) !important;
    box-shadow:
      0 34px 96px rgba(0, 0, 0, 0.36),
      0 0 54px rgba(var(--ma-branch-glow), 0.165),
      inset 0 1px 0 rgba(255,255,255,0.080),
      inset 1px 0 0 rgba(var(--ma-branch-a), 0.105),
      inset -1px 0 0 rgba(var(--ma-branch-b), 0.085) !important;
  }

  .ma-pipeline-summary-grid {
    gap: clamp(22px, 1.7vw, 30px);
  }

  .ma-pipeline-board {
    gap: 20px;
  }

  .ma-pipeline-card-list {
    gap: 16px;
  }

  .ma-pipeline-column {
    padding: 18px;
    min-height: 440px;
  }

  .ma-pipeline-column-header {
    border-bottom-color: rgba(var(--ma-branch-a), 0.110) !important;
  }

  .ma-pipeline-summary-icon,
  .ma-pipeline-icon-box,
  .ma-pipeline-count,
  .ma-deal-open {
    background:
      linear-gradient(
        135deg,
        rgba(var(--ma-branch-a), 0.16),
        rgba(var(--ma-branch-b), 0.09)
      ) !important;
    border-color: rgba(var(--ma-branch-a), 0.22) !important;
    box-shadow:
      0 0 18px rgba(var(--ma-branch-glow), 0.14),
      inset 0 1px 0 rgba(255,255,255,0.070) !important;
  }

  .ma-deal-priority {
    border-color: rgba(var(--ma-branch-a), 0.24) !important;
    background:
      linear-gradient(
        90deg,
        rgba(var(--ma-branch-a), 0.145),
        rgba(var(--ma-branch-b), 0.080)
      ) !important;
    box-shadow: 0 0 16px rgba(var(--ma-branch-glow), 0.10);
  }

  .ma-deal-priority.high {
    color: #bbf7d0;
    background:
      linear-gradient(
        90deg,
        rgba(16, 185, 129, 0.18),
        rgba(37, 99, 235, 0.075)
      ) !important;
    border-color: rgba(16, 185, 129, 0.26) !important;
  }

  .ma-deal-priority.review {
    color: #dbeafe;
    background:
      linear-gradient(
        90deg,
        rgba(37, 99, 235, 0.17),
        rgba(16, 185, 129, 0.070)
      ) !important;
    border-color: rgba(96, 165, 250, 0.24) !important;
  }

  .ma-deal-priority.watch,
  .ma-deal-priority.build {
    color: #fde68a;
    background:
      linear-gradient(
        90deg,
        rgba(234, 179, 8, 0.14),
        rgba(16, 185, 129, 0.060)
      ) !important;
    border-color: rgba(234, 179, 8, 0.24) !important;
  }

  .ma-pipeline-search input,
  .ma-pipeline-select {
    color: rgba(248, 250, 252, 0.94) !important;
  }

  .ma-pipeline-search svg,
  .ma-pipeline-kicker svg,
  .ma-deal-meta-row svg,
  .ma-deal-owner svg {
    filter: drop-shadow(0 0 8px rgba(var(--ma-branch-glow), 0.14));
  }

  .ma-pipeline-title,
  .ma-pipeline-signal-title,
  .ma-pipeline-summary-card strong,
  .ma-pipeline-board-header h2,
  .ma-deal-card h3,
  .ma-deal-meta-row strong {
    text-shadow:
      0 0 14px rgba(var(--ma-branch-glow), 0.115);
  }

  .ma-deal-footer {
    border-top-color: rgba(var(--ma-branch-a), 0.110) !important;
  }

  .ma-pipeline-empty {
    border-style: solid !important;
    color: rgba(203, 213, 225, 0.78);
  }

  .ma-pipeline-board::-webkit-scrollbar {
    height: 10px;
  }

  .ma-pipeline-board::-webkit-scrollbar-track {
    background: rgba(255,255,255,0.035);
    border-radius: 999px;
  }

  .ma-pipeline-board::-webkit-scrollbar-thumb {
    background:
      linear-gradient(
        90deg,
        rgba(var(--ma-branch-a), 0.55),
        rgba(var(--ma-branch-b), 0.42)
      );
    border-radius: 999px;
  }

  .ma-pipeline-page :is(
    .ma-pipeline-hero,
    .ma-pipeline-summary-card,
    .ma-pipeline-board-wrap,
    .ma-pipeline-column,
    .ma-deal-card,
    .ma-pipeline-empty,
    .ma-pipeline-panel,
    .ma-pipeline-card,
    .card,
    .panel
  ) {
    background: rgba(15, 23, 42, 0.72) !important;
    background-image: none !important;
    border-color: rgba(148, 163, 184, 0.14) !important;
    box-shadow: none !important;
    backdrop-filter: none !important;
    -webkit-backdrop-filter: none !important;
    filter: none !important;
    transform: none !important;
  }

  .ma-pipeline-page :is(
    .ma-pipeline-hero,
    .ma-pipeline-summary-card,
    .ma-pipeline-board-wrap,
    .ma-pipeline-column,
    .ma-deal-card,
    .ma-pipeline-empty,
    .ma-pipeline-panel,
    .ma-pipeline-card
  )::before,
  .ma-pipeline-page :is(
    .ma-pipeline-hero,
    .ma-pipeline-summary-card,
    .ma-pipeline-board-wrap,
    .ma-pipeline-column,
    .ma-deal-card,
    .ma-pipeline-empty,
    .ma-pipeline-panel,
    .ma-pipeline-card
  )::after {
    content: none !important;
    display: none !important;
  }

  .ma-pipeline-page :is(
    .ma-pipeline-hero-inner,
    .ma-pipeline-summary-grid,
    .ma-pipeline-board,
    .ma-pipeline-card-list,
    .ma-deal-meta,
    .ma-deal-footer,
    .ma-pipeline-controls
  ) {
    background: transparent !important;
    background-image: none !important;
    box-shadow: none !important;
  }

  .ma-pipeline-page :is(
    .ma-pipeline-title,
    .ma-pipeline-signal-title,
    .ma-pipeline-summary-card strong,
    .ma-pipeline-board-header h2,
    .ma-deal-card h3,
    .ma-deal-meta-row strong,
    .ma-pipeline-kicker,
    .kpi-label
  ) {
    letter-spacing: 0 !important;
    text-shadow: none !important;
  }

  @media (max-width: 1400px) {
    .ma-pipeline-board {
      grid-template-columns: repeat(6, 260px);
    }
  }

  @media (max-width: 1180px) {
    .ma-pipeline-hero-inner {
      grid-template-columns: 1fr;
    }

    .ma-pipeline-summary-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .ma-pipeline-toolbar {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 680px) {
    .ma-pipeline-page {
      gap: 26px;
    }

    .ma-pipeline-hero,
    .ma-pipeline-board-shell {
      padding: 24px;
      border-radius: 28px;
    }

    .ma-pipeline-summary-grid {
      grid-template-columns: 1fr;
    }

    .ma-pipeline-board-header {
      align-items: flex-start;
      flex-direction: column;
    }
  }
`;

export function DealPipelinePage() {
  const { can, isViewer } = useAuth();
  const { financials, settings, savedCases } = useMAStore();

  const canEditCases = can(PERMISSIONS.UPDATE_MA_CASE);
  const canExportReports = can(PERMISSIONS.CREATE_MA_REPORT);
  const canCreateDeal = can(PERMISSIONS.CREATE_MA_DEAL);

  const [searchTerm, setSearchTerm] = useState('');
  const [stageFilter, setStageFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [backendDeals, setBackendDeals] = useState([]);
  const [isBackendLoading, setIsBackendLoading] = useState(true);
  const [isSyncingPipeline, setIsSyncingPipeline] = useState(false);
  const [pipelineError, setPipelineError] = useState('');

  const derived = useValuationEngine({
    financials,
    settings
  });

  const reportCurrency = settings?.reportCurrency || financials?.currency || 'EUR';
  const safeSavedCases = Array.isArray(savedCases) ? savedCases : [];

  async function loadBackendDeals() {
    setIsBackendLoading(true);
    setPipelineError('');

    try {
      setBackendDeals(await maDealsApi.list());
    } catch (error) {
      setPipelineError(error.message || 'No se pudo cargar el pipeline backend.');
      setBackendDeals([]);
    } finally {
      setIsBackendLoading(false);
    }
  }

  React.useEffect(() => {
    loadBackendDeals();
  }, []);

  const pipelineDeals = useMemo(
    () =>
      buildPipelineDeals({
        financials,
        derived,
        savedCases: safeSavedCases,
        backendDeals,
        currency: reportCurrency
      }),
    [financials, derived, safeSavedCases, backendDeals, reportCurrency]
  );

  const filteredDeals = useMemo(
    () =>
      filterPipelineDeals({
        deals: pipelineDeals,
        searchTerm,
        stageFilter,
        priorityFilter
      }),
    [pipelineDeals, searchTerm, stageFilter, priorityFilter]
  );

  const pipelineSummary = getPipelineSummary(filteredDeals, reportCurrency);
  const totalSummary = getPipelineSummary(pipelineDeals, reportCurrency);

  async function handleSyncPipeline() {
    if (!canCreateDeal || isSyncingPipeline) return;

    setIsSyncingPipeline(true);
    setPipelineError('');

    try {
      const existingNames = new Set(
        backendDeals.map((deal) => String(deal.name || '').toLowerCase())
      );
      const candidates = pipelineDeals
        .filter((deal) => !existingNames.has(String(deal.name || '').toLowerCase()))
        .slice(0, 6);

      for (const deal of candidates) {
        await maDealsApi.create(toBackendDealPayload(deal));
      }

      await loadBackendDeals();
    } catch (error) {
      setPipelineError(error.message || 'No se pudo sincronizar el pipeline.');
    } finally {
      setIsSyncingPipeline(false);
    }
  }

  return (
    <div className="page">
      <style>{pipelineCss}</style>

      <div className="ma-pipeline-page">
        <section className="ma-pipeline-hero">
          <div className="ma-pipeline-hero-inner">
            <div>
              <div className="ma-pipeline-badges">
                <Badge>M&A Deal Pipeline</Badge>
                <Badge>Enterprise Board</Badge>
                {isViewer ? <Badge>Modo solo lectura</Badge> : null}
                {canEditCases ? <Badge>Edición permitida</Badge> : null}
                {canExportReports ? <Badge>Reporting permitido</Badge> : null}
                {backendDeals.length > 0 ? <Badge>Backend pipeline</Badge> : null}
              </div>

              <h1 className="ma-pipeline-title">
                M&A Deal Pipeline.
                <span>From screening to closing discipline.</span>
              </h1>

              <p className="ma-pipeline-copy">
                Vista enterprise para seguir operaciones por fase, prioridad,
                valor potencial, riesgo, responsable y siguiente paso. Esta
                versión SaaS usa entidad backend `ma_deals`, audit trail,
                permisos por rol y fallback visual desde casos guardados si el
                pipeline real aun no tiene operaciones.
              </p>

              <div className="ma-pipeline-actions">
                <Link to="/ma/valuation">
                  <Button>
                    <BarChart3 size={16} />
                    Abrir Valuation Engine
                  </Button>
                </Link>

                <Link to="/ma/deals">
                  <Button variant="secondary">
                    <BriefcaseBusiness size={16} />
                    Abrir Deal Repository
                  </Button>
                </Link>

                <Button
                  variant="secondary"
                  disabled={!canCreateDeal}
                  loading={isSyncingPipeline}
                  onClick={handleSyncPipeline}
                >
                  <RefreshCw size={16} />
                  Sincronizar pipeline
                </Button>

                <Link to="/ma/cim">
                  <Button variant="secondary">
                    <ShieldCheck size={16} />
                    Preparar report
                  </Button>
                </Link>
              </div>

              <div className="ma-pipeline-command-bar">
                <CommandItem
                  label="Pipeline model"
                  value="Screening · NDA · DD · IC · Negotiation · Closing"
                />

                <CommandItem
                  label="Tracked deals"
                  value={totalSummary.totalDeals}
                />

                <CommandItem
                  label="Data posture"
                  value={
                    backendDeals.length > 0
                      ? 'ma_deals backend'
                      : isBackendLoading
                        ? 'Loading backend'
                        : 'Generated fallback'
                  }
                />
              </div>

              {pipelineError ? (
                <div className="ma-pipeline-empty" style={{ marginTop: 18 }}>
                  <div>
                    <strong>Pipeline backend notice</strong>
                    <p>{pipelineError}</p>
                  </div>
                </div>
              ) : null}
            </div>

            <aside className="ma-pipeline-signal-card">
              <div className="ma-pipeline-signal-inner">
                <div className="ma-pipeline-signal-top">
                  <div>
                    <div className="kpi-label">Pipeline Signal</div>
                    <div className="ma-pipeline-signal-title">
                      {getPipelineSignal(totalSummary)}
                    </div>
                  </div>

                  <div className="ma-pipeline-icon-box">
                    <Sparkles size={21} />
                  </div>
                </div>

                <div className="ma-pipeline-signal-box">
                  <strong>{getPipelineHeadline(totalSummary)}</strong>

                  <p className="muted">
                    {getPipelineDescription(totalSummary)}
                  </p>
                </div>

                <SignalRow
                  label="Total pipeline value"
                  value={totalSummary.totalEquityLabel}
                />

                <SignalRow
                  label="Active stages"
                  value={totalSummary.activeStages}
                />

                <SignalRow
                  label="Priority posture"
                  value={totalSummary.priorityLabel}
                />
              </div>
            </aside>
          </div>
        </section>

        <section className="ma-pipeline-summary-grid">
          <SummaryCard
            label="Deals visibles"
            value={pipelineSummary.totalDeals}
            description="Operaciones que cumplen los filtros actuales."
            icon={Layers3}
          />

          <SummaryCard
            label="Pipeline value"
            value={pipelineSummary.totalEquityLabel}
            description="Valor agregado estimado de los deals visibles."
            icon={TrendingUp}
          />

          <SummaryCard
            label="Fases activas"
            value={pipelineSummary.activeStages}
            description="Etapas con al menos una operación asociada."
            icon={Target}
          />

          <SummaryCard
            label="Prioridad"
            value={pipelineSummary.priorityLabel}
            description="Señal ejecutiva agregada del pipeline."
            icon={AlertTriangle}
          />
        </section>

        <section className="ma-pipeline-toolbar">
          <div className="ma-pipeline-search">
            <Search size={16} />
            <input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Buscar por target, sector, mercado o responsable..."
            />
          </div>

          <select
            className="ma-pipeline-select"
            value={stageFilter}
            onChange={(event) => setStageFilter(event.target.value)}
          >
            <option value="all">All stages</option>
            {PIPELINE_STAGES.map((stage) => (
              <option key={stage.id} value={stage.id}>
                {stage.label}
              </option>
            ))}
          </select>

          <select
            className="ma-pipeline-select"
            value={priorityFilter}
            onChange={(event) => setPriorityFilter(event.target.value)}
          >
            {PRIORITY_FILTERS.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </section>

        <section className="ma-pipeline-board-shell">
          <div className="ma-pipeline-board-header">
            <div>
              <div className="ma-pipeline-kicker">
                <Filter size={14} />
                Enterprise deal board
              </div>

              <h2>Pipeline por fases</h2>

              <p className="muted">
                Board ejecutivo de operaciones sobre entidad `ma_deals`.
                Cada tarjeta puede evolucionar con owner, permisos, audit
                trail, data room e IC memo.
              </p>
            </div>

            <Link to="/ma/dashboard">
              <Button variant="secondary">
                <ArrowRight size={16} />
                Volver al dashboard
              </Button>
            </Link>
          </div>

          <div className="ma-pipeline-board">
            {PIPELINE_STAGES.map((stage) => {
              const stageDeals = filteredDeals.filter(
                (deal) => deal.stageId === stage.id
              );

              return (
                <PipelineColumn
                  key={stage.id}
                  stage={stage}
                  deals={stageDeals}
                />
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}

function CommandItem({ label, value }) {
  return (
    <div className="ma-pipeline-command-item">
      <div className="kpi-label">{label}</div>
      <strong>{value}</strong>
    </div>
  );
}

function SignalRow({ label, value }) {
  return (
    <div className="ma-pipeline-command-item">
      <div className="kpi-label">{label}</div>
      <strong>{value}</strong>
    </div>
  );
}

function SummaryCard({ label, value, description, icon: Icon }) {
  return (
    <article className="ma-pipeline-summary-card">
      <div className="ma-pipeline-summary-top">
        <div>
          <div className="kpi-label">{label}</div>
          <strong>{value}</strong>
        </div>

        <div className="ma-pipeline-summary-icon">
          <Icon size={18} />
        </div>
      </div>

      <p className="muted">{description}</p>
    </article>
  );
}

function PipelineColumn({ stage, deals }) {
  return (
    <section className="ma-pipeline-column">
      <div className="ma-pipeline-column-header">
        <div>
          <strong>{stage.label}</strong>
          <p className="muted">{stage.description}</p>
        </div>

        <div className="ma-pipeline-count">{deals.length}</div>
      </div>

      <div className="ma-pipeline-card-list">
        {deals.length > 0 ? (
          deals.map((deal) => (
            <PipelineDealCard key={deal.id} deal={deal} />
          ))
        ) : (
          <div className="ma-pipeline-empty">
            <div>
              <strong>No active deal</strong>
              <p>Sin operaciones en esta fase con los filtros actuales.</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function PipelineDealCard({ deal }) {
  return (
    <article className="ma-deal-card">
      <div className="ma-deal-card-top">
        <div>
          <h3>{deal.name}</h3>
          <p className="muted" style={{ marginTop: 8, marginBottom: 0 }}>
            {deal.sector}
          </p>
        </div>

        <span className={`ma-deal-priority ${deal.priorityTone}`}>
          {deal.priority}
        </span>
      </div>

      <div className="ma-deal-meta">
        <DealMetaRow
          icon={Globe2}
          label="Market"
          value={deal.market}
        />

        <DealMetaRow
          icon={TrendingUp}
          label="Equity"
          value={deal.equityLabel}
        />

        <DealMetaRow
          icon={AlertTriangle}
          label="Risk"
          value={deal.riskLabel}
        />

        <DealMetaRow
          icon={Clock3}
          label="Updated"
          value={deal.updatedLabel}
        />
      </div>

      <div className="ma-deal-footer">
        <div className="ma-deal-owner">
          <Users size={13} />
          {deal.owner}
        </div>

        <Link
          to={deal.href}
          className="ma-deal-open"
          aria-label={`Abrir ${deal.name}`}
        >
          <ArrowRight size={15} />
        </Link>
      </div>
    </article>
  );
}

function DealMetaRow({ icon: Icon, label, value }) {
  return (
    <div className="ma-deal-meta-row">
      <span>
        <Icon size={12} /> {label}
      </span>
      <strong>{value}</strong>
    </div>
  );
}

function filterPipelineDeals({
  deals,
  searchTerm,
  stageFilter,
  priorityFilter
}) {
  const safeDeals = Array.isArray(deals) ? deals : [];
  const normalizedSearch = String(searchTerm || '').trim().toLowerCase();

  return safeDeals.filter((deal) => {
    const matchesStage =
      stageFilter === 'all' || deal.stageId === stageFilter;

    const matchesPriority =
      priorityFilter === 'all' || deal.priorityTone === priorityFilter;

    const searchable = [
      deal.name,
      deal.sector,
      deal.market,
      deal.owner,
      deal.priority,
      deal.riskLabel
    ]
      .join(' ')
      .toLowerCase();

    const matchesSearch =
      !normalizedSearch || searchable.includes(normalizedSearch);

    return matchesStage && matchesPriority && matchesSearch;
  });
}

function buildPipelineDeals({
  financials,
  derived,
  savedCases,
  backendDeals,
  currency
}) {
  const serverDeals = normalizeBackendDeals(backendDeals, currency);
  const deals = serverDeals.length > 0
    ? [...serverDeals]
    : DEMO_PIPELINE_DEALS.map((demoDeal) => ({
        ...demoDeal,
        equityLabel: formatCurrency(demoDeal.equityValue, currency),
        href: `/ma/deal/${demoDeal.id}`
      }));

  if (hasSufficientDealData(financials, derived)) {
    const activeScore = getSafeQualityScore(derived?.qualityScore);
    const equityValue = Number(derived?.equityBase);

    deals.push({
      id: 'active-deal',
      name: financials?.name?.trim() || 'Active Target',
      sector: financials?.sector || 'Sector not specified',
      market:
        financials?.country ||
        financials?.market ||
        financials?.geography ||
        'Primary market',
      stageId: getStageFromScore(activeScore),
      equityValue: Number.isFinite(equityValue) ? equityValue : 0,
      equityLabel: Number.isFinite(equityValue)
        ? formatCurrency(equityValue, currency)
        : 'N/A',
      riskLabel:
        derived?.riskLevel?.label ||
        derived?.riskLevel ||
        getRiskLabelFromScore(activeScore),
      priority: getPriorityLabel(activeScore),
      priorityTone: getPriorityTone(activeScore),
      owner: 'CEO workspace',
      updatedLabel: 'Live case',
      href: '/ma/deal/active-deal'
    });
  }

  const savedDealItems = Array.isArray(savedCases) ? savedCases : [];

  savedDealItems.slice(0, 12).forEach((item, index) => {
    const name = item?.name || `Saved Deal ${index + 1}`;
    const dealId = item?.id || `saved-deal-${index + 1}`;
    const alreadyExists = deals.some((deal) => deal.name === name);

    if (alreadyExists) return;

    const snapshot = item?.snapshot || {};
    const score = getSafeQualityScore(snapshot?.qualityScore);
    const equityValue = Number(snapshot?.equityBase);
    const createdAt = item?.updatedAt || item?.createdAt;

    deals.push({
      id: dealId,
      name,
      sector: item?.financials?.sector || 'Saved case',
      market:
        item?.financials?.country ||
        item?.financials?.market ||
        item?.financials?.geography ||
        'Repository',
      stageId: getSavedDealStage(index, score),
      equityValue: Number.isFinite(equityValue) ? equityValue : 0,
      equityLabel: Number.isFinite(equityValue)
        ? formatCurrency(equityValue, currency)
        : 'N/A',
      riskLabel: snapshot?.riskLevel || getRiskLabelFromScore(score),
      priority: getPriorityLabel(score),
      priorityTone: getPriorityTone(score),
      owner: 'Repository',
      updatedLabel: formatShortDate(createdAt),
      href: `/ma/deal/${dealId}`
    });
  });
  if (serverDeals.length > 0) {
    return deals;
  }

  DEMO_PIPELINE_DEALS.forEach((demoDeal) => {
    const alreadyExists = deals.some(
      (deal) => deal.id === demoDeal.id || deal.name === demoDeal.name
    );

    if (alreadyExists) return;

    deals.push({
      ...demoDeal,
      equityLabel: formatCurrency(demoDeal.equityValue, currency),
      href: `/ma/deal/${demoDeal.id}`
    });
  });

  return deals;
}

function normalizeBackendDeals(backendDeals = [], currency = 'EUR') {
  if (!Array.isArray(backendDeals)) return [];

  return backendDeals.filter(Boolean).map((deal) => {
    const equityValue = Number(deal.equityValue);
    const priorityTone = normalizePriorityTone(deal.priority);

    return {
      id: deal.id,
      name: deal.name || 'M&A Deal',
      sector: deal.sector || deal.payload?.sector || 'Enterprise deal',
      market: deal.market || deal.payload?.market || 'Private pipeline',
      stageId: deal.stage || 'screening',
      equityValue: Number.isFinite(equityValue) ? equityValue : 0,
      equityLabel: Number.isFinite(equityValue)
        ? formatCurrency(equityValue, currency)
        : 'N/A',
      riskLabel: normalizeRiskLabel(deal.riskLevel),
      priority: getPriorityLabelFromTone(priorityTone),
      priorityTone,
      owner: deal.ownerName || 'Deal owner',
      updatedLabel: formatShortDate(deal.updatedAt || deal.createdAt),
      href: `/ma/deal/${deal.caseId || deal.id}`
    };
  });
}

function toBackendDealPayload(deal) {
  return {
    name: deal.name,
    stage: deal.stageId,
    ownerName: deal.owner,
    priority: deal.priorityTone,
    riskLevel: normalizeRiskValue(deal.riskLabel),
    status: 'active',
    nextStep: 'Review next action before IC memo',
    icMemoStatus: deal.stageId === 'ic-review' ? 'draft' : 'not_started',
    sector: deal.sector,
    market: deal.market,
    equityValue: deal.equityValue || 0,
    payload: {
      source: 'pipeline_sync',
      originalId: deal.id,
      equityValue: deal.equityValue || 0,
      sector: deal.sector,
      market: deal.market
    }
  };
}

function normalizePriorityTone(value) {
  const normalized = String(value || '').toLowerCase();

  if (['high', 'review', 'watch', 'build'].includes(normalized)) return normalized;
  if (normalized === 'low') return 'watch';

  return 'review';
}

function getPriorityLabelFromTone(value) {
  const tone = normalizePriorityTone(value);

  if (tone === 'high') return 'High';
  if (tone === 'watch') return 'Watch';
  if (tone === 'build') return 'Build';

  return 'Review';
}

function normalizeRiskValue(value) {
  const normalized = String(value || '').toLowerCase();

  if (normalized.includes('control')) return 'controlled';
  if (normalized.includes('elev')) return 'elevated';
  if (normalized.includes('mod')) return 'moderate';
  if (['low', 'medium', 'high'].includes(normalized)) return normalized;

  return 'medium';
}

function normalizeRiskLabel(value) {
  const normalized = normalizeRiskValue(value);

  if (normalized === 'controlled') return 'Controlled';
  if (normalized === 'elevated') return 'Elevated';
  if (normalized === 'moderate') return 'Moderate';
  if (normalized === 'high') return 'High';
  if (normalized === 'low') return 'Low';

  return 'Medium';
}

function getPipelineSummary(deals, currency) {
  const safeDeals = Array.isArray(deals) ? deals : [];
  const totalEquity = safeDeals.reduce((sum, deal) => {
    const value = Number(deal.equityValue);
    return Number.isFinite(value) ? sum + value : sum;
  }, 0);

  const activeStages = new Set(safeDeals.map((deal) => deal.stageId)).size;
  const hasHighPriority = safeDeals.some((deal) => deal.priorityTone === 'high');
  const hasWatchPriority = safeDeals.some(
    (deal) => deal.priorityTone === 'watch' || deal.priorityTone === 'build'
  );

  return {
    totalDeals: safeDeals.length,
    totalEquityLabel:
      safeDeals.length > 0 ? formatCurrency(totalEquity, currency) : 'N/A',
    activeStages,
    priorityLabel: hasHighPriority
      ? 'High'
      : hasWatchPriority
        ? 'Watchlist'
        : safeDeals.length > 0
          ? 'Review'
          : 'N/A'
  };
}

function getStageFromScore(score) {
  if (score === null) return 'screening';
  if (score >= 82) return 'ic-review';
  if (score >= 68) return 'due-diligence';
  if (score >= 52) return 'nda';

  return 'screening';
}

function getSavedDealStage(index, score) {
  if (score !== null && score >= 82) return 'ic-review';
  if (score !== null && score >= 68) return 'due-diligence';

  const stages = [
    'screening',
    'nda',
    'due-diligence',
    'ic-review',
    'negotiation',
    'closing'
  ];

  return stages[index % stages.length];
}

function getPriorityLabel(score) {
  if (score === null) return 'Build';
  if (score >= 80) return 'High';
  if (score >= 55) return 'Review';

  return 'Watch';
}

function getPriorityTone(score) {
  if (score === null) return 'build';
  if (score >= 80) return 'high';
  if (score >= 55) return 'review';

  return 'watch';
}

function getRiskLabelFromScore(score) {
  if (score === null) return 'To assess';
  if (score >= 80) return 'Controlled';
  if (score >= 60) return 'Moderate';
  if (score >= 40) return 'Elevated';

  return 'High';
}

function formatShortDate(value) {
  if (!value) return 'N/A';

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return 'N/A';

  return new Intl.DateTimeFormat('es-ES', {
    day: '2-digit',
    month: 'short'
  }).format(date);
}

function hasSufficientDealData(financials, derived) {
  const hasName = Boolean(financials?.name?.trim());
  const hasSector = Boolean(financials?.sector);
  const normalizedEbitda = Number(derived?.normalizedEbitda);

  return (
    hasName &&
    hasSector &&
    Number.isFinite(normalizedEbitda) &&
    normalizedEbitda > 0
  );
}

function getSafeQualityScore(score) {
  const parsed = Number(score);

  if (!Number.isFinite(parsed)) return null;

  return Math.max(0, Math.min(100, Math.round(parsed)));
}

function getPipelineSignal(summary) {
  if (!summary || summary.totalDeals === 0) return 'Pipeline not started';
  if (summary.priorityLabel === 'High') return 'High-priority pipeline';
  if (summary.activeStages >= 3) return 'Multi-stage active pipeline';

  return 'Pipeline under review';
}

function getPipelineHeadline(summary) {
  if (!summary || summary.totalDeals === 0) {
    return 'Create or save a deal to activate the enterprise pipeline.';
  }

  if (summary.priorityLabel === 'High') {
    return 'At least one deal shows high-priority execution signal.';
  }

  return 'Pipeline visible and ready for executive review.';
}

function getPipelineDescription(summary) {
  if (!summary || summary.totalDeals === 0) {
    return 'El pipeline se alimenta del caso activo y de los deals guardados. Carga un target o guarda un caso para empezar a ver operaciones por fase.';
  }

  return 'Revisa fase, prioridad, valor estimado, riesgo y responsable antes de avanzar a reporting, IC review o negociación.';
}

export default DealPipelinePage;











