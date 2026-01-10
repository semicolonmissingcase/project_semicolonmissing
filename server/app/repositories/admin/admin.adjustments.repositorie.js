/**
 * @file app/repositories/admin/admin.adjustments.repositorie.js
 * @description 관리자 adjustments repositorie
 * 260110 v1.0.0 jae init
 */
import { Op } from 'sequelize';
import db from '../../models/index.js';
const { sequelize, Adjustment, Cleaner } = db;

/**
 * 기사 정산 리스트 조회 (Pagination)
 */
async function paginationAdjustments(t = null, { limit, offset }) {
  return await Adjustment.findAndCountAll({
    attributes: [
      'id',
      'settlementAmount', // 정산 금액
      'status',           // 상태 (정산 대기, 지급 대기 등)
      'scheduledAt',      // 정산 예정일
      'completedAt',      // 정산 완료일
      [
        // 기사 이름을 가져오기 위한 서브쿼리 (직관적인 관리를 위해 추가)
        sequelize.literal(`(
          SELECT name FROM cleaners WHERE cleaners.id = Adjustment.cleaner_id
        )`),
        'cleanerName'
      ],
      [
        // 기사 전화번호를 가져오기 위한 서브쿼리
        sequelize.literal(`(
          SELECT phone_number FROM cleaners WHERE cleaners.id = Adjustment.cleaner_id
        )`),
        'cleanerPhoneNumber'
      ]
    ],
    order: [
      ['scheduledAt', 'DESC'], // 최신 정산 예정일 순서
      ['id', 'DESC']
    ],
    limit,
    offset,
    transaction: t
  });
}

/**
 * 정산 통계 카운트 (상태별 집계용)
 * @param {{status?: string, startAt?: string, endAt?: string}} paramWhere 
 */
async function findAdjustmentsCount(t = null, paramWhere) {
  let where = {};

  // 상태별 필터 (정산 대기, 지급 대기, 완료 등)
  if (paramWhere?.status) {
    where.status = paramWhere.status;
  }

  // 기간 필터 (정산 예정일 기준)
  if (paramWhere?.startAt || paramWhere?.endAt) {
    where.scheduledAt = {};
    if (paramWhere.startAt) where.scheduledAt[Op.gte] = paramWhere.startAt;
    if (paramWhere.endAt) where.scheduledAt[Op.lte] = paramWhere.endAt;
  }

  return await Adjustment.count({
    where,
    transaction: t,
  });
}

export default {
  paginationAdjustments,
  findAdjustmentsCount,
}