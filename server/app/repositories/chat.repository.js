/**
 * @file app/repositories/chat.repository.js
 * @description Chat Repository
 * 251222 v1.0.0 seon init
 */
import db from '../models/index.js';
import { Op } from 'sequelize';

const chatRepository = {
  /**
   * 견적 ID와 기사 ID로 기존 채팅방 조회
   */
  findByKeys: async (transaction, estimate_id, cleaner_id) => {
    return await db.ChatRoom.findOne({
      where: { 
        estimateId: estimate_id, 
        cleanerId: cleaner_id 
      },
      transaction
    });
  },

  /**
   * 새 채팅방 생성
   */
  create: async (transaction, data) => {
    return await db.ChatRoom.create({
      estimateId: data.estimate_id,
      cleanerId: data.cleaner_id,
      ownerId: data.owner_id,
      status: 'OPEN'
    }, { transaction });
  },

  /**
   * 사용자별 채팅방 목록 조회
   */
  findByUser: async (transaction, userId, userRole) => {
    const isOwner = userRole === 'owner';
    return await db.ChatRoom.findAll({
      where: {
        [isOwner ? 'ownerId' : 'cleanerId']: userId,
        // 나간 상태가 아닌(null인) 방만 조회
        [isOwner ? 'ownerLeavedAt' : 'cleanerLeavedAt']: null
      },
      include: [
        { model: db.Estimate, as: 'estimate' },
        { model: isOwner ? db.Cleaner : db.Owner, as: isOwner ? 'cleaner' : 'owner' }
      ],
      order: [['updatedAt', 'DESC']], 
      transaction
    });
  },

  /**
   * 메시지 저장 및 방 부활(LeavedAt 초기화)
   */
  createMessage: async (transaction, data) => {
    const message = await db.ChatMessage.create({
      chatRoomId: data.room_id,
      content: data.content,
      senderId: data.sender_id,
      senderType: data.sender_role,
      messageType: data.type || 'TEXT'
    }, { transaction });

    // 어느 한쪽이라도 메시지를 보내면 양쪽 모두 다시 목록에 보여야 하므로 null 처리
    await db.ChatRoom.update(
      { 
        ownerLeavedAt: null, 
        cleanerLeavedAt: null 
      }, 
      { where: { id: data.room_id }, transaction }
    );

    return message;
  },

  /**
   * 특정 방의 메시지 목록 조회
   */
  findMessagesByRoomId: async (transaction, room_id, limit = 50, offset = 0) => {
    return await db.ChatMessage.findAll({
      where: { chatRoomId: room_id },
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']],
      transaction
    });
  },

  /**
   * 방 나가기
   */
  updateLeavedAt: async (transaction, roomId, userRole) => {
    const field = userRole === 'owner' ? 'ownerLeavedAt' : 'cleanerLeavedAt';
    return await db.ChatRoom.update(
      { [field]: new Date() },
      { where: { id: roomId }, transaction }
    );
  },

  /**
   * 안읽은 메시지 카운트
   */
  getUnreadCount: async (transaction, room_id, user_id) => {
    return await db.ChatMessage.count({
      where: {
        chatRoomId: room_id,
        senderId: { [Op.ne] : user_id },
        isRead: 0
      },
      transaction
    });
  },

  /**
   * 읽음 처리 업데이트
   */
  markAsRead: async (transaction, room_id, user_id) => {
    return await db.ChatMessage.update(
      { isRead: 1 },
      {
        where: {
          chatRoomId: room_id,
          senderId: { [Op.ne]: user_id },
          isRead: 0
        },
        transaction
      }
    );
  }
};

export default chatRepository;