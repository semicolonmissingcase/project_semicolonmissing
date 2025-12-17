import "./HeaderMenu.css";

export default function HeaderMenu({ isOpen, onClose, onMenuItemClick }) {
  if (!isOpen) return null;

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
          <p className='mobile-menu-profile-name'>OOO점주님</p>
        </div>

        {/* 메뉴 항목 */}
        <p className='header-menu-mobile-menu-item under-line'>문의사항</p>
        <hr className='header-menu-mobile-menu-divider'/>
        <p className='header-menu-mobile-menu-item' onClick={() => onMenuItemClick('/login')}>
          로그인
        </p>
        <p className='header-menu-mobile-menu-item' onClick={() => onMenuItemClick('/signup')}>
          회원가입
        </p>
        
        {/* 로그아웃 버튼 */}
        <div className="header-menu-mobile-menu-bottom-logout">
          <button 
            className='header-menu-mobile-menu-logout-btn' 
            onClick={() => {
              // 로그아웃 로직
              onMenuItemClick('/');
            }}
          >
            로그아웃
          </button>
        </div>
      </div>
      
      {/* 배경 클릭 시 닫기 */}
      <div className='header-menu-mobile-menu-backdrop' onClick={onClose}></div>
    </div>
  );
}