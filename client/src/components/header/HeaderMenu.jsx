import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { setCredentials } from "../../store/slices/authSlice.js";
import "./HeaderMenu.css";

export default function HeaderMenu({ isOpen, onClose }) {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

 useEffect(() => {
  const params = new URLSearchParams(location.search);
  const token = params.get('token');
  const userJson = params.get('user');

  if (token && userJson) {
    try {
      const parseUser = JSON.parse(decodeURIComponent(userJson));

      dispatch(setCredentials({
        accessToken: token,
        user: parseUser
      }));

      localStorage.setItem('user', JSON.stringify(parseUser));
      localStorage.setItem('accessToken', token);

      navigate(location.pathname, { replace: true});
    } catch (error) {
      console.error("소셜 로그인 데이터 처리 중 오류 발생", error)
    }
  }
 }, []);

  if (!isOpen) return null;

  // 버튼 네비게이터
  function mainPage() {
    navigate('/');
    onClose();
  }

  function qnaPage() {
    navigate('/qnaposts');
    onClose();
  }

  function loginPage() {
    navigate('/login');
    onClose();
  }

  function registrationPage() {
    navigate('/registration');
    onClose();
  }

  return (
    <div className='header-menu-mobile-menu-overlay'>
      {/* 메뉴 내용 */}
      <div className='header-menu-mobile-menu-content'>
        {/* 닫기 버튼 */}
        <button className='header-menu-mobile-menu-close' onClick={onClose}>
          &times;
        </button>
        
        {/* 프로필 부분 */}
        <div className='mobile-menu-profile'>
          <div className='mobile-menu-profile-img' style={{ backgroundImage: `url('/icons/default-profile.png')` }}></div>
          <p className='mobile-menu-profile-name'></p>
        </div>

        {/* 메뉴 항목 */}
        <p className='header-menu-mobile-menu-item under-line' onClick={qnaPage}>문의사항</p>
        <hr className='header-menu-mobile-menu-divider'/>
        <p className='header-menu-mobile-menu-item' onClick={loginPage}>
          로그인
        </p>
        <p className='header-menu-mobile-menu-item' onClick={registrationPage}>
          회원가입
        </p>
        
        {/* 로그아웃 버튼 */}
        <div className="header-menu-mobile-menu-bottom-logout">
          <button 
            className='header-menu-mobile-menu-logout-btn' 
            onClick={mainPage}>
            로그아웃
          </button>
        </div>
      </div>
    </div>
  );
}