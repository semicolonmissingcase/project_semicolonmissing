/**
 * @file app/repositories/owner/owner.like.repository.js
 * @description Like Repository
 * 260102 v1.0.0 ck init
 */

import { Sequelize } from 'sequelize';
import db from '../../models/index.js';
const { Like, Cleaner, Location, DriverRegion } = db;

/**
 * 기사님 ID로 좋아요 조회
 * @param {number} ownerId 
 * @param {number} cleanerId
 * @returns 
 */
async function findByOwnerIdAndCleanerId(ownerId, cleanerId) {
  return await Like.findOne({
    where: { ownerId, cleanerId },
  })
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
 * 점주가 좋아요한 기사님 조회
 * @param {number} ownerId 
 * @returns 
 */
async function findFavoriteCleanersByOwnerId(ownerId) {
  const likes = await Like.findAll({
    where: { ownerId },
    include: [{
      model: Cleaner,
      as: 'cleaner',
      attributes: [
        'id', 
        'name', 
        'profile', 
        'introduction',
        [
          Sequelize.literal(`(
            SELECT COALESCE(AVG(star), 0)
            FROM reviews
            WHERE reviews.cleaner_id = cleaner.id
          )`),
          'star'
        ]
      ],
      include: [
        {
          model: Location,
          as: 'locations',
          attributes: ['city', 'district'],
          through: { model: DriverRegion, attributes: [] },
        }
      ],
      required: true
    }],
  })
  return likes.map(like => {
    const cleanerData = like.cleaner.get({ plain: true });
    cleanerData.regions = cleanerData.locations?.map(loc => `${loc.city} ${loc.district}`) || [];
    return cleanerData;
  });
}

export default {
  findByOwnerIdAndCleanerId,
  createLike,
  deleteLike,
  findFavoriteCleanersByOwnerId,
}