/**
 * @file routes/user.router.js
 * @description 회원가입 관련 라우터
 * 251205 v1.0.0 CK init
 */


import express from 'express';
import storeValidator from '../app/middlewares/validations/validators/users/store.validators.js';
import validationHandler from '../app/middlewares/validations/validationHandler.js';
import usersController from '../app/controllers/users.controller.js';

const usersRouter = express.Router();

usersRouter.post('/', storeValidator, validationHandler, usersController.store);

export default usersRouter;