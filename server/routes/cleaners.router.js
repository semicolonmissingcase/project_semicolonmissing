import express from 'express';
import cleanerReservationController from '../app/controllers/cleaner/cleaner.reservation.controller.js';
import authUserMiddleware from '../app/middlewares/auth/auth.user.middleware.js';

const cleanersRouter = express.Router();

cleanersRouter.get('/mypage/pending', authUserMiddleware, cleanerReservationController.getPendingJobs);

export default cleanersRouter;