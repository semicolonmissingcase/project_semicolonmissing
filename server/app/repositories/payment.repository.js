/**
 * @file app/repositories/payment.repositroy.js
 * @description Payment Repository
 * 260102 v1.0.0 jae init 
 */

import db from "../models/index.js";
import constants from "../constants/models.constants.js";

const { PaymentStatus, ReservationStatus } = constants;
const { Payment, Reservation } = db;

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
    status: '대기',
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
  const { orderId, ...updateFields } = paymentData;

  const dataToUpdate = {
    paymentKey: paymentData.paymentKey,
    method: paymentData.method,
    approvedAt: paymentData.approvedAt,
    receiptUrl: paymentData.receiptUrl,
    status: PaymentStatus.DONE, // 성공 시 상태 변경 명시
  };

  const [updatedRows] = await Payment.update(dataToUpdate, {
    where: { order_id: orderId },
    transaction
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
  
  return updatedRows;
}

export default {
  createPendingPayment,
  findByOrderId,
  updatePaymentAfterSuccess,
};