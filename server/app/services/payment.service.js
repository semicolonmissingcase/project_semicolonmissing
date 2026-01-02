/**
 * @file app/services/payment.service.js
 * @description Payment Service
 * 251231 v1.0.0 jae init
 */

import axios from 'axios';
import db from '../models/index.js';
import paymentRepository from '../repositories/payment.repository.js';
import myError from '../errors/customs/my.error.js';
// 상수 파일 import 방식 수정
import modelsConstants from '../constants/models.constants.js';
const { PaymentStatus, ReservationStatus } = modelsConstants;
import { 
  ALREADY_PROCESSED_ERROR, 
  BAD_REQUEST_ERROR, 
  NOT_FOUND_ERROR, 
  SYSTEM_ERROR 
} from '../../configs/responseCode.config.js';

/**
 * 결제 준비
 */
async function readyPayment({ reservationId, userId }) {
  return await db.sequelize.transaction(async (t) => {
    const reservation = await db.Reservation.findOne({
      where: { id: reservationId, ownerId: userId }, // ownerId 컬럼명 확인 필요
      transaction: t,
    });

    if (!reservation) {
      throw myError('결제할 예약 정보를 찾을 수 없습니다.', NOT_FOUND_ERROR);
    }
    
    // 예약 상태 검증 (요청 상태일 때만 결제 가능)
    if (reservation.status !== ReservationStatus.REQUEST) {
      throw myError('이미 처리되었거나 진행중인 예약입니다.', ALREADY_PROCESSED_ERROR);
    }

    const estimate = await db.Estimate.findOne({
      where: { reservationId: reservation.id },
      transaction: t,
    });

    if (!estimate) {
      throw myError('결제에 필요한 견적서 정보를 찾을 수 없습니다.', NOT_FOUND_ERROR);
    }

    const orderId = `reservation_${reservation.id}_${new Date().getTime()}`;

    await paymentRepository.createPendingPayment(
      {
        orderId: orderId,
        amount: reservation.amount,
        reservationId: reservation.id,
        estimateId: estimate.id,
      },
      t
    );

    // 예약 상태를 '대기'로 변경 (결제창 진입 의미)
    // models.constants에 정의된 상수를 사용하는 것이 좋습니다.
    await reservation.update({ status: 'PENDING' }, { transaction: t });

    return {
      orderId: orderId,
      amount: reservation.amount,
      reservationName: `제빙기 청소 예약 #${reservation.id}`,
    };
  });
}

/**
 * 결제 승인
 */
async function confirmPayment({ paymentKey, orderId, amount, userId }) {
  return await db.sequelize.transaction(async (t) => {
    // repository에서 include: [Reservations]를 했으므로 payment.reservation 접근 가능
    const payment = await paymentRepository.findByOrderId(orderId, t);
    
    if (!payment) {
      throw myError("해당 주문 내역을 찾을 수 없습니다.", NOT_FOUND_ERROR);
    }
    
    // DB 컬럼명이 total_amount(snake_case)인지 확인하세요.
    if (Number(payment.total_amount) !== Number(amount)) {
      throw myError("결제 금액이 일치하지 않습니다.", BAD_REQUEST_ERROR);
    }

    // 작성하신 코드의 payment.Reservation.ownerId 부분 확인 필요 (as 설정에 따라 다름)
    if (payment.reservation.ownerId !== userId) {
      throw myError("본인의 결제 건에 대해서만 승인할 수 있습니다.", BAD_REQUEST_ERROR);
    }

    if (payment.status !== PaymentStatus.READY) {
      throw myError('이미 처리된 결제입니다.', ALREADY_PROCESSED_ERROR);
    }

    const authorizations = Buffer.from(process.env.TOSS_SECRET_KEY + ":").toString("base64");

    const response = await axios.post(
      "https://api.tosspayments.com/v1/payments/confirm",
      { paymentKey, orderId, amount },
      { 
        headers: {
          Authorization: `Basic ${authorizations}`, // 한 칸 띄우기 수정됨
          "Content-Type": "application/json", 
        },
      }
    ).catch(error => {
      if (error.response) {
        throw myError(`토스 결제 승인 실패: ${error.response.data.message}`, BAD_REQUEST_ERROR, error.response.data);
      }
      throw myError('토스 페이먼츠 서버 통신 오류', SYSTEM_ERROR, error);
    });

    const tossResult = response.data;

    // 승인 성공 시 상태 업데이트
    await paymentRepository.updatePaymentAfterSuccess(
      {
        orderId: tossResult.orderId,
        paymentKey: tossResult.paymentKey,
        method: tossResult.method,
        approvedAt: tossResult.approvedAt,
        receiptUrl: tossResult.receipt?.url, // 영수증 URL 옵셔널 체이닝 추천
      }, 
      payment.reservation_id, 
      t 
    );

    return tossResult;
  });
}

export default { 
  readyPayment,
  confirmPayment,  
};