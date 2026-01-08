/**
 * @file app/repositories/payment.repositroy.js
 * @description Payment Repository
 * 260102 v1.0.0 jae init 
 */

import db from "../models/index.js";
import constants from "../constants/models.constants.js";

const { PaymentStatus, ReservationStatus, EstimateStatus, AdjustmentStatus } = constants;
const { Payment, Reservation, Estimate, Adjustment, Cleaner } = db;

/**
 * 대기 상태의 결제 정보 생성
 */
async function createPendingPayment(paymentData, transaction = null) {
  console.log(paymentData);

  const dataToCreate = {
    orderId: paymentData.orderId,
    totalAmount: paymentData.amount,
    reservationId: paymentData.reservationId,
    estimateId: paymentData.estimateId,
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
    include: [
      {
        model: Reservation,
        as: 'reservation'
      }
    ],
    transaction
  });
}

/**
 * 결제 승인 성공 후 상태 업데이트
 */
async function updatePaymentAfterSuccess(paymentData, reservationId, transaction) {
  const { orderId, paymentKey, method, approvedAt, receiptUrl } = paymentData;

  // 결제 테이블 업데이트 
  const [updatedRows] = await Payment.update({
    paymentKey,
    method,
    approvedAt,
    receiptUrl,
    status: PaymentStatus.DONE, // 성공 시 상태 '완료'로 변경
  }, {
    where: { orderId: orderId },
  });

  if (updatedRows === 0) {
    throw new Error('결제 레코드를 찾을 수 없습니다.');
  }

  // 예약 상태 업데이트 
  await Reservation.update({
    status: ReservationStatus.APPROVED
  }, {
    where: { id: reservationId },
    transaction
  });

  // 견적서 상태 업데이트
  await Estimate.update({
    status: EstimateStatus.COMPLETED
  }, {
    where: { reservationId: reservationId },
    transaction
  });

  const payment = await db.Payment.findOne({
    where: { orderId: orderId },
    include: [{
      model: db.Estimate,
      as: 'estimate',
      attributes: [ 'id', 'cleaner_id' ]
    }],
    transaction
  });

  if (db.Adjustment) {
    await db.Adjustment.create({
      reservationId: reservationId,
      paymentId: payment.id,
      estimateId: payment.EstimateId,
      cleanerId: payment.Estimate.cleaner.id,
      settlementAmount: amount,
      status: AdjustmentStatus.READY, // 정산 대기 상태
    }, { transaction });
  }

  return updatedRows;
}

/**
 * 결제 취소
 * @param {*} cancelData 
 * @param {*} reservationId 
 * @param {*} transaction 
 * @returns 
 */
async function updateStatusAfterCancel(cancelData, reservationId, transaction) {
  const { paymentKey, cancelReason, cancelAt } = cancelData;

  // 결제 테이블 업데이트
  const [updatedPaymentRows] = await Payment.update({
    status: PaymentStatus.CANCELED,
    cancelReason: cancelReason,
    cancelAt: cancelAt // 토스에서 받은 공식 취소 일시
  }, {
    where: { paymentKey: paymentKey },
    transaction
  });

  if (updatedPaymentRows === 0) {
    throw new Error("취소할 결제 레코드를 찾을 수 없습니다.");
  }

  // 예약 테이블 업데이트
  // 결제가 취소되었으므로 예약 상태 '취소'로 변경
  await Reservation.update({
    status: Reservation.CANCELED
  }, {
    where: { id: reservationId },
    transaction
  });

  // 견적서 테이블 업데이트
  // 견적 상태를 '수락'으로 변경
  await Estimate.update({
    status: 'ACCEPTED'
  }, {
    where: { reservationId: reservationId },
    transaction
  });

  // 정산 테이블 업데이트
  // 정산 상태를 '정산 취소'로 변경
  if(db.Adjustment) {
    await db.Adjustment.update({
      status: AdjustmentStatus.CANCELED, 
      memo: '결제 취소로 인한 정산 제외'
    }, {
      where: { reservationId: reservationId },
      transaction
    });
  }

  return updatedRows;
}

export default {
  createPendingPayment,
  findByOrderId,
  updatePaymentAfterSuccess,
  updateStatusAfterCancel,
};