import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import { reissueThunk } from "../store/thunks/authThunk.js";
import { adminReissueThunk } from "../store/thunks/adminAuthThunk.js";

const ROLE = { ADMIN: 'ADMIN', OWNER: 'OWNER', CLEANER: 'CLEANER' };
const { ADMIN, OWNER, CLEANER } = ROLE;

/**
 * @description 특정 권한이 필요한 경로 설정
 */
const AUTH_REQUIRED_ROUTES = [
  { path: /^\/owners/, roles: [OWNER, ADMIN] },
  { path: /^\/cleaners/, roles: [CLEANER, ADMIN] },
  { path: /^\/hospital/, roles: [ADMIN] },
];

/**
 * @description 로그인 여부와 상관없이 누구나 접근 가능한 경로
 */
const PUBLIC_ROUTES = [/^\/qnaposts/];

export default function ProtectedRouter() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  const authState = useSelector(state => state.auth);
  const adminAuthState = useSelector(state => state.adminAuth);
  
  // 관리자 전용 경로인지 확인
  const isAdminPath = location.pathname.startsWith('/hospital');

  // 1. 현재 경로가 '누구나 볼 수 있는 페이지'인지 확인
  const isPublicPage = PUBLIC_ROUTES.some(route => route.test(location.pathname));

  useEffect(() => {
    async function checkAuth() {
      // 로그인, 회원가입 관련 경로는 재발급 로직을 건너뜀
      const isGuestRoute = [
        '/login', 
        '/registration', 
        '/hospital/login'
      ].includes(location.pathname);

      if (isPublicPage || isGuestRoute) {
        setIsAuthChecked(true);
        return;
      }

      try {
        if (isAdminPath) {
          await dispatch(adminReissueThunk()).unwrap();
        } else {
          await dispatch(reissueThunk()).unwrap();
        }
      } catch (error) {
        console.error("인증 확인 실패:", error);
      } finally {
        setIsAuthChecked(true);
      }
    }
    checkAuth();
  }, [location.pathname, isPublicPage, isAdminPath, dispatch]);

  // 인증 확인(토큰 재발급 등)이 끝나기 전에는 아무것도 렌더링하지 않음
  if (!isAuthChecked) return null;

  // 2. [Public 페이지 처리] 로그인 안 해도 볼 수 있는 페이지라면 즉시 통과
  if (isPublicPage) {
    return <Outlet />;
  }

  const isLoggedIn = authState.isLoggedIn || adminAuthState.isLoggedIn;
  const currentUserRole = adminAuthState.admin?.role || authState.user?.role;

  // 3. [비로그인 유저 처리] 로그인이 안 된 경우
  if (!isLoggedIn) {
    // 현재 경로가 로그인 페이지라면 해당 페이지를 보여줌
    if (['/login', '/hospital/login'].includes(location.pathname)) {
      return <Outlet />;
    }
    // 로그인이 필요한 페이지에 비로그인으로 접근 시 리다이렉트
    return <Navigate to={isAdminPath ? "/hospital/login" : "/login"} replace />;
  }

  // 4. [권한 매칭 및 체크] 로그인된 유저가 현재 경로에 접근할 권한이 있는지 확인
  const matchRole = AUTH_REQUIRED_ROUTES.find(item => item.path.test(location.pathname));

  if (matchRole) {
    // 권한 정보가 없거나, 허용된 역할 리스트에 현재 사용자 역할이 없는 경우
    if (!currentUserRole || !matchRole.roles.includes(currentUserRole)) {
      alert(`접근 권한이 없습니다. (현재 권한: ${currentUserRole || '없음'})`);
      
      // 무한 루프 방지를 위해 안전한 경로로 이동
      const fallbackPath = adminAuthState.isLoggedIn ? "/hospital" : "/";
      navigate(fallbackPath, { replace: true });
      return null;
    }
  }

  // 모든 검증 통과 시 하위 컴포넌트 렌더링
  return <Outlet />;
}