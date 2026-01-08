/**
 * @file app/services/cleaner/cleaner.profile.repository.js
 * @description 기사님 정보 관련 repository
 * 260108 CK init
 */

import db from "../../models/index.js";
const { Cleaner } = db;

/**
 * 기사 정보 업데이트
 * @param {number} id
 * @param {object} updateData 
 * @param {object} t 
 */
export async function updateCleaner(id, updateData, t = null) {
  // 보안을 위해 업데이트 가능한 필드를 명시적으로 지정
  const allowedUpdates = {};
  if (updateData.name !== undefined) { 
    allowedUpdates.name = updateData.name;
  }
  if (updateData.phone !== undefined) {
    allowedUpdates.phone = updateData.phone;
  }

  // 업데이트할 내용이 없으면 null을 반환합니다.
  if (Object.keys(allowedUpdates).length === 0) {
    return null;
  }

  const [updatedRowsCount] = await Cleaner.update(allowedUpdates, {
    where: { id: id },
    transaction: t, // 트랜잭션 적용
  });

  // 업데이트된 행이 없다면
  if (updatedRowsCount === 0) {
    return null;
  }

  // 업데이트된 기사님 정보를 다시 조회
  const updatedCleaner = await Cleaner.findByPk(id, { transaction: t });
  return updatedCleaner;
}

export default {
  updateCleaner,
}
