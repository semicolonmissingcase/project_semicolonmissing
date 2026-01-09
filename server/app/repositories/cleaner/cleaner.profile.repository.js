/**
 * @file app/services/cleaner/cleaner.profile.repository.js
 * @description 기사님 정보 관련 repository
 * 260108 CK init
 */

import db from "../../models/index.js";
const { Cleaner, Certification, DriverRegion } = db;

// id로 기사 정보 찾기
async function findById(id) {
  return await Cleaner.findByPk(id);
}

/**
 * 기사 정보 업데이트
 * @param {number} id
 * @param {object} updateData 
 * @param {object} t 
 */
async function updateCleaner(id, updateData, t = null) {
  // 보안을 위해 업데이트 가능한 필드를 명시적으로 지정
  const allowedUpdates = {};
  if (updateData.name !== undefined) { 
    allowedUpdates.name = updateData.name;
  }
  if (updateData.phoneNumber !== undefined) {
    allowedUpdates.phoneNumber = updateData.phoneNumber;
  }

  if (updateData.password !== undefined) {
    allowedUpdates.password = updateData.password;
  }

  // 업데이트할 내용이 없으면 null을 반환합니다.
  if (Object.keys(allowedUpdates).length === 0) {
    return null;
  }

  await Cleaner.update(allowedUpdates, {
    where: { id: id },
    transaction: t,
  });

  const updatedCleaner = await Cleaner.findByPk(id, { transaction: t });

  return updatedCleaner;
}

/**
 * 기사님의 모든 자격증 정보 삭제
 * @param {number} cleanerId 
 * @param {object} t 
 */
async function deleteCertificationsByCleanerId(cleanerId, t) {
  return await Certification.destroy({
    where: { cleanerId: cleanerId },
    transaction: t,
  });
}

/**
 * 새로운 자격증 정보 생성
 * @param {Array<object>} certifications
 * @param {object} t 
 */
async function createCertifications(certifications, t) {
  return await Certification.bulkCreate(certifications, { transaction: t });
}

/**
 * 기사님의 모든 작업 지역 정보 삭제
 * @param {number} cleanerId 
 * @param {object} t 
 */
async function deleteDriverRegionsByCleanerId(cleanerId, t) {
  return await DriverRegion.destroy({
    where: { cleanerId: cleanerId },
    transaction: t,
  });
}

/**
 * 새로운 작업 지역 정보들 생성
 * @param {Array<object>} regions
 * @param {object} t 
 */
async function createDriverRegions(regions, t) {
  return await DriverRegion.bulkCreate(regions, { transaction: t });
}

export default {
  findById,
  updateCleaner,
  deleteCertificationsByCleanerId,
  createCertifications,
  deleteDriverRegionsByCleanerId,
  createDriverRegions,
}