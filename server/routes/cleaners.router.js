import express from 'express';
import cleanerAdjustmentController from '../app/controllers/cleaner/cleaner.adjustment.controller.js';
import authCleanerMiddleware from '../app/middlewares/auth/auth.cleaner.middleware.js';
import cleanersAdjustmentValidator from '../app/middlewares/validations/validatiors/cleaner/cleaner.adjustment.validators.js';
import db from '../app/models/index.js';

const cleanersRouter = express.Router();

// 1. 템플릿 조회 (미들웨어 추가)
cleanersRouter.get('/templates', authCleanerMiddleware, async (req, res) => {
  try {
    const cleanerId = req.user.id; 
    const templates = await db.Template.findAll({
      where: { 
        cleanerId: cleanerId,
        deletedAt: null 
      }
    });
    res.json(templates);
  } catch (error) {
    res.status(500).json({ message: "템플릿 조회 실패", error: error.message });
  }
});

// 2. 견적 제출 (기존 /quotations 유지, 미들웨어 추가)
cleanersRouter.post('/quotations', authCleanerMiddleware, async (req, res) => {
  try {
    const { reservationId, estimatedAmount, description } = req.body;
    const cleanerId = req.user.id; 

    const result = await db.Quotation.create({
      reservationId,
      cleanerId,
      estimatedAmount,
      description
    });

    await db.Reservation.update(
      { status: 'QUOTED' }, 
      { where: { id: reservationId } }
    );

    res.status(201).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ message: "견적 제출 실패", error: error.message });
  }
});

// 3. 템플릿 신규 생성 (경로 수정: /cleaners 제거)
cleanersRouter.post('/templates', authCleanerMiddleware, async (req, res) => {
  try {
    const { estimatedAmount, description } = req.body;
    const cleanerId = req.user.id;

    const newTemplate = await db.Template.create({
      cleanerId,
      estimatedAmount,
      description
    });

    res.status(201).json({ success: true, data: newTemplate });
  } catch (error) {
    res.status(500).json({ message: "서버 내부 에러", error: error.message });
  }
});

// 4. 템플릿 수정 (경로 수정: /cleaners 제거)
cleanersRouter.put('/templates/:id', authCleanerMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { estimatedAmount, description } = req.body;

    await db.Template.update(
      { estimatedAmount, description },
      { where: { id, cleanerId: req.user.id } }
    );

    res.json({ success: true });
  } catch (error) {
    res.status(500).send("Update Error");
  }
});

// 5. 템플릿 삭제 (경로 수정: /cleaners 제거)
cleanersRouter.delete('/templates/:id', authCleanerMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    
    // DB에서 실제 삭제 또는 deletedAt 업데이트
    await db.Template.destroy({
      where: { id, cleanerId: req.user.id }
    });

    res.json({ success: true, id });
  } catch (error) {
    res.status(500).send("Delete Error");
  }
});

// 기타 정산 관련 라우터
cleanersRouter.get('/adjustment/history', authCleanerMiddleware, cleanerAdjustmentController.getAdjustmentHistory);
cleanersRouter.post('/adjustment/request', authCleanerMiddleware, cleanerAdjustmentController.requestAdjustment);
cleanersRouter.get('/accountedit/:id', authCleanerMiddleware, cleanerAdjustmentController.getAccountInfo);
cleanersRouter.post('/accountinfo', authCleanerMiddleware, ...cleanersAdjustmentValidator.saveAccountValidator, cleanerAdjustmentController.saveAccountInfo);

export default cleanersRouter;