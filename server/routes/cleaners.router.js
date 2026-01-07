import express from 'express';
import cleanerReservationController from '../app/controllers/cleaner/cleaner.reservation.controller.js';
import authMiddleware from '../app/middlewares/auth/auth.middleware.js';
import cleanerQuotationsController from '../app/controllers/cleaner/cleaner.quotations.controller.js';
import cleanerAccountController from '../app/controllers/cleaner/cleaner.account.controller.js';

const cleanersRouter = express.Router();

cleanersRouter.get('/mypage/pending', authMiddleware, cleanerReservationController.getPendingJobs);

cleanersRouter.get('/quotations', authMiddleware, cleanerQuotationsController.index); // 최신 견적요청서 리스트 조회
cleanersRouter.get('/accountinfo', authMiddleware, cleanerAccountController.getCleanerAccounts);

export default cleanersRouter;
