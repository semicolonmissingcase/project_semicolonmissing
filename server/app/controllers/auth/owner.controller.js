/**
 * @file app/controllers/auth/owner.controller.js
 * @description 점주 인증 관련 컨트롤러
 * 251222 v1.0.0 jae init
 */

import { REISSUE_ERROR, SUCCESS } from "../../../configs/responseCode.config.js";
import myError from "../../errors/customs/my.error.js";
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

    return res.status(SUCCESS.status).send(createBaseResponse(SUCCESS, {accessToken, owner}));
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
    const { accessToken, refreshToken, owner } = await ownerService.reissue(token);

    // 쿠키에 리프래시 토큰 설정
    cookieUtil.setCookieRefreshToken(res, refreshToken);

    return res.status(SUCCESS.status).send(createBaseResponse(SUCCESS, {accessToken, owner }))
  } catch(error) {
    next(error);
  }
}

// ------------
// export 
// ------------
export const ownerController = {
  ownerLogin,
  reissue,
};