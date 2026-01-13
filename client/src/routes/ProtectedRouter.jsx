import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import { reissueThunk } from "../store/thunks/authThunk.js";
import { adminReissueThunk } from "../store/thunks/adminAuthThunk.js";

const ROLE = { ADMIN: 'ADMIN', OWNER: 'OWNER', CLEANER: 'CLEANER' };
const { ADMIN, OWNER, CLEANER } = ROLE;

const AUTH_REQUIRED_ROUTES = [
  { path: /^\/owners/, roles: [OWNER, ADMIN] },
  { path: /^\/cleaners/, roles: [CLEANER, ADMIN] },
  { path: /^\/hospital/, roles: [ADMIN] },
];

// 1. 로그인 없이도 접근 가능한 경로 리스트 (정규식 추가)
const PUBLIC_ROUTES = [/^\/qnaposts/]; 

export default function ProtectedRouter() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  const authState = useSelector(state => state.auth);
  const adminAuthState = useSelector(state => state.adminAuth);
  const isAdminPath = location.pathname.startsWith('/hospital');

  // 2. 현재 경로가 Public 경로인지 확인
  const isPublicPage = PUBLIC_ROUTES.some(route => route.test(location.pathname));

  useEffect(() => {
    async function checkAuth() {
      // 로그인 페이지나 문의 페이지(/qnaposts)는 재발급 없이 즉시 통과
      if (isPublicPage || location.pathname === '/login' || location.pathname === '/hospital/login') {
        setIsAuthChecked(true);
        return;
      }
      try {
        if (isAdminPath) {
          await dispatch(adminReissueThunk()).unwrap();
        } else {
          await dispatch(reissueThunk()).unwrap();
        }
      } catch(error) {
        console.error("인증 갱신 실패", error);
      } finally {
        setIsAuthChecked(true);
      }
    }
    checkAuth();
  }, [location.pathname, isPublicPage]); // 의존성 추가

  if (!isAuthChecked) return null;

  // 3. [핵심] 로그인 하지 않은 유저도 Public 페이지는 볼 수 있도록 먼저 리턴
  if (isPublicPage) {
    return <Outlet />;
  }

  const isLoggedIn = authState.isLoggedIn || adminAuthState.isLoggedIn;
  const currentUserRole = adminAuthState.admin?.role || authState.user?.role;

  if (!isLoggedIn) {
    if (location.pathname === '/login' || location.pathname === '/hospital/login') {
      return <Outlet />;
    }
    alert('로그인이 필요한 서비스입니다.');
    return <Navigate to={isAdminPath ? "/hospital/login" : "/login"} replace />;
  }

  // 4. 권한 규칙 매칭 (기존 로직 유지)
  const matchRole = AUTH_REQUIRED_ROUTES.find(item => item.path.test(location.pathname));

  if (matchRole) {
    if (!currentUserRole || !matchRole.roles.includes(currentUserRole)) {
      alert(`접근 권한이 없습니다. (현재 권한: ${currentUserRole || '없음'})`);
      
      if (window.history.length > 1) {
        navigate(-1);
      } else {
        navigate(adminAuthState.isLoggedIn ? "/hospital" : "/", { replace: true });
      }
      return null;
    }
  }

  return <Outlet />;
}