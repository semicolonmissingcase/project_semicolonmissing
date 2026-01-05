/**
 * @file app/controllers/auth/admin.controller.js
 * @description 관리자 인증 관련 컨트롤러
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
 * 관리자 로그인 컨틀로러 처리
 * @param {import("express").Request} req - Request 객체
 * @param {import("express").Response} res - Response 객체
 * @param {import("express").NextFunction} next - NextFunction 객체
 */
async function adminLogin(req, res, next) {
  try {
    const body = req.body;

    // 관리자 로그인 서비스 호출 
    const { accessToken, refreshToken, admin } = await adminService.adminLogin(body);

    // Cookie에 RefreshToken 과 AccessToken 설정
    cookieUtil.setCookieRefreshToken(res, refreshToken);
    cookieUtil.setCookieAccessToken(res, accessToken);

    return res.status(SUCCESS.status).send(createBaseResponse(SUCCESS, { admin }));
  } catch(error) {
    next(error);
  }
}

/**
 * 로그아웃 컨틀로러 처리
 * @param {import("express").Request} req - Request 객체
 * @param {import("express").Response} res - Response 객체
 * @param {import("express").NextFunction} next - NextFunction 객체
 */
async function adminLogout(req, res, next) {
  try {
    const id = req.admin.id;
    
    // 로그아웃 서비스 호출 
    await adminService.logout(id);

    // cookie에 refreshToken 만료
    cookieUtil.clearCookieRefreshToken(res);

    return res.status(SUCCESS.status).send(createBaseResponse(SUCCESS))
  } catch (error) {
    return next(error);
  }
}

/**
 * 토큰 재발급 컨틀로러 처리
 * @param {import("express").Request} req - Request 객체
 * @param {import("express").Response} res - Response 객체
 * @param {import("express").NextFunction} next - NextFunction 객체
 */
async function reissue(req, res, next) {
  try{
    const token = cookieUtil.getCookieRefreshToken(req);

    // 토큰 존재 여부 확인
    if(!token) {
      throw myError('리프래시 토큰 없음', REISSUE_ERROR);
    }

    // 토큰 재발급 처리
    const { accessToken, refreshToken, admin } = await adminService.reissue(token);

    // 쿠키에 리프래시 토큰 과 액세스 토큰 설정
    cookieUtil.setCookieRefreshToken(res, refreshToken);
    cookieUtil.setCookieAccessToken(res, accessToken);

    return res.status(SUCCESS.status).send(createBaseResponse(SUCCESS, { admin }))
  } catch(error) {
    next(error);
  }
}

// ------------
// export 
// ------------
export const adminController = {
  adminLogin,
  adminLogout,
  reissue,
};