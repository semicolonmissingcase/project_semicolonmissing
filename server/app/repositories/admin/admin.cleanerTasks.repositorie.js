/**
 * @file app/repositories/admin/admin.cleanerTasks.repositorie.js
 * @description 관리자 cleanerTasks repositorie
 * 260113 v1.0.0 jae init
 */

import { Op } from 'sequelize';
import db from '../../models/index.js';

const { sequelize, Reservation, Cleaner, Store, Payment } = db;

/**
 * 1. 전체 기사 작업 목록 조회 (하단 테이블용)
 */
async function findAllCleanerTasks(t = null, { limit, offset, startAt, endAt }) {
  return await Reservation.findAndCountAll({
    where: {
      date: {
        [Op.between]: [startAt, endAt]
      }
    },
    attributes: [
      'id',
      'date',
      'status',
      [
        sequelize.literal(`(
          SELECT name FROM cleaners 
          WHERE cleaners.id = Reservation.cleaner_id
        )`),
        'cleanerName'
      ],
      [
        sequelize.literal(`(
          SELECT CONCAT(addr1, ' ', addr2) FROM stores 
          WHERE stores.id = Reservation.store_id
        )`),
        'location'
      ],
      [
        sequelize.literal(`(
          SELECT total_amount FROM payments 
          WHERE payments.reservation_id = Reservation.id
          LIMIT 1
        )`),
        'paymentAmount'
      ]
    ],
    order: [
      ['date', 'DESC'],
      ['id', 'DESC']
    ],
    limit,
    offset,
    transaction: t
  });
}

/**
 * 2. 기사 작업 건수 집계
 */
async function findTasksCount(t = null, { startAt, endAt, status = null }) {
  let where = {
    date: { [Op.between]: [startAt, endAt] }
  };

  if (status) {
    if (Array.isArray(status)) {
      where.status = { [Op.in]: status };
    } else {
      where.status = status;
    }
  }

  return await Reservation.count({
    where,
    transaction: t
  });
}

export default {
  findAllCleanerTasks,
  findTasksCount
};