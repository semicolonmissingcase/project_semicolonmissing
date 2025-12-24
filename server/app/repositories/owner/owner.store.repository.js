/**
 * @file app/repositories/owner/owner.store.repository.js
 * @description Store Repository
 * 251223 v1.0.0 ck init
 */

import db from '../../models/index.js';
const { Store } = db;

/**
 * 새로운 매장 생성
 * @param {import("sequelize").Transaction | null} t 
 * @param {object} data 
 * @returns {Promise<Store>}
 */
async function createStore(t = null, data) {
  return await Store.create(data, {
    transaction: t
  });
}

export default {
  createStore,
}