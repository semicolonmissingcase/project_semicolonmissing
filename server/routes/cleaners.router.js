/**
 * @file routes/cleaners.router.js
 * @description cleaners 관련 라우터
 * 251229 v1.0.0 jh init
 */

import express from 'express';
import cleanerAdjustmentController from '../app/controllers/cleaner/cleaner.adjustment.controller.js';
import authUserMiddleware from '../app/middlewares/auth/auth.user.middleware.js';
import cleanersAdjustmentValidator from '../app/middlewares/validations/validatiors/cleaner/cleaner.adjustment.validators.js';
// import profileController from "../app/controllers/cleaner/cleaner.profile.controller.js";
// import { name, locations } from '../app/middlewares/validations/fields/cleaner/cleaner.profile.field.js';
// import multerMiddleware from '../app/middlewares/multer/multer.middleware.js';

const cleanersRouter = express.Router();

// cleanersRouter.get('/quotations', (req, res, next) => {
//   res.send('ttt');
//  });

cleanersRouter.get('/adjustment/history', authUserMiddleware, cleanerAdjustmentController.getAdjustmentHistory);
cleanersRouter.post('/adjustment/request', authUserMiddleware, cleanerAdjustmentController.requestAdjustment);

//  계좌 정보 관련 라우터 추가
cleanersRouter.get(
    '/accountedit/:id',
    authUserMiddleware,
    cleanerAdjustmentController.getAccountInfo // 조회 함수 연결
);
cleanersRouter.post(
 '/accountinfo',
 authUserMiddleware,
 //  saveAccountValidator가 배열을 반환한다고 가정하고 Spread Operator를 사용
 ...cleanersAdjustmentValidator.saveAccountValidator, 
 cleanerAdjustmentController.saveAccountInfo 
);

// cleanersRouter.patch('/profileedit', 
//    multerMiddleware.profileUploader.single('profile_image'), // 필드 이름 명시
//   [name, locations],
//   profileController.update
// );



export default cleanersRouter;