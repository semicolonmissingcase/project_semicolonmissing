/**
 * @file routes/auth.router.js
 * @description 인증 관련 라우터
 * 251222 v1.0.0 jae init
 */

import express from 'express';
import adminLoginValidator from '../app/middlewares/validations/validatiors/auth/adminLogin.validator.js';
import validationHandler from '../app/middlewares/validations/validationHandler.js';
import { adminController } from '../app/controllers/auth/admin.controller.js';

 
const adminRouter = express.Router();

adminRouter.post('/login', adminLoginValidator, validationHandler, adminController.adminLogin);

export default adminRouter;