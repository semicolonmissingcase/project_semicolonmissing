/**
 * @file app/services/cleaner/cleaner.profile.service.js
 * @description 기사님 정보 관련 Service
 * 260108 CK init
 */

import { INVALID_PASSWORD, NOT_FOUND_ERROR } from '../../../configs/responseCode.config.js';
import { createBaseResponse } from '../../utils/createBaseResponse.util.js';
import cleanerProfileRepository from '../../repositories/cleaner/cleaner.profile.repository.js';
import bcrypt from "bcrypt";

/**
 * 기사 정보 수정 
 */
async function updateCleaner(id, role, updateData) {
  if(updateData.password) {
    console.log("비밀번호 해싱 로직을 여기에 구현해야 합니다."); // TODO: 실제 해싱 로직으로 대체
  }

  const updatedCleaner = await cleanerProfileRepository.updateCleaner(id, updateData);

  if(!updatedCleaner) {
    throw new Error("정보를 찾을 수 없습니다.");
  }

  return updatedCleaner;
}

/**
 * 기사 비밀번호 변경
 * @param {number} id 
 * @param {string} currentPassword 
 * @param {string} newPassword 
 */
async function changePassword(id, currentPassword, newPassword) {
  // db에서 정보 가져오기
  const cleaner = await cleanerProfileRepository.findById(id);
  if(!cleaner) {
    throw createBaseResponse(NOT_FOUND_ERROR, '사용자를 찾을 수 없습니다.');
  }

  // 현재 비밀번호 비교
  const isPasswordCorrect = await bcrypt.compare(currentPassword, cleaner.password);

  if(!isPasswordCorrect) {
    const error = new Error('현재 비밀번호가 일치하지 않습니다.');
    error.codeInfo = AUTH_ERROR.INVALID_PASSWORD;
    throw error;
  }

  // 새 비밀번호 해싱
  const saltRounds = 10;

  const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

  // 비밀번호 db에 업뎃
  await cleanerProfileRepository.updateCleaner(id, { password: hashedPassword });
}

export default {
  updateCleaner,
  changePassword,
}