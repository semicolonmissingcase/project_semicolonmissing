/**
 * @file app/repositories/admin/admin.reservations.repositorie.js
 * @description 관리자 reservations repositorie
 * 260113 v1.0.0 jae init
 */

import { Op } from 'sequelize';
import db from '../../models/index.js';

const { sequelize, Reservation, Owner, Store, Cleaner } = db;

/**
 * 1. 예약 상세 목록 조회 (하단 테이블용)
 */
async function paginationReservations(t = null, { limit, offset, startAt, endAt }) {
  return await Reservation.findAndCountAll({
    where: {
      date: {
        [Op.between]: [startAt, endAt]
      }
    },
    attributes: [
      'id',
      'date',   // 예약 날짜
      'time',   // 예약 시간
      'status', // 예약 상태
      [
        // Reservation.owner_id를 통해 점주(고객) 이름 가져오기
        sequelize.literal(`(
          SELECT name FROM owners 
          WHERE owners.id = Reservation.owner_id
        )`),
        'ownerName'
      ],
      [
        // Reservation.store_id를 통해 매장 이름 가져오기
        sequelize.literal(`(
          SELECT name FROM stores 
          WHERE stores.id = Reservation.store_id
        )`),
        'storeName'
      ],
      [
        // Reservation.cleaner_id를 통해 기사 이름 가져오기
        sequelize.literal(`(
          SELECT name FROM cleaners 
          WHERE cleaners.id = Reservation.cleaner_id
        )`),
        'cleanerName'
      ]
    ],
    order: [
      ['date', 'DESC'],
      ['time', 'DESC']
    ],
    limit,
    offset,
    transaction: t
  });
}

/**
 * 2. 예약 건수 집계 (상단 통계용)
 */
async function findReservationsCount(t = null, { startAt, endAt, status = null }) {
  let where = {
    date: { [Op.between]: [startAt, endAt] }
  };

  if (status) {
    where.status = status;
  }

  return await Reservation.count({
    where,
    transaction: t
  });
}

export default {
  paginationReservations,
  findReservationsCount
};