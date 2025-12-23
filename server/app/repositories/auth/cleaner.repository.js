/**
 * @file app/repositories/cleaner.repository.js
 * @description Cleaner Repository
 * 251222 v1.0.0 jae init
 */

import db from '../../models/index.js';
const { Cleaner } = db;

/**
 * 이메일로 기사 검색
 * @param {import("sequelize").Transaction} t 
 * @param {string} email 
 * @returns 
 */
async function findByEmail(t = null, email) {
  // SELECT = FROM cleaners WHERE email = ? AND deleted_at IS NULL;
  return await Cleaner,findOne(
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
 * 기사 모델 인스턴스로 save 처리
 * @param {import("sequelize").Transaction} t 
 * @param {import("../../models/index.js").Cleaner} cleaner 
 * @returns 
 */
async function save(t = null, cleaner) {
  return await cleaner.save({transaction: t});
}

export default {
  findByEmail,
  save,
}