/**
 * @file app/controllers/chat.controller.js
 * @description Chat Controller
 * 251219 v1.0.0 seon init
 */

import chatService from '../services/chat.service.js';
import { SUCCESS } from '../../configs/responseCode.config.js';

/**
 * 채팅방 생성 또는 조회
 * POST /api/chat/rooms
 */
async function createRoom(req, res, next) {
  try {
    const result = await chatService.createOrGetRoom(req.body);
    
    res.status(SUCCESS.status).json({
      code: SUCCESS.code,
      message: result.isNew ? '채팅방 생성 완료' : '기존 채팅방 조회 완료',
      data: result.room
    });
  } catch (error) {
    next(error);
  }
}

/**
 * 채팅방 목록 조회
 * GET /api/chat/rooms?userId=123&userRole=owner
 */
async function getRooms(req, res, next) {
  try {
    const { userId, userRole } = req.query;
    const rooms = await chatService.getRoomsByUser(parseInt(userId), userRole);
    
    res.status(SUCCESS.status).json({
      code: SUCCESS.code,
      message: '채팅방 목록 조회 완료',
      data: rooms
    });
  } catch (error) {
    next(error);
  }
}

/**
 * 채팅방 메시지 조회
 * GET /api/chat/rooms/:roomId/messages?page=1&limit=50
 */
async function getMessages(req, res, next) {
  try {
    const { roomId } = req.params;
    const { page = 1, limit = 50 } = req.query;
    
    const messages = await chatService.getMessages(
      parseInt(roomId),
      parseInt(page),
      parseInt(limit)
    );
    
    res.status(SUCCESS.status).json({
      code: SUCCESS.code,
      message: '메시지 조회 완료',
      data: messages
    });
  } catch (error) {
    next(error);
  }
}

/**
 * 메시지 읽음 처리
 * PUT /api/chat/rooms/:roomId/read
 */
async function markAsRead(req, res, next) {
  try {
    const { roomId } = req.params;
    const { userId } = req.body;
    
    await chatService.markAsRead(parseInt(roomId), userId);
    
    res.status(SUCCESS.status).json({
      code: SUCCESS.code,
      message: '읽음 처리 완료'
    });
  } catch (error) {
    next(error);
  }
}

/**
 * 채팅방 나가기
 * PUT /api/chat/rooms/:roomId/leave
 */
async function leaveRoom(req, res, next) {
  try {
    const { roomId } = req.params;
    const { userName } = req.body;
    
    await chatService.leaveRoom(parseInt(roomId), userName);
    
    res.status(SUCCESS.status).json({
      code: SUCCESS.code,
      message: '채팅방 나가기 완료'
    });
  } catch (error) {
    next(error);
  }
}

/**
 * 채팅방 닫기
 * PUT /api/chat/rooms/:roomId/close
 */
async function closeRoom(req, res, next) {
  try {
    const { roomId } = req.params;
    await chatService.closeRoom(parseInt(roomId));
    
    res.status(SUCCESS.status).json({
      code: SUCCESS.code,
      message: '채팅방 종료 완료'
    });
  } catch (error) {
    next(error);
  }
}

export default {
  createRoom,
  getRooms,
  getMessages,
  markAsRead,
  leaveRoom,
  closeRoom
};