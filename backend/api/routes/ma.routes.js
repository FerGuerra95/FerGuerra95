import express, { Router } from 'express';
import * as controller from '../controllers/ma.controller.js';
import {
  PERMISSIONS,
  requirePermission
} from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { maValidator } from '../validators/ma.validator.js';

const router = Router();
const vdrFileUploadParser = express.raw({
  type: '*/*',
  limit: '25mb'
});

router.get(
  '/cases',
  requirePermission(PERMISSIONS.READ),
  controller.listCases
);

router.post(
  '/cases',
  requirePermission(PERMISSIONS.CREATE_MA_CASE),
  validate(maValidator.create),
  controller.createCase
);

router.get(
  '/cases/:id',
  requirePermission(PERMISSIONS.READ),
  validate(maValidator.caseParams),
  controller.getCaseById
);

router.patch(
  '/cases/:id',
  requirePermission(PERMISSIONS.UPDATE_MA_CASE),
  validate(maValidator.update),
  controller.updateCase
);

router.delete(
  '/cases/:id',
  requirePermission(PERMISSIONS.DELETE_MA_CASE),
  validate(maValidator.caseParams),
  controller.deleteCase
);

router.post(
  '/cases/:id/snapshots',
  requirePermission(PERMISSIONS.UPDATE_MA_CASE),
  validate(maValidator.snapshot),
  (req, res, next) => {
    req.body = {
      ...(req.body || {}),
      caseId: req.params.id
    };

    return controller.runValuation(req, res, next);
  }
);

router.post(
  '/valuation/run',
  requirePermission(PERMISSIONS.CREATE_MA_CASE),
  validate(maValidator.runValuation),
  controller.runValuation
);

router.get(
  '/reports',
  requirePermission(PERMISSIONS.READ),
  controller.listReports
);

router.get(
  '/deals',
  requirePermission(PERMISSIONS.READ),
  controller.listDeals
);

router.post(
  '/deals',
  requirePermission(PERMISSIONS.CREATE_MA_DEAL),
  validate(maValidator.createDeal),
  controller.createDeal
);

router.patch(
  '/deals/:id',
  requirePermission(PERMISSIONS.UPDATE_MA_DEAL),
  validate(maValidator.updateDeal),
  controller.updateDeal
);

router.delete(
  '/deals/:id',
  requirePermission(PERMISSIONS.DELETE_MA_DEAL),
  validate(maValidator.dealParams),
  controller.deleteDeal
);

router.get(
  '/data-room',
  requirePermission(PERMISSIONS.READ),
  controller.listDataRoom
);

router.get(
  '/audit-logs',
  requirePermission(PERMISSIONS.READ_AUDIT_LOG),
  validate(maValidator.auditLogs),
  controller.listMaAuditLogs
);

router.post(
  '/data-room/documents',
  requirePermission(PERMISSIONS.MANAGE_MA_DATA_ROOM),
  validate(maValidator.createDataRoomDocument),
  controller.createDataRoomDocument
);

router.post(
  '/data-room/files',
  requirePermission(PERMISSIONS.MANAGE_MA_DATA_ROOM),
  vdrFileUploadParser,
  controller.uploadDataRoomFile
);

router.patch(
  '/data-room/documents/:id/governance',
  requirePermission(PERMISSIONS.MANAGE_MA_DATA_ROOM),
  validate(maValidator.updateDataRoomDocumentGovernance),
  controller.updateDataRoomDocumentGovernance
);

router.get(
  '/data-room/documents/:id/download',
  requirePermission(PERMISSIONS.READ),
  validate(maValidator.dataRoomDocumentParams),
  controller.downloadDataRoomDocument
);

router.post(
  '/reports/export',
  requirePermission(PERMISSIONS.CREATE_MA_REPORT),
  validate(maValidator.exportReport),
  controller.exportReport
);

router.post(
  '/reports/:id/share',
  requirePermission(PERMISSIONS.CREATE_MA_SHARE),
  validate(maValidator.createSecureShare),
  controller.createSecureShare
);

router.get(
  '/secure-shares/:id',
  requirePermission(PERMISSIONS.READ),
  validate(maValidator.secureShareParams),
  controller.getSecureShare
);

router.delete(
  '/secure-shares/:id',
  requirePermission(PERMISSIONS.REVOKE_MA_SHARE),
  validate(maValidator.secureShareParams),
  controller.revokeSecureShare
);

export default router;
