import "./Header.css";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import HeaderMenu from "./HeaderMenu";
import { useSelector, useDispatch } from "react-redux";
import { clearAuth } from "../../store/slices/authSlice";

export default function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch(); 

  // Redux Store에서 로그인 상태 가져오기 
  const { isLoggedIn, user } = useSelector((state) => state.auth);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); 

  // 채팅 사이드바 열림 상태 관리
  const [isChatSidebarOpen, setIsChatSidebarOpen] = useState(false);
  useEffect(() => {
    const handleStatus = (e) => {
      setIsChatSidebarOpen(e.detail.isOpen);
    };
    window.addEventListener("chatSidebarStatus", handleStatus);
    return () => window.removeEventListener("chatSidebarStatus", handleStatus);
  })
  
  // 로그 아웃 처리 함수 
  function handleLogout() {
    localStorage.removeItem('accessToken'); // 스토리지 삭제
    localStorage.removeItem('user');
    dispatch(clearAuth()); // 리덕스 상태 초기화
    navigate('/');
  }

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
            <div className="ice-doctor-logo-character header-logo"></div>
          </div>
          {/* PC용 '문의사항' */}
          <p className='header-nav-qna pc-only' onClick={qnaPage}>문의사항</p>
        </div>
        
        {/* PC 환경에서만 보이는 로그인/회원가입 버튼 */}
        <div className='header-right-container pc-only'>
          {isLoggedIn ? (
            <>
              <span className="header-user-name-tag">{user?.name}님</span>
              <button type='button' className='btn-small header-right-btn' onClick={handleLogout}>로그아웃</button>
            </>
          ) : (
           <>
               <button type='button' className='btn-small header-right-btn' onClick={loginPage}>로그인</button>
               <button type='button' className='btn-small header-right-btn' onClick={registrationPage}>회원가입</button>
           </>
          )}
        </div>
        
        {/* 모바일 햄버거 버튼 */}
        <div 
          className={`hamburger-menu-icon ${isMobileMenuOpen || isChatSidebarOpen ? 'hidden' : ''}`} 
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