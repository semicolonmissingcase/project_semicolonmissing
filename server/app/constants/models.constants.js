/**
 * @file app/constants/models.constants.js
 * @description Model Contants 정의
 * 251229 v1.0.0 jh init
 */
const ReservationStatus = {
  REQUEST: '요청',
  APPROVED: '승인',
  IN_PROGRESS: '진행중',
  COMPLETED: '완료',
  ACCEPTED: '동의',
  CANCELED: '취소',
}
Object.freeze(ReservationStatus);

export default {
  ReservationStatus,
}
