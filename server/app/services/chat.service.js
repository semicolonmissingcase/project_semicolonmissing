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
 */
async function createOrGetRoom(body) {
  return await db.sequelize.transaction(async t => {
    const { estimate_id, cleaner_id, owner_id } = body;

    // 기존 채팅방 확인
    let room = await chatRepository.findByKeys(t, estimate_id, cleaner_id);
    if (room) return { room, isNew: false };

    // 새 채팅방 생성 (기본 상태 'OPEN')
    room = await chatRepository.create(t, { estimate_id, cleaner_id, owner_id });
    return { room, isNew: true };
  });
}

/**
 * 사용자의 채팅방 목록 조회
 */
async function getRoomsByUser(userId, userRole) {
  return await db.sequelize.transaction(async t => {
    const rooms = await chatRepository.findByUser(t, userId, userRole);
    const roomsWithUnread = await Promise.all(rooms.map(async (room) => {
      const unreadCount = await chatRepository.getUnreadCount(t, room.id, userId);
      return { ...room.get({ plain: true }), unreadCount };
    }));

    return roomsWithUnread;
  });
}

/**
 * 채팅방 메시지 내역 조회 (페이징)
 */
async function getMessages(room_id, page = 1, limit = 50) {
  return await db.sequelize.transaction(async t => {
    const offset = (page - 1) * limit;
    return await chatRepository.findMessagesByRoomId(t, room_id, limit, offset);
  });
}

/**
 * 메시지 저장
 */
async function saveMessage(data) {
  return await db.sequelize.transaction(async t => {
    const { room_id, content, sender_id, sender_role, type = 'TEXT' } = data;

    if (!content || (type === 'TEXT' && !content.trim())) {
      throw myError('메시지 내용을 입력해주세요', BAD_REQUEST_ERROR);
    }

    const newMessage = await chatRepository.createMessage(t, {
      room_id,
      content,
      sender_id,
      sender_role,
      type
    });

    await db.ChatRoom.update(
      {
        owner_leaved_at: null,
        cleaner_leaved_at: null
      },
      {
        where: { id: room_id },
        transaction: t
      }
    );
    return newMessage;
  });
}

/**
 * 메시지 읽음 처리
 */
async function markAsRead(room_id, user_id) {
  return await db.sequelize.transaction(async t => {
    await chatRepository.markAsRead(t, room_id, user_id);
  });
}

/**
 * 채팅방 나가기 (나에게만 삭제 처리)
 */
async function leaveRoom(room_id, userRole) {
  return await db.sequelize.transaction(async t => {
    await chatRepository.updateLeavedAt(t, room_id, userRole);
  });
}

/**
 * 채팅방 닫기 (의뢰 기간 마감이나 견적 종료 시 닫는 처리)
 */
async function closeRoom(room_id) {
  return await db.sequelize.transaction(async t => {
    await db.ChatRoom.update(
      { status: 'CLOSED' },
      { where: { id: room_id }, transaction: t }
    );
  });
}

export default {
  createOrGetRoom,
  getRoomsByUser,
  getMessages,
  saveMessage,
  markAsRead,
  leaveRoom,
  closeRoom
};