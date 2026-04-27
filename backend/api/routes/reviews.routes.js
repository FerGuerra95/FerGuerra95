import { Router } from 'express';
import * as controller from '../controllers/reviews.controller.js';
import {
  PERMISSIONS,
  requirePermission
} from '../middlewares/auth.middleware.js';

const router = Router();

router.get(
  '/',
  requirePermission(PERMISSIONS.READ),
  controller.listReviews
);

router.post(
  '/',
  requirePermission(PERMISSIONS.CREATE_REVIEW),
  controller.createReviewDecision
);

router.get(
  '/:id',
  requirePermission(PERMISSIONS.READ),
  controller.getReviewById
);

router.patch(
  '/:id',
  requirePermission(PERMISSIONS.UPDATE_REVIEW),
  controller.updateReviewDecision
);

router.patch(
  '/:id/decide',
  requirePermission(PERMISSIONS.DECIDE_REVIEW),
  controller.decideReview
);

router.delete(
  '/:id',
  requirePermission(PERMISSIONS.DELETE_REVIEW),
  controller.deleteReviewDecision
);

export default router;