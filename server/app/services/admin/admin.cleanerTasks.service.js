/**
 * @file app/services/admin/admin.cleanerTasks.service.js
 * @description 관리자 cleanerTasks service
 * 260113 v1.0.0 jae init
 */

import adminCleanerTasksRepositorie from '../../repositories/admin/admin.cleanerTasks.repositorie.js';
import constants from '../../constants/models.constants.js';
const { ReservationStatus } = constants;
import dayjs from 'dayjs';

/**
 * 테이블 용 전체 기사 작업 리스트 조회
 */
async function getCleanerTasks({ limit, offset }) {
  const startOfMonth = dayjs().startOf('month').format('YYYY-MM-DD');
  const endOfMonth = dayjs().endOf('month').format('YYYY-MM-DD');

  const { rows, count } = await adminCleanerTasksRepositorie.findAllCleanerTasks(
    null,
    { limit, offset, startAt: startOfMonth, endAt: endOfMonth }
  );

  return {
    total: count,
    tasks: rows.map(item => ({
      id: item.id,
      cleanerName: item.dataValues?.cleanerName || '미지정',
      workDate: item.dataValues?.date || item.createdAt,
      location: item.dataValues?.location || '정보 없음',
      paymentAmount: item.dataValues?.paymentAmount || 0,
      status: item.status
    }))
  };
}

/**
 * 통계 용 데이터 집계
 */
async function getStatistics() {
  const startOfMonth = dayjs().startOf('month').format('YYYY-MM-DD');
  const endOfMonth = dayjs().endOf('month').format('YYYY-MM-DD');

  // 전체 작업 수 (이번 달)
  const totalCnt = await adminCleanerTasksRepositorie.findTasksCount(null, {
    startAt: startOfMonth,
    endAt: endOfMonth,
  });

  // 완료된 작업 수
  const completedCnt = await adminCleanerTasksRepositorie.findTasksCount(null, {
    startAt: startOfMonth,
    endAt: endOfMonth,
    status: ReservationStatus.COMPLETED,
  });

  // 미완료 작업 수
  const pendingCnt = await adminCleanerTasksRepositorie.findTasksCount(null, {
    startAt: startOfMonth,
    endAt: endOfMonth,
    status: ReservationStatus.APPROVED,
  });

  return {
    totalCnt,      // 이번 달 총 작업
    completedCnt,  // 이번 달 완료 건수
    pendingCnt,    // 이번 달 미완료 건수
  };
}

export default {
  getCleanerTasks,
  getStatistics,
};