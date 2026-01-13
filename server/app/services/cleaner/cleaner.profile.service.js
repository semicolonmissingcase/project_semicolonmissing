/**
 * @file app/services/cleaner/cleaner.profile.service.js
 * @description 기사님 정보 관련 Service
 * 260108 CK init
 */

import { INVALID_PASSWORD, NOT_FOUND_ERROR } from '../../../configs/responseCode.config.js';
import { createBaseResponse } from '../../utils/createBaseResponse.util.js';
import cleanerProfileRepository from '../../repositories/cleaner/cleaner.profile.repository.js';
import bcrypt from "bcrypt";
import db from '../../models/index.js';

/**
 * 기사 정보, 프로필 수정
 */
async function updateCleaner(id, role, updateData) {
  const t = await db.sequelize.transaction(); // 트랜잭션 시작

  try {
    const cleanerUpdateData = {};

    if (updateData.name !== undefined) {
      cleanerUpdateData.name = updateData.name;
    }
    
    if (updateData.phone !== undefined) {
      cleanerUpdateData.phone_number = updateData.phone; 
    }

    if (updateData.tagline !== undefined) {
      cleanerUpdateData.introduction = updateData.tagline;
    }
    
    // 프로필 이미지 처리
    if (updateData.profile !== undefined) {
      cleanerUpdateData.profile = updateData.profile;
    }

    // 업데이트할 내용이 있을 때만 DB에 요청
    if (Object.keys(cleanerUpdateData).length > 0) {
      await cleanerProfileRepository.updateCleaner(id, cleanerUpdateData, t);
    }

    // 자격증 처리
    if (updateData.certifications !== undefined) {
      const newCertificates = updateData.certifications.map(certInfo => ({
        cleanerId: id,
        name: certInfo.name,
        image: certInfo.url,
      }));

      // 기존 자격증 DB에서 삭제 후 새로 추가
      await cleanerProfileRepository.deleteCertificationsByCleanerId(id, t);
      await cleanerProfileRepository.createCertifications(newCertificates, t);
    }    

    // 작업 지역 처리
    if (updateData.regions !== undefined) {
      console.log('>> 작업 지역 처리 시작. 전달된 regions:', updateData.regions);
      const regionIds = updateData.regions;
      const newDriverRegions = regionIds.map(locationId => ({
        cleanerId: id,
        locationId: locationId,
      }));

      // 기존 작업 지역 DB에서 삭제 후 새로 추가
      await cleanerProfileRepository.deleteDriverRegionsByCleanerId(id, t);
      await cleanerProfileRepository.createDriverRegions(newDriverRegions, t);
    }

    // 모든 작업이 성공
    await t.commit();
    // 최종적으로 업데이트된 기사 정보를 다시 조회하여 반환
    const updatedCleaner = await cleanerProfileRepository.findById(id);
    return updatedCleaner;
  } catch (error) {
    // 에러 발생 시 트랜잭션 롤백
    await t.rollback();
    // 에러를 상위로 전파
    throw error;
  }
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

/**
 * 기사 상세 프로필 조회
 * @param {number} id 
 * @param {string} currentPassword 
 * @param {string} newPassword 
 */
async function getCleanerProfile(id) {
  const cleaner = await cleanerProfileRepository.findById(id);

  if(!cleaner) {
    throw myError('기사 정보를 찾을 수 없습니다.', NOT_FOUND_ERROR);
  }

  const cleanerResponse = cleaner.toJSON();
  return cleanerResponse;
}

export default {
  updateCleaner,
  changePassword,
  getCleanerProfile,
}