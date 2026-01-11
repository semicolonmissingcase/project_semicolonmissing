/**
 * @file app/constants/models.constants.js
 * @description Model Contants 정의
 * 251229 v1.0.0 jh init
 */

const ReservationStatus = {
  REQUEST: '요청',
  APPROVED: '승인',
  COMPLETED: '완료',
  CANCELED: '취소',
};

// 결제 관련 상태값
const PaymentStatus = {
  READY: '대기',
  DONE: '성공',
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
  PAID: '결제 완료',
  MATCHING_FAILED: '매칭 실패',
};

// 정산 관련 상태값
const AdjustmentStatus = {
  READY: '정산 대기',
  PENDING: '지급 대기',
  COMPLETED: '정산 완료',
  HOLD: '보류',
  CANCELED: '정산 취소'
};

// 문의 관련 상태값
const InquiryStatus = {
  READY: '대기',
  COMPLETED: '완료'
}

// 문의 카테고리
const InquiryCategory = {
  QUOTE: '견적 문의',
  SERVICE: '서비스 문의',
  TECH: '기술 지원',
  COMPLAINT: '불만/개선사항',
  PAYMENT: '결제 문의',
  ETC: '기타',
}

Object.freeze(ReservationStatus);
Object.freeze(PaymentStatus);
Object.freeze(IsAssignStatus);
Object.freeze(EstimateStatus);
Object.freeze(AdjustmentStatus);
Object.freeze(InquiryStatus);
Object.freeze(InquiryCategory);

export default {
  ReservationStatus,
  PaymentStatus,
  IsAssignStatus,
  EstimateStatus,
  AdjustmentStatus,
  InquiryStatus,
  InquiryCategory,
}