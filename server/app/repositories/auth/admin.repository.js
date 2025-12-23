/**
 * @file app/repositories/admin.repository.js
 * @description Admin Repository
 * 251222 v1.0.0 jae init
 */

import db from '../../models/index.js';
const { Admin } = db;

/**
 * 이메일로 관리자 검색
 * @param {import("sequelize").Transaction} t 
 * @param {string} email 
 * @returns 
 */
async function findByEmail(t = null, email) {
  // SELECT = FROM cleaners WHERE email = ? AND deleted_at IS NULL;
  return await Admin.findOne(
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
 * 관리자 모델 인스턴스로 save 처리
 * @param {import("sequelize").Transaction} t 
 * @param {import("../../models/index.js").Admin} admin 
 * @returns {Promise<import("../../models/Admin.js").Admin>}
 */
async function save(t = null, admin) {
  return await admin.save({transaction: t});
}

export default {
  findByEmail,
  save,
}