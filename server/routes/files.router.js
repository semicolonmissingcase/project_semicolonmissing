import express from 'express';
import multerMiddleware from '../app/middlewares/multer/multer.middleware.js';
import filesController from '../app/controllers/files.controller.js';

const filesRouter = express.Router()

// 의뢰서 이미지 업로드
filesRouter.post('/post', multerMiddleware.postUploader, filesController.storePost);

//유저 프로필용 이미지 업로드
filesRouter.post('/profile', multerMiddleware.profileUploader, filesController.storeProfile);

// 채팅 및 의뢰서용 이미지 업로드
filesRouter.post('/chat', multerMiddleware.chatUpload, filesController.storeChat);

export default filesRouter;