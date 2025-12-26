/**
 * @file app/services/owner/owner.user.service.js
 * @description owner 회원가입 Service
 * 251223 CK init
 */

import { CONFLICT_ERROR } from "../../../configs/responseCode.config.js";
import ownerStoreRepository from "../../repositories/owner/owner.store.repository.js";
import ownerUserRepository from "../../repositories/owner/owner.user.repository.js";
import ownerRepository from "../../repositories/auth/owner.repository.js";
import cleanerRepository from "../../repositories/auth/cleaner.repository.js"
import db from "../../models/index.js";
import myError from "../../errors/customs/my.error.js";
import bcrypt from 'bcrypt';

/**
 * 회원가입처리
 * @param {object} data 
 * @returns {Promise<object>} 생성된 점주 정보
 */
async function store(data) {
  const {
    name, 
    gender, 
    email, 
    password, 
    phone, 
    storeName, 
    storePhone, 
    address, 
    addressDetail 
  } = data;
  
  // 트랜잭션 시작
  const result = await db.sequelize.transaction(async t => {
    // 가입 점주인지 조회
    const owner = await ownerRepository.findByEmail(t, email);
  
    // 중복 유저 처리
    if(owner) {
      throw myError('중복된 이메일입니다.', CONFLICT_ERROR);
    }

    // 가입 기사님인지 조회
    const cleaner = await cleanerRepository.findByEmail(t, email);

    // 중복 유저 처리
    if(cleaner) { 
      throw myError('이미 기사님으로 가입된 이메일입니다.', CONFLICT_ERROR)
    }

    // 비밀번호 암호화
    const hashedPassword = await bcrypt.hash(password, 10);

    // owner데이터 준비 및 생성
    const createdOwner = await ownerUserRepository.create(t, {
      name: name,
      gender: gender === 'male' ? 'M' : 'F',
      email: email,
      password: hashedPassword,
      provider: 'NONE',
      phoneNumber: phone,
    });

    // 매장 필수 아님
    if (storeName) {
      // 매장 주소 데이터 주소 가공
      const addressParts = address.split(' ');
      const addr1 = addressParts[0] || null; // 시/도
      const addr2 = addressParts.slice(1).join(' ') || null // 시/군/구/읍/면/동
      const addr3 = addressDetail || null; // 상세주소
  
      // 매장 데이터 준비 및 생성
      await ownerStoreRepository.create(t, {
        ownerId: createdOwner.id,
        name: storeName,
        phoneNumber: storePhone,
        addr1: addr1,
        addr2: addr2,
        addr3: addr3,
      });
    }

    // 생성된 점주 정보 반환
    return createdOwner;
  });

  // 트랜잭션 반환
  return result.toJSON();
}

export default {
  store,
}