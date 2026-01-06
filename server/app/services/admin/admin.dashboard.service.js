/**
 * @file app/services/admin/admin.dashboard.service.js
 * @description 관리자 통합 모니터링 대시보드 service
 * 260105 vl.0.0 jae init
 */

import adminDashboardRepository from "../../repositories/admin/admin.dashboard.repository.js";

async function getDashboardData(date) {
  const targetDate = date || new Date().toISOString().slice(0, 10);

  // 1. 통계 조회
  const stats = await adminDashboardRepository.findDailyStats(targetDate);

  // 2. 매출 조회
  const revenue = await adminDashboardRepository.findDailyRevenue(targetDate);

  // 3. 리스트 조회 
  const reservations = await adminDashboardRepository.findRecentReservations(6);

  // 결과 반환
  return {
    summary: {
      total: parseInt(stats.totalCount) || 0,
      matched: parseInt(stats.matchedCount) || 0,
      pending: parseInt(stats.pendingCount) || 0,
      canceled: parseInt(stats.canceledCount) || 0,
    },
    revenue: {
      totalAmount: parseInt(revenue.totalAmount) || 0,
      count: parseInt(revenue.payCount) || 0,
    },
    recentReservations: reservations.map(res => {
      const rawData = res.get({ plain: true });
      return {
        id: rawData.id,
        storeName: rawData.store?.name || '정보 없음',
        ownerName: rawData.store?.owner?.name || '미등록',
        ownerPhone: rawData.store?.owner?.phoneNumber || '-',
        reservedDate: rawData.date,
        reservedTime: rawData.time,
        status: rawData.status,
        createdAt: rawData.createdAt
      };
    })
  };
}

export default { getDashboardData };