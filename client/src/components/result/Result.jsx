import { useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import "./Result.css";

export default function Result() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // location.state에서 데이터 가져오기
  const {
    title = '작업이 완료되었습니다.',
    message = '성공적으로 처리되었습니다.',
    imgSrc = '/icons/success.png',
    button1Text = '홈으로 가기',
    button1Path = '/',
    button2Text = '로그인으로 가기',
    button2Path = '/login',
    showButton2 = true,
  } = location.state || {};

  // location.state가 없을 경우 리다이렉트 (잘못된 접근 방지)
  useEffect(() => {
    if (!location.state) {
      navigate('/', { replace: true });
    }
  }, [location.state, navigate]);

  return (
    <div className="all-container result-container">
      <div className="result-box">
        <div style={{ backgroundImage: `url(${imgSrc})` }} className="result-img"></div>
        <div className="result-text">
          <h3>{title}</h3>
          <p dangerouslySetInnerHTML={{ __html: message }}></p>
        </div>
      </div>
      <div className="result-btn-containver">
        <button type="button" className="bg-light btn-medium" onClick={() => navigate(button1Path)}>
          {button1Text}
        </button>
        {showButton2 && (
          <button type="button" className="bg-blue btn-medium" onClick={() => navigate(button2Path)}>
            {button2Text}
          </button>
        )}
      </div>
    </div>
  );
}