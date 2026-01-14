/**
 * @file app/services/chat.service.js
 * @description Chat Service
 * 260106 seon init
 */

import chatRepository from '../repositories/chat.repository.js';
import quotationRepository from '../repositories/owner/owners.quotations.repository.js';
import myError from '../errors/customs/my.error.js';
import { BAD_REQUEST_ERROR } from '../../configs/responseCode.config.js';
import db from '../models/index.js';

/**
 * 채팅방 생성 또는 조회
 */
async function createOrGetRoom({ owner_id, cleaner_id, estimate_id }) {
  return await db.sequelize.transaction(async (t) => {
    let room = await chatRepository.findByKeys(t, estimate_id, cleaner_id, owner_id);
    let isNew = false;

    if (!room) {
      room = await chatRepository.create(t, { 
        estimate_id, 
        cleaner_id, 
        owner_id 
      });
      isNew = true;
    }

    return {
      room: room ? room.get({ plain: true }) : null,
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
      const isOwner = /OWNER/i.test(String(userRole));
      const opponent = isOwner ? roomPlain.cleaner : roomPlain.owner;
      
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
  const role = data.sender_role || data.role;
  
  return await db.sequelize.transaction(async t => {
    const { room_id, content, sender_id, type = 'TEXT' } = data;

    if (!content || (type === 'TEXT' && !content.trim())) {
      throw myError('메시지 내용을 입력해주세요', BAD_REQUEST_ERROR);
    }

    const newMessage = await chatRepository.createMessage(t, {
      room_id,
      content,
      sender_id,
      sender_role: role,
      type
    });

    await db.ChatRoom.update(
      {
        owner_leaved_at: null,
        cleaner_leaved_at: null,
        updatedAt: new Date()
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
async function markAsRead(room_id, user_id, user_role) {
  return await db.sequelize.transaction(async t => {
    return await chatRepository.markAsRead(t, room_id, user_id, user_role);
  });
}

/**
 * 채팅방 정보 및 사이드바 상세 데이터 조회
 */
async function getChatRoomWithSidebar(roomId, userRole) {
  return await db.sequelize.transaction(async (t) => {
    const isOwner = /OWNER/i.test(String(userRole));

    const room = await db.ChatRoom.findOne({
      where: { id: roomId },
      include: [
        { model: db.Owner, as: 'owner', attributes: ['id', 'name'] },
        { 
          model: db.Cleaner, 
          as: 'cleaner', 
          attributes: ['id', 'name', 'introduction'],
          include: [
            { model: db.Reservation, as: 'reservations', attributes: ['status'] },
            { 
              model: db.Location, 
              as: 'locations', 
              attributes: ['city', 'district'],
              through: { attributes: [] } 
            }
          ]
        },
        { 
          model: db.Estimate, 
          as: 'estimate', 
          attributes: ['id', 'estimated_amount', 'description', 'reservationId'] 
        },
      ],
      transaction: t,
    });

    if (!room) throw myError('채팅방을 찾을 수 없습니다.', BAD_REQUEST_ERROR);
    
    const roomPlain = room.get({ plain: true });
    const reservationId = roomPlain.estimate?.reservationId || roomPlain.estimate?.reservation_id;

    let reservationDetail = null;
    let submissions = [];

    if (reservationId) {
      try {
        reservationDetail = await db.Reservation.findOne({
          where: { id: reservationId },
          include: [{ model: db.Store, as: 'store' }],
          transaction: t
        });
        submissions = await quotationRepository.submissionFindByReservationId(t, reservationId);
      } catch (error) {
        console.error("사이드바 상세 정보 조회 중 에러:", error.message);
        submissions = [];
      }
    }
    
    const cleaner = roomPlain.cleaner;
    const store = reservationDetail?.store;
    const hireCount = (cleaner?.reservations || []).filter((r) => r.status === '완료').length;
    const primaryLoc = cleaner?.locations?.[0];
    const regionText = primaryLoc ? `${primaryLoc.city} ${primaryLoc.district}` : '지역 정보 없음';
    const fullAddress = store 
      ? `${store.addr1 || ''} ${store.addr2 || ''} ${store.addr3 || ''}`.trim() 
      : '주소 정보 없음';

    return {
      sideType: isOwner ? 'OWNER' : 'CLEANER',
      data: {
        ownerId: roomPlain.owner?.id,
        ownerName: roomPlain.owner?.name || '정보 없음',
        cleanerId: cleaner?.id,
        cleanerName: cleaner?.name || '정보 없음',
        estimateId: roomPlain.estimate?.id, 
        reservationId: reservationId, 
        region: regionText,
        price: roomPlain.estimate?.estimated_amount || 0,
        introduction: cleaner?.introduction || '',
        hireCount: hireCount,
        star: roomPlain.star || 0,
        storeName: store?.name || '정보 없음',
        storeAddress: fullAddress || '주소 정보 없음',
        wishDate: reservationDetail?.date || '날짜 정보 없음',
        wishTime: reservationDetail?.time || '시간 정보 없음',
        estimateContent: roomPlain.estimate?.description || '',
        
        qaList: (submissions || []).map(s => {
          let displayAnswer = s?.answer_text || s?.answerText;

          const optionId = s?.question_option_id || s?.questionOptionId;
          if (!displayAnswer && optionId && s?.question?.questionOptions) {
            const matchedOption = s.question.questionOptions.find(opt => opt.id === optionId);
            if (matchedOption) {
              displayAnswer = matchedOption.correct;
            }
          }

          return {
            question: s?.question?.content || '질문 정보 없음', //
            answer: displayAnswer || '답변 없음'
          };
        })
      },
    };
  });
}

/**
 * 사이드바 리뷰 목록 조회
 */
async function getSidebarReviews(roomId, { page = 1, sort = 'latest' }) {
  const limit = 5;
  const offset = (page - 1) * limit;

  const orderMap = {
    latest: [['createdAt', 'DESC']],
    high_rating: [['star', 'DESC']],
    low_rating: [['star', 'ASC']]
  };

  const room = await db.ChatRoom.findByPk(roomId);
  if (!room) throw myError('방 정보를 찾을 수 없습니다.', BAD_REQUEST_ERROR);
  
  const targetCleanerId = room.cleanerId || room.cleaner_id;

  const { count, rows } = await db.Review.findAndCountAll({
    where: { cleanerId: targetCleanerId },
    include: [{ model: db.Owner, as: 'owner', attributes: ['id', 'name'] }],
    order: orderMap[sort] || orderMap.latest,
    limit,
    offset
  });

  const formattedReviews = rows.map(review => {
    const plainReview = review.get({ plain: true });
    return {
      id: plainReview.id,
      star: plainReview.star,
      content: plainReview.content,
      createdAt: plainReview.createdAt,
      authorName: plainReview.owner?.name || '익명'
    };
  });

  return {
    totalCount: count,
    totalPages: Math.ceil(count / limit),
    currentPage: Number(page),
    reviews: formattedReviews
  };
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
  getChatRoomWithSidebar,
  getSidebarReviews,
  leaveRoom,
  closeRoom
};