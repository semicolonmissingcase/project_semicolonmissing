/**
 * @file app/repositories/admin/admin.owners.repositorie.js
 * @description 관리자 owners repositorie
 * 260110 v1.0.0 jae init
 */
import { Op } from 'sequelize';
import db from '../../models/index.js';
const { sequelize, Owner, Store } = db;

async function ownerPaginationProfiles(t = null, { limit, offset }) {
  return await Owner.findAndCountAll(
    {
      attributes: [
        'id', 
        'name', 
        'phoneNumber', 
        'provider', // 가입 경로 (KAKAO, NAVER 등)
        [
          // 운영 매장 수 서브쿼리
          sequelize.literal(`(
            SELECT COUNT(*)
            FROM stores
            WHERE stores.owner_id = Owner.id
              AND stores.deleted_at IS NULL
          )`),
          'storeCount'
        ],
      ],
      order: [['name', 'ASC']],
      limit,
      offset,
    },
    { transaction: t }
  );
}

/**
 * 점주 수 집계
 */
async function findOwnersCount(t = null, paramWhere) {
  let where = {};
  let paranoid = true;
  
  if (!paramWhere) {
    paranoid = false;
  }

  if (paramWhere?.startAt) {
    where.createdAt = { [Op.gte]: paramWhere.startAt };
  }

  if (paramWhere?.endAt) {
    where.createdAt = { [Op.lte]: paramWhere.endAt };
  }

  if (paramWhere?.isWithdraw) {
    paranoid = false;
    where.deletedAt = { [Op.not]: null };
  }

  return await Owner.count({
    where,
    paranoid,
    transaction: t,
  });
}

export default {
  ownerPaginationProfiles,
  findOwnersCount,
}