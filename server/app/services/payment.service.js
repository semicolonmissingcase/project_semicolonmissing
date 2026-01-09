import axios from 'axios';
import db from '../models/index.js';
import paymentRepository from '../repositories/payment.repository.js';
import myError from '../errors/customs/my.error.js';
import modelsConstants from '../constants/models.constants.js';
const { PaymentStatus, ReservationStatus, IsAssignStatus } = modelsConstants;
import {
  ALREADY_PROCESSED_ERROR,
  BAD_REQUEST_ERROR,
  NOT_FOUND_ERROR,
  FORBIDDEN_ERROR,
  DB_ERROR,
} from '../../configs/responseCode.config.js';

/**
 * 결제 준비
 */
async function readyPayment({ reservationId, userId }) {
  return await db.sequelize.transaction(async (t) => {
    // 예약 정보 조회 (매장 및 기존 배정 기사 포함)
    const reservation = await db.Reservation.findOne({
      where: { id: reservationId, ownerId: userId },
      include: [
        {
          model: db.Store,
          as: 'store',
          attributes: ['name', 'addr1', 'addr2'] // 매장명, 주소는 동까지만 나오게 하기
        },
        {
          model: db.Cleaner,
          as: 'cleaner',
          attributes: ['name'] // 기사님 성함
        }
      ],
      transaction: t,
    });

    if (!reservation) {
      throw myError('결제할 예약 정보를 찾을 수 없습니다.', NOT_FOUND_ERROR);
    }

    if (reservation.status !== ReservationStatus.REQUEST) {
      throw myError('이미 처리되었거나 진행중인 예약입니다.', ALREADY_PROCESSED_ERROR);
    }

    // 견적서 정보 조회(결제 금액 및 배정할 기사 ID 확인)
    const estimate = await db.Estimate.findOne({
      where: { reservationId: reservation.id },
      transaction: t,
    });

    if (!estimate) {
      throw myError('결제에 필요한 견적서 정보를 찾을 수 없습니다.', NOT_FOUND_ERROR);
    }

    let finalCleanerName = null;

    /**
     * 기사 배정 로직
    */
    if (reservation.isAssign?.trim() === IsAssignStatus.NORMAL && !reservation.cleanerId) {
      await reservation.update({
        cleanerId: estimate.cleanerId,
      }, { transaction: t });

      const AssignedCleaner = await db.Cleaner.findByPk(estimate.cleanerId, {
        attributes: ['name'],
        transaction: t
      });
      finalCleanerName = AssignedCleaner?.name;
    } else {
      finalCleanerName = reservation.cleaner?.name;
    }

    const orderId = `reservation_${reservation.id}_${new Date().getTime()}`;

    // 결제 대기 생성
    await paymentRepository.createPendingPayment(
      {
        orderId: orderId,
        amount: estimate.estimatedAmount,
        reservationId: reservation.id,
        estimateId: estimate.id,
      }, t
    );

    return {
      orderId: orderId,
      amount: estimate.estimatedAmount,
      reservationName: `제빙기 청소 예약 #${reservation.id}`,
      storeName: reservation.store?.name,
      storeAddress: `${reservation.store?.addr1} ${reservation.store?.addr2 || ''}`.trim(),
      cleanerName: finalCleanerName,
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

    // 4. 승인 성공 시 DB 상태 업데이트 (결제, 예약, 견적서)
    // 결제 정보 업데이트 
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

/**
 * 결제 취소 
 * @param {*} param
 * @returns 
 */
async function cancelPayment({ paymentKey, cancelReason, userId }) {
  // 결제 내역 존재 여부 및 본인 확인
  const payment = await paymentRepository.findByPaymentKey(paymentKey);
  console.log("조회된 결제 데이터", JSON.stringify(payment, null, 2));

  if (!payment) {
    throw myError("결제 내역을 찾을 수 없습니다.", NOT_FOUND_ERROR);
  }
  if (payment.reservation.ownerId !== userId) {
    throw myError("본인의 결제 건만 취소할 수 있습니다.", FORBIDDEN_ERROR);
  }
  if (payment.status !== PaymentStatus.DONE) {
    throw myError("취소할 수 없는 결제 상태입니다.", BAD_REQUEST_ERROR);
  }

  // 토스 취소 API 호출 
  const authorizations = Buffer.from(`${process.env.TOSS_SECRET_KEY}:`).toString("base64");
  let tossCancelResult;

  try {
    const response = await axios.post(
      `https://api.tosspayments.com/v1/payments/${paymentKey}/cancel`,
      { cancelReason },
      {
        headers: {
          Authorization: `Basic ${authorizations}`,
          "Content-Type": "application/json",
        },
        timeout: 10000,
      }
    );
    tossCancelResult = response.data;
  } catch (error) {
    if (error.response) {
      const { code, message } = error.response.data;
      throw myError(`토스 취소 실패: ${code} - ${message}`, BAD_REQUEST_ERROR);
    }
    throw error;
  }

  // DB 상태 업데이트 
  const t = await db.sequelize.transaction();
  try {
    await paymentRepository.updateStatusAfterCancel(
      {
        paymentKey,
        cancelReason,
        canceledAt: tossCancelResult.cancels[0].canceledAt,
      },
      payment.reservationId,
      t
    );

    await t.commit();
    return tossCancelResult;
  } catch (error) {
    await t.rollback();
    console.error("결제 취소는 성공했으나, DB 반영 실패", error);
    throw myError("결제는 취소되었으나 정보 동기화에 실패했습니다. 문의해주세요.", DB_ERROR);
  }
}

export default {
  readyPayment,
  confirmPayment,
  cancelPayment,
};