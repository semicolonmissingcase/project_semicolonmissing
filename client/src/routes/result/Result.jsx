import { useNavigate } from "react-router-dom";
import "./Result.css";

export default function Result () {
  const navigate = useNavigate();
  
  function mainPage() {
    navigate('/');
  }

  function loginPage() {
    navigate('/login');
  }

  return (
    <div className="all-container result-container">
      <div className="result-box">
        <div style={{ backgroundImage: `url('/icons/success.png')` }} className="result-img"></div>
        <div className="result-text">
          <h3>회원가입이 완료되었습니다.</h3>
          <p>안녕하세요 점주님!<br />
            다양한 기사님을 만나보세요.</p>
        </div>
      </div>
      <div className="result-btn-containver">
        <button type="button" className="bg-light btn-medium" onClick={mainPage}>
          홈으로 가기
        </button>
        <button type="button" className="bg-blue btn-medium" onClick={loginPage}>
          로그인 가기
        </button>
      </div>
    </div>
  );
};
