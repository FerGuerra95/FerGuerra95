import { Router } from 'express';

import * as controller from '../controllers/reporting.controller.js';
import { PERMISSIONS, requirePermission } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { reportingValidator } from '../validators/reporting.validator.js';

const router = Router();

const readReporting = requirePermission(PERMISSIONS.READ_REPORTING);
const createReporting = requirePermission(PERMISSIONS.CREATE_REPORTING);
const updateReporting = requirePermission(PERMISSIONS.UPDATE_REPORTING);
const exportReporting = requirePermission(PERMISSIONS.EXPORT_REPORTING);

router.get('/dashboard', readReporting, controller.getDashboard);
router.get('/summary', readReporting, controller.getSummary);
router.get('/audit-trail', readReporting, controller.listAuditTrail);

router.get('/reports', readReporting, controller.listReports);
router.post('/reports', createReporting, validate(reportingValidator.body), controller.createReport);

router.get('/templates', readReporting, controller.listTemplates);
router.post('/templates', updateReporting, validate(reportingValidator.body), controller.createTemplate);

router.get('/versions', readReporting, controller.listVersions);
router.post('/versions', updateReporting, validate(reportingValidator.body), controller.createVersion);

router.get('/exports', readReporting, controller.listExports);
router.post('/exports', exportReporting, validate(reportingValidator.body), controller.createExport);

router.get('/board-pack', readReporting, controller.listBoardPack);
router.post('/board-pack', exportReporting, validate(reportingValidator.body), controller.createBoardPackReport);

router.get('/board-review-snapshots', readReporting, controller.listBoardReviewSnapshotRecords);
router.get('/board-review-snapshots/:id', readReporting, validate(reportingValidator.params), controller.getBoardReviewSnapshotRecord);
router.post('/board-review-snapshots', createReporting, validate(reportingValidator.boardReviewCreate), controller.createBoardReviewSnapshotRecord);
router.post('/board-review-snapshots/:id/mark-reviewed', updateReporting, validate(reportingValidator.boardReviewTransition), controller.markBoardReviewSnapshotReviewed);
router.post('/board-review-snapshots/:id/mark-internal-final', exportReporting, validate(reportingValidator.boardReviewInternalFinal), controller.markBoardReviewSnapshotInternalFinal);
router.post('/board-review-snapshots/:id/archive', updateReporting, validate(reportingValidator.boardReviewTransition), controller.archiveBoardReviewSnapshotRecord);
router.post('/board-review-snapshots/:id/revoke', updateReporting, validate(reportingValidator.boardReviewTransition), controller.revokeBoardReviewSnapshotRecord);

router.get('/schedules', readReporting, controller.listSchedules);
router.post('/schedules', updateReporting, validate(reportingValidator.body), controller.createSchedule);

router.get('/evidence', readReporting, controller.listEvidence);
router.post('/evidence', updateReporting, validate(reportingValidator.body), controller.createEvidence);

export default router;
