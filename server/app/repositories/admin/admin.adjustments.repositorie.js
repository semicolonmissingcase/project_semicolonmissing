/**
 * @file app/repositories/admin/admin.adjustments.repositorie.js
 * @description 관리자 adjustments repositorie
 * 260110 v1.0.0 jae init
 */
import { Op } from 'sequelize';
import db from '../../models/index.js';
const { sequelize, Adjustment } = db;

/**
 * 1. 기사 정산 리스트 조회 (Pagination)
 */
async function paginationAdjustments(t = null, { limit, offset }) {
  return await Adjustment.findAndCountAll({
    attributes: [
      'id',
      'settlementAmount',
      'status',
      'scheduledAt',
      'completedAt',
      [
        sequelize.literal(`(
          SELECT name FROM cleaners WHERE cleaners.id = adjustment.cleaner_id
        )`),
        'cleanerName'
      ],
      [
        sequelize.literal(`(
          SELECT phone_number FROM cleaners WHERE cleaners.id = adjustment.cleaner_id
        )`),
        'cleanerPhoneNumber'
      ]
    ],
    // 정산 대기 상태를 먼저 보여주고, 그 다음 예정일 순으로 정렬
    order: [
      [sequelize.literal("status = '정산 대기'"), 'DESC'],
      ['scheduledAt', 'DESC']
    ],
    limit,
    offset,
    transaction: t
  });
}

/**
 * 2. 정산 통계 카운트
 */
async function findAdjustmentsCount(t = null, paramWhere) {
  let where = {
    deleted_at: null
  };

  if (paramWhere?.status) {
    where.status = paramWhere.status;
  }

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

/**
 * 3. 정산 상태 업데이트
 */
async function updateAdjustmentStatus(id, status, t = null) {
  return await Adjustment.update(
    {
      status: status, // '정산 완료'가 전달됨
      completedAt: status === '정산 완료' ? new Date() : null
    },
    {
      where: { id },
      transaction: t
    }
  );
}

export default {
  paginationAdjustments,
  findAdjustmentsCount,
  updateAdjustmentStatus,
};