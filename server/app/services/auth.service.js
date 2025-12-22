/**
 * @file app/services/auth.service.js
 * @description auth Service
 * 251222 jae init
 */

import bcrypt from 'bcrypt';
import ownerRepository from '../repositories/owner.repository.js';
import cleanerRepository from '../repositories/cleaner.repository.js';
import adminRepository from '../repositories/admin.repository.js';

/**
 * 점주 로그인 서비스
 * @param {object} body - email, password
 */
async function ownerLogin(body) {
  const { email, password } = body;

  // email로 점주 정보 획득
  const owner = await ownerRepository.findByEmail(null, email);

  // 점주 존재 여부 체크
  if(!result) {
    throw new Error('존재하지 않는 점주입니다.');
  }

  // 비밀번호 체크
  if(!bcrypt.compareSync(password, result.password)) {
    throw new Error('비밀번호가 일치하지 않습니다.');
  }

  return owner;
}

/**
 * 기사 로그인 서비스
 * @param {object} body - email, password 
 */
async function cleanerLogin(body) {
  const { email, password } = body;

  // email로 기사 정보 획득
  const cleaner = await cleanerRepository.findByEmail(null, email);

  // 기사 존재 여부 체크
  if(!result) {
    throw new Error('존재하지 않는 기사입니다.');
  }

  // 비밀번호 체크
  if(!password) {
    throw new Error('비밀번호가 일치하지 않습니다.');
  }

  return cleaner;
}

/**
 * 관리자 로그인 서비스
 * @param {object} body - email, password 
 */
async function adminLogin(body) {
  const { email, password } = body;

  // email로 관리자 정보 획득
  const admin = await adminRepository.findByEmail(null, email);

  // 관리자 존재 여부 체크
  if(!result) {
    throw new Error('존재하지 않는 관리자입니다.');
  }

  // 비밀번호 체크
  if(!password) {
    throw new Error('비밀번호가 일치하지 않습니다.');
  }

  return admin;
}

export default {
  ownerLogin,
  cleanerLogin,
  adminLogin,
}