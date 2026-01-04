/**
 * @file routes/cleaners.router.js
 * @description cleaners 관련 라우터
 * 251229 v1.0.0 jh init
 */

import express from 'express';
import cleanerAdjustmentController from '../app/controllers/cleaner/cleaner.adjustment.controller.js';
import authUserMiddleware from '../app/middlewares/auth/auth.user.middleware.js';
import cleanersAdjustmentValidator from '../app/middlewares/validations/validatiors/cleaner/cleaner.adjustment.validators.js';
import db from '../app/models/index.js';
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

cleanersRouter.get('/templates', async (req, res) => {
  try {
    console.log("템플릿 조회 API 시작"); // 서버 콘솔로그 확인용
    
    const cleanerId = 2; // DB에 실제로 존재하는 기사 ID
    
    const templates = await db.Template.findAll({
      where: { 
        cleanerId: cleanerId, // 모델에 정의된 camelCase 필드명
        deletedAt: null 
      }
    });

    res.json(templates);
  } catch (error) {
    res.status(500).json({ message: "템플릿 조회 실패", error: error.message });
  }
});

cleanersRouter.post('/quotations', async (req, res) => {
  try {
    const { reservationId, estimated_amount, description } = req.body;
    const cleanerId = req.user.id; 

    // Quotation 테이블에 데이터 저장
    const result = await db.Quotation.create({
      reservationId: reservationId,
      cleanerId: cleanerId,
      estimatedAmount: estimated_amount,
      description: description
    });

    // 예약 상태 업데이트 (필요한 경우)
    await db.Reservation.update(
      { status: 'QUOTED' }, 
      { where: { id: reservationId } }
    );

    res.status(201).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ message: "견적 제출 실패", error: error.message });
  }
});

export default cleanersRouter;