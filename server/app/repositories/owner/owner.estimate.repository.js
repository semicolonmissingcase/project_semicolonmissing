/**
 * @file app/repositories/owner/owner.estimate.repository.js
 * @description Estimate Repository
 * 260102 v1.0.0 ck init
 */

import db from '../../models/index.js';
import dayjs from 'dayjs';
const { Estimate, Reservation, Cleaner, Review, Like, Sequelize, Store } = db;

/**
 * 특정 예약 ID에 대한 예약서 목록 조회
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
            where: { status: '완료'},
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
    // 정렬 로직 적용
    order: [
      [
        Sequelize.literal(`
          CASE 
            WHEN "Estimate"."status" = '요청' THEN 1 
            WHEN "Estimate"."status" = '승인' THEN 2 
            WHEN "Estimate"."status" = '완료' THEN 3 
            ELSE 4 
          END
        `), 
        'ASC'
      ],
      ['createdAt', 'ASC'],
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

/**
 * 특정 예약 ID에 대한 '수락' 상태의 견적 목록 조회
 * @param {number} reservationId 
 * @returns 
 */
async function findAcceptedEstimatesByOwnerId(ownerId) {
  const estimates = await Estimate.findAll({
    where: {
      status: '수락' // 견적서 상태가 '수락'인 것만 필터링
    },
    include: [
      {
        model: Reservation,
        as: 'reservation',
        attributes: ['id', 'date', 'time', 'status'], // 예약 정보 (날짜, 시간, 상태)
        where: { ownerId: ownerId }, // 현재 점주의 예약에 속한 견적만
        required: true, // INNER JOIN (예약 정보가 있어야 함)
        include: [{ // 예약에 연결된 매장 정보
          model: Store,
          as: 'store',
          attributes: ['name'], // 매장 이름만
          required: true,
        }]
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
        required: true, // 견적에는 반드시 기사님이 있어야 함
      },
    ],
    order: [['createdAt', 'DESC']]
  });

  // 후처리하여 isFavorited 속성 추가
  return estimates.map(estimate => {
    const plainEstimate = estimate.get({ plain: true });

    const heartStatus = plainEstimate.cleaner?.isFavorited > 0 || false;
    const cleanerName = plainEstimate.cleaner?.name || '정보 없음';
    const cleanerProfile = plainEstimate.cleaner?.profile || '/icons/default-profile.png';
    const storeName = plainEstimate.reservation?.store?.name || '정보 없음';
    const estimatedAmount = plainEstimate.estimated_amount;
    const price = estimatedAmount ? estimatedAmount.toLocaleString() : '미정';
    const avgReviewScore = plainEstimate.cleaner?.avgReviewScore 
      ? Number(plainEstimate.cleaner.avgReviewScore).toFixed(1) 
      : '0.0';

    return {
      id: plainEstimate.id,
      cleanerId: plainEstimate.cleaner?.id,
      name: cleanerName,
      time: `${dayjs(plainEstimate.reservation?.date).format('YYYY-MM-DD')} ${plainEstimate.reservation?.time}`,
      store: storeName,
      price: price,
      status: plainEstimate.reservation?.status,
      estimateStatus: plainEstimate.status,
      heart: heartStatus,
      cleanerProfile: cleanerProfile,
      avgReviewScore: avgReviewScore
    };
  });
}

export default {
  getEstimatesByReservationId,
  findAcceptedEstimatesByOwnerId,
}