/**
 * @file app/repositories/cleaner/cleaner.mypage.repository.js
 * @description Cleaner MyPage Repository
 * 260103 v1.0.0 init
 */

import db from '../../models/index.js';
import { Op } from 'sequelize';

const { sequelize, Reservation, Estimate, Owner, Store } = db;

/**
 * 기사님용 대기 작업 조회 (상태가 '승인'이고 완료되지 않은 미래 예약)
 * @param {Transaction} t - Sequelize 트랜잭션 객체
 * @param {Object} params - { cleanerId, userRole }
 */
async function reservationFindPendingByCleanerIdAndRole(t = null, { cleanerId, userRole }) {
  const roleStr = String(userRole || '').toUpperCase();
  if (!roleStr.includes('CLEANER')) {
    return null;
  }

  return await Reservation.findAll(
    {
      where: {
        cleanerId: cleanerId,
        status: '승인',
        reservationDate: { [Op.gte]: new Date() } 
      },
      include: [
        {
          model: Estimate,
          as: 'estimate',
          required: true,
          attributes: ['id', 'locationName', 'address', 'workDate', 'totalPrice']
        },
        {
          model: Owner,
          as: 'owner',
          required: true,
          attributes: ['id', 'name']
        },
        {
          model: Store,
          as: 'store',
          required: false,
          attributes: ['id', 'name', 'address']
        }
      ],
      order: [
        ['reservationDate', 'ASC']
      ]
    },
    {
      transaction: t
    }
  );
}

/**
 * 특정 예약 상세 조회
 */
async function reservationFindById(t = null, id) {
  return await Reservation.findOne(
    {
      where: { id: id },
      include: [
        { model: Estimate, as: 'estimate' },
        { model: Owner, as: 'owner' },
        { model: Store, as: 'store' }
      ]
    },
    {
      transaction: t
    }
  );
}

/**
 * 예약 상태 변경 (승인 -> 완료 등)
 */
async function reservationUpdateStatus(t = null, { id, status }) {
  return await Reservation.update(
    { status: status },
    {
      where: { id: id },
      transaction: t
    }
  );

}

/**
 * 오늘 일정 조회 (상태가 '승인'이고 예약일이 오늘인 내역)
 */
async function reservationFindTodayByCleanerId(t = null, { cleanerId, userRole }) {
  const roleStr = String(userRole || '').toUpperCase();
  if (!roleStr.includes('CLEANER')) return [];

  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  
  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  return await db.Reservation.findAll({
    where: {
      cleanerId: cleanerId,
      status: '승인',
      reservationDate: { [Op.between]: [startOfDay, endOfDay] }
    },
    include: [{ model: db.Estimate, as: 'estimate' }, { model: db.Owner, as: 'owner' }],
    order: [['reservationDate', 'ASC']],
    transaction: t
  });
}

/**
 * 정산 대기 목록 조회 및 총액 합산
 */
async function reservationFindSettlementPending(t = null, cleanerId) {
  return await db.Reservation.findAll({
    where: {
      cleanerId: cleanerId,
      status: '완료',
      // 필요시 정산 여부를 판단하는 별도 컬럼(isSettled 등) 추가 조건 가능
    },
    include: [{ model: db.Estimate, as: 'estimate', attributes: ['totalPrice'] }],
    transaction: t
  });
}

/**
 * 기사님에게 달린 리뷰 목록 조회
 */
async function reviewFindByCleanerId(t = null, cleanerId) {
  return await db.Review.findAll({
    where: { targetId: cleanerId, targetType: 'CLEANER' },
    include: [{ model: db.Owner, as: 'owner', attributes: ['name'] }],
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