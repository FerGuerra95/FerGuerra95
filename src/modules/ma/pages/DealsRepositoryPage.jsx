import React, { useState } from 'react';
import {
  Activity,
  AlertTriangle,
  Archive,
  BriefcaseBusiness,
  CheckCircle2,
  ChevronRight,
  Database,
  FileSearch,
  LockKeyhole,
  RefreshCw,
  ShieldCheck,
  Trash2,
  TrendingUp
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../shared/components/ui/Button.jsx';
import { EmptyState } from '../../../shared/components/ui/EmptyState.jsx';
import { Badge } from '../../../shared/components/ui/Badge.jsx';
import { formatDate } from '../../../shared/utils/date.js';
import { formatCurrency } from '../../../shared/utils/formatCurrency.js';
import {
  PERMISSIONS,
  useAuth
} from '../../../app/providers/AuthProvider.jsx';
import { useNotifications } from '../../../app/providers/NotificationsProvider.jsx';
import { useMAStore } from '../store/maStore.jsx';
import { maCasesApi } from '../services/maCasesApi.js';

const dealsRepositoryCss = `
  .deals-page {
    width: min(1540px, 100%);
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 38px;
    max-width: 100%;
    overflow-x: clip;
  }

  .deals-hero {
    position: relative;
    overflow: visible;
    border-radius: 38px;
    padding: 42px 46px 52px;
    border: 1px solid rgba(148, 163, 184, 0.18);
    background:
      radial-gradient(circle at 8% 2%, rgba(37, 99, 235, 0.38), transparent 30%),
      radial-gradient(circle at 88% 8%, rgba(16, 185, 129, 0.18), transparent 27%),
      radial-gradient(circle at 60% 110%, rgba(234, 179, 8, 0.08), transparent 30%),
      linear-gradient(135deg, rgba(2, 6, 23, 0.99), rgba(15, 23, 42, 0.97));
    box-shadow:
      0 38px 120px rgba(0, 0, 0, 0.42),
      inset 0 1px 0 rgba(255, 255, 255, 0.055);
    max-width: 100%;
  }

  .deals-hero::before {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background:
      linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px);
    background-size: 50px 50px;
    mask-image: linear-gradient(to bottom, rgba(0,0,0,0.9), transparent 82%);
    pointer-events: none;
  }

  .deals-hero::after {
    content: "";
    position: absolute;
    inset: auto 0 -120px auto;
    width: 360px;
    height: 360px;
    border-radius: 999px;
    background: radial-gradient(circle, rgba(16, 185, 129, 0.13), transparent 70%);
    pointer-events: none;
  }

  .deals-hero-layout {
    position: relative;
    z-index: 1;
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(340px, 400px);
    gap: 38px;
    align-items: center;
  }

  .deals-hero-main {
    min-width: 0;
    max-width: 860px;
  }

  .deals-badge-row {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    align-items: center;
    margin-bottom: 26px;
  }

  .deals-title {
    margin: 0;
    max-width: 860px;
    font-size: clamp(38px, 4.4vw, 64px);
    line-height: 0.94;
    letter-spacing: -0.072em;
  }

  .deals-title span {
    display: block;
    margin-top: 8px;
    color: rgba(226, 232, 240, 0.7);
  }

  .deals-copy {
    max-width: 800px;
    margin: 26px 0 0;
    font-size: 17px;
    line-height: 1.82;
    color: rgba(203, 213, 225, 0.86);
  }

  .deals-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 14px;
    margin-top: 34px;
  }

  .deals-command-bar {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 14px;
    margin-top: 34px;
    padding-top: 28px;
    border-top: 1px solid rgba(148, 163, 184, 0.16);
  }

  .deals-command-item {
    padding: 18px;
    border-radius: 22px;
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.078);
    min-width: 0;
  }

  .deals-command-item strong {
    display: block;
    margin-top: 8px;
    line-height: 1.25;
    overflow-wrap: anywhere;
  }

  .deals-signal-card {
    position: relative;
    width: 100%;
    max-width: 400px;
    justify-self: end;
    align-self: center;
    border-radius: 30px;
    padding: 22px;
    margin: 0;
    background:
      linear-gradient(135deg, rgba(255,255,255,0.086), rgba(255,255,255,0.026)),
      rgba(15, 23, 42, 0.76);
    border: 1px solid rgba(148, 163, 184, 0.2);
    backdrop-filter: blur(22px);
    display: flex;
    flex-direction: column;
    gap: 18px;
    box-shadow:
      0 26px 70px rgba(0, 0, 0, 0.24),
      inset 0 1px 0 rgba(255,255,255,0.05);
  }

  .deals-signal-card::before {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background: radial-gradient(circle at 18% 0%, rgba(96, 165, 250, 0.13), transparent 35%);
    pointer-events: none;
  }

  .deals-signal-inner {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    gap: 18px;
    min-width: 0;
  }

  .deals-signal-top {
    display: flex;
    justify-content: space-between;
    gap: 18px;
    align-items: flex-start;
  }

  .deals-icon-box,
  .deals-card-icon,
  .deals-panel-icon {
    flex: 0 0 auto;
    display: grid;
    place-items: center;
    border-radius: 18px;
    background: rgba(37, 99, 235, 0.16);
    border: 1px solid rgba(96, 165, 250, 0.24);
  }

  .deals-icon-box {
    width: 50px;
    height: 50px;
  }

  .deals-card-icon,
  .deals-panel-icon {
    width: 46px;
    height: 46px;
  }

  .deals-signal-title {
    margin-top: 10px;
    font-size: 23px;
    line-height: 1.16;
    letter-spacing: -0.04em;
  }

  .deals-score-module {
    display: grid;
    grid-template-columns: 96px minmax(0, 1fr);
    gap: 16px;
    align-items: center;
    padding: 16px;
    border-radius: 24px;
    background: rgba(255, 255, 255, 0.047);
    border: 1px solid rgba(255, 255, 255, 0.085);
    min-width: 0;
  }

  .deals-score-ring {
    width: 94px;
    height: 94px;
    border-radius: 999px;
    display: grid;
    place-items: center;
    background:
      conic-gradient(rgba(16, 185, 129, 0.96) var(--score-angle), rgba(255,255,255,0.09) 0deg);
    box-shadow:
      0 18px 40px rgba(0, 0, 0, 0.28),
      0 0 34px rgba(16, 185, 129, 0.16);
  }

  .deals-score-core {
    width: 70px;
    height: 70px;
    border-radius: 999px;
    display: grid;
    place-items: center;
    background: rgba(15, 23, 42, 0.97);
    border: 1px solid rgba(255, 255, 255, 0.08);
  }

  .deals-score-core strong {
    font-size: 23px;
    letter-spacing: -0.055em;
  }

  .deals-score-core strong.is-empty-score {
    font-size: 30px;
    color: rgba(226, 232, 240, 0.72);
  }

  .deals-score-copy {
    min-width: 0;
  }

  .deals-score-copy strong {
    display: block;
    margin-bottom: 8px;
  }

  .deals-score-copy p {
    margin: 0;
    line-height: 1.58;
  }

  .deals-signal-table {
    display: grid;
    gap: 0;
  }

  .deals-signal-row {
    display: grid;
    grid-template-columns: minmax(0, 0.86fr) minmax(0, 1.14fr);
    gap: 14px;
    align-items: center;
    padding: 12px 0;
    border-top: 1px solid rgba(148, 163, 184, 0.14);
  }

  .deals-signal-row strong {
    text-align: right;
    overflow-wrap: anywhere;
  }

  .deals-section {
    display: flex;
    flex-direction: column;
    gap: 26px;
  }

  .deals-section-header {
    display: flex;
    justify-content: space-between;
    gap: 28px;
    align-items: flex-end;
  }

  .deals-kicker {
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

  .deals-section-header h2,
  .deals-section-header h3 {
    margin: 0;
    letter-spacing: -0.045em;
  }

  .deals-section-header p {
    max-width: 820px;
    margin: 11px 0 0;
    line-height: 1.68;
  }

  .deals-grid {
    display: grid;
    gap: 26px;
    align-items: stretch;
  }

  .deals-grid-kpis {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }

  .deals-kpi-card,
  .deals-panel,
  .deals-case-card {
    width: 100%;
    height: 100%;
    border-radius: 31px;
    border: 1px solid rgba(148, 163, 184, 0.16);
    background:
      linear-gradient(135deg, rgba(255,255,255,0.064), rgba(255,255,255,0.022)),
      rgba(15, 23, 42, 0.64);
    box-shadow:
      0 24px 70px rgba(0, 0, 0, 0.21),
      inset 0 1px 0 rgba(255,255,255,0.035);
  }

  .deals-kpi-card {
    min-height: 188px;
    padding: 27px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 22px;
    transition:
      transform .18s ease,
      border-color .18s ease,
      background .18s ease;
  }

  .deals-kpi-card:hover {
    transform: translateY(-3px);
    border-color: rgba(96, 165, 250, 0.25);
    background:
      linear-gradient(135deg, rgba(255,255,255,0.078), rgba(255,255,255,0.03)),
      rgba(15, 23, 42, 0.78);
  }

  .deals-kpi-top {
    display: flex;
    justify-content: space-between;
    gap: 18px;
    align-items: flex-start;
  }

  .deals-kpi-value {
    margin-top: 12px;
    font-size: 25px;
    font-weight: 790;
    line-height: 1.12;
    letter-spacing: -0.045em;
    overflow-wrap: anywhere;
  }

  .deals-kpi-card p {
    margin: 0;
    line-height: 1.56;
  }

  .deals-state-card {
    border-radius: 25px;
    padding: 22px;
    border: 1px solid rgba(148, 163, 184, 0.16);
    background:
      linear-gradient(135deg, rgba(255,255,255,0.055), rgba(255,255,255,0.022)),
      rgba(15, 23, 42, 0.6);
    display: grid;
    grid-template-columns: 38px minmax(0, 1fr);
    gap: 16px;
    align-items: flex-start;
  }

  .deals-state-card.warning {
    border-color: rgba(245, 158, 11, 0.26);
    background:
      linear-gradient(135deg, rgba(245,158,11,0.11), rgba(255,255,255,0.022)),
      rgba(15, 23, 42, 0.64);
  }

  .deals-state-card.success {
    border-color: rgba(16, 185, 129, 0.26);
    background:
      linear-gradient(135deg, rgba(16,185,129,0.11), rgba(255,255,255,0.022)),
      rgba(15, 23, 42, 0.64);
  }

  .deals-state-icon {
    width: 38px;
    height: 38px;
    border-radius: 15px;
    display: grid;
    place-items: center;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.08);
  }

  .deals-state-card p {
    margin: 0;
    line-height: 1.62;
  }

  .deals-panel {
    padding: 31px;
    display: flex;
    flex-direction: column;
    gap: 26px;
  }

  .deals-panel-header {
    display: flex;
    justify-content: space-between;
    gap: 24px;
    align-items: flex-start;
  }

  .deals-panel-title {
    margin: 0;
    letter-spacing: -0.045em;
  }

  .deals-panel-description {
    margin: 11px 0 0;
    line-height: 1.66;
  }

  .deals-archive-list {
    display: flex;
    flex-direction: column;
    gap: 18px;
  }

  .deals-case-card {
    padding: 26px;
    min-width: 0;
    transition:
      transform .18s ease,
      border-color .18s ease,
      background .18s ease;
  }

  .deals-case-card:hover {
    transform: translateY(-2px);
    border-color: rgba(96, 165, 250, 0.24);
    background:
      linear-gradient(135deg, rgba(255,255,255,0.078), rgba(255,255,255,0.03)),
      rgba(15, 23, 42, 0.78);
  }

  .deals-case-head {
    display: flex;
    justify-content: space-between;
    gap: 24px;
    align-items: flex-start;
    min-width: 0;
  }

  .deals-case-title {
    margin: 0;
    letter-spacing: -0.04em;
  }

  .deals-case-meta {
    margin: 9px 0 0;
    line-height: 1.58;
  }

  .deals-case-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    justify-content: flex-end;
    align-items: center;
    min-width: 0;
  }

  .deals-case-metrics {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 14px;
    margin-top: 22px;
  }

  .deals-case-metric {
    padding: 16px;
    border-radius: 20px;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.075);
  }

  .deals-case-metric strong {
    display: block;
    margin-top: 7px;
    overflow-wrap: anywhere;
  }

  .deals-chip-row {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 18px;
  }

  .deals-empty-wrap {
    border-radius: 26px;
    padding: 34px;
    border: 1px dashed rgba(148, 163, 184, 0.24);
    background: rgba(255,255,255,0.025);
  }

  .deals-muted-tight {
    margin-bottom: 0;
  }


  /* DEALS REPOSITORY · PREMIUM EXECUTIVE POLISH */
  .deals-hero,
  .deals-signal-card,
  .deals-kpi-card,
  .deals-panel,
  .deals-case-card,
  .deals-case-metric,
  .deals-state-card,
  .deals-command-item,
  .deals-empty-wrap {
    position: relative;
    isolation: isolate;
  }

  .deals-hero {
    border-color: rgba(16, 185, 129, 0.20);
    background:
      radial-gradient(circle at 0% 0%, rgba(16, 185, 129, 0.21), transparent 30%),
      radial-gradient(circle at 96% 6%, rgba(37, 99, 235, 0.26), transparent 31%),
      radial-gradient(circle at 58% 112%, rgba(212, 175, 55, 0.10), transparent 32%),
      linear-gradient(135deg, rgba(2, 6, 23, 0.99), rgba(15, 23, 42, 0.96));
    box-shadow:
      0 42px 130px rgba(0, 0, 0, 0.46),
      0 0 54px rgba(16, 185, 129, 0.08),
      inset 0 1px 0 rgba(255, 255, 255, 0.065);
  }

  .deals-title {
    text-shadow:
      0 0 32px rgba(255,255,255,0.05),
      0 18px 54px rgba(0,0,0,0.28);
  }

  .deals-title span {
    background:
      linear-gradient(
        90deg,
        rgba(226, 232, 240, 0.80),
        rgba(110, 231, 183, 0.76),
        rgba(191, 219, 254, 0.70)
      );
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }

  .deals-badge-row .badge,
  .deals-chip-row .badge {
    border-color: rgba(16, 185, 129, 0.22) !important;
    background:
      linear-gradient(90deg, rgba(16,185,129,0.13), rgba(37,99,235,0.08)) !important;
    box-shadow:
      0 0 18px rgba(16,185,129,0.09),
      inset 0 1px 0 rgba(255,255,255,0.060) !important;
  }

  .deals-signal-card,
  .deals-kpi-card,
  .deals-panel,
  .deals-case-card,
  .deals-case-metric,
  .deals-state-card,
  .deals-command-item,
  .deals-empty-wrap {
    overflow: hidden;
    border-color: rgba(16, 185, 129, 0.15);
    background:
      radial-gradient(circle at 0% 0%, rgba(16, 185, 129, 0.105), transparent 36%),
      radial-gradient(circle at 100% 0%, rgba(37, 99, 235, 0.085), transparent 42%),
      linear-gradient(135deg, rgba(255,255,255,0.064), rgba(255,255,255,0.022)),
      rgba(15, 23, 42, 0.62);
    box-shadow:
      0 26px 78px rgba(0, 0, 0, 0.22),
      0 0 34px rgba(16, 185, 129, 0.055),
      inset 0 1px 0 rgba(255,255,255,0.050);
    backdrop-filter: blur(18px) saturate(125%);
    -webkit-backdrop-filter: blur(18px) saturate(125%);
  }

  .deals-signal-card::after,
  .deals-kpi-card::after,
  .deals-panel::after,
  .deals-case-card::after,
  .deals-case-metric::after,
  .deals-state-card::after,
  .deals-command-item::after {
    content: "";
    position: absolute;
    inset: 1px;
    z-index: -1;
    border-radius: inherit;
    pointer-events: none;
    background:
      linear-gradient(
        135deg,
        rgba(255,255,255,0.050),
        transparent 36%,
        rgba(16,185,129,0.025) 100%
      );
    opacity: 0.8;
  }

  .deals-signal-card,
  .deals-kpi-card,
  .deals-panel,
  .deals-case-card,
  .deals-case-metric,
  .deals-command-item {
    transition:
      transform .18s ease,
      border-color .18s ease,
      box-shadow .18s ease,
      background .18s ease;
  }

  .deals-signal-card:hover,
  .deals-kpi-card:hover,
  .deals-case-card:hover,
  .deals-command-item:hover {
    transform: translateY(-3px);
    border-color: rgba(110, 231, 183, 0.24);
    box-shadow:
      0 34px 96px rgba(0, 0, 0, 0.28),
      0 0 44px rgba(16, 185, 129, 0.085),
      inset 0 1px 0 rgba(255,255,255,0.070);
  }

  .deals-icon-box,
  .deals-card-icon,
  .deals-panel-icon,
  .deals-state-icon {
    background:
      linear-gradient(135deg, rgba(16,185,129,0.16), rgba(37,99,235,0.09));
    border-color: rgba(16,185,129,0.24);
    color: #bbf7d0;
    box-shadow:
      0 0 20px rgba(16,185,129,0.13),
      inset 0 1px 0 rgba(255,255,255,0.065);
  }

  .deals-score-module {
    background:
      radial-gradient(circle at 0% 0%, rgba(16,185,129,0.12), transparent 42%),
      linear-gradient(135deg, rgba(255,255,255,0.060), rgba(255,255,255,0.022)),
      rgba(2, 6, 23, 0.34);
    border-color: rgba(16,185,129,0.14);
    box-shadow:
      0 18px 48px rgba(0,0,0,0.18),
      inset 0 1px 0 rgba(255,255,255,0.050);
  }

  .deals-score-ring {
    background:
      conic-gradient(
        rgba(16, 185, 129, 0.98) var(--score-angle),
        rgba(37, 99, 235, 0.22) var(--score-angle),
        rgba(255,255,255,0.08) 360deg
      );
    box-shadow:
      0 18px 44px rgba(0, 0, 0, 0.32),
      0 0 38px rgba(16, 185, 129, 0.18);
  }

  .deals-score-core {
    background:
      radial-gradient(circle at 50% 0%, rgba(16,185,129,0.08), transparent 48%),
      rgba(15, 23, 42, 0.98);
    border-color: rgba(255,255,255,0.10);
  }

  .deals-score-core strong {
    color: #bbf7d0;
    text-shadow: 0 0 18px rgba(16,185,129,0.18);
  }

  .deals-score-core strong.is-empty-score {
    color: rgba(226, 232, 240, 0.72);
    text-shadow: none;
  }

  .deals-signal-row {
    padding: 14px 0;
    border-top-color: rgba(148, 163, 184, 0.11);
  }

  .deals-signal-row strong {
    padding: 7px 10px;
    border-radius: 999px;
    background:
      linear-gradient(90deg, rgba(16,185,129,0.10), rgba(37,99,235,0.065));
    border: 1px solid rgba(16,185,129,0.15);
    color: rgba(226, 232, 240, 0.96);
    box-shadow: 0 0 16px rgba(16,185,129,0.055);
  }

  .deals-command-item strong,
  .deals-kpi-value,
  .deals-case-title,
  .deals-case-metric strong {
    color: rgba(248, 250, 252, 0.96);
  }

  .deals-kpi-value.text-success {
    color: #6ee7b7;
    text-shadow: 0 0 16px rgba(110,231,183,0.16);
  }

  .deals-command-item .kpi-label,
  .deals-kpi-card .kpi-label,
  .deals-case-metric .kpi-label {
    color: rgba(187, 247, 208, 0.92);
    text-shadow: 0 0 12px rgba(16,185,129,0.12);
  }

  .deals-panel {
    border-color: rgba(212, 175, 55, 0.16);
    background:
      radial-gradient(circle at 0% 0%, rgba(212, 175, 55, 0.105), transparent 32%),
      radial-gradient(circle at 100% 8%, rgba(16, 185, 129, 0.10), transparent 34%),
      linear-gradient(135deg, rgba(255,255,255,0.058), rgba(255,255,255,0.020)),
      rgba(15, 23, 42, 0.64);
  }

  .deals-case-card {
    border-left: 3px solid rgba(16,185,129,0.62);
  }

  .deals-case-card::before {
    content: "";
    position: absolute;
    left: 0;
    top: 24px;
    bottom: 24px;
    width: 3px;
    border-radius: 999px;
    background:
      linear-gradient(180deg, rgba(16,185,129,0.96), rgba(37,99,235,0.72));
    box-shadow: 0 0 16px rgba(16,185,129,0.20);
    pointer-events: none;
  }

  .deals-case-meta {
    color: rgba(203, 213, 225, 0.78);
  }

  .deals-case-metrics {
    margin-top: 24px;
  }

  .deals-case-metric {
    min-height: 96px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .deals-case-metric strong {
    font-size: 15px;
    line-height: 1.25;
  }

  .deals-state-card.warning {
    border-color: rgba(245, 158, 11, 0.24);
    background:
      radial-gradient(circle at 0% 0%, rgba(245,158,11,0.13), transparent 38%),
      linear-gradient(135deg, rgba(245,158,11,0.090), rgba(255,255,255,0.020)),
      rgba(15, 23, 42, 0.64);
  }

  .deals-state-card.success {
    border-color: rgba(16, 185, 129, 0.24);
    background:
      radial-gradient(circle at 0% 0%, rgba(16,185,129,0.13), transparent 38%),
      linear-gradient(135deg, rgba(16,185,129,0.090), rgba(255,255,255,0.020)),
      rgba(15, 23, 42, 0.64);
  }

  .deals-empty-wrap {
    background:
      radial-gradient(circle at 50% 0%, rgba(16,185,129,0.10), transparent 42%),
      linear-gradient(135deg, rgba(255,255,255,0.045), rgba(255,255,255,0.014)),
      rgba(15, 23, 42, 0.48);
    border-color: rgba(16,185,129,0.18);
    box-shadow:
      0 24px 70px rgba(0,0,0,0.20),
      inset 0 1px 0 rgba(255,255,255,0.045);
  }

  .deals-case-actions .button,
  .deals-actions .button {
    box-shadow:
      0 14px 34px rgba(0,0,0,0.22),
      inset 0 1px 0 rgba(255,255,255,0.055);
  }

  @media (max-width: 1280px) {
    .deals-page {
      width: 100%;
      overflow-x: hidden;
    }

    .deals-hero {
      overflow: hidden;
    }

    .deals-hero-layout {
      grid-template-columns: 1fr;
    }

    .deals-signal-card {
      max-width: none;
      justify-self: stretch;
    }

    .deals-grid-kpis,
    .deals-case-metrics {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  @media (min-width: 681px) and (max-width: 1100px) {
    .deals-hero,
    .deals-panel,
    .deals-case-card {
      max-width: 100%;
    }

    .deals-case-head {
      display: grid;
      grid-template-columns: minmax(0, 1fr);
    }

    .deals-case-actions {
      justify-content: flex-start;
    }
  }

  @media (max-width: 920px) {
    .deals-command-bar {
      grid-template-columns: 1fr;
    }

    .deals-section-header,
    .deals-case-head {
      align-items: flex-start;
      flex-direction: column;
    }

    .deals-case-actions {
      justify-content: flex-start;
    }
  }

  @media (max-width: 680px) {
    .deals-page {
      gap: 28px;
    }

    .deals-hero {
      padding: 26px;
      border-radius: 28px;
    }

    .deals-grid-kpis,
    .deals-case-metrics {
      grid-template-columns: 1fr;
    }

    .deals-kpi-card,
    .deals-panel,
    .deals-case-card {
      border-radius: 24px;
    }

    .deals-score-module {
      grid-template-columns: 1fr;
    }

    .deals-signal-row {
      grid-template-columns: 1fr;
      gap: 7px;
    }

    .deals-signal-row strong {
      text-align: left;
    }
  }
`;

export function DealsRepositoryPage() {
  const { can, isViewer } = useAuth();

  const {
    savedCases,
    updateSavedCases,
    refreshSavedCases,
    backendStatus,
    setFinancials,
    setSettings,
    settings
  } = useMAStore();

  const { pushToast } = useNotifications();
  const navigate = useNavigate();

  const canDeleteCase = can(PERMISSIONS.DELETE_MA_CASE);

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [deletingId, setDeletingId] = useState('');

  const safeSavedCases = Array.isArray(savedCases) ? savedCases : [];
  const latestCase = safeSavedCases[0] || null;
  const latestCurrency =
    latestCase?.settings?.reportCurrency || settings?.reportCurrency || 'EUR';
  const latestEquityValue = latestCase
    ? formatCurrency(latestCase.snapshot?.equityBase ?? 0, latestCurrency)
    : 'N/A';

  const repositoryHealth = getRepositoryHealth({
    count: safeSavedCases.length,
    backendStatus
  });

  const hasRepositoryScore = repositoryHealth.score !== null;
  const scoreAngle = `${(repositoryHealth.score ?? 0) * 3.6}deg`;

  function handleLoadCase(item) {
    if (!item?.financials) {
      pushToast('No se pudieron cargar los datos financieros del caso');
      return;
    }

    setFinancials(item.financials);

    if (item.settings) {
      setSettings(item.settings);
    }

    pushToast(isViewer ? 'Deal cargado en modo consulta' : 'Deal cargado');
    navigate('/ma/valuation');
  }

  async function handleDelete(id) {
    if (!canDeleteCase) {
      pushToast('No tienes permisos para eliminar deals');
      return;
    }

    if (!id) return;

    setDeletingId(id);

    try {
      const next = safeSavedCases.filter((item) => item.id !== id);

      await maCasesApi.remove(id);
      updateSavedCases(next);

      pushToast('Deal eliminado');
    } catch {
      const next = safeSavedCases.filter((item) => item.id !== id);
      updateSavedCases(next);

      pushToast('Deal eliminado en local');
    } finally {
      setDeletingId('');
    }
  }

  async function handleRefresh() {
    setIsRefreshing(true);

    try {
      await refreshSavedCases();
      pushToast('Deals sincronizados');
    } catch {
      pushToast('No se pudo sincronizar con backend');
    } finally {
      setIsRefreshing(false);
    }
  }

  return (
    <div className="page">
      <style>{dealsRepositoryCss}</style>

      <div className="deals-page">
        <section className="deals-hero ceos-ws-hero">
          <div className="deals-hero-layout">
            <div className="deals-hero-main">
              <div className="deals-badge-row">
                <Badge>M&A Workspace</Badge>
                <Badge>Private Deal Archive</Badge>
                {isViewer ? <Badge>Modo solo lectura</Badge> : null}
                {canDeleteCase ? (
                  <Badge>Eliminación permitida</Badge>
                ) : (
                  <Badge>Sin permiso de eliminación</Badge>
                )}
              </div>

              <h1 className="deals-title">
                Deals Repository.
                <span>Private continuity for every M&A case.</span>
              </h1>

              <p className="deals-copy">
                Histórico operativo de deals guardados con snapshot de
                valoración, score de calidad, múltiplo ajustado, sincronización
                backend/local y continuidad de análisis por organización.
              </p>

              <div className="deals-actions">
                <Button
                  variant="secondary"
                  onClick={handleRefresh}
                  disabled={isRefreshing || backendStatus?.isLoadingCases}
                >
                  <RefreshCw size={16} />
                  {isRefreshing || backendStatus?.isLoadingCases
                    ? 'Sincronizando...'
                    : 'Refrescar repositorio'}
                </Button>
              </div>

              <div className="deals-command-bar">
                <CommandItem
                  label="Repository size"
                  value={`${safeSavedCases.length} deals`}
                />

                <CommandItem
                  label="Latest deal"
                  value={latestCase?.name || 'N/A'}
                />

                <CommandItem
                  label="Repository posture"
                  value={repositoryHealth.posture}
                />
              </div>
            </div>

            <aside className="deals-signal-card">
              <div className="deals-signal-inner">
                <div className="deals-signal-top">
                  <div>
                    <div className="kpi-label">Repository Health</div>
                    <div className="deals-signal-title">
                      {repositoryHealth.title}
                    </div>
                  </div>

                  <div className="deals-icon-box">
                    <Archive size={21} />
                  </div>
                </div>

                <div className="deals-score-module">
                  <div
                    className="deals-score-ring"
                    style={{ '--score-angle': scoreAngle }}
                  >
                    <div className="deals-score-core">
                      <strong className={hasRepositoryScore ? '' : 'is-empty-score'}>
                        {hasRepositoryScore ? repositoryHealth.score : '—'}
                      </strong>
                    </div>
                  </div>

                  <div className="deals-score-copy">
                    <strong>{repositoryHealth.posture}</strong>

                    <p className="muted">
                      {repositoryHealth.description}
                    </p>
                  </div>
                </div>

                <div className="deals-signal-table">
                  <SignalRow
                    label="Deals stored"
                    value={safeSavedCases.length}
                  />

                  <SignalRow
                    label="Saved snapshot: adjusted equity"
                    value={latestEquityValue}
                  />

                  <SignalRow
                    label="Backend"
                    value={backendStatus?.error ? 'Local fallback' : 'Available'}
                  />

                  <SignalRow
                    label="Access"
                    value={canDeleteCase ? 'Manage' : 'Read-only'}
                  />
                </div>
              </div>
            </aside>
          </div>
        </section>

        <section className="deals-section">
          <SectionHeader
            kicker="Repository overview"
            icon={Database}
            title="Deal archive at a glance"
            description="Histórico privado de operaciones, último snapshot económico y estado de continuidad del repositorio."
          />

          <div className="deals-grid deals-grid-kpis">
            <KpiCard
              label="Deals guardados"
              value={safeSavedCases.length}
              description="Histórico disponible"
              icon={BriefcaseBusiness}
            />

            <KpiCard
              label="Último deal"
              value={latestCase?.name || 'N/A'}
              description="Caso más reciente"
              icon={FileSearch}
            />

            <KpiCard
              label="Saved adjusted equity"
              value={latestEquityValue}
              description="Saved valuation snapshot — not live engine"
              icon={TrendingUp}
              success
            />

            <KpiCard
              label="Sincronización"
              value={backendStatus?.error ? 'Local' : 'OK'}
              description="Estado backend/local"
              icon={ShieldCheck}
            />
          </div>
        </section>

        {backendStatus?.error ? (
          <StateCard tone="warning" icon={AlertTriangle}>
            Backend no disponible. El repositorio sigue funcionando con guardado
            local.
          </StateCard>
        ) : null}

        {backendStatus?.lastSyncAt ? (
          <StateCard tone="success" icon={CheckCircle2}>
            Última sincronización:{' '}
            {new Date(backendStatus.lastSyncAt).toLocaleString('es-ES')}
          </StateCard>
        ) : null}

        <section className="deals-panel">
          <div className="deals-panel-header">
            <div>
              <div className="deals-kicker">
                <LockKeyhole size={14} />
                Private archive
              </div>

              <h2 className="deals-panel-title">Private Deal Archive</h2>

              <p className="muted deals-panel-description">
                Consulta casos guardados, recupera snapshots y conserva
                continuidad ejecutiva entre sesiones.
              </p>
            </div>

            <div className="deals-panel-icon">
              <Database size={18} />
            </div>
          </div>

          {safeSavedCases.length === 0 ? (
            <div className="deals-empty-wrap">
              <EmptyState
                title="Repositorio sin deals guardados"
                description="Guarda un deal desde valoración para activar histórico y continuidad de análisis."
              />
            </div>
          ) : (
            <div className="deals-archive-list">
              {safeSavedCases.map((item) => {
                const currency =
                  item.settings?.reportCurrency ||
                  settings?.reportCurrency ||
                  'EUR';
                const equityValue = formatCurrency(
                  item.snapshot?.equityBase ?? 0,
                  currency
                );
                const evBase = formatCurrency(item.snapshot?.evBase ?? 0, currency);
                const normalizedEbitda = formatCurrency(
                  item.snapshot?.normalizedEbitda ?? 0,
                  currency
                );
                const netDebt = formatCurrency(
                  item.snapshot?.netDebt ?? 0,
                  currency
                );
                const qualityScore = Math.round(
                  item.snapshot?.qualityScore ?? 0
                );
                const adjustedMultiple = Number(
                  item.snapshot?.adjustedMultiple ?? 0
                ).toFixed(2);

                return (
                  <article key={item.id} className="deals-case-card">
                    <div className="deals-case-head">
                      <div>
                        <h3 className="deals-case-title">{item.name}</h3>

                        <p className="muted deals-case-meta">
                          {formatDate(item.createdAt)} · Saved adjusted equity{' '}
                          {equityValue}
                        </p>

                        <p className="muted deals-case-meta">
                          Quality Score {qualityScore}/100 · Múltiplo x
                          {adjustedMultiple}
                        </p>
                      </div>

                      <div className="deals-case-actions">
                        <Button
                          variant="secondary"
                          onClick={() => handleLoadCase(item)}
                        >
                          <ChevronRight size={16} />
                          {isViewer ? 'Ver deal' : 'Cargar deal'}
                        </Button>

                        {canDeleteCase ? (
                          <Button
                            variant="danger"
                            onClick={() => handleDelete(item.id)}
                            disabled={deletingId === item.id}
                          >
                            <Trash2 size={16} />
                            {deletingId === item.id
                              ? 'Eliminando...'
                              : 'Eliminar'}
                          </Button>
                        ) : null}
                      </div>
                    </div>

                    <div className="deals-case-metrics">
                      <CaseMetric
                        label="Saved adj. DSS EV"
                        value={evBase}
                      />
                      <CaseMetric label="EBITDA normalizado" value={normalizedEbitda} />
                      <CaseMetric label="Net Debt" value={netDebt} />
                      <CaseMetric label="Quality Score" value={`${qualityScore}/100`} />
                    </div>

                    <div className="deals-chip-row">
                      {item.snapshot?.riskLevel ? (
                        <Badge>{item.snapshot.riskLevel}</Badge>
                      ) : null}

                      <Badge>x{adjustedMultiple} multiple</Badge>
                      <Badge>{currency}</Badge>

                      {!canDeleteCase ? (
                        <Badge>Sin permiso de eliminación</Badge>
                      ) : null}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function CommandItem({ label, value }) {
  return (
    <div className="deals-command-item">
      <div className="kpi-label">{label}</div>
      <strong>{value}</strong>
    </div>
  );
}

function SignalRow({ label, value }) {
  return (
    <div className="deals-signal-row">
      <span className="muted">{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function KpiCard({ label, value, description, icon: Icon, success = false }) {
  return (
    <article className="deals-kpi-card">
      <div className="deals-kpi-top">
        <div>
          <div className="kpi-label">{label}</div>

          <div className={`deals-kpi-value ${success ? 'text-success' : ''}`}>
            {value}
          </div>
        </div>

        <div className="deals-card-icon">
          <Icon size={18} />
        </div>
      </div>

      <p className="muted">{description}</p>
    </article>
  );
}

function CaseMetric({ label, value }) {
  return (
    <div className="deals-case-metric">
      <div className="kpi-label">{label}</div>
      <strong>{value}</strong>
    </div>
  );
}

function SectionHeader({ kicker, icon: Icon, title, description }) {
  return (
    <div className="deals-section-header">
      <div>
        <div className="deals-kicker">
          <Icon size={14} />
          {kicker}
        </div>

        <h2>{title}</h2>

        <p className="muted">{description}</p>
      </div>
    </div>
  );
}

function StateCard({ children, tone = 'neutral', icon: Icon = Activity }) {
  const toneClass = tone === 'neutral' ? '' : tone;

  return (
    <div className={`deals-state-card ${toneClass}`.trim()}>
      <div className="deals-state-icon">
        <Icon size={18} />
      </div>

      <p className="muted">{children}</p>
    </div>
  );
}

function getRepositoryHealth({ count, backendStatus }) {
  if (count === 0) {
    return {
      score: null,
      title: 'Repository empty',
      posture: 'Build archive',
      description:
        'Todavía no hay deals guardados. Guarda un primer caso para activar el histórico y medir la salud del repositorio.'
    };
  }

  if (backendStatus?.error) {
    return {
      score: getLocalFallbackScore(count),
      title: 'Local repository mode',
      posture: 'Local fallback',
      description:
        'El repositorio tiene histórico, pero está operando en modo local. Conviene recuperar sincronización backend para persistencia completa.'
    };
  }

  if (backendStatus?.lastSyncAt) {
    return {
      score: getSyncedRepositoryScore(count),
      title: 'Repository synchronized',
      posture: 'Synced',
      description:
        'Los deals guardados están sincronizados y disponibles para continuidad de análisis.'
    };
  }

  return {
    score: getReadyRepositoryScore(count),
    title: 'Repository ready',
    posture: 'Ready',
    description:
      'El repositorio está preparado para cargar, consultar y mantener continuidad entre casos M&A.'
  };
}

function getSyncedRepositoryScore(count) {
  if (count >= 5) return 92;
  if (count >= 2) return 82;

  return 70;
}

function getReadyRepositoryScore(count) {
  if (count >= 5) return 88;
  if (count >= 2) return 78;

  return 70;
}

function getLocalFallbackScore(count) {
  if (count >= 5) return 72;
  if (count >= 2) return 65;

  return 55;
}

