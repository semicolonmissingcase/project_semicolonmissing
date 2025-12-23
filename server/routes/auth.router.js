/**
 * @file routes/auth.router.js
 * @description 인증 관련 라우터
 * 251222 v1.0.0 jae init
 */

import express from 'express';
import ownerLoginValidator from '../app/middlewares/validations/validatiors/auth/ownerLogin.validator.js';
import validationHandler from '../app/middlewares/validations/validationHandler.js';
import { authController } from '../app/controllers/auth.controller.js';
import cleanerLoginValidator from '../app/middlewares/validations/validatiors/auth/cleanerLogin.validator.js';
import adminLoginValidator from '../app/middlewares/validations/validatiors/auth/adminLogin.validator.js';

const authRouter = express.Router();

authRouter.post('/login/owner', ownerLoginValidator, validationHandler, authController.ownerLogin);
authRouter.post('/login/cleaner', cleanerLoginValidator, validationHandler, authController.cleanerLogin);
authRouter.post('/login/admin', adminLoginValidator, validationHandler, authController.adminLogin);

export default authRouter;