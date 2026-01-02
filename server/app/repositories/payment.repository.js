/**
 * @file app/repositories/payment.repositroy.js
 * @description Payment Repository
 * 260102 v1.0.0 jae init 
 */

import db from "../models/index.js";
import constants from "../constants/models.constants.js";

// 수정: 구조분해 할당 문법 수정
const { PaymentStatus, ReservationStatus } = constants;
const { Payment, Reservation } = db;

/**
 * 대기 상태의 결제 정보 생성
 */
async function createPendingPayment(paymentData, transaction = null) {
  const dataToCreate = {
    // 주의: DB 컬럼명이 order_id라면 왼쪽 키값을 order_id로 맞춰야 합니다.
    order_id: paymentData.orderId, 
    total_amount: paymentData.amount,
    reservation_id: paymentData.reservationId,
    estimate_id: paymentData.estimateId,
    status: PaymentStatus.READY,
  };
  return await Payment.create(dataToCreate, { transaction });
}

/**
 * 주문 번호로 결제 정보 조회
 */
async function findByOrderId(orderId, transaction = null) {
  return await Payment.findOne({
    where: { order_id: orderId },
    // include 사용 시 모델 설정에서 관계(HasOne/BelongsTo)가 정의되어 있어야 합니다.
    include: [{
      model: Reservation,
      // as: 'reservation', // 모델 설정과 일치해야 함. 설정 안 했다면 제거 권장
    }],
    transaction
  });
}

/**
 * 결제 승인 성공 후 상태 업데이트
 */
async function updatePaymentAfterSuccess(paymentData, reservationId, transaction) {
  // 수정: 변수명 정리 (dataToUpdate로 명명)
  const { orderId, ...updateFields } = paymentData;

  const dataToUpdate = {
    ...updateFields,
    status: PaymentStatus.DONE, // 성공 시 상태 변경 명시
  };

  const [updatedRows] = await Payments.update(dataToUpdate, {
    where: { order_id: orderId },
    transaction
  });

  // 수정: 변수명 오타 수정 (updatedRows)
  if (updatedRows === 0) {
    throw new Error('결제 레코드를 찾을 수 없습니다.');
  }

  // 예약 상태 업데이트 
  await Reservation.update({
    status: ReservationStatus.COMPLETED
  }, {
    where: { id: reservationId },
    transaction
  }); 
  
  return updatedRows;
}

export default {
  createPendingPayment,
  findByOrderId,
  updatePaymentAfterSuccess,
};