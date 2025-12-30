import express from 'express';
import chatController from '../app/controllers/chat.controller.js';
// 이미지 업로드 import
import chatUpload from '../app/middlewares/chatUpload.middleware.js';
// 로그인 통합 인증 미들웨어 
import chatAuth from '../app/middlewares/chat.auth.middleware.js';

const chatRouter = express.Router();

chatRouter.use(chatAuth);

// 채팅방 생성 또는 조회
chatRouter.post('/rooms', chatController.createRoom);

// 채팅방 목록 조회
chatRouter.get('/rooms', chatController.getRooms);

// 채팅방 상세 메시지 조회
chatRouter.get('/rooms/:roomId/messages', chatController.getMessages);

// 채팅방에 메시지 보내기
chatRouter.post('/rooms/:roomId/messages', chatController.chatSendMessage);

// 사이드바 기본 정보 조회 (기사 프로필 / 의뢰 요약)
chatRouter.get('/rooms/:roomId/sidebar', chatController.getSidebarInfo);

// 사이드바 리뷰 목록 조회 (페이징 및 정렬)
chatRouter.get('/rooms/:roomId/reviews', chatController.getSidebarReviews);

// 이미지 업로드
chatRouter.post('/rooms/:roomId/upload', chatUpload.single('image'), chatController.chatUploadImage);

// 메시지 읽음 처리
chatRouter.patch('/rooms/:roomId/read', chatController.markAsRead);

// 채팅방 나가기
chatRouter.patch('/rooms/:roomId/leave', chatController.leaveRoom);

// 채팅방 닫기
chatRouter.patch('/rooms/:roomId/close', chatController.closeRoom);

export default chatRouter;