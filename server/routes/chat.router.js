import express from 'express';
import chatController from '../app/controllers/chat.controller.js';
import chatUpload from '../app/middlewares/multer/uploaders/chat.upload.js';
import authMiddleWare from '../app/middlewares/auth/auth.middleware.js';

const chatRouter = express.Router();

chatRouter.use(authMiddleWare);

// 방 목록 관련
chatRouter.route('/rooms')
  .get(chatController.getRooms)         // 목록 조회
  .post(chatController.createRoom);     // 생성 또는 조회

// 특정 방의 메시지 관련
chatRouter.route('/rooms/:roomId/messages')
  .get(chatController.getMessages)      // 메시지 내역 조회
  .post(chatController.chatSendMessage); // 메시지 전송

// 특정 방의 상태 변경
chatRouter.patch('/rooms/:roomId/read', chatController.markAsRead);
chatRouter.patch('/rooms/:roomId/leave', chatController.leaveRoom);
chatRouter.patch('/rooms/:roomId/close', chatController.closeRoom);

// 사이드바 및 부가 정보 조회
chatRouter.get('/rooms/:roomId/sidebar', chatController.getSidebarInfo);
chatRouter.get('/rooms/:roomId/reviews', chatController.getSidebarReviews);

// 파일 업로드
chatRouter.post('/rooms/:roomId/upload', chatUpload, chatController.chatUploadImage);

export default chatRouter;