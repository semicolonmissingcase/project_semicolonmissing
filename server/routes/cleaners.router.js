import express from 'express';
import cleanerReservationController from '../app/controllers/cleaner/cleaner.reservation.controller.js';
import authMiddleware from '../app/middlewares/auth/auth.middleware.js';
import cleanerQuotationsController from '../app/controllers/cleaner/cleaner.quotations.controller.js';
import cleanerAccountController from '../app/controllers/cleaner/cleaner.account.controller.js';
import cleanerQuotationsValidator from '../app/middlewares/validations/validatiors/cleaner/cleaner.quotations.validator.js';
import validationHandler from '../app/middlewares/validations/validationHandler.js';

const cleanersRouter = express.Router();

cleanersRouter.get('/mypage/pending', authMiddleware, cleanerReservationController.getPendingJobs);
cleanersRouter.get('/mypage/today', authMiddleware, cleanerReservationController.getTodayJobs);
cleanersRouter.get('/mypage/qna', authMiddleware, cleanerReservationController.getCleanerInquiries );
cleanersRouter.get('/mypage/reviews', authMiddleware, cleanerReservationController.getCleanerReviews);
cleanersRouter.get('/quotations', authMiddleware, cleanerQuotationsController.index); // 최신 견적요청서 리스트 조회
cleanersRouter.post('/quotations', authMiddleware, cleanerQuotationsValidator.quotationsStore, validationHandler, cleanerQuotationsController.store); // 견적 요청서 요청 확인 작성
cleanersRouter.get('/accountinfo', authMiddleware, cleanerAccountController.getCleanerAccounts);

export default cleanersRouter;
