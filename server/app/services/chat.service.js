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
    const rooms = await chatRepository.findByUser( t, userId, userRole );

    return rooms.map(room => {
      const roomPlain = room.get ({plain: true});

      const isOwner = userRole === 'owner';
      const opponent = isOwner ? roomPlain.cleaner : roomPlain.owner;

      return {
        ...roomPlain,
        opponentName: opponent?.name || "탈퇴한 회원",
        lastMessage: roomPlain.chatMessages?.[0]?.content || "메시지가 없습니다.",
        lastMessageTime: roomPlain.chatMessages?.[0]?.createdAt || roomPlain.createdAt
      }
    })
  });
}

/**
 * 사용자의 채팅방 목록 조회
 */
async function getRoomsByUser(userId, userRole) {
  return await db.sequelize.transaction(async t => {
    const rooms = await chatRepository.findByUser(t, userId, userRole);
    
    // 데이터 가공
    const roomsWithDetails = await Promise.all(rooms.map(async (room) => {
      const roomPlain = room.get({ plain: true });
      const isOwner = /OWNER/i.test(String(userRole))
      
      // 상대방 객체 선택 (기존 include 구조 활용)
      const opponent = isOwner ? roomPlain.cleaner : roomPlain.owner;
      console.log(`[확인] 상대방 존재여부: ${!!opponent}, 이름: ${opponent?.name}`);
      // 최신 메시지 추출
      const lastMsgObj = roomPlain.chatMessages?.[0];

      return {
        ...roomPlain,
        opponentName: opponent?.name || "탈퇴한 회원",
        opponentAddress: isOwner ? opponent?.region : opponent?.address,
        lastMessage: roomPlain.chatMessages?.[0]?.content || "메시지가 없습니다.",
        lastMessageTime: roomPlain.chatMessages?.[0]?.createdAt || roomPlain.updatedAt,
        unreadCount: await chatRepository.getUnreadCount(t, roomPlain.id, userId)
      };
    }));

    return roomsWithDetails;
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
  if(!data.sender_role) {
    data.sender_role = data.role;
  }
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