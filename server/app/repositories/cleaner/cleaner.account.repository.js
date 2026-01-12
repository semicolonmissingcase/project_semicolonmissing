
import db from '../../models/index.js';
const { sequelize, BankCode } = db;

//  조회 
async function findAllByCleanerId(cleanerId) {
  
  return await db.CleanerAccount.findAll({
    where: { 
      cleanerId: cleanerId,
      deletedAt: null // 삭제된 데이터 제외
    },
    include: [
      {
        model: BankCode,
        as: 'bank',
        required: true,
        attributes: ['name'],
      }
    ],
  });
}

// findOneByCleanerId
async function findOneByCleanerId(cleanerId, t = null) {
  return await db.CleanerAccount.findOne({
    where: { cleanerId },
    order: [
      ['isDefault', 'DESC'],
      ['createdAt', 'DESC']
    ],
    transaction: t
  });
}

//  저장 
async function create(accountData, t = null) {
  return await db.CleanerAccount.create(accountData, {
    transaction: t
  });
}

//  수정 
async function update(id, updateData, t = null) {
  return await db.CleanerAccount.update(updateData, {
    where: { id },
    transaction: t
  });
}

//  삭제 
async function deleteById(cleanerId, t = null) {
  return await db.CleanerAccount.destroy({
    where: { cleanerId },
    transaction: t
  });
}

async function resetDefaultStatus(cleanerId, t = null) {
  return await db.CleanerAccount.update(
    { isDefault: false },
    {
      where: { cleanerId, isDefault: true },
      transaction: t
    }
  );
}

export default {
  findAllByCleanerId,
  findOneByCleanerId,
  create,
  update,
  deleteById,
  resetDefaultStatus
};