/**
 * @file routes/payments.router.js
 * @description 결제 관련 라우터
 * 251231 v1.0.0 jae init
 */

import express from 'express';
import authMiddleware from '../app/middlewares/auth/auth.middleware.js';
import paymentController from '../app/controllers/payment.controller.js';

const paymentsRouter = express.Router();

// 결제 준비
paymentsRouter.post('/ready', authMiddleware, paymentController.readyPayment);

// 결제 승인
paymentsRouter.post('/confirm', authMiddleware, paymentController.confirmPayment);

// 결제 취소
paymentsRouter.post('/cancel', authMiddleware, paymentController.cancelPayment);

export default paymentsRouter;