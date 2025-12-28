/**
 * @file app/services/auth/owner.service.js
 * @description auth Service
 * 251222 jae init
 */

import axios from 'axios';
import bcrypt from 'bcrypt';
import ROLE from '../../middlewares/auth/configs/role.enum.js'
import ownerRepository from '../../repositories/auth/owner.repository.js';
import cleanerRepository from '../../repositories/auth/cleaner.repository.js';
import myError from '../../errors/customs/my.error.js';
import { NOT_REGISTERED_ERROR, REISSUE_ERROR } from '../../../configs/responseCode.config.js';
import jwtUtil from '../../utils/jwt/jwt.util.js';
import db from '../../models/index.js';
import socialKakaoUtil from '../../utils/social/social.kakao.util.js';
import { header } from 'express-validator';
import PROVIDER from '../../middlewares/auth/configs/provider.enum.js';

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
    const userResponse = user.toJSON();

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

async function socialKakao(code) {
 try {
  // 1. 토큰 획득 요청 
  const tokenRequest = socialKakaoUtil.getTokenRequest(code);
  const resultToken = await axios.post(
    process.env.SOCIAL_KAKAO_API_URL_TOKEN,
    tokenRequest.searchParams,
    { headers: tokenRequest.headers}
  );
  const { access_token } = resultToken.data;

  const userRequst = socialKakaoUtil.getUserRequest(access_token);
  const resultUser = await axios.get(
    process.env.SOCIAL_KAKAO_API_URL_USER_INFO,
    { headers: userRequst.headers}
  );

  const kakaoAccount = resultUser.data.kakao_account;
  const email = resultUser.data.kakao_account.email;
  const profile = resultUser.data.kakao_account.profile.thumbnail_image_url;
  const nick = resultUser.data.kakao_account.profile.nickname;

  if (!email) {
    throw myError('카카오 계정에 이메일 정보가 없습니다.', NOT_REGISTERED_ERROR);
  }

  // 2. 양쪽 Repository에서 유저 찾기
    let user = await ownerRepository.findByEmail(null, email);
    let currentRole = ROLE.OWNER;

    if(!user) {
      // 점주에 없으면 기사 테이블로 조회
      user = await cleanerRepository.findByEmail(null, email);
      currentRole = ROLE.CLEANER;
    }

  // 3. 신규 유저인 경우
  if(!user) {
    return {
      isRegistered: false, // 아직 우리 DB에 점주/기사로 등록 안 됨
      kakaoInfo: { email, profile, nick, provider: PROVIDER.KAKAO }
    };
  }

  // 4. 기존 유저인 경우 (로그인 처리)
  const result = await db.sequelize.transaction(async t => {
    const payloadData = { id: user.id, role: currentRole };
    const accessToken = jwtUtil.generateAccessToken(payloadData);
    const refreshToken = jwtUtil.generateRefreshToken(payloadData);

    // DB에 저장된 리프레시 토큰 업데이트 
    user.refreshToken = refreshToken;

    // sequelize 객체의 메서드 사용(reissue 코드 스타일 반영)
    await user.save({transaction: t});

    const userResponse = user.toJSON();
    userResponse.role = currentRole;

    return {
      isRegistered: true,
      accessToken,
      refreshToken,
      user: userResponse
    };
  });
  
  return result;
} catch (error) {
    // 🔥 이 부분이 핵심입니다! 터미널에 찍히는 내용을 확인하세요.
    if (error.response) {
      console.error("===== 카카오 API 에러 상세 =====");
      console.error("상태 코드:", error.response.status); // 401
      console.error("에러 내용:", error.response.data);   // 여기에 KOE320 같은 코드가 찍힙니다.
      console.error("================================");
    } else {
      console.error("일반 에러 발생:", error.message);
    }
    throw error; // 에러를 다시 던져서 컨트롤러에서도 알 수 있게 합니다.
  }
}

async function completeSocialSignup(signupData) {
  // 프론트에서 넘어온 데이터 구조 분해
  const { 
    role, email, nick, profile, provider,
    phoneNumber, // 카카오가 안 줘서 새로 입력받은 번호
    storeName, storePhone, storeAddress, // 점주용 추가 정보
    regions // 기사용 추가 정보 (배열 형태 예상)
  } = signupData;
  
  return await db.sequelize.transaction(async t => {
    let newUser;
 
    // 공통 데이터 설정 
    const commonData = {
      email,
      nick, // 사용자가 수정한 닉네임
      profile,
      phoneNumber,
      provider,
      password: bcrypt.hashSync(crypto.randomUUID(), 10) // 소셜 유저는 랜덤 비번 
    };

    // 1. 역할(role)에 따라 분기 저장
    if (role === ROLE.OWNER) {
      // 점주 테이블 저장
      newUser = await ownerRepository.create(t, {
        ...commonData,
        storeName: storeName || null,
        storePhone: storePhone || null,
        storeAddress: storeAddress || null,
      });
    } else if (role === ROLE.CLEANER) {
      // 기사 테이블 저장 
      if (!regions || regions.length === 0) {
        throw myError('활동 지역을 최소 1개 이상 선택해주세요')
      }
      
      newUser = await cleanerRepository.create(t, {
        ...commonData,
        regions: JSON.stringify(regions), 
      });
    }
    
    // 2. 가입 완료 후 즉시 로그인을 위한 토큰 생성(reissu 로직과 동일)
    const payloadData = { id:newUser.id, role: role };
    const accessToken = jwtUtil.generateAccessToken(payloadData);
    const refreshToken = jwtUtil.generateRefreshToken(payloadData);

    // 3. 리프레시 토큰 DB 저장
    newUser.refreshToken = refreshToken;
    await newUser.save({transaction: t});

    // 4. 결과 반환
    const userResponse = newUser.toJSON();
    userResponse.role = role;

    return {
      accessToken,
      refreshToken,
      user: userResponse
    };
  });
}

export default {
  login,
  logout,
  reissue,
  socialKakao,
  completeSocialSignup,
}