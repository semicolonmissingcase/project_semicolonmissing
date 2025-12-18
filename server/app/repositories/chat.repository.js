/**
 * @file app/repositories/chat.repository.js
 * @description Chat Repository
 * 251218 v1.0.0 seon init
 */

import db from '../models/index.js';
const { ChatRoom, ChatMessage, User } = db;

/**
 * 채팅방 생성
 * @param {import("sequelize").Transaction|null} t 
 * @param {{estimate_id: number, cleaner_id: number}} data 
 * @returns {Promise<Object>}
 */
async function create(t = null, data) {
  return await ChatRoom.create(
    {
      estimate_id: data.estimate_id,
      cleaner_id: data.cleaner_id,
      status: 'ACTIVE'
    },
    { transaction: t }
  );
}

/**
 * 채팅방 조회 (estimate_id, cleaner_id로)
 * @param {import("sequelize").Transaction|null} t 
 * @param {number} estimate_id 
 * @param {number} cleaner_id 
 * @returns {Promise<Object|null>}
 */
async function findByKeys(t = null, estimate_id, cleaner_id) {
  return await ChatRoom.findOne({
    where: {
      estimate_id,
      cleaner_id,
      status: 'ACTIVE'
    },
    transaction: t
  });
}

/**
 * 채팅방 ID로 조회
 * @param {import("sequelize").Transaction|null} t 
 * @param {number} id 
 * @returns {Promise<Object|null>}
 */
async function findByPk(t = null, id) {
  return await ChatRoom.findByPk(id, { transaction: t });
}

/**
 * 점주의 채팅방 목록 조회
 * @param {import("sequelize").Transaction|null} t 
 * @param {number} owner_id 
 * @returns {Promise<Array>}
 */
async function findByOwner(t = null, owner_id) {
  return await ChatRoom.findAll({
    where: {
      owner_id,
      status: 'ACTIVE'
    },
    include: [
      {
        model: User,
        as: 'cleaner',
        attributes: ['id', 'name', 'profile_image']
      },
      {
        model: ChatMessage,
        as: 'messages',
        separate: true,
        limit: 1,
        order: [['created_at', 'DESC']],
        attributes: ['content', 'created_at']
      }
    ],
    order: [['updated_at', 'DESC']],
    transaction: t
  });
}

/**
 * 기사의 채팅방 목록 조회
 * @param {import("sequelize").Transaction|null} t 
 * @param {number} cleaner_id 
 * @returns {Promise<Array>}
 */
async function findByCleaner(t = null, cleaner_id) {
  return await ChatRoom.findAll({
    where: {
      cleaner_id,
      status: 'ACTIVE'
    },
    include: [
      {
        model: User,
        as: 'owner',
        attributes: ['id', 'name', 'profile_image']
      },
      {
        model: ChatMessage,
        as: 'messages',
        separate: true,
        limit: 1,
        order: [['created_at', 'DESC']],
        attributes: ['content', 'created_at']
      }
    ],
    order: [['updated_at', 'DESC']],
    transaction: t
  });
}

/**
 * 안읽은 메시지 개수 조회
 * @param {import("sequelize").Transaction|null} t 
 * @param {number} room_id 
 * @param {number} user_id 
 * @returns {Promise<number>}
 */
async function getUnreadCount(t = null, room_id, user_id) {
  return await ChatMessage.count({
    where: {
      room_id,
      sender_id: { [db.Sequelize.Op.ne]: user_id },
      is_read: false,
      deleted_at: null
    },
    transaction: t
  });
}

/**
 * 메시지 저장
 * @param {import("sequelize").Transaction|null} t 
 * @param {{room_id: number, content: string, sender_id: number, sender_role: string}} data 
 * @returns {Promise<Object>}
 */
async function createMessage(t = null, data) {
  return await ChatMessage.create(
    {
      room_id: data.room_id,
      content: data.content,
      sender_id: data.sender_id,
      sender_role: data.sender_role,
      is_read: false
    },
    { transaction: t }
  );
}

/**
 * 채팅방의 메시지 조회
 * @param {import("sequelize").Transaction|null} t 
 * @param {number} room_id 
 * @param {number} limit 
 * @param {number} offset 
 * @returns {Promise<Array>}
 */
async function findMessagesByRoomId(t = null, room_id, limit = 50, offset = 0) {
  return await ChatMessage.findAll({
    where: {
      room_id,
      deleted_at: null
    },
    order: [['created_at', 'ASC']],
    limit,
    offset,
    transaction: t
  });
}

/**
 * 메시지 읽음 처리
 * @param {import("sequelize").Transaction|null} t 
 * @param {number} room_id 
 * @param {number} user_id 
 * @returns {Promise<void>}
 */
async function markAsRead(t = null, room_id, user_id) {
  await ChatMessage.update(
    { is_read: true },
    {
      where: {
        room_id,
        sender_id: { [db.Sequelize.Op.ne]: user_id },
        is_read: false
      },
      transaction: t
    }
  );
}

/**
 * 채팅방 나가기 (시스템 메시지 저장)
 * @param {import("sequelize").Transaction|null} t 
 * @param {number} room_id 
 * @param {string} userName 
 * @returns {Promise<void>}
 */
async function leave(t = null, room_id, userName) {
  await ChatMessage.create(
    {
      room_id,
      content: `${userName}님이 채팅방을 나갔습니다.`,
      sender_id: 0,
      sender_role: 'system',
      is_read: true
    },
    { transaction: t }
  );
}

/**
 * 채팅방 닫기
 * @param {import("sequelize").Transaction|null} t 
 * @param {number} room_id 
 * @returns {Promise<void>}
 */
async function close(t = null, room_id) {
  await ChatRoom.update(
    { status: 'CLOSED' },
    {
      where: { id: room_id },
      transaction: t
    }
  );
}

export default {
  create,
  findByKeys,
  findByPk,
  findByOwner,
  findByCleaner,
  getUnreadCount,
  createMessage,
  findMessagesByRoomId,
  markAsRead,
  leave,
  close
};