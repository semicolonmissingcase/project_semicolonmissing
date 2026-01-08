/**
 * @file app/repositories/cleaner/cleaner.mypage.repository.js
 * @description Cleaner MyPage Repository
 * 260105 seon init
 */

import db from '../../models/index.js';
import { Op } from 'sequelize';
import dayjs from 'dayjs';
import constants from '../../constants/models.constants.js'

const { ReservationStatus, AdjustmentStatus } = constants;
const { sequelize,Reservation, Estimate, Owner, Store, Review, Submission, Question, QuestionOption, Inquiry, Adjustment } = db;

/**
 * 기사님용 대기 작업 조회
 */
async function reservationFindPendingByCleanerIdAndRole(t = null, { cleanerId, userRole }) {
  if (!userRole) return [];

  const todayString = dayjs().format('YYYY-MM-DD');

  return await Reservation.findAll({
    where: {
      cleanerId: cleanerId,
      status: ReservationStatus.APPROVED,
      date: {
        [Op.gte]: todayString }
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
    order: [
      ['date', 'ASC'], 
      ['time', 'ASC']
    ], 
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
 * 특정 예약의 질문 답변 조회
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
      status: ReservationStatus.APPROVED,
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
    where: { cleanerId: cleanerId, status: ReservationStatus.COMPLETED },
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
    where: { cleanerId },
    include: [
      {
        model: db.Reservation,
        as: 'reservationData', 
        attributes: [
          'id', 
          // DB의 실제 컬럼명은 'date'이므로 아래와 같이 명시해줍니다.
          ['date', 'date'] 
        ],
        include: [
          {
            model: db.Store,
            as: 'store', 
            attributes: ['name']
          }
        ]
      }
    ],
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
      cleanerId: cleanerId 
    },
    attributes: [
      'id', 
      'title', 
      'category', 
      'content', 
      'status', 
      'ownerId',
      'createdAt',
    ],
    order: [['createdAt', 'DESC']],
    transaction: t
  });
}

/**
 * 기사님 정산 요약 정보 조회 (당월 합계)
 */
async function settlementFindSummaryByCleanerId(t = null, { cleanerId, yearMonth }) {
  const startOfMonth = dayjs(yearMonth).startOf('month').format('YYYY-MM-DD HH:mm:ss');
  const endOfMonth = dayjs(yearMonth).endOf('month').format('YYYY-MM-DD HH:mm:ss');

  const results = await Adjustment.findAll({
    where: {
      cleaner_id: cleanerId,
      created_at: { [Op.between]: [startOfMonth, endOfMonth] }
    },
    attributes: [
      'status',
      [sequelize.fn('SUM', sequelize.col('settlement_amount')), 'totalSum']
    ],
    group: ['status'],
    raw: true,
    transaction: t
  });

  const summary = { pending: 0, completed: 0 };

  results.forEach(row => {
    const amount = parseInt(row.totalSum || 0, 10);
    
    if (row.status === AdjustmentStatus.PENDING) { // '지급 대기'
      summary.pending = amount;
    } else if (row.status === AdjustmentStatus.COMPLETED) { // '정산 완료'
      summary.completed = amount;
    }
  });

  return summary;
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
  settlementFindSummaryByCleanerId,
};