/**
 * @file /app/middlewares/auth/admin.middleware.js
 * @description 관리자 인증 및 인가 처리 미들웨어
 * 260106 v1.0.0 yh init
 */

import { FORBIDDEN_ERROR, UNAUTHORIZED_ERROR } from "../../../configs/responseCode.config.js";
import myError from "../../errors/customs/my.error.js";
import jwtUtil from "../../utils/jwt/jwt.util.js";
import ROLE from "./configs/role.enum.js";
import ROLE_PERMISSIONS from "./configs/role.permissions.js";

// --------------
// Private
// --------------
/**
 * 토큰 검증 및 Request에 유저 정보 추가
 * @param {import("express").Request} req 
 */
function authenticate(req) {
  // 토큰 획득
  const token = jwtUtil.extractToken(req);

  // 토큰이 없는 경우에 대한 예외 처리
  if(!token) {
    throw myError('인증 토큰이 없습니다.', UNAUTHORIZED_ERROR);
  }

  // 토큰 검증 및 페이로드 획득
  const claims = jwtUtil.getClaimsWithVerifyToken(token);

  const authData = {
    id: parseInt(claims.sub),
    role: claims.role
  };
  // Request 객체에 사용자 정보를 추가
  if(claims.role === ROLE.ADMIN) {
    req.admin = authData;
  } else {
    req.user = authData;
  }
}

function adminAuthorize(req) {
  // 경로 정규화 (가장 마지막 '/' 제거)
  const path = req.path.endsWith('/') ? req.path.slice(0, -1) : req.path;
  const fullPath = `${req.baseUrl}${path}`;

  // 요청에 맞는 권한 규칙 조회
  const matchRole = ROLE_PERMISSIONS[req.method]?.find(item => item.path.test(fullPath));

  // 일치하는 규칙이 있을 때만 체크
  if (matchRole) {
    // 1. 인증 정보 셋팅
    authenticate(req);
    console.log(req.admin, req.user);
    // 2. 권한 체크 (req.user.role이 matchRole.roles 배열에 포함되는지 확인)
    const userRole = req.admin ? req.admin.role : req.user.role;
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
    adminAuthorize(req);

    return next();
  } catch(error) {
    return next(error);
  }
}