/**
 * @file app/repositories/owner/owner.like.repository.js
 * @description Like Repository
 * 260102 v1.0.0 ck init
 */

import db from '../../models/index.js';
const { Like, Cleaner } = db;

/**
 * 기사님 좋아요 조회
 * @param {number} ownerId 
 * @param {number} cleanerId
 * @returns 
 */
async function findByOwnerIdAndCleanerId(ownerId, cleanerId) {
  return await Like.findOne({
    where: { ownerId, cleanerId },
  });
}

/**
 * 좋아요 기록 생성
 * @param {number} ownerId 
 * @param {number} cleanerId
 * @returns 
 */
async function createLike(ownerId, cleanerId) {
  return await Like.create({ ownerId, cleanerId });
}

/**
 * 좋아요 삭제
 * @param {number} ownerId 
 * @param {number} cleanerId
 * @returns 
 */
async function deleteLike(ownerId, cleanerId) {
  return await Like.destroy({
    where: { ownerId, cleanerId },
  });
}

/**
 * 좋아요 조회
 * @param {number} ownerId 
 * @param {number} cleanerId
 * @returns 
 */
async function findFavoriteCleanersByOwnerId(ownerId, cleanerId) {
  return await Like.findAll({
    where: { ownerId },
    include: [{
      model: Cleaner,
      attributes: ['id', 'name', 'profileImage', 'star'],
      required: true
    }],
    raw: true,
    nest: true,
  }).then(likes => likes.map(like => like.Cleaner));
}

export default {
  findByOwnerIdAndCleanerId,
  createLike,
  deleteLike,
  findFavoriteCleanersByOwnerId,
}