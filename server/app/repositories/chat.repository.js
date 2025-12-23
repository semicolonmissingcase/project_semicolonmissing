/**
 * @file app/repositories/chat.repository.js
 * @description Chat Repository (DB Access)
 * 251222 v1.0.0 seon init
 */
import db from '../models/index.js';

const chatRepository = {
  /**
   * 1. 견적 ID와 기사 ID로 기존 채팅방 조회
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
   * 2. 새 채팅방 생성
   */
  create: async (transaction, data) => {
    // 주의: ChatRoom 모델 정의 시 ownerId가 allowNull: false이므로 
    // 서비스에서 ownerId도 함께 넘겨주도록 보완이 필요할 수 있습니다.
    return await db.ChatRoom.create({
      estimateId: data.estimate_id,
      cleanerId: data.cleaner_id,
      ownerId: data.owner_id || 1, // 임시로 1번 점주 (실제론 서비스에서 받아와야 함)
      status: 'OPEN'
    }, { transaction });
  },

  /**
   * 3. 메시지 저장
   */
  createMessage: async (transaction, data) => {
    return await db.ChatMessage.create({
      chatRoomId: data.room_id,
      content: data.content,
      senderId: data.sender_id,
      senderType: data.sender_role // 모델의 senderType(또는 senderTye) 컬럼명 확인
    }, { transaction });
  },

  /**
   * 4. 특정 방의 메시지 목록 조회 (페이징)
   */
  findMessagesByRoomId: async (transaction, room_id, limit, offset) => {
    return await db.ChatMessage.findAll({
      where: { chatRoomId: room_id },
      limit,
      offset,
      order: [['createdAt', 'DESC']], // 최신순
      transaction
    });
  },

  /**
   * 5. 안읽은 메시지 개수 카운트
   */
  getUnreadCount: async (transaction, room_id, user_id) => {
    return await db.ChatMessage.count({
      where: {
        chatRoomId: room_id,
        senderId: { [db.Sequelize.Op.ne]: user_id }, // 내가 보낸 게 아닌 것
        isRead: 0
      },
      transaction
    });
  },

  /**
   * 6. 읽음 처리 업데이트
   */
  markAsRead: async (transaction, room_id, user_id) => {
    return await db.ChatMessage.update(
      { isRead: 1 },
      {
        where: {
          chatRoomId: room_id,
          senderId: { [db.Sequelize.Op.ne]: user_id },
          isRead: 0
        },
        transaction
      }
    );
  }
};

export default chatRepository;