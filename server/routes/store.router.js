/**
 * @file routes/store.router.js
 * @description 매장 관리 라우터
 * 251229 v1.0.0 CK init
 */

import express from 'express';
import authMiddleware from '../app/middlewares/auth/auth.middleware.js';
import validationHandler from "../app/middlewares/validations/validationHandler.js";
import ownerStoreController from '../app/controllers/owner/owner.store.controller.js';
import createStoreValidator from '../app/middlewares/validations/validatiors/owner/store.create.validator.js';
import destroyStoreValidator from '../app/middlewares/validations/validatiors/owner/store.destroy.validator.js';

const storesRouter = express.Router();

storesRouter.post('/', authMiddleware, createStoreValidator, validationHandler, ownerStoreController.createStore); // 매장 생성
storesRouter.get('/', authMiddleware, ownerStoreController.getOwnerStores); // 매장 목록 조회
storesRouter.delete('/:storeId', authMiddleware, destroyStoreValidator, validationHandler, ownerStoreController.deleteStore); // 삭제

export default storesRouter;