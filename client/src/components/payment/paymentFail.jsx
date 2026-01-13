/**
 * @file src/components/payment/paymentFail.jsx 
 * @description 토스 페이먼츠 결제 실패 후 나오는 페이지
 * 260108 v1.0.0 jae init
 */

import { useSearchParams, useNavigate } from 'react-router-dom';
import './paymentFail.css';

const PaymentFail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // 토스가 보낸 에러 코드와 메시지 추출
  const errorCode = searchParams.get('code');
  const errorMessage = searchParams.get('message') || "알 수 없는 에러가 발생했습니다.";

  return (
    <div className="payment-fail-overlay">
      <div className="payment-fail-container">
        <div className="payment-fail-icon-box">
          <span className="payment-fail-mark">!</span>
        </div>
        
        <h2 className="payment-status-title">결제에 실패하였습니다</h2>
        
        <div className="payment-fail-info-section">
          <p className="payment-fail-reason-label">실패 사유</p>
          <p className="payment-fail-reason-text">{errorMessage}</p>
          {errorCode && <p className="payment-fail-code">에러 코드: {errorCode}</p>}
        </div>

        <p className="payment-fail-status-desc">
          잠시 후 다시 시도하시거나, <br/>
          문제가 지속되면 고객센터로 문의해주세요.
        </p>
        
        <div className="payment-fail-button-group">
          <button 
            className="payment-fail-button-primary" 
            onClick={() => navigate(-1)} // 이전 화면(결제 모달이 있던 곳)으로 이동
          >
            다시 시도하기
          </button>
          <button 
            className="payment-fail-button-secondary" 
            onClick={() => navigate("/")}
          >
            홈으로 가기
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentFail;