/**
 * @file app/repositories/chat.repository.js
 * @description Chat Repository
 * 251218 seon init
 */
import db from '../models/index.js';
import { Op } from 'sequelize';

const chatRepository = {
  /**
   * 견적 ID와 기사 ID로 기존 채팅방 조회
   */
  findByKeys: async (transaction, estimate_id, cleaner_id, owner_id) => {
    return await db.ChatRoom.findOne({
      where: { 
        estimateId: estimate_id, 
        cleanerId: cleaner_id,
        ownerId: owner_id
      },
      transaction
    });
  },

  /**
   * 새 채팅방 생성
   */
  create: async (transaction, { estimate_id, cleaner_id, owner_id }) => {
      return await db.ChatRoom.create({
        estimateId: estimate_id,
        cleanerId: cleaner_id,
        ownerId: owner_id,
        status: 'OPEN'
      }, { transaction });
    },

  /**
   * 사용자별 채팅방 목록 조회
   */
findByUser: async (transaction, userId, userRole) => {
  const roleStr = String(userRole || '').toUpperCase();
  const isOwner = roleStr.includes('OWNER');
  
  // 본인의 역할에 맞는 LeavedAt 컬럼이 null인 경우만 조회함
  const leavedAtField = isOwner ? 'ownerLeavedAt' : 'cleanerLeavedAt';

  return await db.ChatRoom.findAll({
    where: {
      [isOwner ? 'ownerId' : 'cleanerId']: userId,
      [leavedAtField]: null //
    },
    include: [
      { model: db.Estimate, as: 'estimate', required: false },
      { 
        model: isOwner ? db.Cleaner : db.Owner, 
        as: isOwner ? 'cleaner' : 'owner',
        required: false 
      },
      {
        model: db.ChatMessage,
        as: 'chatMessages',
        limit: 1,
        order: [['createdAt', 'DESC']]
      }
    ],
    order: [['updatedAt', 'DESC']], 
    transaction
  });
},

  /**
   * 메시지 저장 및 방 부활 (LeavedAt 초기화)
   */
  createMessage: async (transaction, data) => {
    const message = await db.ChatMessage.create({
      chatRoomId: data.room_id,
      content: data.content,
      senderId: data.sender_id,
      senderType: data.sender_role,
      messageType: data.type || 'TEXT'
    }, { transaction });

    // 어느 한쪽이라도 메시지를 보내면 양쪽 모두 다시 목록에 보여야 하므로 명시적 null 처리
    await db.ChatRoom.update(
      { 
        ownerLeavedAt: null, 
        cleanerLeavedAt: null,
        updatedAt: new Date() // 목록 최상단 노출을 위해 수동 갱신
      }, 
      { 
        where: { id: data.room_id }, 
        transaction 
      }
    );

    return message;
  },

  /**
   * 특정 방의 메시지 목록 조회
   */
findMessagesByRoomId: async (transaction, room_id, limit = 50, offset = 0) => {
  const messages = await db.ChatMessage.findAll({
    where: { chatRoomId: room_id },
    attributes: ['id', 'chatRoomId', 'content', 'senderId', 'senderType', 'messageType', 'isRead', 'createdAt'],
    limit: parseInt(limit),
    offset: parseInt(offset),
    order: [['createdAt', 'DESC']], 
    transaction
  });

  return messages.reverse(); 
},

  /**
   * 방 나가기 (나간 시점 기록)
   */
  updateLeavedAt: async (transaction, roomId, userRole) => {
    const roleStr = String(userRole || '').toUpperCase();
    const field = roleStr.includes('OWNER') ? 'ownerLeavedAt' : 'cleanerLeavedAt';
    
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
  markAsRead: async (transaction, room_id, user_id, user_role) => {
    if (!user_id || !user_role) return [0];

    const roleStr = String(user_role || '').toUpperCase();
    
    const result = await db.ChatMessage.update(
      { isRead: 1 },
      {
        where: {
          chatRoomId: room_id,
          isRead: 0,
          [Op.or]: [
            { senderId: { [Op.ne]: user_id } },
            { senderType: { [Op.ne]: roleStr } }
          ]
        },
        transaction
      }
    );

    return result;
  }
}

export default chatRepository;