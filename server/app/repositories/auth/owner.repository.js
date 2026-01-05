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
 * @returns {Promise<import("../../models.js").Owner>}
 */
async function save(t = null, owner) {
  return await owner.save({transaction: t});
}

/**
 * 점주id로 점주정보 조회
 * @param {import("sequelize").Transaction} t 
 * @param {number} id 
 * @returns {Promise<import("../../models/Owner.js").Owner>}
 */
async function findByPk(t = null, id) {
  return await Owner.findByPk(id, { transaction: t});
}

async function create(t = null, data) {
  return await Owner.create(data, {transaction: t});
}

async function logout(t = null, id) {
  return await Owner.update(
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

/**
 * ID로 점주 정보 수정
 * @param {import("sequelize").Transaction | null} t 
 * @param {number} id 
 * @param {object} data 
 * @returns 
 */
async function updateById(t = null, id, data) {
  return await Owner.update(data, 
    {
      where: { id },
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
  updateById,
}