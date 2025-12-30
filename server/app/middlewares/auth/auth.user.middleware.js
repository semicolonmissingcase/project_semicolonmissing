/**
 * @file /app/middlewares/auth/owner.middleware.js
 * @description 점주 인증 및 인가 처리 미들웨어
 * 251223 v1.0.0 jae init
 */

import { FORBIDDEN_ERROR, UNAUTHORIZED_ERROR } from "../../../configs/responseCode.config.js";
import myError from "../../errors/customs/my.error.js";
import jwtUtil from "../../utils/jwt/jwt.util.js";
import ROLE_PERMISSIONS from "./configs/role.permissions.js";

// --------------
// Private
// --------------
function authenticate(req) {
  // 1. 토큰 획득 (req에서 토큰을 추출하는 로직이 jwtUtil.getToken(req) 형태라고 가정)
  // 기존 코드에 jwtUtil.generateAccessToken(req)라고 되어있는데, 
  // 검증 시에는 보통 getToken이나 추출 로직이 와야 합니다.
  const token = jwtUtil.extractToken(req);

  if (!token) {
    throw myError('인증 토큰이 없습니다.', UNAUTHORIZED_ERROR);
  }

  // 2. 토큰 검증 및 페이로드 획득
  const claims = jwtUtil.getClaimsWithVerifyToken(token);

  // 3. Request 객체에 사용자 정보를 통합해서 추가 (req.owner -> req.user)
  req.user = {
    id: claims.id || claims.sub,
    role: claims.role // 토큰 생성 시 넣었던 ROLE.OWNER 또는 ROLE.CLEANER
  };
}

/**
 * 권한 규칙 조회 및 체크
 */
function authorize(req) {
  // 경로 정규화 (가장 마지막 '/' 제거)
  const path = req.path.endsWith('/') ? req.path.slice(0, -1) : req.path;
  const fullPath = `${req.baseUrl}${path}`;

  // 요청에 맞는 권한 규칙 조회
  const matchRole = ROLE_PERMISSIONS[req.method]?.find(item => item.path.test(fullPath));

  // 일치하는 규칙이 있을 때만 체크
  if (matchRole) {
    // 1. 인증 정보 셋팅
    authenticate(req);

    // 2. 권한 체크 (req.user.role이 matchRole.roles 배열에 포함되는지 확인)
    const userRole = req.user?.role;
    if (!userRole || !matchRole.roles.includes(userRole)) {
      throw myError('해당 서비스에 대한 권한이 없습니다.', FORBIDDEN_ERROR);
    }
  }
}

// --------------
// public
// --------------
export default function(req, res, next) {
  try {
    authorize(req);
    return next();
  } catch (error) {
    return next(error);
  }
}