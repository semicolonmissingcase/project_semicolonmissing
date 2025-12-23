/**
 * @file routes/chatRoutes.js
 * @description Chat Routes
 * 251218 v1.0.0 init
 */

import express from 'express';
import chatController from '../app/controllers/chat.controller.js';

const router = express.Router();

// 채팅방 생성 또는 조회
router.post('/rooms', chatController.createRoom);

// 채팅방 목록 조회
router.get('/rooms', chatController.getRooms);

// 채팅방 메시지 조회
router.get('/rooms/:roomId/messages', chatController.getMessages);

// 메시지 읽음 처리
router.put('/rooms/:roomId/read', chatController.markAsRead);

// 채팅방 나가기
router.put('/rooms/:roomId/leave', chatController.leaveRoom);

// 채팅방 닫기
router.put('/rooms/:roomId/close', chatController.closeRoom);

export default router;