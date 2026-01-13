/**
 * @file app/services/admin/admin.owners.service.js
 * @description 관리자 owners service
 * 260110 v1.0.0 jae init
 */

import adminOwnersRepositorie from '../../repositories/admin/admin.owners.repositorie.js';
import dayjs from 'dayjs';

/**
 * 점주 프로필 리스트 조회
 */
async function ownerGetProfiles({ limit, offset }) {
  return await adminOwnersRepositorie.ownerPaginationProfiles(null, { limit, offset });
}

/**
 * 점주 관련 통계 데이터 조회 (상단 대시보드용)
 */
async function ownerGetStatistics() {
  const nowStartOfDay = dayjs().startOf('day').format('YYYY-MM-DD HH:mm:ss');
  const yesterdayEndOfDay = dayjs().subtract(1, 'day').endOf('day').format('YYYY-MM-DD HH:mm:ss');

  // 1. 총 점주 수 (탈퇴 포함 전체 히스토리)
  const totalCnt = await adminOwnersRepositorie.findOwnersCount(null);
  
  // 2. 신규 점주 수 (오늘 가입자)
  const newCnt = await adminOwnersRepositorie.findOwnersCount(null, { startAt: nowStartOfDay });
  
  // 3. 기존 점주 수 (어제까지 가입한 활성 유저)
  const oldCnt = await adminOwnersRepositorie.findOwnersCount(null, { endAt: yesterdayEndOfDay });
  
  // 4. 탈퇴 점주 수
  const withdrawCnt = await adminOwnersRepositorie.findOwnersCount(null, { isWithdraw: true });

  return { totalCnt, newCnt, oldCnt, withdrawCnt };
}

export default {
  ownerGetProfiles,
  ownerGetStatistics,
}