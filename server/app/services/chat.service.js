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
 * @param {Object} - { owner_id, cleaner_id, estimate_id }
 */
async function createOrGetRoom({ owner_id, cleaner_id, estimate_id }) {
  
  return await db.sequelize.transaction(async (t) => {
    let room = await db.ChatRoom.findOne({
      where: {
        estimateId: estimate_id,
        ownerId: owner_id,
        cleanerId: cleaner_id
      },
      transaction: t
    });

    let isNew = false;

    if (!room) {
      room = await db.ChatRoom.create({
        estimateId: estimate_id,
        ownerId: owner_id,
        cleanerId: cleaner_id,
        status: 'OPEN'
      }, { transaction: t });
      isNew = true;
    }

    return {
      room: room.get({ plain: true }),
      isNew: isNew
    };
  });
}

/**
 * 사용자의 채팅방 목록 조회
 */

async function getRoomsByUser(userId, userRole) {
  return await db.sequelize.transaction(async t => {
    const rooms = await chatRepository.findByUser(t, userId, userRole);
    
    const roomsWithDetails = await Promise.all(rooms.map(async (room) => {
      const roomPlain = room.get({ plain: true });
      const isOwner = /OWNER/i.test(String(userRole))
      
      const opponent = isOwner ? roomPlain.cleaner : roomPlain.owner;
      console.log(`[확인] 상대방 존재여부: ${!!opponent}, 이름: ${opponent?.name}`);
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
 * 채팅방 메시지 내역 조회
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

async function getChatRoomWithSidebar(roomId, userRole) {
  return await db.sequelize.transaction(async (t) => {
    const isOwner = /OWNER/i.test(String(userRole));

    const room = await db.ChatRoom.findOne({
      where: { id: roomId },
      include: [
        {
          model: db.Owner,
          as: 'owner',
          attributes: ['id', 'name'],
        },
        {
          model: db.Cleaner,
          as: 'cleaner',
          attributes: ['id', 'name', 'introduction'],
          include: [
            {
              model: db.Location,
              as: 'locations',
              attributes: ['city', 'district'],
              through: {
                model: db.DriverRegion,
                attributes: [],
              },
            },
            {
              model: db.Reservation,
              as: 'reservations',
              attributes: ['id', 'status'],
            },
          ],
        },
        {
          model: db.Estimate,
          as: 'estimate',
          attributes: ['id', 'estimated_amount', 'description', 'status'],
        },
      ],
      transaction: t,
    });

    if (!room) throw myError('채팅방을 찾을 수 없습니다.', BAD_REQUEST_ERROR);
    const roomPlain = room.get({ plain: true });
    
    const cleaner = roomPlain.cleaner;
    const hireCount = cleaner?.reservations.filter((r) => r.status === '완료').length || 0;
    const primaryLoc = cleaner?.locations?.[0];
    const regionText = primaryLoc ? `${primaryLoc.city} ${primaryLoc.district}` : '지역 정보 없음';
    
    // 일관된 데이터 구조로 통합
    return {
      sideType: isOwner ? 'OWNER' : 'CLEANER',
      data: {
        // ChatRoom 헤더용 데이터
        ownerId: roomPlain.owner?.id,
        ownerName: roomPlain.owner?.name,
        cleanerId: roomPlain.cleaner?.id,
        cleanerName: roomPlain.cleaner?.name,

        // 사이드바용 데이터 (통합)
        region: regionText,
        price: roomPlain.estimate?.estimated_amount,
        introduction: roomPlain.cleaner?.introduction,
        hireCount: hireCount,
        estimateId: roomPlain.estimate?.id,
        estimateContent: roomPlain.estimate?.description,
        estimateStatus: roomPlain.estimate?.status,
      },
    };
  });
}


/**
 * 채팅방 나가기
 */
async function leaveRoom(room_id, userRole) {
  return await db.sequelize.transaction(async t => {
    await chatRepository.updateLeavedAt(t, room_id, userRole);
  });
}

/**
 * 2. 사이드바 리뷰 목록 조회 (페이징 및 정렬 필터)
 */
async function getSidebarReviews(roomId, { page = 1, sort = 'latest' }) {
  const limit = 5;
  const offset = (page - 1) * limit;

  // 정렬 매핑 (최신순, 높은평점순, 낮은평점순)
  const orderMap = {
    latest: [['created_at', 'DESC']],
    high_rating: [['star', 'DESC']],
    low_rating: [['star', 'ASC']]
  };

  const room = await db.ChatRoom.findByPk(roomId);
  if (!room) throw myError('방 정보를 찾을 수 없습니다.', BAD_REQUEST_ERROR);

  const targetCleanerId = room.cleanerId;

  const ReviewModel = db.Review || db.reviews; 
  if (!ReviewModel) {
    throw myError('서버에 리뷰 모델이 등록되지 않았습니다. 모델 파일을 확인해주세요.', 500);
  }

  // 2. 리뷰 테이블 조회
  const { count, rows } = await db.Review.findAndCountAll({
    include: [{
      model: db.Reservation,
      as: 'reservationData',
      where: { cleanerId: targetCleanerId },
      attributes: [] 
    }],
    order: orderMap[sort] || orderMap.latest,
    limit,
    offset
  });

  return {
    totalCount: count,
    totalPages: Math.ceil(count / limit),
    currentPage: Number(page),
    reviews: rows
  };
}

/**
 * 채팅방 닫기
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
  closeRoom,
  getChatRoomWithSidebar,
  getSidebarReviews
};