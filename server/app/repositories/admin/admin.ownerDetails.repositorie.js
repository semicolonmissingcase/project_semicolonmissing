/**
 * @file app/repositories/admin/admin.ownerDetails.repositorie.js
 * @description 관리자 ownerDetails repositorie
 * 260113 v1.0.0 jae init
 */

import { Op } from 'sequelize';
import db from '../../models/index.js';
const { sequelize, Owner, Store, Reservation, Cleaner } = db;

/**
 * 1. 점주 상세 정보 및 소유 매장 목록
 */
async function findOwnerDetailWithStores(ownerId, t = null) {
  return await Owner.findOne({
    where: { id: ownerId },
    include: [
      {
        model: Store,
        as: 'stores',
        attributes: [
          'id', 
          'name', // 매장명 (이미지 확인 결과)
          [sequelize.literal("CONCAT(addr1, ' ', addr2, ' ', addr3)"), 'address'], // 주소 병합
          'created_at',
        ],
      }
    ],
    attributes: ['id', 'name', 'email', 'phone_number', 'created_at'],
    transaction: t
  });
}

/**
 * 2. 점주 개별 통계
 */
async function getOwnerStatistics(ownerId, t = null) {
  const stats = await Owner.findOne({
    where: { id: ownerId },
    attributes: [
      [
        sequelize.literal(`(
          SELECT COALESCE(SUM(P.total_amount), 0)
          FROM payments AS P
          INNER JOIN reservations AS R ON P.reservation_id = R.id
          WHERE R.owner_id = ${ownerId} 
            AND P.status = '성공' 
            AND P.deleted_at IS NULL
        )`),
        'totalSpent'
      ],
      // 활성 매장 수
      [
        sequelize.literal(`(
          SELECT COUNT(*)
          FROM stores
          WHERE owner_id = ${ownerId} AND deleted_at IS NULL
        )`),
        'activeStoreCnt'
      ],
      // 예약 완료 건수
      [
        sequelize.literal(`(
          SELECT COUNT(*)
          FROM reservations
          WHERE owner_id = ${ownerId} AND status = '완료' AND deleted_at IS NULL
        )`),
        'completedBookingCnt'
      ]
    ],
    transaction: t
  });

  return stats ? stats.dataValues : null;
}


/**
 * 점주별 예약 이력 조회
 */
async function findOwnerReservationHistory(ownerId, page, offset, t = null) {
  const limit = parseInt(offset);
  const skip = (parseInt(page) - 1) * limit;

  return await Reservation.findAndCountAll({
    where: { owner_id: ownerId },
    include: [
      {
        model: Payment,
        as: 'payment', 
        attributes: [['total_amount', 'totalAmount'], 'status'], 
      },
      {
        model: Store,
        as: 'store',
        attributes: ['name'],
      }
    ],
    attributes: ['id', 'status', 'created_at'], 
    limit,
    offset: skip,
    order: [['created_at', 'DESC']],
    transaction: t,
  });
}

export default {
  findOwnerDetailWithStores,
  findOwnerReservationHistory,
  getOwnerStatistics,
};