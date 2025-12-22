/**
 * @file app/services/chat.service.js
 * @description Chat Service
 * 251218 v1.0.0 seon init
 */

import chatRepository from '../repositories/chat.repository.js';
import myError from '../errors/customs/my.error.js';
import { BAD_REQUEST_ERROR } from '../../configs/responseCode.config.js';
import db from '../models/index.js';

// -----------------------
// Public
// -----------------------

/**
 * 채팅방 생성 또는 조회
 * @param {{estimate_id: number, cleaner_id: number}} body 
 * @returns {Promise<{room: Object, isNew: boolean}>}
 */
async function createOrGetRoom(body) {
  return await db.sequelize.transaction(async t => {
    const { estimate_id, cleaner_id, owner_id } = body;

    // 기존 채팅방 확인
    let room = await chatRepository.findByKeys(t, estimate_id, cleaner_id);

    if (room) {
      return { room, isNew: false };
    }

    // 새 채팅방 생성
    room = await chatRepository.create(t, { estimate_id, cleaner_id, owner_id, status: 'OPEN' });
    return { room, isNew: true };
  });
}

/**
 * 사용자의 채팅방 목록 조회
 * @param {number} userId 
 * @param {string} userRole - 'owner' | 'cleaner'
 * @returns {Promise<Array>}
 */
async function getRoomsByUser(userId, userRole) {
  return await db.sequelize.transaction(async t => {
    let rooms;
    
    if (userRole === 'owner') {
      rooms = await chatRepository.findByOwner(t, userId);
    } else if (userRole === 'cleaner') {
      rooms = await chatRepository.findByCleaner(t, userId);
    } else {
      throw myError('잘못된 사용자 역할', BAD_REQUEST_ERROR);
    }

    // 각 채팅방의 안읽은 메시지 개수 추가
    for (let room of rooms) {
      room.unreadCount = await chatRepository.getUnreadCount(t, room.id, userId);
    }

    return rooms;
  });
}

/**
 * 채팅방 메시지 조회
 * @param {number} room_id 
 * @param {number} page 
 * @param {number} limit 
 * @returns {Promise<Array>}
 */
async function getMessages(room_id, page = 1, limit = 50) {
  return await db.sequelize.transaction(async t => {
    const offset = (page - 1) * limit;
    return await chatRepository.findMessagesByRoomId(t, room_id, limit, offset);
  });
}

/**
 * 메시지 저장 (Socket.io에서 호출)
 * @param {{room_id: number, content: string, sender_id: number, sender_role: string}} data 
 * @returns {Promise<Object>}
 */
async function saveMessage(data) {
  return await db.sequelize.transaction(async t => {
    const { room_id, content, sender_id, sender_role } = data;

    // 빈 메시지 체크
    if (!content || !content.trim()) {
      throw myError('메시지를 입력해주세요', BAD_REQUEST_ERROR);
    }

    // 메시지 저장
    return await chatRepository.createMessage(t, {
      room_id,
      content,
      sender_id,
      sender_role
    });
  });
}

/**
 * 메시지 읽음 처리
 * @param {number} room_id 
 * @param {number} user_id 
 * @returns {Promise<void>}
 */
async function markAsRead(room_id, user_id) {
  return await db.sequelize.transaction(async t => {
    await chatRepository.markAsRead(t, room_id, user_id);
  });
}

/**
 * 채팅방 정보 조회
 * @param {number} room_id 
 * @returns {Promise<Object|null>}
 */
async function getRoomInfo(room_id) {
  return await db.sequelize.transaction(async t => {
    return await chatRepository.findByPk(t, room_id);
  });
}

/**
 * 채팅방 나가기 (시스템 메시지)
 * @param {number} room_id 
 * @param {string} userName 
 * @returns {Promise<void>}
 */
async function leaveRoom(room_id, userName) {
  return await db.sequelize.transaction(async t => {
    await chatRepository.leave(t, room_id, userName);
  });
}

/**
 * 채팅방 닫기
 * @param {number} room_id 
 * @returns {Promise<void>}
 */
async function closeRoom(room_id) {
  return await db.sequelize.transaction(async t => {
    await chatRepository.close(t, room_id);
  });
}

export default {
  createOrGetRoom,
  getRoomsByUser,
  getMessages,
  saveMessage,
  markAsRead,
  getRoomInfo,
  leaveRoom,
  closeRoom
};