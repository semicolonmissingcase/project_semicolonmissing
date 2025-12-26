import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import { loginThunk } from "../../store/thunks/authThunk";

export default function Login () {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function handleLogin(e) {
    // 기존 이벤트 취소
    e.preventDefault();

    try {
      // 로그인 요청
      await dispatch(loginThunk({email, password})).unwrap();
      return navigate('/', { replace: true });
    } catch(error) {
      const code = error.response?.data?.code;
      alert(`로그인 실패했습니다. ${code}`);
    }
  }

  function registrationPage() {
    navigate('/registration');
  }
  
  return (
    <div className="all-container login-page-container">
      <div className="login-title">
        <div className="ice-doctor-logo1 login-logo"></div>
      </div>
      <div className="login-container">
        {/* <div className="login-tap">
          <button type="submit" className="btn-medium bg-white">점주님 로그인</button>
          <button type="submit" className="btn-medium bg-white">기사님 로그인</button>
        </div> */}
          <form className="login-form-container" onSubmit={handleLogin}>
            <label className="login-label-text">이메일</label>
            <input type="text" className="input-medium" onChange={e => {setEmail(e.target.value)}}/>
            <label className="login-label-text">비밀번호</label>
            <input type="password" className="input-medium"  onChange={e => {setPassword(e.target.value)}}/>
            <button type="submit" className="login-submit-btn btn-big bg-blue login-bnt-size">로그인</button>
          
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
          </form> 

      </div>
    </div>    
  );
};