/**
 * @file app/repositories/admin/admin.cleaners.repositorie.js
 * @description 관리자 cleaners repositorie
 * 260107 v1.0.0 yh init
 */
import { Op } from 'sequelize';
import db from '../../models/index.js';
const { Cleaner, sequelize } = db;

async function paginationProfiles(t = null, {limit, offset}) {
  return await Cleaner.findAll(
    {
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
  let where = null;
  let paranoid = true;

  if(paramWhere?.startAt) {
    where.createdAt = { [Op.gte]: paramWhere?.startAt };
  }

  if(paramWhere?.endAt) {
    where.createdAt = { [Op.lte]: paramWhere?.endAt };
  }

  if(!paramWhere?.isWithdraw) {
    paranoid = paramWhere?.isWithdraw;
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