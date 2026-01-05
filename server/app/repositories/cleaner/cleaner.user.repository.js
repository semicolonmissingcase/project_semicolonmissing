/**
 * @file app/repositories/cleaner/cleaner.account.repository.js
 * @description cleaner user Repository
 * 251230 yh init
 */

import db from "../../models/index.js";
const { Cleaner } = db;


/**
 * 이메일로 유저 검색
 * @param {import("sequelize").Transaction} t 
 * @param {string} email 
 * @returns {Promise<import("../models/User.js").User>}
 */
async function findByEmail(t = null, email) {
  // SELECT * FROM users WHERE email = ? AND deleted_at IS NULL;
  return await Cleaner.findOne({
  attributes: ["id", "email"],
  where: { email },
  transaction: t
});
}

async function create(t = null, data) {
  return await Cleaner.create(data, { transaction: t });
}

export default {
  findByEmail,
  create
};