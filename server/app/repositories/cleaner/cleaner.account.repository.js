/**
 * @file app/repositories/cleaner/cleaner.accounts.repository.js
 * @description cleaner accounts Repository
 * 260107 yh init
 */

import db from "../../models/index.js";
const { CleanerAccount } = db;

/**
 * 기사 ID로 등록된 모든 계좌 목록 조회
 * @param {number} cleanerId 
 * @param {import("sequelize").Transaction} t 
 */
async function findAllByCleanerId(cleanerId, t = null) {
  return await CleanerAccount.findAll({
    where: { cleanerId },
    
    order: [
      ['isDefault', 'DESC'],
      ['createdAt', 'DESC']
    ],
    transaction: t
  });
}

/**
 * 계좌 PK(id)로 단일 계좌 검색
 * @param {number} id 
 * @param {import("sequelize").Transaction} t 
 */
async function findById(id, t = null) {
  return await CleanerAccount.findOne({
    where: { id },
    transaction: t
  });
}

/**
 * 새로운 계좌 등록
 * @param {object} data 
 * @param {import("sequelize").Transaction} t 
 */
async function create(data, t = null) {
  return await CleanerAccount.create(data, { transaction: t });
}

/**
 * 특정 계좌 삭제 (Paranoid 설정으로 인해 soft delete 수행)
 * @param {number} id 
 * @param {import("sequelize").Transaction} t 
 */
async function deleteById(id, t = null) {
  return await CleanerAccount.destroy({
    where: { id },
    transaction: t
  });
}

export default {
  findAllByCleanerId,
  findById,
  create,
  deleteById
};