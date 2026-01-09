/**
 * @file app/services/cleaner/cleaner.profile.repository.js
 * @description 기사님 정보 관련 repository
 * 260108 CK init
 */

import db from "../../models/index.js";
const { Cleaner } = db;

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

export default {
  findById,
  updateCleaner,
}