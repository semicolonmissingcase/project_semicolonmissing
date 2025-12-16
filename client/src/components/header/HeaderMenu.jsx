import "./HeaderMenu.css";

export default function HeaderMenu({ isOpen, onClose, onMenuItemClick }) {
  if (!isOpen) return null;

  return (
    <div className='mobile-menu-overlay'>
      {/* 메뉴 내용 */}
      <div className='mobile-menu-content'>
        {/* 닫기 버튼 */}
        <button className='mobile-menu-close' onClick={onClose}>
          &times;
        </button>
        
        {/* 메뉴 항목 */}
        <p className='mobile-menu-item under-line'>문의사항</p>
        <hr className='mobile-menu-divider'/>
        <p className='mobile-menu-item' onClick={() => onMenuItemClick('/login')}>
          로그인
        </p>
        <p className='mobile-menu-item' onClick={() => onMenuItemClick('/signup')}>
          회원가입
        </p>
        
        {/* 로그아웃 버튼 */}
        <div className="mobile-menu-bottom-logout">
          <button 
            className='mobile-menu-logout-btn' 
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
      <div className='mobile-menu-backdrop' onClick={onClose}></div>
    </div>
  );
}