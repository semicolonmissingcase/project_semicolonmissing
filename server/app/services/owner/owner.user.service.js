/**
 * @file app/services/owner/owner.user.service.js
 * @description owner 회원가입 Service
 * 251223 CK init
 */

import { CONFLICT_ERROR } from "../../../configs/responseCode.config.js";
import ownerStoreRepository from "../../repositories/owner/owner.store.repository.js";
import ownerUserRepository from "../../repositories/owner/owner.user.repository.js";
import ownerRepository from "../../repositories/auth/owner.repository.js";
import cleanerRepository from "../../repositories/auth/cleaner.repository.js";
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
    store
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
    if (store && store.name && store.addr1 && store.addr2  && store.addr3) {
      // 매장 데이터 준비 및 생성
      await ownerStoreRepository.createStore(t, {
        ownerId: createdOwner.id,
        name: store.name,
        phoneNumber: store.phoneNumber || null,
        addr1: store.addr1,
        addr2: store.addr2,
        addr3: store.addr3,
      });
    }

    // 생성된 점주 정보 반환
    return createdOwner;
  });

  // 트랜잭션 반환
  return result.toJSON();
}

/**
 * 점주 통계 조회
 * @param {number} ownerId 
 */
async function getOwnerStats(ownerId) {
  return await ownerUserRepository.getStatsByOwnerId(ownerId);
}

/**
 * 점주 예약 목록 조회
 * @param {number} ownerId 
 */
async function getOwnerReservations(ownerId) {
  return await ownerUserRepository.getReservationsByOwnerId(ownerId);
}

export default {
  store,
  getOwnerStats,
  getOwnerReservations,
}