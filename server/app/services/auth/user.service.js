/**
 * @file app/services/auth/owner.service.js
 * @description auth Service
 * 251222 jae init
 */

import bcrypt from 'bcrypt';
import ROLE from '../../middlewares/auth/configs/role.enum.js'
import ownerRepository from '../../repositories/auth/owner.repository.js';
import cleanerRepository from '../../repositories/auth/cleaner.repository.js';
import myError from '../../errors/customs/my.error.js';
import { NOT_REGISTERED_ERROR, REISSUE_ERROR } from '../../../configs/responseCode.config.js';
import jwtUtil from '../../utils/jwt/jwt.util.js';
import db from '../../models/index.js';

/**
 * 점주 로그인 
 * @param {{email: string, password: string}} body 
 * @returns {Promisecimport("../models/Owner.js").Owner}
 */
async function login(body) {
  // 트랜잭션 처리
  // return await db.sequelize.transaction(async t => {
  //  비지니스 로직 작성...
  //  })

  // 트랜잭션 처리
  return await db.sequelize.transaction(async t => {
    const { email, password } = body;
    let user = null;
    const payloadData = {
      id: 0,
      role: ROLE.OWNER
    };

    // email로 점주 정보 획득
    user = await ownerRepository.findByEmail(t, email);

    if(!user) {
      // 청소 기사 정보 획득
      user = await cleanerRepository.findByEmail(t, email);
      payloadData.role = ROLE.CLEANER;
    }

    // 점주 존재 여부 체크
    if(!user) {
      throw myError('회원 정보 미존재', NOT_REGISTERED_ERROR);
    }

    // 비밀번호 체크 
    if(!bcrypt.compareSync(password, user.password)) {
      throw myError('비밀번호 틀림', NOT_REGISTERED_ERROR);
    }

    payloadData.id = user.id;

    // JWT 생성(accessToken, refreshToken)
    const accessToken = jwtUtil.generateAccessToken(payloadData);
    const refreshToken = jwtUtil.generateRefreshToken(payloadData);

    // refreshToken 저장
    user.refreshToken = refreshToken;
    await user.save({transaction: t});

    // 8. DB에서 가져온 순수 데이터만 추출 
    const userResponse = user.toJSON();

    // DB에는 없는 'role' 정보를 수동으로 주입 (프론트 권한 체크용)
    userResponse.role = payloadData.role;

    return {
      accessToken,
      refreshToken,
      user,
      user: userResponse,
    }
  });
}

/**
 * 로그아웃 처리
 * @param {*} id 
 * @returns  
 */
async function logout(id) {
  return await db.sequelize.transaction(async t => {
    // 1. 점주 (owner) 테이블에서 먼저 로그아웃 시도
    // [affectedCount] 에서 첫 번째 요소를 구조 분해 할당
    const [owenrAffectedCount] = await ownerRepository.logout(t, id);

    // 2. 점주 테이블에서 업데이트 행이 있다면 성공 반환
    if(owenrAffectedCount > 0) {
      return { success: true, role: ROLE.OWNER};
    }
    
    // 3. 점주가 아니라면 청소 기사(cleaner) 테이블에서 로그아웃 시도
    const [cleanerAffectedCount] = await cleanerRepository.logout(t, id);

    // 4. 청소 기사 테이블에서 업데이트 성공 시 반환
    if (cleanerAffectedCount > 0) {
      return { success: true, role: ROLE.CLEANER};
    }
    // 5. 두 테이블 모두 해당 ID가 없는 경우(에러 처리)
    throw myError('로그아웃 하려는 유저 정보가 존재하지 않습니다.', NOT_REGISTERED_ERROR);
  });
}

/**
 * 토큰 재발급 처리
 * @param {string} token 
 */
async function reissue(token) {
  // 1. 토큰 검증 및 유저id 획득
  const claims = jwtUtil.getClaimsWithVerifyToken(token);
  const userId = claims.id || claims.sub;

  let user = null;
    const payloadData = {
      id: userId,
      role: ROLE.OWNER // 기본값 설정
  };

  return await db.sequelize.transaction(async t => {
    // 2. 점주 테이블에서 유저 찾기
    user = await ownerRepository.findByPk(t, userId);

    if(!user) {
      // 3. 점주가 없다면 청소 기사 테이블에서 찾기
      user = await cleanerRepository.findByPk(t, userId);
      payloadData.role = ROLE.CLEANER // 찾았으니 role을 기사로 변경
    }

    // 4. 어느 테이블에도 유저가 없는 경우
    if (!user) {
      throw myError('유효하지 않은 유저 정보입니다.', REISSUE_ERROR);
    }

    // 5. DB에 저장된 리프레시 토큰과 클라이언트가 보낸 토큰 비교
    if(token !== user.refreshToken) {
      throw myError('리프래시 토큰 불일치', REISSUE_ERROR);
    }

    // 6. JWT 생성
    const accessToken = jwtUtil.generateAccessToken(payloadData);
    const refreshToken = jwtUtil.generateRefreshToken(payloadData);

    // 7. 리프래시 토큰 DB에 저장
    user.refreshToken = refreshToken;
    await user.save({transaction: t});

    // 8. DB에서 가져온 순수 데이터만 추출 
    const userResponse = user.toJson();

    // DB에는 없는 'role' 정보를 수동으로 주입 (프론트 권한 체크용)
    userResponse.role = payloadData.role;

    // 9. 최종 반환 
    return {
      accessToken,
      refreshToken,
      user: userResponse, // 정리된 유저 객체 반환
    }
  });
} 

export default {
  login,
  logout,
  reissue,
}