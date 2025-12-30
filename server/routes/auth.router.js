/**
 * @file routes/auth.router.js
 * @description 인증 관련 라우터
 * 251222 v1.0.0 jae init
 */

import express from 'express';
import loginValidator from '../app/middlewares/validations/validatiors/auth/login.validator.js';
import validationHandler from '../app/middlewares/validations/validationHandler.js';
import adminLoginValidator from '../app/middlewares/validations/validatiors/auth/adminLogin.validator.js';
import { userController } from '../app/controllers/auth/user.controller.js';
import { adminController } from '../app/controllers/auth/admin.controller.js';
import authUserMiddleware from '../app/middlewares/auth/auth.user.middleware.js';
import socialValidator from '../app/middlewares/validations/validatiors/auth/social.validator.js';
 
const authRouter = express.Router();

authRouter.post('/login', loginValidator, validationHandler, userController.login);
authRouter.post('/logout', authUserMiddleware, validationHandler, userController.logout);
authRouter.post('/login/admin', adminLoginValidator, validationHandler, adminController.adminLogin);
authRouter.post('/reissue', userController.reissue);
authRouter.post('/reissue/admin', adminController.reissue);
authRouter.get('/social/:provider', socialValidator, validationHandler, userController.social);
authRouter.get('/callback/:provider', userController.socialCallback);
authRouter.post('/signup/complete', userController.completeSignup);

export default authRouter;