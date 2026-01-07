import axios from 'axios';
import db from '../models/index.js';
import paymentRepository from '../repositories/payment.repository.js';
import myError from '../errors/customs/my.error.js';
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
      where: { id: reservationId, ownerId: userId },
      transaction: t,
    });

    if (!reservation) {
      throw myError('결제할 예약 정보를 찾을 수 없습니다.', NOT_FOUND_ERROR);
    }
    
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
        amount: estimate.estimatedAmount,
        reservationId: reservation.id,
        estimateId: estimate.id,
      },
      t
    );

    // 예약 상태를 '대기'로 변경
    await reservation.update({ status: ReservationStatus.PENDING }, { transaction: t });

    return {
      orderId: orderId,
      amount: estimate.estimatedAmount,
      reservationName: `제빙기 청소 예약 #${reservation.id}`,
    };
  });
}

/**
 * 결제 승인
 */
async function confirmPayment({ paymentKey, orderId, amount, userId }) {
  // 1. 트랜잭션 시작
  const t = await db.sequelize.transaction();
  
  try {
    const payment = await paymentRepository.findByOrderId(orderId, t);
    
    if (!payment) {
      throw myError("해당 주문 내역을 찾을 수 없습니다.", NOT_FOUND_ERROR);
    }
    
    if (Number(payment.totalAmount) !== Number(amount)) {
      throw myError("결제 금액이 일치하지 않습니다.", BAD_REQUEST_ERROR);
    }

    if (payment.reservation.ownerId !== userId) {
      throw myError("본인의 결제 건에 대해서만 승인할 수 있습니다.", BAD_REQUEST_ERROR);
    }

    if (payment.status !== PaymentStatus.READY) {
      throw myError('이미 처리된 결제입니다.', ALREADY_PROCESSED_ERROR);
    }

    // 2. 토스 인증 헤더 생성
    const authorizations = Buffer.from(process.env.TOSS_SECRET_KEY + ":").toString("base64");

    // 3. 토스 승인 API 호출
    const response = await axios.post(
      "https://api.tosspayments.com/v1/payments/confirm",
      { 
        paymentKey, 
        orderId, 
        amount: Number(amount)  
      },
      { 
        headers: {
          Authorization: `Basic ${authorizations}`,
          "Content-Type": "application/json", 
        },
        timeout: 10000 
      }
    );

    const tossResult = response.data;

    // 4. 승인 성공 시 DB 상태 업데이트 
    await paymentRepository.updatePaymentAfterSuccess(
      {
        orderId: tossResult.orderId,
        paymentKey: tossResult.paymentKey,
        method: tossResult.method,
        approvedAt: tossResult.approvedAt,
        receiptUrl: tossResult.receipt?.url, 
      }, 
      payment.reservationId, 
      t 
    );

    // 5. 모든 작업 성공 시 커밋
    await t.commit();
    return tossResult;

  } catch (error) {
    // 6. 실패 시 롤백 및 에러 핸들링
    if (t) await t.rollback();

    if (error.response) {
      const { code, message } = error.response.data;
      throw myError(`${code}: ${message}`, BAD_REQUEST_ERROR);
    }
    
    throw error;
  }
}

async function cancelPayment() {
  
}

export default { 
  readyPayment,
  confirmPayment,  
};