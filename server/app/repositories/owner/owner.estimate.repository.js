/**
 * @file app/repositories/owner/owner.estimate.repository.js
 * @description Estimate Repository
 * 260102 v1.0.0 ck init
 */

import db from '../../models/index.js';
const { Estimate, Reservation, Cleaner, Review, Like, Sequelize } = db;

/**
 * 특정 예약 ID에 대한 견적 목록 조회
 * @param {number} reservationId 
 * @returns 
 */
async function getEstimatesByReservationId(reservationId, ownerId) {
  const estimates = await Estimate.findAll({
    where: {
      reservationId
    },
    include: 
    [
      {
        model: Cleaner,
        as: 'cleaner',
        attributes: 
        [
          'id', 
          'name', 
          'profile',
          [Sequelize.fn('AVG', Sequelize.col('cleaner.reviews.star')), 'avgReviewScore'],
          [Sequelize.fn('COUNT', Sequelize.col('cleaner.reservations.id')), 'jobCount'],
        ],
        include: [ 
          {
            model: Review,
            as: 'reviews',
            attributes: [],
            duplicating: false,
          },
          {
            model: Reservation,
            as: 'reservations',
            attributes: [],
            where: { status: '완료' },
            duplicating: false,
          },
          {
            model: Like,
            as: 'likes',
            attributes: ['id'],
            where: { ownerId: ownerId },
            required: false,
          },
        ],
      },
    ],
    group: ['Estimate.id', 'cleaner.id', 'cleaner->likes.id'],
    order: [
      ['status', 'ASC'],
      ['createdAt', 'ASC'],
    ]
  });

  // 승인을 상태를 가장 위로 정렬
  estimates.sort((a, b) => {
    if(a.status === '승인' && b.status !== '승인') return -1;
    if (a.status !== '승인' && b.status === '승인') return 1;
    return new Date(a.createdAt) - new Date(b.createdAt);
  });

  // 후처리하여 isFavorited 속성 추가
  const processedEstimates = estimates.map(estimate => {
    const plainEstimate = estimate.get({ plain: true });
    const isFavorited = plainEstimate.cleaner.likes && plainEstimate.cleaner.likes.length > 0;

    delete plainEstimate.cleaner.likes;
    return {
      ...plainEstimate,
      cleaner: {
        ...plainEstimate.cleaner,
        isFavorited: isFavorited // isFavorited 속성 추가
      }
    };
  });

  return processedEstimates;
}

export default {
  getEstimatesByReservationId,
}