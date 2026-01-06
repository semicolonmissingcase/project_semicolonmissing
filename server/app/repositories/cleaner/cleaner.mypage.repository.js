/**
 * @file app/repositories/cleaner/cleaner.mypage.repository.js
 * @description Cleaner MyPage Repository
 * 260105 seon init
 */

import db from '../../models/index.js';
import { Op } from 'sequelize';

const { sequelize,Reservation, Estimate, Owner, Store, Review, Submission, Question, QuestionOption, Inquiry } = db;

/**
 * 기사님용 대기 작업 조회
 */
async function reservationFindPendingByCleanerIdAndRole(t = null, { cleanerId, userRole }) {
  if (!userRole) return [];

  return await Reservation.findAll({
    where: {
      cleanerId: cleanerId,
      status: '승인'
    },
    attributes: ['id', 'date', 'time', 'status', 'createdAt'],
    include: [
      { 
        model: Estimate, 
        as: 'estimate', 
        required: true, 
        attributes: ['id', 'estimated_amount', 'description', 'status'] 
      },
      { model: Owner, as: 'owner', required: true, attributes: ['id', 'name'] },
      { model: Store, as: 'store', required: false, attributes: ['id', 'name', 'addr1'] }
    ],
    order: [['createdAt', 'ASC']], 
    transaction: t
  });
}

/**
 * 특정 예약 상세 조회
 */
async function reservationFindById(t = null, id) {
  return await Reservation.findOne({
    where: { id: id },
    include: [
      { 
        model: Estimate, 
        as: 'estimate',
        attributes: ['id', 'estimated_amount', 'description']
      },
      { model: Owner, as: 'owner', attributes: ['id', 'name', 'phone'] },
      { model: Store, as: 'store', attributes: ['id', 'name', 'addr1'] }
    ],
    transaction: t
  });
}

/**
 * 특정 예약의 질문 답변(Submissions) 조회
 */
async function submissionFindByReservationId(t = null, id) {
  return await Submission.findAll({
    where: { reservationId: id },
    include: [
      {
        model: Question,
        as: 'question',
        attributes: ['id', 'code', 'content'],
        required: false,
        include: [
          {
            model: QuestionOption,
            as: 'questionOptions',
            attributes: ['id', 'correct'],
            required: false
          },
        ],
      },
    ],
    order: [
      [sequelize.literal('`question`.`code` IS NULL'), 'ASC'],
      [{ model: Question, as: 'question' }, 'code', 'ASC']
    ],
    transaction: t
  });
}

/**
 * 예약 상태 변경
 */
async function reservationUpdateStatus(t = null, { id, status }) {
  return await Reservation.update(
    { status: status },
    { where: { id: id }, transaction: t }
  );
}

/**
 * 오늘 일정 조회
 */
async function reservationFindTodayByCleanerId(t = null, { cleanerId, userRole }) {
  if (!userRole) return [];

  const today = new Date();
  const todayString = today.toISOString().split('T')[0]; // 'YYYY-MM-DD' 형식

  return await Reservation.findAll({
    where: {
      cleanerId: cleanerId,
      status: '승인',
      date: todayString
    },
    include: [
      { 
        model: Estimate, 
        as: 'estimate',
        attributes: ['id', 'estimated_amount', 'description']
      }, 
      { model: Owner, as: 'owner' },
      { model: Store, as: 'store', attributes: ['id', 'name', 'addr1'] }
    ],
    transaction: t
  });
}

/**
 * 정산 대기 목록 조회
 */
async function reservationFindSettlementPending(t = null, cleanerId) {
  return await Reservation.findAll({
    where: { cleanerId: cleanerId, status: '완료' },
    include: [
      { 
        model: Estimate, 
        as: 'estimate', 
        attributes: ['estimated_amount']
      }
    ],
    transaction: t
  });
}

/**
 * 기사님 리뷰 조회
 */
async function reviewFindByCleanerId(t = null, cleanerId) {
  return await Review.findAll({
    where: { targetId: cleanerId, targetType: 'CLEANER' },
    include: [{ model: Owner, as: 'owner', attributes: ['name'] }],
    order: [['createdAt', 'DESC']],
    transaction: t
  });
}

/**
 * 기사님이 작성한 문의 조회
 */
async function inquiryFindByCleanerId(t = null, cleanerId) {
  return await Inquiry.findAll({
    where: { 
      cleanerid: cleanerId
    },
    attributes: ['id', 'title', 'category', 'content', 'status', 'guest_name', 'created_at'],
    order: [['created_at', 'DESC']],
    transaction: t
  });
}

export default {
  reservationFindPendingByCleanerIdAndRole,
  reservationFindById,
  submissionFindByReservationId,
  reservationUpdateStatus,
  reservationFindTodayByCleanerId,
  reservationFindSettlementPending,
  reviewFindByCleanerId,
  inquiryFindByCleanerId,
};