import "./HeaderDropdown.css";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { clearAuth } from "../../store/slices/authSlice";

export default function HeaderDropdown({ isOpen, onClose, user }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // 로그아웃 처리 함수
  function handleLogout() {
    localStorage.removeItem('accessToken'); // 스토리지 삭제
    localStorage.removeItem('user');
    dispatch(clearAuth()); // 리덕스 상태 초기화
    navigate('/');
    onClose(); // 드롭다운 닫기
  }

  // 마이페이지로 이동
  function ownerMyPage() {
    navigate('/owners/mypage');
    onClose();
  }

  function cleanerMyPage() {
    navigate('/cleaners/mypage');
    onClose();
  }

  // 드롭다운이 열려있지 않으면 렌더링하지 않음
  if (!isOpen) return null;

  return (
    <>
      {/* 오버레이 - 클릭 시 드롭다운 닫기 */}
      <div className="headerdropdown-overlay" onClick={onClose}></div>

      {/* 드롭다운 메뉴 */}
      <div className="headerdropdown-container">
        {/* 사용자 정보 영역 */}
        <div className="headerdropdown-header">
          <p className="headerdropdown-user-name">{user?.name}님</p>
        </div>

        {/* 메뉴 리스트 */}
        <div className="headerdropdown-menu-list">
          {/* 점주(owner) 메뉴 */}
          {user?.role === 'OWNER' && (
            <>
            <div className="headerdropdown-menu-item" onClick={ownerMyPage}>
              마이페이지
            </div>
            </>
          )}

          {/* 기사님(cleaner) 메뉴 */}
          {user?.role === 'CLEANER' && (
            <>
            <div className="headerdropdown-menu-item" onClick={cleanerMyPage}>
              마이페이지
            </div>
            </>
          )}

          {/* 로그아웃 */}
          <div className="headerdropdown-menu-item headerdropdown-logout" onClick={handleLogout}>
            로그아웃
          </div>
        </div>
      </div>
    </>
  );
}