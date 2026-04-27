import { Router } from 'express';
import * as controller from '../controllers/evidence.controller.js';
import {
  PERMISSIONS,
  requirePermission
} from '../middlewares/auth.middleware.js';

const router = Router();

router.get(
  '/',
  requirePermission(PERMISSIONS.READ),
  controller.listEvidence
);

router.post(
  '/',
  requirePermission(PERMISSIONS.CREATE_EVIDENCE),
  controller.createEvidence
);

router.get(
  '/:id',
  requirePermission(PERMISSIONS.READ),
  controller.getEvidenceById
);

router.patch(
  '/:id',
  requirePermission(PERMISSIONS.UPDATE_EVIDENCE),
  controller.updateEvidence
);

router.delete(
  '/:id',
  requirePermission(PERMISSIONS.DELETE_EVIDENCE),
  controller.deleteEvidence
);

export default router;