import "./Header.css";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import HeaderMenu from "./HeaderMenu";
import { useDispatch, useSelector } from "react-redux";
import HeaderDropdown from "./HeaderDropdown.jsx";
import { getMeThunk } from "../../store/thunks/authThunk.js";
// import { clearAuth } from "../../store/slices/authSlice";

export default function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // 드롭다운용
  const [isDropDown, setIsDropDown] = useState(false);
  const dropdownRef = useRef(null);

  // Redux Store에서 로그인 상태 가져오기 
  const { isLoggedIn, user } = useSelector((state) => state.auth);
 
  useEffect(() => {
    const initAuth = async () => {
      try {
        await dispatch(getMeThunk()).unwrap();
      } catch (error) {
        console.log("비로그인 상태입니다.");
      }
    }
   
    initAuth();
  }, []);
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); 

  // 채팅 사이드바 열림 상태 관리
  const [isChatSidebarOpen, setIsChatSidebarOpen] = useState(false);
  useEffect(() => {
    const handleStatus = (e) => {
      setIsChatSidebarOpen(e.detail.isOpen);
    };
    window.addEventListener("chatSidebarStatus", handleStatus);
    return () => window.removeEventListener("chatSidebarStatus", handleStatus);
  }, [dropdownRef]);

  // 드롭다운 외부 클릭 시 닫기
  useEffect(() => {
    function handleClickOutside(e) {
      if(dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropDown(false);
      }
    }
    // 이벤트 리스너 등록
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // 컨포넌트 unmount 시 이벤트 리스터 해제
      document.removeEventListener("mousedown", handleClickOutside)
    }
  })
  
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
  function ownerQuteList() {
    navigate('owners/reservation'); 
  }

  // 기사님(cleaners)
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
              {user?.role ==='OWNER' && (
                <>
                  <button type='button' className='btn-small header-right-btn' onClick={chatListPage}>
                    채팅
                  </button>
                  <button type='button' className='btn-small header-right-btn' onClick={ownerQuteList}>
                    견적요청
                  </button>
                  <div className="header-profile-container" ref={dropdownRef}>
                    <div className='header-profile-icon'
                      onClick={() => setIsDropDown((prev) => !prev)}>
                      {/* 프로필 이미지가 있으면 이미지 표시, 없으면 기본 아이콘 */}
                      {user?.profile ? (
                        <img 
                          src={user.profile} 
                          alt="프로필" 
                          className='header-profile-img'
                        />
                      ) : (
                        <div className='header-profile-default'>
                        </div>
                      )}
                    </div>

                    {/* 드롭다운 컴포넌트 */}
                    <HeaderDropdown 
                      isOpen={isDropDown}
                      onClose={() => setIsDropDown(false)}
                      user={user} />
                  </div>
                </>
              )}
              

              {/* 기사님(cleaner): 채팅, 신규요청, 프로필사진 */}
              {user?.role === 'CLEANER' && (
                <>
                  <button type='button' className='btn-small header-right-btn' onClick={chatListPage}>
                    채팅
                  </button>
                  <button type='button' className='btn-small header-right-btn' onClick={cleanerQuotelist}>
                    신규요청
                  </button>
                  <div className="header-profile-container" ref={dropdownRef}>
                    <div className='header-profile-icon'
                      onClick={() => setIsDropDown((prev) => !prev)}>
                      {/* 프로필 이미지가 있으면 이미지 표시, 없으면 기본 아이콘 */}
                      {user?.profile ? (
                        <img 
                          src={user.profile} 
                          alt="프로필" 
                          className='header-profile-img'
                        />
                      ) : (
                        <div className='header-profile-default'>
                        </div>
                      )}
                    </div>
                    
                    {/* 드롭다운 컴포넌트 */}
                    <HeaderDropdown 
                      isOpen={isDropDown}
                      onClose={() => setIsDropDown(false)}
                      user={user} />
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