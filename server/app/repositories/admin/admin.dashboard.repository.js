/**
 * @file app/repositories/admin/admin.dashboard.repository.js
 * @description Admin Dashboard Monitoring Repository
 * 260105 v1.0.0 jae init
 */

import { Sequelize, Op } from "sequelize";
import db from '../../models/index.js';
const { Reservation, Payment, Store, Owner } = db;


async function findDailyStats(date) {
  const stats = await Reservation.findAll({
    attributes: [
      'status',
      [Sequelize.fn('COUNT', Sequelize.col('id')), 'count']
    ],
    where: { date },
    group: ['status'], // 상태별로 그룹을 묶음
    raw: true
  });
  
  // 결과 데이터 가공 (배열 -> 객체)
  // [{status: '승인', count: 5}, {status: '요청', count: 3}] 형태를 변환
  return stats.reduce((acc, cur) => {
    acc[cur.status] = cur.count;
    return acc;
  }, {});
}

async function findDailyRevenue(date) {
  const totalAmount = await Payment.sum('total_amount', {
    where: {
      createdAt: { [Op.startsWith]: date }
    }
  });

  const payCount = await Payment.count({
    where: {
      createdAt: { [Op.startsWith]: date }
    }
  });

  return { totalAmount, payCount };
}

/**
 * 실시간 예약 현황 (최신순 리스트) 조회
 * 점주와 매장 정보를 JOIN 하여 가져옴
 * @param {number} limit 조회 개수
 * @returns {Promise<Array>}
 */
async function findRecentReservations(limit = 6) {
  const reservations = await Reservation.findAll({
    limit: limit,
    order: [['createdAt', 'DESC']],
    include: [
      {
        model: Store,
        as: 'store', // 모델 정의 시 설정한 alias 확인 필요
        attributes: ['name'],
        include: [
          {
            model: Owner,
            as: 'owner',
            attributes: ['name', 'phoneNumber']
          }
        ]
      }
    ]
  });

  return reservations;
}

export default {
  findDailyStats,
  findDailyRevenue,
  findRecentReservations,
};