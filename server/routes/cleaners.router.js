/**
 * @file routes/cleaners.router.js
 * @description cleaners 관련 라우터
 * 251229 v1.0.0 jh init
 */

import express from 'express';
import cleanerAdjustmentController from '../app/controllers/cleaner/cleaner.adjustment.controller.js';
import authUserMiddleware from '../app/middlewares/auth/auth.user.middleware.js';
import cleanersAdjustmentValidator from '../app/middlewares/validations/validatiors/cleaner/cleaner.adjustment.validators.js';

const cleanersRouter = express.Router();

// cleanersRouter.get('/quotations/:id', (req, res, next) => {
//   res.send('ttt');
//  });

cleanersRouter.post('/accountinfo', authUserMiddleware, cleanersAdjustmentValidator.requestAdjustmentValidator, cleanerAdjustmentController.requestAdjustment);

export default cleanersRouter;