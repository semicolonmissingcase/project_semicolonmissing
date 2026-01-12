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
const { sequelize, Reservation, Estimate, Owner, Store, Review, Submission, Question, QuestionOption, Inquiry, Adjustment, Payment } = db;

/**
 * 특정 예약 상세 조회
 */
async function reservationFindById(t = null, id) {
  return await Reservation.findOne({
    where: { id: id },
    attributes: ['id', 'cleanerId'], 
    include: [
      { 
        model: Estimate, 
        as: 'estimate',
        attributes: ['id', 'estimated_amount', 'description']
      },
      { model: Owner, as: 'owner', attributes: ['id', 'name'] },
      { 
        model: Store, 
        as: 'store', 
        attributes: ['id', 'name', 'addr1', 'addr2', 'addr3'] 
      }
    ],
    transaction: t
  });
}

/**
 * 정산 데이터 Upsert (생성 또는 업데이트)
 */
async function adjustmentUpsert(t = null, { reservationId, cleanerId, estimateId, paymentId, settlementAmount, status }) {
  const existingAdjustment = await Adjustment.findOne({
    where: { reservationId: reservationId },
    transaction: t
  });

  if (existingAdjustment) {
    return await existingAdjustment.update({
      cleanerId: cleanerId,
      estimateId: estimateId,
      paymentId: paymentId,
      settlementAmount: settlementAmount,
      status: status,
      updatedAt: new Date()
    }, { transaction: t });
  } else {
    return await Adjustment.create({
      reservationId: reservationId,
      cleanerId: cleanerId,
      estimateId: estimateId,
      paymentId: paymentId,
      settlementAmount: settlementAmount,
      status: status,
      createdAt: new Date()
    }, { transaction: t });
  }
}

/**
 * 대기 작업 목록 조회
 */
async function reservationFindPendingByCleanerIdAndRole(t = null, { cleanerId, userRole }) {
  if (!userRole) return [];
  return await Reservation.findAll({
    where: {
      cleanerId: cleanerId,
      status: ReservationStatus.APPROVED,
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
 * 상세 QA 조회
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
        include: [{ model: QuestionOption, as: 'questionOptions', attributes: ['id', 'correct'], required: false }],
      },
    ],
    order: [[sequelize.literal('`question`.`code` IS NULL'), 'ASC'], [{ model: Question, as: 'question' }, 'code', 'ASC']],
    transaction: t
  });
}

/**
 * 예약 상태 업데이트
 */
async function reservationUpdateStatus(t = null, { id, status }) {
  return await Reservation.update({ status: status }, { where: { id: id }, transaction: t });
}

/**
 * 오늘 일정 조회
 */
async function reservationFindTodayByCleanerId(t = null, { cleanerId, userRole }) {
  if (!userRole) return [];
  const todayString = dayjs().format('YYYY-MM-DD'); 
  return await Reservation.findAll({
    where: { cleanerId: cleanerId, status: ReservationStatus.APPROVED, date: todayString },
    include: [
      { model: Estimate, as: 'estimate', attributes: ['id', 'estimated_amount', 'description'] }, 
      { model: Owner, as: 'owner', attributes: ['id', 'name'] },
      { model: Store, as: 'store', attributes: ['id', 'name', 'addr1'] }
    ],
    transaction: t
  });
}

/**
 * 정산 대기 예약 조회
 */
async function reservationFindSettlementPending(t = null, cleanerId) {
  return await Reservation.findAll({
    where: { cleanerId: cleanerId, status: ReservationStatus.COMPLETED },
    include: [{ model: Estimate, as: 'estimate', required: true, attributes: ['estimated_amount'] }],
    transaction: t
  });
}

/**
 * 리뷰 목록 조회
 */
async function reviewFindByCleanerId(t = null, cleanerId) {
  return await Review.findAll({
    where: { cleanerId },
    include: [{ model: Reservation, as: 'reservationData', attributes: ['id', ['date', 'date']], 
    include: [{ model: Store, as: 'store', attributes: ['name'] }] }],
    order: [['createdAt', 'DESC']],
    transaction: t
  });
}

/**
 * 문의 내역 조회 
 */
async function inquiryFindByCleanerId(t = null, cleanerId) {
  return await Inquiry.findAll({
    where: { cleanerId: cleanerId },
    attributes: ['id', 'title', 'category', 'content', 'status', 'ownerId', 'createdAt'],
    include: [
      {
        model: db.Answer,
        as: 'answer',
        attributes: ['content', 'createdAt'],
        required: false
      }
    ],
    order: [['createdAt', 'DESC']],
    transaction: t
  });
}

/**
 * 정산 요약 정보 조회
 */
async function settlementFindSummaryByCleanerId(t = null, { cleanerId, yearMonth }) {
  const startOfMonth = dayjs(yearMonth).startOf('month').format('YYYY-MM-DD HH:mm:ss');
  const endOfMonth = dayjs(yearMonth).endOf('month').format('YYYY-MM-DD HH:mm:ss');
  const results = await Adjustment.findAll({
    where: { cleanerId: cleanerId, createdAt: { [Op.between]: [startOfMonth, endOfMonth] } },
    attributes: ['status', [sequelize.fn('SUM', sequelize.col('settlement_amount')), 'totalSum']],
    group: ['status'], raw: true, transaction: t
  });
  const summary = { pending: 0, completed: 0 };
  results.forEach(row => {
    const amount = parseInt(row.totalSum || 0, 10);
    if (row.status === AdjustmentStatus.PENDING) summary.pending = amount;
    else if (row.status === AdjustmentStatus.COMPLETED) summary.completed = amount;
  });
  return summary;
}

/**
 * 정산 상세 리스트 조회
 */
async function settlementFindListWithStoreByCleanerId(t = null, { cleanerId, yearMonth }) {
  const startOfMonth = dayjs(yearMonth).startOf('month').format('YYYY-MM-01 00:00:00');
  const endOfMonth = dayjs(yearMonth).endOf('month').format('YYYY-MM-DD 23:59:59');

  return await Adjustment.findAll({
    where: { 
      cleanerId: cleanerId,
      createdAt: { [Op.between]: [startOfMonth, endOfMonth] } 
    },
    attributes: [
      'id', 
      'settlement_amount',
      'status', 
      'createdAt'
    ],
    include: [{ 
      model: Reservation, 
      as: 'reservation', 
      required: true,
      attributes: ['id', 'date'],
      include: [{ model: Store, as: 'store', attributes: ['name'] }] 
    }],
    order: [['createdAt', 'DESC']], 
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
  settlementFindSummaryByCleanerId,
  settlementFindListWithStoreByCleanerId,
  adjustmentUpsert 
};