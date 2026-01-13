/**
 * @file app/repositories/admin/admin.reviews.repositorie.js
 * @description 관리자 reviews repositorie
 * 260113 v1.0.0 jae init
 */

import { Op } from 'sequelize';
import db from '../../models/index.js';

const { sequelize, Review, Reservation, Owner, Cleaner } = db;

/**
 * 1. 리뷰 목록 조회 (하단 테이블용)
 */
async function findReviews(t = null, { limit, offset }) {
  return await Review.findAndCountAll({
    attributes: [
      'id',
      'star',      // 별점
      'createdAt', // 작성날짜
      [
        sequelize.literal(`(
          SELECT name FROM owners 
          WHERE owners.id = Review.owner_id
        )`),
        'ownerName'
      ],
      [
        sequelize.literal(`(
          SELECT name FROM cleaners 
          WHERE cleaners.id = Review.cleaner_id
        )`),
        'cleanerName'
      ]
    ],
    order: [['created_at', 'DESC']],
    limit,
    offset,
    transaction: t
  });
}

/**
 * 2. 리뷰 관리 통계 집계
 */
async function getReviewStatistics(t = null) {
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);

  // 금일 날짜의 모든 예약 건수
  const todayWorkCnt = await Reservation.count({
    where: {
      date: { [Op.between]: [todayStart, todayEnd] }
    },
    transaction: t
  });

  // 금일 작성된 리뷰 수
  const newReviewCnt = await Review.count({
    where: {
      created_at: { [Op.between]: [todayStart, todayEnd] }
    },
    transaction: t
  });

  // Soft Delete된 전체 리뷰 수
  const deletedReviewCnt = await Review.count({
    where: {
      deleted_at: { [Op.ne]: null }
    },
    paranoid: false,
    transaction: t
  });

  return {
    todayWorkCnt,
    newReviewCnt,
    deletedReviewCnt
  };
}

export default {
  findReviews,
  getReviewStatistics
};