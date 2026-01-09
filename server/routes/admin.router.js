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
 
const adminRouter = express.Router();

adminRouter.post('/login', adminLoginValidator, validationHandler, adminController.adminLogin);
adminRouter.post('/logout', authMiddleware, validationHandler, adminController.adminLogout);
adminRouter.post('/reissue', adminController.reissue);
adminRouter.get('/monitoring', authMiddleware, adminDashboardController.getMonitoringData);

// bj 작업
adminRouter.get('/cleaners/profiles', authMiddleware, adminCleanersController.profileIndex);
adminRouter.get('/cleaners/profiles/statistics', authMiddleware, adminCleanersController.statisticsIndex);

export default adminRouter;