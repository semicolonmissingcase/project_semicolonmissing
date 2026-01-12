/**
 * @file src/components/payment/paymentModal.jsx 
 * @description 예약하기 버튼 눌렀을 때 나오는 modal 창
 * 260108 v1.0.0 jae init
 */

import axios from 'axios';
import { useState, useEffect } from 'react';
import { loadTossPayments } from "@tosspayments/tosspayments-sdk";
import './paymentModal.css';

// 토스 페이먼츠 클라이언트 키 
const clientKey = "test_ck_AQ92ymxN34MLjPNaZKePVajRKXvd";

const PaymentModal = ({ reservationId, userId, onClose }) => {
  const [tossPayment, setTossPayment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [paymentInfo, setPaymentInfo] = useState(null);

  useEffect(() => {
    async function init() {
      try {
        const sdk = await loadTossPayments(clientKey);
        const payment = sdk.payment({ customerKey: `USER_${userId || 'GUEST'}`});
        setTossPayment(payment);

        const { data } = await axios.post('/api/payments/ready', { reservationId });
        setPaymentInfo(data.data);
      } catch (error) {
        console.error("초기화 실패", error);
      }
    }
    init();
  }, []);

  const handlePayment = async () => {
    if(!tossPayment || !paymentInfo || loading) return;
  
    try {
      setLoading(true);

      // 토스 통합 결제창 호출
      await tossPayment.requestPayment({
        method: "CARD", // 토스창 내에서 '다른 결제수단' 선택 가능
        amount: { 
          currency: "KRW", 
          value: Number(paymentInfo.amount) 
        },
        orderId: paymentInfo.orderId,
        orderName: paymentInfo.reservationName,
        successUrl: `${window.location.origin}/payment/success`,
        failUrl: `${window.location.origin}/payment/fail`,
      });
    } catch (error) {
      alert(error.response?.data?.msg || "결제 준비 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

    if(!paymentInfo) return null;

    return (
      <div className="payment-modal-overlay">
        <div className="payment-modal-container">
          <h3 className="payment-modal-title">예약 내역 확인</h3>

          <div className="payment-modal-request-info-section">
            <div className='payment-modal-info-row'>
              <span className='payment-modal-info-label'>매장명</span>
              <span className='payment-modal-info-value'>{paymentInfo.storeName}</span>
            </div>
            <div className='payment-modal-info-row'>
              <span className='payment-modal-info-label'>매장 주소</span>
              <span className='payment-modal-info-value'>{paymentInfo.storeAddress}</span>
            </div>
            <hr/>
            <div className='payment-modal-info-row'>
              <span className='payment-modal-info-label'>담당 기사</span>
              <span className='payment-modal-info-value'>{paymentInfo.cleanerName} 기사님</span>
            </div>
            <div className='payment-modal-info-row'>
              <span className='payment-modal-info-label'>최종 결제 금액</span>
              <span className='payment-modal-info-value-price'>{Number(paymentInfo.amount).toLocaleString()}원</span>
            </div>
          </div>

          <p className='payment-modal-help-text'>위 내용을 확인하셨나요? <br/> '예약하기' 클릭 시 토스 결제창으로 연결됩니다.</p>

          <div className='payment-modal-button-group'>
            <button className='payment-modal-cancel-action' onClick={onClose} disabled={loading}>
              돌아가기
            </button>
            <button className='payment-request-action' onClick={handlePayment} disabled={loading || !tossPayment}>
              {loading ? "연결 중..." : "결제하기"}
            </button>
          </div>
      </div>
    </div>
  );
};

export default PaymentModal;