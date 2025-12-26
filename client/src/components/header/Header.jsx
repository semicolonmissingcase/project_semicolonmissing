import "./Header.css";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import HeaderMenu from "./HeaderMenu";
import { useSelector } from "react-redux";
// import { clearAuth } from "../../store/slices/authSlice";

export default function Header() {
  const navigate = useNavigate();
  // const dispatch = useDispatch();

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
  
  // 로그 아웃 처리 함수 (저희는 이거 메뉴바 만듭니다.)
  //function handleLogout() {
  //  localStorage.removeItem('accessToken'); // 스토리지 삭제
  //  localStorage.removeItem('user');
  //  dispatch(clearAuth()); // 리덕스 상태 초기화
  //  navigate('/');
  //}

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

  function chatListPage() {
    navigate('/chatlist');
  }

  // 점주(owner)
  function ownerMypage() {
    navigate('owners/mypage');
  }

  function ownerQuteList() {
    navigate('cleaners/userquotelistdetails'); // TODO: 라우트 다시 확인하기
  }

  // 기사님(cleaners)
  function cleanerMypage() {
    navigate('cleaners/mypage');
  }

  function cleanerQuotelist() {
    navigate('cleaners/userquotelist');
  }

  // 모바일 네비게이션 관련
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
              {/* 점주(owner): 견적요청, 채팅, 프로필사진 */}
              
                <>
                  <button type='button' className='btn-small header-right-btn' onClick={chatListPage}>
                    채팅
                  </button>
                  <button type='button' className='btn-small header-right-btn' onClick={ownerQuteList}>
                    견적요청
                  </button>
                  <div className='header-profile-icon' onClick={ownerMypage}>
                    {/* 프로필 이미지가 있으면 이미지 표시, 없으면 기본 아이콘 */}
                    {/* {user?.profileImage ? (
                      <img 
                        src={user.profileImage} 
                        alt="프로필" 
                        className='header-profile-img'
                      />
                    ) : (
                      <div className='header-profile-default'>
                        {user?.name?.[0] || 'U'}
                      </div>
                    )} */}
                  </div>
                </>
              

              {/* 기사님(cleaner): 채팅, 신규요청, 프로필사진 */}
              {user?.userType === 'cleaner' && (
                <>
                  <button type='button' className='btn-small header-right-btn' onClick={chatListPage}>
                    채팅
                  </button>
                  <button type='button' className='btn-small header-right-btn' onClick={cleanerQuotelist}>
                    신규요청
                  </button>
                  <div className='header-profile-icon' onClick={cleanerMypage}>
                    {/* 프로필 이미지가 있으면 이미지 표시, 없으면 기본 아이콘 */}
                    {user?.profileImage ? (
                      <img 
                        src={user.profileImage} 
                        alt="프로필" 
                        className='header-profile-img'
                      />
                    ) : (
                      <div className='header-profile-default'>
                        {user?.name?.[0] || 'U'}
                      </div>
                    )}
                  </div>
                </>
              )}
            </>
          ) : (
            <>
              {/* 비회원 / 로그아웃 */}
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