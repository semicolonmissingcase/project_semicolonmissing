import express from 'express';
import chatController from '../app/controllers/chat.controller.js';
// TODO 이미지 업로드 import
import chatUpload from '../app/middlewares/chatUpload.middleware.js'; 

const chatRouter = express.Router();

// 채팅방 생성 또는 조회
chatRouter.post('/rooms', chatController.createRoom);
// chatRouter.post('/rooms/:roomId/messages', chatController.chatSendMessage);

// 채팅방 목록 조회
chatRouter.get('/rooms', chatController.getRooms);

// 채팅방 메시지 조회
chatRouter.get('/rooms/:roomId/messages', chatController.getMessages);

// 이미지 업로드 라우트 (multer 사용 시)
chatRouter.post('/rooms/:roomId/upload', chatUpload.single('image'), chatController.chatUploadImage);

// 메시지 읽음 처리
chatRouter.put('/rooms/:roomId/read', chatController.markAsRead);

// 채팅방 나가기
chatRouter.put('/rooms/:roomId/leave', chatController.leaveRoom);

// 채팅방 닫기
chatRouter.put('/rooms/:roomId/close', chatController.closeRoom);

export default chatRouter;