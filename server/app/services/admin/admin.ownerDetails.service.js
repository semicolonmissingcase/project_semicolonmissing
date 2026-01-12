/**
 * @file app/services/admin/admin.ownerDetails.service.js
 * @description 관리자 상세 ownerDetails service
 * 260113 v1.0.0 jae init
 */

import adminOwnerDetailsRepositorie from "../../repositories/admin/admin.ownerDetails.repositorie.js";

/**
 * 1. 점주 기본 정보 및 소유 매장 목록 가져오기
 */
async function getOwnerDetailWithStores(ownerId) {
  const ownerData = await adminOwnerDetailsRepositorie.findOwnerDetailWithStores(ownerId);
  if (!ownerData) {
    throw new Error("존재하지 않는 점주입니다.");
  }
  return ownerData;
}

/**
 * 2. 점주 예약 이력 페이징 조회
 */
async function getOwnerReservationHistory(ownerId, { limit, offset }) {
  return await adminOwnerDetailsRepositorie.findOwnerReservationHistory(ownerId, { limit, offset });
}

/**
 * 3. 점주 개별 통계 집계
 */
async function getOwnerStatistics(ownerId) {
  const stats = await adminOwnerDetailsRepositorie.getOwnerStatistics(ownerId);

  // 데이터가 없을 경우 기본값 세팅
  return {
    totalSpent: stats?.totalSpent || 0,                   // 총 결제 금액
    activeStoreCnt: stats?.activeStoreCnt || 0,
    completedBookingCnt: stats?.completedBookingCnt || 0, // 예약 완료 건수
  };
}

export default {
  getOwnerDetailWithStores,
  getOwnerReservationHistory,
  getOwnerStatistics,
};