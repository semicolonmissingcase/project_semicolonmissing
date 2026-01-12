/**
 * @file routes/banks.routes.js
 * @description banks 관련 라우터
 * 260112 v1.0.0 yh init
 */
import express from 'express';
import banksController from "../app/controllers/banks.controller.js";
import authMiddleware from '../app/middlewares/auth/auth.middleware.js';


const bankAccountRouter = express.Router();

bankAccountRouter.use(authMiddleware);

bankAccountRouter.get('/', banksController.banksIndex);

export default bankAccountRouter;