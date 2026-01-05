import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { reissueThunk } from "../store/thunks/authThunk.js";
import { clearAuth } from "../store/slices/authSlice.js";
import { adminReissueThunk } from "../store/thunks/adminAuthThunk.js";
import { clearAuth as clearAdminAuth } from "../store/slices/adminAuthSlice.js";

const ROLE = { ADMIN: 'ADMIN', OWNER: 'OWNER', CLEANER: 'CLEANER' };
const { ADMIN, OWNER, CLEANER } = ROLE;

const AUTH_REQUIRED_ROUTES = [
  { path: /^\/users\/[0-9]+$/, roles: [CLEANER, OWNER, ADMIN] },
  { path: /^\/hospital/, roles: [ADMIN] }, 
];

const GUEST_ONLY_ROUTES = [/^\/login$/, /^\/registration$/, /^\/admin\/login$/];

export default function ProtectedRouter() {
  const location = useLocation();
  const dispatch = useDispatch();
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  // 현재 경로가 관리자용인지 확인
  const isAdminPath = location.pathname.includes('/hospital') || location.pathname.includes('/admin');

  const authState = useSelector(state => state.auth);
  const adminAuthState = useSelector(state => state.adminAuth);

  // 현재 경로에 맞는 데이터와 액션 설정
  const { isLoggedIn, user, admin } = isAdminPath ? 
    { isLoggedIn: adminAuthState.isLoggedIn, user: adminAuthState.admin } : 
    { isLoggedIn: authState.isLoggedIn, user: authState.user };

  useEffect(() => {
    async function checkAuth() {
      if (!isLoggedIn) {
        try {
          // 4. 관리자 경로면 관리자 전용 재발급 Thunk 실행
          if (isAdminPath) {
            await dispatch(adminReissueThunk()).unwrap();
          } else {
            await dispatch(reissueThunk()).unwrap();
          }
        } catch (error) {
          console.log(error);
          dispatch(isAdminPath ? clearAdminAuth() : clearAuth());
        }
      }
      setIsAuthChecked(true);
    }
    checkAuth();
  }, [isAdminPath]); // 경로 타입이 바뀔 때마다 체크

  if (!isAuthChecked) return <></>;

  const isGuestRoute = GUEST_ONLY_ROUTES.some(regx => regx.test(location.pathname));

  if (isGuestRoute) {
    if (isLoggedIn) return <Navigate to={isAdminPath ? "/hospital/main" : "/"} replace />;
  } else {
    const matchRole = AUTH_REQUIRED_ROUTES.find(item => item.path.test(location.pathname));

    if (matchRole) {
      if (isLoggedIn) {
        if (matchRole.roles.includes(user?.role)) {
          return <Outlet />;
        } else {
          alert('권한이 부족합니다.');
          return <Navigate to="/" replace />;
        }
      } else {
        alert('로그인이 필요한 서비스입니다.');
        const loginPath = isAdminPath ? '/admin/login' : '/login';
        return <Navigate to={loginPath} replace />;
      }
    }
  }

  return <Outlet />;
}