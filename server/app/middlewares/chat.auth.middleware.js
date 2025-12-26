/**
 * @file /app/middlewares/chatAuth.middleware.js
 * @description 점주 및 기사 공통 채팅 인증 미들웨어
 * 251224 v1.0.0 seon init
 */
import jwtUtil from "../utils/jwt/jwt.util.js";
import myError from "../errors/customs/my.error.js";
import { UNAUTHORIZED_ERROR } from "../../configs/responseCode.config.js";

export default function(req, res, next) {
  try {
    // 1. 헤더에서 토큰 추출 (Bearer 제외)
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw myError('인증 토큰이 없습니다.', UNAUTHORIZED_ERROR);
    }
    
    const token = authHeader.split(' ')[1];

    // 2. 토큰 검증 및 클레임 추출
    const claims = jwtUtil.getClaimsWithVerifyToken(token);
    
    // 디버깅 로그 (문제가 계속될 경우 터미널 확인용)
    console.log("Token Claims:", claims);

    if (!claims) {
      throw myError('유효하지 않은 토큰입니다.', UNAUTHORIZED_ERROR);
    }

    // 3. req.user 객체 생성
    // claims 내부의 키 이름이 sub인지 id인지 확인 필요
    req.user = {
      id: parseInt(claims.sub || claims.id),
      role: claims.role
    };

    return next();
  } catch (error) {
    console.error("Auth Middleware Error:", error.message);
    return next(error);
  }
}