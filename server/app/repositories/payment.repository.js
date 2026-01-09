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

// /**
//  * 결제 승인 성공 후 상태 업데이트
//  */
async function updatePaymentAfterSuccess(paymentData, reservationId, transaction) {
  const { orderId, paymentKey, method, approvedAt, receiptUrl, totalAmount } = paymentData;

  // 결제 테이블 업데이트 
  const [updatedRows] = await Payment.update({
    paymentKey,
    method,
    approvedAt,
    receiptUrl,
    status: PaymentStatus.DONE, // 성공 시 상태 '성공'으로 변경
  }, {
    where: { orderId: orderId },
    transaction
  });

  if (updatedRows === 0) {
    throw new Error('결제 레코드를 찾을 수 없습니다.');
  }

  // 예약 상태 업데이트 
  await db.Reservation.update({
    status: ReservationStatus.APPROVED
  }, {
    where: { id: reservationId },
    transaction
  });

  // 견적서 상태 업데이트
  await db.Estimate.update({
    status: EstimateStatus.PAID
  }, {
    where: { reservationId: reservationId },
    transaction
  });

  // 정산 생성을 위한 데이터 조회
  const paymentResult = await db.Payment.findOne({
    where: { orderId: orderId },
    include: [{
      model: db.Estimate,
      as: 'estimate',
    }],
    transaction
  });

  // 조회 결과 가공
  const paymentRecord = paymentResult.get({ plain: true });
  const targetEstimate = paymentRecord.estimate;

  // 정산 데이터 생성
  if (db.Adjustment && targetEstimate) {
    const finalCleanerId = targetEstimate.cleanerId || targetEstimate.cleaner_id;

    await db.Adjustment.create({
      reservationId: reservationId,
      paymentId: paymentRecord.id,
      estimateId: targetEstimate.id,
      cleanerId: finalCleanerId,
      settlementAmount: totalAmount || paymentRecord.totalAmount,
      status: AdjustmentStatus.READY, // '정산 대기'
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
  const { paymentKey, cancelReason, canceledAt } = cancelData;

  // 결제 테이블 업데이트
  const [updatedPaymentRows] = await Payment.update({
    status: PaymentStatus.CANCELED,
    cancelReason: cancelReason,
    canceledAt: canceledAt // 토스에서 받은 공식 취소 일시
  }, {
    where: { paymentKey: paymentKey },
    transaction
  });

  if (updatedPaymentRows === 0) {
    throw new Error("취소할 결제 레코드를 찾을 수 없습니다.");
  }

  // 예약 테이블 업데이트
  // 결제가 취소되었지만, 점주가 다시 결제할 수 있게 변경
  await db.Reservation.update({
    status: ReservationStatus.REQUEST
  }, {
    where: { id: reservationId },
    transaction
  });

  // 견적서 테이블 업데이트
  // 견적 상태를 '전송'으로 변경
  await db.Estimate.update({
    status: EstimateStatus.SENT
  }, {
    where: { reservationId: reservationId },
    transaction
  });

  // 정산 테이블 업데이트
  // 결제 취소 건에 대한 정산은 무효화 처리
  // 나중에 재결제 성공 시 새로운 정산 레코드 생성
  if (db.Adjustment) {
    await db.Adjustment.update({
      status: AdjustmentStatus.CANCELED, // '정산 취소'
    }, {
      where:
      {
        reservationId: reservationId,
        status: AdjustmentStatus.READY
      },
      transaction
    });
  }

  return updatedPaymentRows;
}

async function findByPaymentKey(paymentKey) {
  return await Payment.findOne({
    where: { paymentKey },
    include: [{
      model: db.Reservation,
      as: 'reservation'
    }]
  });
}

export default {
  createPendingPayment,
  findByOrderId,
  updatePaymentAfterSuccess,
  updateStatusAfterCancel,
  findByPaymentKey,
};