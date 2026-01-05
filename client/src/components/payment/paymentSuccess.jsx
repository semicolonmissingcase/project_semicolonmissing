import { useSearchParams } from 'react-router-dom';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();

  // 토스가 URL 파라미터로 보내준 결제 결과값들입니다.
  const paymentKey = searchParams.get('paymentKey');
  const orderId = searchParams.get('orderId');
  const amount = searchParams.get('amount');

  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <h1>✅ 결제 성공!</h1>
      <p>주문번호: {orderId}</p>
      <p>결제금액: {Number(amount).toLocaleString()}원</p>
      <p style={{ fontSize: '12px', color: '#999' }}>결제키: {paymentKey}</p>
      <button onClick={() => window.location.href = '/'}>홈으로 돌아가기</button>
    </div>
  );
};

export default PaymentSuccess;