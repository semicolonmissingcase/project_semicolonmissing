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

// 결제 관련 상태값 추가
const PaymentStatus = {
  READY: '대기',
  DONE: '완료',
  FAILED: '실패',
  EXPIRED: '만료',
  CANCELED: '취소',
}

// 결제 관련 상태값 추가
const IsAssignStatus = {
  Assigned: '지정',
  Normal: '일반',
}

Object.freeze(ReservationStatus);
Object.freeze(PaymentStatus);
Object.freeze(IsAssignStatus);

export default {
  ReservationStatus,
  PaymentStatus,
  IsAssignStatus,
}