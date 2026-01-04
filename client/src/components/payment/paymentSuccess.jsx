import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from "axios";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("processing"); 

  // 토스가 URL 파라미터로 보내준 결제 결과값들입니다.
  const paymentKey = searchParams.get('paymentKey');
  const orderId = searchParams.get('orderId');
  const amount = searchParams.get('amount');

  useEffect(() => {
    const confirm = async () => {
      try {
        const res = await axios.post("/api/payments/confirm", {
          paymentKey, orderId, amount, 
        }); 
        if(res.data.code === "00") setStatus("success");
      } catch (err) {
        console.error(err);
        setStatus("error");
      }
    };
    if (paymentKey && orderId && amount) confirm();
  }, []);

  return (
    <div className="PaymentSuccessContainer" style={{ textAlign: 'center', padding: '50px 20px' }}>
      {status === "processing" && <h2>결제 승인 처리 중입니다...</h2>}

      {status === "success" && (
        <div className="PaymentSuccessBox">
          <div style={{ fontSize: '50px', marginBottom: '20px' }}>✅</div>
          <h2 className="PaymentSuccessTitle">결제가 완료되었습니다!</h2>
          <p className="PaymentSuccessDesc">기사님과의 예약이 정상적으로 확정되었습니다.</p>
          
          <div className="PaymentSuccessButtonGroup" style={{ marginTop: '30px', display: 'flex', gap: '10px', justifyContent: 'center' }}>
            <button 
              className="PaymentMoveAction"
              onClick={() => navigate("/owners/mypage")}
              style={{ padding: '12px 24px', backgroundColor: '#d3d3d3', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
            >
              마이페이지로 이동
            </button>
            <button 
              className="PaymentMoveAction"
              onClick={() => navigate("/")}
              style={{ padding: '12px 24px', backgroundColor: '#3182f6', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
            >
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