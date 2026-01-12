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

/**
 * 조건에 맞는 모든 매장 조회
 * @param {import("sequelize").Transaction | null} t 
 * @param {object} options 
 * @returns 
 */
async function findAllStores(t = null, options = {}) {
  return await Store.findAll({
    ...options,
    transaction: t
  });
}

/**
 * 조건에 맞는 단일 매장 조회
 * @param {import("sequelize").Transaction | null} t 
 * @param {object} options 
 * @returns 
 */
async function findOneStore(t = null, options = {}) {
  return await Store.findOne({
    ...options,
    transaction: t
  });
}

/**
 * 조건에 맞는 매장 삭제
 * @param {import("sequelize").Transaction | null} t 
 * @param {object} options 
 * @returns 
 */
async function destroyStore(t = null, options = {}) {
  return await Store.destroy({
    ...options,
    transaction: t
  });
}

export default {
  createStore,
  findAllStores,
  findOneStore,
  destroyStore,
}