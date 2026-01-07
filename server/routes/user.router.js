/**
 * @file routes/user.router.js
 * @description 회원가입 관련 라우터
 * 251223 v1.0.0 CK init
 */

import express from 'express';
import ownerUserController from "../app/controllers/owner/owner.user.controller.js";
import validationHandler from "../app/middlewares/validations/validationHandler.js";
import ownerUserValidators from '../app/middlewares/validations/validatiors/owner/owner.user.validators.js';
import cleanersLocationsController from "../app/controllers/cleaner/cleaner.locations.controller.js";
import cleanerUserValidators from '../app/middlewares/validations/validatiors/cleaner/cleaner.user.validators.js';
import cleanerUserController from '../app/controllers/cleaner/cleaner.user.controller.js';

const usersRouter = express.Router();

// 점주 회원가입
usersRouter.post('/owner', ownerUserValidators, validationHandler, ownerUserController.registerOwner);

// 기사 회원가입(지역 불러오기)
usersRouter.get('/cleaner', cleanersLocationsController.registerCleanerLocations);
usersRouter.post('/cleaner', cleanerUserValidators, validationHandler, cleanerUserController.registerCleaner);

export default usersRouter;