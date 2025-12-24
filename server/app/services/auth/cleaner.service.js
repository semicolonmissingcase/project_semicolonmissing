/**
 * @file app/services/auth/cleaner.service.js
 * @description auth Service
 * 251223 jae init
 */

import bcrypt from 'bcrypt';
import cleanerRepository from '../../repositories/auth/cleaner.repository.js';
import myError from '../../errors/customs/my.error.js';
import { NOT_REGISTERED_ERROR } from '../../../configs/responseCode.config.js';
import jwtUtil from '../../utils/jwt/jwt.util.js';
import db from '../../models/index.js';

/**
 * 기사 로그인 
 * @param {{email: string, password: string}} body 
 * @returns {Promisecimport("../models/Cleaner.js").Cleaner}
 */
async function cleanerLogin(body) {
  // 트랜잭션 처리
  // return await db.sequelize.transaction(async t => {
  //  비지니스 로직 작성...
  //  })

  // 트랜잭션 처리
  return await db.sequelize.transaction(async t => {
    const { email, password } = body;

    // email로 점주 정보 획득
    const cleaner = await cleanerRepository.findByEmail(t, email);

    // 점주 존재 여부 체크
    if(!cleaner) {
      throw myError('점주 미존재', NOT_REGISTERED_ERROR);
    }

    // 비밀번호 체크 
    if(!bcrypt.compareSync(password, cleaner.password)) {
      throw myError('비밀번호 틀림', NOT_REGISTERED_ERROR);
    }

    // JWT 생성(accessToken, refreshToken)
    const accessToken = jwtUtil.generateAccessToken(cleaner);
    const refreshToken = jwtUtil.generateRefreshToken(cleaner);

    // refreshToken 저장
    cleaner.refreshToken = refreshToken;
    await cleanerRepository.save(t, cleaner);

    return {
      accessToken,
      refreshToken,
      cleaner,
    }
  });
}

/**
 * 토큰 재발급 처리
 * @param {string} token 
 */
async function reissue(token) {
  // 토큰 검증 및 점주id 획득
  const claims = jwtUtil.getClaimsWithVerifyToken(token);
  const cleanerId = claims.sub;

  return await db.sequelize.transaction(async t => {
    // 유저 정보 획득
    const cleaner = await cleanerRepository.findByPk(t, cleanerId);

    // 토큰 일치 검증
    if(token !== cleaner.refreshToken) {
      throw myError('리프래시 토큰 불일치', REISSUE_ERROR);
    }

    // JWT 생성
    const accessToken = jwtUtil.generateAccessToken(cleaner);
    const refreshToken = jwtUtil.generateRefreshToken(cleaner);

    // 리프래시 토큰 DB에 저장
    cleaner.refreshToken = refreshToken;
    await cleanerRepository.save(t, cleaner);

    return {
      accessToken,
      refreshToken,
      cleaner,
    }
  });
} 

export default {
  cleanerLogin,
  reissue,
}