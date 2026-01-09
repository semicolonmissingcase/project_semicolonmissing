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
/**
 * 기사 정보 수정 (확장)
 */
async function updateCleaner(id, role, updateData, files) {
  const t = await db.sequelize.transaction(); // 트랜잭션 시작

  try {
    const cleanerUpdateData = { ...updateData };

    // 프로필 이미지 처리
    if (files && files.profileImage) {
      const newPath = files.profileImage[0].path;      
      cleanerUpdateData.profile = newPath;
    }

    // 기본 정보 업데이트 
    await cleanerProfileRepository.updateCleaner(id, cleanerUpdateData, t);

    // 자격증 처리
    if (files && files.certificateFiles) {
      const newCertificates = files.certificateFiles.map(file => ({
        cleanerId: id,
        path: file.path,
      }));

      // 기존 자격증 DB에서 삭제 후 새로 추가
      await cleanerProfileRepository.deleteCertificationsByCleanerId(id, t);
      await cleanerProfileRepository.createCertifications(newCertificates, t);
    }

    // 작업 지역 처리
    if (updateData.regions) {
      const regionIds = JSON.parse(updateData.regions); // 프론트에서 '[1,2,3]' 형태의 JSON 문자열로 보냈다고 가정
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

    // 롤백 후 업로드된 파일이 있다면 삭제
    if (files) {
      if (files.profileImage) {
        await fs.unlink(files.profileImage[0].path).catch(err => console.error("임시 프로필 파일 삭제 실패:", err));
      }
      if (files.certificateFiles) {
        for (const file of files.certificateFiles) {
          await fs.unlink(file.path).catch(err => console.error("임시 자격증 파일 삭제 실패:", err));
        }
      }
    }

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

export default {
  updateCleaner,
  changePassword,
}