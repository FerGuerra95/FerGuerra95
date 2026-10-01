import { buildRiskLevel } from './riskScoring.js';

export const SYNCHRONIZED_REPOSITORY_SCORE = 100;

export function formatRepositoryDealCount(count) {
  const n = Math.max(0, Number(count) || 0);
  return n === 1 ? '1 deal' : `${n} deals`;
}

export function getRepositoryAccessLabel({
  canDeleteCase = false,
  canEditCase = false
} = {}) {
  if (canDeleteCase) return 'Manage';
  if (canEditCase) return 'Edit';
  return 'Read-only';
}

export function getDealUpdatedAt(item) {
  return item?.updatedAt || item?.createdAt || null;
}

export function getDealPostureLabel(item) {
  const saved = item?.snapshot?.riskLevel;

  if (typeof saved === 'string' && saved.trim()) {
    return saved.trim();
  }

  if (saved && typeof saved === 'object' && saved.label) {
    const label = String(saved.label).trim();
    if (label) return label;
  }

  const qualityScore = Number(item?.snapshot?.qualityScore);

  if (Number.isFinite(qualityScore) && qualityScore > 0) {
    return buildRiskLevel(qualityScore).label;
  }

  return 'N/A';
}

export function getRepositoryHealth({ count, backendStatus } = {}) {
  const safeCount = Math.max(0, Number(count) || 0);

  if (safeCount === 0) {
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
      score: null,
      title: 'Local repository mode',
      posture: 'Local fallback',
      description:
        'La última lectura backend falló. El repositorio sigue visible en local; el anillo no representa sincronización.'
    };
  }

  if (backendStatus?.lastSyncAt) {
    return {
      score: SYNCHRONIZED_REPOSITORY_SCORE,
      title: 'Repository synchronized',
      posture: 'Synced',
      description:
        'Última lectura backend correcta. El anillo (100) confirma sincronización completada, no un porcentaje de deals ni un score de calidad.'
    };
  }

  return {
    score: null,
    title: 'Repository ready',
    posture: 'Ready',
    description:
      'El repositorio está preparado para cargar y consultar casos. Pendiente confirmar la última lectura backend.'
  };
}
