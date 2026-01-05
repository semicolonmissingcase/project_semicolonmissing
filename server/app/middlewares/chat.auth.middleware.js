/**
 * @file /app/middlewares/chatAuth.middleware.js
 * @description 점주 및 기사 공통 채팅 인증 미들웨어 (쿠키 방식)
 * 251226 seon init
 */
import jwtUtil from "../utils/jwt/jwt.util.js";
import myError from "../errors/customs/my.error.js";
import { UNAUTHORIZED_ERROR } from "../../configs/responseCode.config.js";

export default function(req, res, next) {
  try {
    const token = req.cookies.accessToken;

    if (!token) {
      console.warn("❌ [Auth] 쿠키에 accessToken이 없습니다.");
      throw myError('인증 토큰이 없습니다.', UNAUTHORIZED_ERROR);
    }

    // 2. 토큰 검증 및 클레임 추출
    const claims = jwtUtil.getClaimsWithVerifyToken(token);
    
    if (!claims) {
      throw myError('유효하지 않은 토큰입니다.', UNAUTHORIZED_ERROR);
    }

    // 3. req.user 객체 생성
    req.user = {
      id: parseInt(claims.sub || claims.id),
      role: claims.role
    };

    return next();
  } catch (error) {
    console.error("❌ Auth Middleware Error:", error.message);
    return res.status(401).json({
      success: false,
      message: error.message || '인증에 실패하였습니다.'
    });
  }
}