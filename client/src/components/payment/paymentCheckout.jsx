import { useState, useEffect } from 'react';
import { loadTossPayments } from "@tosspayments/tosspayments-sdk";

// 토스 페이먼츠 클라이언트 키 
const clientKey = "test_ck_D5GePWvyJnrK0W0k6q8gLzN97Eoq";

const PaymentRequest = (/*{ amountValue, orderId, customerName }*/) => {
  // --- 임시 데이터 ---
  const amountValue = 10000;
  const orderId = "주문번호_" + new Date().getTime();
  const customerName = "고객님";
  // --- 임시 데이터 ---
  // tossPayment: 초기화된 결제 인스턴스를 저장
  // loading: SDK 로딩 중 여부를 판단 
  const [tossPayment, setTossPayment] = useState(null);
  const [loading, setLoading] = useState(true);

  // 컴포넌트 마운트 시 SDK 로드 및 객체 생성
  useEffect(() => {
    const initPayment = async () => {
      try {
        setLoading(true); // 로딩 시작

        // 외부 라이브러리(SDK)를 불러오기
        const sdk = await loadTossPayments(clientKey);

        // 결제 요청 전 설정을 담은 'payment' 객체 생성
        const payment = sdk.payment({
          customerKey: orderId, 
        });
        setTossPayment(payment); 
      } catch (error) {
        console.error("토스 SDK 초기화 실패", error);
      } finally {
        setLoading(false); // 로딩 완료 (성공/실패 무관)
      }
    };
    initPayment();
  }, []);

  // 사용자가 '결제하기' 버튼을 눌렀을 때 실행
  const handlePayment = async () => {
    if (!tossPayment || loading) return;

    try {
      // 실제 토스 결제창
      await tossPayment.requestPayment({
        method: "CARD", 
        amount: {
          currency: "KRW",
          value: amountValue
        },
        orderId: orderId,  // DB 고유 주문번호 
        orderName: "제빙기 청소 서비스",
        successUrl: `${window.location.origin}/payment/success`, // 결제 성공 시 이동할 주소
        failUrl: `${window.location.origin}/payment/fail`, // 결제 실패 시 이동할 주소
        customerName: customerName,
      });
    } catch (error) {
      console.error("결제 요청 중 에러 발생", error);
    }
  };

  return (
    <div>
      {loading ? (
        <p> 결제 모듈을 불러오고 있습니다.</p>
      ) : ( 
        // SDK 로드 완료 후 보여줄 실제 결제 버튼
        <button onClick={handlePayment}> {amountValue?.toLocaleString()}원 카드 결제하기 </button>
      )} 
    </div>
  );
};

export default PaymentRequest;