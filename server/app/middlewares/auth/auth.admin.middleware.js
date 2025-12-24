/**
 * @file /app/middlewares/auth/admin.middleware.js
 * @description 관리자 인증 및 인가 처리 미들웨어
 * 251223 v1.0.0 jae init
 */

import { FORBIDDEN_ERROR } from "../../../configs/responseCode.config.js";
import myError from "../../errors/customs/my.error.js";
import jwtUtil from "../../utils/jwt/jwt.util.js";
import ROLE_PERMISSIONS from "./configs/role.permissions.js";

// --------------
// Private
// --------------
/**
 * 토큰 검증 및 Request에 유저 정보 추가
 * @param {import("express").Request} req 
 */
function adminAuthenticate(req) {
  // 토큰 획득
  const token = jwtUtil.generateAccessToken(req);

  // 토큰 검증 및 페이로드 획득
  const claims = jwtUtil.getClaimsWithVerifyToken(token);

  // Request 객체에 사용자 정보를 추가
  req.admin = {
    id: parseInt(claims.sub),
    role: claims.role
  }
}

function adminAuthorize(req) {
  // 요청에 맞는 권한 규칙 조회
  const matchRole = ROLE_PERMISSIONS[req.method].find(item => {
    
    // express는 경우에 따라 가장 마지막에 `/`를 붙이는 경우도 있어서, 그럴 경우 가장 마지막 `/`제거 
    const path = req.path.endswith('/') ? req.path.slice(0, -1) : req.path;
    return item.path.test(`${req.baseUrl}${req.path}`);
  });

  // 일치하는 규칙이 있을 시, 인증 및 권한 체크를 실시
  if(matchRole) {
    // 인증 체크 및 인증 정보를 Request 셋
    adminAuthenticate(req);

    // 권한 체크
    const adminRole = req.owner?.role;
    if(!adminRole || !matchRole.roles.includes(adminRole)) {
      throw myError('권한 부족', FORBIDDEN_ERROR);
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