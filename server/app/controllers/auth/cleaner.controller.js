/**
 * @file app/controllers/auth/cleaner.controller.js
 * @description 기사 인증 관련 컨트롤러
 * 251225 v1.0.0 jae init
 */

import { SUCCESS } from "../../../configs/responseCode.config.js";
import cleanerService from "../../services/auth/cleaner.service.js";
import cookieUtil from "../../utils/cookie/cookie.util.js";
import { createBaseResponse } from "../../utils/createBaseResponse.util.js";

// ------------------
// -----public-------
// ------------------
/**
 * 기사 로그인 컨틀로러 처리
 * @param {import("express").Request} req - Request 객체
 * @param {import("express").Response} res - Response 객체
 * @param {import("express").NextFunction} next - NextFunction 객체
 */
async function cleanerLogin(req, res, next) {
  try {
    const body = req.body;

    // 기사 로그인 서비스 호출 
    const { accessToken, refreshToken, cleaner } = await cleanerService.cleanerLogin(body);
    
    // Cookie에 RefreshToken 설정
    cookieUtil.setCookieRefreshToken(res, refreshToken);

    return res.status(SUCCESS.status).send(createBaseResponse(SUCCESS, {accessToken, cleaner}));
  } catch(error) {
    next(error);
  }
}

// ------------
// export 
// ------------
export const cleanerController = {
  cleanerLogin,
};