/**
 * @file app/repositories/owner/owner.user.repository.js
 * @description Owner Repository
 * 251223 v1.0.0 ck init
 */

import db from '../../models/index.js';
const { Owner } = db;

/**
 * 새로운 점주 생성
 * @param {import("sequelize").Transaction | null} t 
 * @param {object} date 
 * @returns {Promise<Owner>}
 */
async function create(t = null, data) {
  return await Owner.create(data, {
    transaction: t
  });
}

async function updateProfile(t = null, ownerId, updateData) {
  console.log('--- 4. 리포지토리 함수 실행 ---');
  console.log('ownerId:', ownerId);
  console.log('updateData:', updateData);
  return await Owner.update(updateData, 
  {
    where: {
      id: ownerId
    },
    transaction: t,
  });
}

export default {
  create,
  updateProfile
};