import express from 'express';
import cleanerReservationController from '../app/controllers/cleaner/cleaner.reservation.controller.js';
import authMiddleware from '../app/middlewares/auth/auth.middleware.js';
import cleanerQuotationsController from '../app/controllers/cleaner/cleaner.quotations.controller.js';
import cleanerAccountController from '../app/controllers/cleaner/cleaner.account.controller.js';
import cleanerQuotationsValidator from '../app/middlewares/validations/validatiors/cleaner/cleaner.quotations.validator.js';
import validationHandler from '../app/middlewares/validations/validationHandler.js';
import cleanerProfileController from '../app/controllers/cleaner/cleaner.profile.controller.js';
import cleanerLocationsController from '../app/controllers/cleaner/cleaner.locations.controller.js';

const cleanersRouter = express.Router();

cleanersRouter.get('/mypage/pending', authMiddleware, cleanerReservationController.getPendingJobs);
cleanersRouter.get('/mypage/today', authMiddleware, cleanerReservationController.getTodayJobs);
cleanersRouter.get('/mypage/qna', authMiddleware, cleanerReservationController.getCleanerInquiries );
cleanersRouter.get('/mypage/reviews', authMiddleware, cleanerReservationController.getCleanerReviews);
cleanersRouter.get('/mypage/settlement', authMiddleware, cleanerReservationController.getSettlementSummary);
cleanersRouter.get('/mypage/job/:id', authMiddleware, cleanerReservationController.getJobDetail);
cleanersRouter.patch('/mypage/job/:id/status', authMiddleware, cleanerReservationController.updateReservationStatus);
cleanersRouter.patch('/mypage/job/:id/complete', authMiddleware, cleanerReservationController.completeJob);

// 기사님 신규 요청 /상세 요청 사항
cleanersRouter.get('/quotations', authMiddleware, cleanerQuotationsController.index); // 최신 견적요청서 리스트 조회
cleanersRouter.post('/quotations', authMiddleware, cleanerQuotationsValidator.quotationsStore, validationHandler, cleanerQuotationsController.store); // 견적 요청서 요청 확인 작성

// 기사님 정보/프로필 수정 작업라우터
cleanersRouter.get('/profile', authMiddleware, cleanerProfileController.getCleanerProfile); // 지역, 자격증 등 정보 불러오기
cleanersRouter.put('/mypage/info', authMiddleware, cleanerProfileController.updateInfo); // 기사 정보/프로필 수정
cleanersRouter.put('/mypage/password', authMiddleware, cleanerProfileController.changePassword); //기사 비밀번호 수정

// 기사님 계좌 조회/생성/수정/삭제
cleanersRouter.get(`/accountedit`, authMiddleware, cleanerAccountController.getAccounts); //계좌 조회
cleanersRouter.post(`/accountedit`, authMiddleware, cleanerAccountController.createAccount); // 계좌 생성
// cleanersRouter.patch(`/accountedit/:id`, authMiddleware, cleanerAccountController.createAccount); // 계좌 수정
cleanersRouter.delete(`/accountedit`, authMiddleware, cleanerAccountController.deleteAccount); // 계좌 삭제
// cleanersRouter.delete(`/accountedit/:id`, authMiddleware, cleanerAccountController.deleteAccount); // 계좌 삭제

// 지역 리스트 가져오기
cleanersRouter.get('/locations', authMiddleware, cleanerLocationsController.registerCleanerLocations);

export default cleanersRouter;
