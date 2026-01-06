/**
 * @file app/services/chat.service.js
 * @description Chat Service
 * 251220 seon init
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
    // 3개의 인자를 모두 정확히 전달
    return await chatRepository.markAsRead(t, room_id, user_id, user_role);
  });
}

/**
 * 채팅방 정보 및 사이드바 상세 데이터 조회 (레포지토리 연동)
 */
async function getChatRoomWithSidebar(roomId, userRole) {
  return await db.sequelize.transaction(async (t) => {
    const isOwner = /OWNER/i.test(String(userRole));

    // 1. 기본 정보 조회
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
              through: { model: db.DriverRegion, attributes: [] } 
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
    const reservationId = roomPlain.estimate?.reservationId;

    // 2. [연동] 예약 상세 및 매장 정보 조회
    const reservationDetail = await quotationRepository.reservationFindByIdAndStatusIsRequest(t, reservationId);
    
    // 3. [연동] 정렬된 질문 답변 리스트 조회
    const submissions = await quotationRepository.submissionFindByReservationId(t, reservationId);
    
    const cleaner = roomPlain.cleaner;
    const store = reservationDetail?.store;
    
    // 데이터 가공
    const hireCount = cleaner?.reservations?.filter((r) => r.status === '완료').length || 0;
    const primaryLoc = cleaner?.locations?.[0];
    const regionText = primaryLoc ? `${primaryLoc.city} ${primaryLoc.district}` : '지역 정보 없음';
    
    // 전체 주소 생성
    const fullAddress = store 
      ? `${store.address1 || ''} ${store.address2 || ''} ${store.address3 || ''}`.trim() 
      : '주소 정보 없음';

    return {
      sideType: isOwner ? 'OWNER' : 'CLEANER',
      data: {
        ownerId: roomPlain.owner?.id,
        ownerName: roomPlain.owner?.name,
        cleanerId: cleaner?.id,
        cleanerName: cleaner?.name,
        region: regionText,
        price: roomPlain.estimate?.estimated_amount,
        introduction: cleaner?.introduction,
        hireCount: hireCount,
        star: roomPlain.star || 0,

        // 의뢰 상세 내역
        storeName: store?.name || '정보 없음',
        storeAddress: fullAddress,
        wishDate: reservationDetail?.date,
        wishTime: reservationDetail?.time,
        estimateContent: roomPlain.estimate?.description,
        reservationId: reservationId,

        // 정렬된 QA 리스트
        qaList: submissions?.map(s => ({
          question: s.question?.content,
          answer: s.answer_text
        })) || []
      },
    };
  });
}

/**
 * 사이드바 리뷰 목록 조회 (작성자 이름 포함 최종본)
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

  const targetCleanerId = room.cleanerId;

  const { count, rows } = await db.Review.findAndCountAll({
    include: [
      {
        model: db.Reservation,
        as: 'reservationData',
        where: { cleanerId: targetCleanerId },
        include: [
          {
            model: db.Owner,
            as: 'owner', // DB 관계 설정(as)에 따라 수정 필요할 수 있음
            attributes: ['name'] 
          }
        ]
      }
    ],
    order: orderMap[sort] || orderMap.latest,
    limit,
    offset
  });

  // 데이터 가공: 프론트엔드에서 authorName으로 바로 접근 가능하도록 flatten
  const formattedReviews = rows.map(review => {
    const plainReview = review.get({ plain: true });
    return {
      id: plainReview.id,
      star: plainReview.star,
      content: plainReview.content,
      createdAt: plainReview.createdAt,
      // 작성자 이름 추출 (없을 경우 익명 처리)
      authorName: plainReview.reservationData?.owner?.name || '익명'
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