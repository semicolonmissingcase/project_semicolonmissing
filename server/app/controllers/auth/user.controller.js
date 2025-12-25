/**
 * @file app/controllers/auth/owner.controller.js
 * @description 인증 관련 컨트롤러
 * 251222 v1.0.0 jae init
 */

import { REISSUE_ERROR, SUCCESS } from "../../../configs/responseCode.config.js";
import myError from "../../errors/customs/my.error.js";
import userService from "../../services/auth/user.service.js";
import cookieUtil from "../../utils/cookie/cookie.util.js";
import { createBaseResponse } from "../../utils/createBaseResponse.util.js";

// ------------------
// -----public-------
// ------------------
/**
 * 유저 로그인 컨틀로러 처리
 * @param {import("express").Request} req - Request 객체
 * @param {import("express").Response} res - Response 객체
 * @param {import("express").NextFunction} next - NextFunction 객체
 */
async function login(req, res, next) {
  try {
    const body = req.body;

    // 로그인 서비스 호출
    const { accessToken, refreshToken, user }= await userService.login(body);
    
    // Cookie에 RefreshToken 설정
    cookieUtil.setCookieRefreshToken(res, refreshToken);

    return res.status(SUCCESS.status).send(createBaseResponse(SUCCESS, {accessToken, user}));
  } catch(error) {
    next(error);
  }
}

/**
 * 로그아웃 컨트롤러 처리
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 * @param {import("express").NextFunction} next 
 */
async function logout(req, res, next) {
  try {
    const id = req.user.id;

    // 로그아웃 서비스 호출
    await userService.logout(id);

    // cookie에 refreshToken 만료
    cookieUtil.clearCookieRefreshToken(res);

    return res.status(SUCCESS.status).send(createBaseResponse(SUCCESS))
  } catch (error) {
    return next(error);
  }
}

async function reissue(req, res, next) {
  try{
    const token = cookieUtil.getCookieRefreshToken(req);

    // 토큰 존재 여부 확인
    if(!token) {
      throw myError('리프래시 토큰 없음', REISSUE_ERROR);
    }

    // 토큰 재발급 시에도 점주/기사 통합 처리가 필요함
    const { accessToken, refreshToken, user } = await userService.reissue(token);

    // 쿠키에 리프래시 토큰 설정
    cookieUtil.setCookieRefreshToken(res, refreshToken);

    return res.status(SUCCESS.status).send(createBaseResponse(SUCCESS, {accessToken, user }))
  } catch(error) {
    next(error);
  }
}

// ------------
// export 
// ------------
export const userController = {
  login,
  logout,
  reissue,
};