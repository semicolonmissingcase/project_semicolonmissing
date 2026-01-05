/**
 * @file routes/owners.router.js
 * @description owners 관련 라우터
 * 251229 v1.0.0 jh init
 */

import express from 'express';
import validationHandler from '../app/middlewares/validations/validationHandler.js';
import ownersController from '../app/controllers/owner/owners.quotations.controller.js';
import ownerQuotationsShow from '../app/middlewares/validations/validatiors/owner/owner.quotations.show.js';
import authUserMiddleware from '../app/middlewares/auth/auth.user.middleware.js';
import ownerUserController from '../app/controllers/owner/owner.user.controller.js';
import ownerLikeController from '../app/controllers/owner/owner.like.controller.js';
import { userController } from '../app/controllers/auth/user.controller.js';
import reservationImageUploader from '../app/middlewares/multer/uploaders/reservationImage.uploader.js';

const ownersRouter = express.Router();

// TODO: 추후 authMiddleware 추가 필요 (Permission도 같이)
ownersRouter.get('/quotations', validationHandler, ownersController.index); // 견적요청서 조회
ownersRouter.post('/quotations', authUserMiddleware, reservationImageUploader, ownersController.createReservation); // 견적요청서 작성
ownersRouter.get('/mypage/stats', authUserMiddleware, ownerUserController.getOwnerStats); // 점주 마이페이지 통계
ownersRouter.get('/reservations', authUserMiddleware, ownerUserController.getEstimateByOwnerId); // 점주 예약 목록 조회
ownersRouter.post('/cleaners/:cleanerId/like', authUserMiddleware, ownerLikeController.toggleFavorite); // 기사님 좋아요
ownersRouter.get('/mypage/favorite-cleaners', authUserMiddleware, ownerLikeController.getFavoriteCleaners); // 찜한 기사님 조회
ownersRouter.put('/mypage/profile', authUserMiddleware, userController.updateOwner); // 점주 프로필 정보 수정

export default ownersRouter;