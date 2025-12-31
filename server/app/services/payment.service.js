/**
 * @file app/services/payment.service.js
 * @description Payment Service
 * 251231 v1.0.0 jae init
 */

import axios from 'axios';
import db from '../models/index.js';
import myError from '../errors/customs/my.error.js';
import { ALREADY_PROCESSED_ERROR, BAD_REQUEST_ERROR, SYSTEM_ERROR } from '../../configs/responseCode.config.js';

async function confirmPayment({ paymentKey, orderId, amount, userId }) {
  const tossSecretKey = process.env.TOSS_SECRET_KEY; 
  if (!tossSecretKey) {
    throw myError('서버 설정 오류: 서비스키가 없습니다.', SYSTEM_ERROR);
  }

  // 2. [중요] 금액 검증 로직 추가 (보안)
  // 프론트에서 보낸 amount가 우리 DB의 주문 금액과 맞는지 확인해야 합니다.
  /*
  const order = await db.Order.findOne({ where: { orderId, userId } });
  if (!order || order.totalAmount !== amount) {
    throw myError('결제 금액이 일치하지 않습니다.', BAD_REQUEST_ERROR);
  }
  */

  const encodeSecretKey = Buffer.from(`${tossSecretKey}:`).toString('base64');

  try {
    // 4. 토스페이먼츠 결제 승인 API 호출
    const response = await axios.post(
      'https://api.tosspayments.com/v1/payments/confirm',
      { paymentKey, orderId, amount },
      {
        headers: {
          'Authorization': `Basic ${encodeSecretKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const tossPaymentResult = response.data;

    // 5. 승인 성공 후 DB 상태 업데이트 (예시)
    // await db.Order.update({ status: 'PAID', paymentKey }, { where: { orderId } });

    return tossPaymentResult;
  } catch (error) {
    if (error.response) {
      const { code, message } = error.response.data;
      if (code === 'ALREADY_APPROVED') {
        throw myError('이미 승인된 결제입니다.', ALREADY_PROCESSED_ERROR);
      }
      throw myError(message || '결제 승인 중 오류가 발생했습니다.', BAD_REQUEST_ERROR);
    } 
    
    throw myError(error.request ? '토스 서버 응답 없음' : '결제 요청 설정 오류', SYSTEM_ERROR);
  }
}

export default { 
  confirmPayment 
};