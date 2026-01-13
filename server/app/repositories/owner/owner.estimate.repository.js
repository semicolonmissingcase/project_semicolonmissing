/**
 * @file app/repositories/owner/owner.estimate.repository.js
 * @description Estimate Repository
 * 260102 v1.0.0 ck init
 */

import modelsConstants from '../../constants/models.constants.js';
import myError from '../../errors/customs/my.error.js';
const { ReservationStatus, EstimateStatus } = modelsConstants;
import db from '../../models/index.js';
import dayjs from 'dayjs';
const { Estimate, Reservation, Cleaner, Review, Like, Store } = db;
import { Sequelize } from 'sequelize';

/**
 * 특정 예약 ID에 대한 예약서 목록 조회
 * @param {number} reservationId 
 * @returns 
 */
async function getEstimatesByReservationId(reservationId, ownerId) {
  const estimates = await Estimate.findAll({
    where: { reservationId },
    include: [
      {
        model: Cleaner,
        as: 'cleaner',
        attributes: [
          'id', 'name', 'profile',
          [Sequelize.fn('AVG', Sequelize.col('cleaner.reviews.star')), 'avgReviewScore'],
          [Sequelize.fn('COUNT', Sequelize.col('cleaner.reservations.id')), 'jobCount'],
        ],
        include: [
          { model: Review, as: 'reviews', attributes: [], duplicating: false },
          {
            model: Reservation,
            as: 'reservations',
            attributes: [],
            where: { status: '승인' },
            required: false,
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
  });

  // 1. 데이터를 먼저 평탄화(Plain Object) 및 가공
  const processed = estimates.map(estimate => {
    const plain = estimate.get({ plain: true });
    const isFavorited = !!(plain.cleaner?.likes && plain.cleaner.likes.length > 0);

    if (plain.cleaner) {
      delete plain.cleaner.likes;
      plain.cleaner.isFavorited = isFavorited;
    }
    return plain;
  });

  // 2. 가공된 데이터(JSON 객체)를 가지고 정렬을 수행
  const statusPriority = {
    '요청': 1,
    '승인': 2,
    '완료': 3,
    '취소': 4
  };

  processed.sort((a, b) => {
    const priorityA = statusPriority[a.status] || 99;
    const priorityB = statusPriority[b.status] || 99;

    if (priorityA !== priorityB) {
      return priorityA - priorityB;
    }
    
    // 상태가 같으면 최신순 (날짜 내림차순)
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  return processed;
}

/**
 * 특정 예약 ID에 대한 '수락' 상태의 견적 목록 조회
 * @param {number} reservationId 
 * @returns 
 */
async function findAcceptedEstimatesByOwnerId(ownerId) {
  const estimates = await Estimate.findAll({
    where: {
      status: EstimateStatus.PAID // 견적서 상태가 '수락'인 것만 필터링
    },
    attributes: ['id', 'cleanerId', 'reservationId', 'estimatedAmount', 'description', 'status', 'createdAt',],
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
        },]
      },
      {
        model: Cleaner,
        as: 'cleaner',
        attributes: [
          'id', 'name', 'profile',
          [
            Sequelize.literal(`(
              SELECT COALESCE(AVG(star), 0)
              FROM reviews
              WHERE reviews.cleaner_id = cleaner.id
            )`),
            'avgReviewScore'
          ],
        ],
        required: true, // 견적에는 반드시 기사님이 있어야 함
        include: [{
          model: Like,
          as: 'likes',
          where: { ownerId: ownerId },
          required: false,
          attributes: ['id'],
        }],
      },
    ],
    order: [['createdAt', 'DESC']],
  });

  // 후처리하여 isFavorited 속성 추가
  return estimates.map(estimate => {
    const plainEstimate = estimate.get({ plain: true });
    const heartStatus = plainEstimate.cleaner?.likes?.length > 0
    const cleanerName = plainEstimate.cleaner?.name || '정보 없음';
    const cleanerProfile = plainEstimate.cleaner?.profile || '/icons/default-profile.png';
    const storeName = plainEstimate.reservation?.store?.name || '정보 없음';
    const estimatedAmount = plainEstimate.estimatedAmount;
    const price = estimatedAmount ? estimatedAmount.toLocaleString() : '정보 없음';
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

/**
 * 견적서, 관련 예약 상테 취소로 변경
 */
async function cancelEstimateAndReservation(estimateId, ownerId) {
  const estimate = await Estimate.findOne({
    where: {id: estimateId},
    include: [{
      model: Reservation,
      as: 'reservation',
      where: { ownerId: ownerId }
    }]
  });

  if(!estimate) {
    throw new myError('취소할 수 있는 예약 정보를 찾을 수 없습니다.', NOT_FOUND_ERROR);
  }

  const t = await db.sequelize.transaction();
  try {
    // 예약 상태를 CANCELED로 변경
    await Reservation.update(
      { status: ReservationStatus.CANCELED },
      { where: { id: estimate.reservationId }, transaction: t }
    );

    // 견적서 상태도 MATCHING_FAILED로 변경
    await Estimate.update(
      { status: EstimateStatus.MATCHING_FAILED },
      { where: { id: estimateId }, transaction: t }
    );

    await t.commit();
  } catch (error) {
    await t.rollback();
    throw error;
  }
}

export default {
  getEstimatesByReservationId,
  findAcceptedEstimatesByOwnerId,
  cancelEstimateAndReservation,
}