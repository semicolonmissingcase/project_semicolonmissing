/**
 * @file app/services/admin/admin.reservations.service.js
 * @description 관리자 reservations service
 * 260113 v1.0.0 jae init
 */

import adminReservationsRepositorie from '../../repositories/admin/admin.reservations.repositorie.js';
import constants from '../../constants/models.constants.js';
const { ReservationStatus } = constants;
import dayjs from 'dayjs';

/**
 * 하단 테이블용 예약 리스트 조회
 */
async function getReservations({ limit, offset }) {
  const startOfMonth = dayjs().startOf('month').format('YYYY-MM-DD');
  const endOfMonth = dayjs().endOf('month').format('YYYY-MM-DD');

  return await adminReservationsRepositorie.paginationReservations(null, { 
    limit, 
    offset, 
    startAt: startOfMonth, 
    endAt: endOfMonth 
  });
}

/**
 * 상단 통계용 데이터 집계
 */
async function getStatistics() {
  const startOfMonth = dayjs().startOf('month').format('YYYY-MM-DD');
  const endOfMonth = dayjs().endOf('month').format('YYYY-MM-DD');

  const totalCnt = await adminReservationsRepositorie.findReservationsCount(null, { 
    startAt: startOfMonth, 
    endAt: endOfMonth 
  });

  const cancelCnt = await adminReservationsRepositorie.findReservationsCount(null, { 
    startAt: startOfMonth, 
    endAt: endOfMonth, 
    status: ReservationStatus.CANCELED,
  });

  const completedCnt = await adminReservationsRepositorie.findReservationsCount(null, { 
    startAt: startOfMonth, 
    endAt: endOfMonth, 
    status: ReservationStatus.COMPLETED,
  });

  const requestCnt = await adminReservationsRepositorie.findReservationsCount(null, { 
    startAt: startOfMonth, 
    endAt: endOfMonth, 
    status: ReservationStatus.REQUEST,
  });

  return { 
    totalCnt,    // 한 달 총 예약
    cancelCnt,   // 한 달 취소 건수
    completedCnt, // 한 달 완료 건수
    requestCnt    // 한 달 신규 요청
  };
}

export default {
  getReservations,
  getStatistics,
};