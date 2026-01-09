/**
 * @file routes/owners.router.js
 * @description owners 관련 라우터
 * 251229 v1.0.0 jh init
 */

import express from 'express';
import validationHandler from '../app/middlewares/validations/validationHandler.js';
import ownersController from '../app/controllers/owner/owners.quotations.controller.js';
import ownerQuotationsShow from '../app/middlewares/validations/validatiors/owner/owner.quotations.show.js';
import authMiddleware from '../app/middlewares/auth/auth.middleware.js';
import ownerUserController from '../app/controllers/owner/owner.user.controller.js';
import ownerLikeController from '../app/controllers/owner/owner.like.controller.js';
import { userController } from '../app/controllers/auth/user.controller.js';
import reservationImageUploader from '../app/middlewares/multer/uploaders/reservationImage.uploader.js';
import ownerInquiryController from '../app/controllers/owner/owner.inquiry.controller.js';

const ownersRouter = express.Router();

// ownersRouter.get('/questionslist', authUserMiddleware, ownerInquiryController.getQuestions); // 요청서 질문 조회
// TODO: 추후 authMiddleware 추가 필요 (Permission도 같이)
ownersRouter.get('/quotations/:id', ownerQuotationsShow, validationHandler , ownersController.show); // 견적요청서 상세 조회
ownersRouter.post('/quotations', authMiddleware, reservationImageUploader, ownersController.createReservation); // 견적요청서 작성
ownersRouter.get('/mypage/stats', authMiddleware, ownerUserController.getOwnerStats); // 점주 마이페이지 통계
ownersRouter.get('/reservations', authMiddleware, ownerUserController.getEstimateByOwnerId); // 점주 예약 완료 목록 조회
ownersRouter.post('/cleaners/:cleanerId/like', authMiddleware, ownerLikeController.toggleFavorite); // 기사님 좋아요
ownersRouter.get('/mypage/favorite-cleaners', authMiddleware, ownerLikeController.getFavoriteCleaners); // 찜한 기사님 조회
ownersRouter.put('/mypage/profile', authMiddleware, userController.updateOwner); // 점주 프로필 정보 수정

export default ownersRouter;