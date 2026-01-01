import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutThunk } from "../../store/thunks/authThunk.js";
import "./HeaderMenu.css";

export default function HeaderMenu({ isOpen, onClose }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoggedIn, user } = useSelector((state) => state.auth);

  const handleLogout = async () => {
    try {
      await dispatch(logoutThunk()).unwrap();
      alert("로그아웃 되었습니다.");
      onClose();
      navigate("/");
    } catch (error) {
      console.error("로그아웃 실패", error);
    }
  };

  if (!isOpen) return null;

  // 공통 네비게이션 함수들
  const goTo = (path) => {
    navigate(path);
    onClose();
  };

  return (
    <div className="header-menu-mobile-menu-overlay">
      <div className="header-menu-mobile-menu-content">
        <button className="header-menu-mobile-menu-close" onClick={onClose}>
          &times;
        </button>

        {/* 1. 로그인 상태일 때만 프로필 영역 표시 */}
        {isLoggedIn && (
          <div className="mobile-menu-profile">
            <div
              className="mobile-menu-profile-img"
              style={{ backgroundImage: `url(${user?.profileImg || '/icons/default-profile.png'})` }}
            ></div>
            <p className="mobile-menu-profile-name">{user?.name}님</p>
          </div>
        )}

        <div className="menu-items-container">
          {/* 2. 공통 메뉴: 로그인한 경우에만 문의사항 표시 */}
          <p className="header-menu-mobile-menu-item under-line" onClick={() => goTo('/qnaposts')}>
            문의사항
          </p>
          <hr className="header-menu-mobile-menu-divider" />

          {/* 3. 역할(Role)에 따른 조건부 메뉴 */}
          {!isLoggedIn ? (
            // --- 비회원 메뉴 ---
            <>
              <p className="header-menu-mobile-menu-item" onClick={() => goTo('/login')}>로그인</p>
              <p className="header-menu-mobile-menu-item" onClick={() => goTo('/registration')}>회원가입</p>
            </>
          ) : user?.role === 'OWNER' ? (
            // --- 점주(Owner) 메뉴 ---
            <>
              <p className="header-menu-mobile-menu-item" onClick={() => goTo('/chatlist')}>채팅</p>
              <p className="header-menu-mobile-menu-item" onClick={() => goTo('/request-quote')}>견적요청</p>
            </>
          ) : user?.role === 'CLEANER' ? (
            // --- 기사님(Cleaner) 메뉴 ---
            <>
              <p className="header-menu-mobile-menu-item" onClick={() => goTo('/chatlist')}>채팅</p>
              <p className="header-menu-mobile-menu-item" onClick={() => goTo('/new-requests')}>신규요청</p>
            </>
          ) : null}
        </div>

        {/* 4. 하단 로그아웃 버튼 (로그인 시에만 노출) */}
        {isLoggedIn && (
          <div className="header-menu-mobile-menu-bottom-logout">
            <hr className="header-menu-mobile-menu-divider" />
            <button className="header-menu-mobile-menu-logout-btn" onClick={handleLogout}>
              로그아웃
            </button>
          </div>
        )}
      </div>
    </div>
  );
}