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
};

// 결제 관련 상태값
const PaymentStatus = {
  READY: '대기',
  DONE: '완료',
  FAILED: '실패',
  EXPIRED: '만료',
  CANCELED: '취소',
};

// 결제 관련 상태값
const IsAssignStatus = {
  ASSIGNED: '지정',
  NORMAL: '일반',
};

// 견적서 관련 상태값
const EstimateStatus = {
  SENT: '전송',
  ACCEPTED: '수락',
  COMPLETED: '결제 완료'
};

// 정산 관련 상태값
const AdjustmentStatus = {
  READY: '정산 대기',
  PENDING: '지급 대기',
  COMPLETED: '정산 완료',
  HOLD: '보류',
  CANCELED: '정산 취소'
};

Object.freeze(ReservationStatus);
Object.freeze(PaymentStatus);
Object.freeze(IsAssignStatus);
Object.freeze(EstimateStatus);
Object.freeze(AdjustmentStatus);

export default {
  ReservationStatus,
  PaymentStatus,
  IsAssignStatus,
  EstimateStatus,
  AdjustmentStatus,
}