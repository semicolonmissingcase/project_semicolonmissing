/**
 * @file app/repositories/owner/owner.user.repository.js
 * @description Owner Repository
 * 251223 v1.0.0 ck init
 */

import db from '../../models/index.js';
const { Owner, Store, Reservation, Review, Estimate, Cleaner, Like, Sequelize } = db;

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

/**
 * 점주 업데이트
 * @param {import("sequelize").Transaction | null} t 
 * @param {number} ownerId 
 * @param {object} updateData 
 * @returns 
 */
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
 * 점주 ID로 예약서별 견적서 목록 조회
 * @param {number} ownerId 
 * @returns 
 */
async function getReservationsByOwnerId(ownerId) {
  const reservations = await Reservation.findAll({
    where: {
      ownerId
    },
    include: [
      {
        model: Store,
        as: 'store',
        where: {
          deletedAt: null
        },
        required: true,
        attributes:
        [
          'name',
          'addr1',
          'addr2',
          'addr3',
        ],
      },
      {
        model: Cleaner,
        as: 'cleaner',
        attributes: ['id', 'name', 'profile'],
        required: false,
        include: [{
          model: Like,
          as: 'likes',
          where: { ownerId: ownerId },
          required: false,
          attributes: ['id'],
        }],
      },
    ],
    order: [['createdAt', 'DESC']]
  });
  return reservations.map(reservation => {
    const plainReservation = reservation.get({ plain: true });
    const heartStatus = plainReservation.cleaner?.likes?.length > 0;

    return {
      ...plainReservation,
      heart: heartStatus,
      cleanerId: plainReservation.cleaner?.id,
    };
  });
}

/**
 * 점주 ID로 예약 목록 조회
 * @param {number} ownerId 
 * @returns 
 */
async function getEstimateByOwnerId(ownerId) {
  const reservations = await Reservation.findAll({
    where: {
      ownerId
    },
    attributes: [
      'id',
      'date',
      'time',
      'status',
      'cleanerId',
    ],
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
      {
        model: Cleaner,
        as: 'cleaner',
        attributes: [
          'id', 'name', 'profile',
          [
            Sequelize.literal(`(
              SELECT COUNT(*)
              FROM likes
              WHERE likes.cleaner_id = cleaner.id AND likes.owner_id = ${ownerId}
              )`),
              'isFavorited'
          ],
          [
            Sequelize.literal(`(
              SELECT COALESCE(AVG(star), 0)
              FROM reviews
              WHERE reviews.cleaner_id = cleaner.id
            )`),
            'avgReviewScore'
          ]
        ],
        required: false,
      },
      {
        model: Estimate,
        as: 'estimate',
        attributes: ['estimated_amount'],
        required: false,
      },
    ],
    order: [['createdAt', 'DESC']]
  });

  return reservations.map(reservation => {
    const plainReservation = reservation.get({ plain: true });

    const heartStatus = plainReservation.cleaner?.isFavorited > 0 || false;
    const cleanerName = plainReservation.cleaner?.name || '정보 없음';
    const cleanerProfile = plainReservation.cleaner?.profile || '/icons/default-profile.png';
    const storeName = plainReservation.store?.name || '정보 없음';
    const estimatedAmount = plainReservation.estimate?.estimated_amount;
    const price = estimatedAmount ? estimatedAmount.toLocaleString() : '미정';
    const avgReviewScore = plainReservation.cleaner?.avgReviewScore ? Number(plainReservation.cleaner.avgReviewScore).toFixed(1) : '0.0';

    return {
      id: plainReservation.id,
      name: cleanerName,
      time: `${dayjs(plainReservation.date).format('YYYY-MM-DD')} ${plainReservation.time}`,
      store: storeName,
      price: price,
      status: plainReservation.status,
      heart: heartStatus,
      cleanerProfile: cleanerProfile,
      avgReviewScore: avgReviewScore,
    }
  });
}

export default {
  create,
  update,
  getStatsByOwnerId,
  getReservationsByOwnerId,
  getEstimateByOwnerId,
};