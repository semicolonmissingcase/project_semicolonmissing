/**
 * @file app/services/cleaner/cleaner.profile.service.js
 * @description 기사님 정보 관련 Service
 * 260108 CK init
 */

import cleanerProfileRepository from '../../repositories/cleaner/cleaner.profile.repository.js';

/**
 * 기사 정보 수정 
 */
async function updateCleaner(id, role, updateData) {
  const updatedCleaner = await cleanerProfileRepository.updateCleaner(id, updateData);

  if(!updatedCleaner) {
    throw new Error("정보를 찾을 수 없습니다.");
  }

  return updatedCleaner;
}

export default {
  updateCleaner,
}