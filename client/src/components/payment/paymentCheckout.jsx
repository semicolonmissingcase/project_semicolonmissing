import axios from 'axios';
import { useState, useEffect } from 'react';
import { loadTossPayments } from "@tosspayments/tosspayments-sdk";


// 토스 페이먼츠 클라이언트 키 
const PaymentModal = ({ reservationId, onClose }) => {
  const [tossPayment, setTossPayment] = useState(null);
  const [loading, setLoading] = useState(false);

  // SDK 초기화
  useEffect(() => {
    const init = async () => {
      try {
        const sdk = await loadTossPayments(clientKey);
        const payment = sdk.payment({ customerKey: "USER_UNIQUE_ID" });
        setTossPayment(payment);
      } catch (err) {
        console.error("SDK 로드 실패", err);
      }
    };
    init();
  }, []);

  const handlePayment = async () => {
    if (!tossPayment || loading) return;

    try {
      setLoading(true);
      // 백엔드 ready API 호출
      const { data } = await axios.post('/api/payments/ready', { reservationId });
      const { orderId, amount, reservationName } = data.data;

      // 토스 결제창 호출
      await tossPayment.requestPayment({
        method: "CARD",
        amount: { currency: "KRW", value: Number(amount) },
        orderId,
        orderName: reservationName,
        successUrl: `${window.location.origin}/payment/success`,
        failUrl: `${window.location.origin}/payment/fail`,
      });
    } catch (error) {
      alert(error.response?.data?.msg || "결제 준비 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="PaymentOverlay">
      <div className="PaymentContainer">
        
        <div className="PaymentContent">
          <h3 className="PaymentTitle">해당 기사님의 견적서로 예약 하시겠습니까?</h3>
          <p className="PaymentDescription">
            [예약하기]를 선택하시면 결제 페이지로 이동합니다.
          </p>
        </div>
        
        <div className="PaymentButtonGroup">
          <button 
            className="PaymentCancelAction" 
            onClick={onClose}
          >
            취소하기
          </button>
          
          <button 
            className="PaymentRequestAction" 
            onClick={handlePayment} 
            disabled={loading || !tossPayment}
          >
            {loading ? "연결 중..." : "예약하기"}
          </button>
        </div>

      </div>
    </div>
  );
};

export default PaymentModal;