import { Router } from 'express';
import * as controller from '../controllers/funding.controller.js';
import {
  PERMISSIONS,
  requirePermission
} from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { fundingValidator } from '../validators/funding.validator.js';

const router = Router();

router.get(
  '/rounds',
  requirePermission(PERMISSIONS.READ),
  validate(fundingValidator.roundsQuery),
  controller.listRounds
);

router.post(
  '/rounds',
  requirePermission(PERMISSIONS.CREATE_FUNDING_SNAPSHOT),
  validate(fundingValidator.roundBody),
  controller.createRound
);

router.get(
  '/rounds/:id',
  requirePermission(PERMISSIONS.READ),
  validate(fundingValidator.roundParams),
  controller.getRoundById
);

router.put(
  '/rounds/:id',
  requirePermission(PERMISSIONS.CREATE_FUNDING_SNAPSHOT),
  validate(fundingValidator.roundUpdate),
  controller.updateRound
);

router.delete(
  '/rounds/:id',
  requirePermission(PERMISSIONS.CREATE_FUNDING_SNAPSHOT),
  validate(fundingValidator.roundParams),
  controller.deleteRound
);

router.get(
  '/summary',
  requirePermission(PERMISSIONS.READ),
  controller.getRoundSummary
);

router.get(
  '/snapshots',
  requirePermission(PERMISSIONS.READ),
  controller.listSnapshots
);

router.post(
  '/snapshots',
  requirePermission(PERMISSIONS.CREATE_FUNDING_SNAPSHOT),
  validate(fundingValidator.snapshotBody),
  controller.createSnapshot
);

router.get(
  '/snapshots/:id',
  requirePermission(PERMISSIONS.READ),
  validate(fundingValidator.snapshotParams),
  controller.getSnapshotById
);

router.get(
  '/snapshots/:id/ledger-export',
  requirePermission(PERMISSIONS.READ),
  validate(fundingValidator.snapshotParams),
  controller.exportSnapshotLedger
);

router.get(
  '/hub-overview',
  requirePermission(PERMISSIONS.READ),
  controller.getHubOverview
);

export default router;
