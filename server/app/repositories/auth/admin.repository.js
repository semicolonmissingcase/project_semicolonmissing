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

/**
 * 관리자id로 관리자정보 조회
 * @param {import("sequelize").Transaction} t 
 * @param {number} id 
 * @returns {Promise<import("../../models/Admin.js").Admin>}
 */
async function findByPk(t = null, id) {
  return await Admin.findByPk(id, { transaction: t});
}

async function create(t = null, data) {
  return await Admin.create(data, {transaction: t});
}

async function logout(t = null, id) {
  return await Admin.update(
    {
      refreshToken: null
    },
    {
      where: {
        id: id
      },
      transaction: t
    }
  );
}

export default {
  findByEmail,
  save,
  findByPk,
  create,
  logout,
}