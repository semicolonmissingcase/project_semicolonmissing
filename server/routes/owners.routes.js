/**
 * @file routes/owners.router.js
 * @description owners 관련 라우터
 * 251229 v1.0.0 jh init
 */

import express from 'express';
import validationHandler from '../app/middlewares/validations/validationHandler.js';
import ownersController from '../app/controllers/owner/owners.quotations.controller.js';
import ownerQuotationsShow from '../app/middlewares/validations/validatiors/owner/owner.quotations.show.js';
import authUserMiddleware from '../app/middlewares/auth/auth.user.middleware.js';
import uploadOwnerProfileImgMiddleware from '../app/middlewares/uploads/profileupload.middleware.js'
import ownerUserController from '../app/controllers/owner/owner.user.controller.js';

const ownersRouter = express.Router();

// TODO: 추후 authMiddleware 추가 필요 (Permission도 같이)
ownersRouter.get('/quotations/:id', ownerQuotationsShow, validationHandler , ownersController.show);
ownersRouter.post('/profile', authUserMiddleware, uploadOwnerProfileImgMiddleware, ownerUserController.uploadProfileImage)

export default ownersRouter;