import "./Header.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import HeaderMenu from "./HeaderMenu";

export default function Header() {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // 버튼 네비게이터
  function mainPage() {
    navigate('/');
  }

  function qnaPage() {
    navigate('/qnaposts');
  }

  function loginPage() {
    navigate('/login');
  }

  function registrationPage() {
    navigate('/registration');
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(prev => !prev);
  };

  const handleMenuItemClick = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* PC/모바일 공통 헤더 영역 */}
      <div className='all-container header-container'>
        <div className='header-left-container'>
          <div className='header-logo-container' onClick={mainPage}>
            <div className='ice-doctor-character header-character-size'></div>
            <h1>ICE DOCTOR</h1>
          </div>
          {/* PC용 '문의사항' */}
          <p className='header-nav-qna pc-only' onClick={qnaPage}>문의사항</p>
        </div>
        
        {/* PC 환경에서만 보이는 로그인/회원가입 버튼 */}
        <div className='header-right-container pc-only'>
          <button type='button' className='header-right-btn' onClick={loginPage}>로그인</button>
          <button type='button' className='header-right-btn' onClick={registrationPage}>회원가입</button>
        </div>
        
        {/* 모바일 햄버거 버튼 */}
        <div 
          className={`hamburger-menu-icon ${isMobileMenuOpen ? 'hidden' : ''}`} 
          onClick={toggleMobileMenu}
        >
          <p className='header-hamburger'>&#x2630;</p>
        </div>
      </div>
      
      {/* 모바일 메뉴 컴포넌트 */}
      <HeaderMenu 
        isOpen={isMobileMenuOpen}
        onClose={toggleMobileMenu}
        onMenuItemClick={handleMenuItemClick}
      />
    </>
  );
}