/**
 * @file app/services/admin/admin.adjustments.service.js
 * @description 관리자 adjustments service
 * 260110 v1.0.0 jae init
 */

import adminAdjustmentsRepositorie from "../../repositories/admin/admin.adjustments.repositorie";

/**
 * 1. 정산 목록 조회 서비스
 */
async function getAdjustments({ limit, offset }) {
  const { rows, count } = await adminAdjustmentsRepositorie.paginationAdjustments(null, { limit, offset });
  
  return { 
    adjustments: rows, 
    total: count,
    currentPage: Math.floor(offset / limit) + 1
  };
}

/**
 * 2. 정산 통계 집계 서비스
 */
async function getStatistics() {
  const [totalCnt, pendingCnt, completedCnt, holdCnt] = await Promise.all([
    adminAdjustmentsRepositorie.findAdjustmentsCount(null, {}),
    adminAdjustmentsRepositorie.findAdjustmentsCount(null, { status: '정산 대기' }),
    adminAdjustmentsRepositorie.findAdjustmentsCount(null, { status: '정산 완료' }),
    adminAdjustmentsRepositorie.findAdjustmentsCount(null, { status: '보류' })
  ]);

  return {
    statistics: {
      totalCnt,     // 전체 정산 건수
      pendingCnt,   // 정산 대기 건수
      completedCnt, // 정산 완료 건수
      holdCnt       // 보류 건수
    }
  };
}

/**
 * 3. 정산 상태 업데이트 서비스
 */
async function updateAdjustmentStatus(id, status) {
  return await adminAdjustmentsRepositorie.updateAdjustmentStatus(id, status);
}

export default {
  getAdjustments,
  getStatistics,
  updateAdjustmentStatus,
};