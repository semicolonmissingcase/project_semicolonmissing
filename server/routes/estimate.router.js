/**
 * @file routes/estimate.router.js
 * @description 견적서 관련 라우터
 * 260102 v1.0.0 CK init
 */

import express from 'express';
import ownerEstimateController from '../app/controllers/owner/owner.estimate.controller.js';
import authUserMiddleware from '../app/middlewares/auth/auth.user.middleware.js';

const estimateRouter = express.Router();

estimateRouter.get('/:reservationId/estimates', authUserMiddleware, ownerEstimateController.getEstimatesByReservationId);

export default estimateRouter;