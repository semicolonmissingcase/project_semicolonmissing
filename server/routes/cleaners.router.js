import express from 'express';
import cleanerReservationController from '../app/controllers/cleaner/cleaner.reservation.controller.js';
import authMiddleware from '../app/middlewares/auth/auth.middleware.js';

const cleanersRouter = express.Router();

cleanersRouter.get('/mypage/pending', authMiddleware, cleanerReservationController.getPendingJobs);
cleanersRouter.get('/mypage/today', authMiddleware, cleanerReservationController.getTodayJobs);
cleanersRouter.get('/mypage/qna', authMiddleware, cleanerReservationController.getCleanerInquiries );
export default cleanersRouter;