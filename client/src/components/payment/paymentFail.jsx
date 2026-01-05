import { useSearchParams } from 'react-router-dom';

const PaymentFail = () => {
  const [searchParams] = useSearchParams();
  const message = searchParams.get('message');
  const code = searchParams.get('code');

  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <h1>❌ 결제 실패</h1>
      <p>이유: {message}</p>
      <p>에러코드: {code}</p>
      <button onClick={() => window.location.href = '/'}>다시 시도하기</button>
    </div>
  );
};

export default PaymentFail;