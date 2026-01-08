import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
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

/**
 * 
 * @returns 
 */
export default function ProtectedRouter() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  const authState = useSelector(state => state.auth);
  const adminAuthState = useSelector(state => state.adminAuth);
  const isAdminPath = location.pathname.startsWith('/hospital');

  useEffect(() => {
    async function checkAuth() {
      if (location === '/login' || location.pathname === '/hospital/login') {
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
  }, []);


  if (!isAuthChecked) return null;

  const isLoggedIn = authState.isLoggedIn || adminAuthState.isLoggedIn;
  const currentUserRole = adminAuthState.admin?.role || authState.user?.role;

  if (!isLoggedIn) {
    if (location.pathname === '/login' || location.pathname === '/hospital/login') {
      return <Outlet />;
    }
    alert('로그인이 필요한 서비스입니다.');
    return <Navigate to={isAdminPath ? "/hospital/login" : "/login"} replace />;
  }


  // 2. 권한 규칙 매칭
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