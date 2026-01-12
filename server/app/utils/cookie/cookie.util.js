/**
 * @file app/utils/cookie/cookie.util.js
 * @description Cookie 유틸리티
 * 251125 v1.0.0 yeon init
 */

import dayjs from 'dayjs';

// -----------------------
// private
// -----------------------
/**
 * 
 * @param {import("express").Response} res 
 * @param {string} cookieName 
 * @param {string} cookieValue 
 * @param {number} ttl 
 * @param {boolean} httpOnlyFlg 
 * @param {boolean} secureFlg 
 * @param {string|null} path
 */
function setCookie(res, cookieName, cookieValue, ttl, httpOnlyFlg = true, secureFlg = true, path = null) {
  const options = {
    expires: dayjs().add(ttl, 'second').toDate(),
    httpOnly: httpOnlyFlg,
    secure: false,
    sameSite:'lax',
  }

  if(path) {
    options.path = path;
  }

  res.cookie(cookieName, cookieValue, options);
}

/**
 * 특정 쿠키 획득(미존재 시, 빈 문자열 반환)
 * @param {import("express").Request} req 
 * @param {string} cookieName
 * @returns {string} 
 */
function getCookie(req, cookieName) {
  let cookieValue = '';

  if(req.cookies) {
    cookieValue = req.cookies[cookieName];
  }

  return cookieValue;
}

/**
 * 쿠키 제거 
 * @param {import("express").Response} res 
 * @param {string} cookieName  
 * @param {boolean} httpOnlyFlg 
 * @param {boolean} secureFlg 
 * @param {string|null} path
 */
function clearCookie(res, cookieName, httpOnlyFlg = true, secureFlg = true, path = null) {
  const options = {
    httpOnly: httpOnlyFlg,
    secure: false,
    sameSite: 'lax',
    path: path || '/'
  };

  if(path) {
    options.path = path;
  }

  res.clearCookie(cookieName, options);
}

// -----------------------
// public
// ------------------------
/**
 * 쿠키에 리프래시 토큰 설정
 * @param {import("express").Response} res 
 * @param {string} refreshToken 
 */
function setCookieRefreshToken(res, refreshToken) {
  setCookie(
    res,
    process.env.JWT_REFRESH_TOKEN_COOKIE_NAME,
    refreshToken,
    parseInt(process.env.JWT_REFRESH_TOKEN_COOKIE_EXPIRY),
    true,
    true,
    '/'
  );
}

/**
 * 특정 쿠키 획득(미존재 시, 빈 문자열 반환)
 * @param {import("express").Request} req
 * @returns {string}
 */
function getCookieRefreshToken(req) {
  return getCookie(req, process.env.JWT_REFRESH_TOKEN_COOKIE_NAME);
}

/**
 * 리프래시 토큰 쿠기 제거
 */
function clearCookieRefreshToken(res) {
  clearCookie(
    res,
    process.env.JWT_REFRESH_TOKEN_COOKIE_NAME,
    true,
    true,
    '/'
  );
}

/**
 * 액세스 ㅌ토큰 쿠키 설정
 * @param {import("express").Response} res 
 * @param {string} accessToken 
 */
function setCookieAccessToken(res, accessToken) {
  setCookie(
    res,
    'accessToken',
    accessToken,
    3600, // 1시간 
    true, // httpOnly
    true, // secure
    '/'   // 모든 경로에서 쿠키 전송
  ); 
}

/**
 * 액세스 토큰 쿠키 제거 
 */
function clearCookieAccessToken(res) {
  clearCookie(res, 'accessToken', true, true, '/');
}

export default {
  setCookieRefreshToken,
  getCookieRefreshToken,
  clearCookieRefreshToken,
  setCookieAccessToken,
  clearCookieAccessToken,
}