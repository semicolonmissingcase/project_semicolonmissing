/**
 * @file routes/auth.router.js
 * @description 인증 관련 라우터
 * 251222 v1.0.0 jae init
 */

import express from 'express';
import ownerLoginValidator from '../app/middlewares/validations/validatiors/auth/ownerLogin.validator.js';
import validationHandler from '../app/middlewares/validations/validationHandler.js';
import cleanerLoginValidator from '../app/middlewares/validations/validatiors/auth/cleanerLogin.validator.js';
import adminLoginValidator from '../app/middlewares/validations/validatiors/auth/adminLogin.validator.js';
import { ownerController } from '../app/controllers/auth/owner.controller.js';
import { cleanerController } from '../app/controllers/auth/cleaner.controller.js';
import { adminController } from '../app/controllers/auth/admin.controller.js';
 
const authRouter = express.Router();

authRouter.post('/login/owner', ownerLoginValidator, validationHandler, ownerController.ownerLogin);
authRouter.post('/login/cleaner', cleanerLoginValidator, validationHandler, cleanerController.cleanerLogin);
authRouter.post('/login/admin', adminLoginValidator, validationHandler, adminController.adminLogin);
authRouter.post('/reissue/owner', ownerController.reissue);
authRouter.post('/reissue/cleaner', cleanerController.reissue);
authRouter.post('/reissue/admin', adminController.reissue);

export default authRouter;