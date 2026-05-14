import { Router } from 'express';

import * as controller from '../controllers/ecosystem.controller.js';
import {
  PERMISSIONS,
  requirePermission
} from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { ecosystemValidator } from '../validators/ecosystem.validator.js';

const router = Router();

router.get(
  '/hub-overview',
  requirePermission(PERMISSIONS.READ),
  controller.getExecutiveHubBrief
);

router.get(
  '/:branch/records',
  requirePermission(PERMISSIONS.READ),
  validate(ecosystemValidator.branchParams),
  controller.listRecords
);

router.post(
  '/:branch/records',
  requirePermission(PERMISSIONS.MANAGE_ECOSYSTEM_BRANCH),
  validate(ecosystemValidator.create),
  controller.createRecord
);

router.get(
  '/:branch/records/:id',
  requirePermission(PERMISSIONS.READ),
  validate(ecosystemValidator.recordParams),
  controller.getRecordById
);

router.patch(
  '/:branch/records/:id',
  requirePermission(PERMISSIONS.MANAGE_ECOSYSTEM_BRANCH),
  validate(ecosystemValidator.update),
  controller.updateRecord
);

router.delete(
  '/:branch/records/:id',
  requirePermission(PERMISSIONS.MANAGE_ECOSYSTEM_BRANCH),
  validate(ecosystemValidator.recordParams),
  controller.deleteRecord
);

export default router;
