import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutThunk } from "../../store/thunks/authThunk.js";
import "./HeaderMenu.css";

export default function HeaderMenu({ isOpen, onClose }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoggedIn, user } = useSelector((state) => state.auth);

  const handleLogout = async () => {
    try{
      await dispatch(logoutThunk()).unwrap();
      alert("로그아웃 되었습니다.");
      onClose();
      navigate('/');
    } catch (error) {
      console.error("로그아웃 실패", error);
    }
  };

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
            onClick={handleLogout}>
            로그아웃
          </button>
        </div>
      </div>
    </div>
  );
}