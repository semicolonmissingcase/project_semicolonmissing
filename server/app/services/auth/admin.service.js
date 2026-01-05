/**
 * @file app/services/auth/admin.service.js
 * @description auth Service
 * 251222 jae init
 */

import bcrypt from 'bcrypt';
import adminRepository from '../../repositories/auth/admin.repository.js';
import myError from '../../errors/customs/my.error.js';
import { NOT_REGISTERED_ERROR } from '../../../configs/responseCode.config.js';
import jwtUtil from '../../utils/jwt/jwt.util.js';
import db from '../../models/index.js';

/**
 * 관리사 로그인 
 * @param {{email: string, password: string}} body 
 * @returns {Promisecimport("../models/Admin.js").Admin}
 */
async function adminLogin(body) {
  // 트랜잭션 처리
  // return await db.sequelize.transaction(async t => {
  //  비지니스 로직 작성...
  //  })

  // 트랜잭션 처리
  return await db.sequelize.transaction(async t => {
    const { email, password } = body;

    // email로 관리자 정보 획득
    const admin = await adminRepository.findByEmail(t, email);

    // 관리자 존재 여부 체크
    if(!admin) {
      throw myError('관리자 미존재', NOT_REGISTERED_ERROR);
    }

    // 비밀번호 체크 
    if(!bcrypt.compareSync(password, admin.password)) {
      throw myError('비밀번호 틀림', NOT_REGISTERED_ERROR);
    }

    admin.role = 'ADMIN';

    // JWT 생성(accessToken, refreshToken)
    const accessToken = jwtUtil.generateAccessToken(admin);
    const refreshToken = jwtUtil.generateRefreshToken(admin);

    // refreshToken 저장
    admin.refreshToken = refreshToken;
    await adminRepository.save(t, admin);

    return {
      accessToken,
      refreshToken,
      admin
    }
  });
}

/**
 * 로그아웃 처리
 * @param {number} id - 유저id
 */
async function logout(id) {
  return await adminRepository.logout(null, id);
}


/**
 * 토큰 재발급 처리
 * @param {string} token 
 */
async function reissue(token) {
  // 토큰 검증 및 점주id 획득
  const claims = jwtUtil.getClaimsWithVerifyToken(token);
  const adminId = claims.sub;

  return await db.sequelize.transaction(async t => {
    // 관리자 정보 획득
    const admin = await adminRepository.findByPk(t, adminId);

    // 토큰 일치 검증
    if(token !== admin.refreshToken) {
      throw myError('리프래시 토큰 불일치', REISSUE_ERROR);
    }

    // JWT 생성
    const accessToken = jwtUtil.generateAccessToken(admin);
    const refreshToken = jwtUtil.generateRefreshToken(admin);

    // 리프래시 토큰 DB에 저장
    admin.refreshToken = refreshToken;
    await adminRepository.save(t, admin);

    return {
      accessToken,
      refreshToken,
      admin,
    }
  });
} 

export default {
  adminLogin,
  logout,
  reissue,
}