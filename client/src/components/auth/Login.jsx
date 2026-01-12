import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import { loginThunk } from "../../store/thunks/authThunk";
import { IoEye, IoEyeOff } from "react-icons/io5"; // 눈아이콘

export default function Login () {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // 1. 비밀번호 표시 여부 상태 추가
  const [showPassword, setShowPassword] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    try {
      await dispatch(loginThunk({email, password})).unwrap();
      return navigate('/', { replace: true });
    } catch(error) {
      console.error("Login Error", error);
      const errorMessage = error.message || "로그인에 실패했습니다.";
      const errorCode = error.code ? `(${error.code})` : "";
      alert(`${errorMessage} ${errorCode}`);
    }
  }

  // 2. 토글 함수
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };


  function handleSocial(provider) {
    window.location.replace(`/api/auth/social/${provider}`);
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
            {/* 3. Input을 감싸는 wrapper 추가 */}
            <div className="password-wrapper" style={{ position: 'relative', width: '100%' }}>
              <input 
                type={showPassword ? "text" : "password"} // 4. 상태에 따라 타입 변경
                className="input-medium" 
                style={{ width: '100%' }} // 전체 너비 확보
                onChange={e => {setPassword(e.target.value)}}
              />
              <button 
                type="button" 
                onClick={togglePasswordVisibility}
                className="password-toggle-btn"
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '4px'
                }}
              >
                {showPassword ? <IoEyeOff size={20} color="#666" /> : <IoEye size={20} color="#666" />}
              </button>
            </div>

            {/* <label className="login-label-text">비밀번호</label>
            <input type="password" className="input-medium"  onChange={e => {setPassword(e.target.value)}}/> */}
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
              <button type="button" className="bg-img-kakao login-bnt-size" onClick={() => {handleSocial('kakao')}}></button>
            </div>
          </form> 

      </div>
    </div>    
  );
};