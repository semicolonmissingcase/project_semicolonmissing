/**
 * @file app/repositories/admin/admin.dashboard.repository.js
 * @description Admin Dashboard Monitoring Repository
 * 260105 v1.0.0 jae init
 */

import { Sequelize, Op } from "sequelize";
import db from '../../models/index.js';
const { Reservation, Payment, Store, Owner } = db;

/**
 * 1. 대시보드 통합 데이터 조회
 */
async function findDashboardData(date) {
  const stats = await Reservation.findAll({
    attributes: [
      'status',
      [Sequelize.fn('COUNT', Sequelize.col('id')), 'count']
    ],
    where: { 
      createdAt: { [Op.startsWith]: date } 
    },
    group: ['status'],
    raw: true
  });

  const revenue = await Payment.findOne({
    attributes: [
      [Sequelize.fn('SUM', Sequelize.col('total_amount')), 'totalAmount'],
      [Sequelize.fn('COUNT', Sequelize.col('id')), 'payCount']
    ],
    where: {
      createdAt: { [Op.startsWith]: date }
    },
    raw: true
  });

  const recentReservations = await findRecentReservations(6);

  return {
    statistics: {
      requestCnt: stats.find(s => s.status === '요청')?.count || 0,
      approveCnt: stats.find(s => s.status === '승인')?.count || 0,
      cancelCnt: stats.find(s => s.status === '취소')?.count || 0,
      totalRevenue: Number(revenue?.totalAmount || 0),
      totalPayCount: revenue?.payCount || 0
    },
    reservations: recentReservations
  };
}

/**
 * 2. 월별 예약 통계 조회
 */
async function findMonthlyStats() {
  return await Reservation.findAll({
    attributes: [
      // 'createdAt' 대신 'created_at' (스네이크 케이스)으로 수정하세요!
      [Sequelize.fn('DATE_FORMAT', Sequelize.col('created_at'), '%Y-%m'), 'month'],
      [Sequelize.fn('COUNT', Sequelize.col('id')), 'count']
    ],
    group: ['month'],
    order: [[Sequelize.literal('month'), 'ASC']],
    raw: true
  });
}

/**
 * 3. 실시간 예약 현황 조회
 */
async function findRecentReservations(limit = 6) {
  return await Reservation.findAll({
    limit: limit,
    order: [['createdAt', 'DESC']],
    include: [
      {
        model: Store,
        as: 'store',
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
}

export default {
  findDashboardData,
  findMonthlyStats,
  findRecentReservations
};