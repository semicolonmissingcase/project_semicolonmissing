/**
 * @file app/repositories/owner/owner.user.repository.js
 * @description Owner Repository
 * 251223 v1.0.0 ck init
 */

import db from '../../models/index.js';
const { Owner, Store, Reservation, Review, Estimate  } = db;

/**
 * 새로운 점주 생성
 * @param {import("sequelize").Transaction | null} t 
 * @param {object} date 
 * @returns {Promise<Owner>}
 */
async function create(t = null, data) {
  return await Owner.create(data, {
    transaction: t
  });
}

async function update(t = null, ownerId, updateData) {
  return await Owner.update(updateData, 
  {
    where: {
      id: ownerId
    },
    transaction: t,
  });
}

/**
 * 점주 ID로 통계 조회
 * @param {number} ownerId 
 */
async function getStatsByOwnerId(ownerId) {
  // 이용 횟수
  const completedReservations = await Reservation.count({
    where: { ownerId, status: '완료' },
  });

  // 리뷰 갯수
  const reviewCount = await Review.count({
    where: { ownerId },
  });

  // 견적 요청 갯수(총 예약 건수)
  const totalReservations = await Reservation.count({
    where: { ownerId },
  })

  // 받은 견적 갯수
  const estimateCount = await Estimate.count({
    include: [
      {
        model: Reservation,
        as: 'reservation',
        where: {
          ownerId
        },
        attributes: [],
      },
    ],
  });

  return {
    completedReservations,
    reviewCount,
    totalReservations,
    estimateCount,
  }
}

/**
 * 점주 ID로 예약 목록 조회
 * @param {number} ownerId 
 * @returns 
 */
async function getReservationsByOwnerId(ownerId) {
  return await Reservation.findAll({
    where: {
      ownerId
    },
    include: [
      {
        model: Store,
        as: 'store',
        attributes:
        [
          'name',
          'addr1',
          'addr2',
          'addr3',
        ],
      },
    ],
    order: [['createdAt', 'DESC']]
  });
}

export default {
  create,
  update,
  getStatsByOwnerId,
  getReservationsByOwnerId,
};