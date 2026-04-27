export const buildReviewDecision = (payload = {}) => ({
  id: payload.id || null,
  status: payload.status || 'pending',
  reviewerId: payload.reviewerId || null,
  ...payload
});
