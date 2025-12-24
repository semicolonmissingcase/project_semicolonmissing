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
    const token = jwtUtil.generateAccessToken(req);
    if (!token) {
      throw myError('인증 토큰이 없습니다.', UNAUTHORIZED_ERROR);
    }

    const claims = jwtUtil.getClaimsWithVerifyToken(token);

    req.user = {
      // TODO 나중에 login 수정 완료 시 변경
      id: 1,
      role: 'owner'
    };
    return next();
  } catch (error) {
    return next(error);
  }
}