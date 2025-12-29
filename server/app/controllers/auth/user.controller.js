/**
 * @file app/controllers/auth/owner.controller.js
 * @description 인증 관련 컨트롤러
 * 251222 v1.0.0 jae init
 */

import { REISSUE_ERROR, SUCCESS } from "../../../configs/responseCode.config.js";
import myError from "../../errors/customs/my.error.js";
import PROVIDER from "../../middlewares/auth/configs/provider.enum.js";
import userService from "../../services/auth/user.service.js";
import cookieUtil from "../../utils/cookie/cookie.util.js";
import { createBaseResponse } from "../../utils/createBaseResponse.util.js";
import socialKakaoUtil from "../../utils/social/social.kakao.util.js";

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
    const { accessToken, refreshToken, user } = await userService.login(body);
    
    // Cookie에 RefreshToken 설정
    cookieUtil.setCookieRefreshToken(res, refreshToken);
    cookieUtil.setCookieAccessToken(res, accessToken);

    return res.status(SUCCESS.status).send(createBaseResponse(SUCCESS, { user }));
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
    // 💡 변경: req.user가 없더라도 에러를 내지 않고 쿠키만 지우고 응답합니다.
    const userId = req.user?.id; 

    if (userId) {
      await userService.logout(userId);
    }

    // DB 처리 여부와 상관없이 브라우저의 쿠키는 무조건 지웁니다.
    cookieUtil.clearCookieRefreshToken(res);
    cookieUtil.clearCookieAccessToken(res);

    return res.status(200).send(createBaseResponse(SUCCESS));
  } catch (error) {
    next(error);
  }
}

/**
 * 토큰 재발급 컨트롤러 처리
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

    // 토큰 재발급 시에도 점주/기사 통합 처리가 필요함
    const { accessToken, refreshToken, user } = await userService.reissue(token);

    // 쿠키에 리프래시 토큰 설정
    cookieUtil.setCookieRefreshToken(res, refreshToken);
    cookieUtil.setCookieAccessToken(res, accessToken);

    return res.status(SUCCESS.status).send(createBaseResponse(SUCCESS, { user }))
  } catch(error) {
    next(error);
  }
}

/**
 * 소셜 로그인 컨트롤러 처리
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 * @param {import("express").NextFunction} next 
 * @returns 
 */
async function social(req, res, next) {
  try {
    const provider = req.params.provider.toUpperCase();
    let url = '';

    switch(provider) {
      case PROVIDER.KAKAO:
        url = socialKakaoUtil.getAuthorizeURL();
        break;
    }

    return res.redirect(url);
  } catch (error) {
    next(error);
  }
}

async function socialCallback(req, res, next) {
  try {
    const provider = req.params.provider.toUpperCase();
    let code = req.query?.code;

   // 서비스 호출 (result에는 가입여부와 유저 정보가 담김)
   const result = await userService.socialKakao(code);

    // 가입되지 않은 신규 유저인 경우
    if (!result.isRegistered) {
      const { email, nick, profile }= result.kakaoInfo;

      // env에 설정한 추가 정보 입력 페이지로 리다이렉트 
      const extraInfoUrl = `${process.env.SOCIAL_CLIENT_EXTRA_INFO_URL}?email=${email}&nick=${encodeURIComponent(nick)}&profile=${profile}`;
      return res.redirect(extraInfoUrl);
    }   

    // 3. 기존 유저인 경우 (로그인 처리)
    cookieUtil.setCookieRefreshToken(res, result.refreshToken);
   
    // 이 함수가 실행되면 브라우저 쿠키에 'accessToken'이라는 이름을 저장
    cookieUtil.setCookieAccessToken(res, result.accessToken);

    const redirectUrl = `${process.env.SOCIAL_CLIENT_CALLBACK_URL}`;

    return res.redirect(redirectUrl);

  } catch(error) {
    next(error);
  }
}

// 2. 최종 회원가입 처리 함수
async function completeSignup(req, res, next) {
  try {
    const signupData = req.body;

    // 서비스의 최종 가입 로직 호출
    const result = await userService.completeSocialSignup(signupData);

    // 가입 완료 후 발급된 리프레시 토큰을 쿠키에 저장
    cookieUtil.setCookieRefreshToken(res, result.refreshToken);
    cookieUtil.setCookieAccessToken(res, result.accessToken);

    // 프론트엔드에 성공 응답 (액세스 토큰 전달)
    return res.status(200).json({
      success: true,
      user: result.user
    });
  } catch (error) {
    next(error);
  }
}

/**
 * 내 정보 조회 컨트롤러 (새로고침 시 로그인 유지용)
 */
async function getMe(req, res, next) {
  try {
    // 1. 미들웨어에서 넘겨준 유저 정보 추출
    const { id, role } = req.user;

    // 2. [확인] 여기서 userService.logout(id)가 절대 호출되면 안 됩니다!
    // 오직 정보를 가져오는 userService.getMe(id, role)만 호출해야 합니다.
    const user = await userService.getMe(id, role); 

    // 3. 성공 응답 (기존 SUCCESS 변수와 createBaseResponse 함수 사용)
    return res.status(200).send(createBaseResponse(SUCCESS, { user }));
  } catch (error) {
    console.error("getMe 컨트롤러 에러 발생:", error);
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
  social,
  socialCallback,
  completeSignup,
  getMe,
};