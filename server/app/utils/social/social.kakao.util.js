/**
 * @file app/utils/social/social.kakao/util.js
 * @description 카카오 소셜 관련 유틸리티
 * 251226 v1.0.0 jae init
 */

import { application } from "express";

function getAuthorizeURL() {
  const params = {
    client_id: process.env.SOCIAL_KAKAO_REST_API_KEY,
    redirect_uri: `${process.env.APP_URL}${process.env.SOCIAL_KAKAO_CALLBACK_URL}`,
    response_type: 'code',
    // prompt: 'login', 
    // 테스트 용이성을 위해서 잠시 지워둠.
  };
  const queryParams = new URLSearchParams(params).toString();

  return `${process.env.SOCIAL_KAKAO_API_URL_AUTHORIZE}?${queryParams}`;
}

function getTokenRequest(code) {
  const headers = {
    'Contetn_Type': 'Content-Type: application/x-www-form-urlencoded;charset=utf-8'
  };

  const params = {
    grant_type: 'authorization_code',
    client_id: process.env.SOCIAL_KAKAO_REST_API_KEY,
    redirect_uri: `${process.env.APP_URL}${process.env.SOCIAL_KAKAO_CALLBACK_URL}`,
    code: code
  }

  const searchParams = new URLSearchParams(params);

  return { headers, searchParams };
}

function getUserRequest(token) {
  const headers = {
    Authorization: `Bearer ${token}`,
    'Content_Type': 'Content-Type: application/x-www-form-urlencoded;charset=utf-8'
  };

  const params = {
    secure_resource: true
};

  const searchParams = new URLSearchParams(params);

  return { headers, searchParams };
}

function getLogoutRequest(id, token) {
  const headers = {
    Authorization: `Bearer ${token}`,
    'Content_Type': 'Content-Type: application/x-www-form-urlencoded;charset=utf-8'
  };

  const params = {
    target_id_type: 'user_id',
    target_id: id
  };

  const searchParams = new URLSearchParams(params);

  return { headers, searchParams }
}

export default {
  getAuthorizeURL,
  getTokenRequest,
  getUserRequest,
  getLogoutRequest
}