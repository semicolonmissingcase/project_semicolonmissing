/**
 * @file app/repositories/cleaner/cleaner.mypage.repository.js
 * @description Cleaner MyPage Repository (Final Stable Version)
 * 260106 seon init
 */

import db from '../../models/index.js';
import { Op } from 'sequelize';

const { Reservation, Estimate, Owner, Store, Review } = db;

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
    include: [
      { 
        model: Estimate, 
        as: 'estimate', 
        required: true, 
        attributes: ['id', 'estimated_amount', 'description', 'status'] 
      },
      { model: Owner, as: 'owner', required: true, attributes: ['id', 'name'] },
      { model: Store, as: 'store', required: false, attributes: ['id', 'name'] }
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
      { model: Owner, as: 'owner' },
      { model: Store, as: 'store' }
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

  return await Reservation.findAll({
    where: {
      cleanerId: cleanerId,
      status: '승인'
    },
    include: [
      { 
        model: Estimate, 
        as: 'estimate',
        attributes: ['id', 'estimated_amount', 'description']
      }, 
      { model: Owner, as: 'owner' }
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

export default {
  reservationFindPendingByCleanerIdAndRole,
  reservationFindById,
  reservationUpdateStatus,
  reservationFindTodayByCleanerId,
  reservationFindSettlementPending,
  reviewFindByCleanerId,
};