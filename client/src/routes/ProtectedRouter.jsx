import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { reissueThunk } from "../store/thunks/authThunk.js";
import { adminReissueThunk } from "../store/thunks/adminAuthThunk.js";


const ROLE = { ADMIN: 'ADMIN', OWNER: 'OWNER', CLEANER: 'CLEANER' };
const { ADMIN, OWNER, CLEANER } = ROLE;

/**
 *@description 권한을 부여한 경로
 */
const AUTH_REQUIRED_ROUTES = [
  { path: /^\/owners/, roles: [OWNER, ADMIN] },
  { path: /^\/cleaners/, roles: [CLEANER, ADMIN] },
  { path: /^\/hospital/, roles: [ADMIN] }, 
];

/**
 *@description 로그인한 사람은 접근 불가 (로그인, 회원가입 등)
 */
const GUEST_ONLY_ROUTES = [/^\/login$/, /^\/registration$/, /^\/hospital\/login$/];

export default function ProtectedRouter() {
  const location = useLocation();
  const dispatch = useDispatch();
  
  const [isAuthChecking, setIsAuthChecking] = useState(true);

  const authState = useSelector(state => state.auth);
  const adminAuthState = useSelector(state => state.adminAuth);

  const isAdminPath = location.pathname.startsWith('/hospital') || location.pathname.startsWith('/admin');
  
  const isLoggedIn = authState.isLoggedIn || adminAuthState.isLoggedIn;
  const currentUserRole = adminAuthState.admin?.role || authState.user?.role;

  useEffect(() => {
    let isMounted = true;

    async function verify() {
      if (isLoggedIn) {
        if (isMounted) setIsAuthChecking(false);
        return;
      }

      try {
        if (isAdminPath) {
          await dispatch(adminReissueThunk()).unwrap();
        } else {
          await dispatch(reissueThunk()).unwrap();
        }
      } catch (error) {
        console.error("세션 만료 또는 로그인 정보 없음");
      } finally {
        if (isMounted) setIsAuthChecking(false);
      }
    }

    verify();
    return () => { isMounted = false; };
  }, []);


  if (isAuthChecking) return null;

  // 2. 권한 규칙 매칭
  const matchRole = AUTH_REQUIRED_ROUTES.find(item => item.path.test(location.pathname));

  if (matchRole) {
    if (!isLoggedIn) {
      return <Navigate to={isAdminPath ? "/hospital/login" : "/login"} replace />;
    }

    // [권한 부족 체크]
    if (!currentUserRole || !matchRole.roles.includes(currentUserRole)) {
      alert('접근 권한이 없습니다.');
      // 점주가 관리자 페이지 가려다 걸렸으면 본인 메인으로
      return <Navigate to={isAdminPath ? "/" : "/"} replace />;
    }
  }

  return <Outlet />;
}