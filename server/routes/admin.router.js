/**
 * @file routes/auth.router.js
 * @description 인증 관련 라우터
 * 251222 v1.0.0 jae init
 */

import express from 'express';
import adminLoginValidator from '../app/middlewares/validations/validatiors/auth/adminLogin.validator.js';
import validationHandler from '../app/middlewares/validations/validationHandler.js';
import { adminController } from '../app/controllers/auth/admin.controller.js';
import authMiddleware from '../app/middlewares/auth/auth.middleware.js';
import adminDashboardController from '../app/controllers/admin/admin.dashboard.controller.js';
import adminCleanersController from '../app/controllers/admin/admin.cleaners.controller.js';
import adminOwnersController from '../app/controllers/admin/admin.owners.controller.js';
import adminAdjustmentsController from '../app/controllers/admin/admin.adjustments.controller.js';
 
const adminRouter = express.Router();

adminRouter.post('/login', adminLoginValidator, validationHandler, adminController.adminLogin);
adminRouter.post('/logout', authMiddleware, validationHandler, adminController.adminLogout);
adminRouter.post('/reissue', adminController.reissue);
adminRouter.get('/monitoring', authMiddleware, adminDashboardController.getMonitoringData);

// bj 작업
adminRouter.get('/cleaners/profiles', authMiddleware, adminCleanersController.profileIndex);
adminRouter.get('/cleaners/profiles/statistics', authMiddleware, adminCleanersController.statisticsIndex);

// 유저 프로필 관리
adminRouter.get('/owners/profiles', authMiddleware, adminOwnersController.ownerProfileIndex);
adminRouter.get('/owners/profiles/statistics', authMiddleware, adminOwnersController.ownerStatisticsIndex);

// 정산 관리
adminRouter.get('/adjustments/view', authMiddleware, adminAdjustmentsController.adjustmentIndex);
adminRouter.get('/adjustments/view/statistics', authMiddleware, adminAdjustmentsController.adjustmentStatisticsIndex);
adminRouter.post('/adjustments/:id/status', authMiddleware, adminAdjustmentsController.updateAdjustmentStatus);

export default adminRouter;