/**
 * @file app/repositories/admin/admin.cleaners.repositorie.js
 * @description 관리자 cleaners repositorie
 * 260107 v1.0.0 yh init
 */
import { Op } from 'sequelize';
import db from '../../models/index.js';
const { sequelize, Cleaner, Review } = db;

async function paginationProfiles(t = null, {limit, offset}) {
  return await Cleaner.findAndCountAll(
    {
      attributes: [
        'id', 'phoneNumber', 'name',
        [
          sequelize.literal(`(
            SELECT
              AVG(star)
            FROM reviews
            WHERE
              deleted_at IS NULL
              AND reviews.cleaner_id = Cleaner.id
          )`),
          'avgStar'
        ],
        [
          sequelize.literal(`(
            SELECT
              COUNT(*)
            FROM reservations
            WHERE
              deleted_at IS NULL
              AND reservations.cleaner_id = Cleaner.id
              AND reservations.status = "완료"
          )`),
          'countCompleted'
        ],
      ],
      order: [
        ['name', 'ASC']
      ],
      limit,
      offset,
    },
    {
      transaction: t
    }
  );
}

/**
 * 
 * @param {Sequelize.Transaction} t 
 * @param {{startAt?: string, endAt?: string, isWithdraw?: boolean}} paramWhere 
 * @returns 
 */
async function findCleanersCount(t = null, paramWhere) {
  let where = {};
  let paranoid = true;
  
  // `paramWhere`이 없으면 총 집계이므로 paranoid false
  if(!paramWhere) {
    paranoid = false;
  }

  if(paramWhere?.startAt) {
    where.createdAt = { [Op.gte]: paramWhere?.startAt };
  }

  if(paramWhere?.endAt) {
    where.createdAt = { [Op.lte]: paramWhere?.endAt };
  }

  if(paramWhere?.isWithdraw) {
    paranoid = false;
    where.deletedAt = { [Op.not]: null };
  }

  return await Cleaner.count(
    {
      where,
      paranoid,
      transaction: t,
    }
  );
}

export default {
  paginationProfiles,
  findCleanersCount,
}