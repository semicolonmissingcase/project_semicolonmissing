/**
 * @file app/controllers/auth/owner.controller.js
 * @description 점주 인증 관련 컨트롤러
 * 251222 v1.0.0 jae init
 */

import { SUCCESS } from "../../../configs/responseCode.config.js";
import ownerService from "../../services/auth/owner.service.js";
import cookieUtil from "../../utils/cookie/cookie.util.js";
import { createBaseResponse } from "../../utils/createBaseResponse.util.js";

// ------------------
// -----public-------
// ------------------
/**
 * 점주 로그인 컨틀로러 처리
 * @param {import("express").Request} req - Request 객체
 * @param {import("express").Response} res - Response 객체
 * @param {import("express").NextFunction} next - NextFunction 객체
 */
async function ownerLogin(req, res, next) {
  try {
    const body = req.body;

    // 점주 로그인 서비스 호출 
    const { accessToken, refreshToken, owner } = await ownerService.ownerLogin(body);
    
    // Cookie에 RefreshToken 설정
    cookieUtil.setCookieRefreshToken(res, refreshToken);

    return res.status(SUCCESS.status).send(createBaseResponse(SUCCESS, {accessToken, user}));
  } catch(error) {
    next(error);
  }
}

// ------------
// export 
// ------------
export const ownerController = {
  ownerLogin,
};