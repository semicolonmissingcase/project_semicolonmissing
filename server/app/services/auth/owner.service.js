/**
 * @file app/services/auth/owner.service.js
 * @description auth Service
 * 251222 jae init
 */

import bcrypt from 'bcrypt';
import ownerRepository from '../../repositories/auth/owner.repository.js';
import myError from '../../errors/customs/my.error.js';
import { NOT_REGISTERED_ERROR } from '../../../configs/responseCode.config.js';
import jwtUtil from '../../utils/jwt/jwt.util.js';
import db from '../../models/index.js';

/**
 * 점주 로그인 
 * @param {{email: string, password: string}} body 
 * @returns {Promisecimport("../models/Owner.js").Owner}
 */
async function ownerLogin(body) {
  // 트랜잭션 처리
  // return await db.sequelize.transaction(async t => {
  //  비지니스 로직 작성...
  //  })

  // 트랜잭션 처리
  return await db.sequelize.transaction(async t => {
    const { email, password } = body;

    // email로 점주 정보 획득
    const owner = await ownerRepository.findByEmail(t, email);

    // 점주 존재 여부 체크
    if(!owner) {
      throw myError('점주 미존재', NOT_REGISTERED_ERROR);
    }

    // 비밀번호 체크 
    if(!bcrypt.compareSync(password, owner.password)) {
      throw myError('비밀번호 틀림', NOT_REGISTERED_ERROR);
    }

    // JWT 생성(accessToken, refreshToken)
    const accessToken = jwtUtil.generateAccessToken(owner);
    const refreshToken = jwtUtil.generateRefreshToken(owner);

    // refreshToken 저장
    owner.refreshToken = refreshToken;
    await ownerRepository.save(t, owner);

    return {
      accessToken,
      refreshToken,
      owner,
    }
  });
}

export default {
  ownerLogin,
}