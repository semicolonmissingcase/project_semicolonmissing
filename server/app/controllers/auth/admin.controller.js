/**
 * @file app/controllers/auth/cleaner.controller.js
 * @description 기사 인증 관련 컨트롤러
 * 251225 v1.0.0 jae init
 */

import { REISSUE_ERROR, SUCCESS } from "../../../configs/responseCode.config.js";
import myError from "../../errors/customs/my.error.js";
import adminService from "../../services/auth/admin.service.js";
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
async function adminLogin(req, res, next) {
  try {
    const body = req.body;

    // 기사 로그인 서비스 호출 
    const { accessToken, refreshToken, cleaner } = await adminService.adminLogin(body);
    
    // Cookie에 RefreshToken 설정
    cookieUtil.setCookieRefreshToken(res, refreshToken);

    return res.status(SUCCESS.status).send(createBaseResponse(SUCCESS, {accessToken, cleaner}));
  } catch(error) {
    next(error);
  }
}

async function reissue(req, res, next) {
  try{
    const token = cookieUtil.getCookieRefreshToken(req);

    // 토큰 존재 여부 확인
    if(!token) {
      throw myError('리프래시 토큰 없음', REISSUE_ERROR);
    }

    // 토큰 재발급 처리
    const { accessToken, refreshToken, admin } = await adminService.reissue(token);

    // 쿠키에 리프래시 토큰 설정
    cookieUtil.setCookieRefreshToken(res, refreshToken);

    return res.status(SUCCESS.status).send(createBaseResponse(SUCCESS, {accessToken, admin }))
  } catch(error) {
    next(error);
  }
}

// ------------
// export 
// ------------
export const adminController = {
  adminLogin,
  reissue,
};