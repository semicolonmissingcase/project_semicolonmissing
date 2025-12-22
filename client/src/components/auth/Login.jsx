import { useNavigate } from "react-router-dom";
import "./Login.css";

export default function Login () {
  const navigate = useNavigate();

  function registrationPage() {
    navigate('/registration');
  }
  
  return (
    <div className="all-container login-page-container">
      <div className="login-title">
        <div className="ice-doctor-logo1 login-logo"></div>
      </div>
      <div className="login-container">
        <div className="login-tap">
          <button type="button" className="btn-medium bg-white">점주님 로그인</button>
          <button type="button" className="btn-medium bg-white">기사님 로그인</button>
        </div>
          <div className="login-form-container">
            <label className="login-label-text">이메일</label>
            <input type="text" className="input-medium"/>
            <label className="login-label-text">비밀번호</label>
            <input type="text" className="input-medium"/>
            <button type="button" className="login-submit-btn btn-big bg-blue login-bnt-size">로그인</button>
          
            {/* 찾기/회원가입부분 */}
            <div className="login-redirect">
            <button type="button" className="btn-small">아이디 찾기</button>
            <span className="login-divider">|</span>
            <button type="button" className="btn-small">비밀번호 찾기</button>
            <span className="login-divider">|</span>
            <button type="button" className="btn-small" onClick={registrationPage}>회원가입</button>
            </div>   

            {/* 소셜로그인 */}
            <div className="login-social">
              <hr />
              <button type="button" className="bg-img-kakao login-bnt-size"></button>
            </div>
          </div> 

      </div>
    </div>    
  );
};