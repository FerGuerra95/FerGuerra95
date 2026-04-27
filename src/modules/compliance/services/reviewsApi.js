const STORAGE_KEY = 'compliance_reviews_api_v1';

function safeRead(fallback = []) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return fallback;

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
}

function safeWrite(value) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  } catch {
    // En modo local/demo, si falla localStorage, no bloqueamos la app.
  }
}

function createId(prefix = 'review') {
  return `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2, 8)}`;
}

export const reviewsApi = {
  list(fallback = []) {
    return safeRead(fallback);
  },

  saveAll(reviews = []) {
    safeWrite(reviews);
    return reviews;
  },

  getById(id, fallback = []) {
    const reviews = safeRead(fallback);
    return reviews.find((review) => review.id === id) || null;
  },

  listBySupplier(supplierId, fallback = []) {
    const reviews = safeRead(fallback);

    if (!supplierId) return reviews;

    return reviews.filter((review) => review.supplierId === supplierId);
  },

  listByAlert(alertId, fallback = []) {
    const reviews = safeRead(fallback);

    if (!alertId) return reviews;

    return reviews.filter((review) => review.alertId === alertId);
  },

  create(payload, fallback = []) {
    const reviews = safeRead(fallback);

    const review = {
      id: createId('review'),
      alertId: payload?.alertId || '',
      supplierId: payload?.supplierId || '',
      status: payload?.status || 'pending',
      reviewer: payload?.reviewer || '',
      decision: payload?.decision || '',
      notes: payload?.notes || '',
      createdAt: new Date().toISOString(),
      decidedAt: payload?.decidedAt || '',
      updatedAt: new Date().toISOString()
    };

    const next = [review, ...reviews];
    safeWrite(next);

    return review;
  },

  update(id, patch = {}, fallback = []) {
    const reviews = safeRead(fallback);

    const next = reviews.map((review) =>
      review.id === id
        ? {
            ...review,
            ...patch,
            updatedAt: new Date().toISOString()
          }
        : review
    );

    safeWrite(next);

    return next.find((review) => review.id === id) || null;
  },

  decide(id, payload = {}, fallback = []) {
    const reviews = safeRead(fallback);

    const next = reviews.map((review) =>
      review.id === id
        ? {
            ...review,
            status: 'decided',
            reviewer: payload.reviewer || 'Reviewer',
            decision: payload.decision || 'validated',
            notes: payload.notes || '',
            decidedAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        : review
    );

    safeWrite(next);

    return next.find((review) => review.id === id) || null;
  },

  reopen(id, fallback = []) {
    const reviews = safeRead(fallback);

    const next = reviews.map((review) =>
      review.id === id
        ? {
            ...review,
            status: 'pending',
            decision: '',
            decidedAt: '',
            updatedAt: new Date().toISOString()
          }
        : review
    );

    safeWrite(next);

    return next.find((review) => review.id === id) || null;
  },

  remove(id, fallback = []) {
    const reviews = safeRead(fallback);
    const next = reviews.filter((review) => review.id !== id);

    safeWrite(next);

    return {
      deleted: true,
      id
    };
  },

  removeBySupplier(supplierId, fallback = []) {
    const reviews = safeRead(fallback);
    const next = reviews.filter((review) => review.supplierId !== supplierId);

    safeWrite(next);

    return {
      deleted: true,
      supplierId
    };
  },

  removeByAlert(alertId, fallback = []) {
    const reviews = safeRead(fallback);
    const next = reviews.filter((review) => review.alertId !== alertId);

    safeWrite(next);

    return {
      deleted: true,
      alertId
    };
  },

  clear() {
    safeWrite([]);
    return [];
  }
};