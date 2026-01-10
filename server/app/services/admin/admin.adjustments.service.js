/**
 * @file app/services/admin/admin.adjustments.service.js
 * @description 관리자 adjustments service
 * 260110 v1.0.0 jae init
 */

import adminAdjustmentsRepository from "../../repositories/admin/admin.adjustments.repository.js";

async function getAdjustments({ limit, offset }) {
  const { rows, count } = await adminAdjustmentsRepository.paginationAdjustments(null, { limit, offset });
  return { adjustments: rows, total: count };
}

async function getStatistics() {
  // 1. 전체 정산 건수 (전체 히스토리)
  const totalCnt = await adminAdjustmentsRepository.findAdjustmentsCount(null);
  
  // 2. 지급 대기 건수 (관리자가 지금 처리해야 할 긴급한 건들)
  const pendingCnt = await adminAdjustmentsRepository.findAdjustmentsCount(null, { status: '지급 대기' });
  
  // 3. 정산 완료 건수 (이번 달 혹은 전체 성공 건수)
  const completedCnt = await adminAdjustmentsRepository.findAdjustmentsCount(null, { status: '정산 완료' });
  
  // 4. 보류 건수 (문제가 있어 확인이 필요한 건들)
  const holdCnt = await adminAdjustmentsRepository.findAdjustmentsCount(null, { status: '보류' });

  return { totalCnt, pendingCnt, completedCnt, holdCnt };
}

export default {
  getAdjustments,
  getStatistics,
}