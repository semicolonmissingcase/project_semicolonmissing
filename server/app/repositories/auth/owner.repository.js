/**
 * @file app/repositories/owner.repository.js
 * @description Owner Repository
 * 251222 v1.0.0 jae init
 */

import db from '../../models/index.js';
const { Owner } = db;

/**
 * 이메일로 점주 검색
 * @param {import("sequelize").Transaction} t 
 * @param {string} email 
 * @returns 
 */
async function findByEmail(t = null, email) {
  // SELECT = FROM owners WHERE email = ? AND deleted_at IS NULL;
  return await Owner.findOne(
    {
      where: {
        email: email
      }
    },
    {
      transaction: t
    }
  );
}

/**
 * 점주 모델 인스턴스로 save 처리 
 * @param {import("sequelize").Transaction} t 
 * @param {import("../../models/index.js").Owner} owner 
 * @returns 
 */
async function save(t = null, owner) {
  return await owner.save({transaction: t});
}

export default {
  findByEmail,
  save,
}