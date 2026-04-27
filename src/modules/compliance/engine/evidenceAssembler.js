function sortByNewest(items = []) {
  return [...items].sort((a, b) => {
    const dateA = new Date(a.createdAt || 0).getTime();
    const dateB = new Date(b.createdAt || 0).getTime();

    return dateB - dateA;
  });
}

function buildCitationLabel(evidence) {
  if (!evidence) return 'Sin evidencia';

  const sourceType = evidence.sourceType || 'manual';
  const language = evidence.language || 'es';
  const confidence = Math.round((Number(evidence.confidence) || 0) * 100);

  return `${sourceType.toUpperCase()} · ${language.toUpperCase()} · ${confidence}% confianza`;
}

export function getEvidenceForSupplier({
  supplierId,
  evidenceItems = []
}) {
  if (!supplierId) return [];

  return sortByNewest(
    evidenceItems.filter((item) => item.supplierId === supplierId)
  );
}

export function getEvidenceForAlert({
  alertId,
  evidenceItems = []
}) {
  if (!alertId) return [];

  return sortByNewest(
    evidenceItems.filter((item) => item.alertId === alertId)
  );
}

export function assembleEvidenceTimeline({
  supplier,
  alerts = [],
  evidenceItems = [],
  reviews = []
}) {
  if (!supplier) return [];

  const supplierAlerts = alerts.filter(
    (alert) => alert.supplierId === supplier.id
  );

  const supplierEvidence = evidenceItems.filter(
    (item) => item.supplierId === supplier.id
  );

  const supplierReviews = reviews.filter(
    (review) => review.supplierId === supplier.id
  );

  const alertEvents = supplierAlerts.map((alert) => ({
    id: `timeline_${alert.id}`,
    type: 'alert',
    title: alert.title,
    subtitle: alert.category,
    severity: alert.severity,
    status: alert.status,
    date: alert.createdAt,
    description: alert.description,
    source: alert.source
  }));

  const evidenceEvents = supplierEvidence.map((evidence) => ({
    id: `timeline_${evidence.id}`,
    type: 'evidence',
    title: evidence.title,
    subtitle: buildCitationLabel(evidence),
    severity: 'info',
    status: 'stored',
    date: evidence.createdAt,
    description:
      evidence.translatedExcerpt ||
      evidence.excerpt ||
      'Evidencia registrada sin extracto.',
    source: evidence.sourceUrl || evidence.sourceType
  }));

  const reviewEvents = supplierReviews.map((review) => ({
    id: `timeline_${review.id}`,
    type: 'review',
    title:
      review.status === 'decided'
        ? `Revisión ${review.decision}`
        : 'Revisión pendiente',
    subtitle: review.reviewer || 'Sin revisor asignado',
    severity:
      review.decision === 'validated'
        ? 'high'
        : review.decision === 'discarded'
          ? 'low'
          : 'medium',
    status: review.status,
    date: review.decidedAt || review.createdAt,
    description: review.notes || 'Sin notas de revisión.',
    source: 'Human review'
  }));

  return sortByNewest([
    ...alertEvents,
    ...evidenceEvents,
    ...reviewEvents
  ]);
}

export function buildEvidenceSummary({
  supplier,
  evidenceItems = [],
  alerts = [],
  reviews = []
}) {
  if (!supplier) {
    return {
      supplierId: '',
      totalEvidence: 0,
      totalAlerts: 0,
      pendingReviews: 0,
      validatedReviews: 0,
      averageConfidence: 0,
      coverageLabel: 'Sin proveedor seleccionado'
    };
  }

  const supplierEvidence = evidenceItems.filter(
    (item) => item.supplierId === supplier.id
  );

  const supplierAlerts = alerts.filter(
    (alert) => alert.supplierId === supplier.id
  );

  const supplierReviews = reviews.filter(
    (review) => review.supplierId === supplier.id
  );

  const totalConfidence = supplierEvidence.reduce((sum, item) => {
    return sum + (Number(item.confidence) || 0);
  }, 0);

  const averageConfidence =
    supplierEvidence.length > 0
      ? Math.round((totalConfidence / supplierEvidence.length) * 100)
      : 0;

  const pendingReviews = supplierReviews.filter(
    (review) => review.status === 'pending'
  ).length;

  const validatedReviews = supplierReviews.filter(
    (review) => review.decision === 'validated'
  ).length;

  let coverageLabel = 'Baja';
  if (supplierEvidence.length >= 3 && averageConfidence >= 70) {
    coverageLabel = 'Alta';
  } else if (supplierEvidence.length >= 1 && averageConfidence >= 50) {
    coverageLabel = 'Media';
  }

  return {
    supplierId: supplier.id,
    totalEvidence: supplierEvidence.length,
    totalAlerts: supplierAlerts.length,
    pendingReviews,
    validatedReviews,
    averageConfidence,
    coverageLabel
  };
}

export function buildSourceCitationList(evidenceItems = []) {
  return sortByNewest(evidenceItems).map((evidence) => ({
    id: evidence.id,
    title: evidence.title,
    label: buildCitationLabel(evidence),
    sourceUrl: evidence.sourceUrl,
    excerpt: evidence.translatedExcerpt || evidence.excerpt,
    createdAt: evidence.createdAt
  }));
}

export function buildEvidenceReportItems({
  supplier,
  alerts = [],
  evidenceItems = [],
  reviews = []
}) {
  if (!supplier) return [];

  const timeline = assembleEvidenceTimeline({
    supplier,
    alerts,
    evidenceItems,
    reviews
  });

  return timeline.map((event) => ({
    id: event.id,
    type: event.type,
    title: event.title,
    status: event.status,
    severity: event.severity,
    date: event.date,
    description: event.description,
    source: event.source
  }));
}