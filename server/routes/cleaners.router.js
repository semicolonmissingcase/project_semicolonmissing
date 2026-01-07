import express from 'express';
import cleanerReservationController from '../app/controllers/cleaner/cleaner.reservation.controller.js';
import authMiddleware from '../app/middlewares/auth/auth.middleware.js';
import cleanerAccountController from '../app/controllers/cleaner/cleaner.account.controller.js';

const cleanersRouter = express.Router();

cleanersRouter.get('/mypage/pending', authMiddleware, cleanerReservationController.getPendingJobs);
export default cleanersRouter;

cleanersRouter.get('/accountinfo', authMiddleware, cleanerAccountController.getCleanerAccounts);