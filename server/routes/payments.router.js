/**
 * @file routes/payments.router.js
 * @description 결제 관련 라우터
 * 251231 v1.0.0 jae init
 */

import express from 'express';
import authUserMiddleware from '../app/middlewares/auth/auth.user.middleware.js';
import paymentController from '../app/controllers/payment.controller.js';

const paymentsRouter = express.Router();

// 결제 준비
paymentsRouter.post('/ready', authUserMiddleware, paymentController.readyPayment);

// 결제 승인
paymentsRouter.post('/confirm',authUserMiddleware, paymentController.confirmPayment);

export default paymentsRouter;