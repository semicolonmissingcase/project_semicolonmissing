/**
 * @file routes/cleaners.router.js
 * @description cleaners 관련 라우터
 * 251229 v1.0.0 jh init
 */

import express from 'express';
import cleanerAdjustmentController from '../app/controllers/cleaner/cleaner.adjustment.controller.js';
import authUserMiddleware from '../app/middlewares/auth/auth.user.middleware.js';
import cleanersAdjustmentValidator from '../app/middlewares/validations/validatiors/cleaner/cleaner.adjustment.validators.js';
import profileController from "../app/controllers/cleaner/cleaner.profile.controller.js";
import { name, locations } from "../fields/cleaner/cleaner.profile.field.js";
import upload from "../middlewares/cleaener/cleaner.multer.middleware.js";

const cleanersRouter = express.Router();

// cleanersRouter.get('/quotations/:id', (req, res, next) => {
//   res.send('ttt');
//  });

cleanersRouter.post('/accountinfo', authUserMiddleware, cleanersAdjustmentValidator.requestAdjustmentValidator, cleanerAdjustmentController.requestAdjustment);

cleanersRouter.patch('/edit', 
  upload.single('profile'),
  [name, locations], 
  profileController.update
);

export default cleanersRouter;