/**
 * @file routes/estimate.router.js
 * @description 견적서 관련 라우터
 * 260102 v1.0.0 CK init
 */

import express from 'express';
import ownerEstimateController from '../app/controllers/owner/owner.estimate.controller.js';
import authUserMiddleware from '../app/middlewares/auth/auth.user.middleware.js';
import ownerUserController from '../app/controllers/owner/owner.user.controller.js';

const estimateRouter = express.Router();

// 특정 예약 ID에 대한 견적 목록 조회
estimateRouter.get('/:reservationId/estimates', authUserMiddleware, ownerEstimateController.getEstimatesByReservationId);
// 특정 예약 ID에 대한 '수락' 상태의 견적 목록 조회
estimateRouter.get('/estimates/accepted', authUserMiddleware, ownerEstimateController.getAcceptedEstimatesByOwnerId)

export default estimateRouter;