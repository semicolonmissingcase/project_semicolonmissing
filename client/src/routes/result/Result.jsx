import { useNavigate } from "react-router-dom";
import "./Result.css";

export default function Result () {
  const navigate = useNavigate();
  
  function mainPage() {
    navigate('/');
  }

  return (
    <div className="all-container result-container">
      <div className="result-result-box">
        <div style={{ backgroundImage: `url('/icons/success.png')` }} className="result-img"></div>
        <h3>문의글 작성이 완료되었습니다.</h3>
        <p>기사님들이 내용을 검토한 후<br />
          견적서를 보내드립니다.</p>
      </div>
      <div className="result-btn-containver">
        <button type="button" className="bg-light btn-medium" onClick={mainPage}>
          홈으로 가기
        </button>
        <button type="button" className="bg-blue btn-medium">
          문의글 확인
        </button>
      </div>
    </div>
  );
};
