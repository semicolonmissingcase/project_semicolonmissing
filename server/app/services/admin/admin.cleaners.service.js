/**
 * @file app/services/admin/admin.cleaners.service.js
 * @description 관리자 cleaners service
 * 260107 v1.0.0 yh init
 */

import adminCleanersRepositorie from "../../repositories/admin/admin.cleaners.repositorie.js"
import dayjs from 'dayjs';

async function getProfiles({limit, offset}) {
  return await adminCleanersRepositorie.paginationProfiles(null, {limit, offset});
}

async function getStatistics() {
  const nowStartOfDay = dayjs().startOf('day').format('YYYY-MM-DD HH:mm:ss');
  const yesterdayEndOfDay = dayjs().add(-1, 'day').endOf('day').format('YYYY-MM-DD HH:mm:ss');

  const totalCnt = await adminCleanersRepositorie.findCleanersCount(null);
  const newCnt = await adminCleanersRepositorie.findCleanersCount(null, { startAt: nowStartOfDay });
  const oldCnt = await adminCleanersRepositorie.findCleanersCount(null, { endAt: yesterdayEndOfDay });
  const withdrawCnt = await adminCleanersRepositorie.findCleanersCount(null, { isWithdraw: true });
  return { totalCnt, newCnt, oldCnt, withdrawCnt };
}

export default {
  getProfiles,
  getStatistics,
}