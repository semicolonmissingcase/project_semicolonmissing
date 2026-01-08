/**
 * @file src/components/payment/paymentSuccess.jsx 
 * @description 토스 페이먼츠 결제 성공 후 나오는 페이지
 * 260108 v1.0.0 jae init
 */

import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from "axios";
import './paymentSuccess.css';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("processing"); 


  // 토스가 URL 파라미터로 보내준 결제 결과값들입니다.
  const paymentKey = searchParams.get('paymentKey');
  const orderId = searchParams.get('orderId');
  const amount = searchParams.get('amount');

  useEffect(() => {
    const confirmPayment = async () => {
      try {
        // 최종 승인 API 호출
        const res = await axios.post("/api/payments/confirm", {
          paymentKey, orderId, amount, 
        }); 

        // 성공 처리
        if(res.data.code === "200") { setStatus("success");
        } else {
        // 승인 거절 시 실패 페이지로 이동
        const msg = res.data.msg || "승인에 실패했습니다.";
        navigate(`/payment/fail?message=${encodeURIComponent(msg)}`, { replace: true});
        }
      } catch (error) {
        // 네트워크 에러 등 예외 발생 시 실패 페이지로 이동
        console.error("최종 승인 오류", error);
        navigate(`/payment/fail?message=최종 승인 처리 중 오류가 발생했습니다.`, { replace: true });
      }
    };

    if (paymentKey && orderId && amount) { 
      confirmPayment();
    } else {
      // 필수 값이 없으면 비정상적인 접근으로 판단
      navigate("/");
    } 
  }, []);

  return (
    <div className="payment-success-container">
      {status === "processing" && <h2>결제 승인 처리 중입니다...</h2>}

      {status === "success" && (
        <div className="payment-success-box">
          <div></div>
          <h2 className="payment-success-title">결제가 완료되었습니다!</h2>
          <p className="payment-success-desc">기사님과의 예약이 정상적으로 확정되었습니다.</p>
          
          <div className="payment-success-button-group">
            <button className="payment-move-action" onClick={() => navigate("/owners/mypage")}>
              마이페이지로 이동
            </button>
            <button className="payment-move-action" onClick={() => navigate("/")}>
              홈으로 가기
            </button>
          </div>
        </div>
      )}

      {status === "error" && (
        <div>
          <h2>결제 승인에 실패했습니다.</h2>
          <button onClick={() => navigate(-1)}>다시 시도</button>
        </div>
      )}
    </div>
  );
};

export default PaymentSuccess;