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
 * '정산 대기' 상태가 우선적으로 보이도록 정렬 기준을 설정했습니다.
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
        // 서브쿼리: 'Adjustment' 대신 실제 DB 테이블명인 'adjustments'를 사용하는 것이 안전합니다.
        sequelize.literal(`(
          SELECT name FROM cleaners WHERE cleaners.id = adjustments.cleaner_id
        )`),
        'cleanerName'
      ],
      [
        sequelize.literal(`(
          SELECT phone_number FROM cleaners WHERE cleaners.id = adjustments.cleaner_id
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
 * 프론트엔드 통계 카드에서 '정산 대기' 건수를 정확히 집계하기 위함입니다.
 */
async function findAdjustmentsCount(t = null, paramWhere) {
  let where = {
    deleted_at: null // Soft delete 사용 시 추가
  };

  if (paramWhere?.status) {
    where.status = paramWhere.status;
  }

  // 기간 필터링이 필요한 경우
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
 * 관리자가 버튼을 클릭했을 때 '정산 대기' -> '정산 완료'로 변경하며 시간을 기록합니다.
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