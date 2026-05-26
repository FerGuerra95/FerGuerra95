const DEFAULT_FALLBACK = 'N/A';

export function safeText(value, fallback = DEFAULT_FALLBACK) {
  if (value === null || value === undefined) {
    return fallback;
  }
  if (typeof value === 'number') {
    return Number.isFinite(value) ? String(value) : fallback;
  }
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed || /^(undefined|null|nan|infinity|-infinity)$/i.test(trimmed)) {
      return fallback;
    }
    return trimmed;
  }
  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No';
  }
  return String(value);
}

export function safeList(value) {
  if (!value) {
    return [];
  }
  return Array.isArray(value) ? value : [value];
}

export function safeDate(value) {
  if (!value) {
    return DEFAULT_FALLBACK;
  }
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) {
    return DEFAULT_FALLBACK;
  }
  return date.toISOString();
}

export function safeStatus(value) {
  return safeText(value, 'draft').replaceAll('_', ' ');
}

export function normalizeMissingData(value) {
  const list = safeList(value);
  if (list.length === 0) {
    return ['insufficient_data'];
  }
  return list.map((item) => {
    const text = safeText(item, 'insufficient_data');
    return text === DEFAULT_FALLBACK ? 'insufficient_data' : text;
  });
}

export function ensureNoInvalidNumber(value, fallback = DEFAULT_FALLBACK) {
  if (value === null || value === undefined || value === '') {
    return fallback;
  }
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : fallback;
  }
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed || /^(undefined|null|nan|infinity|-infinity)$/i.test(trimmed)) {
      return fallback;
    }
    return trimmed;
  }
  return value;
}

export function sanitizeSignal(signal) {
  const safeSignal = signal && typeof signal === 'object' ? signal : { label: signal };
  return {
    module: safeText(safeSignal.module || safeSignal.source, 'DSS'),
    label: safeText(safeSignal.label || safeSignal.title || safeSignal.name, 'Signal'),
    status: safeText(safeSignal.status || safeSignal.posture || safeSignal.value, 'insufficient_data'),
    score: ensureNoInvalidNumber(safeSignal.score),
    sourceLabel: safeText(safeSignal.sourceLabel || safeSignal.provenance, 'DSS snapshot')
  };
}
