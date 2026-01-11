/**
 * @file app/services/admin/admin.dashboard.service.js
 * @description 관리자 통합 모니터링 대시보드 service
 * 260105 vl.0.0 jae init
 */

import adminDashboardRepository from "../../repositories/admin/admin.dashboard.repository.js";

async function getDashboardData(date) {

  const targetDate = date || new Date().toISOString().slice(0, 10);

  // 2. Repository
  const result = await adminDashboardRepository.findDashboardData(targetDate);

  const monthlyRaw = await adminDashboardRepository.findMonthlyStats(); 

  const { statistics, reservations } = result;

  // 3. 상단 카드용 통계 데이터 구조화
  const processedStatistics = {
    totalNew: (statistics.approveCnt || 0) + (statistics.requestCnt || 0) + (statistics.cancelCnt || 0),
    matchingDone: statistics.approveCnt || 0,
    matchingYet: statistics.requestCnt || 0,
    cancelCnt: statistics.cancelCnt || 0,
    totalAmount: statistics.totalRevenue || 0,
    payCount: statistics.totalPayCount || 0,
  };

  // 4. 테이블 리스트용 데이터 가공
  const profiles = reservations.map(res => {
    const rawData = typeof res.get === 'function' ? res.get({ plain: true }) : res;
    return {
      id: rawData.id,
      createdAt: rawData.createdAt ? new Date(rawData.createdAt).toISOString().slice(0, 10) : '-',
      customerName: rawData.store?.owner?.name || '미등록',
      phoneNumber: rawData.store?.owner?.phoneNumber || '-',
      reservationDate: rawData.date || '-',
      quantity: rawData.quantity || 1,
    };
  });

  // 5. 월별 차트용 데이터 가공
  const chartData = (monthlyRaw || []).map(item => ({
    name: item.month.split('-')[1] + '월',
    건수: parseInt(item.count) || 0
  }));

  // 6. 최종 응답
  return {
    data: {
      statistics: processedStatistics,
      profiles: profiles,
      chartData: chartData
    }
  };
}

export default { getDashboardData };